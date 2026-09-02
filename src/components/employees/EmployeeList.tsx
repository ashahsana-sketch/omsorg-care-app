import React, { useState } from 'react';
import { Employee, CareRole } from '../../types/omsorg';
import { useOmsorg } from '../../context/OmsorgContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatSEK } from '../../utils/payroll';
import { 
  UserPlus, 
  Search, 
  Phone, 
  Mail, 
  Edit, 
  Trash2, 
  ReceiptText, 
  AlertTriangle,
  Award
} from 'lucide-react';

interface EmployeeListProps {
  onAddEmployee: () => void;
  onEditEmployee: (emp: Employee) => void;
  onViewPayslip: (emp: Employee) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  onAddEmployee,
  onEditEmployee,
  onViewPayslip
}) => {
  const { employees, shifts, deleteEmployee } = useOmsorg();
  const { language, t } = useLanguage();

  const [search, setSearch] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.phone.includes(search) ||
      emp.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = selectedRoleFilter === 'all' || emp.roles.includes(selectedRoleFilter as CareRole);

    return matchesSearch && matchesRole;
  });

  const handleDelete = (emp: Employee) => {
    if (confirm(language === 'sv' 
      ? `Är du säker på att du vill ta bort ${emp.name}? Alla tilldelade arbetspass blir avbokade.` 
      : `Are you sure you want to delete ${emp.name}?`)) {
      deleteEmployee(emp.id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {language === 'sv' ? 'Personal & Omsorgsgrupp' : 'Care Team & Employees'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'sv' 
              ? `Totalt ${employees.length} anställda registrerade med timlöner, bonusar och max 40h/vecka gränser.`
              : `Total ${employees.length} employees with rates, bonuses and weekly hour limits.`}
          </p>
        </div>

        <button
          onClick={onAddEmployee}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('addEmployee')}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'sv' ? 'Sök personal på namn, telefon eller e-post...' : 'Search employees...'}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:ring-2 focus:ring-sky-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="all">{t('allRoles')}</option>
            <option value="Undersköterska">Undersköterska</option>
            <option value="Sjuksköterska">Sjuksköterska</option>
            <option value="Vårdbiträde">Vårdbiträde</option>
            <option value="Personlig assistent">Personlig assistent</option>
            <option value="Boendestödjare">Boendestödjare</option>
          </select>
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEmployees.map((emp) => {
          const allocatedHours = shifts
            .filter(s => s.employeeId === emp.id && s.status !== 'cancelled')
            .reduce((sum, s) => sum + s.durationHours, 0);

          const max = emp.maxHoursPerWeek;
          const isOverLimit = allocatedHours > max;
          const remainingHours = Math.max(max - allocatedHours, 0);
          const capacityPct = Math.min(Math.round((allocatedHours / max) * 100), 100);

          let barColor = 'bg-sky-500';
          if (isOverLimit) barColor = 'bg-rose-500';
          else if (capacityPct >= 85) barColor = 'bg-amber-500';
          else if (capacityPct >= 50) barColor = 'bg-emerald-500';

          return (
            <div 
              key={emp.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5">
                
                {/* Top Row: Avatar, Name, Status & Menu */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-11 h-11 rounded-xl text-white font-bold flex items-center justify-center text-sm shadow-xs"
                      style={{ backgroundColor: emp.avatarColor || '#0284c7' }}
                    >
                      {emp.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">
                        {emp.name}
                      </h3>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-[11px] text-slate-500">
                          {emp.status === 'active' 
                            ? (language === 'sv' ? 'I tjänst' : 'Active') 
                            : (language === 'sv' ? 'Ledig' : 'Leave')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onEditEmployee(emp)}
                      title={t('edit')}
                      className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(emp)}
                      title={t('delete')}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Role Badges */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {emp.roles.map(r => (
                    <span 
                      key={r}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {r}
                    </span>
                  ))}
                </div>

                {/* Contact info */}
                <div className="mt-4 space-y-1 text-xs text-slate-600">
                  {emp.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{emp.phone}</span>
                    </div>
                  )}
                  {emp.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                  )}
                </div>

                {/* Compensation info: Timlön & Bonus */}
                <div className="mt-4 grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      {t('empHourlyRate')}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {emp.hourlyRate} kr/h
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      {t('empBonus')}
                    </span>
                    <span className="text-xs font-bold text-amber-700 flex items-center space-x-1">
                      <Award className="w-3 h-3 text-amber-500" />
                      <span>+{formatSEK(emp.bonus || 0)}</span>
                    </span>
                  </div>
                </div>

                {/* Weekly Hours & Max 40h Limit Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">
                      {language === 'sv' ? 'Schemalagt denna vecka' : 'Scheduled this week'}
                    </span>
                    <span className={`font-bold ${isOverLimit ? 'text-rose-600' : 'text-slate-800'}`}>
                      {allocatedHours.toFixed(1)}h / max {max}h
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`${barColor} h-2 rounded-full transition-all duration-300`} 
                      style={{ width: `${Math.min((allocatedHours / max) * 100, 100)}%` }} 
                    />
                  </div>

                  {isOverLimit ? (
                    <div className="mt-1.5 flex items-center space-x-1 text-[11px] font-semibold text-rose-600">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{language === 'sv' ? `Varning: Överskriden med ${(allocatedHours - max).toFixed(1)}h!` : `Over limit by ${(allocatedHours - max).toFixed(1)}h!`}</span>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                      <span>{language === 'sv' ? `Kvar: ${remainingHours.toFixed(1)}h kapacitet` : `${remainingHours.toFixed(1)}h remaining`}</span>
                      <span>{capacityPct}% {language === 'sv' ? 'bokat' : 'booked'}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Card Footer: Payslip button */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {shifts.filter(s => s.employeeId === emp.id).length} {language === 'sv' ? 'pass bokade' : 'shifts'}
                </span>

                <button
                  onClick={() => onViewPayslip(emp)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold transition cursor-pointer"
                >
                  <ReceiptText className="w-3.5 h-3.5" />
                  <span>{t('previewPayslip')}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
