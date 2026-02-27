import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  serverTimestamp,
  doc, 
  getDoc, 
  setDoc,
  updateDoc,
  increment,
  addDoc
} from 'firebase/firestore';
import { 
  Zap, Lock, Globe, ChevronRight, Copy, Check, ExternalLink, Menu, X, 
  LayoutDashboard, LogOut, Target, Rocket, BrainCircuit, ShieldAlert, Activity, 
  Smartphone, Shield, Info, Database, RefreshCw, Users, Crown,
  UserCheck, UserMinus, Gift, Bot, Eye, EyeOff, BarChart3, ShieldCheck,
  Server, Cpu, Radio
} from 'lucide-react';

// --- CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyBI-JSC-FtVOz_r6p-XjN6fUrapMn_ad24",
  authDomain: "smartsmspro-4ee81.firebaseapp.com",
  projectId: "smartsmspro-4ee81",
  storageBucket: "smartsmspro-4ee81.firebasestorage.app",
  messagingSenderId: "269226709034",
  appId: "1:269226709034:web:00af3a340b1e1ba928f353",
  measurementId: "G-RRW67CXZJC"
};

const appId = 'smartsms-pro-production-final';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- MASTER IDENTITY (OWNER) ---
// PASTE YOUR UID HERE TO UNLOCK THE ELITE COMMAND CENTER
const ADMIN_MASTER_ID = "W41IbExRiYb7HJ0Dx3up3JEUAqf2"; 

const STRIPE_NEXUS_LINK = "https://buy.stripe.com/nexus_access"; 
const STRIPE_EXPERT_LINK = "https://buy.stripe.com/expert_agent";

