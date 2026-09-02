import React from 'react';
import { useOmsorg } from '../../context/OmsorgContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatSEK } from '../../utils/payroll';
import { 
  Users, 
  HeartHandshake, 
  Clock, 
  ReceiptText, 
  Sparkles, 
  CheckCircle2, 
  Calendar,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface StatsOverviewProps {
  onOpenEmployeeModal: () => void;
  onOpenCustomerModal: () => void;
  onOpenShiftModal?: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  onOpenEmployeeModal,
  onOpenCustomerModal
}) => {
  const { employees, shifts, stats, setActiveTab, autoScheduleShifts, getAllConflicts } = useOmsorg();
  const { language, t } = useLanguage();

  const conflicts = getAllConflicts();

  // Total max capacity across all employees
  const totalWeeklyCapacity = employees.reduce((sum, e) => sum + e.maxHoursPerWeek, 0);
  const capacityPercent = totalWeeklyCapacity > 0 
    ? Math.round((stats.totalScheduledHours / totalWeeklyCapacity) * 100) 
    : 0;

  const handleAutoSchedule = () => {
    const res = autoScheduleShifts();
    alert(language === 'sv' 
      ? `Autoschemaläggning klar! ${res.assignedCount} pass tillsattes. ${res.unassignedCount} pass kvarstår.` 
      : `Auto-scheduling complete! ${res.assignedCount} shifts assigned, ${res.unassignedCount} remain.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/30 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>{language === 'sv' ? 'Smart Omsorgsplanering & Lönesystem' : 'Smart Care Scheduling & Payroll Engine'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {language === 'sv' ? 'Välkommen till OmsorgHub' : 'Welcome to CareHub'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-sky-100">
            {language === 'sv' 
              ? 'Hantera personal, brukare, automatiska scheman med maxtid 40h/vecka och generera fullständiga svenska lönespecifikationer med ett klick.'
              : 'Manage employees, care clients, automated rosters with 40h/week caps, and generate complete Swedish salary slips with one click.'}
          </p>

          {/* Quick Action Pills inside banner */}
          <div className="mt-6 flex flex-wrap gap-2.5">
            {stats.unassignedShifts > 0 ? (
              <button
                onClick={handleAutoSchedule}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'sv' ? `Autoschemalägg (${stats.unassignedShifts} lediga pass)` : `Auto-Schedule (${stats.unassignedShifts} shifts)`}</span>
              </button>
            ) : (
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>{t('allShiftsCovered')}</span>
              </div>
            )}

            <button
              onClick={() => setActiveTab('roster')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-xs transition cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{language === 'sv' ? 'Öppna Veckoschema' : 'Open Weekly Roster'}</span>
            </button>

            <button
              onClick={() => setActiveTab('payroll')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-xs transition cursor-pointer"
            >
              <ReceiptText className="w-4 h-4" />
              <span>{language === 'sv' ? 'Se Lönespecifikationer' : 'View Salary Slips'}</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Staff */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('totalStaff')}
            </span>
            <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{stats.totalEmployees}</span>
            <button 
              onClick={onOpenEmployeeModal}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
            >
              + {language === 'sv' ? 'Ny anställd' : 'New staff'}
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {language === 'sv' ? 'Undersköterskor, sjuksköterskor m.fl.' : 'Nurses, assistants & caregivers'}
          </p>
        </div>

        {/* Active Clients */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('activeClients')}
            </span>
            <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{stats.totalCustomers}</span>
            <button 
              onClick={onOpenCustomerModal}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
            >
              + {language === 'sv' ? 'Ny brukare' : 'New client'}
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {language === 'sv' ? 'Mottagare av hemvård och omsorg' : 'Care receivers across locations'}
          </p>
        </div>

        {/* Scheduled Hours & Capacity */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('totalHours')}
            </span>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {stats.totalScheduledHours.toFixed(1)} <span className="text-sm font-normal text-slate-500">/ {totalWeeklyCapacity}h</span>
            </span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {capacityPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(capacityPercent, 100)}%` }} 
            />
          </div>
        </div>

        {/* Total Payroll Cost */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('totalPayrollEstimate')}
            </span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <ReceiptText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-700">
              {formatSEK(stats.estimatedPayrollGross)}
            </span>
            <button 
              onClick={() => setActiveTab('payroll')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              PDF →
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {language === 'sv' ? 'Bruttolön inkl. bonusar denna vecka' : 'Gross salary incl. bonuses this week'}
          </p>
        </div>

      </div>

      {/* Conflicts & Alerts Section if any */}
      {conflicts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 sm:p-5">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-rose-900">
                {language === 'sv' ? 'Schemakonflikter behöver åtgärdas' : 'Roster conflicts require attention'}
              </h3>
              <p className="text-xs text-rose-700 mt-1">
                {language === 'sv' 
                  ? 'Följande pass bryter mot regler för maxtid per vecka, kompetenskrav eller dubbelbokning:' 
                  : 'The following shifts violate weekly hours caps, skills, or double booking:'}
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-rose-800">
                {conflicts.slice(0, 4).map((c, i) => (
                  <li key={i} className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>{language === 'sv' ? c.messageSv : c.messageEn}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setActiveTab('roster')}
                className="mt-3 text-xs font-semibold text-rose-700 hover:text-rose-900 underline inline-flex items-center space-x-1 cursor-pointer"
              >
                <span>{language === 'sv' ? 'Gå till Schemaläggning för att justera' : 'Go to Roster to resolve'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Capacity vs Max 40h Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {language === 'sv' ? 'Arbetstidskapacitet per anställd (Max 40h/v)' : 'Employee Capacity (Max 40h/w limit)'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'sv' 
                ? 'Översikt över tilldelade timmar kontra personlig maxtid och 40h veckoarbetstid.' 
                : 'Current allocated hours versus personal max limit and 40h cap.'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('employees')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
          >
            {language === 'sv' ? 'Hantera personal →' : 'Manage staff →'}
          </button>
        </div>

        <div className="space-y-3">
          {employees.map(emp => {
            const allocated = shifts
              .filter(s => s.employeeId === emp.id && s.status !== 'cancelled')
              .reduce((sum, s) => sum + s.durationHours, 0);
            
            const max = emp.maxHoursPerWeek;
            const pct = Math.min(Math.round((allocated / max) * 100), 100);
            const isOver = allocated > max;

            let barColor = 'bg-sky-500';
            if (isOver) barColor = 'bg-rose-500';
            else if (pct >= 85) barColor = 'bg-amber-500';
            else if (pct >= 50) barColor = 'bg-emerald-500';

            return (
              <div key={emp.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: emp.avatarColor }} 
                    />
                    <span className="font-semibold text-slate-800">{emp.name}</span>
                    <span className="text-slate-400">({emp.roles.join(', ')})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${isOver ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                      {allocated.toFixed(1)}h
                    </span>
                    <span className="text-slate-400">/ max {max}h</span>
                    {isOver && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                        {language === 'sv' ? 'ÖVERSKREDEN' : 'OVER LIMIT'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`${barColor} h-2 rounded-full transition-all duration-300`} 
                    style={{ width: `${Math.min((allocated / max) * 100, 100)}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
