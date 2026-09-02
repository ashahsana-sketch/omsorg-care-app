import React from 'react';
import { useOmsorg } from '../../context/OmsorgContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  LayoutDashboard, 
  Users, 
  HeartHandshake, 
  CalendarDays, 
  ReceiptText,
  AlertCircle
} from 'lucide-react';

export const TabNavigation: React.FC = () => {
  const { activeTab, setActiveTab, stats, getAllConflicts } = useOmsorg();
  const { t } = useLanguage();

  const conflicts = getAllConflicts();

  const tabs = [
    {
      id: 'dashboard' as const,
      label: t('tabDashboard'),
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'employees' as const,
      label: t('tabEmployees'),
      icon: Users,
      badge: stats.totalEmployees
    },
    {
      id: 'customers' as const,
      label: t('tabCustomers'),
      icon: HeartHandshake,
      badge: stats.totalCustomers
    },
    {
      id: 'roster' as const,
      label: t('tabRoster'),
      icon: CalendarDays,
      badge: stats.unassignedShifts > 0 ? `${stats.unassignedShifts} lediga` : null,
      badgeColor: stats.unassignedShifts > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700',
      hasConflict: conflicts.length > 0
    },
    {
      id: 'payroll' as const,
      label: t('tabPayroll'),
      icon: ReceiptText,
      badge: 'PDF'
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-semibold shadow-xs ring-1 ring-sky-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                
                {tab.hasConflict && (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                )}

                {tab.badge && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${tab.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