export default function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]); 
  const [myLeads, setMyLeads] = useState([]); 
  const [isVaultActive, setIsVaultActive] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [captureData, setCaptureData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [showSmartSupport, setShowSmartSupport] = useState(false);
  
  // Registration States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Generator States
  const [genTo, setGenTo] = useState('');
  const [genMsg, setGenMsg] = useState('');
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'data');
        const d = await getDoc(docRef);
        if (d.exists()) setUserProfile(d.data());
      }
    });

    const params = new URLSearchParams(window.location.search);
    const t = params.get('t') || params.get('to');
    const m = params.get('m') || params.get('msg');
    const o = params.get('o') || params.get('ownerId');

    if (t && m && o) {
      setCaptureData({ to: t, msg: m, ownerId: o, company: params.get('c') || 'Verified Host' });
      handleProtocolHandshake(t, m, o);
    }
    return () => unsubscribe();
  }, []);

  // MASTER DATA SYNC
  useEffect(() => {
    if (!user || user.uid !== ADMIN_MASTER_ID || view !== 'dashboard') return;
    const usersCol = collection(db, 'artifacts', appId, 'public', 'data', 'user_profiles');
    return onSnapshot(usersCol, (snap) => {
      setAllUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, [user, view]);

  // OPERATOR DATA SYNC
  useEffect(() => {
    if (!user || (!userProfile?.isSubscribed && !userProfile?.isUnlimited) || view !== 'dashboard' || !isVaultActive) return;
    const leadsCol = collection(db, 'artifacts', appId, 'users', user.uid, 'leads');
    return onSnapshot(leadsCol, (snap) => {
      setMyLeads(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, [user, userProfile, view, isVaultActive]);

  const handleProtocolHandshake = async (to, msg, ownerId) => {
    setView('bridge');
    setTimeout(async () => {
      const ownerRef = doc(db, 'artifacts', appId, 'users', ownerId, 'profile', 'data');
      const d = await getDoc(ownerRef);
      const ownerProfile = d.data();

      if (!ownerProfile?.isSubscribed && !ownerProfile?.isUnlimited && (ownerProfile?.usageCount || 0) >= 60) {
        setQuotaExceeded(true);
        return;
      }

      await updateDoc(ownerRef, { usageCount: increment(1) });
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', ownerId), { usageCount: increment(1) });

      if (ownerProfile.isSubscribed || ownerProfile.isUnlimited) {
        try {
          const geoReq = await fetch('https://ipapi.co/json/');
          const geo = geoReq.ok ? await geoReq.json() : { city: 'Unknown', ip: '0.0.0.0' };
          await addDoc(collection(db, 'artifacts', appId, 'users', ownerId, 'leads'), {
            timestamp: serverTimestamp(),
            destination: to,
            location: `${geo.city}, ${geo.country_name || 'Global'}`,
            ip: geo.ip,
            device: navigator.userAgent
          });
        } catch (e) {}
      }

      const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
      window.location.href = `sms:${to}${sep}body=${encodeURIComponent(msg)}`;
    }, 3000);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        const u = await createUserWithEmailAndPassword(auth, email, password);
        const newProfile = { fullName, phone, email, tier: 'FREE_TRIAL', usageCount: 0, isSubscribed: false, isUnlimited: false, created_at: serverTimestamp() };
        await setDoc(doc(db, 'artifacts', appId, 'users', u.user.uid, 'profile', 'data'), newProfile);
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', u.user.uid), newProfile);
      }
      setView('home');
    } catch (e) { alert("Identity Protocol Error: " + e.message); }
    setLoading(false);
  };

  const toggleUnlimited = async (targetUserId, currentStatus) => {
    if (user.uid !== ADMIN_MASTER_ID) return;
    const newStatus = !currentStatus;
    await updateDoc(doc(db, 'artifacts', appId, 'users', targetUserId, 'profile', 'data'), { isUnlimited: newStatus });
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', targetUserId), { isUnlimited: newStatus });
  };

  const handleGenerate = () => {
    if (!user) { setView('auth'); return; }
    if (!genTo) return;
    const baseUrl = window.location.origin;
    setGeneratedLink(`${baseUrl}?t=${encodeURIComponent(genTo)}&m=${encodeURIComponent(genMsg)}&o=${user.uid}&c=${encodeURIComponent(companyName || 'Verified Partner')}`);
  };

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans antialiased flex flex-col relative overflow-x-hidden">
      <style>{`
        @keyframes rotate-beam { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        .lighthouse-neon-wrapper { position: relative; padding: 1.5px; border-radius: 28px; overflow: hidden; background: transparent; display: flex; align-items: center; justify-content: center; }
        .lighthouse-neon-wrapper::before { content: ""; position: absolute; width: 600%; height: 600%; top: 50%; left: 50%; background: conic-gradient(transparent 0%, transparent 45%, #25F4EE 48%, #FE2C55 50%, #25F4EE 52%, transparent 55%, transparent 100%); animation: rotate-beam 5s linear infinite; z-index: 0; }
        .lighthouse-neon-content { position: relative; z-index: 1; background: #0a0a0a; border-radius: 27px; width: 100%; height: 100%; }
        .btn-strategic { background: #FFFFFF; color: #000000; box-shadow: 0 0 25px rgba(255,255,255,0.3); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-radius: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; width: 100%; padding: 1.15rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; border: none; cursor: pointer; }
        .btn-strategic:hover { background: #25F4EE; transform: translateY(-2px); box-shadow: 0 0 40px rgba(37,244,238,0.4); }
        .input-premium { background: #111; border: 1px solid rgba(255,255,255,0.05); color: white; width: 100%; padding: 1rem 1.25rem; border-radius: 12px; outline: none; transition: all 0.3s; font-weight: 700; }
        .input-premium:focus { border-color: #25F4EE; background: #000; }
        .text-glow-white { text-shadow: 0 0 15px rgba(255,255,255,0.5); }
        .text-neon-cyan { color: #25F4EE; text-shadow: 0 0 10px rgba(37,244,238,0.3); }
        * { hyphens: none !important; word-break: normal !important; text-decoration: none; }
      `}</style>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 h-14 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[100] px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-white/10 p-1 rounded-lg border border-white/10 shadow-lg shadow-white/5"><Zap size={18} className="text-white fill-white" /></div>
          <span className="text-md font-black italic tracking-tighter uppercase text-white">SMART SMS PRO</span>
          {user?.uid === ADMIN_MASTER_ID && <span className="bg-[#FE2C55] text-white text-[8px] px-2 py-0.5 rounded-full font-black ml-2 animate-pulse tracking-widest uppercase italic">MASTER</span>}
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 text-white/50 hover:text-white transition-all z-[110]">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Side Menu */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[140]" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-72 bg-[#050505] border-l border-white/10 h-screen z-[150] p-10 flex flex-col shadow-2xl animate-in slide-in-from-right text-left">
            <div className="flex justify-between items-center mb-12">
              <span className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Command Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-white/40"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-8 flex-1">
              {!user ? (
                <button onClick={() => {setView('auth'); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-[#25F4EE] hover:text-white transition-colors">
                   <Lock size={18} /> REGISTER IDENTITY
                </button>
              ) : (
                <>
                  <div className="mb-6 p-5 bg-white/5 rounded-3xl border border-white/10">
                     <p className="text-[9px] font-black text-white/30 uppercase mb-1 italic">Identity Active</p>
                     <p className="text-xs font-black text-[#25F4EE] truncate uppercase italic">{userProfile?.fullName || 'Operator'}</p>
                  </div>
                  <button onClick={() => {setView('dashboard'); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors">
                     <LayoutDashboard size={18} /> {user.uid === ADMIN_MASTER_ID ? "MASTER CONTROL" : "OPERATOR HUB"}
                  </button>
                  <button onClick={() => {setShowSmartSupport(true); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors">
                     <Bot size={18} /> SMART SUPPORT
                  </button>
                  <button onClick={() => {signOut(auth).then(()=>setView('home')); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-[#FE2C55] hover:opacity-70 transition-all mt-auto mb-10">
                     <LogOut size={18} /> TERMINATE SESSION
                  </button>
                </>
              )}
              <div className="h-px bg-white/5 w-full my-4" />
              <div className="flex flex-col gap-6 text-[10px] font-black text-white/30 uppercase italic tracking-[0.2em]">
                <a href="#" className="hover:text-white transition-colors uppercase italic font-black">Privacy Protocol</a>
                <a href="#" className="hover:text-white transition-colors uppercase italic font-black">Security Terms</a>
                <button onClick={() => {setShowSmartSupport(true); setIsMenuOpen(false)}} className="text-left hover:text-white transition-colors flex items-center gap-2 uppercase font-black italic text-[10px]">SMART SUPPORT <Bot size={12}/></button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main UI */}
      <div className="pt-24 flex-1 pb-10 relative">
        <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#FE2C55] opacity-[0.03] blur-[150px] pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#25F4EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

        {view === 'home' && (
          <div className="w-full max-w-[520px] mx-auto px-4 z-10 relative text-center">
            <header className="mb-12 flex flex-col items-center">
              <div className="lighthouse-neon-wrapper mb-4"><div className="lighthouse-neon-content px-8 py-3"><h1 className="text-2xl font-black italic uppercase text-white text-glow-white">SMART SMS PRO</h1></div></div>
              <p className="text-[10px] text-white/40 font-bold tracking-[0.4em] uppercase leading-relaxed">High-End Redirection Protocol - 60 Free Handshakes</p>
            </header>

            <main className="space-y-6 pb-20 text-left">
              <div className="lighthouse-neon-wrapper shadow-3xl">
                <div className="lighthouse-neon-content p-7 sm:p-10">
                  <div className="flex items-center gap-2 mb-8"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div><h3 className="text-[11px] font-black uppercase italic tracking-widest text-white/60">Protocol Configuration</h3></div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase italic tracking-widest text-white/40 ml-1 italic">Mobile Number (+1...)</label>
                       <input type="tel" value={genTo} onChange={e => setGenTo(e.target.value)} className="input-premium font-bold text-sm" placeholder="+1 999 999 9999" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase italic tracking-widest text-white/40 ml-1 italic">Name or Company</label>
                       <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-premium font-bold text-sm text-white/50" placeholder="e.g. Apple Support" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase italic tracking-widest text-white/40 ml-1 italic">Pre-written message</label>
                       <textarea value={genMsg} onChange={e => setGenMsg(e.target.value)} rows="2" className="input-premium text-xs font-medium resize-none" placeholder="Enter SMS payload here..." />
                    </div>
                    <button onClick={handleGenerate} className="btn-strategic text-[11px] mt-2 italic font-black uppercase">Generate Smart Link <ChevronRight size={16} /></button>
                  </div>
                </div>
              </div>

              {generatedLink && (
                <div className="bg-[#0a0a0a] border border-[#25F4EE]/20 rounded-[40px] p-8 text-center animate-in zoom-in-95 shadow-2xl">
                  <div className="bg-white p-5 rounded-3xl inline-block mb-8 shadow-xl"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(generatedLink)}&color=000000`} alt="QR" className="w-32 h-32"/></div>
                  <input readOnly value={generatedLink} onClick={(e) => e.target.select()} className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-[10px] text-[#25F4EE] font-mono text-center outline-none mb-6 border-dashed" />
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <button onClick={() => {navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="flex flex-col items-center py-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-center">{copied ? <Check size={20} className="text-[#25F4EE]" /> : <Copy size={20} className="text-white/40" />}<span className="text-[9px] font-black uppercase italic mt-2 text-white/50 tracking-widest">Quick Copy</span></button>
                    <button onClick={() => window.open(generatedLink, '_blank')} className="flex flex-col items-center py-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-center"><ExternalLink size={20} className="text-white/40" /><span className="text-[9px] font-black uppercase italic mt-1 text-white/50 tracking-widest">Live Test</span></button>
                  </div>
                </div>
              )}

              {!user && (
                <button onClick={() => setView('auth')} className="btn-strategic text-[11px] max-w-[340px] !bg-white !text-black group mx-auto mt-10 italic font-black uppercase shadow-xl">
                  <Rocket size={16} className="group-hover:animate-bounce" /> INITIALIZE 60 FREE HANDSHAKES
                </button>
              )}
            </main>
          </div>
        )}

        {view === 'bridge' && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center px-8">
            <div className="lighthouse-neon-wrapper w-full max-w-lg shadow-3xl">
              <div className="lighthouse-neon-content p-16 flex flex-col items-center">
                {quotaExceeded ? (
                  <div className="animate-in fade-in zoom-in-95 duration-500">
                    <ShieldAlert size={80} className="text-[#FE2C55] animate-pulse mb-8 mx-auto" />
                    <h2 className="text-3xl font-black italic uppercase text-white mb-4 leading-tight text-glow-white uppercase">Protocol Limit Reached</h2>
                    <div className="p-10 bg-white/[0.03] border border-white/5 rounded-[2.5rem] mb-12 text-left relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Crown size={40} className="text-amber-500" /></div>
                       <h3 className="text-2xl font-black italic text-white uppercase mb-4">Nexus Access Offer</h3>
                       <p className="text-[11px] text-white/40 uppercase italic font-black leading-relaxed tracking-widest mb-10">Don't lose your traffic flow. Unlock <span className="text-white border-b border-white/20">Unlimited Redirections</span> and automatic lead logging now.</p>
                       <button onClick={() => window.open(STRIPE_NEXUS_LINK, '_blank')} className="btn-strategic !bg-white !text-black w-full text-[10px] italic font-black uppercase">Upgrade Identity ($9/MO)</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Shield size={100} className="text-[#25F4EE] animate-pulse drop-shadow-[0_0_30px_#25F4EE] mb-12" />
                    <h2 className="text-3xl font-black italic uppercase text-white text-center text-glow-white tracking-widest">SECURITY HANDSHAKE</h2>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden my-10 max-w-xs"><div className="h-full bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] w-full origin-left animate-[progress_3s_linear]"></div></div>
                    <p className="text-[10px] text-white/50 uppercase italic font-black tracking-widest leading-relaxed text-center">Verified Host Identity: {captureData?.company}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="w-full max-w-7xl mx-auto py-10 px-6 text-left">
            {/* ELITE MASTER HEADER */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-10 mb-16">
              <div>
                <h2 className="text-6xl font-black italic tracking-tighter uppercase drop-shadow-[0_0_20px_#fff]">
                  {user?.uid === ADMIN_MASTER_ID ? "COMMAND CENTER" : "OPERATOR HUB"}
                </h2>
                <div className="flex items-center gap-4 mt-4">
                  <span className="bg-[#25F4EE]/10 text-[#25F4EE] text-[10px] px-4 py-1.5 rounded-full font-black uppercase italic tracking-[0.2em] border border-[#25F4EE]/20">
                    {user?.uid === ADMIN_MASTER_ID ? "MASTER OVERRIDE" : `${userProfile?.tier || 'TRIAL'} IDENTITY`}
                  </span>
                  {(userProfile?.isSubscribed || userProfile?.isUnlimited) && (
                    <span className="bg-amber-500/10 text-amber-500 text-[10px] px-4 py-1.5 rounded-full font-black uppercase italic tracking-[0.2em] border border-amber-500/20">
                      LEAD LOGGING: ACTIVE
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-[#0a0a0a] border border-white/10 px-10 py-7 rounded-[2.5rem] text-center shadow-3xl border-b-2 border-b-[#25F4EE] w-fit">
                  <p className="text-[10px] font-black text-white/30 uppercase italic tracking-widest mb-1 flex items-center gap-1"><RefreshCw size={10}/> Protocol Usage</p>
                  <p className="text-4xl font-black text-white italic">{userProfile?.isUnlimited ? '∞' : userProfile?.usageCount || 0} <span className="text-xs text-white/30 tracking-normal">/ {userProfile?.isUnlimited ? 'UNLIMITED' : '60'}</span></p>
              </div>
            </div>

            {/* MASTER CONTROL CENTER (STATS + LIST) */}
            {user?.uid === ADMIN_MASTER_ID && (
               <div className="animate-in fade-in duration-700">
                  {/* MASTER STATS CARDS */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                     <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <Users size={40} className="text-[#25F4EE] opacity-20 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Total Members</p>
                        <p className="text-4xl font-black italic">{allUsers.length}</p>
                     </div>
                     <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <Crown size={40} className="text-amber-500 opacity-20 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Nexus Active</p>
                        <p className="text-4xl font-black italic text-amber-500">{allUsers.filter(u => u.isSubscribed).length}</p>
                     </div>
                     <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <Server size={40} className="text-[#FE2C55] opacity-20 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Global Traffic</p>
                        <p className="text-4xl font-black italic text-[#FE2C55]">{allUsers.reduce((sum, u) => sum + (u.usageCount || 0), 0)}</p>
                     </div>
                     <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <Radio size={40} className="text-green-500 opacity-20 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Relay Status</p>
                        <p className="text-2xl font-black italic text-green-500 uppercase">Secured</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 mb-10 text-neon-cyan"><Users size={24}/><h3 className="text-2xl font-black uppercase italic text-white tracking-widest">Operator Management</h3></div>
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-3xl">
                     <div className="max-h-[60vh] overflow-y-auto">
                        {allUsers.length > 0 ? allUsers.map(u => (
                           <div key={u.id} className="p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-center hover:bg-white/[0.04] transition-all gap-6">
                              <div className="flex items-center gap-6">
                                 <div className={`p-4 rounded-3xl ${u.isSubscribed ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-white/5 text-white/20'}`}>
                                    {u.isSubscribed ? <UserCheck size={28} /> : <UserMinus size={28} />}
                                 </div>
                                 <div className="text-left">
                                    <p className="font-black text-2xl text-white uppercase italic tracking-tighter">{u.fullName}</p>
                                    <div className="flex items-center gap-4 text-[12px] font-black uppercase italic tracking-widest mt-1">
                                       <span className="text-[#25F4EE]">{u.email}</span>
                                       <span className="text-white/20">|</span>
                                       <span className="text-white/40">{u.phone}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-6">
                                 <button onClick={() => toggleUnlimited(u.id, u.isUnlimited)} className={`flex items-center gap-2 px-6 py-2.5 rounded-full border text-[10px] font-black uppercase italic transition-all ${u.isUnlimited ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}>
                                    <Gift size={14} /> {u.isUnlimited ? 'VIP GRANTED' : 'GRANT VIP'}
                                 </button>
                                 <div className="text-right w-24">
                                    <p className={`text-[10px] font-black uppercase italic ${u.isSubscribed ? 'text-amber-500' : 'text-white/30'}`}>{u.isSubscribed ? 'Nexus' : 'Trial'}</p>
                                    <p className="text-[9px] text-white/20 font-black uppercase">Usage: {u.usageCount}</p>
                                 </div>
                              </div>
                           </div>
                        )) : <div className="p-20 text-center opacity-20 uppercase font-black italic tracking-widest text-xs">Awaiting operators for decryption...</div>}
                     </div>
                  </div>
               </div>
            )}

            {/* OPERATOR DATA VAULT */}
            {(userProfile?.isSubscribed || userProfile?.isUnlimited) && user?.uid !== ADMIN_MASTER_ID && (
                <div className="animate-in fade-in duration-700">
                  <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
                     <div className="flex items-center gap-3 text-neon-cyan"><Database size={24}/><h3 className="text-2xl font-black uppercase italic text-white tracking-widest">Private Lead Vault</h3></div>
                     <button onClick={() => setIsVaultActive(!isVaultActive)} className={`px-8 py-3 rounded-full border text-[10px] font-black uppercase italic transition-all ${isVaultActive ? 'bg-[#FE2C55]/10 border-[#FE2C55]/30 text-[#FE2C55]' : 'bg-[#25F4EE]/10 border-[#25F4EE]/30 text-[#25F4EE]'}`}>
                        {isVaultActive ? "DISCONNECT VAULT" : "SYNC LEAD VAULT"}
                     </button>
                  </div>
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-3xl">
                     {!isVaultActive ? (
                        <div className="p-32 text-center opacity-20 flex flex-col items-center"><Lock size={64} className="mb-6" /><p className="text-[12px] font-black uppercase italic tracking-[0.4em]">Vault in Standby Mode</p></div>
                     ) : (
                        <div className="max-h-[60vh] overflow-y-auto">
                           {myLeads.length > 0 ? myLeads.map(l => (
                              <div key={l.id} className="p-10 border-b border-white/5 flex justify-between items-center hover:bg-white/[0.04] transition-all group">
                                 <div className="text-left">
                                    <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">{new Date(l.timestamp?.seconds * 1000).toLocaleString()}</p>
                                    <p className="font-black text-2xl text-white uppercase italic tracking-tighter group-hover:text-[#25F4EE] transition-colors">{l.location}</p>
                                    <p className="text-[14px] text-white/40 font-black uppercase italic tracking-widest mt-1 text-neon-cyan uppercase italic">DEST: {l.destination}</p>
                                 </div>
                                 <div className="text-right text-[11px] text-white/60 font-mono tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5">{l.ip}</div>
                              </div>
                           )) : <div className="p-20 text-center opacity-20 uppercase font-black italic tracking-widest text-xs">Waiting for incoming protocol signals...</div>}
                        </div>
                     )}
                  </div>
                </div>
            )}
            
            {/* TIERS UPSELL */}
            {(!userProfile?.isSubscribed && !userProfile?.isUnlimited && user?.uid !== ADMIN_MASTER_ID) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                 <div className="bg-white/5 border border-[#25F4EE]/30 p-10 rounded-[3rem] text-left relative overflow-hidden group">
                    <h3 className="text-3xl font-black italic text-white uppercase mb-2">Nexus Access</h3>
                    <p className="text-white/40 text-[10px] uppercase italic font-black mb-8 tracking-widest italic leading-relaxed">Unlimited redirections + Automatic Lead Logging.</p>
                    <p className="text-4xl font-black text-white italic mb-10">$9.00<span className="text-xs text-white/30 font-medium tracking-normal"> / mo</span></p>
                    <button onClick={() => window.open(STRIPE_NEXUS_LINK, '_blank')} className="btn-strategic text-[10px] italic uppercase font-black">UPGRADE TO NEXUS</button>
                 </div>
                 <div className="bg-[#25F4EE]/10 border border-[#25F4EE] p-10 rounded-[3rem] text-left relative overflow-hidden group shadow-[0_0_50px_rgba(37,244,238,0.2)]">
                    <h3 className="text-3xl font-black italic text-white uppercase mb-2">Expert Agent</h3>
                    <p className="text-white/40 text-[10px] uppercase italic font-black mb-8 tracking-widest italic leading-relaxed">AI SuperAgent + Multi-SIM + Bulk Ingestion.</p>
                    <p className="text-4xl font-black text-white italic mb-10">$19.90<span className="text-xs text-white/30 font-medium tracking-normal"> / mo</span></p>
                    <button onClick={() => window.open(STRIPE_EXPERT_LINK, '_blank')} className="btn-strategic !bg-[#25F4EE] text-[10px] italic uppercase font-black">ACTIVATE EXPERT AI</button>
                 </div>
              </div>
            )}
          </div>
        )}

        {view === 'auth' && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-left">
            <div className="lighthouse-neon-wrapper w-full max-w-md shadow-3xl">
              <div className="lighthouse-neon-content p-10 sm:p-14 relative">
                <h2 className="text-3xl font-black italic mt-8 mb-12 uppercase text-white text-center tracking-tighter text-glow-white uppercase">
                  {isLoginMode ? "Operator Login" : "Protocol Identity"}
                </h2>
                <form onSubmit={handleAuthSubmit} className="space-y-5">
                  {!isLoginMode && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase italic text-white/40 ml-1 italic">Full Operator Name</label>
                        <input required placeholder="Name or Company Identity" value={fullName} onChange={e=>setFullName(e.target.value)} className="input-premium text-xs italic" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase italic text-white/40 ml-1 italic">Valid Mobile (+1...)</label>
                        <input required placeholder="+1 999 999 9999" value={phone} onChange={e=>setPhone(e.target.value)} className="input-premium text-xs italic" />
                      </div>
                    </>
                  )}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase italic text-white/40 ml-1 italic">Email Identity</label>
                    <input required type="email" placeholder="email@example.com" value={email} onChange={e=>setEmail(e.target.value)} className="input-premium text-xs italic" />
                  </div>
                  <div className="space-y-1 relative">
                    <label className="text-[9px] font-black uppercase italic text-white/40 ml-1 italic">{isLoginMode ? 'Security Password' : 'Create Password'}</label>
                    <input required type={showPass ? "text" : "password"} placeholder="Alpha-numeric security key" value={password} onChange={e=>setPassword(e.target.value)} className="input-premium text-xs italic" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-9 text-white/30 hover:text-[#25F4EE]">{showPass ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
                  </div>
                  {!isLoginMode && (
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase italic text-white/40 ml-1 italic">Confirm Password</label>
                      <input required type={showPass ? "text" : "password"} placeholder="Repeat your security key" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="input-premium text-xs italic" />
                    </div>
                  )}
                  
                  <button type="submit" disabled={loading} className="btn-strategic text-[11px] w-full shadow-xl italic uppercase font-black mt-6">
                    {loading ? "AUTHENTICATING..." : isLoginMode ? "Authorize Access" : "Establish Identity"}
                  </button>
                  
                  <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); setShowPass(false); }} className="w-full text-[10px] font-black text-white/20 uppercase italic mt-12 text-center hover:text-white transition-all uppercase italic">
                    {isLoginMode ? "ESTABLISH NEW IDENTITY? REGISTER" : "ALREADY A MEMBER? LOGIN HERE"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Smart Support Modal */}
      {showSmartSupport && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md text-left">
           <div className="lighthouse-neon-wrapper w-full max-w-sm shadow-3xl">
              <div className="lighthouse-neon-content p-8">
                 <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2 text-neon-cyan"><Bot size={24} /><span className="text-xs font-black uppercase italic tracking-widest text-glow-white">SMART SUPPORT</span></div>
                    <button onClick={() => setShowSmartSupport(false)} className="text-white/40 hover:text-white"><X size={20}/></button>
                 </div>
                 <div className="bg-black border border-white/5 p-5 rounded-2xl mb-6 min-h-[150px] flex items-center justify-center text-center">
                    <p className="text-[10px] text-white/50 uppercase italic font-black tracking-widest leading-relaxed">The AI Agent is analyzing your request... System ready for support handshakes.</p>
                 </div>
                 <input className="input-premium text-xs mb-4 italic" placeholder="Enter support inquiry..." />
                 <button className="btn-strategic text-[10px] italic uppercase font-black">Establish Connection</button>
              </div>
           </div>
        </div>
      )}

      {/* STRATEGIC FOOTER */}
      <footer className="mt-auto pb-16 w-full text-center space-y-12 z-10 px-10 border-t border-white/5 pt-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 text-[10px] font-black uppercase italic tracking-widest text-white/30 text-left">
          <div className="flex flex-col gap-4">
             <span className="text-white/40 mb-1 border-b border-white/5 pb-1 italic">Legal</span>
             <a href="#" className="hover:text-[#25F4EE] transition-colors uppercase">Privacy</a>
             <a href="#" className="hover:text-[#25F4EE] transition-colors uppercase">Terms</a>
          </div>
          <div className="flex flex-col gap-4">
             <span className="text-white/40 mb-1 border-b border-white/5 pb-1 italic">Standards</span>
             <a href="#" className="hover:text-[#FE2C55] transition-colors uppercase">CCPA</a>
             <a href="#" className="hover:text-[#FE2C55] transition-colors uppercase">GDPR</a>
          </div>
          <div className="flex flex-col gap-4">
             <span className="text-white/40 mb-1 border-b border-white/5 pb-1 italic">Global</span>
             <a href="#" className="hover:text-[#25F4EE] transition-colors uppercase">USA</a>
             <a href="#" className="hover:text-[#25F4EE] transition-colors uppercase">EUROPE</a>
          </div>
          <div className="flex flex-col gap-4">
             <span className="text-white/40 mb-1 border-b border-white/5 pb-1 italic">Support</span>
             <button onClick={() => setShowSmartSupport(true)} className="hover:text-[#25F4EE] transition-colors flex items-center gap-1 text-left uppercase font-black italic text-[10px]">SMART SUPPORT <Bot size={12}/></button>
             <a href="#" className="hover:text-[#FE2C55] transition-colors uppercase">Terminal</a>
             <a href="#" className="hover:text-[#FE2C55] transition-colors uppercase">Abuse</a>
          </div>
        </div>
        <p className="text-[11px] text-white/20 font-black tracking-[5px] uppercase italic drop-shadow-2xl text-center">© 2026 ClickMoreDigital | High-End Security Protocol</p>
      </footer>
    </div>
  );
}
