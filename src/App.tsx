import { FormEvent, useMemo, useState } from "react";
import {
  BarChart3, Bell, BookOpen, CalendarDays, ChevronLeft, ClipboardCheck,
  GraduationCap, LayoutDashboard, LogOut, Menu, Search, Settings, Users,
  WalletCards, Plus, Pencil, Trash2, X
} from "lucide-react";

type Role = "admin" | "teacher" | "accountant" | "student" | "parent";
type Student = { id: number; name: string; father: string; className: string; section: string; roll: string; phone: string; status: "Active" | "Inactive" };

const demoUsers = [
  { email: "admin@brightvision.edu", password: "admin123", name: "Haroon Khan", role: "admin" as Role },
  { email: "teacher@brightvision.edu", password: "teacher123", name: "Ayesha Siddiqui", role: "teacher" as Role },
  { email: "accounts@brightvision.edu", password: "account123", name: "Faizan Sattar", role: "accountant" as Role },
  { email: "student@brightvision.edu", password: "student123", name: "Ali Khan", role: "student" as Role },
  { email: "parent@brightvision.edu", password: "parent123", name: "Muhammad Khan", role: "parent" as Role },
];

const initialStudents: Student[] = [
  { id: 1, name: "Ali Khan", father: "Muhammad Khan", className: "Class 5", section: "A", roll: "01", phone: "+92 300 1112233", status: "Active" },
  { id: 2, name: "Fatima Raza", father: "Nasir Raza", className: "Class 3", section: "B", roll: "02", phone: "+92 301 2223344", status: "Active" },
  { id: 3, name: "Hassan Sheikh", father: "Abdul Sheikh", className: "Class 7", section: "A", roll: "03", phone: "+92 302 3334455", status: "Active" },
  { id: 4, name: "Zainab Iqbal", father: "Shahid Iqbal", className: "Class 2", section: "A", roll: "04", phone: "+92 303 4445566", status: "Active" },
  { id: 5, name: "Usman Butt", father: "Tariq Butt", className: "Class 6", section: "B", roll: "05", phone: "+92 304 5556677", status: "Inactive" },
  { id: 6, name: "Maryam Javed", father: "Aslam Chaudhry", className: "Class 4", section: "A", roll: "06", phone: "+92 305 6667788", status: "Active" },
];

const nav = [
  ["Dashboard", LayoutDashboard], ["Students", GraduationCap], ["Teachers", Users], ["Classes", BookOpen],
  ["Attendance", ClipboardCheck], ["Fees", WalletCards], ["Exams & Results", BarChart3], ["Timetable", CalendarDays],
  ["Notices", Bell], ["Settings", Settings],
] as const;

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bv_user") || "null"); } catch { return null; }
  });
  if (!user) return <Login onLogin={setUser} />;
  return <Portal user={user} onLogout={() => { localStorage.removeItem("bv_user"); setUser(null); }} />;
}

function Login({ onLogin }: { onLogin: (user: typeof demoUsers[number]) => void }) {
  const [email, setEmail] = useState("admin@brightvision.edu");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = demoUsers.find(u => u.email === email.trim().toLowerCase() && u.password === password);
    if (!found) return setError("Invalid email or password. Demo admin: admin@brightvision.edu / admin123");
    localStorage.setItem("bv_user", JSON.stringify(found)); onLogin(found);
  };
  return <div className="login-page"><div className="login-card">
    <div className="login-brand"><div className="logo big">BV</div><div><h1>Bright Vision</h1><span>English School</span></div></div>
    <h2>Welcome back</h2><p className="muted">Sign in to School Management System</p>
    <form onSubmit={submit}>
      <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
      <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
      <div className="login-options"><label className="check"><input type="checkbox" defaultChecked /> Remember me</label><button type="button" className="link">Forgot password?</button></div>
      {error && <div className="error">{error}</div>}
      <button className="primary full">Login</button>
    </form>
    <div className="demo-box"><strong>Demo accounts</strong><span>Admin · Teacher · Accountant · Student · Parent</span></div>
  </div></div>;
}

