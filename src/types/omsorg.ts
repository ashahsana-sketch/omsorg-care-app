export type CareRole = 
  | 'Undersköterska'
  | 'Vårdbiträde'
  | 'Sjuksköterska'
  | 'Personlig assistent'
  | 'Boendestödjare';

export type DayOfWeek = 
  | 'monday' 
  | 'tuesday' 
  | 'wednesday' 
  | 'thursday' 
  | 'friday' 
  | 'saturday' 
  | 'sunday';

export type ShiftTimeSlot = 'morgon' | 'lunch' | 'kvall' | 'natt';

export interface DayAvailability {
  available: boolean;
  canWorkMorgon?: boolean;
  canWorkLunch?: boolean;
  canWorkKvall?: boolean;
  canWorkNatt?: boolean;
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  maxHoursPerWeek: number; // default 40
  roles: CareRole[];
  hourlyRate: number; // SEK per hour
  bonus: number; // Extra bonus in SEK
  availability: Record<DayOfWeek, DayAvailability>;
  avatarColor: string;
  status: 'active' | 'on_leave' | 'inactive';
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  postalArea: string;
  phone: string;
  requiredRole: CareRole;
  notes: string;
  careLevel: 'Bas' | 'Medel' | 'Hög' | 'Dubbelbemanning';
  doorCode?: string;
  contactPerson?: string;
}

export interface Shift {
  id: string;
  customerId: string;
  employeeId: string | null; // null = unassigned
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationHours: number; // e.g. 3.5
  requiredRole: CareRole;
  timeSlot: ShiftTimeSlot;
  status: 'unassigned' | 'assigned' | 'completed' | 'cancelled';
  bonusModifier?: number; // extra shift bonus in SEK if applicable
  notes?: string;
}

export interface PayslipShiftItem {
  shiftId: string;
  date: string;
  customerName: string;
  location: string;
  timeWindow: string;
  hours: number;
  hourlyRate: number;
  subtotal: number;
}

export interface EmployeePayroll {
  employee: Employee;
  periodName: string;
  startDate: string;
  endDate: string;
  shifts: PayslipShiftItem[];
  totalHours: number;
  maxHoursPerWeek: number;
  isOverLimit: boolean;
  hourlyRate: number;
  basePay: number; // totalHours * hourlyRate
  bonus: number; // employee.bonus + shift bonus modifiers
  grossPay: number; // basePay + bonus
  taxRatePercent: number; // e.g. 30
  taxDeduction: number;
  netPay: number;
}

export interface ScheduleConflict {
  shiftId: string;
  employeeId: string;
  type: 'max_hours_exceeded' | 'role_mismatch' | 'double_booking' | 'unavailable';
  severity: 'error' | 'warning';
  messageSv: string;
  messageEn: string;
}

export interface AutoScheduleResult {
  assignedCount: number;
  unassignedCount: number;
  totalShifts: number;
  warnings: string[];
}
