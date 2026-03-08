import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://gcpjmclksnaeupwbjorg.supabase.co";
const SUPABASE_KEY = "sb_publishable_mfQF-n6a2ym0ltbZmTtXww_GIay03Yv";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
  "Social Media","Content","Email Campaign","WhatsApp Campaign",
  "Lead Generation","CRM Setup","SEO","Ads","Research","Reporting","Other"
];

const COLORS = ["#FF6B35","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#DDA0DD","#FF6B6B","#A8E6CF","#FFD93D","#6BCB77"];

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function getDaysLeft(d) {
  if (!d) return null;
  return Math.ceil((new Date(d) - new Date()) / 86400000);
}

/* ── LOGIN ── */
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    setError(""); setLoading(true);
    const { data } = await supabase.from("members").select("*").eq("id", username).eq("password", password).single();
    if (data) { onLogin(data); }
    else { setError("❌ Invalid username or password."); setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D1117", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, #FF6B3520 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ background: "#161B22", borderRadius: 24, padding: 40, width: 420, border: "1px solid #30363D", boxShadow: "0 30px 100px #00000080", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg,#FF6B35,#FF8C00)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px", boxShadow: "0 8px 30px #FF6B3550" }}>⚡</div>
          <div style={{ fontWeight: 800, fontSize: 24, color: "#E6EDF3" }}>TaskFlow Pro</div>
          <div style={{ fontSize: 13, color: "#8B949E", marginTop: 4 }}>Sign in to your workspace</div>
        </div>
        <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Enter your username"
          style={{ width: "100%", marginTop: 8, marginBottom: 16, background: "#0D1117", border: "1px solid #30363D", borderRadius: 12, padding: "12px 16px", color: "#E6EDF3", fontSize: 14, outline: "none", boxSizing: "border-box" }}
          onFocus={e => e.target.style.border = "1px solid #FF6B35"} onBlur={e => e.target.style.border = "1px solid #30363D"} />
        <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Password</label>
        <div style={{ position: "relative", marginTop: 8, marginBottom: 24 }}>
          <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Enter your password"
            style={{ width: "100%", background: "#0D1117", border: "1px solid #30363D", borderRadius: 12, padding: "12px 48px 12px 16px", color: "#E6EDF3", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.border = "1px solid #FF6B35"} onBlur={e => e.target.style.border = "1px solid #30363D"} />
          <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8B949E", fontSize: 16 }}>{showPass ? "🙈" : "👁️"}</button>
        </div>
        {error && <div style={{ background: "#FF3B3B18", border: "1px solid #FF3B3B40", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#FF3B3B" }}>{error}</div>}
        <button onClick={handleLogin} disabled={loading} style={{ width: "100%", background: loading ? "#484F58" : "linear-gradient(135deg,#FF6B35,#FF8C00)", border: "none", borderRadius: 12, padding: "14px", color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "⏳ Signing in..." : "Sign In →"}
        </button>
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#484F58" }}>Contact your admin if you forgot your password</div>
      </div>
    </div>
  );
}

/* ── MAIN APP ── */
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("board");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQ, setSearchQ] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", status: "todo", category: "Other", assignees: [], created_by: "", due_date: "", start_date: "", tags: [], tagInput: "" });

  const loadMembers = useCallback(async () => {
    const { data } = await supabase.from("members").select("*").order("created_at");
    if (data) setMembers(data);
  }, []);

  const loadTasks = useCallback(async () => {
    const { data } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
    if (data) setTasks(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMembers();
    loadTasks();
    const taskSub = supabase.channel("tasks-rt").on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, loadTasks).subscribe();
    const memberSub = supabase.channel("members-rt").on("postgres_changes", { event: "*", schema: "public", table: "members" }, loadMembers).subscribe();
    return () => { taskSub.unsubscribe(); memberSub.unsubscribe(); };
  }, [loadMembers, loadTasks]);

  if (!currentUser) return <LoginScreen onLogin={user => { setCurrentUser(user); setForm(f => ({ ...f, assignees: [user.id], created_by: user.id })); }} />;

  const getMember = id => members.find(m => m.id === id) || { name: id, avatar: "?", color: "#888" };

  const visibleTasks = tasks.filter(t => {
    const isInvolved = t.assignees?.includes(currentUser.id) || t.created_by === currentUser.id || currentUser.id === "Pavanbhai";
    if (!isInvolved) return false;
    if (filterAssignee !== "all" && !t.assignees?.includes(filterAssignee)) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (searchQ && !t.title?.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  const openCreate = () => { setForm({ title: "", description: "", priority: "medium", status: "todo", category: "Other", assignees: [currentUser.id], created_by: currentUser.id, due_date: "", start_date: "", tags: [], tagInput: "" }); setEditingTask(null); setShowModal(true); };
  const openEdit = task => { setForm({ ...task, tagInput: "", tags: task.tags || [], assignees: task.assignees || [] }); setEditingTask(task.id); setShowModal(true); };

  const saveTask = async () => {
    if (!form.title.trim()) return;
    const { tagInput, ...cleanForm } = form;
    if (editingTask) {
      await supabase.from("tasks").update(cleanForm).eq("id", editingTask);
    } else {
      await supabase.from("tasks").insert([{ ...cleanForm, comments: [] }]);
    }
    setShowModal(false);
    loadTasks();
  };

  const deleteTask = async id => {
    if (!window.confirm("Delete this task?")) return;
    await supabase.from("tasks").delete().eq("id", id);
    if (selectedTask?.id === id) setSelectedTask(null);
    loadTasks();
  };

  const updateStatus = async (id, status) => {
    await supabase.from("tasks").update({ status }).eq("id", id);
    setSelectedTask(prev => prev?.id === id ? { ...prev, status } : prev);
    loadTasks();
  };

  const addComment = async (taskId, text) => {
    if (!text.trim()) return;
    const task = tasks.find(t => t.id === taskId);
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) + " · " + now.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    const updatedComments = [...(task?.comments || []), { author: currentUser.id, text, time: timeStr }];
    await supabase.from("tasks").update({ comments: updatedComments }).eq("id", taskId);
    setSelectedTask(prev => prev?.id === taskId ? { ...prev, comments: updatedComments } : prev);
    loadTasks();
  };

  const stats = {
    total: visibleTasks.length,
    done: visibleTasks.filter(t => t.status === "done").length,
    inprogress: visibleTasks.filter(t => t.status === "inprogress").length,
    critical: visibleTasks.filter(t => t.priority === "critical" && t.status !== "done").length,
    overdue: visibleTasks.filter(t => getDaysLeft(t.due_date) < 0 && t.status !== "done").length,
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0D1117", display: "flex", alignItems: "center", justifyContent: "center", color: "#E6EDF3", fontFamily: "sans-serif", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 48 }}>⚡</div><div style={{ fontSize: 18, fontWeight: 700 }}>Loading TaskFlow Pro...</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0D1117", color: "#E6EDF3", fontFamily: "'DM Sans','Segoe UI',sans-serif", display: "flex", flexDirection: "column" }}>
      <nav style={{ background: "#161B22", borderBottom: "1px solid #30363D", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#FF6B35,#FF8C00)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
          <div><div style={{ fontWeight: 700, fontSize: 16 }}>TaskFlow Pro</div><div style={{ fontSize: 11, color: "#8B949E" }}>Digital Marketing Team</div></div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[["board","⬛ Board"],["list","≡ List"],["dashboard","◈ Dashboard"],["timeline","📅 Timeline"]].map(([v,l]) => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: view === v ? "#FF6B35" : "transparent", color: view === v ? "#fff" : "#8B949E" }}>{l}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: getMember(currentUser.id).color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#0D1117" }}>{getMember(currentUser.id).avatar}</div>
            <div><div style={{ fontSize: 12, fontWeight: 600 }}>{currentUser.name}</div><div style={{ fontSize: 10, color: "#8B949E" }}>{currentUser.role}</div></div>
          </div>
          {currentUser.id === "Pavanbhai" && <button onClick={() => setShowMemberModal(true)} style={{ background: "#21262D", border: "1px solid #30363D", borderRadius: 8, padding: "6px 12px", color: "#4ECDC4", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>👥 Members</button>}
          <button onClick={() => setCurrentUser(null)} style={{ background: "#21262D", border: "1px solid #30363D", borderRadius: 8, padding: "6px 12px", color: "#8B949E", cursor: "pointer", fontSize: 12 }}>🚪 Logout</button>
          <button onClick={openCreate} style={{ background: "linear-gradient(135deg,#FF6B35,#FF8C00)", color: "#fff", border: "none", borderRadius: 10, padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ New Task</button>
        </div>
      </nav>

      <div style={{ background: "#161B22", borderBottom: "1px solid #30363D", padding: "12px 24px", display: "flex", gap: 16, overflowX: "auto" }}>
        {[
          { label: "My Tasks", value: stats.total, color: "#4ECDC4", icon: "📋" },
          { label: "In Progress", value: stats.inprogress, color: "#FF8C00", icon: "⚙️" },
          { label: "Completed", value: stats.done, color: "#4CAF50", icon: "✅" },
          { label: "Critical", value: stats.critical, color: "#FF3B3B", icon: "🚨" },
          { label: "Overdue", value: stats.overdue, color: "#FF3B3B", icon: "⏰" },
        ].map(s => (
          <div key={s.label} style={{ background: "#0D1117", borderRadius: 10, padding: "10px 20px", border: `1px solid ${s.color}30`, minWidth: 120, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.icon} {s.value}</div>
            <div style={{ fontSize: 11, color: "#8B949E", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#8B949E" }}>Team:</span>
          <div style={{ display: "flex" }}>
            {members.map((m, i) => (
              <div key={m.id} title={m.name} onClick={() => setFilterAssignee(m.id === filterAssignee ? "all" : m.id)}
                style={{ width: 30, height: 30, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#0D1117", marginLeft: i === 0 ? 0 : -8, border: `2px solid ${filterAssignee === m.id ? "#FF6B35" : "#161B22"}`, cursor: "pointer", zIndex: members.length - i, transition: "transform 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >{m.avatar}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 24px", background: "#0D1117", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", borderBottom: "1px solid #30363D" }}>
        <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="🔍 Search tasks..."
          style={{ background: "#161B22", border: "1px solid #30363D", borderRadius: 8, padding: "7px 14px", color: "#E6EDF3", fontSize: 13, width: 200, outline: "none" }} />
        {[
          { val: filterAssignee, set: setFilterAssignee, opts: [["all","All Members"], ...members.map(m => [m.id, m.name])] },
          { val: filterPriority, set: setFilterPriority, opts: [["all","All Priority"], ...Object.entries(PRIORITY_CONFIG).map(([k,v]) => [k, v.icon+" "+v.label])] },
          { val: filterStatus, set: setFilterStatus, opts: [["all","All Status"], ...Object.entries(STATUS_CONFIG).map(([k,v]) => [k, v.icon+" "+v.label])] },
        ].map((f, i) => (
          <select key={i} value={f.val} onChange={e => f.set(e.target.value)} style={{ background: "#161B22", border: "1px solid #30363D", borderRadius: 8, padding: "7px 12px", color: "#E6EDF3", fontSize: 13, cursor: "pointer", outline: "none" }}>
            {f.opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
        <span style={{ fontSize: 12, color: "#8B949E", marginLeft: "auto" }}>{visibleTasks.length} tasks</span>
      </div>

      <div style={{ flex: 1, padding: 24, overflow: "auto" }}>
        {view === "board" && <BoardView tasks={visibleTasks} getMember={getMember} onSelect={setSelectedTask} onEdit={openEdit} onDelete={deleteTask} />}
        {view === "list" && <ListView tasks={visibleTasks} getMember={getMember} onSelect={setSelectedTask} onEdit={openEdit} onDelete={deleteTask} />}
        {view === "dashboard" && <DashboardView tasks={visibleTasks} members={members} onFilterStatus={s => { setFilterStatus(s); setView("list"); }} onFilterPriority={p => { setFilterPriority(p); setView("list"); }} onFilterMember={id => { setFilterAssignee(id); setView("list"); }} />}
        {view === "timeline" && <TimelineView tasks={visibleTasks} getMember={getMember} onSelect={setSelectedTask} />}
      </div>

      {selectedTask && <TaskDetail task={selectedTask} members={members} getMember={getMember} currentUser={currentUser} onClose={() => setSelectedTask(null)} onEdit={() => { openEdit(selectedTask); setSelectedTask(null); }} onDelete={() => deleteTask(selectedTask.id)} onStatusChange={updateStatus} onComment={addComment} />}
      {showModal && <TaskModal form={form} setForm={setForm} editing={!!editingTask} members={members} onSave={saveTask} onClose={() => setShowModal(false)} />}
      {showMemberModal && <MemberModal members={members} onClose={() => setShowMemberModal(false)} onRefresh={loadMembers} />}
    </div>
  );
}

function BoardView({ tasks, getMember, onSelect, onEdit, onDelete }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, minWidth: 900 }}>
      {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
        const col = tasks.filter(t => t.status === status).sort((a,b) => (PRIORITY_CONFIG[a.priority]?.order||3) - (PRIORITY_CONFIG[b.priority]?.order||3));
        return (
          <div key={status}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "8px 12px", background: cfg.bg, borderRadius: 8, border: `1px solid ${cfg.color}30` }}>
              <span style={{ color: cfg.color }}>{cfg.icon}</span>
              <span style={{ fontWeight: 700, fontSize: 13, color: cfg.color }}>{cfg.label}</span>
              <span style={{ marginLeft: "auto", background: cfg.color, color: "#fff", borderRadius: 20, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>{col.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.map(task => <TaskCard key={task.id} task={task} getMember={getMember} onClick={() => onSelect(task)} onEdit={() => onEdit(task)} onDelete={() => onDelete(task.id)} />)}
              {col.length === 0 && <div style={{ border: "2px dashed #30363D", borderRadius: 10, padding: 20, textAlign: "center", color: "#484F58", fontSize: 12 }}>No tasks</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskCard({ task, getMember, onClick, onEdit, onDelete }) {
  const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const days = getDaysLeft(task.due_date);
  const overdue = days !== null && days < 0 && task.status !== "done";
  const assignees = task.assignees || [];
  return (
    <div onClick={onClick} style={{ background: "#161B22", borderRadius: 12, padding: 14, border: `1px solid ${overdue ? "#FF3B3B50" : "#30363D"}`, cursor: "pointer", transition: "all 0.2s", borderLeft: `3px solid ${p.color}` }}
      onMouseEnter={e => e.currentTarget.style.background = "#1C2128"} onMouseLeave={e => e.currentTarget.style.background = "#161B22"}>
      <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: p.bg, color: p.color }}>{p.icon} {p.label}</span>
        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "#21262D", color: "#8B949E" }}>{task.category}</span>
        {assignees.length > 1 && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "#4ECDC418", color: "#4ECDC4" }}>👥 {assignees.length} members</span>}
      </div>
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, lineHeight: 1.4 }}>{task.title}</div>
      <div style={{ fontSize: 11, color: "#8B949E", marginBottom: 10, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{task.description}</div>
      {task.tags?.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
          {task.tags.slice(0,3).map(tag => <span key={tag} style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "#21262D", color: "#58A6FF" }}>#{tag}</span>)}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
        <div style={{ display: "flex" }}>
          {assignees.slice(0,3).map((aid, i) => {
            const m = getMember(aid);
            return <div key={aid} title={m.name} style={{ width: 22, height: 22, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#0D1117", marginLeft: i === 0 ? 0 : -6, border: "1px solid #161B22" }}>{m.avatar}</div>;
          })}
          {assignees.length > 3 && <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#30363D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#8B949E", marginLeft: -6, border: "1px solid #161B22" }}>+{assignees.length-3}</div>}
        </div>
        {task.due_date && <span style={{ fontSize: 10, fontWeight: 600, marginLeft: "auto", color: overdue ? "#FF3B3B" : days <= 2 ? "#FF8C00" : "#8B949E" }}>{overdue ? `⚠️ ${Math.abs(days)}d late` : days === 0 ? "⚡ Today" : `📅 ${days}d`}</span>}
        <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
          <button onClick={onEdit} style={{ background: "none", border: "none", cursor: "pointer", color: "#8B949E", fontSize: 12 }}>✏️</button>
          <button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", color: "#8B949E", fontSize: 12 }}>🗑️</button>
        </div>
      </div>
      {task.comments?.length > 0 && <div style={{ marginTop: 8, fontSize: 10, color: "#8B949E" }}>💬 {task.comments.length} comment{task.comments.length !== 1 ? "s" : ""}</div>}
    </div>
  );
}

function ListView({ tasks, getMember, onSelect, onEdit, onDelete }) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 100px", padding: "8px 16px", fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase", borderBottom: "1px solid #30363D", marginBottom: 8 }}>
        <span>Task</span><span>Assignees</span><span>Priority</span><span>Status</span><span>Due Date</span><span>Actions</span>
      </div>
      {[...tasks].sort((a,b) => (PRIORITY_CONFIG[a.priority]?.order||3) - (PRIORITY_CONFIG[b.priority]?.order||3)).map(task => {
        const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
        const s = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
        const days = getDaysLeft(task.due_date);
        const overdue = days !== null && days < 0 && task.status !== "done";
        const assignees = task.assignees || [];
        return (
          <div key={task.id} onClick={() => onSelect(task)} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 100px", padding: "12px 16px", borderRadius: 10, cursor: "pointer", background: "#161B22", marginBottom: 6, border: "1px solid #30363D", alignItems: "center", borderLeft: `3px solid ${p.color}` }}
            onMouseEnter={e => e.currentTarget.style.background = "#1C2128"} onMouseLeave={e => e.currentTarget.style.background = "#161B22"}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{task.title}</div>
              <div style={{ fontSize: 11, color: "#8B949E" }}>{task.category}{assignees.length > 1 ? " · 👥 Team" : ""}</div>
            </div>
            <div style={{ display: "flex" }}>
              {assignees.slice(0,3).map((aid, i) => { const m = getMember(aid); return <div key={aid} title={m.name} style={{ width: 24, height: 24, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#0D1117", marginLeft: i === 0 ? 0 : -8, border: "2px solid #161B22" }}>{m.avatar}</div>; })}
              {assignees.length > 3 && <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#30363D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#8B949E", marginLeft: -8, border: "2px solid #161B22" }}>+{assignees.length-3}</div>}
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: p.bg, color: p.color, display: "inline-block" }}>{p.icon} {p.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: s.bg, color: s.color, display: "inline-block" }}>{s.icon} {s.label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: overdue ? "#FF3B3B" : days <= 2 ? "#FF8C00" : "#8B949E" }}>{task.due_date ? (overdue ? `⚠️ ${Math.abs(days)}d ago` : formatDate(task.due_date)) : "—"}</span>
            <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
              <button onClick={() => onEdit(task)} style={{ background: "#21262D", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 12 }}>✏️</button>
              <button onClick={() => onDelete(task.id)} style={{ background: "#21262D", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 12 }}>🗑️</button>
            </div>
          </div>
        );
      })}
      {tasks.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#484F58" }}><div style={{ fontSize: 32 }}>🔍</div><div style={{ marginTop: 8 }}>No tasks found</div></div>}
    </div>
  );
}

function TimelineView({ tasks, getMember, onSelect }) {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const days = Array.from({ length: 30 }, (_, i) => { const d = new Date(startOfMonth); d.setDate(i+1); return d; });
  const tasksWithDates = tasks.filter(t => t.start_date || t.due_date);
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#E6EDF3" }}>📅 Timeline — {today.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</div>
      {tasksWithDates.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#484F58" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <div style={{ fontSize: 16 }}>No tasks with dates yet</div>
          <div style={{ fontSize: 13, marginTop: 8 }}>Add start & due dates when creating tasks to see them here</div>
        </div>
      ) : (
        <div style={{ minWidth: 900 }}>
          <div style={{ display: "flex", marginBottom: 8 }}>
            <div style={{ width: 220, flexShrink: 0 }} />
            {days.map((d, i) => (
              <div key={i} style={{ flex: 1, minWidth: 28, textAlign: "center", fontSize: 10, color: d.toDateString() === today.toDateString() ? "#FF6B35" : "#8B949E", fontWeight: d.toDateString() === today.toDateString() ? 700 : 400 }}>{d.getDate()}</div>
            ))}
          </div>
          {tasksWithDates.map(task => {
            const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
            const start = task.start_date ? new Date(task.start_date) : new Date(task.due_date);
            const end = task.due_date ? new Date(task.due_date) : start;
            const startDay = Math.max(0, Math.floor((start - startOfMonth) / 86400000));
            const endDay = Math.min(29, Math.floor((end - startOfMonth) / 86400000));
            const width = Math.max(1, endDay - startDay + 1);
            const assignees = task.assignees || [];
            return (
              <div key={task.id} style={{ display: "flex", alignItems: "center", marginBottom: 8, height: 36 }}>
                <div style={{ width: 220, flexShrink: 0, display: "flex", alignItems: "center", gap: 6, paddingRight: 12, overflow: "hidden" }}>
                  <div style={{ display: "flex" }}>
                    {assignees.slice(0,2).map((aid, i) => { const m = getMember(aid); return <div key={aid} style={{ width: 20, height: 20, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#0D1117", marginLeft: i === 0 ? 0 : -6, border: "1px solid #0D1117" }}>{m.avatar}</div>; })}
                  </div>
                  <span style={{ fontSize: 11, color: "#E6EDF3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }} onClick={() => onSelect(task)}>{task.title}</span>
                </div>
                <div style={{ flex: 1, position: "relative", height: "100%", display: "flex", alignItems: "center" }}>
                  {days.map((_, i) => <div key={i} style={{ flex: 1, minWidth: 28, height: "100%", borderRight: "1px solid #21262D" }} />)}
                  {startDay <= 29 && endDay >= 0 && (
                    <div onClick={() => onSelect(task)} style={{ position: "absolute", left: `${(startDay/30)*100}%`, width: `${(width/30)*100}%`, height: 24, background: p.bg, border: `1px solid ${p.color}`, borderRadius: 6, display: "flex", alignItems: "center", paddingLeft: 8, fontSize: 10, color: p.color, fontWeight: 600, cursor: "pointer", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", boxSizing: "border-box" }}>
                      {p.icon} {task.title}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DashboardView({ tasks, members, onFilterStatus, onFilterPriority, onFilterMember }) {
  const byStatus = Object.fromEntries(Object.keys(STATUS_CONFIG).map(s => [s, tasks.filter(t => t.status === s).length]));
  const byPriority = Object.fromEntries(Object.keys(PRIORITY_CONFIG).map(p => [p, tasks.filter(t => t.priority === p).length]));
  const byMember = members.map(m => ({ ...m, total: tasks.filter(t => t.assignees?.includes(m.id)).length, done: tasks.filter(t => t.assignees?.includes(m.id) && t.status === "done").length, critical: tasks.filter(t => t.assignees?.includes(m.id) && t.priority === "critical" && t.status !== "done").length }));
  const completion = tasks.length ? Math.round((byStatus.done / tasks.length) * 100) : 0;
  const upcoming = tasks.filter(t => t.status !== "done" && t.due_date).sort((a,b) => new Date(a.due_date) - new Date(b.due_date)).slice(0,4);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, maxWidth: 1200 }}>
      <div style={{ background: "#161B22", borderRadius: 16, padding: 24, border: "1px solid #30363D" }}>
        <div style={{ fontSize: 13, color: "#8B949E", fontWeight: 600, marginBottom: 16 }}>📊 OVERALL PROGRESS</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: "#4ECDC4" }}>{completion}%</div>
          <div style={{ fontSize: 13, color: "#8B949E" }}>Tasks Completed</div>
          <div style={{ margin: "16px 0", height: 12, background: "#21262D", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${completion}%`, background: "linear-gradient(90deg,#4ECDC4,#45B7D1)", borderRadius: 10, transition: "width 1s" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <div key={key} onClick={() => onFilterStatus(key)} style={{ cursor: "pointer", background: cfg.bg, borderRadius: 8, padding: "8px 12px", border: `1px solid ${cfg.color}30` }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ fontSize: 20, fontWeight: 800, color: cfg.color }}>{byStatus[key]}</div>
                <div style={{ fontSize: 10, color: cfg.color }}>{cfg.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: "#161B22", borderRadius: 16, padding: 24, border: "1px solid #30363D" }}>
        <div style={{ fontSize: 13, color: "#8B949E", fontWeight: 600, marginBottom: 16 }}>👥 TEAM WORKLOAD</div>
        {byMember.map(m => (
          <div key={m.id} onClick={() => onFilterMember(m.id)} style={{ cursor: "pointer", marginBottom: 14, padding: "6px 8px", borderRadius: 8, border: "1px solid transparent" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#21262D"; e.currentTarget.style.border = `1px solid ${m.color}40`; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.border = "1px solid transparent"; }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#0D1117" }}>{m.avatar}</div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{m.name}</div><div style={{ fontSize: 10, color: "#8B949E" }}>{m.role}</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.done}/{m.total}</div>{m.critical > 0 && <div style={{ fontSize: 9, color: "#FF3B3B" }}>🔴 {m.critical} critical</div>}</div>
            </div>
            <div style={{ height: 6, background: "#21262D", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 10, background: m.color, width: `${m.total ? (m.done/m.total)*100 : 0}%`, transition: "width 0.8s" }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: "#161B22", borderRadius: 16, padding: 24, border: "1px solid #30363D" }}>
        <div style={{ fontSize: 13, color: "#8B949E", fontWeight: 600, marginBottom: 16 }}>🎯 PRIORITY BREAKDOWN</div>
        {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
          <div key={key} onClick={() => onFilterPriority(key)} style={{ cursor: "pointer", marginBottom: 16, padding: "6px 8px", borderRadius: 8, border: "1px solid transparent" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#21262D"; e.currentTarget.style.border = `1px solid ${cfg.color}40`; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.border = "1px solid transparent"; }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>{cfg.icon} {cfg.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{byPriority[key]}</span>
            </div>
            <div style={{ height: 8, background: "#21262D", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 10, background: cfg.color, width: `${tasks.length ? (byPriority[key]/tasks.length)*100 : 0}%`, transition: "width 0.8s" }} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 20, padding: 14, background: "#0D1117", borderRadius: 10, border: "1px solid #30363D" }}>
          <div style={{ fontSize: 11, color: "#8B949E", marginBottom: 8, fontWeight: 600 }}>⏰ UPCOMING DEADLINES</div>
          {upcoming.map(t => { const d = getDaysLeft(t.due_date); return (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, padding: "4px 6px", borderRadius: 6, alignItems: "center" }}>
              <div style={{ fontSize: 11, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
              <span style={{ fontSize: 10, fontWeight: 700, marginLeft: 8, color: d < 0 ? "#FF3B3B" : d <= 2 ? "#FF8C00" : "#8B949E" }}>{d < 0 ? `${Math.abs(d)}d late` : d === 0 ? "Today!" : `${d}d`}</span>
            </div>
          ); })}
          {upcoming.length === 0 && <div style={{ fontSize: 11, color: "#484F58", textAlign: "center" }}>No upcoming deadlines</div>}
        </div>
      </div>
    </div>
  );
}

function TaskDetail({ task, members, getMember, currentUser, onClose, onEdit, onDelete, onStatusChange, onComment }) {
  const [commentText, setCommentText] = useState("");
  const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const days = getDaysLeft(task.due_date);
  const assignees = task.assignees || [];
  return (
    <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 440, background: "#161B22", borderLeft: "1px solid #30363D", zIndex: 200, display: "flex", flexDirection: "column", boxShadow: "-20px 0 60px #00000060" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #30363D", display: "flex", gap: 8 }}>
        <button onClick={onClose} style={{ background: "#21262D", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#E6EDF3" }}>✕</button>
        <button onClick={onEdit} style={{ background: "#21262D", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#4ECDC4", fontWeight: 600, fontSize: 12 }}>✏️ Edit</button>
        <button onClick={() => { onDelete(); onClose(); }} style={{ background: "#FF3B3B18", border: "1px solid #FF3B3B40", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#FF3B3B", fontWeight: 600, fontSize: 12 }}>🗑️ Delete</button>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: p.bg, color: p.color }}>{p.icon} {p.label}</span>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "#21262D", color: "#8B949E" }}>{task.category}</span>
          {assignees.length > 1 && <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "#4ECDC418", color: "#4ECDC4" }}>👥 Team Task ({assignees.length})</span>}
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, lineHeight: 1.4 }}>{task.title}</h2>
        <p style={{ fontSize: 13, color: "#8B949E", lineHeight: 1.6, marginBottom: 20 }}>{task.description}</p>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#8B949E", marginBottom: 8, fontWeight: 600 }}>STATUS</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => onStatusChange(task.id, key)} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${key === task.status ? cfg.color : "#30363D"}`, background: key === task.status ? cfg.bg : "transparent", color: key === task.status ? cfg.color : "#8B949E", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>{cfg.icon} {cfg.label}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#8B949E", marginBottom: 8, fontWeight: 600 }}>ASSIGNED TO ({assignees.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {assignees.map(aid => { const m = getMember(aid); return (
              <div key={aid} style={{ display: "flex", alignItems: "center", gap: 6, background: "#0D1117", borderRadius: 20, padding: "4px 12px 4px 4px", border: "1px solid #30363D" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#0D1117" }}>{m.avatar}</div>
                <span style={{ fontSize: 12 }}>{m.name}</span>
              </div>
            ); })}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Start Date", content: task.start_date ? formatDate(task.start_date) : "Not set" },
            { label: "Due Date", content: <span style={{ color: days !== null && days < 0 ? "#FF3B3B" : "#E6EDF3" }}>{task.due_date ? formatDate(task.due_date) : "Not set"}</span> },
            { label: "Created By", content: getMember(task.created_by).name },
            { label: "Created", content: formatDate(task.created_at) },
          ].map(item => (
            <div key={item.label} style={{ background: "#0D1117", borderRadius: 8, padding: "10px 12px", border: "1px solid #30363D" }}>
              <div style={{ fontSize: 10, color: "#8B949E", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>{item.label}</div>
              <div style={{ fontSize: 12 }}>{item.content}</div>
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
          {task.comments?.map((c, i) => { const cm = getMember(c.author); return (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: cm.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#0D1117", flexShrink: 0 }}>{cm.avatar}</div>
              <div style={{ background: "#0D1117", borderRadius: 8, padding: "8px 12px", flex: 1, border: "1px solid #30363D" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#4ECDC4", marginBottom: 2 }}>{cm.name} <span style={{ color: "#484F58", fontWeight: 400 }}>· {c.time}</span></div>
                <div style={{ fontSize: 12, color: "#C9D1D9" }}>{c.text}</div>
              </div>
            </div>
          ); })}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { onComment(task.id, commentText); setCommentText(""); } }} placeholder="Add a comment... (Enter to send)"
              style={{ flex: 1, background: "#0D1117", border: "1px solid #30363D", borderRadius: 8, padding: "8px 12px", color: "#E6EDF3", fontSize: 12, outline: "none" }} />
            <button onClick={() => { onComment(task.id, commentText); setCommentText(""); }} style={{ background: "#FF6B35", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskModal({ form, setForm, editing, members, onSave, onClose }) {
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const addTag = () => { if (form.tagInput?.trim() && !form.tags?.includes(form.tagInput.trim())) { set("tags", [...(form.tags||[]), form.tagInput.trim()]); set("tagInput", ""); } };
  const toggleAssignee = id => { const c = form.assignees || []; set("assignees", c.includes(id) ? c.filter(a => a !== id) : [...c, id]); };
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000080", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#161B22", borderRadius: 20, padding: 28, width: 560, maxHeight: "88vh", overflow: "auto", border: "1px solid #30363D", boxShadow: "0 25px 80px #000000A0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{editing ? "✏️ Edit Task" : "✨ Create New Task"}</h2>
          <button onClick={onClose} style={{ background: "#21262D", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#E6EDF3" }}>✕</button>
        </div>
        <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Task Title *</label>
        <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Enter task title..."
          style={{ width: "100%", background: "#0D1117", border: "1px solid #30363D", borderRadius: 10, padding: "10px 14px", color: "#E6EDF3", fontSize: 14, outline: "none", marginTop: 6, marginBottom: 16, boxSizing: "border-box" }} />
        <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Description</label>
        <textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Task description..." rows={3}
          style={{ width: "100%", background: "#0D1117", border: "1px solid #30363D", borderRadius: 10, padding: "10px 14px", color: "#E6EDF3", fontSize: 13, outline: "none", marginTop: 6, marginBottom: 16, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
        <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Assign To — select multiple for team task</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8, marginBottom: 16 }}>
          {members.map(m => { const sel = form.assignees?.includes(m.id); return (
            <div key={m.id} onClick={() => toggleAssignee(m.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, cursor: "pointer", border: `1px solid ${sel ? m.color : "#30363D"}`, background: sel ? m.color + "20" : "transparent" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#0D1117" }}>{m.avatar}</div>
              <span style={{ fontSize: 12, color: sel ? m.color : "#8B949E", fontWeight: sel ? 600 : 400 }}>{m.name}</span>
              {sel && <span style={{ color: m.color, fontSize: 12 }}>✓</span>}
            </div>
          ); })}
        </div>
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
            <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Start Date</label>
            <input type="date" value={form.start_date||""} onChange={e => set("start_date", e.target.value)} style={{ width: "100%", background: "#0D1117", border: "1px solid #30363D", borderRadius: 10, padding: "10px 14px", color: "#E6EDF3", fontSize: 13, outline: "none", marginTop: 6, boxSizing: "border-box", colorScheme: "dark" }} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Due Date</label>
            <input type="date" value={form.due_date||""} onChange={e => set("due_date", e.target.value)} style={{ width: "100%", background: "#0D1117", border: "1px solid #30363D", borderRadius: 10, padding: "10px 14px", color: "#E6EDF3", fontSize: 13, outline: "none", marginTop: 6, boxSizing: "border-box", colorScheme: "dark" }} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Category</label>
            <select value={form.category} onChange={e => set("category", e.target.value)} style={{ width: "100%", background: "#0D1117", border: "1px solid #30363D", borderRadius: 10, padding: "10px 14px", color: "#E6EDF3", fontSize: 13, outline: "none", marginTop: 6, cursor: "pointer" }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Created By</label>
            <select value={form.created_by} onChange={e => set("created_by", e.target.value)} style={{ width: "100%", background: "#0D1117", border: "1px solid #30363D", borderRadius: 10, padding: "10px 14px", color: "#E6EDF3", fontSize: 13, outline: "none", marginTop: 6, cursor: "pointer" }}>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>
        <label style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Tags</label>
        <div style={{ display: "flex", gap: 8, marginTop: 6, marginBottom: 8 }}>
          <input value={form.tagInput||""} onChange={e => set("tagInput", e.target.value)} onKeyDown={e => e.key === "Enter" && addTag()} placeholder="Add tag and press Enter..."
            style={{ flex: 1, background: "#0D1117", border: "1px solid #30363D", borderRadius: 10, padding: "8px 14px", color: "#E6EDF3", fontSize: 13, outline: "none" }} />
          <button onClick={addTag} style={{ background: "#21262D", border: "1px solid #30363D", borderRadius: 10, padding: "8px 14px", color: "#E6EDF3", cursor: "pointer", fontSize: 13 }}>+ Add</button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
          {(form.tags||[]).map(tag => (
            <span key={tag} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "#21262D", color: "#58A6FF", display: "flex", alignItems: "center", gap: 4 }}>
              #{tag}<button onClick={() => set("tags", form.tags.filter(t => t !== tag))} style={{ background: "none", border: "none", color: "#8B949E", cursor: "pointer", padding: 0, fontSize: 12 }}>×</button>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: "#21262D", border: "1px solid #30363D", borderRadius: 10, padding: "11px", color: "#E6EDF3", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Cancel</button>
          <button onClick={onSave} style={{ flex: 2, background: "linear-gradient(135deg,#FF6B35,#FF8C00)", border: "none", borderRadius: 10, padding: "11px", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>{editing ? "✅ Save Changes" : "✨ Create Task"}</button>
        </div>
      </div>
    </div>
  );
}

function MemberModal({ members, onClose, onRefresh }) {
  const [newMember, setNewMember] = useState({ id: "", name: "", role: "", avatar: "", color: COLORS[0], password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const addMember = async () => {
    if (!newMember.id || !newMember.name || !newMember.password) { setError("Please fill Username, Name and Password"); return; }
    setLoading(true);
    const avatar = newMember.avatar || newMember.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2);
    const { error: err } = await supabase.from("members").insert([{ ...newMember, avatar }]);
    if (err) { setError(err.message); } else { setNewMember({ id: "", name: "", role: "", avatar: "", color: COLORS[0], password: "" }); onRefresh(); }
    setLoading(false);
  };
  const deleteMember = async id => {
    if (id === "Pavanbhai") { alert("Cannot delete Boss account!"); return; }
    if (!window.confirm(`Remove ${id} from team?`)) return;
    await supabase.from("members").delete().eq("id", id);
    onRefresh();
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000080", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#161B22", borderRadius: 20, padding: 28, width: 560, maxHeight: "85vh", overflow: "auto", border: "1px solid #30363D", boxShadow: "0 25px 80px #000000A0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>👥 Manage Team Members</h2>
          <button onClick={onClose} style={{ background: "#21262D", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#E6EDF3" }}>✕</button>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: "#8B949E", fontWeight: 600, marginBottom: 12, textTransform: "uppercase" }}>Current Members ({members.length})</div>
          {members.map(m => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#0D1117", borderRadius: 10, marginBottom: 8, border: "1px solid #30363D" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#0D1117" }}>{m.avatar}</div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div><div style={{ fontSize: 11, color: "#8B949E" }}>{m.role} · @{m.id}</div></div>
              {m.id !== "Pavanbhai" && <button onClick={() => deleteMember(m.id)} style={{ background: "#FF3B3B18", border: "1px solid #FF3B3B40", borderRadius: 8, padding: "4px 10px", cursor: "pointer", color: "#FF3B3B", fontSize: 12 }}>Remove</button>}
            </div>
          ))}
        </div>
        <div style={{ background: "#0D1117", borderRadius: 12, padding: 16, border: "1px solid #30363D" }}>
          <div style={{ fontSize: 12, color: "#8B949E", fontWeight: 600, marginBottom: 12, textTransform: "uppercase" }}>➕ Add New Member</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            {[["Username (login)", "id", "e.g. Mehul"],["Full Name","name","e.g. Mehul Savsani"],["Role","role","e.g. Export Manager"],["Password","password","e.g. Mehul@00183"]].map(([label, key, ph]) => (
              <div key={key}>
                <label style={{ fontSize: 10, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>{label}</label>
                <input value={newMember[key]} onChange={e => setNewMember(p => ({ ...p, [key]: e.target.value }))} placeholder={ph}
                  style={{ width: "100%", background: "#161B22", border: "1px solid #30363D", borderRadius: 8, padding: "8px 12px", color: "#E6EDF3", fontSize: 13, outline: "none", marginTop: 4, boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 10, color: "#8B949E", fontWeight: 600, textTransform: "uppercase" }}>Avatar Color</label>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              {COLORS.map(c => <div key={c} onClick={() => setNewMember(p => ({ ...p, color: c }))} style={{ width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer", border: newMember.color === c ? "2px solid #fff" : "2px solid transparent" }} />)}
            </div>
          </div>
          {error && <div style={{ fontSize: 12, color: "#FF3B3B", marginBottom: 10 }}>{error}</div>}
          <button onClick={addMember} disabled={loading} style={{ width: "100%", background: "linear-gradient(135deg,#FF6B35,#FF8C00)", border: "none", borderRadius: 10, padding: "10px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Adding..." : "➕ Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
}
