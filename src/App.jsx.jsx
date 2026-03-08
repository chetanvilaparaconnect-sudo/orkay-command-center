import { useState, useEffect } from "react";

// ── LOGIN USERS ──
const USERS = [
  { id: "Pavanbhai", password: "Boss@1996",     name: "Boss",            role: "Management" },
  { id: "Chetan",    password: "Chetan@2026",   name: "Chetan Vilpara",  role: "Digital Marketing Manager" },
  { id: "Hussain",   password: "Hussain@00183", name: "Hussian Bharmal", role: "Export Manager" },
  { id: "Yogesh",    password: "Yogesh@00183",  name: "Yogesh Aal",      role: "Export Manager" },
  { id: "Harsh",     password: "Harsh@00183",   name: "Harsh Parmar",    role: "Export Manager" },
  { id: "Jignesh",   password: "Jignesh@00183", name: "Jignesh Parmar",  role: "Export Manager" },
];

const TEAM_MEMBERS = [
  { id: "Pavanbhai", name: "Boss",            role: "Management",               avatar: "PV", color: "#FF6B35" },
  { id: "Chetan",    name: "Chetan Vilpara",  role: "Digital Marketing Manager",avatar: "CV", color: "#4ECDC4" },
  { id: "Hussain",   name: "Hussian Bharmal", role: "Export Manager",           avatar: "HB", color: "#45B7D1" },
  { id: "Yogesh",    name: "Yogesh Aal",      role: "Export Manager",           avatar: "YA", color: "#96CEB4" },
  { id: "Harsh",     name: "Harsh Parmar",    role: "Export Manager",           avatar: "HP", color: "#FFEAA7" },
  { id: "Jignesh",   name: "Jignesh Parmar",  role: "Export Manager",           avatar: "JP", color: "#DDA0DD" },
];

const PRIORITY_CONFIG = {
  critical: { label: "Critical", color: "#FF3B3B", bg: "#FF3B3B18", icon: "🔴", order: 1 },
  high:     { label: "High",     color: "#FF8C00", bg: "#FF8C0018", icon: "🟠", order: 2 },
  medium:   { label: "Medium",   color: "#FFD700", bg: "#FFD70018", icon: "🟡", order: 3 },
  low:      { label: "Low",      color: "#4CAF50", bg: "#4CAF5018", icon: "🟢", order: 4 },
};

const STATUS_CONFIG = {
  todo:       { label: "To Do",       color: "#8892A4", bg: "#8892A418", icon: "○" },
  inprogress: { label: "In Progress", color: "#4ECDC4", bg: "#4ECDC418", icon: "◑" },
  review:     { label: "In Review",   color: "#FF8C00", bg: "#FF8C0018", icon: "◕" },
  done:       { label: "Done",        color: "#4CAF50", bg: "#4CAF5018", icon: "●" },
};

const CATEGORIES = [
  "Social Media", "Content", "Email Campaign", "WhatsApp Campaign",
  "Lead Generation", "CRM Setup", "SEO", "Ads", "Research", "Reporting", "Other"
];

