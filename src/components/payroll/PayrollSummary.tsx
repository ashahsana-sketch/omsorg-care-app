import React, { useState } from 'react';
import { EmployeePayroll } from '../../types/omsorg';
import { useOmsorg } from '../../context/OmsorgContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatSEK } from '../../utils/payroll';
import { downloadPayslipPDF, exportPayrollToCSV } from '../../utils/pdfGenerator';
import { PayslipModal } from './PayslipModal';
import { 
  Download, 
  FileSpreadsheet, 
  Award, 
  Clock, 
  Eye 
} from 'lucide-react';

export const PayrollSummary: React.FC = () => {
  const { getEmployeePayrolls } = useOmsorg();
  const { language, t } = useLanguage();

  const [selectedPayroll, setSelectedPayroll] = useState<EmployeePayroll | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const payrolls = getEmployeePayrolls();

  const totalGross = payrolls.reduce((sum, p) => sum + p.grossPay, 0);
  const totalBase = payrolls.reduce((sum, p) => sum + p.basePay, 0);
  const totalBonus = payrolls.reduce((sum, p) => sum + p.bonus, 0);
  const totalTax = payrolls.reduce((sum, p) => sum + p.taxDeduction, 0);
  const totalNet = payrolls.reduce((sum, p) => sum + p.netPay, 0);
  const totalHours = payrolls.reduce((sum, p) => sum + p.totalHours, 0);

  const handleOpenPayslip = (p: EmployeePayroll) => {
    setSelectedPayroll(p);
    setIsModalOpen(true);
  };

  const handleExportCSV = () => {
    exportPayrollToCSV(payrolls);
  };

  const handleDownloadAllPDFs = () => {
    payrolls.forEach((p, idx) => {
      setTimeout(() => {
        downloadPayslipPDF(p);
      }, idx * 300);
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {t('payrollTitle')}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'sv' 
              ? 'Löneberäkning (Arbetade timmar × Timlön + Bonus) och fullständiga svenska lönespecifikationer.'
              : 'Salary calculations (Worked hours × Rate + Bonus) with Swedish salary slip PDFs.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>{t('exportCsv')}</span>
          </button>

          <button
            onClick={handleDownloadAllPDFs}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'sv' ? 'Ladda ner alla PDF' : 'Download All PDFs'}</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {language === 'sv' ? 'Arbetade timmar' : 'Total Hours'}
          </span>
          <div className="mt-1 text-2xl font-bold text-slate-900 flex items-center space-x-1.5">
            <Clock className="w-5 h-5 text-sky-600" />
            <span>{totalHours.toFixed(1)} h</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {language === 'sv' ? 'Denna löneperiod' : 'This pay period'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {language === 'sv' ? 'Grundlön (Totalt)' : 'Base Pay'}
          </span>
          <div className="mt-1 text-2xl font-bold text-slate-900">
            {formatSEK(totalBase)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {language === 'sv' ? 'Timmar × avtalad timlön' : 'Hours × base rate'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {language === 'sv' ? 'Bonus & Tillägg' : 'Total Bonuses'}
          </span>
          <div className="mt-1 text-2xl font-bold text-amber-700 flex items-center space-x-1">
            <Award className="w-5 h-5 text-amber-500" />
            <span>+{formatSEK(totalBonus)}</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {language === 'sv' ? 'Fast bonus + passbonus' : 'Fixed bonus + shifts'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {t('netPay')}
          </span>
          <div className="mt-1 text-2xl font-extrabold text-emerald-700">
            {formatSEK(totalNet)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {language === 'sv' ? `Brutto: ${formatSEK(totalGross)} (Skatt: ${formatSEK(totalTax)})` : `Gross: ${formatSEK(totalGross)}`}
          </span>
        </div>

      </div>

      {/* Main Payroll Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            {language === 'sv' ? 'Lönesammanställning per anställd' : 'Payroll Breakdown per Employee'}
          </h3>
          <span className="text-xs text-slate-500">
            {payrolls.length} {language === 'sv' ? 'lönebesked klara' : 'payslips ready'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{t('empName')}</th>
                <th className="py-3 px-3">{t('empRoles')}</th>
                <th className="py-3 px-3 text-right">{t('empHourlyRate')}</th>
                <th className="py-3 px-3 text-right">{t('workedHours')}</th>
                <th className="py-3 px-3 text-right">{t('baseSalary')}</th>
                <th className="py-3 px-3 text-right">{t('bonusPay')}</th>
                <th className="py-3 px-3 text-right font-bold">{t('grossPay')}</th>
                <th className="py-3 px-3 text-right text-slate-500">{t('taxDeduction')}</th>
                <th className="py-3 px-3 text-right font-bold text-emerald-700">{t('netPay')}</th>
                <th className="py-3 px-4 text-center">{language === 'sv' ? 'Lönespecifikation' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {payrolls.map((p) => (
                <tr key={p.employee.id} className="hover:bg-slate-50 transition">
                  
                  {/* Name */}
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center space-x-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: p.employee.avatarColor || '#0284c7' }} 
                      />
                      <span>{p.employee.name}</span>
                    </div>
                  </td>

                  {/* Roles */}
                  <td className="py-3.5 px-3">
                    <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {p.employee.roles[0]}
                    </span>
                  </td>

                  {/* Rate */}
                  <td className="py-3.5 px-3 text-right font-mono font-medium">
                    {p.hourlyRate} kr
                  </td>

                  {/* Hours */}
                  <td className="py-3.5 px-3 text-right font-semibold">
                    <span className={p.isOverLimit ? 'text-rose-600 font-bold' : 'text-slate-900'}>
                      {p.totalHours.toFixed(1)} h
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">
                      max {p.maxHoursPerWeek}h
                    </span>
                  </td>

                  {/* Base Pay */}
                  <td className="py-3.5 px-3 text-right font-mono">
                    {formatSEK(p.basePay)}
                  </td>

                  {/* Bonus */}
                  <td className="py-3.5 px-3 text-right font-mono font-semibold text-amber-700">
                    +{formatSEK(p.bonus)}
                  </td>

                  {/* Gross */}
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                    {formatSEK(p.grossPay)}
                  </td>

                  {/* Tax */}
                  <td className="py-3.5 px-3 text-right font-mono text-slate-500">
                    -{formatSEK(p.taxDeduction)}
                  </td>

                  {/* Net Pay */}
                  <td className="py-3.5 px-3 text-right font-mono font-extrabold text-emerald-700">
                    {formatSEK(p.netPay)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => handleOpenPayslip(p)}
                        className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold transition cursor-pointer flex items-center space-x-1"
                        title={t('previewPayslip')}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{language === 'sv' ? 'Visa' : 'View'}</span>
                      </button>

                      <button
                        onClick={() => downloadPayslipPDF(p)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                        title={t('downloadPdf')}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Payslip View */}
      <PayslipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        payroll={selectedPayroll}
      />

    </div>
  );
};
