import React from 'react';
import { Shift, Employee, Customer } from '../../types/omsorg';
import { useOmsorg } from '../../context/OmsorgContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Award, 
  Edit, 
  Trash2, 
  UserX
} from 'lucide-react';

interface ShiftCardProps {
  shift: Shift;
  onEdit: (shift: Shift) => void;
  onDelete: (shiftId: string) => void;
  onAssign: (shiftId: string, employeeId: string | null) => void;
}

export const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  onEdit,
  onDelete,
  onAssign
}) => {
  const { employees, getCustomer, getShiftConflicts } = useOmsorg();
  const { language } = useLanguage();

  const customer: Customer | undefined = getCustomer(shift.customerId);
  const assignedEmp: Employee | undefined = employees.find(e => e.id === shift.employeeId);
  const conflicts = getShiftConflicts(shift);

  return (
    <div className={`p-3 rounded-xl border transition-all text-xs relative group ${
      !assignedEmp 
        ? 'bg-amber-50/70 border-amber-200 hover:border-amber-400' 
        : conflicts.length > 0 
          ? 'bg-rose-50/70 border-rose-300 hover:border-rose-400' 
          : 'bg-white border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-xs'
    }`}>
      
      {/* Top: Customer & Quick Menu */}
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <div className="font-bold text-slate-900 truncate" title={customer?.name}>
            {customer?.name || 'Okänd brukare'}
          </div>
          {customer?.address && (
            <div className="text-[11px] text-slate-500 truncate flex items-center space-x-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{customer.address}</span>
            </div>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-0.5 opacity-80 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(shift)}
            className="p-1 text-slate-400 hover:text-sky-600 rounded hover:bg-slate-100 cursor-pointer"
            title={language === 'sv' ? 'Redigera pass' : 'Edit shift'}
          >
            <Edit className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(shift.id)}
            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 cursor-pointer"
            title={language === 'sv' ? 'Ta bort pass' : 'Delete shift'}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Time & Duration */}
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
        <div className="flex items-center space-x-1 font-semibold text-slate-800">
          <Clock className="w-3 h-3 text-sky-600 shrink-0" />
          <span>{shift.startTime} - {shift.endTime}</span>
        </div>
        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium text-[10px]">
          {shift.durationHours}h
        </span>
      </div>

      {/* Role requirement & Extra bonus */}
      <div className="mt-2 flex flex-wrap items-center gap-1">
        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
          {shift.requiredRole}
        </span>
        {shift.bonusModifier && shift.bonusModifier > 0 ? (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 flex items-center space-x-0.5">
            <Award className="w-2.5 h-2.5" />
            <span>+{shift.bonusModifier} kr</span>
          </span>
        ) : null}
      </div>

      {/* Assigned Employee or Assignment Dropdown */}
      <div className="mt-2.5 pt-2 border-t border-slate-100">
        {assignedEmp ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0">
              <span 
                className="w-2 h-2 rounded-full shrink-0" 
                style={{ backgroundColor: assignedEmp.avatarColor || '#0284c7' }} 
              />
              <span className="font-semibold text-slate-800 truncate text-[11px]" title={assignedEmp.name}>
                {assignedEmp.name}
              </span>
            </div>
            <button
              onClick={() => onAssign(shift.id, null)}
              className="text-[10px] text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
              title={language === 'sv' ? 'Avboka personal' : 'Unassign'}
            >
              <UserX className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-700 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              <span>{language === 'sv' ? 'Ledigt pass' : 'Unassigned'}</span>
            </span>

            {/* Quick 1-click assign dropdown */}
            <select
              value=""
              onChange={(e) => onAssign(shift.id, e.target.value || null)}
              className="text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded px-1.5 py-0.5 cursor-pointer font-semibold"
            >
              <option value="">+ {language === 'sv' ? 'Tillsätt' : 'Assign'}</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.roles.join(', ')})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Conflict Warnings */}
      {conflicts.length > 0 && (
        <div className="mt-2 p-1.5 rounded bg-rose-100/80 border border-rose-200 text-[10px] text-rose-800 font-medium space-y-0.5">
          {conflicts.map((c, idx) => (
            <div key={idx} className="flex items-center space-x-1">
              <AlertTriangle className="w-2.5 h-2.5 shrink-0 text-rose-600" />
              <span className="truncate">{language === 'sv' ? c.messageSv : c.messageEn}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
