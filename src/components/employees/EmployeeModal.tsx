import React, { useState, useEffect } from 'react';
import { Employee, CareRole, DayOfWeek, DayAvailability } from '../../types/omsorg';
import { useLanguage } from '../../context/LanguageContext';
import { X, User, Phone, Mail, Clock, DollarSign, Award, Check } from 'lucide-react';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeData: Omit<Employee, 'id'>) => void;
  initialData?: Employee | null;
}

const AVAILABLE_ROLES: CareRole[] = [
  'Undersköterska',
  'Vårdbiträde',
  'Sjuksköterska',
  'Personlig assistent',
  'Boendestödjare'
];

const DAYS: { key: DayOfWeek; labelSv: string; labelEn: string }[] = [
  { key: 'monday', labelSv: 'Mån', labelEn: 'Mon' },
  { key: 'tuesday', labelSv: 'Tis', labelEn: 'Tue' },
  { key: 'wednesday', labelSv: 'Ons', labelEn: 'Wed' },
  { key: 'thursday', labelSv: 'Tor', labelEn: 'Thu' },
  { key: 'friday', labelSv: 'Fre', labelEn: 'Fri' },
  { key: 'saturday', labelSv: 'Lör', labelEn: 'Sat' },
  { key: 'sunday', labelSv: 'Sön', labelEn: 'Sun' },
];

const AVATAR_COLORS = [
  '#0284c7', // Sky
  '#059669', // Emerald
  '#d97706', // Amber
  '#4f46e5', // Indigo
  '#e11d48', // Rose
  '#0d9488', // Teal
  '#7c3aed', // Purple
];

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const { language, t } = useLanguage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [maxHoursPerWeek, setMaxHoursPerWeek] = useState(40);
  const [hourlyRate, setHourlyRate] = useState(190);
  const [bonus, setBonus] = useState(1000);
  const [roles, setRoles] = useState<CareRole[]>(['Undersköterska']);
  const [avatarColor, setAvatarColor] = useState('#0284c7');
  const [status, setStatus] = useState<'active' | 'on_leave' | 'inactive'>('active');
  const [notes, setNotes] = useState('');

  const [availability, setAvailability] = useState<Record<DayOfWeek, DayAvailability>>({
    monday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
    tuesday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
    wednesday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
    thursday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
    friday: { available: true, canWorkMorgon: true, canWorkLunch: true, canWorkKvall: true },
    saturday: { available: false, canWorkMorgon: false, canWorkLunch: false, canWorkKvall: false },
    sunday: { available: false, canWorkMorgon: false, canWorkLunch: false, canWorkKvall: false },
  });

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPhone(initialData.phone);
      setEmail(initialData.email);
      setMaxHoursPerWeek(initialData.maxHoursPerWeek);
      setHourlyRate(initialData.hourlyRate);
      setBonus(initialData.bonus || 0);
      setRoles(initialData.roles);
      setAvatarColor(initialData.avatarColor || '#0284c7');
      setStatus(initialData.status);
      setNotes(initialData.notes || '');
      if (initialData.availability) {
        setAvailability(initialData.availability);
      }
    } else {
      // Defaults for new employee
      setName('');
      setPhone('');
      setEmail('');
      setMaxHoursPerWeek(40);
      setHourlyRate(190);
      setBonus(1000);
      setRoles(['Undersköterska']);
      setAvatarColor('#0284c7');
      setStatus('active');
      setNotes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const toggleRole = (role: CareRole) => {
    if (roles.includes(role)) {
      if (roles.length > 1) {
        setRoles(roles.filter(r => r !== role));
      }
    } else {
      setRoles([...roles, role]);
    }
  };

  const toggleDay = (day: DayOfWeek) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day]?.available,
        canWorkMorgon: !prev[day]?.available,
        canWorkLunch: !prev[day]?.available,
        canWorkKvall: !prev[day]?.available
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      maxHoursPerWeek: Number(maxHoursPerWeek) || 40,
      roles,
      hourlyRate: Number(hourlyRate) || 0,
      bonus: Number(bonus) || 0,
      avatarColor,
      status,
      notes: notes.trim(),
      availability
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData 
                  ? (language === 'sv' ? 'Redigera personal' : 'Edit Employee') 
                  : (language === 'sv' ? 'Lägg till ny anställd' : 'Add New Employee')}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'sv' ? 'Fyll i personuppgifter, lön, maxtid och tillgänglighet' : 'Enter details, wages, max hours and availability'}
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Row 1: Name & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('empName')} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="t.ex. Anna Lindberg"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('empStatus')}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="active">{language === 'sv' ? 'Aktiv i tjänst' : 'Active'}</option>
                <option value="on_leave">{language === 'sv' ? 'Tjänstledig / Sjuk' : 'On Leave'}</option>
                <option value="inactive">{language === 'sv' ? 'Inaktiv' : 'Inactive'}</option>
              </select>
            </div>
          </div>

          {/* Row 2: Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('empPhone')}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="070-123 45 67"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('empEmail')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="namn@omsorg.se"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Max Hours (40h), Hourly Rate & Bonus */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              {language === 'sv' ? 'Arbetstid & Löneparametrar' : 'Hours & Payroll Settings'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Max Hours per week */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('empMaxHours')}
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={maxHoursPerWeek}
                    onChange={(e) => setMaxHoursPerWeek(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-semibold"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Standard: 40h/vecka</span>
              </div>

              {/* Hourly rate */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('empHourlyRate')}
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-semibold"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Grundlön per timme</span>
              </div>

              {/* Bonus / Extra */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('empBonus')}
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-amber-500 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={bonus}
                    onChange={(e) => setBonus(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-semibold"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Fast extra tillägg / vecka</span>
              </div>

            </div>
          </div>

          {/* Row 4: Roles / Skills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              {t('empRoles')} * ({language === 'sv' ? 'Välj en eller flera' : 'Select one or more'})
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_ROLES.map((role) => {
                const isSelected = roles.includes(role);
                return (
                  <button
                    type="button"
                    key={role}
                    onClick={() => toggleRole(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-sky-100 border-sky-400 text-sky-800 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-sky-600" />}
                    <span>{role}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 5: Weekly Availability Matrix */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              {t('empAvailability')} ({language === 'sv' ? 'Klicka på dagar personalen kan arbeta' : 'Toggle working days'})
            </label>
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS.map((d) => {
                const isAvail = availability[d.key]?.available;
                return (
                  <button
                    type="button"
                    key={d.key}
                    onClick={() => toggleDay(d.key)}
                    className={`py-2 text-center rounded-lg border text-xs font-semibold transition cursor-pointer ${
                      isAvail
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <div>{language === 'sv' ? d.labelSv : d.labelEn}</div>
                    <div className="text-[10px] mt-0.5 font-normal">
                      {isAvail ? (language === 'sv' ? 'Ja' : 'Yes') : (language === 'sv' ? 'Nej' : 'No')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 6: Avatar Color & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {language === 'sv' ? 'Färgmarkering' : 'Color Tag'}
              </label>
              <div className="flex items-center space-x-1.5">
                {AVATAR_COLORS.map((col) => (
                  <button
                    type="button"
                    key={col}
                    onClick={() => setAvatarColor(col)}
                    className={`w-6 h-6 rounded-full transition cursor-pointer ${
                      avatarColor === col ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : ''
                    }`}
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'sv' ? 'Övriga anteckningar' : 'Notes'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'sv' ? 't.ex. Specialist på demens, körkort' : 'e.g. Special training, driver license'}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Footer Buttons */}
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
