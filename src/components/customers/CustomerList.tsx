import React, { useState } from 'react';
import { Customer } from '../../types/omsorg';
import { useOmsorg } from '../../context/OmsorgContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  HeartHandshake, 
  Search, 
  MapPin, 
  Phone, 
  Key, 
  UserCheck, 
  Edit, 
  Trash2, 
  Calendar,
  Plus
} from 'lucide-react';

interface CustomerListProps {
  onAddCustomer: () => void;
  onEditCustomer: (cust: Customer) => void;
  onAddShiftForCustomer: (cust: Customer) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  onAddCustomer,
  onEditCustomer,
  onAddShiftForCustomer
}) => {
  const { customers, shifts, deleteCustomer, setActiveTab } = useOmsorg();
  const { language, t } = useLanguage();

  const [search, setSearch] = useState('');
  const [selectedCareLevel, setSelectedCareLevel] = useState<string>('all');

  const filteredCustomers = customers.filter(cust => {
    const matchesSearch = 
      cust.name.toLowerCase().includes(search.toLowerCase()) ||
      cust.address.toLowerCase().includes(search.toLowerCase()) ||
      cust.postalArea.toLowerCase().includes(search.toLowerCase());

    const matchesLevel = selectedCareLevel === 'all' || cust.careLevel === selectedCareLevel;

    return matchesSearch && matchesLevel;
  });

  const handleDelete = (cust: Customer) => {
    if (confirm(language === 'sv' 
      ? `Är du säker på att du vill ta bort brukaren ${cust.name}? Alla tillhörande arbetspass raderas också.` 
      : `Are you sure you want to delete ${cust.name}? Associated shifts will be removed.`)) {
      deleteCustomer(cust.id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {language === 'sv' ? 'Brukare & Vårdtagare' : 'Care Clients & Care Receivers'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'sv' 
              ? `Totalt ${customers.length} brukare med adresser, vårdbehov och schemalagda insatser.`
              : `Total ${customers.length} clients with addresses, care levels and required skills.`}
          </p>
        </div>

        <button
          onClick={onAddCustomer}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addCustomer')}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'sv' ? 'Sök brukare på namn, gatuadress eller område...' : 'Search clients...'}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedCareLevel}
            onChange={(e) => setSelectedCareLevel(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:ring-2 focus:ring-teal-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="all">{language === 'sv' ? 'Alla vårdnivåer' : 'All Care Levels'}</option>
            <option value="Bas">Bas</option>
            <option value="Medel">Medel</option>
            <option value="Hög">Hög</option>
            <option value="Dubbelbemanning">Dubbelbemanning</option>
          </select>
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((cust) => {
          const custShifts = shifts.filter(s => s.customerId === cust.id && s.status !== 'cancelled');
          const unassignedShifts = custShifts.filter(s => !s.employeeId).length;

          let careBadgeColor = 'bg-slate-100 text-slate-700';
          if (cust.careLevel === 'Hög' || cust.careLevel === 'Dubbelbemanning') {
            careBadgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
          } else if (cust.careLevel === 'Medel') {
            careBadgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
          } else {
            careBadgeColor = 'bg-teal-100 text-teal-800 border-teal-200';
          }

          return (
            <div
              key={cust.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5">
                
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 font-bold flex items-center justify-center shadow-2xs">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">
                        {cust.name}
                      </h3>
                      <span className={`inline-block px-2 py-0.5 mt-0.5 rounded text-[10px] font-bold border ${careBadgeColor}`}>
                        {cust.careLevel} {language === 'sv' ? 'vårdnivå' : 'care'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onEditCustomer(cust)}
                      title={t('edit')}
                      className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cust)}
                      title={t('delete')}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Address & Location */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900">{cust.address}</span>
                      <span className="text-slate-500 block">{cust.postalArea}</span>
                    </div>
                  </div>

                  {cust.doorCode && (
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Key className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="font-mono bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded text-[11px]">
                        {cust.doorCode}
                      </span>
                    </div>
                  )}

                  {cust.contactPerson && (
                    <div className="flex items-center space-x-2 text-slate-600">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{cust.contactPerson}</span>
                    </div>
                  )}

                  {cust.phone && (
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{cust.phone}</span>
                    </div>
                  )}
                </div>

                {/* Required skill tag */}
                <div className="mt-4 p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">{t('custReqRole')}:</span>
                  <span className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {cust.requiredRole}
                  </span>
                </div>

                {/* Notes */}
                {cust.notes && (
                  <div className="mt-3 text-xs text-slate-500 line-clamp-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                    {cust.notes}
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-semibold text-slate-700">{custShifts.length}</span>
                  <span className="text-slate-500"> {language === 'sv' ? 'pass i veckan' : 'shifts'}</span>
                  {unassignedShifts > 0 && (
                    <span className="ml-1.5 text-amber-600 font-semibold text-[11px]">
                      ({unassignedShifts} {language === 'sv' ? 'ej tillsatta' : 'unassigned'})
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onAddShiftForCustomer(cust)}
                    className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                    title={language === 'sv' ? 'Skapa nytt pass för denna brukare' : 'Add shift for client'}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'sv' ? 'Nytt pass' : 'Add Shift'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('roster')}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
                    title={language === 'sv' ? 'Visa i schema' : 'View in roster'}
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