function Portal({ user, onLogout }: { user: typeof demoUsers[number]; onLogout: () => void }) {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("Dashboard");
  const [students, setStudents] = useState(initialStudents);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const canManageStudents = user.role === "admin" || user.role === "teacher";

  const saveStudent = (s: Student) => {
    setStudents(current => s.id ? current.map(x => x.id === s.id ? s : x) : [...current, { ...s, id: Date.now() }]);
    setShowForm(false); setEditing(null);
  };
  const deleteStudent = (id: number) => { if (confirm("Delete this student? This action cannot be undone.")) setStudents(s => s.filter(x => x.id !== id)); };

  return <div className="app">
    <aside className={`sidebar ${open ? "" : "collapsed"}`}>
      <div className="brand"><div className="logo">BV</div>{open && <div><strong>Bright Vision</strong><span>English School</span></div>}</div>
      <nav>{nav.map(([label, Icon]) => <button key={label} className={active === label ? "active" : ""} onClick={() => setActive(label)}><Icon size={19}/>{open && label}</button>)}</nav>
      <div className="sidebar-bottom"><div className="school-mini"><strong>{open ? user.name : ""}</strong>{open && <span>{user.role}</span>}</div><button className="logout" onClick={onLogout}><LogOut size={19}/>{open && "Logout"}</button></div>
    </aside>
    <main className="main">
      <header><button className="icon-btn" onClick={() => setOpen(!open)}>{open ? <ChevronLeft/> : <Menu/>}</button><div className="header-title"><span>Bright Vision English School</span><small>Academic Session 2026 – 2027</small></div><button className="icon-btn"><Bell size={20}/></button></header>
      <section className="content">
        {active === "Students" ? <StudentsPage students={students} canManage={canManageStudents} onAdd={() => { setEditing(null); setShowForm(true); }} onEdit={s => { setEditing(s); setShowForm(true); }} onDelete={deleteStudent} /> : <Dashboard active={active} user={user} onAdd={() => { setActive("Students"); setShowForm(true); }} />}
      </section>
    </main>
    {showForm && <StudentForm student={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSave={saveStudent} />}
  </div>;
}

function Dashboard({ active, user, onAdd }: { active: string; user: typeof demoUsers[number]; onAdd: () => void }) {
  return <><div className="page-head"><div><h1>{active}</h1><p>Welcome back, {user.name}. Here is your school overview.</p></div>{(user.role === "admin" || user.role === "teacher") && <button className="primary" onClick={onAdd}><Plus size={17}/> Add Student</button>}</div>
    <div className="stats"><Stat title="Total Students" value="486"/><Stat title="Total Teachers" value="8"/><Stat title="Total Classes" value="8"/><Stat title="Today's Attendance" value="92%"/><Stat title="Fee Collection" value="PKR 184,500"/><Stat title="Pending Fees" value="PKR 96,000"/></div>
    <div className="grid"><div className="panel"><h2>Attendance Overview</h2><div className="attendance"><b>92%</b><span>Present today</span><div className="bar"><i style={{width:"92%"}}/></div><small>Present 447 · Late 18 · Absent 21</small></div></div><div className="panel"><h2>Fee Overview</h2><div className="fee-row"><span>Collected</span><b>PKR 184,500</b></div><div className="fee-row"><span>Pending</span><b>PKR 72,000</b></div><div className="fee-row"><span>Overdue</span><b>PKR 24,000</b></div></div></div>
    <div className="grid"><div className="panel"><h2>Recent Students</h2>{initialStudents.slice(0,3).map(s => <div className="item" key={s.id}><strong>{s.name}</strong><span>{s.className} · Section {s.section}</span></div>)}</div><div className="panel"><h2>Recent Notices</h2>{[["Parent–Teacher Meeting","15 Aug 2026"],["Independence Day Assembly","14 Aug 2026"],["Mid Term Datesheet Released","10 Aug 2026"]].map(n => <div className="item" key={n[0]}><strong>{n[0]}</strong><span>{n[1]}</span></div>)}</div></div></>;
}

function StudentsPage({ students, canManage, onAdd, onEdit, onDelete }: { students: Student[]; canManage: boolean; onAdd: () => void; onEdit: (s: Student) => void; onDelete: (id: number) => void }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => students.filter(s => `${s.name} ${s.father} ${s.className} ${s.roll}`.toLowerCase().includes(query.toLowerCase())), [students, query]);
  return <><div className="page-head"><div><h1>Students</h1><p>Manage student records, classes and admission details.</p></div>{canManage && <button className="primary" onClick={onAdd}><Plus size={17}/> Add Student</button>}</div>
    <div className="panel table-panel"><div className="table-toolbar"><div className="search"><Search size={17}/><input placeholder="Search students..." value={query} onChange={e => setQuery(e.target.value)} /></div><span>{filtered.length} students</span></div>
      <div className="table-wrap"><table><thead><tr><th>Student</th><th>Father Name</th><th>Class</th><th>Roll</th><th>Phone</th><th>Status</th>{canManage && <th>Actions</th>}</tr></thead><tbody>{filtered.map(s => <tr key={s.id}><td><strong>{s.name}</strong><small>BV-S-{String(s.id).padStart(4,"0")}</small></td><td>{s.father}</td><td>{s.className} · {s.section}</td><td>{s.roll}</td><td>{s.phone}</td><td><span className={`badge ${s.status.toLowerCase()}`}>{s.status}</span></td>{canManage && <td><div className="actions"><button className="icon-btn small" onClick={() => onEdit(s)} title="Edit"><Pencil size={15}/></button><button className="icon-btn small danger" onClick={() => onDelete(s.id)} title="Delete"><Trash2 size={15}/></button></div></td>}</tr>)}</tbody></table></div>
      {!filtered.length && <div className="empty">No students found.</div>}
    </div></>;
}