const SAMPLE_TASKS = [
  {
    id: 1, title: "Scrape Australia tiles importers data",
    desc: "Use import tracking software to pull all AU tiles & sanitaryware importers. Remove logistics companies.",
    priority: "critical", status: "done", category: "Lead Generation",
    assignee: "Yogesh", createdBy: "Pavanbhai",
    dueDate: "2025-03-05", createdAt: "2025-02-28",
    tags: ["Australia", "Data", "Import"],
    comments: [{ author: "Chetan", text: "Data pulled — 1310 raw entries", time: "2d ago" }],
  },
  {
    id: 2, title: "Set up Apollo.io for Poland importers",
    desc: "Create Apollo account, search Polish tiles & sanitaryware importers, export 200 leads with decision makers.",
    priority: "high", status: "inprogress", category: "Lead Generation",
    assignee: "Yogesh", createdBy: "Pavanbhai",
    dueDate: "2025-03-10", createdAt: "2025-03-01",
    tags: ["Poland", "Apollo", "Contacts"],
    comments: [],
  },
  {
    id: 3, title: "Design WhatsApp outreach sequence (Tiles)",
    desc: "Write 3-message WhatsApp campaign for tiles importers in Australia & Poland. Include catalog PDF.",
    priority: "high", status: "todo", category: "WhatsApp Campaign",
    assignee: "Chetan", createdBy: "Pavanbhai",
    dueDate: "2025-03-12", createdAt: "2025-03-01",
    tags: ["WhatsApp", "Campaign", "Tiles"],
    comments: [],
  },
  {
    id: 4, title: "GoHighLevel pipeline setup for B2B leads",
    desc: "Build tiles importer pipeline in GHL with stages: New Lead → Contacted → Sample Sent → Negotiation → Closed.",
    priority: "critical", status: "inprogress", category: "CRM Setup",
    assignee: "Hussain", createdBy: "Pavanbhai",
    dueDate: "2025-03-08", createdAt: "2025-02-27",
    tags: ["GHL", "CRM", "Pipeline"],
    comments: [{ author: "Hussain", text: "Pipeline stages created. Adding automation triggers.", time: "1d ago" }],
  },
  {
    id: 5, title: "LinkedIn content — Export marketing authority",
    desc: "Post 3x per week on LinkedIn about tiles industry insights, export trends, and company capabilities.",
    priority: "medium", status: "todo", category: "Social Media",
    assignee: "Chetan", createdBy: "Pavanbhai",
    dueDate: "2025-03-15", createdAt: "2025-03-02",
    tags: ["LinkedIn", "Content", "Export"],
    comments: [],
  },
  {
    id: 6, title: "Review Q1 campaign performance report",
    desc: "Compile results from all Q1 campaigns — WhatsApp, email, LinkedIn. Present to boss with next quarter plan.",
    priority: "high", status: "todo", category: "Reporting",
    assignee: "Chetan", createdBy: "Pavanbhai",
    dueDate: "2025-03-20", createdAt: "2025-03-01",
    tags: ["Report", "Q1", "Review"],
    comments: [],
  },
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function getDaysLeft(dueDate) {
  if (!dueDate) return null;
  return Math.ceil((new Date(dueDate) - new Date()) / 86400000);
}

function getMember(id) {
  return TEAM_MEMBERS.find(m => m.id === id) || TEAM_MEMBERS[0];
}

/* ── LOGIN SCREEN ── */
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      const user = USERS.find(u => u.id === username && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError("❌ Invalid username or password. Please try again.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0D1117",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, #FF6B3520 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        background: "#161B22", borderRadius: 24, padding: 40, width: 420,
        border: "1px solid #30363D", boxShadow: "0 30px 100px #00000080",
        position: "relative", zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: "linear-gradient(135deg, #FF6B35, #FF8C00)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, margin: "0 auto 16px", boxShadow: "0 8px 30px #FF6B3550",
          }}>⚡</div>
          <div style={{ fontWeight: 800, fontSize: 24, color: "#E6EDF3", letterSpacing: "-0.5px" }}>
            TaskFlow Pro
          </div>
          <div style={{ fontSize: 13, color: "#8B949E", marginTop: 4 }}>
            Sign in to your workspace
          </div>
        </div>

        {/* Username */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Username
          </label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Enter your username"
            style={{
              width: "100%", marginTop: 8, background: "#0D1117",
              border: `1px solid ${error ? "#FF3B3B" : "#30363D"}`,
              borderRadius: 12, padding: "12px 16px", color: "#E6EDF3",
              fontSize: 14, outline: "none", boxSizing: "border-box",
              transition: "border 0.2s",
            }}
            onFocus={e => e.target.style.border = "1px solid #FF6B35"}
            onBlur={e => e.target.style.border = `1px solid ${error ? "#FF3B3B" : "#30363D"}`}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Password
          </label>
          <div style={{ position: "relative", marginTop: 8 }}>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Enter your password"
              style={{
                width: "100%", background: "#0D1117",
                border: `1px solid ${error ? "#FF3B3B" : "#30363D"}`,
                borderRadius: 12, padding: "12px 48px 12px 16px", color: "#E6EDF3",
                fontSize: 14, outline: "none", boxSizing: "border-box",
                transition: "border 0.2s",
              }}
              onFocus={e => e.target.style.border = "1px solid #FF6B35"}
              onBlur={e => e.target.style.border = `1px solid ${error ? "#FF3B3B" : "#30363D"}`}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "#8B949E", fontSize: 16,
              }}
            >{showPass ? "🙈" : "👁️"}</button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#FF3B3B18", border: "1px solid #FF3B3B40",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
            fontSize: 12, color: "#FF3B3B",
          }}>{error}</div>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%", background: loading ? "#484F58" : "linear-gradient(135deg, #FF6B35, #FF8C00)",
            border: "none", borderRadius: 12, padding: "14px",
            color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 4px 20px #FF6B3550",
            transition: "all 0.2s",
          }}
        >
          {loading ? "⏳ Signing in..." : "Sign In →"}
        </button>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#484F58" }}>
          Contact your admin if you forgot your password
        </div>
      </div>
    </div>
  );
}

