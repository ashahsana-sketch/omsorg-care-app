import React, { useState, useEffect } from 'react';
import { Customer, CareRole } from '../../types/omsorg';
import { useLanguage } from '../../context/LanguageContext';
import { X, HeartHandshake, MapPin, Phone, Key, FileText, UserCheck } from 'lucide-react';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerData: Omit<Customer, 'id'>) => void;
  initialData?: Customer | null;
}

const CARE_LEVELS: Customer['careLevel'][] = ['Bas', 'Medel', 'Hög', 'Dubbelbemanning'];
const ROLES: CareRole[] = ['Undersköterska', 'Vårdbiträde', 'Sjuksköterska', 'Personlig assistent', 'Boendestödjare'];

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const { language, t } = useLanguage();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [postalArea, setPostalArea] = useState('Stockholm');
  const [phone, setPhone] = useState('');
  const [requiredRole, setRequiredRole] = useState<CareRole>('Undersköterska');
  const [careLevel, setCareLevel] = useState<Customer['careLevel']>('Medel');
  const [doorCode, setDoorCode] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAddress(initialData.address);
      setPostalArea(initialData.postalArea);
      setPhone(initialData.phone);
      setRequiredRole(initialData.requiredRole);
      setCareLevel(initialData.careLevel);
      setDoorCode(initialData.doorCode || '');
      setContactPerson(initialData.contactPerson || '');
      setNotes(initialData.notes);
    } else {
      setName('');
      setAddress('');
      setPostalArea('Stockholm');
      setPhone('');
      setRequiredRole('Undersköterska');
      setCareLevel('Medel');
      setDoorCode('');
      setContactPerson('');
      setNotes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      address: address.trim(),
      postalArea: postalArea.trim(),
      phone: phone.trim(),
      requiredRole,
      careLevel,
      doorCode: doorCode.trim(),
      contactPerson: contactPerson.trim(),
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
            <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData 
                  ? (language === 'sv' ? 'Redigera brukare' : 'Edit Client Profile') 
                  : (language === 'sv' ? 'Lägg till ny brukare / kund' : 'Add New Client')}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'sv' ? 'Adress, vårdkrav, portkod och anhörigkontakt' : 'Address, care level, access and notes'}
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
          
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('custName')} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="t.ex. Astrid Karlsson"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Address & Postal Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('custAddress')} *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="t.ex. Storgatan 14, 2 tr"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('custPostal')}
              </label>
              <input
                type="text"
                value={postalArea}
                onChange={(e) => setPostalArea(e.target.value)}
                placeholder="114 55 Stockholm"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Required Role & Care Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('custReqRole')}
              </label>
              <select
                value={requiredRole}
                onChange={(e) => setRequiredRole(e.target.value as CareRole)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('custCareLevel')}
              </label>
              <select
                value={careLevel}
                onChange={(e) => setCareLevel(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                {CARE_LEVELS.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Door Code / Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('custDoorCode')}
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={doorCode}
                  onChange={(e) => setDoorCode(e.target.value)}
                  placeholder="t.ex. Portkod 4482 / Nyckelbox"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('custPhone')}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08-112 233"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Next of Kin */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('custContact')}
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="t.ex. Dotter Karin (070-332 211)"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Care Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('custNotes')}
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'sv' ? 'Morgonrutin, medicinering, rullstol, lyft...' : 'Care instructions, medication...'}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
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
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition cursor-pointer"
            >
              {t('save')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