function StudentForm({ student, onClose, onSave }: { student: Student | null; onClose: () => void; onSave: (s: Student) => void }) {
  const [form, setForm] = useState<Student>(student || { id: 0, name: "", father: "", className: "Class 1", section: "A", roll: "", phone: "", status: "Active" });
  const set = (key: keyof Student, value: string) => setForm(f => ({ ...f, [key]: value } as Student));
  return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><h2>{student ? "Edit Student" : "Add Student"}</h2><p>Enter the student's basic information.</p></div><button className="icon-btn" onClick={onClose}><X size={20}/></button></div><form onSubmit={e => { e.preventDefault(); onSave(form); }}><div className="form-grid"><label>Full Name<input value={form.name} onChange={e => set("name",e.target.value)} required/></label><label>Father Name<input value={form.father} onChange={e => set("father",e.target.value)} required/></label><label>Class<select value={form.className} onChange={e => set("className",e.target.value)}>{[1,2,3,4,5,6,7].map(n => <option key={n}>Class {n}</option>)}</select></label><label>Section<select value={form.section} onChange={e => set("section",e.target.value)}><option>A</option><option>B</option><option>C</option></select></label><label>Roll Number<input value={form.roll} onChange={e => set("roll",e.target.value)} required/></label><label>Phone<input value={form.phone} onChange={e => set("phone",e.target.value)} required/></label><label>Status<select value={form.status} onChange={e => set("status",e.target.value as Student["status"])}><option>Active</option><option>Inactive</option></select></label></div><div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button className="primary">Save Student</button></div></form></div></div>;
}

function Stat({title,value}:{title:string,value:string}) { return <div className="stat"><span>{title}</span><strong>{value}</strong></div>; }
