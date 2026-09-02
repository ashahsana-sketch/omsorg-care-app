import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'sv' | 'en';

interface Translations {
  [key: string]: {
    sv: string;
    en: string;
  };
}

export const translations: Translations = {
  // Brand & Header
  appTitle: { sv: 'OmsorgHub', en: 'CareHub' },
  appSubtitle: { sv: 'Schemaläggning & Lönesystem för Vård & Omsorg', en: 'Care Roster & Payroll Management System' },
  
  // Navigation Tabs
  tabDashboard: { sv: 'Översikt', en: 'Dashboard' },
  tabEmployees: { sv: 'Personal', en: 'Employees' },
  tabCustomers: { sv: 'Brukare & Kunder', en: 'Clients & Care Receivers' },
  tabRoster: { sv: 'Schema & Roster', en: 'Roster & Shifts' },
  tabPayroll: { sv: 'Lönespecifikation', en: 'Salary Slips & Payroll' },

  // Action Buttons
  addEmployee: { sv: 'Lägg till personal', en: 'Add Employee' },
  addCustomer: { sv: 'Lägg till brukare', en: 'Add Client' },
  addShift: { sv: 'Skapa arbetspass', en: 'Create Shift' },
  autoSchedule: { sv: 'Autoschemalägg', en: 'Auto-Schedule' },
  resetData: { sv: 'Återställ demodata', en: 'Reset Demo Data' },
  exportData: { sv: 'Exportera JSON', en: 'Export JSON' },
  importData: { sv: 'Importera JSON', en: 'Import JSON' },
  save: { sv: 'Spara', en: 'Save' },
  cancel: { sv: 'Avbryt', en: 'Cancel' },
  delete: { sv: 'Ta bort', en: 'Delete' },
  edit: { sv: 'Redigera', en: 'Edit' },
  downloadPdf: { sv: 'Ladda ner PDF', en: 'Download PDF' },
  print: { sv: 'Skriv ut', en: 'Print' },
  exportCsv: { sv: 'Exportera CSV', en: 'Export CSV' },
  previewPayslip: { sv: 'Visa lönespecifikation', en: 'View Salary Slip' },
  
  // Dashboard & Metrics
  totalStaff: { sv: 'Anställda', en: 'Total Staff' },
  activeClients: { sv: 'Brukare', en: 'Active Clients' },
  totalHours: { sv: 'Schemalagda timmar', en: 'Scheduled Hours' },
  totalPayrollEstimate: { sv: 'Total lönekostnad', en: 'Total Payroll Cost' },
  unassignedShifts: { sv: 'Otillsatta pass', en: 'Unassigned Shifts' },
  assignedShifts: { sv: 'Tillsatta pass', en: 'Assigned Shifts' },
  systemStatus: { sv: 'Systemstatus', en: 'System Status' },
  allShiftsCovered: { sv: 'Alla pass är tillsatta och bemannade!', en: 'All shifts are fully assigned and staffed!' },
  shiftsNeedCoverage: { sv: 'arbetspass saknar personal', en: 'shifts need coverage' },
  
  // Employee Fields
  empName: { sv: 'Namn', en: 'Name' },
  empPhone: { sv: 'Telefon', en: 'Phone' },
  empEmail: { sv: 'E-post', en: 'Email' },
  empMaxHours: { sv: 'Max timmar/vecka', en: 'Max Hours/Week' },
  empHourlyRate: { sv: 'Timlön (SEK/h)', en: 'Hourly Rate (SEK/h)' },
  empBonus: { sv: 'Bonus / Tillägg (SEK)', en: 'Bonus / Extra Pay (SEK)' },
  empRoles: { sv: 'Kompetens / Roller', en: 'Skills / Roles' },
  empAvailability: { sv: 'Tillgänglighet', en: 'Availability' },
  empStatus: { sv: 'Status', en: 'Status' },
  empAllocatedHours: { sv: 'Bokade timmar', en: 'Allocated Hours' },
  empRemainingHours: { sv: 'Kvarvarande kapacitet', en: 'Remaining Capacity' },

  // Customer Fields
  custName: { sv: 'Brukarens namn', en: 'Client Name' },
  custAddress: { sv: 'Adress & Våning', en: 'Address & Floor' },
  custPostal: { sv: 'Postort', en: 'Postal Area' },
  custPhone: { sv: 'Telefon', en: 'Phone' },
  custReqRole: { sv: 'Krav på kompetens', en: 'Required Skill' },
  custCareLevel: { sv: 'Vårdnivå', en: 'Care Level' },
  custDoorCode: { sv: 'Portkod / Nyckel', en: 'Door Code / Key' },
  custContact: { sv: 'Anhörigkontakt', en: 'Next of Kin' },
  custNotes: { sv: 'Omvårdnadsanteckningar', en: 'Care Notes' },

  // Roster & Shifts
  shiftDate: { sv: 'Datum', en: 'Date' },
  shiftTime: { sv: 'Tid', en: 'Time' },
  shiftDuration: { sv: 'Längd', en: 'Duration' },
  shiftAssignedTo: { sv: 'Tilldelad till', en: 'Assigned to' },
  shiftUnassigned: { sv: 'Ej tilldelad', en: 'Unassigned' },
  shiftLocation: { sv: 'Plats', en: 'Location' },
  filterByRole: { sv: 'Filtrera roll', en: 'Filter by Role' },
  filterByStaff: { sv: 'Filtrera personal', en: 'Filter Staff' },
  allRoles: { sv: 'Alla roller', en: 'All Roles' },
  allStaff: { sv: 'All personal', en: 'All Staff' },

  // Warnings & Conflicts
  warningMaxHours: { sv: 'Varning: Överskrider max 40h/vecka!', en: 'Warning: Exceeds max 40h/week limit!' },
  warningRoleMismatch: { sv: 'Varning: Rollkompetens matchar inte passets krav', en: 'Warning: Skill does not match shift requirement' },
  warningDoubleBooking: { sv: 'Varning: Personalen har redan ett pass denna tid', en: 'Warning: Employee is double-booked during this time' },
  warningUnavailable: { sv: 'Varning: Personalen är ej tillgänglig denna dag/tid', en: 'Warning: Employee is not marked available' },

  // Payroll & Salary Slip
  payrollTitle: { sv: 'Lönespecifikationer', en: 'Salary Slips & Payroll' },
  payPeriod: { sv: 'Löneperiod', en: 'Pay Period' },
  grossPay: { sv: 'Bruttolön', en: 'Gross Salary' },
  baseSalary: { sv: 'Grundlön (Timmar × Timlön)', en: 'Base Pay (Hours × Rate)' },
  bonusPay: { sv: 'Bonus & Tillägg', en: 'Bonus & Extra' },
  taxDeduction: { sv: 'Preliminärskatt (30%)', en: 'Estimated Tax (30%)' },
  netPay: { sv: 'Nettolön (Att utbetala)', en: 'Net Pay (Payable)' },
  workedHours: { sv: 'Arbetade timmar', en: 'Hours Worked' },
  itemizedShifts: { sv: 'Specifikation av utförda arbetspass', en: 'Itemized Care Shifts' },
  salaryCompanyHeader: { sv: 'Omsorgsföretag AB', en: 'Care Services Sweden AB' },
  salaryOrgNr: { sv: 'Org.nr: 556123-4567 | Godkänd för F-skatt', en: 'Org nr: 556123-4567 | Registered Tax' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('omsorg_language');
    return (saved === 'sv' || saved === 'en') ? saved : 'sv';
  });

  useEffect(() => {
    localStorage.setItem('omsorg_language', language);
  }, [language]);

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
