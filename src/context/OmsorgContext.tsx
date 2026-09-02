import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, Customer, Shift, ScheduleConflict, AutoScheduleResult, EmployeePayroll } from '../types/omsorg';
import { initialEmployees, initialCustomers, generateInitialShifts } from '../data/initialData';
import { runAutoScheduler, validateShiftAssignment } from '../utils/scheduler';
import { calculateAllPayrolls } from '../utils/payroll';

interface OmsorgContextType {
  employees: Employee[];
  customers: Customer[];
  shifts: Shift[];
  activeTab: 'dashboard' | 'employees' | 'customers' | 'roster' | 'payroll';
  setActiveTab: (tab: 'dashboard' | 'employees' | 'customers' | 'roster' | 'payroll') => void;
  
  // Employee actions
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  // Customer actions
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Shift actions
  addShift: (shift: Omit<Shift, 'id'>) => void;
  updateShift: (id: string, updates: Partial<Shift>) => void;
  deleteShift: (id: string) => void;
  assignShift: (shiftId: string, employeeId: string | null) => void;
  
  // Automation & Utilities
  autoScheduleShifts: () => AutoScheduleResult;
  resetToSampleData: () => void;
  exportBackupJSON: () => void;
  importBackupJSON: (jsonStr: string) => boolean;
  
  // Computed helpers
  getEmployee: (id: string) => Employee | undefined;
  getCustomer: (id: string) => Customer | undefined;
  getEmployeePayrolls: () => EmployeePayroll[];
  getAllConflicts: () => ScheduleConflict[];
  getShiftConflicts: (shift: Shift) => ScheduleConflict[];
  stats: {
    totalEmployees: number;
    totalCustomers: number;
    totalShifts: number;
    assignedShifts: number;
    unassignedShifts: number;
    totalScheduledHours: number;
    estimatedPayrollGross: number;
  };
}

const STORAGE_KEY_EMPS = 'omsorg_employees_v1';
const STORAGE_KEY_CUSTS = 'omsorg_customers_v1';
const STORAGE_KEY_SHIFTS = 'omsorg_shifts_v1';

const OmsorgContext = createContext<OmsorgContextType | undefined>(undefined);

