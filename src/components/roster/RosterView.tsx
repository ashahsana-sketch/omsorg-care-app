import React, { useState } from 'react';
import { Shift } from '../../types/omsorg';
import { useOmsorg } from '../../context/OmsorgContext';
import { useLanguage } from '../../context/LanguageContext';
import { getCurrentWeekDates } from '../../data/initialData';
import { ShiftCard } from './ShiftCard';
import { 
  Sparkles, 
  Plus, 
  Filter, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface RosterViewProps {
  onAddShift: (date?: string) => void;
  onEditShift: (shift: Shift) => void;
}

export const RosterView: React.FC<RosterViewProps> = ({
  onAddShift,
  onEditShift
}) => {
  const { shifts, employees, customers, assignShift, deleteShift, autoScheduleShifts, stats, getAllConflicts } = useOmsorg();
  const { language, t } = useLanguage();

  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('all');
  const [selectedCustomerFilter, setSelectedCustomerFilter] = useState<string>('all');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  const weekDays = getCurrentWeekDates();
  const conflicts = getAllConflicts();

  // Filter shifts based on dropdown selections
  const filteredShifts = shifts.filter(s => {
    if (s.status === 'cancelled') return false;
    if (selectedStaffFilter !== 'all') {
      if (selectedStaffFilter === 'unassigned' && s.employeeId) return false;
      if (selectedStaffFilter !== 'unassigned' && s.employeeId !== selectedStaffFilter) return false;
    }
    if (selectedCustomerFilter !== 'all' && s.customerId !== selectedCustomerFilter) return false;
    if (selectedRoleFilter !== 'all' && s.requiredRole !== selectedRoleFilter) return false;
    return true;
  });

  const handleAutoSchedule = () => {
    const res = autoScheduleShifts();
    if (res.unassignedCount === 0) {
      alert(language === 'sv' 
        ? `Autoschemaläggning lyckades! ${res.assignedCount} pass tillsattes utan regelbrott (max 40h/v och behörighet uppfyllda).` 
        : `Auto-scheduling success! ${res.assignedCount} shifts assigned.`);
    } else {
      alert(language === 'sv' 
        ? `Autoschemaläggning klar. ${res.assignedCount} pass tillsattes. ${res.unassignedCount} pass kunde inte tillsättas automatiskt på grund av kapacitetsbegränsningar (max 40h/vecka).` 
        : `Auto-scheduling done. ${res.assignedCount} assigned, ${res.unassignedCount} unassigned.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Main Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">
              {language === 'sv' ? 'Veckoschema & Roster' : 'Weekly Care Roster'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
              {weekDays[0].dateStr} — {weekDays[6].dateStr}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'sv' 
              ? 'Planera och bemanna alla omsorgsinsatser med automatisk koll på max 40h/vecka och behörighet.'
              : 'Schedule care shifts with automatic checks for max 40h/week and skill requirements.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* 1-Click Auto Scheduler */}
          <button
            onClick={handleAutoSchedule}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'sv' ? `Autoschemalägg (${stats.unassignedShifts} lediga)` : `Auto-Schedule (${stats.unassignedShifts})`}</span>
          </button>

          {/* Add Shift button */}
          <button
            onClick={() => onAddShift()}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addShift')}</span>
          </button>

        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>{language === 'sv' ? 'Filter:' : 'Filter:'}</span>
        </div>

        {/* Filter by Staff */}
        <select
          value={selectedStaffFilter}
          onChange={(e) => setSelectedStaffFilter(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:ring-2 focus:ring-sky-500 cursor-pointer"
        >
          <option value="all">{language === 'sv' ? 'Alla i personalen' : 'All Staff'}</option>
          <option value="unassigned">{language === 'sv' ? '⚠️ Endast ej tillsatta pass' : '⚠️ Unassigned only'}</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>

        {/* Filter by Customer */}
        <select
          value={selectedCustomerFilter}
          onChange={(e) => setSelectedCustomerFilter(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:ring-2 focus:ring-sky-500 cursor-pointer"
        >
          <option value="all">{language === 'sv' ? 'Alla brukare' : 'All Clients'}</option>
          {customers.map(cust => (
            <option key={cust.id} value={cust.id}>{cust.name}</option>
          ))}
        </select>

        {/* Filter by Role */}
        <select
          value={selectedRoleFilter}
          onChange={(e) => setSelectedRoleFilter(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:ring-2 focus:ring-sky-500 cursor-pointer"
        >
          <option value="all">{t('allRoles')}</option>
          <option value="Undersköterska">Undersköterska</option>
          <option value="Sjuksköterska">Sjuksköterska</option>
          <option value="Vårdbiträde">Vårdbiträde</option>
          <option value="Personlig assistent">Personlig assistent</option>
        </select>

        {/* Summary stats pill in filter bar */}
        <div className="ml-auto flex items-center space-x-3 text-xs text-slate-600">
          <span className="font-semibold text-slate-900">{filteredShifts.length} {language === 'sv' ? 'pass visas' : 'shifts shown'}</span>
          {conflicts.length > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{conflicts.length} {language === 'sv' ? 'konflikter' : 'conflicts'}</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{language === 'sv' ? 'Inga konflikter' : 'No conflicts'}</span>
            </span>
          )}
        </div>
      </div>

      {/* 7-Day Weekly Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const dayShifts = filteredShifts
            .filter(s => s.date === day.dateStr)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          const dayHours = dayShifts.reduce((sum, s) => sum + s.durationHours, 0);
          const dayUnassigned = dayShifts.filter(s => !s.employeeId).length;
          const isToday = new Date().toISOString().split('T')[0] === day.dateStr;

          return (
            <div 
              key={day.dateStr}
              className={`rounded-2xl border flex flex-col justify-between overflow-hidden min-h-[450px] transition ${
                isToday 
                  ? 'bg-sky-50/40 border-sky-300 ring-2 ring-sky-200' 
                  : 'bg-slate-50/60 border-slate-200'
              }`}
            >
              
              {/* Day Header */}
              <div className={`p-3 border-b ${
                isToday ? 'bg-sky-600 text-white' : 'bg-white text-slate-900 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">
                    {language === 'sv' ? day.dayNameSv : day.dayNameEn}
                  </span>
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-mono ${
                    isToday ? 'bg-sky-700 text-sky-100' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {day.dateStr.substring(5)}
                  </span>
                </div>

                <div className="mt-1.5 flex items-center justify-between text-[11px]">
                  <span className={isToday ? 'text-sky-100' : 'text-slate-500'}>
                    {dayShifts.length} {language === 'sv' ? 'pass' : 'shifts'} ({dayHours.toFixed(1)}h)
                  </span>
                  {dayUnassigned > 0 && (
                    <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                      isToday ? 'bg-amber-400 text-amber-950' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {dayUnassigned} {language === 'sv' ? 'lediga' : 'open'}
                    </span>
                  )}
                </div>
              </div>

              {/* Shifts List for the Day */}
              <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[600px]">
                {dayShifts.map((shift) => (
                  <ShiftCard
                    key={shift.id}
                    shift={shift}
                    onEdit={onEditShift}
                    onDelete={deleteShift}
                    onAssign={assignShift}
                  />
                ))}

                {dayShifts.length === 0 && (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-3 border-2 border-dashed border-slate-200 rounded-xl">
                    <span className="text-[11px] text-slate-400">
                      {language === 'sv' ? 'Inga pass schemalagda' : 'No shifts planned'}
                    </span>
                  </div>
                )}
              </div>

              {/* Day Footer: Quick add button */}
              <div className="p-2 bg-white border-t border-slate-200">
                <button
                  onClick={() => onAddShift(day.dateStr)}
                  className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 transition flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'sv' ? 'Lägg till pass' : 'Add Shift'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
