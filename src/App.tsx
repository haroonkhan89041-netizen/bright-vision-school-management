import { useState } from "react";
import { BarChart3, Bell, BookOpen, CalendarDays, ChevronLeft, ClipboardCheck, GraduationCap, LayoutDashboard, LogOut, Menu, Settings, Users, WalletCards } from "lucide-react";

const nav = [
  ["Dashboard", LayoutDashboard], ["Students", GraduationCap], ["Teachers", Users], ["Classes", BookOpen],
  ["Attendance", ClipboardCheck], ["Fees", WalletCards], ["Exams & Results", BarChart3], ["Timetable", CalendarDays],
  ["Notices", Bell], ["Settings", Settings],
] as const;

export default function App() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="app">
      <aside className={`sidebar ${open ? "" : "collapsed"}`}>
        <div className="brand"><div className="logo">BV</div>{open && <div><strong>Bright Vision</strong><span>English School</span></div>}</div>
        <nav>{nav.map(([label, Icon]) => <button key={label} className={active === label ? "active" : ""} onClick={() => setActive(label)}><Icon size={19}/>{open && label}</button>)}</nav>
        <button className="logout"><LogOut size={19}/>{open && "Logout"}</button>
      </aside>
      <main className="main">
        <header><button className="icon-btn" onClick={() => setOpen(!open)}>{open ? <ChevronLeft/> : <Menu/>}</button><div className="header-title"><span>Bright Vision English School</span><small>Academic Session 2026 – 2027</small></div><button className="icon-btn"><Bell size={20}/></button></header>
        <section className="content">
          <div className="page-head"><div><h1>{active}</h1><p>Welcome back, Admin. Here is your school overview.</p></div><button className="primary">+ Add Student</button></div>
          <div className="stats"><Stat title="Total Students" value="486"/><Stat title="Total Teachers" value="8"/><Stat title="Total Classes" value="8"/><Stat title="Today's Attendance" value="92%"/><Stat title="Fee Collection" value="PKR 184,500"/><Stat title="Pending Fees" value="PKR 96,000"/></div>
          <div className="grid"><div className="panel"><h2>Attendance Overview</h2><div className="attendance"><b>92%</b><span>Present today</span><div className="bar"><i style={{width:"92%"}}/></div><small>Present 447 · Late 18 · Absent 21</small></div></div><div className="panel"><h2>Fee Overview</h2><div className="fee-row"><span>Collected</span><b>PKR 184,500</b></div><div className="fee-row"><span>Pending</span><b>PKR 72,000</b></div><div className="fee-row"><span>Overdue</span><b>PKR 24,000</b></div></div></div>
          <div className="grid"><div className="panel"><h2>Recent Students</h2><div className="item"><strong>Ali Khan</strong><span>Class 5 · Section A</span></div><div className="item"><strong>Fatima Raza</strong><span>Class 3 · Section B</span></div><div className="item"><strong>Hassan Sheikh</strong><span>Class 7 · Section A</span></div></div><div className="panel"><h2>Recent Notices</h2><div className="item"><strong>Parent–Teacher Meeting</strong><span>15 Aug 2026</span></div><div className="item"><strong>Independence Day Assembly</strong><span>14 Aug 2026</span></div><div className="item"><strong>Mid Term Datesheet Released</strong><span>10 Aug 2026</span></div></div></div>
        </section>
      </main>
    </div>
  );
}

function Stat({title,value}:{title:string,value:string}) { return <div className="stat"><span>{title}</span><strong>{value}</strong></div>; }
