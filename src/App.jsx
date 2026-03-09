import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nzoqtyclrhjdjciyzakr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56b3F0eWNscmhqZGpjaXl6YWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMjIzOTEsImV4cCI6MjA4ODU5ODM5MX0.AwFTcRoB5J_Id91BkP9x2crcDBWz6623hUhA8mXPQAI";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
  const [view, setView] = useState("invite");
  const [guests, setGuests] = useState([]);
  const [form, setForm] = useState({ name: "", attending: "yes", guests: 1, note: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [submittedAttending, setSubmittedAttending] = useState("yes");
  const [adminMode, setAdminMode] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [adminError, setAdminError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (view === "guestlist") fetchGuests();
  }, [view]);

  async function fetchGuests() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("Rsvps")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setGuests(data || []);
    } catch (e) {
      setError("Couldn't load guests. Check your Supabase table.");
    }
    setLoading(false);
  }

  async function handleRSVP() {
    if (!form.name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const { error } = await supabase.from("Rsvps").insert([{
        name: form.name.trim(),
        attending: form.attending,
        guests: form.attending === "yes" ? parseInt(form.guests) : 0,
        note: form.note.trim(),
      }]);
      if (error) throw error;
      setSubmittedName(form.name.trim());
      setSubmittedAttending(form.attending);
      setSubmitted(true);
      setForm({ name: "", attending: "yes", guests: 1, note: "" });
    } catch (e) {
      setError("Couldn't save your RSVP. Please try again.");
    }
    setSubmitting(false);
  }

  function handleAdminLogin() {
    if (adminCode === "menen3") {
      setAdminMode(true);
      setAdminError(false);
    } else {
      setAdminError(true);
    }
  }

  async function removeGuest(id) {
    try {
      const { error } = await supabase.from("Rsvps").delete().eq("id", id);
      if (error) throw error;
      setGuests(prev => prev.filter(g => g.id !== id));
    } catch (e) {
      setError("Couldn't remove guest.");
    }
  }

  const attending = guests.filter(g => g.attending === "yes");
  const notAttending = guests.filter(g => g.attending === "no");
  const totalPeople = attending.reduce((sum, g) => sum + (g.guests || 0), 0);

  const confettiDots = [
    { width:12, height:12, background:"#ffb3d9", top:"6%",  left:"5%",   animDelay:"0s",   dur:"3.5s" },
    { width:8,  height:8,  background:"#7ec8e3", top:"12%", right:"7%",  animDelay:"0.5s", dur:"4s"   },
    { width:10, height:10, background:"#ffe066", top:"22%", left:"3%",   animDelay:"1s",   dur:"3s"   },
    { width:7,  height:7,  background:"#b3f0b3", top:"40%", right:"4%",  animDelay:"0.3s", dur:"4.5s" },
    { width:14, height:14, background:"#c06bff", top:"5%",  right:"18%", animDelay:"0.8s", dur:"3.8s", opacity:0.5, borderRadius:"3px" },
    { width:9,  height:9,  background:"#ff8c42", top:"55%", left:"6%",   animDelay:"1.2s", dur:"4.2s" },
  ];

  const ConfettiDots = () => confettiDots.map((d, i) => (
    <div key={i} className="confetti-dot" style={{
      width: d.width, height: d.height, background: d.background,
      top: d.top, left: d.left, right: d.right,
      animationDelay: d.animDelay, animationDuration: d.dur,
      opacity: d.opacity || 1, borderRadius: d.borderRadius || "50%"
    }} />
  ));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Nunito:wght@400;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body {
          background: linear-gradient(135deg, #f0e8ff 0%, #ffe8f4 50%, #e8f4ff 100%);
          min-height: 100vh;
          font-family: 'Nunito', sans-serif;
          display: flex; align-items: flex-start; justify-content: center;
          padding: 30px 16px 60px;
        }
        .wrapper { width:100%; max-width:520px; display:flex; flex-direction:column; align-items:center; gap:16px; }
        .tabs { display:flex; gap:8px; background:rgba(255,255,255,0.7); padding:6px; border-radius:50px; backdrop-filter:blur(10px); box-shadow:0 4px 20px rgba(200,100,180,0.12); }
        .tab { padding:8px 20px; border-radius:50px; border:none; background:transparent; font-family:'Nunito',sans-serif; font-weight:700; font-size:0.82rem; cursor:pointer; color:#9090b0; transition:all 0.25s; letter-spacing:0.04em; }
        .tab.active { background:linear-gradient(135deg,#ff85b3,#c06bff); color:white; box-shadow:0 4px 14px rgba(192,107,255,0.35); }
        .tab:hover:not(.active) { color:#ff85b3; }
        .card { width:100%; background:linear-gradient(160deg,#fff9f0 0%,#fff0f8 50%,#f0f8ff 100%); border-radius:32px; box-shadow:0 30px 80px rgba(200,100,180,0.18),0 2px 8px rgba(0,0,0,0.06); position:relative; overflow:hidden; padding:50px 44px 44px; display:flex; flex-direction:column; align-items:center; }
        .card::before { content:''; position:absolute; top:-80px; right:-80px; width:260px; height:260px; border-radius:50%; background:radial-gradient(circle,#ffb3d9,#ffd6ec 60%,transparent 80%); opacity:0.45; }
        .card::after  { content:''; position:absolute; bottom:-60px; left:-60px; width:220px; height:220px; border-radius:50%; background:radial-gradient(circle,#b3d9ff,#d6eeff 60%,transparent 80%); opacity:0.45; }
        .confetti-dot { position:absolute; border-radius:50%; animation:floatDot 4s ease-in-out infinite; }
        @keyframes floatDot { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(180deg)} }
        .star-deco { position:absolute; animation:twinkle 2.5s ease-in-out infinite; }
        @keyframes twinkle { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }

        .header-badge { background:linear-gradient(135deg,#ff85b3,#ffb347); color:white; font-size:0.72rem; font-weight:800; letter-spacing:0.2em; text-transform:uppercase; padding:6px 20px; border-radius:50px; margin-bottom:18px; position:relative; z-index:2; box-shadow:0 4px 14px rgba(255,133,179,0.35); }
        .big-name { font-family:'Dancing Script',cursive; font-size:5.2rem; background:linear-gradient(135deg,#ff5f9e 0%,#ff8c42 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1; position:relative; z-index:2; filter:drop-shadow(0 4px 12px rgba(255,95,158,0.2)); }
        .turning { font-size:1.5rem; font-weight:800; color:#ff8c42; margin-top:6px; position:relative; z-index:2; }
        .divider { width:60px; height:3px; border-radius:2px; background:linear-gradient(90deg,#ff85b3,#7ec8e3,#ffb347); margin:20px auto; position:relative; z-index:2; }
        .info-block { background:rgba(255,255,255,0.72); border-radius:20px; padding:24px 32px; width:100%; text-align:center; position:relative; z-index:2; border:1.5px solid rgba(255,180,220,0.3); box-shadow:0 8px 30px rgba(255,133,179,0.10); backdrop-filter:blur(6px); }
        .info-row { display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:14px; }
        .info-row:last-child { margin-bottom:0; }
        .info-icon { font-size:1.3rem; }
        .info-label { font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.15em; color:#b0b0c0; display:block; margin-bottom:1px; }
        .info-date { color:#5bbfd6; font-size:1.15rem; font-weight:800; }
        .info-time { color:#8a75d6; font-size:1.1rem; font-weight:700; }
        .info-address { color:#3d3d5c; font-size:0.95rem; line-height:1.5; font-weight:600; }
        .emoji-row { display:flex; gap:14px; margin:22px 0 8px; position:relative; z-index:2; font-size:2rem; }
        .emoji-row span { display:inline-block; animation:bounce 2s ease-in-out infinite; }
        .emoji-row span:nth-child(2){animation-delay:0.2s} .emoji-row span:nth-child(3){animation-delay:0.4s} .emoji-row span:nth-child(4){animation-delay:0.6s} .emoji-row span:nth-child(5){animation-delay:0.8s}
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .rsvp-cta { margin-top:22px; background:linear-gradient(135deg,#ff85b3,#c06bff); color:white; font-size:0.9rem; font-weight:800; padding:13px 36px; border-radius:50px; border:none; cursor:pointer; position:relative; z-index:2; box-shadow:0 6px 20px rgba(192,107,255,0.4); font-family:'Nunito',sans-serif; transition:transform 0.2s,box-shadow 0.2s; }
        .rsvp-cta:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(192,107,255,0.5); }
        .bottom-hearts { position:absolute; bottom:14px; z-index:2; font-size:1rem; color:#ffb3cc; letter-spacing:6px; opacity:0.7; }

        .form-title { font-family:'Dancing Script',cursive; font-size:2.6rem; background:linear-gradient(135deg,#ff5f9e,#c06bff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; position:relative; z-index:2; margin-bottom:6px; }
        .form-sub { color:#9090b0; font-size:0.88rem; font-weight:600; position:relative; z-index:2; margin-bottom:22px; text-align:center; }
        .form-group { width:100%; margin-bottom:16px; position:relative; z-index:2; }
        .form-label { display:block; font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:0.12em; color:#b0b0c0; margin-bottom:6px; }
        .form-input { width:100%; padding:12px 16px; border:2px solid rgba(255,180,220,0.4); border-radius:14px; background:rgba(255,255,255,0.8); font-family:'Nunito',sans-serif; font-size:0.95rem; font-weight:600; color:#3d3d5c; outline:none; transition:border 0.2s,box-shadow 0.2s; backdrop-filter:blur(4px); }
        .form-input:focus { border-color:#ff85b3; box-shadow:0 0 0 3px rgba(255,133,179,0.15); }
        .attend-row { display:flex; gap:10px; width:100%; position:relative; z-index:2; }
        .attend-btn { flex:1; padding:11px; border-radius:14px; border:2px solid rgba(255,180,220,0.4); background:rgba(255,255,255,0.7); font-family:'Nunito',sans-serif; font-size:0.9rem; font-weight:700; cursor:pointer; transition:all 0.2s; color:#9090b0; }
        .attend-btn.yes.selected { background:linear-gradient(135deg,#d4f5d4,#b3f0b3); border-color:#6dce6d; color:#2d7d2d; }
        .attend-btn.no.selected  { background:linear-gradient(135deg,#ffd4d4,#ffb3b3); border-color:#e06d6d; color:#7d2d2d; }
        .submit-btn { width:100%; padding:14px; background:linear-gradient(135deg,#ff85b3,#c06bff); color:white; font-family:'Nunito',sans-serif; font-size:1rem; font-weight:800; border:none; border-radius:16px; cursor:pointer; box-shadow:0 6px 20px rgba(192,107,255,0.35); transition:transform 0.2s,box-shadow 0.2s; position:relative; z-index:2; margin-top:4px; }
        .submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 28px rgba(192,107,255,0.45); }
        .submit-btn:disabled { opacity:0.5; cursor:not-allowed; }

        .success-icon { font-size:4rem; margin-bottom:12px; position:relative; z-index:2; animation:popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275); }
        @keyframes popIn { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
        .success-title { font-family:'Dancing Script',cursive; font-size:2.8rem; background:linear-gradient(135deg,#ff5f9e,#c06bff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; position:relative; z-index:2; }
        .success-msg { color:#7070a0; font-size:0.95rem; font-weight:600; text-align:center; position:relative; z-index:2; margin-top:10px; line-height:1.6; }

        .guestlist-title { font-family:'Dancing Script',cursive; font-size:2.4rem; background:linear-gradient(135deg,#ff5f9e,#c06bff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; position:relative; z-index:2; margin-bottom:4px; }
        .stats-row { display:flex; gap:10px; width:100%; position:relative; z-index:2; margin-bottom:16px; }
        .stat-card { flex:1; background:rgba(255,255,255,0.75); border-radius:16px; padding:14px 10px; text-align:center; border:1.5px solid rgba(255,180,220,0.25); backdrop-filter:blur(6px); }
        .stat-num { font-size:1.8rem; font-weight:800; }
        .stat-num.green{color:#4caf7d} .stat-num.red{color:#e06d6d} .stat-num.purple{color:#c06bff}
        .stat-label { font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#b0b0c0; margin-top:2px; }
        .guest-item { width:100%; background:rgba(255,255,255,0.72); border-radius:16px; padding:14px 16px; display:flex; align-items:flex-start; gap:12px; border:1.5px solid rgba(255,180,220,0.2); backdrop-filter:blur(4px); position:relative; z-index:2; transition:transform 0.15s; }
        .guest-item:hover { transform:translateY(-1px); }
        .guest-avatar { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.3rem; flex-shrink:0; }
        .guest-avatar.yes{background:linear-gradient(135deg,#d4f5d4,#b3f0b3)} .guest-avatar.no{background:linear-gradient(135deg,#ffd4d4,#ffb3b3)}
        .guest-name { font-weight:800; font-size:0.95rem; color:#3d3d5c; }
        .guest-meta { font-size:0.78rem; color:#9090b0; font-weight:600; margin-top:2px; }
        .guest-note { font-size:0.8rem; color:#7070a0; font-style:italic; margin-top:4px; }
        .guest-time { font-size:0.7rem; color:#c0c0d0; margin-top:3px; }
        .remove-btn { margin-left:auto; flex-shrink:0; background:none; border:none; cursor:pointer; font-size:1.1rem; opacity:0.4; transition:opacity 0.2s; padding:2px 6px; }
        .remove-btn:hover { opacity:1; }
        .guests-scroll { width:100%; display:flex; flex-direction:column; gap:10px; max-height:400px; overflow-y:auto; position:relative; z-index:2; padding-right:2px; }
        .guests-scroll::-webkit-scrollbar{width:4px} .guests-scroll::-webkit-scrollbar-thumb{background:#ffb3d9;border-radius:2px}
        .empty-state { text-align:center; color:#b0b0c0; font-size:0.9rem; font-weight:600; padding:30px; position:relative; z-index:2; }
        .empty-state div { font-size:2.5rem; margin-bottom:8px; }
        .section-label { font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.15em; color:#c0c0d0; position:relative; z-index:2; width:100%; margin-bottom:8px; margin-top:4px; }
        .admin-section { width:100%; position:relative; z-index:2; margin-top:12px; }
        .admin-row { display:flex; gap:8px; align-items:center; }
        .admin-input { flex:1; padding:9px 14px; border:2px solid rgba(255,180,220,0.4); border-radius:12px; font-family:'Nunito',sans-serif; font-size:0.85rem; font-weight:600; color:#3d3d5c; background:rgba(255,255,255,0.8); outline:none; }
        .admin-btn { padding:9px 18px; background:linear-gradient(135deg,#ff85b3,#c06bff); color:white; border:none; border-radius:12px; font-family:'Nunito',sans-serif; font-size:0.82rem; font-weight:800; cursor:pointer; }
        .admin-error { font-size:0.75rem; color:#e06d6d; margin-top:4px; font-weight:700; }
        .error-msg { background:#fff0f0; border:1.5px solid #ffb3b3; border-radius:12px; padding:10px 14px; color:#c0504d; font-size:0.82rem; font-weight:700; position:relative; z-index:2; width:100%; text-align:center; margin-bottom:12px; }
        .refresh-btn { background:none; border:none; cursor:pointer; font-size:0.8rem; color:#ff85b3; font-weight:800; font-family:'Nunito',sans-serif; text-decoration:underline; margin-top:6px; position:relative; z-index:2; }
      `}</style>

      <div className="wrapper">
        <div className="tabs">
          <button className={`tab ${view==="invite"?"active":""}`} onClick={()=>setView("invite")}>🎂 Invitation</button>
          <button className={`tab ${view==="rsvp"?"active":""}`} onClick={()=>{setView("rsvp");setSubmitted(false);}}>💌 RSVP</button>
          <button className={`tab ${view==="guestlist"?"active":""}`} onClick={()=>setView("guestlist")}>📋 Guest List</button>
        </div>

        {/* ── INVITATION ── */}
        {view==="invite" && (
          <div className="card">
            <ConfettiDots />
            <div className="star-deco" style={{top:"14%",right:"8%",fontSize:"1.2rem"}}>⭐</div>
            <div className="star-deco" style={{top:"42%",left:"4%",fontSize:"0.9rem",animationDelay:"0.8s"}}>✨</div>
            <div className="star-deco" style={{top:"25%",left:"11%",fontSize:"0.8rem",animationDelay:"1.4s"}}>⭐</div>
            <div className="header-badge">🎉 You're Invited! 🎉</div>
            <div className="big-name">Menen</div>
            <div className="turning">is turning 3! 🎂</div>
            <div className="divider" />
            <div className="info-block">
              <div className="info-row">
                <span className="info-icon">📅</span>
                <div><span className="info-label">Date</span><span className="info-date">April 18, 2026</span></div>
              </div>
              <div className="info-row">
                <span className="info-icon">🕒</span>
                <div><span className="info-label">Time</span><span className="info-time">3:00 PM</span></div>
              </div>
              <div className="info-row">
                <span className="info-icon">🏠</span>
                <div><span className="info-label">Location</span><span className="info-address">At our home<br/>3 English Ivy Ct, Potomac, MD 20854</span></div>
              </div>
            </div>
            <div className="emoji-row">
              <span>🎈</span><span>🎁</span><span>🧁</span><span>🎀</span><span>🎊</span>
            </div>
            <button className="rsvp-cta" onClick={()=>setView("rsvp")}>💌 RSVP Now</button>
            <div className="bottom-hearts">♥ ♥ ♥</div>
          </div>
        )}

        {/* ── RSVP ── */}
        {view==="rsvp" && (
          <div className="card">
            <ConfettiDots />
            {!submitted ? (
              <>
                <div className="form-title">RSVP 💌</div>
                <div className="form-sub">Let us know if you can make it!</div>
                {error && <div className="error-msg">⚠️ {error}</div>}
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input className="form-input" placeholder="Enter your name..." value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Will you attend?</label>
                  <div className="attend-row">
                    <button className={`attend-btn yes ${form.attending==="yes"?"selected":""}`} onClick={()=>setForm({...form,attending:"yes"})}>🎉 Yes, I'll be there!</button>
                    <button className={`attend-btn no  ${form.attending==="no" ?"selected":""}`} onClick={()=>setForm({...form,attending:"no"})}>😔 Can't make it</button>
                  </div>
                </div>
                {form.attending==="yes" && (
                  <div className="form-group">
                    <label className="form-label">Number of guests (including you)</label>
                    <input className="form-input" type="number" min="1" max="10" value={form.guests} onChange={e=>setForm({...form,guests:e.target.value})} />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Message / Note (optional)</label>
                  <textarea className="form-input" placeholder="Any message for the family..." rows={3} value={form.note} style={{resize:"none"}} onChange={e=>setForm({...form,note:e.target.value})} />
                </div>
                <button className="submit-btn" disabled={!form.name.trim()||submitting} onClick={handleRSVP}>
                  {submitting ? "Sending... 🎈" : "Send RSVP 🎈"}
                </button>
              </>
            ) : (
              <>
                <div className="success-icon">{submittedAttending==="yes"?"🎊":"💝"}</div>
                <div className="success-title">{submittedAttending==="yes"?"See you there!":"We'll miss you!"}</div>
                <div className="success-msg">
                  {submittedAttending==="yes"
                    ? `Thanks, ${submittedName}! 🎉 We can't wait to celebrate with you on April 18th at 3:00 PM!`
                    : `Thanks for letting us know, ${submittedName}. We'll miss you at Menen's 3rd birthday! 💕`}
                </div>
                <button className="submit-btn" style={{marginTop:24}} onClick={()=>{setSubmitted(false);setForm({name:"",attending:"yes",guests:1,note:""});}}>
                  RSVP for someone else 💌
                </button>
              </>
            )}
            <div className="bottom-hearts">♥ ♥ ♥</div>
          </div>
        )}

        {/* ── GUEST LIST ── */}
        {view==="guestlist" && (
          <div className="card">
            <ConfettiDots />
            <div className="guestlist-title">Guest List 🎊</div>
            <div className="stats-row">
              <div className="stat-card"><div className="stat-num green">{attending.length}</div><div className="stat-label">Attending</div></div>
              <div className="stat-card"><div className="stat-num purple">{totalPeople}</div><div className="stat-label">Total People</div></div>
              <div className="stat-card"><div className="stat-num red">{notAttending.length}</div><div className="stat-label">Can't Make It</div></div>
            </div>

            {error && <div className="error-msg">⚠️ {error}</div>}

            {loading ? (
              <div className="empty-state"><div>⏳</div>Loading guests...</div>
            ) : guests.length===0 ? (
              <div className="empty-state"><div>📭</div>No RSVPs yet! Share the invitation to get started.</div>
            ) : (
              <>
                {attending.length>0 && (
                  <>
                    <div className="section-label">✅ Attending ({attending.length})</div>
                    <div className="guests-scroll" style={{maxHeight: notAttending.length>0?220:380}}>
                      {attending.map(g=>(
                        <div key={g.id} className="guest-item">
                          <div className="guest-avatar yes">🎉</div>
                          <div style={{flex:1}}>
                            <div className="guest-name">{g.name}</div>
                            <div className="guest-meta">👥 {g.guests} guest{g.guests!==1?"s":""}</div>
                            {g.note && <div className="guest-note">"{g.note}"</div>}
                            <div className="guest-time">{new Date(g.created_at).toLocaleString()}</div>
                          </div>
                          {adminMode && <button className="remove-btn" onClick={()=>removeGuest(g.id)}>✕</button>}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {notAttending.length>0 && (
                  <>
                    <div className="section-label" style={{marginTop:14}}>❌ Can't Make It ({notAttending.length})</div>
                    <div className="guests-scroll" style={{maxHeight:200}}>
                      {notAttending.map(g=>(
                        <div key={g.id} className="guest-item">
                          <div className="guest-avatar no">💝</div>
                          <div style={{flex:1}}>
                            <div className="guest-name">{g.name}</div>
                            {g.note && <div className="guest-note">"{g.note}"</div>}
                            <div className="guest-time">{new Date(g.created_at).toLocaleString()}</div>
                          </div>
                          {adminMode && <button className="remove-btn" onClick={()=>removeGuest(g.id)}>✕</button>}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            <button className="refresh-btn" onClick={fetchGuests}>↻ Refresh list</button>

            {!adminMode ? (
              <div className="admin-section">
                <div className="admin-row">
                  <input className="admin-input" type="password" placeholder="Admin code to manage list..." value={adminCode} onChange={e=>setAdminCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdminLogin()} />
                  <button className="admin-btn" onClick={handleAdminLogin}>Unlock</button>
                </div>
                {adminError && <div className="admin-error">❌ Incorrect code. Try again!</div>}
              </div>
            ) : (
              <div style={{position:"relative",zIndex:2,marginTop:10,fontSize:"0.78rem",color:"#4caf7d",fontWeight:700}}>
                🔓 Admin mode — tap ✕ on any guest to remove them
              </div>
            )}
            <div className="bottom-hearts">♥ ♥ ♥</div>
          </div>
        )}
      </div>
    </>
  );
}