export const OmsorgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EMPS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialEmployees;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialCustomers;
  });

  const [shifts, setShifts] = useState<Shift[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SHIFTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return generateInitialShifts();
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'customers' | 'roster' | 'payroll'>('dashboard');

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EMPS, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CUSTS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SHIFTS, JSON.stringify(shifts));
  }, [shifts]);

  // Employee actions
  const addEmployee = (newEmpData: Omit<Employee, 'id'>) => {
    const newId = `emp-${Date.now()}`;
    const newEmp: Employee = {
      ...newEmpData,
      id: newId,
      avatarColor: newEmpData.avatarColor || '#0284c7'
    };
    setEmployees(prev => [newEmp, ...prev]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    // Unassign from shifts
    setShifts(prev => prev.map(s => s.employeeId === id ? { ...s, employeeId: null, status: 'unassigned' } : s));
  };

  // Customer actions
  const addCustomer = (newCustData: Omit<Customer, 'id'>) => {
    const newId = `cust-${Date.now()}`;
    const newCust: Customer = { ...newCustData, id: newId };
    setCustomers(prev => [newCust, ...prev]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    setShifts(prev => prev.filter(s => s.customerId !== id));
  };

  // Shift actions
  const addShift = (newShiftData: Omit<Shift, 'id'>) => {
    const newId = `sh-${Date.now()}`;
    const newShift: Shift = {
      ...newShiftData,
      id: newId,
      status: newShiftData.employeeId ? 'assigned' : 'unassigned'
    };
    setShifts(prev => [...prev, newShift]);
  };

  const updateShift = (id: string, updates: Partial<Shift>) => {
    setShifts(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...updates };
        if (updated.employeeId && updated.status === 'unassigned') {
          updated.status = 'assigned';
        } else if (!updated.employeeId && updated.status === 'assigned') {
          updated.status = 'unassigned';
        }
        return updated;
      }
      return s;
    }));
  };

  const deleteShift = (id: string) => {
    setShifts(prev => prev.filter(s => s.id !== id));
  };

  const assignShift = (shiftId: string, employeeId: string | null) => {
    updateShift(shiftId, {
      employeeId,
      status: employeeId ? 'assigned' : 'unassigned'
    });
  };

  // Auto-scheduling
  const autoScheduleShifts = (): AutoScheduleResult => {
    const { updatedShifts, result } = runAutoScheduler(employees, shifts);
    setShifts(updatedShifts);
    return result;
  };

  // Sample data reset
  const resetToSampleData = () => {
    setEmployees(initialEmployees);
    setCustomers(initialCustomers);
    setShifts(generateInitialShifts());
    localStorage.removeItem(STORAGE_KEY_EMPS);
    localStorage.removeItem(STORAGE_KEY_CUSTS);
    localStorage.removeItem(STORAGE_KEY_SHIFTS);
  };

  // Backup export / import
  const exportBackupJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      employees,
      customers,
      shifts
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmsorgHub_Data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackupJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.employees) && Array.isArray(parsed.customers) && Array.isArray(parsed.shifts)) {
        setEmployees(parsed.employees);
        setCustomers(parsed.customers);
        setShifts(parsed.shifts);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  };

  // Helper getters
  const getEmployee = (id: string) => employees.find(e => e.id === id);
  const getCustomer = (id: string) => customers.find(c => c.id === id);

  const getEmployeePayrolls = () => calculateAllPayrolls(employees, shifts, customers);

  const getShiftConflicts = (shift: Shift): ScheduleConflict[] => {
    if (!shift.employeeId) return [];
    const emp = getEmployee(shift.employeeId);
    if (!emp) return [];
    return validateShiftAssignment(shift, emp, shifts);
  };

  const getAllConflicts = (): ScheduleConflict[] => {
    const conflicts: ScheduleConflict[] = [];
    shifts.forEach(shift => {
      if (shift.employeeId && shift.status !== 'cancelled') {
        const emp = getEmployee(shift.employeeId);
        if (emp) {
          const shiftConflicts = validateShiftAssignment(shift, emp, shifts);
          conflicts.push(...shiftConflicts);
        }
      }
    });
    return conflicts;
  };

  // Computed stats
  const totalEmployees = employees.length;
  const totalCustomers = customers.length;
  const totalShifts = shifts.filter(s => s.status !== 'cancelled').length;
  const assignedShifts = shifts.filter(s => s.employeeId && s.status !== 'cancelled').length;
  const unassignedShifts = totalShifts - assignedShifts;
  const totalScheduledHours = shifts
    .filter(s => s.employeeId && s.status !== 'cancelled')
    .reduce((sum, s) => sum + s.durationHours, 0);

  const payrolls = calculateAllPayrolls(employees, shifts, customers);
  const estimatedPayrollGross = payrolls.reduce((sum, p) => sum + p.grossPay, 0);

  return (
    <OmsorgContext.Provider value={{
      employees,
      customers,
      shifts,
      activeTab,
      setActiveTab,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addShift,
      updateShift,
      deleteShift,
      assignShift,
      autoScheduleShifts,
      resetToSampleData,
      exportBackupJSON,
      importBackupJSON,
      getEmployee,
      getCustomer,
      getEmployeePayrolls,
      getAllConflicts,
      getShiftConflicts,
      stats: {
        totalEmployees,
        totalCustomers,
        totalShifts,
        assignedShifts,
        unassignedShifts,
        totalScheduledHours,
        estimatedPayrollGross
      }
    }}>
      {children}
    </OmsorgContext.Provider>
  );
};

export const useOmsorg = () => {
  const context = useContext(OmsorgContext);
  if (!context) {
    throw new Error('useOmsorg must be used within an OmsorgProvider');
  }
  return context;
};
