import React, { useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useOmsorg } from '../../context/OmsorgContext';
import { HeartPulse, Globe, RotateCcw, Download, Upload, Sparkles, AlertTriangle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { resetToSampleData, exportBackupJSON, importBackupJSON, autoScheduleShifts, stats, getAllConflicts } = useOmsorg();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const conflicts = getAllConflicts();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importBackupJSON(content);
        if (success) {
          alert(language === 'sv' ? 'Data importerades framgångsrikt!' : 'Data imported successfully!');
        } else {
          alert(language === 'sv' ? 'Kunde inte läsa JSON-filen. Kontrollera formatet.' : 'Could not import JSON file. Invalid format.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleAutoSchedule = () => {
    const res = autoScheduleShifts();
    if (res.unassignedCount === 0) {
      alert(language === 'sv' 
        ? `Autoschemaläggning klar! ${res.assignedCount} pass tillsattes utan konflikter.` 
        : `Auto-scheduling complete! ${res.assignedCount} shifts assigned.`);
    } else {
      alert(language === 'sv' 
        ? `Autoschemaläggning klar. ${res.assignedCount} pass tillsattes. ${res.unassignedCount} pass kunde inte tillsättas pga begränsningar (max 40h/v eller behörighet).` 
        : `Auto-scheduling done. ${res.assignedCount} shifts assigned, ${res.unassignedCount} remain unassigned due to constraints.`);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight text-slate-900">
                  {t('appTitle')}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                  Omsorg 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {t('appSubtitle')}
              </p>
            </div>
          </div>

          {/* Conflict Alert Banner if any */}
          {conflicts.length > 0 && (
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{conflicts.length} {language === 'sv' ? 'schemakonflikter / varningar upptäckta' : 'roster warnings detected'}</span>
            </div>
          )}

          {/* Action Tools & Language Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* 1-Click Auto Scheduler Button */}
            {stats.unassignedShifts > 0 && (
              <button
                onClick={handleAutoSchedule}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm transition-all cursor-pointer"
                title="Tillsätt alla lediga pass automatiskt med hänsyn till 40h gräns och kompetens"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('autoSchedule')} ({stats.unassignedShifts})</span>
              </button>
            )}

            {/* Quick Data Actions Dropdown / Buttons */}
            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
              <button
                onClick={resetToSampleData}
                title={t('resetData')}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition text-xs flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{language === 'sv' ? 'Återställ' : 'Reset'}</span>
              </button>

              <div className="h-4 w-px bg-slate-200 mx-0.5" />

              <button
                onClick={exportBackupJSON}
                title={t('exportData')}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition text-xs flex items-center space-x-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">JSON</span>
              </button>

              <button
                onClick={handleImportClick}
                title={t('importData')}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition text-xs flex items-center space-x-1 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>

            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              <button
                onClick={() => setLanguage('sv')}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  language === 'sv' 
                    ? 'bg-white text-sky-700 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                SV
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  language === 'en' 
                    ? 'bg-white text-sky-700 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
