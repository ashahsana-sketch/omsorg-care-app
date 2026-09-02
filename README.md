# OmsorgHub (CareHub)

**OmsorgHub** is a comprehensive Swedish care management and rostering platform tailored for home care services (*hemtjänst*) and elderly care facilities (*äldreomsorg*). Built with React, TypeScript, and Tailwind CSS, it streamlines shift scheduling, capacity tracking, client allocation, and payroll calculation.

---

## Preview

### Dashboard Overview
![Dashboard Overview](https://raw.githubusercontent.com/ashahsana-sketch/omsorg-care-app/main/src/Dashboard.jpg)
*Real-time metrics, care capacity progress tracking, and total payroll estimates.*

---

### Care Team & Employees
![Employee Management](https://raw.githubusercontent.com/ashahsana-sketch/omsorg-care-app/main/src/Employee.jpg)
*Manage staff profiles, hourly rates, roles, and allocated hours per week.*

---

### Shift Scheduling & Roster
![Create Care Shift](https://raw.githubusercontent.com/ashahsana-sketch/omsorg-care-app/main/src/assign_job%20form.jpg)
*Modal interface to assign care shifts, manage bonuses, and resolve staff availability warnings.*

---

### Automatic Swedish Payslip Generation
> **Sample Document:** [View PDF Payslip (Lönespecifikation)](https://github.com/ashahsana-sketch/omsorg-care-app/blob/main/src/Lonespecifikation_Anna_Lindberg_2026-08-31.pdf)[cite: 6]

---

## Key Features

- **Interactive Dashboard:** High-level overview of total staff, active care receivers, total scheduled hours, and real-time payroll estimates[cite: 5]. Includes progress bars tracking weekly employee hour caps (e.g., 40h/week limit)[cite: 5].
- **Staff & Care Team Management:** Detailed employee profiles tracking assigned roles (*Undersköterska*, *Vårdbiträde*, *Sjuksköterska*, *Personlig assistent*), contact details, hourly rates, and extra shift bonuses[cite: 5, 6].
- **Client / Care Receiver Portal:** Directory of clients with addresses, specific care needs, and quick actions to assign dedicated shifts[cite: 5].
- **Roster & Shift Scheduling:** Modal-driven shift builder with built-in validation (e.g., availability alerts, max hour warnings, extra shift bonus inputs)[cite: 5].
- **Payroll & Payslip Generation:** Automatic gross/net salary calculations (including preliminary 30% tax deductions and bonuses) with printable PDF payslip support (*Lönespecifikation*)[cite: 5, 6].
- **Multi-language Support:** Built-in internationalization context supporting Swedish (SV) and English (EN)[cite: 5].

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide React (Icons)
- **State Management:** React Context API (`OmsorgContext`, `LanguageContext`)
- **Document Generation:** PDF generation for Swedish payslips (*Lönespecifikation*)

---

## Project Structure

```text
src/
├── components/
│   ├── customers/       # Care receivers list and modals
│   ├── dashboard/       # Stats overview and capacity progress bars
│   ├── employees/       # Care team cards, profiles, and modals
│   ├── layout/          # Navbar and tab navigation
│   ├── payroll/         # Salary summaries and payslip preview/export
│   └── roster/          # Weekly shift view and shift assignment modals
├── context/
│   ├── LanguageContext.tsx  # SV/EN translation context
│   └── OmsorgContext.tsx    # State management for employees, clients, shifts & payroll
├── types/
│   └── omsorg.ts        # TypeScript interfaces (Employee, Customer, Shift, Payroll)
├── App.tsx              # Main entry layout component
└── main.tsx             # Application bootstrap
