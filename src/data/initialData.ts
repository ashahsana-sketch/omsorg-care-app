import { Employee, Customer, Shift, DayOfWeek } from '../types/omsorg';

export const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'Anna Lindberg',
    phone: '070-123 45 67',
    email: 'anna.lindberg@omsorg.se',
    maxHoursPerWeek: 40,
    roles: ['Undersköterska', 'Vårdbiträde'],
    hourlyRate: 195,
    bonus: 1500,
    avatarColor: '#0284c7', // Sky Blue
    status: 'active',
    notes: 'Specialist på demensvård och medicinhantering.',
    availability: {
      monday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
      tuesday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
      wednesday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
      thursday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
      friday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: false },
      saturday: { available: false },
      sunday: { available: false }
    }
  },
  {
    id: 'emp-2',
    name: 'Johan Bergqvist',
    phone: '072-987 65 43',
    email: 'johan.b@omsorg.se',
    maxHoursPerWeek: 40,
    roles: ['Sjuksköterska'],
    hourlyRate: 245,
    bonus: 2000,
    avatarColor: '#059669', // Emerald
    status: 'active',
    notes: 'Legitimerad sjuksköterska. Ansvarig för såromläggning och dosering.',
    availability: {
      monday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
      tuesday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
      wednesday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
      thursday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
      friday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
      saturday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
      sunday: { available: false }
    }
  },
  {
    id: 'emp-3',
    name: 'Fatima Al-Mansoor',
    phone: '073-456 78 90',
    email: 'fatima.m@omsorg.se',
    maxHoursPerWeek: 35,
    roles: ['Undersköterska', 'Personlig assistent'],
    hourlyRate: 190,
    bonus: 1200,
    avatarColor: '#d97706', // Amber
    status: 'active',
    notes: 'Mycket omtyckt hos brukare på Södermalm. Körkort B.',
    availability: {
      monday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
      tuesday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
      wednesday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
      thursday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
      friday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
      saturday: { available: false },
      sunday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true }
    }
  },
  {
    id: 'emp-4',
    name: 'Erik Sundström',
    phone: '076-234 56 78',
    email: 'erik.s@omsorg.se',
    maxHoursPerWeek: 40,
    roles: ['Vårdbiträde'],
    hourlyRate: 175,
    bonus: 1000,
    avatarColor: '#4f46e5', // Indigo
    status: 'active',
    notes: 'Morgonpigg, hjälper gärna till med mathållning och inköp.',
    availability: {
      monday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: false },
      tuesday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: false },
      wednesday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: false },
      thursday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: false },
      friday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: false },
      saturday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
      sunday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true }
    }
  },
  {
    id: 'emp-5',
    name: 'Maria Nilsson',
    phone: '070-876 54 32',
    email: 'maria.nilsson@omsorg.se',
    maxHoursPerWeek: 30,
    roles: ['Personlig assistent', 'Boendestödjare'],
    hourlyRate: 185,
    bonus: 800,
    avatarColor: '#e11d48', // Rose
    status: 'active',
    notes: 'Deltid 75% pga studier. Flexibel på kvällar.',
    availability: {
      monday: { available: true, canWorkMorgon: false, canWorkLunch: true, canWorkKvall: true },
      tuesday: { available: true, canWorkMorgon: false, canWorkLunch: true, canWorkKvall: true },
      wednesday: { available: false },
      thursday: { available: true, canWorkMorgon: false, canWorkLunch: true, canWorkKvall: true },
      friday: { available: true, canWorkMorgon: false, canWorkLunch: true, canWorkKvall: true },
      saturday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
      sunday: { available: false }
    }
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Astrid Karlsson',
    address: 'Storgatan 14, lgh 1201',
    postalArea: '114 55 Stockholm',
    phone: '08-112 233',
    requiredRole: 'Undersköterska',
    notes: 'Hjälp med morgonrutin, medicinutdelning samt lunch. Portkod 4482.',
    careLevel: 'Medel',
    doorCode: '4482',
    contactPerson: 'Dotter Karin (070-332 211)'
  },
  {
    id: 'cust-2',
    name: 'Gunnar Lindgren',
    address: 'Sveavägen 88, 3 tr',
    postalArea: '113 59 Stockholm',
    phone: '08-445 566',
    requiredRole: 'Sjuksköterska',
    notes: 'Insulin och daglig blodsockerkontroll samt såromläggning kl 08:00.',
    careLevel: 'Hög',
    doorCode: '1974',
    contactPerson: 'Son Peter (073-998 877)'
  },
  {
    id: 'cust-3',
    name: 'Birgitta Ek',
    address: 'Vasagatan 22, 1 tr',
    postalArea: '111 20 Stockholm',
    phone: '08-778 899',
    requiredRole: 'Vårdbiträde',
    notes: 'Frukostsällskap, lättare städning och promenad i närområdet.',
    careLevel: 'Bas',
    doorCode: 'Nyckel i nyckelgömma (kod 1234)',
    contactPerson: 'Make Sven (08-778 899)'
  },
  {
    id: 'cust-4',
    name: 'Sven Håkansson',
    address: 'Ringvägen 104, 4 tr',
    postalArea: '116 61 Stockholm',
    phone: '08-664 422',
    requiredRole: 'Undersköterska',
    notes: 'Stöd vid förflyttning (rullstol), personlig hygien och kvällsrutin.',
    careLevel: 'Dubbelbemanning',
    doorCode: '9012',
    contactPerson: 'God man Lars Andersson'
  },
  {
    id: 'cust-5',
    name: 'Karin Ström',
    address: 'Kungsholmsgatan 12',
    postalArea: '112 27 Stockholm',
    phone: '08-332 110',
    requiredRole: 'Undersköterska',
    notes: 'Lunchservering, tillsyn och aktivering eftermiddag.',
    careLevel: 'Medel',
    doorCode: '3150',
    contactPerson: 'Kusin Eva'
  }
];

