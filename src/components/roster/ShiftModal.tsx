import React, { useState, useEffect } from 'react';
import { Shift, CareRole, ShiftTimeSlot, Customer } from '../../types/omsorg';
import { useOmsorg } from '../../context/OmsorgContext';
import { useLanguage } from '../../context/LanguageContext';
import { validateShiftAssignment } from '../../utils/scheduler';
import { X, Calendar, Clock, User, HeartHandshake, Award, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shiftData: Omit<Shift, 'id'>) => void;
  initialData?: Shift | null;
  defaultCustomer?: Customer | null;
  defaultDate?: string;
}

const ROLES: CareRole[] = ['Undersköterska', 'Vårdbiträde', 'Sjuksköterska', 'Personlig assistent', 'Boendestödjare'];

export const ShiftModal: React.FC<ShiftModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultCustomer,
  defaultDate
}) => {
  const { customers, employees, shifts } = useOmsorg();
  const { language, t } = useLanguage();

  const [customerId, setCustomerId] = useState('');
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('12:00');
  const [durationHours, setDurationHours] = useState(4.0);
  const [requiredRole, setRequiredRole] = useState<CareRole>('Undersköterska');
  const [timeSlot, setTimeSlot] = useState<ShiftTimeSlot>('morgon');
  const [bonusModifier, setBonusModifier] = useState(0);
  const [notes, setNotes] = useState('');

  // Auto-update duration when start/end time changes
  const updateTimes = (start: string, end: string) => {
    setStartTime(start);
    setEndTime(end);
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    if (!isNaN(h1) && !isNaN(h2)) {
      let mins = (h2 * 60 + (m2 || 0)) - (h1 * 60 + (m1 || 0));
      if (mins < 0) mins += 24 * 60; // Cross midnight
      const hours = Math.round((mins / 60) * 10) / 10;
      setDurationHours(hours > 0 ? hours : 1);

      // Auto slot
      if (h1 < 11) setTimeSlot('morgon');
      else if (h1 < 15) setTimeSlot('lunch');
      else if (h1 < 21) setTimeSlot('kvall');
      else setTimeSlot('natt');
    }
  };

  useEffect(() => {
    if (initialData) {
      setCustomerId(initialData.customerId);
      setEmployeeId(initialData.employeeId);
      setDate(initialData.date);
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);
      setDurationHours(initialData.durationHours);
      setRequiredRole(initialData.requiredRole);
      setTimeSlot(initialData.timeSlot);
      setBonusModifier(initialData.bonusModifier || 0);
      setNotes(initialData.notes || '');
    } else {
      const today = defaultDate || new Date().toISOString().split('T')[0];
      setDate(today);
      setCustomerId(defaultCustomer?.id || (customers[0]?.id || ''));
      setEmployeeId(null);
      setStartTime('08:00');
      setEndTime('12:00');
      setDurationHours(4.0);
      setRequiredRole(defaultCustomer?.requiredRole || 'Undersköterska');
      setTimeSlot('morgon');
      setBonusModifier(0);
      setNotes('');
    }
  }, [initialData, defaultCustomer, defaultDate, isOpen, customers]);

  if (!isOpen) return null;

  // Real-time conflict preview for selected employee
  const selectedEmp = employees.find(e => e.id === employeeId);
  const currentDraftShift: Shift = {
    id: initialData?.id || 'temp-check',
    customerId,
    employeeId,
    date,
    startTime,
    endTime,
    durationHours,
    requiredRole,
    timeSlot,
    status: employeeId ? 'assigned' : 'unassigned',
    bonusModifier,
    notes
  };

  const activeConflicts = selectedEmp 
    ? validateShiftAssignment(currentDraftShift, selectedEmp, shifts) 
    : [];

  const handleCustomerChange = (id: string) => {
    setCustomerId(id);
    const cust = customers.find(c => c.id === id);
    if (cust) {
      setRequiredRole(cust.requiredRole);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !date) return;

    onSave({
      customerId,
      employeeId: employeeId || null,
      date,
      startTime,
      endTime,
      durationHours: Number(durationHours) || 1,
      requiredRole,
      timeSlot,
      status: employeeId ? 'assigned' : 'unassigned',
      bonusModifier: Number(bonusModifier) || 0,
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData 
                  ? (language === 'sv' ? 'Redigera arbetspass' : 'Edit Care Shift') 
                  : (language === 'sv' ? 'Skapa nytt arbetspass' : 'Create Care Shift')}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'sv' ? 'Tilldela brukare, datum, tider och personal' : 'Assign client, date, duration and staff'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Customer Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'sv' ? 'Brukare / Vårdtagare' : 'Client'} *
            </label>
            <div className="relative">
              <HeartHandshake className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <select
                required
                value={customerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.address} - {c.requiredRole})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date, Start & End Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('shiftDate')} *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'sv' ? 'Starttid' : 'Start Time'}
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => updateTimes(e.target.value, endTime)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'sv' ? 'Sluttid' : 'End Time'}
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => updateTimes(startTime, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Duration & Required Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('shiftDuration')} ({language === 'sv' ? 'Timmar' : 'Hours'})
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('custReqRole')}
              </label>
              <select
                value={requiredRole}
                onChange={(e) => setRequiredRole(e.target.value as CareRole)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Employee Assignment Dropdown with Live Capacity info */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              {t('shiftAssignedTo')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <select
                value={employeeId || ''}
                onChange={(e) => setEmployeeId(e.target.value || null)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="">-- {t('shiftUnassigned')} --</option>
                {employees.map(emp => {
                  const currentEmpHours = shifts
                    .filter(s => s.employeeId === emp.id && s.id !== initialData?.id && s.status !== 'cancelled')
                    .reduce((sum, s) => sum + s.durationHours, 0);

                  const afterHours = currentEmpHours + durationHours;
                  const isExceeded = afterHours > emp.maxHoursPerWeek;

                  return (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.roles.join(', ')}) — Nu: {currentEmpHours}h / max {emp.maxHoursPerWeek}h {isExceeded ? '⚠️ [ÖVERSKRIDER 40H]' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Real-time conflict warnings */}
            {activeConflicts.length > 0 && (
              <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg space-y-1">
                {activeConflicts.map((c, i) => (
                  <div key={i} className="flex items-center space-x-1.5 text-xs text-rose-700 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                    <span>{language === 'sv' ? c.messageSv : c.messageEn}</span>
                  </div>
                ))}
              </div>
            )}

            {employeeId && activeConflicts.length === 0 && (
              <div className="mt-2 flex items-center space-x-1.5 text-xs text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'sv' ? 'Godkänd tilldelning (Inom max 40h, rätt kompetens & tillgänglig)' : 'Valid assignment (Within hours limit and qualified)'}</span>
              </div>
            )}
          </div>

          {/* Extra Shift Bonus */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'sv' ? 'Extra passbonus / OB-tillägg (SEK)' : 'Extra Shift Bonus (SEK)'}
            </label>
            <div className="relative">
              <Award className="w-4 h-4 text-amber-500 absolute left-3 top-2.5" />
              <input
                type="number"
                min="0"
                step="50"
                value={bonusModifier}
                onChange={(e) => setBonusModifier(Number(e.target.value))}
                placeholder="0"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              {language === 'sv' ? 'Läggs till utöver ordinarie timlön och personlig bonus' : 'Added to salary slip'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition cursor-pointer"
            >
              {t('save')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