/* ── MAIN APP ── */
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const [view, setView] = useState("board");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [nextId, setNextId] = useState(100);

  const emptyForm = {
    title: "", desc: "", priority: "medium", status: "todo",
    category: "Other", assignee: currentUser?.id || "Pavanbhai", createdBy: currentUser?.id || "Pavanbhai",
    dueDate: "", tags: [], tagInput: "", comments: [],
  };
  const [form, setForm] = useState(emptyForm);

  // Show login if not logged in
  if (!currentUser) {
    return <LoginScreen onLogin={setCurrentUser} />;
  }

  const filtered = tasks.filter(t => {
    if (filterAssignee !== "all" && t.assignee !== filterAssignee) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (searchQ && !t.title.toLowerCase().includes(searchQ.toLowerCase()) &&
        !t.desc.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  const openCreate = () => { setForm(emptyForm); setEditingTask(null); setShowModal(true); };
  const openEdit = (task) => {
    setForm({ ...task, tagInput: "", tags: task.tags || [] });
    setEditingTask(task.id);
    setShowModal(true);
  };

  const saveTask = () => {
    if (!form.title.trim()) return;
    const { tagInput, ...cleanForm } = form;
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask ? { ...cleanForm, id: editingTask, createdAt: t.createdAt } : t));
      if (selectedTask?.id === editingTask) setSelectedTask(prev => ({ ...prev, ...cleanForm }));
    } else {
      const newTask = { ...cleanForm, id: nextId, createdAt: new Date().toISOString().split("T")[0], comments: [] };
      setTasks(prev => [...prev, newTask]);
      setNextId(n => n + 1);
    }
    setShowModal(false);
  };

  const deleteTask = (id) => {
    if (!window.confirm("Delete this task? This cannot be undone.")) return;
    setTasks(prev => prev.filter(t => t.id !== id));
    if (selectedTask?.id === id) setSelectedTask(null);
  };

  const updateStatus = (id, status) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    setSelectedTask(prev => prev?.id === id ? { ...prev, status } : prev);
  };

  const addComment = (taskId, text) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) +
      " · " + now.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    const comment = { author: currentUser.id, text, time: timeStr };
    setTasks(prev => prev.map(t => t.id === taskId
      ? { ...t, comments: [...(t.comments || []), comment] }
      : t
    ));
    setSelectedTask(prev => prev?.id === taskId
      ? { ...prev, comments: [...(prev.comments || []), comment] }
      : prev
    );
  };

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === "done").length,
    inprogress: tasks.filter(t => t.status === "inprogress").length,
    critical: tasks.filter(t => t.priority === "critical" && t.status !== "done").length,
    overdue: tasks.filter(t => getDaysLeft(t.dueDate) < 0 && t.status !== "done").length,
  };

  const memberInfo = getMember(currentUser.id);

  return (
    <div style={{
      minHeight: "100vh", background: "#0D1117", color: "#E6EDF3",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", display: "flex", flexDirection: "column"
    }}>
      {/* ── TOP NAV ── */}
      <nav style={{
        background: "#161B22", borderBottom: "1px solid #30363D",
        padding: "0 24px", height: 60, display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #FF6B35, #FF8C00)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 800,
          }}>⚡</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.3px" }}>TaskFlow Pro</div>
            <div style={{ fontSize: 11, color: "#8B949E" }}>Digital Marketing Team</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          {[["board","⬛ Board"], ["list","≡ List"], ["dashboard","◈ Dashboard"]].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 600, transition: "all 0.2s",
              background: view === v ? "#FF6B35" : "transparent",
              color: view === v ? "#fff" : "#8B949E",
            }}>{label}</button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Logged in user */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: memberInfo.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#0D1117",
            }}>{memberInfo.avatar}</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{currentUser.name}</div>
              <div style={{ fontSize: 10, color: "#8B949E" }}>{currentUser.role}</div>
            </div>
          </div>

          {/* Logout */}
          <button onClick={() => setCurrentUser(null)} style={{
            background: "#21262D", border: "1px solid #30363D", borderRadius: 8,
            padding: "6px 12px", color: "#8B949E", cursor: "pointer", fontSize: 12, fontWeight: 600,
          }}>🚪 Logout</button>

          <button onClick={openCreate} style={{
            background: "linear-gradient(135deg, #FF6B35, #FF8C00)",
            color: "#fff", border: "none", borderRadius: 10, padding: "8px 18px",
            fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex",
            alignItems: "center", gap: 6, boxShadow: "0 4px 15px #FF6B3540",
          }}>+ New Task</button>
        </div>
      </nav>

      {/* ── STATS BAR ── */}
      <div style={{
        background: "#161B22", borderBottom: "1px solid #30363D",
        padding: "12px 24px", display: "flex", gap: 16, overflowX: "auto",
      }}>
        {[
          { label: "Total Tasks",  value: stats.total,      color: "#4ECDC4", icon: "📋", action: () => { setFilterStatus("all"); setFilterPriority("all"); setFilterAssignee("all"); setView("list"); } },
          { label: "In Progress",  value: stats.inprogress, color: "#FF8C00", icon: "⚙️", action: () => { setFilterStatus("inprogress"); setFilterPriority("all"); setFilterAssignee("all"); setView("list"); } },
          { label: "Completed",    value: stats.done,       color: "#4CAF50", icon: "✅", action: () => { setFilterStatus("done"); setFilterPriority("all"); setFilterAssignee("all"); setView("list"); } },
          { label: "Critical",     value: stats.critical,   color: "#FF3B3B", icon: "🚨", action: () => { setFilterPriority("critical"); setFilterStatus("all"); setFilterAssignee("all"); setView("list"); } },
          { label: "Overdue",      value: stats.overdue,    color: "#FF3B3B", icon: "⏰", action: () => { setFilterStatus("all"); setFilterPriority("all"); setFilterAssignee("all"); setView("list"); } },
        ].map(s => (
          <div key={s.label} onClick={s.action} style={{
            background: "#0D1117", borderRadius: 10, padding: "10px 20px",
            border: `1px solid ${s.color}30`, minWidth: 120, textAlign: "center",
            cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${s.color}90`; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${s.color}30`; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.icon} {s.value}</div>
            <div style={{ fontSize: 11, color: "#8B949E", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#8B949E" }}>Team:</span>
          <div style={{ display: "flex" }}>
            {TEAM_MEMBERS.map((m, i) => (
              <div key={m.id} title={`Filter: ${m.name}`}
                onClick={() => { setFilterAssignee(m.id); setFilterStatus("all"); setFilterPriority("all"); setView("list"); }}
                style={{
                  width: 30, height: 30, borderRadius: "50%", background: m.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: "#0D1117",
                  marginLeft: i === 0 ? 0 : -8, border: "2px solid #161B22", cursor: "pointer",
                  zIndex: TEAM_MEMBERS.length - i, transition: "transform 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.2)"; e.currentTarget.style.zIndex = 99; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.zIndex = TEAM_MEMBERS.length - i; }}
              >{m.avatar}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div style={{
        padding: "12px 24px", background: "#0D1117",
        display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center",
        borderBottom: "1px solid #30363D",
      }}>
        <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
          placeholder="🔍 Search tasks..."
          style={{
            background: "#161B22", border: "1px solid #30363D", borderRadius: 8,
            padding: "7px 14px", color: "#E6EDF3", fontSize: 13, width: 200, outline: "none",
          }}
        />
        {[
          { key: "filterAssignee", val: filterAssignee, set: setFilterAssignee,
            opts: [["all","All Members"], ...TEAM_MEMBERS.map(m => [m.id, m.name])] },
          { key: "filterPriority", val: filterPriority, set: setFilterPriority,
            opts: [["all","All Priority"], ...Object.entries(PRIORITY_CONFIG).map(([k,v]) => [k, v.icon+" "+v.label])] },
          { key: "filterStatus", val: filterStatus, set: setFilterStatus,
            opts: [["all","All Status"], ...Object.entries(STATUS_CONFIG).map(([k,v]) => [k, v.icon+" "+v.label])] },
        ].map(f => (
          <select key={f.key} value={f.val} onChange={e => f.set(e.target.value)} style={{
            background: "#161B22", border: "1px solid #30363D", borderRadius: 8,
            padding: "7px 12px", color: "#E6EDF3", fontSize: 13, cursor: "pointer", outline: "none",
          }}>
            {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
        <span style={{ fontSize: 12, color: "#8B949E", marginLeft: "auto" }}>
          {filtered.length} of {tasks.length} tasks
        </span>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, padding: 24, overflow: "auto" }}>

        {view === "dashboard" && (
          <DashboardView
            tasks={tasks}
            onFilterStatus={(s) => { setFilterStatus(s); setFilterPriority("all"); setFilterAssignee("all"); setView("list"); }}
            onFilterPriority={(p) => { setFilterPriority(p); setFilterStatus("all"); setFilterAssignee("all"); setView("list"); }}
            onFilterMember={(id) => { setFilterAssignee(id); setFilterStatus("all"); setFilterPriority("all"); setView("list"); }}
          />
        )}

        {view === "board" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, minWidth: 900 }}>
            {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
              const colTasks = filtered.filter(t => t.status === status)
                .sort((a,b) => PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order);
              return (
                <div key={status}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    marginBottom: 12, padding: "8px 12px",
                    background: cfg.bg, borderRadius: 8, border: `1px solid ${cfg.color}30`,
                  }}>
                    <span style={{ color: cfg.color, fontSize: 16 }}>{cfg.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: cfg.color }}>{cfg.label}</span>
                    <span style={{
                      marginLeft: "auto", background: cfg.color, color: "#fff",
                      borderRadius: 20, padding: "1px 8px", fontSize: 11, fontWeight: 700,
                    }}>{colTasks.length}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {colTasks.map(task => (
                      <TaskCard key={task.id} task={task}
                        onClick={() => setSelectedTask(task)}
                        onEdit={() => openEdit(task)}
                        onDelete={() => deleteTask(task.id)}
                        onStatusChange={updateStatus}
                      />
                    ))}
                    {colTasks.length === 0 && (
                      <div style={{
                        border: "2px dashed #30363D", borderRadius: 10, padding: 20,
                        textAlign: "center", color: "#484F58", fontSize: 12,
                      }}>No tasks here</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === "list" && (
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 100px",
              padding: "8px 16px", fontSize: 11, color: "#8B949E", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.5px",
              borderBottom: "1px solid #30363D", marginBottom: 8,
            }}>
              <span>Task</span><span>Assignee</span><span>Priority</span>
              <span>Status</span><span>Due Date</span><span>Actions</span>
            </div>
            {[...filtered]
              .sort((a,b) => PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order)
              .map(task => <ListRow key={task.id} task={task}
                onClick={() => setSelectedTask(task)}
                onEdit={() => openEdit(task)}
                onDelete={() => deleteTask(task.id)}
                onStatusChange={updateStatus}
              />)
            }
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "#484F58" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                <div style={{ fontSize: 14, marginBottom: 12 }}>No tasks match your filters</div>
                <button onClick={() => { setSearchQ(""); setFilterAssignee("all"); setFilterPriority("all"); setFilterStatus("all"); }}
                  style={{ background: "#FF6B35", border: "none", borderRadius: 8, padding: "8px 18px", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          currentUser={currentUser}
          onClose={() => setSelectedTask(null)}
          onEdit={() => { openEdit(selectedTask); setSelectedTask(null); }}
          onDelete={() => deleteTask(selectedTask.id)}
          onStatusChange={updateStatus}
          onComment={addComment}
        />
      )}

      {showModal && (
        <TaskModal
          form={form} setForm={setForm}
          editing={!!editingTask}
          onSave={saveTask}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

/* ── TASK CARD ── */
function TaskCard({ task, onClick, onEdit, onDelete, onStatusChange }) {
  const p = PRIORITY_CONFIG[task.priority];
  const m = getMember(task.assignee);
  const days = getDaysLeft(task.dueDate);
  const overdue = days !== null && days < 0 && task.status !== "done";

  return (
    <div onClick={onClick} style={{
      background: "#161B22", borderRadius: 12, padding: 14,
      border: `1px solid ${overdue ? "#FF3B3B50" : "#30363D"}`,
      cursor: "pointer", transition: "all 0.2s", borderLeft: `3px solid ${p.color}`,
    }}
    onMouseEnter={e => { e.currentTarget.style.background = "#1C2128"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "#161B22"; }}
    >
      <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: p.bg, color: p.color, border: `1px solid ${p.color}40` }}>{p.icon} {p.label}</span>
        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "#21262D", color: "#8B949E" }}>{task.category}</span>
      </div>
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, lineHeight: 1.4 }}>{task.title}</div>
      <div style={{ fontSize: 11, color: "#8B949E", marginBottom: 10, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{task.desc}</div>
      {task.tags?.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
          {task.tags.slice(0,3).map(tag => (
            <span key={tag} style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "#21262D", color: "#58A6FF" }}>#{tag}</span>
          ))}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#0D1117" }}>{m.avatar}</div>
        <span style={{ fontSize: 11, color: "#8B949E", flex: 1 }}>{m.name}</span>
        {task.dueDate && (
          <span style={{ fontSize: 10, fontWeight: 600, color: overdue ? "#FF3B3B" : days <= 2 ? "#FF8C00" : "#8B949E" }}>
            {overdue ? `⚠️ ${Math.abs(days)}d overdue` : days === 0 ? "⚡ Today" : `📅 ${days}d`}
          </span>
        )}
        <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
          <button onClick={onEdit} style={{ background: "none", border: "none", cursor: "pointer", color: "#8B949E", fontSize: 12, padding: "2px 4px", borderRadius: 4 }}>✏️</button>
          <button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", color: "#8B949E", fontSize: 12, padding: "2px 4px", borderRadius: 4 }}>🗑️</button>
        </div>
      </div>
      {task.comments?.length > 0 && (
        <div style={{ marginTop: 8, fontSize: 10, color: "#8B949E" }}>💬 {task.comments.length} comment{task.comments.length !== 1 ? "s" : ""}</div>
      )}
    </div>
  );
}

/* ── LIST ROW ── */
function ListRow({ task, onClick, onEdit, onDelete, onStatusChange }) {
  const p = PRIORITY_CONFIG[task.priority];
  const s = STATUS_CONFIG[task.status];
  const m = getMember(task.assignee);
  const days = getDaysLeft(task.dueDate);
  const overdue = days !== null && days < 0 && task.status !== "done";

  return (
    <div onClick={onClick} style={{
      display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 100px",
      padding: "12px 16px", borderRadius: 10, cursor: "pointer",
      background: "#161B22", marginBottom: 6, border: "1px solid #30363D",
      transition: "all 0.15s", alignItems: "center", borderLeft: `3px solid ${p.color}`,
    }}
    onMouseEnter={e => e.currentTarget.style.background = "#1C2128"}
    onMouseLeave={e => e.currentTarget.style.background = "#161B22"}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{task.title}</div>
        <div style={{ fontSize: 11, color: "#8B949E" }}>{task.category}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#0D1117" }}>{m.avatar}</div>
        <span style={{ fontSize: 12 }}>{m.name}</span>
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: p.bg, color: p.color, display: "inline-block" }}>{p.icon} {p.label}</span>
      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: s.bg, color: s.color, display: "inline-block" }}>{s.icon} {s.label}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: overdue ? "#FF3B3B" : days <= 2 ? "#FF8C00" : "#8B949E" }}>
        {task.dueDate ? (overdue ? `⚠️ ${Math.abs(days)}d ago` : formatDate(task.dueDate)) : "—"}
      </span>
      <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
        <button onClick={onEdit} style={{ background: "#21262D", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 12 }}>✏️</button>
        <button onClick={onDelete} style={{ background: "#21262D", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 12 }}>🗑️</button>
      </div>
    </div>
  );
}

/* ── DASHBOARD VIEW ── */
function DashboardView({ tasks, onFilterStatus, onFilterPriority, onFilterMember }) {
  const byStatus = Object.fromEntries(Object.keys(STATUS_CONFIG).map(s => [s, tasks.filter(t => t.status === s).length]));
  const byPriority = Object.fromEntries(Object.keys(PRIORITY_CONFIG).map(p => [p, tasks.filter(t => t.priority === p).length]));
  const byMember = TEAM_MEMBERS.map(m => ({
    ...m,
    total: tasks.filter(t => t.assignee === m.id).length,
    done: tasks.filter(t => t.assignee === m.id && t.status === "done").length,
    critical: tasks.filter(t => t.assignee === m.id && t.priority === "critical" && t.status !== "done").length,
  }));
  const upcoming = tasks.filter(t => t.status !== "done" && t.dueDate).sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);
  const completion = tasks.length ? Math.round((byStatus.done / tasks.length) * 100) : 0;
  const clickableCard = { cursor: "pointer", transition: "all 0.15s" };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, maxWidth: 1200 }}>
      <div style={{ background: "#161B22", borderRadius: 16, padding: 24, border: "1px solid #30363D" }}>
        <div style={{ fontSize: 13, color: "#8B949E", fontWeight: 600, marginBottom: 16 }}>📊 OVERALL PROGRESS</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: "#4ECDC4" }}>{completion}%</div>
          <div style={{ fontSize: 13, color: "#8B949E" }}>Tasks Completed</div>
          <div style={{ margin: "16px 0", height: 12, background: "#21262D", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${completion}%`, background: "linear-gradient(90deg, #4ECDC4, #45B7D1)", borderRadius: 10, transition: "width 1s" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <div key={key} onClick={() => onFilterStatus(key)}
                style={{ ...clickableCard, background: cfg.bg, borderRadius: 8, padding: "8px 12px", border: `1px solid ${cfg.color}30` }}
                onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${cfg.color}90`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${cfg.color}30`; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: 20, fontWeight: 800, color: cfg.color }}>{byStatus[key]}</div>
                <div style={{ fontSize: 10, color: cfg.color }}>{cfg.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#161B22", borderRadius: 16, padding: 24, border: "1px solid #30363D" }}>
        <div style={{ fontSize: 13, color: "#8B949E", fontWeight: 600, marginBottom: 16 }}>👥 TEAM WORKLOAD <span style={{ fontSize: 10, fontWeight: 400 }}>— click to filter</span></div>
        {byMember.map(m => (
          <div key={m.id} onClick={() => onFilterMember(m.id)}
            style={{ ...clickableCard, marginBottom: 14, padding: "6px 8px", borderRadius: 8, border: "1px solid transparent" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#21262D"; e.currentTarget.style.border = `1px solid ${m.color}40`; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.border = "1px solid transparent"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#0D1117" }}>{m.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{m.name}</div>
                <div style={{ fontSize: 10, color: "#8B949E" }}>{m.role}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.done}/{m.total}</div>
                {m.critical > 0 && <div style={{ fontSize: 9, color: "#FF3B3B" }}>🔴 {m.critical} critical</div>}
              </div>
            </div>
            <div style={{ height: 6, background: "#21262D", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 10, background: m.color, width: `${m.total ? (m.done / m.total) * 100 : 0}%`, transition: "width 0.8s" }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#161B22", borderRadius: 16, padding: 24, border: "1px solid #30363D" }}>
        <div style={{ fontSize: 13, color: "#8B949E", fontWeight: 600, marginBottom: 16 }}>🎯 PRIORITY BREAKDOWN <span style={{ fontSize: 10, fontWeight: 400 }}>— click to filter</span></div>
        {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
          <div key={key} onClick={() => onFilterPriority(key)}
            style={{ ...clickableCard, marginBottom: 16, padding: "6px 8px", borderRadius: 8, border: "1px solid transparent" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#21262D"; e.currentTarget.style.border = `1px solid ${cfg.color}40`; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.border = "1px solid transparent"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>{cfg.icon} {cfg.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{byPriority[key]}</span>
            </div>
            <div style={{ height: 8, background: "#21262D", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 10, background: cfg.color, width: `${tasks.length ? (byPriority[key] / tasks.length) * 100 : 0}%`, transition: "width 0.8s" }} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 20, padding: "14px", background: "#0D1117", borderRadius: 10, border: "1px solid #30363D" }}>
          <div style={{ fontSize: 11, color: "#8B949E", marginBottom: 8, fontWeight: 600 }}>⏰ UPCOMING DEADLINES</div>
          {upcoming.slice(0,4).map(t => {
            const days = getDaysLeft(t.dueDate);
            return (
              <div key={t.id} style={{ ...clickableCard, display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center", padding: "4px 6px", borderRadius: 6 }}
                onMouseEnter={e => e.currentTarget.style.background = "#21262D"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ fontSize: 11, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
                <span style={{ fontSize: 10, fontWeight: 700, marginLeft: 8, color: days < 0 ? "#FF3B3B" : days <= 2 ? "#FF8C00" : "#8B949E" }}>
                  {days < 0 ? `${Math.abs(days)}d late` : days === 0 ? "Today!" : `${days}d`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── TASK DETAIL ── */
function TaskDetail({ task, currentUser, onClose, onEdit, onDelete, onStatusChange, onComment }) {
  const [commentText, setCommentText] = useState("");
  const p = PRIORITY_CONFIG[task.priority];
  const s = STATUS_CONFIG[task.status];
  const m = getMember(task.assignee);
  const creator = getMember(task.createdBy);
  const days = getDaysLeft(task.dueDate);

  return (
    <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 420, background: "#161B22", borderLeft: "1px solid #30363D", zIndex: 200, display: "flex", flexDirection: "column", boxShadow: "-20px 0 60px #00000060" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #30363D", display: "flex", gap: 8 }}>
        <button onClick={onClose} style={{ background: "#21262D", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#E6EDF3" }}>✕</button>
        <button onClick={onEdit} style={{ background: "#21262D", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#4ECDC4", fontWeight: 600, fontSize: 12 }}>✏️ Edit</button>
        <button onClick={() => { onDelete(); onClose(); }} style={{ background: "#FF3B3B18", border: "1px solid #FF3B3B40", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#FF3B3B", fontWeight: 600, fontSize: 12 }}>🗑️ Delete</button>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: p.bg, color: p.color, border: `1px solid ${p.color}40` }}>{p.icon} {p.label}</span>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "#21262D", color: "#8B949E" }}>{task.category}</span>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, lineHeight: 1.4 }}>{task.title}</h2>
        <p style={{ fontSize: 13, color: "#8B949E", lineHeight: 1.6, marginBottom: 20 }}>{task.desc}</p>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#8B949E", marginBottom: 8, fontWeight: 600 }}>STATUS</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => onStatusChange(task.id, key)} style={{
                padding: "5px 12px", borderRadius: 20, border: `1px solid ${key === task.status ? cfg.color : "#30363D"}`,
                background: key === task.status ? cfg.bg : "transparent",
                color: key === task.status ? cfg.color : "#8B949E",
                cursor: "pointer", fontSize: 11, fontWeight: 600,
              }}>{cfg.icon} {cfg.label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Assignee", content: <><div style={{ width: 20, height: 20, borderRadius: "50%", background: m.color, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#0D1117", marginRight: 6 }}>{m.avatar}</div>{m.name}</> },
            { label: "Created By", content: <><div style={{ width: 20, height: 20, borderRadius: "50%", background: creator.color, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#0D1117", marginRight: 6 }}>{creator.avatar}</div>{creator.name}</> },
            { label: "Due Date", content: <span style={{ color: days < 0 ? "#FF3B3B" : days <= 2 ? "#FF8C00" : "#E6EDF3" }}>{task.dueDate ? formatDate(task.dueDate) : "No due date"}</span> },
            { label: "Created", content: formatDate(task.createdAt) },
          ].map(item => (
            <div key={item.label} style={{ background: "#0D1117", borderRadius: 8, padding: "10px 12px", border: "1px solid #30363D" }}>
              <div style={{ fontSize: 10, color: "#8B949E", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>{item.label}</div>
              <div style={{ fontSize: 12, display: "flex", alignItems: "center" }}>{item.content}</div>
            </div>
          ))}
        </div>
        {task.tags?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#8B949E", marginBottom: 8, fontWeight: 600 }}>TAGS</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {task.tags.map(tag => <span key={tag} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "#21262D", color: "#58A6FF" }}>#{tag}</span>)}
            </div>
          </div>
        )}
        <div>
          <div style={{ fontSize: 11, color: "#8B949E", marginBottom: 12, fontWeight: 600 }}>💬 COMMENTS ({task.comments?.length || 0})</div>
          {task.comments?.map((c, i) => {
            const cm = getMember(c.author);
            return (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: cm.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#0D1117", flexShrink: 0 }}>{cm.avatar}</div>
                <div style={{ background: "#0D1117", borderRadius: 8, padding: "8px 12px", flex: 1, border: "1px solid #30363D" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#4ECDC4", marginBottom: 2 }}>{cm.name} <span style={{ color: "#484F58", fontWeight: 400 }}>· {c.time}</span></div>
                  <div style={{ fontSize: 12, color: "#C9D1D9" }}>{c.text}</div>
                </div>
              </div>
            );
          })}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input value={commentText} onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { onComment(task.id, commentText); setCommentText(""); } }}
              placeholder="Add a comment... (Enter to send)"
              style={{ flex: 1, background: "#0D1117", border: "1px solid #30363D", borderRadius: 8, padding: "8px 12px", color: "#E6EDF3", fontSize: 12, outline: "none" }}
            />
            <button onClick={() => { onComment(task.id, commentText); setCommentText(""); }} style={{ background: "#FF6B35", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── TASK MODAL ── */
function TaskModal({ form, setForm, editing, onSave, onClose }) {
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const addTag = () => {
    if (form.tagInput.trim() && !form.tags.includes(form.tagInput.trim())) {
      set("tags", [...form.tags, form.tagInput.trim()]);
      set("tagInput", "");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000080", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#161B22", borderRadius: 20, padding: 28, width: 540, maxHeight: "85vh", overflow: "auto", border: "1px solid #30363D", boxShadow: "0 25px 80px #000000A0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{editing ? "✏️ Edit Task" : "✨ Create New Task"}</h2>
          <button onClick={onClose} style={{ background: "#21262D", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#E6EDF3" }}>✕</button>
        </div>
        <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Task Title *</label>
        <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Enter task title..."
          style={{ width: "100%", background: "#0D1117", border: "1px solid #30363D", borderRadius: 10, padding: "10px 14px", color: "#E6EDF3", fontSize: 14, outline: "none", marginTop: 6, marginBottom: 16, boxSizing: "border-box" }} />
        <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Description</label>
        <textarea value={form.desc} onChange={e => set("desc", e.target.value)} placeholder="Task description..." rows={3}
          style={{ width: "100%", background: "#0D1117", border: "1px solid #30363D", borderRadius: 10, padding: "10px 14px", color: "#E6EDF3", fontSize: 13, outline: "none", marginTop: 6, marginBottom: 16, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Priority</label>
            <select value={form.priority} onChange={e => set("priority", e.target.value)} style={{ width: "100%", background: "#0D1117", border: "1px solid #30363D", borderRadius: 10, padding: "10px 14px", color: "#E6EDF3", fontSize: 13, outline: "none", marginTop: 6, cursor: "pointer" }}>
              {Object.entries(PRIORITY_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Status</label>
            <select value={form.status} onChange={e => set("status", e.target.value)} style={{ width: "100%", background: "#0D1117", border: "1px solid #30363D", borderRadius: 10, padding: "10px 14px", color: "#E6EDF3", fontSize: 13, outline: "none", marginTop: 6, cursor: "pointer" }}>
              {Object.entries(STATUS_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Assign To</label>
            <select value={form.assignee} onChange={e => set("assignee", e.target.value)} style={{ width: "100%", background: "#0D1117", border: "1px solid #30363D", borderRadius: 10, padding: "10px 14px", color: "#E6EDF3", fontSize: 13, outline: "none", marginTop: 6, cursor: "pointer" }}>
              {TEAM_MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name} – {m.role}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Category</label>
            <select value={form.category} onChange={e => set("category", e.target.value)} style={{ width: "100%", background: "#0D1117", border: "1px solid #30363D", borderRadius: 10, padding: "10px 14px", color: "#E6EDF3", fontSize: 13, outline: "none", marginTop: 6, cursor: "pointer" }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Due Date</label>
            <input type="date" value={form.dueDate} onChange={e => set("dueDate", e.target.value)} style={{ width: "100%", background: "#0D1117", border: "1px solid #30363D", borderRadius: 10, padding: "10px 14px", color: "#E6EDF3", fontSize: 13, outline: "none", marginTop: 6, boxSizing: "border-box", colorScheme: "dark" }} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Created By</label>
            <select value={form.createdBy} onChange={e => set("createdBy", e.target.value)} style={{ width: "100%", background: "#0D1117", border: "1px solid #30363D", borderRadius: 10, padding: "10px 14px", color: "#E6EDF3", fontSize: 13, outline: "none", marginTop: 6, cursor: "pointer" }}>
              {TEAM_MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>
        <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Tags</label>
        <div style={{ display: "flex", gap: 8, marginTop: 6, marginBottom: 8 }}>
          <input value={form.tagInput} onChange={e => set("tagInput", e.target.value)} onKeyDown={e => e.key === "Enter" && addTag()} placeholder="Add tag and press Enter..."
            style={{ flex: 1, background: "#0D1117", border: "1px solid #30363D", borderRadius: 10, padding: "8px 14px", color: "#E6EDF3", fontSize: 13, outline: "none" }} />
          <button onClick={addTag} style={{ background: "#21262D", border: "1px solid #30363D", borderRadius: 10, padding: "8px 14px", color: "#E6EDF3", cursor: "pointer", fontSize: 13 }}>+ Add</button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
          {form.tags.map(tag => (
            <span key={tag} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "#21262D", color: "#58A6FF", display: "flex", alignItems: "center", gap: 4 }}>
              #{tag}
              <button onClick={() => set("tags", form.tags.filter(t => t !== tag))} style={{ background: "none", border: "none", color: "#8B949E", cursor: "pointer", padding: 0, fontSize: 12, lineHeight: 1 }}>×</button>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: "#21262D", border: "1px solid #30363D", borderRadius: 10, padding: "11px", color: "#E6EDF3", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Cancel</button>
          <button onClick={onSave} style={{ flex: 2, background: "linear-gradient(135deg, #FF6B35, #FF8C00)", border: "none", borderRadius: 10, padding: "11px", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: "0 4px 15px #FF6B3540" }}>
            {editing ? "✅ Save Changes" : "✨ Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