// Helper to get dates for current week (Monday to Sunday)
export function getCurrentWeekDates(): { dateStr: string; dayOfWeek: DayOfWeek; dayNameSv: string; dayNameEn: string }[] {
  const now = new Date();
  const currentDay = now.getDay(); // 0 is Sunday
  // Distance to Monday (if Sunday, distance is -6, otherwise 1 - currentDay)
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(now);
  monday.setDate(now.getDate() + distanceToMonday);

  const days: { dayOfWeek: DayOfWeek; dayNameSv: string; dayNameEn: string }[] = [
    { dayOfWeek: 'monday', dayNameSv: 'Måndag', dayNameEn: 'Monday' },
    { dayOfWeek: 'tuesday', dayNameSv: 'Tisdag', dayNameEn: 'Tuesday' },
    { dayOfWeek: 'wednesday', dayNameSv: 'Onsdag', dayNameEn: 'Wednesday' },
    { dayOfWeek: 'thursday', dayNameSv: 'Torsdag', dayNameEn: 'Thursday' },
    { dayOfWeek: 'friday', dayNameSv: 'Fredag', dayNameEn: 'Friday' },
    { dayOfWeek: 'saturday', dayNameSv: 'Lördag', dayNameEn: 'Saturday' },
    { dayOfWeek: 'sunday', dayNameSv: 'Söndag', dayNameEn: 'Sunday' },
  ];

  return days.map((d, index) => {
    const targetDate = new Date(monday);
    targetDate.setDate(monday.getDate() + index);
    const dateStr = targetDate.toISOString().split('T')[0];
    return {
      dateStr,
      ...d
    };
  });
}

