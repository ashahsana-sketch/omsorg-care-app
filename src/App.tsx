import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { OmsorgProvider, useOmsorg } from './context/OmsorgContext';
import { Navbar } from './components/layout/Navbar';
import { TabNavigation } from './components/layout/TabNavigation';
import { StatsOverview } from './components/dashboard/StatsOverview';
import { EmployeeList } from './components/employees/EmployeeList';
import { EmployeeModal } from './components/employees/EmployeeModal';
import { CustomerList } from './components/customers/CustomerList';
import { CustomerModal } from './components/customers/CustomerModal';
import { RosterView } from './components/roster/RosterView';
import { ShiftModal } from './components/roster/ShiftModal';
import { PayrollSummary } from './components/payroll/PayrollSummary';
import { PayslipModal } from './components/payroll/PayslipModal';
import { Employee, Customer, Shift, EmployeePayroll } from './types/omsorg';

const MainApp: React.FC = () => {
  const { 
    activeTab, 
    addEmployee, 
    updateEmployee, 
    addCustomer, 
    updateCustomer, 
    addShift, 
    updateShift,
    getEmployeePayrolls
  } = useOmsorg();

  // Employee Modal state
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Customer Modal state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Shift Modal state
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [shiftDefaultCustomer, setShiftDefaultCustomer] = useState<Customer | null>(null);
  const [shiftDefaultDate, setShiftDefaultDate] = useState<string | undefined>(undefined);

  // Direct Payslip Modal state from Employee card
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<EmployeePayroll | null>(null);

  // Handlers for Employees
  const handleOpenAddEmployee = () => {
    setEditingEmployee(null);
    setIsEmployeeModalOpen(true);
  };

  const handleOpenEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployee = (data: Omit<Employee, 'id'>) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, data);
    } else {
      addEmployee(data);
    }
  };

  const handleViewEmployeePayslip = (emp: Employee) => {
    const payrolls = getEmployeePayrolls();
    const p = payrolls.find(item => item.employee.id === emp.id);
    if (p) {
      setSelectedPayroll(p);
      setIsPayslipModalOpen(true);
    }
  };

  // Handlers for Customers
  const handleOpenAddCustomer = () => {
    setEditingCustomer(null);
    setIsCustomerModalOpen(true);
  };

  const handleOpenEditCustomer = (cust: Customer) => {
    setEditingCustomer(cust);
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = (data: Omit<Customer, 'id'>) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, data);
    } else {
      addCustomer(data);
    }
  };

  const handleAddShiftForCustomer = (cust: Customer) => {
    setEditingShift(null);
    setShiftDefaultCustomer(cust);
    setShiftDefaultDate(undefined);
    setIsShiftModalOpen(true);
  };

  // Handlers for Shifts
  const handleOpenAddShift = (date?: string) => {
    setEditingShift(null);
    setShiftDefaultCustomer(null);
    setShiftDefaultDate(date);
    setIsShiftModalOpen(true);
  };

  const handleOpenEditShift = (shift: Shift) => {
    setEditingShift(shift);
    setShiftDefaultCustomer(null);
    setIsShiftModalOpen(true);
  };

  const handleSaveShift = (data: Omit<Shift, 'id'>) => {
    if (editingShift) {
      updateShift(editingShift.id, data);
    } else {
      addShift(data);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <TabNavigation />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <StatsOverview
            onOpenEmployeeModal={handleOpenAddEmployee}
            onOpenCustomerModal={handleOpenAddCustomer}
            onOpenShiftModal={() => handleOpenAddShift()}
          />
        )}

        {activeTab === 'employees' && (
          <EmployeeList
            onAddEmployee={handleOpenAddEmployee}
            onEditEmployee={handleOpenEditEmployee}
            onViewPayslip={handleViewEmployeePayslip}
          />
        )}

        {activeTab === 'customers' && (
          <CustomerList
            onAddCustomer={handleOpenAddCustomer}
            onEditCustomer={handleOpenEditCustomer}
            onAddShiftForCustomer={handleAddShiftForCustomer}
          />
        )}

        {activeTab === 'roster' && (
          <RosterView
            onAddShift={handleOpenAddShift}
            onEditShift={handleOpenEditShift}
          />
        )}

        {activeTab === 'payroll' && (
          <PayrollSummary />
        )}
      </main>

      {/* Global Modals */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSave={handleSaveEmployee}
        initialData={editingEmployee}
      />

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
        initialData={editingCustomer}
      />

      <ShiftModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        onSave={handleSaveShift}
        initialData={editingShift}
        defaultCustomer={shiftDefaultCustomer}
        defaultDate={shiftDefaultDate}
      />

      <PayslipModal
        isOpen={isPayslipModalOpen}
        onClose={() => setIsPayslipModalOpen(false)}
        payroll={selectedPayroll}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          OmsorgHub — Svenskt ledningssystem för äldreomsorg, hemtjänst & schemaläggning © 2026
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <OmsorgProvider>
        <MainApp />
      </OmsorgProvider>
    </LanguageProvider>
  );
}

export default App;
