import { Employee, Shift, DayOfWeek, ScheduleConflict, AutoScheduleResult, CareRole } from '../types/omsorg';

export function getDayOfWeekFromDate(dateStr: string): DayOfWeek {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay(); // 0 is Sunday, 1 is Monday ...
  const mapping: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return mapping[day];
}

export function parseMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function checkTimeOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  const a1 = parseMinutes(startA);
  const a2 = parseMinutes(endA);
  const b1 = parseMinutes(startB);
  const b2 = parseMinutes(endB);
  return Math.max(a1, b1) < Math.min(a2, b2);
}

export function calculateEmployeeAllocatedHours(employeeId: string, shifts: Shift[]): number {
  return shifts
    .filter(s => s.employeeId === employeeId && s.status !== 'cancelled')
    .reduce((sum, s) => sum + s.durationHours, 0);
}

// Role compatibility hierarchy (e.g. Nurse can cover assistant shifts if needed, but not vice-versa)
export function isRoleCompatible(employeeRoles: CareRole[], requiredRole: CareRole): boolean {
  if (employeeRoles.includes(requiredRole)) return true;
  if (employeeRoles.includes('Sjuksköterska')) {
    // Registered nurse is qualified for undersköterska and vårdbiträde
    if (requiredRole === 'Undersköterska' || requiredRole === 'Vårdbiträde') return true;
  }
  if (employeeRoles.includes('Undersköterska')) {
    // Undersköterska is qualified for vårdbiträde
    if (requiredRole === 'Vårdbiträde') return true;
  }
  return false;
}

/**
 * Validate a specific shift assignment against constraints
 */
export function validateShiftAssignment(
  shift: Shift,
  employee: Employee,
  allShifts: Shift[]
): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];
  const day = getDayOfWeekFromDate(shift.date);
  const employeeShifts = allShifts.filter(s => s.employeeId === employee.id && s.id !== shift.id && s.status !== 'cancelled');

  // 1. Check max weekly hours limit (e.g. 40h standard)
  const currentHours = employeeShifts.reduce((sum, s) => sum + s.durationHours, 0);
  const newTotalHours = currentHours + shift.durationHours;
  if (newTotalHours > employee.maxHoursPerWeek) {
    conflicts.push({
      shiftId: shift.id,
      employeeId: employee.id,
      type: 'max_hours_exceeded',
      severity: 'error',
      messageSv: `Överskrider maxarbetstid! (${newTotalHours.toFixed(1)}h av max ${employee.maxHoursPerWeek}h/vecka)`,
      messageEn: `Exceeds max weekly hours! (${newTotalHours.toFixed(1)}h of max ${employee.maxHoursPerWeek}h)`
    });
  }

  // 2. Check Role Qualification
  if (!isRoleCompatible(employee.roles, shift.requiredRole)) {
    conflicts.push({
      shiftId: shift.id,
      employeeId: employee.id,
      type: 'role_mismatch',
      severity: 'warning',
      messageSv: `Kompetensavvikelse: Passet kräver ${shift.requiredRole}, men ${employee.name} har (${employee.roles.join(', ')})`,
      messageEn: `Skill mismatch: Shift requires ${shift.requiredRole}, employee has (${employee.roles.join(', ')})`
    });
  }

  // 3. Check Double Booking (Time overlap on the same date)
  const overlappingShift = employeeShifts.find(s => 
    s.date === shift.date && checkTimeOverlap(s.startTime, s.endTime, shift.startTime, shift.endTime)
  );
  if (overlappingShift) {
    conflicts.push({
      shiftId: shift.id,
      employeeId: employee.id,
      type: 'double_booking',
      severity: 'error',
      messageSv: `Dubbelbokning! Krockar med annat pass (${overlappingShift.startTime}-${overlappingShift.endTime})`,
      messageEn: `Double booking! Overlaps with shift (${overlappingShift.startTime}-${overlappingShift.endTime})`
    });
  }

  // 4. Check Availability
  const dayAvail = employee.availability[day];
  if (!dayAvail || !dayAvail.available) {
    conflicts.push({
      shiftId: shift.id,
      employeeId: employee.id,
      type: 'unavailable',
      severity: 'warning',
      messageSv: `${employee.name} är markerad som ej tillgänglig på ${day}`,
      messageEn: `${employee.name} is marked unavailable on ${day}`
    });
  }

  return conflicts;
}

/**
 * Smart Auto-Scheduler Algorithm
 * Assigns unassigned shifts to the best matching employee respecting:
 * 1. Max weekly hours (hard cap, standard 40h)
 * 2. Role requirements
 * 3. Daily availability
 * 4. Overlap prevention
 * 5. Fair workload distribution
 */
export function runAutoScheduler(
  employees: Employee[],
  shifts: Shift[]
): { updatedShifts: Shift[]; result: AutoScheduleResult } {
  const updatedShifts = shifts.map(s => ({ ...s }));
  const activeEmployees = employees.filter(e => e.status === 'active');
  const warnings: string[] = [];
  let assignedCount = 0;

  // Work with unassigned shifts sorted chronologically
  const unassignedShifts = updatedShifts
    .filter(s => !s.employeeId && s.status !== 'cancelled')
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });

  for (const shift of unassignedShifts) {
    const shiftDay = getDayOfWeekFromDate(shift.date);

    // Find all valid candidate employees
    const candidates = activeEmployees.filter(emp => {
      // 1. Must be qualified
      if (!isRoleCompatible(emp.roles, shift.requiredRole)) return false;

      // 2. Must be available on this day
      const avail = emp.availability[shiftDay];
      if (!avail || !avail.available) return false;

      // 3. Must not exceed max weekly hours (e.g. 40h)
      const currentHours = calculateEmployeeAllocatedHours(emp.id, updatedShifts);
      if (currentHours + shift.durationHours > emp.maxHoursPerWeek) return false;

      // 4. Must not have overlapping shift on the same date
      const hasOverlap = updatedShifts.some(s => 
        s.employeeId === emp.id && 
        s.date === shift.date && 
        s.status !== 'cancelled' &&
        checkTimeOverlap(s.startTime, s.endTime, shift.startTime, shift.endTime)
      );
      if (hasOverlap) return false;

      return true;
    });

    if (candidates.length > 0) {
      // Sort candidates by:
      // A. Exact role match priority (e.g. prefer Undersköterska over Sjuksköterska if Undersköterska is requested)
      // B. Lowest current hours (fair work distribution)
      candidates.sort((a, b) => {
        const aExact = a.roles.includes(shift.requiredRole) ? 1 : 0;
        const bExact = b.roles.includes(shift.requiredRole) ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;

        const aHours = calculateEmployeeAllocatedHours(a.id, updatedShifts);
        const bHours = calculateEmployeeAllocatedHours(b.id, updatedShifts);
        return aHours - bHours;
      });

      const selected = candidates[0];
      const targetShift = updatedShifts.find(s => s.id === shift.id);
      if (targetShift) {
        targetShift.employeeId = selected.id;
        targetShift.status = 'assigned';
        assignedCount++;
      }
    } else {
      warnings.push(`Kunde inte tillsätta pass den ${shift.date} (${shift.startTime}-${shift.endTime}, ${shift.requiredRole}): Alla tillgängliga har uppnått sin maxtid (40h) eller saknar behörighet.`);
    }
  }

  const unassignedCount = updatedShifts.filter(s => !s.employeeId && s.status !== 'cancelled').length;

  return {
    updatedShifts,
    result: {
      assignedCount,
      unassignedCount,
      totalShifts: updatedShifts.length,
      warnings
    }
  };
}