// Generate realistic initial shifts for current week
export function generateInitialShifts(): Shift[] {
  const week = getCurrentWeekDates();
  const shifts: Shift[] = [];

  const addShift = (
    id: string,
    custId: string,
    dayIdx: number,
    start: string,
    end: string,
    dur: number,
    role: Shift['requiredRole'],
    slot: Shift['timeSlot'],
    empId: string | null,
    bonusMod = 0
  ) => {
    shifts.push({
      id,
      customerId: custId,
      employeeId: empId,
      date: week[dayIdx].dateStr,
      startTime: start,
      endTime: end,
      durationHours: dur,
      requiredRole: role,
      timeSlot: slot,
      status: empId ? 'assigned' : 'unassigned',
      bonusModifier: bonusMod,
      notes: ''
    });
  };

  // Måndag (dayIdx = 0)
  addShift('sh-1', 'cust-1', 0, '07:30', '11:30', 4.0, 'Undersköterska', 'morgon', 'emp-1');
  addShift('sh-2', 'cust-2', 0, '08:00', '11:00', 3.0, 'Sjuksköterska', 'morgon', 'emp-2');
  addShift('sh-3', 'cust-3', 0, '08:30', '12:30', 4.0, 'Vårdbiträde', 'morgon', 'emp-4');
  addShift('sh-4', 'cust-4', 0, '16:00', '20:00', 4.0, 'Undersköterska', 'kvall', 'emp-1');
  addShift('sh-5', 'cust-5', 0, '12:00', '15:30', 3.5, 'Undersköterska', 'lunch', null);

  // Tisdag (dayIdx = 1)
  addShift('sh-6', 'cust-1', 1, '07:30', '11:30', 4.0, 'Undersköterska', 'morgon', 'emp-3');
  addShift('sh-7', 'cust-2', 1, '08:00', '12:00', 4.0, 'Sjuksköterska', 'morgon', 'emp-2');
  addShift('sh-8', 'cust-3', 1, '12:30', '16:30', 4.0, 'Vårdbiträde', 'lunch', 'emp-4');
  addShift('sh-9', 'cust-4', 1, '16:30', '20:30', 4.0, 'Undersköterska', 'kvall', 'emp-3');
  addShift('sh-10', 'cust-5', 1, '08:00', '12:00', 4.0, 'Undersköterska', 'morgon', null);

  // Onsdag (dayIdx = 2)
  addShift('sh-11', 'cust-1', 2, '07:30', '11:30', 4.0, 'Undersköterska', 'morgon', 'emp-1');
  addShift('sh-12', 'cust-2', 2, '08:00', '11:30', 3.5, 'Sjuksköterska', 'morgon', 'emp-2');
  addShift('sh-13', 'cust-3', 2, '08:30', '12:30', 4.0, 'Vårdbiträde', 'morgon', 'emp-4');
  addShift('sh-14', 'cust-4', 2, '16:00', '20:00', 4.0, 'Undersköterska', 'kvall', 'emp-1');
  addShift('sh-15', 'cust-5', 2, '12:30', '16:00', 3.5, 'Undersköterska', 'lunch', null);

  // Torsdag (dayIdx = 3)
  addShift('sh-16', 'cust-1', 3, '07:30', '11:30', 4.0, 'Undersköterska', 'morgon', 'emp-3');
  addShift('sh-17', 'cust-2', 3, '08:00', '12:00', 4.0, 'Sjuksköterska', 'morgon', 'emp-2');
  addShift('sh-18', 'cust-3', 3, '08:30', '12:30', 4.0, 'Vårdbiträde', 'morgon', 'emp-4');
  addShift('sh-19', 'cust-4', 3, '16:30', '20:30', 4.0, 'Undersköterska', 'kvall', 'emp-3');
  addShift('sh-20', 'cust-5', 3, '12:00', '15:30', 3.5, 'Undersköterska', 'lunch', null);

  // Fredag (dayIdx = 4)
  addShift('sh-21', 'cust-1', 4, '07:30', '11:30', 4.0, 'Undersköterska', 'morgon', 'emp-1');
  addShift('sh-22', 'cust-2', 4, '08:00', '12:00', 4.0, 'Sjuksköterska', 'morgon', 'emp-2');
  addShift('sh-23', 'cust-3', 4, '08:30', '12:30', 4.0, 'Vårdbiträde', 'morgon', 'emp-4');
  addShift('sh-24', 'cust-4', 4, '16:00', '20:00', 4.0, 'Undersköterska', 'kvall', null);
  addShift('sh-25', 'cust-5', 4, '12:00', '15:30', 3.5, 'Undersköterska', 'lunch', null);

  // Lördag (dayIdx = 5)
  addShift('sh-26', 'cust-1', 5, '08:00', '12:00', 4.0, 'Undersköterska', 'morgon', null, 200);
  addShift('sh-27', 'cust-2', 5, '09:00', '13:00', 4.0, 'Sjuksköterska', 'morgon', 'emp-2', 200);
  addShift('sh-28', 'cust-4', 5, '16:00', '20:00', 4.0, 'Undersköterska', 'kvall', null, 250);

  // Söndag (dayIdx = 6)
  addShift('sh-29', 'cust-1', 6, '08:00', '12:00', 4.0, 'Undersköterska', 'morgon', null, 200);
  addShift('sh-30', 'cust-4', 6, '16:00', '20:00', 4.0, 'Undersköterska', 'kvall', 'emp-3', 250);

  return shifts;
}
