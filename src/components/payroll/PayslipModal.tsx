import React from 'react';
import { EmployeePayroll } from '../../types/omsorg';
import { useLanguage } from '../../context/LanguageContext';
import { formatSEK } from '../../utils/payroll';
import { downloadPayslipPDF } from '../../utils/pdfGenerator';
import { X, Download, Printer, ReceiptText, Building2 } from 'lucide-react';

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  payroll: EmployeePayroll | null;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  isOpen,
  onClose,
  payroll
}) => {
  const { language, t } = useLanguage();

  if (!isOpen || !payroll) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    downloadPayslipPDF(payroll);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Controls Header (Hidden during Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
              <ReceiptText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'sv' ? 'Lönespecifikation' : 'Salary Slip Preview'} — {payroll.employee.name}
              </h3>
              <p className="text-xs text-slate-500">
                {payroll.periodName} ({payroll.startDate} till {payroll.endDate})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>{t('print')}</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t('downloadPdf')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Swedish Payslip Container */}
        <div id="printable-payslip" className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible">
          
          {/* Company & Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b-2 border-slate-900 pb-4 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-sky-700">
                <Building2 className="w-6 h-6" />
                <span className="text-xl font-black tracking-tight text-slate-900">OMSORG VÅRDTJÄNSTER AB</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {t('salaryOrgNr')}
              </p>
              <p className="text-xs text-slate-500">
                Sveavägen 42, 111 34 Stockholm | info@omsorgsvard.se
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-lg font-extrabold text-slate-900 block tracking-wider">
                LÖNESPECIFIKATION
              </span>
              <span className="text-xs font-semibold text-slate-600 block mt-0.5">
                Period: {payroll.startDate} – {payroll.endDate}
              </span>
              <span className="text-[11px] text-slate-500 block">
                Utbetalningsdatum: {new Date().toLocaleDateString('sv-SE')}
              </span>
            </div>
          </div>

          {/* Employee & Agreement Details Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase text-slate-400">Anställd Information</div>
              <div className="font-bold text-sm text-slate-900">{payroll.employee.name}</div>
              <div className="text-slate-600"><span className="font-medium">Roll:</span> {payroll.employee.roles.join(', ')}</div>
              <div className="text-slate-600"><span className="font-medium">Telefon:</span> {payroll.employee.phone}</div>
              <div className="text-slate-600"><span className="font-medium">E-post:</span> {payroll.employee.email}</div>
            </div>

            <div className="space-y-1.5 sm:border-l sm:border-slate-200 sm:pl-4">
              <div className="text-[10px] font-bold uppercase text-slate-400">Avtal & Arbetstidsmått</div>
              <div className="text-slate-700">
                <span className="font-medium">Avtalad timlön:</span> <span className="font-bold text-slate-900">{payroll.hourlyRate} kr / timme</span>
              </div>
              <div className="text-slate-700">
                <span className="font-medium">Veckoarbetstid:</span> Max {payroll.maxHoursPerWeek} h/vecka
              </div>
              <div className="text-slate-700">
                <span className="font-medium">Faktiskt utfall:</span> <span className="font-bold text-sky-700">{payroll.totalHours.toFixed(1)} arbetade timmar</span>
              </div>
              <div className="text-slate-700">
                <span className="font-medium">Skattekolumn:</span> Tabell 30 (Prel. skatt 30%)
              </div>
            </div>
          </div>

          {/* Shifts Itemized Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              {t('itemizedShifts')}
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Datum</th>
                    <th className="py-2.5 px-3">Brukare</th>
                    <th className="py-2.5 px-3">Plats / Adress</th>
                    <th className="py-2.5 px-3">Tid</th>
                    <th className="py-2.5 px-3 text-right">Timmar</th>
                    <th className="py-2.5 px-3 text-right">Timlön</th>
                    <th className="py-2.5 px-3 text-right">Belopp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {payroll.shifts.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-medium">{item.date}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900">{item.customerName}</td>
                      <td className="py-2 px-3 text-slate-500">{item.location}</td>
                      <td className="py-2 px-3 font-mono">{item.timeWindow}</td>
                      <td className="py-2 px-3 text-right font-medium">{item.hours}h</td>
                      <td className="py-2 px-3 text-right">{item.hourlyRate} kr</td>
                      <td className="py-2 px-3 text-right font-semibold">{formatSEK(item.subtotal)}</td>
                    </tr>
                  ))}
                  {payroll.shifts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-slate-400">
                        Inga utförda arbetspass under denna period
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payroll Breakdown Summary Box */}
          <div className="flex justify-end">
            <div className="w-full sm:w-80 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              
              {/* Base Pay */}
              <div className="flex justify-between text-slate-700">
                <span>{t('baseSalary')} ({payroll.totalHours}h):</span>
                <span className="font-semibold">{formatSEK(payroll.basePay)}</span>
              </div>

              {/* Bonus */}
              <div className="flex justify-between text-slate-700">
                <span>{t('bonusPay')}:</span>
                <span className="font-semibold text-amber-700">+{formatSEK(payroll.bonus)}</span>
              </div>

              {/* Gross Pay */}
              <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-2 text-sm">
                <span>{t('grossPay')}:</span>
                <span>{formatSEK(payroll.grossPay)}</span>
              </div>

              {/* Tax Deduction */}
              <div className="flex justify-between text-slate-500">
                <span>{t('taxDeduction')}:</span>
                <span>- {formatSEK(payroll.taxDeduction)}</span>
              </div>

              {/* Net Pay Box */}
              <div className="border-t-2 border-slate-900 pt-2 mt-2 flex justify-between items-center">
                <span className="font-extrabold text-sm text-emerald-800 uppercase tracking-tight">
                  {t('netPay')}:
                </span>
                <span className="font-extrabold text-lg text-emerald-700">
                  {formatSEK(payroll.netPay)}
                </span>
              </div>

            </div>
          </div>

          {/* Footer certification */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span>Upprättad med OmsorgHub System | Verifierad lönespecifikation</span>
            <span>Godkänd av behörig schemaläggare</span>
          </div>

        </div>

      </div>
    </div>
  );
};
