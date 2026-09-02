import { Employee, Customer, Shift, EmployeePayroll, PayslipShiftItem } from '../types/omsorg';

export function calculateEmployeePayroll(
  employee: Employee,
  shifts: Shift[],
  customers: Customer[],
  periodName = 'Nuvarande schemavecka'
): EmployeePayroll {
  // Find all non-cancelled shifts assigned to this employee
  const employeeShifts = shifts.filter(
    s => s.employeeId === employee.id && s.status !== 'cancelled'
  ).sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

  const custMap = new Map<string, Customer>();
  customers.forEach(c => custMap.set(c.id, c));

  let totalShiftBonus = 0;
  const payslipItems: PayslipShiftItem[] = employeeShifts.map(s => {
    const cust = custMap.get(s.customerId);
    const subtotal = s.durationHours * employee.hourlyRate;
    if (s.bonusModifier) {
      totalShiftBonus += s.bonusModifier;
    }
    return {
      shiftId: s.id,
      date: s.date,
      customerName: cust ? cust.name : 'Okänd brukare',
      location: cust ? `${cust.address}, ${cust.postalArea}` : 'Ej angiven',
      timeWindow: `${s.startTime} - ${s.endTime}`,
      hours: s.durationHours,
      hourlyRate: employee.hourlyRate,
      subtotal
    };
  });

  const totalHours = payslipItems.reduce((sum, item) => sum + item.hours, 0);
  const basePay = totalHours * employee.hourlyRate;
  const totalBonus = (employee.bonus || 0) + totalShiftBonus;
  const grossPay = basePay + totalBonus;
  const taxRatePercent = 30;
  const taxDeduction = Math.round(grossPay * (taxRatePercent / 100));
  const netPay = grossPay - taxDeduction;

  const dates = employeeShifts.map(s => s.date).sort();
  const startDate = dates.length > 0 ? dates[0] : new Date().toISOString().split('T')[0];
  const endDate = dates.length > 0 ? dates[dates.length - 1] : startDate;

  return {
    employee,
    periodName,
    startDate,
    endDate,
    shifts: payslipItems,
    totalHours,
    maxHoursPerWeek: employee.maxHoursPerWeek,
    isOverLimit: totalHours > employee.maxHoursPerWeek,
    hourlyRate: employee.hourlyRate,
    basePay,
    bonus: totalBonus,
    grossPay,
    taxRatePercent,
    taxDeduction,
    netPay
  };
}

export function calculateAllPayrolls(
  employees: Employee[],
  shifts: Shift[],
  customers: Customer[]
): EmployeePayroll[] {
  return employees.map(emp => calculateEmployeePayroll(emp, shifts, customers));
}

export function formatSEK(amount: number): string {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0
  }).format(amount);
}
