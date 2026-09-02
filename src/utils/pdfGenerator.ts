import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EmployeePayroll } from '../types/omsorg';
import { formatSEK } from './payroll';

export function generatePayslipPDF(payroll: EmployeePayroll): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Colors
  const primaryColor: [number, number, number] = [2, 132, 199]; // brand sky blue
  const darkText: [number, number, number] = [30, 41, 59];
  const grayText: [number, number, number] = [100, 116, 139];

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('OMSORG VÅRDTJÄNSTER AB', 14, 13);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Org.nr: 556123-4567 | Godkänd för F-skatt', 14, 19);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('LÖNESPECIFIKATION', pageWidth - 14, 15, { align: 'right' });

  // Employee & Period Details Section
  let y = 34;

  // Box for details
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, pageWidth - 28, 32, 2, 2, 'FD');

  doc.setTextColor(...darkText);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('ANSTÄLLD INFORMATION', 18, y + 6);
  doc.text('LÖNEPERIOD & UTBETALNING', pageWidth / 2 + 10, y + 6);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayText);
  
  // Left col
  doc.text(`Namn:`, 18, y + 13);
  doc.setTextColor(...darkText);
  doc.setFont('helvetica', 'bold');
  doc.text(`${payroll.employee.name}`, 35, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayText);
  doc.text(`Roll:`, 18, y + 19);
  doc.setTextColor(...darkText);
  doc.text(`${payroll.employee.roles.join(', ')}`, 35, y + 19);

  doc.setTextColor(...grayText);
  doc.text(`Kontakt:`, 18, y + 25);
  doc.setTextColor(...darkText);
  doc.text(`${payroll.employee.phone} | ${payroll.employee.email}`, 35, y + 25);

  // Right col
  doc.setTextColor(...grayText);
  doc.text(`Period:`, pageWidth / 2 + 10, y + 13);
  doc.setTextColor(...darkText);
  doc.setFont('helvetica', 'bold');
  doc.text(`${payroll.startDate} till ${payroll.endDate}`, pageWidth / 2 + 35, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayText);
  doc.text(`Avtalad timlön:`, pageWidth / 2 + 10, y + 19);
  doc.setTextColor(...darkText);
  doc.text(`${payroll.hourlyRate} SEK / timme`, pageWidth / 2 + 35, y + 19);

  doc.setTextColor(...grayText);
  doc.text(`Arbetstidsmått:`, pageWidth / 2 + 10, y + 25);
  doc.setTextColor(...darkText);
  doc.text(`Max ${payroll.maxHoursPerWeek} h/vecka (Utfall: ${payroll.totalHours} h)`, pageWidth / 2 + 35, y + 25);

  y += 38;

  // Table of Shifts
  const tableData = payroll.shifts.map(shift => [
    shift.date,
    shift.customerName,
    shift.location,
    shift.timeWindow,
    `${shift.hours} h`,
    `${shift.hourlyRate} kr`,
    formatSEK(shift.subtotal)
  ]);

  if (tableData.length === 0) {
    tableData.push(['-', 'Inga arbetspass registrerade', '-', '-', '0 h', `${payroll.hourlyRate} kr`, '0 kr']);
  }

  autoTable(doc, {
    startY: y,
    head: [['Datum', 'Brukare', 'Plats / Adress', 'Tid', 'Timmar', 'Timlön', 'Belopp']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2.5,
      textColor: [30, 41, 59]
    },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 32 },
      2: { cellWidth: 48 },
      3: { cellWidth: 24 },
      4: { cellWidth: 16, halign: 'right' },
      5: { cellWidth: 18, halign: 'right' },
      6: { cellWidth: 22, halign: 'right' }
    }
  });

  // Calculate final Y position after table
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  // Summary box
  const summaryBoxWidth = 90;
  const summaryBoxX = pageWidth - summaryBoxWidth - 14;

  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(summaryBoxX, finalY, summaryBoxWidth, 48, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);

  // Subtotal lines
  let rowY = finalY + 7;
  doc.text(`Grundlön (${payroll.totalHours} h × ${payroll.hourlyRate} kr):`, summaryBoxX + 5, rowY);
  doc.text(formatSEK(payroll.basePay), summaryBoxX + summaryBoxWidth - 5, rowY, { align: 'right' });

  rowY += 6;
  doc.text(`Extra bonus & tillägg:`, summaryBoxX + 5, rowY);
  doc.text(formatSEK(payroll.bonus), summaryBoxX + summaryBoxWidth - 5, rowY, { align: 'right' });

  rowY += 6;
  doc.setFont('helvetica', 'bold');
  doc.text(`Bruttolön:`, summaryBoxX + 5, rowY);
  doc.text(formatSEK(payroll.grossPay), summaryBoxX + summaryBoxWidth - 5, rowY, { align: 'right' });

  rowY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayText);
  doc.text(`Prel. skatteavdrag (${payroll.taxRatePercent}%):`, summaryBoxX + 5, rowY);
  doc.text(`- ${formatSEK(payroll.taxDeduction)}`, summaryBoxX + summaryBoxWidth - 5, rowY, { align: 'right' });

  // Divider
  doc.setDrawColor(203, 213, 225);
  doc.line(summaryBoxX + 5, rowY + 3, summaryBoxX + summaryBoxWidth - 5, rowY + 3);

  // Net Pay highlight
  rowY += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105); // Emerald green
  doc.text(`NETTOLÖN ATT UTBETALA:`, summaryBoxX + 5, rowY);
  doc.text(formatSEK(payroll.netPay), summaryBoxX + summaryBoxWidth - 5, rowY, { align: 'right' });

  // Footer notes
  const footerY = 280;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayText);
  doc.text('Detta dokument är upprättat automatiskt via OmsorgHub lönemodul. Vid frågor, kontakta löneadministrationen.', 14, footerY);
  doc.text(`Genererad: ${new Date().toLocaleDateString('sv-SE')} | Sida 1 av 1`, pageWidth - 14, footerY, { align: 'right' });

  return doc;
}

export function downloadPayslipPDF(payroll: EmployeePayroll): void {
  const doc = generatePayslipPDF(payroll);
  const fileName = `Lonespecifikation_${payroll.employee.name.replace(/\s+/g, '_')}_${payroll.startDate}.pdf`;
  doc.save(fileName);
}

export function exportPayrollToCSV(payrolls: EmployeePayroll[]): void {
  const headers = [
    'Anställd ID',
    'Namn',
    'Roller',
    'Telefon',
    'E-post',
    'Timlön (SEK)',
    'Max timmar/v',
    'Arbetade timmar',
    'Grundlön (SEK)',
    'Bonus (SEK)',
    'Bruttolön (SEK)',
    'Prel. Skatt (30%)',
    'Nettolön (SEK)'
  ];

  const rows = payrolls.map(p => [
    `"${p.employee.id}"`,
    `"${p.employee.name}"`,
    `"${p.employee.roles.join(', ')}"`,
    `"${p.employee.phone}"`,
    `"${p.employee.email}"`,
    p.hourlyRate,
    p.maxHoursPerWeek,
    p.totalHours,
    p.basePay,
    p.bonus,
    p.grossPay,
    p.taxDeduction,
    p.netPay
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Omsorg_Lonesammanstallning_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
