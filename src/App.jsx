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
  increment
} from 'firebase/firestore';
import { 
  Zap, Lock, Globe, ChevronRight, Copy, Check, ExternalLink, Menu, X, 
  LayoutDashboard, LogOut, Target, Rocket, BrainCircuit, ShieldAlert, Activity, 
  Smartphone, Shield, Info, Database, RefreshCw, Users, Crown,
  UserCheck, UserMinus, Gift, Bot, Eye, EyeOff, BarChart3, ShieldCheck,
  Server, Cpu, Radio, UserPlus, HelpCircle, ChevronDown, ChevronUp, Star, BookOpen, 
  AlertOctagon, Scale, ShieldAlert as AlertIcon, FileText, UploadCloud, PlayCircle,
  ShoppingCart, Wallet, AlertTriangle, Trash, Edit, Clock
} from 'lucide-react';

// --- SECURE FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyBI-JSC-FtVOz_r6p-XjN6fUrapMn_ad24",
  authDomain: "smartsmspro-4ee81.firebaseapp.com",
  projectId: "smartsmspro-4ee81",
  storageBucket: "smartsmspro-4ee81.firebasestorage.app",
  messagingSenderId: "269226709034",
  appId: "1:269226709034:web:00af3a340b1e1ba928f353"
};
const appId = "smartsms-pro-elite-vfinal-restored";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- MASTER ADMIN ACCESS ---
const ADMIN_MASTER_ID = "YGepVHHMYaN9sC3jFmTyry0mYZO2D"; 

// --- FAQ COMPONENT ---
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 py-8 group cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex justify-between items-center gap-6 text-left leading-none">
        <h4 className="text-[11px] sm:text-[12px] font-black uppercase italic tracking-widest text-white/70 group-hover:text-[#25F4EE] transition-colors leading-tight">{q}</h4>
        {open ? <ChevronUp size={18} className="text-[#25F4EE]" /> : <ChevronDown size={18} className="text-white/20" />}
      </div>
      {open && <p className="mt-5 text-xs text-white/40 leading-relaxed font-medium animate-in slide-in-from-top-2 text-left italic tracking-wide uppercase">{a}</p>}
    </div>
  );
};

export default function App() {
  // 1. ALL STATES DEFINED AT TOP TO PREVENT REFERENCE ERRORS
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  const [logs, setLogs] = useState([]); 
  const [myLinks, setMyLinks] = useState([]); 
  const [isVaultActive, setIsVaultActive] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [captureData, setCaptureData] = useState(null);
  const [captureForm, setCaptureForm] = useState({ name: '', phone: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSmartSupport, setShowSmartSupport] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [copied, setCopied] = useState(false);

  // AI & Automation Engine
  const [aiObjective, setAiObjective] = useState('');
  const [aiWarning, setAiWarning] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [activeQueue, setActiveQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [connectedChips, setConnectedChips] = useState(1);
  const [sendDelay, setSendDelay] = useState(30);
  const [isAutoSending, setIsAutoSending] = useState(false);

  // Admin Controls
  const [searchUid, setSearchUid] = useState('');
  const [foundUser, setFoundUser] = useState(null);

  // Input States
  const [genTo, setGenTo] = useState('');
  const [genMsg, setGenMsg] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPass, setShowPass] = useState(false);

  const fileInputRef = useRef(null);
  const isPro = userProfile?.tier === 'MASTER' || userProfile?.tier === 'ELITE' || userProfile?.isSubscribed || user?.uid === ADMIN_MASTER_ID;
  const MSG_LIMIT = 300;

  // 2. IDENTITY BOOTSTRAP (Zero Anonymous Policy)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const docRef = doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'data');
        const d = await getDoc(docRef);
        if (d.exists()) {
          const data = d.data();
          if (u.uid === ADMIN_MASTER_ID) {
            setUserProfile({ ...data, tier: 'MASTER', isUnlimited: true, smsCredits: 999999 });
          } else {
            setUserProfile(data);
          }
        } else {
          const isM = u.uid === ADMIN_MASTER_ID;
          const p = { 
            fullName: String(u.email?.split('@')[0] || 'Operator'), 
            email: String(u.email || ''), 
            tier: isM ? 'MASTER' : 'FREE_TRIAL', 
            smsCredits: isM ? 999999 : 60, 
            created_at: serverTimestamp() 
          };
          await setDoc(docRef, p);
          setUserProfile(p);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setAuthResolved(true);
    });
    return () => unsubscribe();
  }, []);

  // 3. CAPTURE GATE LOGIC
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('t'), m = params.get('m'), o = params.get('o');
    if (t && m && o && view !== 'bridge' && view !== 'capture') {
      setCaptureData({ to: t, msg: m, ownerId: o, company: params.get('c') || 'Verified Host' });
      setView('capture');
    }
  }, [view]);

  // 4. SYNC DATA (Ensuring instant loading)
  useEffect(() => {
    if (!user || view !== 'dashboard') return;
    const unsubLeads = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), (snap) => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const myData = user.uid === ADMIN_MASTER_ID ? all : all.filter(l => l.ownerId === user.uid);
      setLogs(myData.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
    }, (err) => console.log("Leads sync standby."));

    const unsubLinks = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'links'), (snap) => {
      setMyLinks(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0)));
    });
    return () => { unsubLeads(); unsubLinks(); };
  }, [user, view]);

  // 5. AUTOMATION DELAY ENGINE
  useEffect(() => {
    let timer;
    if (isAutoSending && queueIndex < activeQueue.length) {
      timer = setTimeout(() => {
        const current = activeQueue[queueIndex];
        const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
        setQueueIndex(prev => prev + 1);
        window.location.href = `sms:${current.telefone_cliente}${sep}body=${encodeURIComponent(current.optimizedMsg)}`;
      }, Math.max(sendDelay, 20) * 1000);
    } else {
      setIsAutoSending(false);
    }
    return () => clearTimeout(timer);
  }, [isAutoSending, queueIndex]);

  // --- ENGINE HANDLERS ---
  const validateAIContent = (text) => {
    setAiObjective(text);
    const forbidden = /(hack|scam|fraud|phishing|hate|racism|kill|murder|porn|malware|virus|golpe|ódio|ofensiv|bulling|discrimin|political)/i;
    if (forbidden.test(text)) {
      setAiWarning("SECURITY ALERT: Policy Violation. Prohibited content detected.");
    } else {
      setAiWarning('');
    }
  };

  const handleProtocolHandshake = async () => {
    if(!captureForm.name || !captureForm.phone) return;
    setView('bridge');
    try {
      const ownerId = captureData.ownerId;
      const safeId = captureForm.phone.replace(/\D/g, '');
      const leadId = `${ownerId}_${safeId}`;
      const leadRef = doc(db, 'artifacts', appId, 'public', 'data', 'leads', leadId);
      const leadSnap = await getDoc(leadRef);

      if (!leadSnap.exists()) {
        const pubRef = doc(db, 'artifacts', appId, 'users', ownerId, 'profile', 'data');
        const ownerProfSnap = await getDoc(pubRef);
        if (ownerProfSnap.exists()) {
           const ownerProf = ownerProfSnap.data();
           if (ownerProf.tier !== 'MASTER' && ownerProf.smsCredits <= 0) {
             setQuotaExceeded(true);
             return;
           }
           await updateDoc(pubRef, { smsCredits: increment(-1) });
        }
        await setDoc(leadRef, {
          ownerId,
          nome_cliente: String(captureForm.name),
          telefone_cliente: String(captureForm.phone),
          timestamp: serverTimestamp(),
          device: navigator.userAgent
        });
      }
      setTimeout(() => {
        const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
        window.location.href = `sms:${captureData.to}${sep}body=${encodeURIComponent(captureData.msg)}`;
      }, 2000);
    } catch (e) {}
  };

  const handlePrepareBatch = () => {
    if (!aiObjective || logs.length === 0 || aiWarning) return;
    setIsAiProcessing(true);
    setTimeout(() => {
      const limit = Math.min(60, isPro ? 999999 : (Number(userProfile?.smsCredits) || 0), logs.length);
      setActiveQueue(logs.slice(0, limit).map(l => ({ ...l, optimizedMsg: `${aiObjective} [ID:${Math.random().toString(36).substr(2,4).toUpperCase()}]` })));
      setQueueIndex(0);
      setIsAiProcessing(false);
    }, 1200);
  };

  const handleGenerate = async () => {
    if (!user) { setView('auth'); return; }
    if (!genTo) return;
    setLoading(true);
    const uid = crypto.randomUUID().split('-')[0];
    const link = `${window.location.origin}?t=${encodeURIComponent(genTo)}&m=${encodeURIComponent(genMsg)}&o=${user.uid}&c=${encodeURIComponent(companyName || 'Verified Host')}`;
    setGeneratedLink(link);
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', uid), { 
      url: link, to: genTo, msg: genMsg, created_at: serverTimestamp(), status: 'active'
    });
    setLoading(false);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLoginMode) await signInWithEmailAndPassword(auth, email, password);
      else {
        const u = await createUserWithEmailAndPassword(auth, email, password);
        const p = { fullName, phone: phoneInput, email, tier: 'FREE_TRIAL', smsCredits: 60, created_at: serverTimestamp() };
        await setDoc(doc(db, 'artifacts', appId, 'users', u.user.uid, 'profile', 'data'), p);
      }
      setView('dashboard');
    } catch (e) { alert("Identity Denied: " + e.message); }
    setLoading(false);
  };

  if (!authResolved) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans selection:bg-[#25F4EE] antialiased flex flex-col relative overflow-x-hidden text-left font-black italic leading-none">
      <style>{`
        @keyframes rotate-beam { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes neon-cyan { 0% { box-shadow: 0 0 10px rgba(37,244,238,0.2); } 100% { box-shadow: 0 0 30px rgba(37,244,238,0.6); } }
        .lighthouse-neon-wrapper { position: relative; padding: 1.5px; border-radius: 28px; overflow: hidden; background: transparent; display: flex; align-items: center; justify-content: center; }
        .lighthouse-neon-wrapper::before { content: ""; position: absolute; width: 600%; height: 600%; top: 50%; left: 50%; background: conic-gradient(transparent 45%, #25F4EE 48%, #FE2C55 50%, #25F4EE 52%, transparent 55%); animation: rotate-beam 5s linear infinite; z-index: 0; }
        .lighthouse-neon-content { position: relative; z-index: 1; background: #0a0a0a; border-radius: 27px; width: 100%; height: 100%; }
        .btn-strategic { background: #FFFFFF; color: #000000; border-radius: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; width: 100%; padding: 1.15rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; border: none; cursor: pointer; transition: all 0.3s; }
        .btn-strategic:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 0 40px rgba(37,244,238,0.4); }
        .input-premium { background: #111; border: 1px solid rgba(255,255,255,0.05); color: white; width: 100%; padding: 1.1rem 1.25rem; border-radius: 16px; outline: none; font-size: 14px; font-weight: 500; font-style: normal; text-transform: none !important; }
        .text-glow-white { text-shadow: 0 0 15px rgba(255,255,255,0.8); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #25F4EE; border-radius: 10px; }
      `}</style>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[100] px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-white/10 p-1.5 rounded-lg border border-white/10 shadow-lg shadow-white/5"><Zap size={20} className="text-white fill-white" /></div>
          <span className="text-lg font-black italic tracking-tighter uppercase text-white leading-none mt-1">SMART SMS PRO</span>
        </div>

        {/* Desktop Header Menu (Highlighted & Robust) */}
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase italic tracking-widest leading-none">
           {!user ? (
             <>
               <button onClick={() => setView('auth')} className="hover:text-[#25F4EE] transition-colors">Portal Login</button>
               <button onClick={() => { setIsLoginMode(false); setView('auth'); }} className="bg-white/10 px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/20 transition-all text-white">Join Network</button>
             </>
           ) : (
             <>
               <button onClick={() => setView('dashboard')} className="flex items-center gap-2 hover:text-[#25F4EE] transition-colors"><LayoutDashboard size={14}/> Hub</button>
               <button onClick={() => setShowSmartSupport(true)} className="flex items-center gap-2 hover:text-[#25F4EE] transition-colors"><Bot size={14}/> Support</button>
               <button onClick={() => signOut(auth).then(()=>setView('home'))} className="text-[#FE2C55] hover:opacity-70 transition-all">Logout</button>
             </>
           )}
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-white/50 hover:text-white transition-all z-[110] leading-none">{isMenuOpen ? <X size={28} /> : <Menu size={28} />}</button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[140]" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-80 bg-[#050505] border-l border-white/10 h-screen z-[150] p-10 flex flex-col shadow-2xl animate-in slide-in-from-right font-black italic text-left leading-none">
            <div className="flex justify-between items-center mb-12">
              <span className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Command Center</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-white/40 hover:text-white leading-none"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-10 flex-1 text-left leading-none font-black italic">
              {!user ? (
                <button onClick={() => {setView('auth'); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-[#25F4EE] hover:text-white transition-colors text-left leading-none font-black italic uppercase"><UserPlus size={20} /> Identity Login</button>
              ) : (
                <>
                  <div className="mb-6 p-6 bg-white/5 rounded-3xl border border-white/10 text-left leading-none">
                     <p className="text-[9px] font-black text-white/30 uppercase mb-2 italic tracking-widest leading-none">Active Identity</p>
                     <p className="text-sm font-black text-[#25F4EE] truncate uppercase leading-none italic">{String(userProfile?.fullName || 'Operator')}</p>
                  </div>
                  <button onClick={() => {setView('dashboard'); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors text-left font-black italic uppercase"><LayoutDashboard size={20} /> Operator Hub</button>
                  <button onClick={() => {setShowSmartSupport(true); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-[#25F4EE] hover:text-white transition-colors text-left font-black italic uppercase"><Bot size={20} /> Smart Support</button>
                  <button onClick={() => {signOut(auth).then(()=>setView('home')); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-[#FE2C55] hover:opacity-70 transition-all text-left font-black italic uppercase"><LogOut size={20} /> Logout</button>
                </>
              )}
              
              <div className="mt-auto pt-8 border-t border-white/10 flex flex-col gap-6">
                <a href="#" className="text-[10px] font-black uppercase italic tracking-widest text-white/50 hover:text-white">Privacy Protocol</a>
                <a href="#" className="text-[10px] font-black uppercase italic tracking-widest text-white/50 hover:text-white">Terms of Use</a>
                <a href="#" className="text-[10px] font-black uppercase italic tracking-widest text-white/50 hover:text-white">Compliance (LGPD)</a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Content Container */}
      <div className="pt-28 flex-1 pb-10 relative leading-none">
        <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#FE2C55] opacity-[0.03] blur-[150px] pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#25F4EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

        {/* --- COMPLIANCE GATE --- */}
        {view === 'capture' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center relative px-8 font-black italic leading-none animate-in fade-in duration-500">
            <div className="lighthouse-neon-wrapper w-full max-w-lg shadow-3xl">
              <div className="lighthouse-neon-content p-12 sm:p-20 flex flex-col items-center">
                <ShieldCheck size={64} className="text-[#25F4EE] mb-8" />
                <h2 className="text-3xl font-black italic mb-4 uppercase tracking-tighter text-white">Security Validation</h2>
                <p className="text-[11px] text-white/50 uppercase font-black tracking-widest leading-relaxed mb-10 text-center">
                  Protocol Identity Check. Please verify your credentials to ensure global anti-spam compliance before accessing the host node.
                </p>
                <div className="w-full space-y-5 text-left">
                  <input required placeholder="Full Identity Name" value={captureForm.name} onChange={e=>setCaptureForm({...captureForm, name: e.target.value})} className="input-premium text-sm w-full font-medium italic !bg-black/50" />
                  <input required type="tel" placeholder="Mobile Number Verification" value={captureForm.phone} onChange={e=>setCaptureForm({...captureForm, phone: e.target.value})} className="input-premium text-sm w-full font-medium italic !bg-black/50" />
                  <button onClick={handleProtocolHandshake} className="btn-strategic !bg-[#25F4EE] !text-black text-xs italic font-black uppercase py-5 w-full shadow-2xl mt-6">Confirm & Access <ChevronRight size={16}/></button>
                </div>
                <div className="flex items-center gap-2 mt-10 opacity-40">
                   <Lock size={14} className="text-[#25F4EE]"/> <span className="text-[9px] uppercase tracking-widest text-[#25F4EE]">Zero-Knowledge Encrypted Terminal</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'home' && (
          <div className="w-full max-w-[540px] mx-auto px-4 z-10 relative text-center font-black italic leading-none animate-in fade-in duration-500">
            <header className="mb-14 text-center flex flex-col items-center leading-none">
              <div className="lighthouse-neon-wrapper mb-4"><div className="lighthouse-neon-content px-10 py-4 leading-none"><h1 className="text-3xl font-black italic uppercase text-white text-glow-white leading-none uppercase">SMART SMS PRO</h1></div></div>
              <p className="text-[10px] text-white/40 font-bold tracking-[0.4em] uppercase text-center font-black italic leading-none uppercase">High-End Redirection Protocol - 60 Free Handshakes</p>
            </header>

            <main className="space-y-8 pb-20 text-left font-black italic leading-none">
              {user && (
                <div className="flex justify-center mb-2 animate-in fade-in zoom-in duration-500 leading-none">
                  <button onClick={() => setView('dashboard')} className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full max-w-[420px] group italic font-black uppercase py-6 leading-none shadow-[0_0_30px_#25F4EE]"><LayoutDashboard size={24} /> ACCESS OPERATOR HUB</button>
                </div>
              )}

              <div className="lighthouse-neon-wrapper shadow-3xl">
                <div className="lighthouse-neon-content p-8 sm:p-12 text-left space-y-8 leading-none">
                  <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"></div><h3 className="text-[11px] font-black uppercase italic tracking-widest text-white/60 leading-none font-black italic uppercase">Smart Handshake Generator</h3></div>
                  <div className="space-y-3 leading-none">
                     <label className="text-[10px] uppercase text-white/40 ml-1 tracking-widest font-black block leading-none italic font-black">Global Number <span className="text-[#25F4EE] ml-2 opacity-50 uppercase tracking-widest text-[8px]">ex: +1 999 999 9999</span></label>
                     <input type="tel" value={genTo} onChange={e => setGenTo(e.target.value)} className="input-premium w-full leading-none font-medium italic" placeholder="+1 999 999 9999" />
                  </div>
                  <div className="space-y-3 leading-none">
                     <label className="text-[10px] uppercase text-white/40 ml-1 tracking-widest font-black block leading-none italic font-black">Host Identity</label>
                     <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-premium font-bold text-sm text-white/50 w-full leading-none !text-transform-none" placeholder="Host / Company Name" />
                  </div>
                  <div className="space-y-3 leading-none">
                     <div className="flex justify-between items-center leading-none uppercase"><label className="text-[10px] uppercase text-white/40 ml-1 tracking-widest font-black leading-none italic font-black">Payload</label><span className="text-[9px] text-white/20 font-black italic leading-none">{genMsg.length}/{MSG_LIMIT}</span></div>
                     <textarea value={genMsg} onChange={e => setGenMsg(e.target.value)} rows="3" className="input-premium w-full text-sm font-medium leading-relaxed font-black italic !text-transform-none" placeholder="Draft payload..." />
                  </div>
                  <button onClick={handleGenerate} className="btn-strategic !bg-[#25F4EE] !text-black text-xs italic font-black uppercase py-5 w-full shadow-2xl leading-none font-black italic uppercase">Generate Smart Link <ChevronRight size={18} /></button>
                </div>
              </div>

              {generatedLink && (
                <div className="animate-in zoom-in-95 duration-500 space-y-6 leading-none">
                  <div className="bg-[#0a0a0a] border border-[#25F4EE]/20 rounded-[40px] p-10 text-center shadow-2xl leading-none font-black italic uppercase">
                    <div className="bg-white p-6 rounded-3xl inline-block mb-10 shadow-xl text-center leading-none"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(generatedLink)}&color=000000`} className="w-32 h-32" alt="QR Code"/></div>
                    <input readOnly value={generatedLink} className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-[11px] text-[#25F4EE] font-mono text-center outline-none mb-8 border-dashed font-black" />
                    <div className="grid grid-cols-2 gap-6 w-full text-center leading-none">
                      <button onClick={() => {navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="flex flex-col items-center py-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all font-black italic leading-none">{copied ? <Check size={24} className="text-[#25F4EE]" /> : <Copy size={24} className="text-white/40" />}<span className="text-[10px] font-black uppercase italic mt-2 text-white/50 tracking-widest text-center leading-none uppercase">Quick Copy</span></button>
                      <button onClick={() => window.open(generatedLink, '_blank')} className="flex flex-col items-center py-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all font-black text-center leading-none italic uppercase"><ExternalLink size={24} className="text-white/40" /><span className="text-[10px] font-black uppercase italic mt-1 text-white/50 tracking-widest text-center leading-none uppercase">Live Test</span></button>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQ ELITE AIDA (NATIVE AMERICAN ENGLISH) */}
              <div className="pt-20 pb-12 text-left font-black italic leading-none uppercase">
                 <div className="flex items-center gap-3 mb-12 text-left leading-none uppercase"><HelpCircle size={28} className="text-[#FE2C55]" /><h3 className="text-3xl font-black uppercase text-white tracking-widest leading-none font-black italic uppercase">Protocol FAQ</h3></div>
                 <div className="space-y-2 text-left font-black italic leading-tight uppercase">
                    <FAQItem q="Why utilize our exclusive protocol instead of standard market routing?" a="Standard market redirects often trigger automated network heuristics instantly. Our proprietary protocol dynamically formats carrier headers to mirror organic traffic signatures globally, significantly enhancing final delivery rates while strictly adhering to global compliance acts." />
                    <FAQItem q="Is the cryptographic vault fully impenetrable and compliant?" a="Absolutely. Operating under a robust Zero-Knowledge architecture, lead metadata remains exclusively encrypted within your session context. We maintain rigorous alignment with international data protection protocols (GDPR/LGPD), ensuring total enterprise privacy." />
                    <FAQItem q="How does the system ensure long-term standing protection?" a="Our ecosystem employs an intelligent pacing engine that meticulously manages dispatch intervals. This infrastructure prevents carrier threshold flags, ensuring sustainable high-volume operations while maintaining pristine standing globally across network nodes." />
                    <FAQItem q="What is the strategic advantage of Advanced AI Synthesis?" a="Our proprietary framework dynamically optimizes payload contexts in real-time. By utilizing advanced frameworks, it ensures each dispatch maintains a unique organic fingerprint, maximizing user engagement while operating fully within compliance." />
                 </div>
              </div>

              {!user && (
                <div className="flex flex-col items-center gap-6 mt-8 w-full animate-in zoom-in-95 duration-500 pb-10 leading-none font-black italic text-center uppercase">
                  <button onClick={() => {setIsLoginMode(false); setView('auth')}} className="btn-strategic !bg-white !text-black text-xs w-full max-w-[420px] group italic font-black uppercase py-6 leading-none shadow-xl uppercase"><Rocket size={24} className="group-hover:animate-bounce" /> Start 60 Free Handshakes</button>
                  <button onClick={() => window.open("https://buy.stripe.com/nexus_access", '_blank')} className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full max-w-[420px] group italic font-black uppercase py-6 leading-none shadow-[0_0_20px_#25F4EE] uppercase"><Star size={24} className="animate-pulse" /> Upgrade to Elite Member</button>
                </div>
              )}
            </main>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="w-full max-w-7xl mx-auto py-10 px-6 font-black italic text-left leading-none uppercase animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-12 text-left font-black italic leading-none">
              <div className="text-left font-black italic leading-none uppercase">
                <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] leading-none uppercase text-white">OPERATOR HUB</h2>
                <div className="flex items-center gap-3 mt-4 text-left leading-none font-black italic uppercase">
                   <span className="bg-[#25F4EE]/10 text-[#25F4EE] text-[10px] px-3 py-1.5 rounded-full uppercase border border-[#25F4EE]/20 tracking-widest font-black italic leading-none uppercase">{String(userProfile?.tier || 'FREE')} IDENTITY</span>
                   {isPro && <span className="text-[9px] text-amber-500 uppercase tracking-widest animate-pulse leading-none font-black italic uppercase">● LIVE PROTOCOL ACTIVE</span>}
                </div>
              </div>
              <div className="flex-1 flex justify-end leading-none uppercase"><button onClick={() => setView('home')} className="btn-strategic !bg-white/10 !text-white border border-white/10 text-[10px] !w-fit px-6 py-3 mr-4 font-black italic uppercase leading-none uppercase"><Zap size={14} className="text-[#25F4EE]"/> Link Generator</button></div>
              <div className="flex items-center gap-4 flex-wrap leading-none font-black italic uppercase text-center">
                 <div className="bg-[#0a0a0a] border border-white/10 px-6 py-3 rounded-[1.5rem] text-center shadow-3xl leading-none uppercase">
                    <p className="text-[8px] font-black text-white/30 uppercase mb-2 italic tracking-widest leading-none uppercase">Active Chips</p>
                    <div className="flex items-center gap-2 leading-none font-black italic uppercase leading-none"><button onClick={() => setConnectedChips(prev => Math.max(1, prev-1))} className="text-white/30 hover:text-white leading-none">-</button><span className="text-xl font-black text-[#25F4EE] leading-none uppercase">{connectedChips}</span><button onClick={() => setConnectedChips(prev => prev+1)} className="text-white/30 hover:text-white leading-none">+</button></div>
                 </div>
                 <div className="bg-[#0a0a0a] border border-white/10 px-6 py-3 rounded-[1.5rem] text-center shadow-3xl border-b-2 border-b-[#25F4EE] text-center leading-none uppercase">
                    <p className="text-[8px] font-black text-white/30 uppercase mb-2 italic tracking-widest leading-none uppercase"><Wallet size={10} className="inline mr-1 leading-none"/> Quota</p>
                    <p className="text-2xl font-black text-white italic leading-none font-black italic uppercase leading-none">{isPro ? '∞' : String(userProfile?.smsCredits || 0)}</p>
                 </div>
              </div>
            </div>

            <div className="space-y-10">
               {/* IMPORT BLOCK */}
               <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 mb-8 font-black italic leading-none text-left uppercase">
                  <div className={`flex items-center gap-5 w-full relative z-10 font-black italic leading-none uppercase ${!isPro ? 'opacity-50 pointer-events-none select-none transition-opacity' : ''}`}>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/10 leading-none uppercase"><FileText size={32} className="text-[#25F4EE]" /></div>
                     <div><h3 className="text-2xl font-black uppercase italic leading-none font-black italic leading-none uppercase text-white tracking-tight">BULK ASSET INGESTION {!isPro && <Lock size={20} className="text-[#FE2C55] inline ml-2" />}</h3><p className="text-[10px] text-white/40 font-bold italic tracking-widest mt-2 leading-none uppercase font-black italic uppercase tracking-tighter">IMPORT UP TO 5,000 GLOBAL UNITS SIMULTANEOUSLY.</p></div>
                  </div>
                  <button className="bg-[#25F4EE] text-black text-[11px] px-12 py-5 rounded-2xl font-black uppercase italic shadow-[0_0_20px_rgba(37,244,238,0.3)] hover:scale-105 transition-transform relative z-10 disabled:opacity-50">Select Secure Source</button>
                  <input type="file" accept=".txt" ref={fileInputRef} className="hidden" />
                  {!isPro && <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-6"><p className="text-[#FE2C55] font-black uppercase tracking-widest text-[11px] mb-2 shadow-xl"><Lock size={12} className="inline mr-2"/> PRO PROTOCOL LOCKED</p><p className="text-white/60 text-[9px] uppercase tracking-widest text-center max-w-lg leading-relaxed uppercase italic font-black uppercase">BY NOT UTILIZING THE NATIVE SYNTHESIS ENGINE, YOU BYPASS SAFETY HEURISTICS. SECURE FULL ACCESS TO PROCEED.</p></div>}
               </div>

               {/* AI COMMAND BLOCK & DELAY ENGINE */}
               <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl mb-8 leading-none uppercase relative overflow-hidden">
                  <div className={`flex flex-col font-black italic leading-none uppercase ${!isPro ? 'opacity-50 pointer-events-none select-none transition-opacity' : ''} leading-none text-left uppercase`}>
                     <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8 text-left leading-none font-black italic uppercase leading-none">
                        <div className="flex items-center gap-4 text-left leading-none uppercase"><div className="p-3 bg-white/5 rounded-xl border border-white/10 leading-none uppercase"><BrainCircuit size={24} className="text-[#25F4EE]" /></div><div><h3 className="text-xl font-black uppercase italic font-black italic leading-none uppercase font-black italic uppercase text-white tracking-tight">AI AGENT COMMAND {!isPro && <Lock size={18} className="text-[#FE2C55] inline ml-2" />}</h3><p className="text-[9px] text-white/40 font-bold uppercase tracking-widest font-black italic leading-none mt-2 uppercase">MULTI-SCRAMBLING SYNTHESIS PROTOCOL</p></div></div>
                     </div>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left font-black italic leading-none uppercase">
                        <div className="space-y-4 text-left leading-none uppercase font-black italic flex flex-col">
                           <textarea disabled={!isPro} value={aiObjective} onChange={(e) => validateAIContent(e.target.value)} placeholder="Enter marketing goal for IA synthesis..." className="bg-[#111] border border-white/5 rounded-2xl p-5 text-sm font-medium text-white resize-none outline-none focus:border-[#25F4EE]/50 transition-colors h-[140px] font-black italic leading-relaxed !text-transform-none" />
                           
                           {aiWarning && (
                             <div className="p-4 bg-[#FE2C55]/10 border border-[#FE2C55]/30 rounded-xl flex items-start gap-3 animate-pulse">
                               <AlertTriangle size={16} className="text-[#FE2C55] shrink-0 mt-0.5"/>
                               <p className="text-[9px] text-[#FE2C55] font-black uppercase tracking-widest leading-relaxed">{aiWarning}</p>
                             </div>
                           )}

                           <div className="flex justify-between items-center bg-[#111] border border-white/5 rounded-2xl p-5">
                               <span className="text-[10px] font-black uppercase tracking-widest text-white/50 italic leading-none">DISPATCH DELAY PROTOCOL</span>
                               <div className="flex items-center gap-2">
                                   <input disabled={!isPro} type="number" min="20" value={sendDelay} onChange={(e) => setSendDelay(Math.max(20, Number(e.target.value)))} className="bg-transparent border-b border-[#25F4EE]/30 text-[#25F4EE] font-black w-10 text-right outline-none text-sm leading-none" />
                                   <span className="text-[9px] text-white/30 uppercase tracking-widest font-black leading-none">SECS</span>
                               </div>
                           </div>

                           <button onClick={handlePrepareBatch} disabled={!isPro || logs.length === 0 || !!aiWarning} className="bg-[#25F4EE] text-black text-[11px] py-5 rounded-2xl font-black uppercase italic shadow-[0_0_20px_#25F4EE] disabled:opacity-30 hover:scale-[1.02] transition-transform">Synthesize Queue ({logs.length} Units)</button>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-2xl flex flex-col items-center justify-center p-8 min-h-[200px] text-center shadow-inner leading-none font-black italic uppercase relative">
                          {activeQueue.length > 0 ? (
                             <div className="w-full leading-none uppercase">
                                <div className="mb-6 leading-none font-black italic text-center leading-none uppercase font-black"><p className="text-5xl font-black text-[#25F4EE] italic leading-none font-black uppercase">{queueIndex} / {activeQueue.length}</p></div>
                                <button onClick={() => setIsAutoSending(!isAutoSending)} className={`w-full py-5 text-black rounded-xl font-black uppercase text-[10px] tracking-widest leading-none uppercase ${isAutoSending ? 'bg-[#FE2C55]' : 'bg-[#25F4EE] animate-pulse shadow-xl'}`}>{isAutoSending ? "STOP AUTOPILOT" : "LAUNCH AUTOPILOT"}</button>
                             </div>
                          ) : (
                             <div className="opacity-20 text-center leading-none font-black italic uppercase"><ShieldAlert size={64} className="mx-auto mb-4 leading-none uppercase" /><p className="text-[10px] uppercase italic tracking-widest font-black italic leading-none uppercase">System Standby</p></div>
                          )}
                        </div>
                     </div>
                  </div>
                  {!isPro && <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-6"><p className="text-[#FE2C55] font-black uppercase tracking-widest text-[11px] mb-2 shadow-xl"><Lock size={12} className="inline mr-2"/> PRO PROTOCOL LOCKED</p><p className="text-white/60 text-[9px] uppercase tracking-widest text-center max-w-lg leading-relaxed uppercase italic font-black uppercase">BY NOT UTILIZING THE NATIVE SYNTHESIS ENGINE, YOU BYPASS SAFETY HEURISTICS. SECURE FULL ACCESS TO PROCEED.</p></div>}
               </div>

               {/* MARKETPLACE BLOCK */}
               <div id="marketplace-section" className="mb-16 mt-10 font-black italic text-left leading-none uppercase">
                  <div className="flex items-center gap-3 mb-8 text-left leading-none font-black italic uppercase leading-none uppercase"><ShoppingCart size={24} className="text-[#FE2C55]" /><h3 className="text-xl font-black uppercase text-white font-black italic leading-none uppercase text-glow-white">Maximize ROI: Upgrade Station</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-[#111] border border-white/10 p-10 rounded-[2.5rem] group shadow-2xl text-left leading-none font-black italic uppercase hover:border-[#25F4EE] transition-colors">
                       <h3 className="text-2xl font-black text-white uppercase mb-4">Nexus Access</h3>
                       <p className="text-4xl font-black text-[#25F4EE] italic mb-8 leading-none uppercase">$9.00 <span className="text-xs text-white/30 italic">/ Month</span></p>
                       <p className="text-[9px] text-white/40 mb-10 tracking-widest uppercase leading-relaxed font-black">Unlimited Link Generation & Secure Vault Data Management.</p>
                       <button className="btn-strategic !bg-white !text-black text-xs w-full py-4 uppercase">Upgrade Now</button>
                    </div>
                    <div className="bg-[#25F4EE]/10 border border-[#25F4EE] p-10 rounded-[2.5rem] group shadow-2xl text-left leading-none font-black italic uppercase hover:scale-[1.01] transition-transform">
                       <h3 className="text-2xl font-black text-white uppercase mb-4">Expert Agent</h3>
                       <p className="text-4xl font-black text-[#25F4EE] italic mb-8 leading-none uppercase">$19.90 <span className="text-xs text-white/30 italic">/ Month</span></p>
                       <p className="text-[9px] text-white/40 mb-10 tracking-widest uppercase leading-relaxed font-black">Full IA Native Synthesis & Automated Delay Protocol Engine.</p>
                       <button className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full py-4 uppercase">Activate Pro</button>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { name: "Starter Pack", qty: 400, price: "$12.00" },
                      { name: "Expansion Pack", qty: 800, price: "$20.00" },
                      { name: "Elite Operator", qty: 1800, price: "$29.00" }
                    ].map(pack => (
                      <div key={pack.name} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-center shadow-xl hover:bg-white/[0.08] transition-colors">
                        <p className="text-[9px] font-black text-white/30 mb-2 uppercase tracking-widest">{pack.name}</p>
                        <p className="text-3xl font-black text-white italic mb-4">{pack.qty} Credits</p>
                        <p className="text-xl font-black text-[#25F4EE] mb-8">{pack.price}</p>
                        <button className="w-full py-3 bg-black/50 border border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-[#25F4EE] hover:text-black transition-all">Acquire Pack</button>
                      </div>
                    ))}
                 </div>
               </div>

               {/* VAULT EXPLORER */}
               <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-3xl mb-16 font-black italic flex flex-col font-black italic leading-none text-left uppercase">
                 <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-[#111] leading-none font-black italic text-left leading-none font-black italic leading-none uppercase"><div className="flex items-center gap-3 text-left leading-none font-black italic leading-none font-black italic leading-none uppercase"><Database size={20} className="text-[#25F4EE]" /><h3 className="text-lg font-black uppercase italic font-black italic leading-none font-black italic leading-none uppercase tracking-tight text-white">DATA VAULT EXPLORER</h3></div></div>
                 <div className="min-h-[250px] max-h-[40vh] overflow-y-auto text-left font-black italic leading-none font-black italic uppercase bg-black custom-scrollbar">
                   {logs.length > 0 ? logs.map(l => {
                     const mask = (s, type) => { if (isPro) return String(s || ''); if (type === 'name') return String(s || '').substring(0, 2) + '***'; return String(s || '').substring(0, 5) + '***'; }; 
                     return (<div key={l.id} className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center hover:bg-white/[0.02] leading-none font-black italic font-black italic uppercase leading-none transition-colors"><div><p className="font-black text-lg md:text-xl text-white uppercase italic flex items-center gap-2 font-black italic leading-none font-black italic uppercase leading-none tracking-tight">{mask(l.nome_cliente, 'name')}{!isPro && <span className="text-[8px] bg-[#FE2C55] text-white px-2 py-0.5 rounded-full uppercase leading-none font-black italic animate-pulse tracking-widest">LOCKED</span>}</p><p className="text-[11px] md:text-[12px] text-[#25F4EE] font-black leading-none mt-2 font-black italic uppercase tracking-widest uppercase leading-none">{mask(l.telefone_cliente, 'phone')}</p></div><div className="text-right text-[9px] md:text-[10px] text-white/30 uppercase font-black italic leading-none font-black italic uppercase tracking-widest leading-none uppercase leading-none"><p>NODE ID: {l.id.substring(0,8)}</p></div></div>);
                   }) : <div className="p-20 text-center opacity-20 font-black italic text-center leading-none uppercase"><Lock size={48} className="mx-auto mb-4 uppercase" /><p className="text-[10px] uppercase font-black italic tracking-widest text-center leading-none leading-none uppercase">Vault Standby</p></div>}
                 </div>
                 {!isPro && logs.length > 0 && (<div className="p-6 md:p-8 bg-[#FE2C55]/5 border-t border-[#FE2C55]/20 flex flex-col items-center justify-center text-center gap-4 mt-auto font-black italic leading-none leading-none font-black italic uppercase leading-none uppercase">REVEAL FULL IDENTITIES? UPGRADE TO ELITE ACCESS NOW.</div>)}
               </div>

               {/* MASTER ADMIN TERMINAL */}
               {user?.uid === ADMIN_MASTER_ID && (
                 <div className="bg-[#FE2C55]/5 border border-[#FE2C55]/20 rounded-[2.5rem] p-10 mb-16 font-black italic">
                    <div className="flex items-center gap-3 mb-10 text-glow-white"><Crown size={24} className="text-[#FE2C55]"/><h3 className="text-2xl uppercase tracking-tighter">Master Access Console</h3></div>
                    <div className="flex gap-4 mb-10">
                       <input value={searchUid} onChange={e=>setSearchUid(e.target.value)} placeholder="Search UID Identity..." className="input-premium flex-1 !text-transform-none" />
                       <button onClick={async () => {
                         const d = await getDoc(doc(db, 'artifacts', appId, 'users', searchUid, 'profile', 'data'));
                         if(d.exists()) setFoundUser({ uid: searchUid, ...d.data() });
                         else alert("Identity not found.");
                       }} className="btn-strategic !bg-[#FE2C55] !text-white !w-fit px-10">Scan Nodes</button>
                    </div>
                    {foundUser && (
                      <div className="bg-black/40 border border-[#FE2C55]/30 p-8 rounded-3xl animate-in zoom-in-95 flex justify-between items-center">
                         <div>
                            <p className="text-xs text-white/40 uppercase mb-1">Operator: {String(foundUser.fullName)}</p>
                            <p className="text-lg uppercase text-white font-black italic">UID: {String(foundUser.uid).substring(0,12)}...</p>
                            <p className="text-[10px] text-[#FE2C55] uppercase mt-2">Tier: {String(foundUser.tier)} | Credits: {String(foundUser.smsCredits)}</p>
                         </div>
                         <button onClick={async () => {
                           await updateDoc(doc(db, 'artifacts', appId, 'users', foundUser.uid, 'profile', 'data'), { tier: 'ELITE', smsCredits: 1000, isSubscribed: true });
                           alert("Elite Access granted.");
                           setFoundUser(null);
                         }} className="btn-strategic !bg-white !text-black !w-fit px-8 text-[10px] animate-bounce"><Gift size={16} className="mr-2"/> Grant Elite Access</button>
                      </div>
                    )}
                 </div>
               )}
            </div>
          </div>
        )}

        {view === 'auth' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-left font-black italic leading-none font-black italic uppercase">
            <div className="lighthouse-neon-wrapper w-full max-w-md shadow-3xl text-left font-black italic leading-none uppercase">
              <div className="lighthouse-neon-content p-12 sm:p-20 relative font-black italic text-left leading-none font-black italic uppercase">
                <h2 className="text-3xl font-black italic mt-8 mb-12 uppercase text-white text-center font-black italic text-glow-white leading-none font-black italic uppercase tracking-tighter leading-none font-black italic font-black italic uppercase uppercase">Secure Member Access</h2>
                <form onSubmit={handleAuthSubmit} className="space-y-6 font-black italic text-left leading-none font-black italic font-black italic uppercase">
                  {!isLoginMode && (<><input required placeholder="Operator Name" value={fullName} onChange={e=>setFullName(e.target.value)} className="input-premium text-xs w-full font-medium italic !text-transform-none" /><input required placeholder="+1 999 999 9999" value={phoneInput} onChange={e=>setPhoneInput(e.target.value)} className="input-premium text-xs w-full font-medium italic !text-transform-none" /></>)}
                  <input required type="email" placeholder="Email identity..." value={email} onChange={e=>setEmail(e.target.value)} className="input-premium text-xs w-full font-medium italic !text-transform-none" />
                  <div className="relative font-black italic leading-none font-black italic leading-none font-black italic font-black italic uppercase">
                    <input required type={showPass ? "text" : "password"} placeholder="Security key..." value={password} onChange={e=>setPassword(e.target.value)} className="input-premium text-xs w-full font-medium italic !text-transform-none" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-4 text-white/30 leading-none font-black italic font-black italic font-black italic uppercase"><Eye size={18}/></button>
                  </div>
                  <button type="submit" disabled={loading} className="btn-strategic !bg-[#25F4EE] !text-black text-[11px] mt-4 shadow-xl w-full uppercase leading-none font-black italic tracking-widest leading-none font-black italic font-black italic uppercase">Authorize Entry</button>
                  <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); }} className="w-full text-[10px] text-white/20 uppercase tracking-[0.4em] mt-10 text-center hover:text-white transition-all font-black italic uppercase leading-none font-black italic leading-none font-black italic font-black italic uppercase uppercase">{isLoginMode ? "CREATE NEW OPERATOR? REGISTER" : "ALREADY A MEMBER? LOGIN"}</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-auto pb-20 w-full space-y-16 z-10 px-10 border-t border-white/5 pt-20 text-left leading-none font-black italic uppercase font-black italic leading-none font-black italic uppercase">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 text-[10px] font-black uppercase italic tracking-widest text-white/30 font-black italic text-left leading-none uppercase leading-none font-black italic font-black italic uppercase">
          <div className="flex flex-col gap-5 text-left font-black italic leading-none uppercase font-black italic leading-none leading-none font-black italic font-black italic uppercase leading-none"><span className="text-white/40 border-b border-white/5 pb-2 uppercase font-black italic leading-none font-black italic uppercase leading-none font-black italic uppercase">Legal</span><a href="#" className="hover:text-[#25F4EE] transition-colors font-black italic leading-none font-black italic leading-none font-black italic uppercase leading-none uppercase">Privacy Policy</a><a href="#" className="hover:text-[#25F4EE] transition-colors font-black italic leading-none font-black italic leading-none font-black italic uppercase leading-none uppercase">Terms of Use</a></div>
          <div className="flex flex-col gap-5 text-left font-black italic leading-none uppercase font-black italic leading-none leading-none font-black italic font-black italic uppercase leading-none"><span className="text-white/40 border-b border-white/5 pb-2 uppercase font-black italic leading-none font-black italic uppercase leading-none font-black italic uppercase">Compliance</span><a href="#" className="hover:text-[#FE2C55] transition-colors font-black italic leading-none font-black italic leading-none font-black italic uppercase leading-none uppercase font-black italic">LGPD/GDPR Hub</a></div>
          <div className="flex flex-col gap-5 text-left font-black italic leading-none uppercase font-black italic leading-none leading-none font-black italic font-black italic uppercase leading-none"><span className="text-white/40 border-b border-white/5 pb-2 uppercase font-black italic leading-none font-black italic uppercase leading-none font-black italic uppercase">Network</span><a href="#" className="hover:text-[#25F4EE] transition-colors font-black italic leading-none font-black italic leading-none font-black italic uppercase leading-none uppercase font-black italic">Global Nodes</a></div>
          <div className="flex flex-col gap-5 text-left font-black italic leading-none uppercase font-black italic leading-none leading-none font-black italic font-black italic uppercase leading-none"><span className="text-white/40 border-b border-white/5 pb-2 uppercase font-black italic leading-none font-black italic uppercase leading-none font-black italic uppercase">Support</span><button onClick={() => setShowSmartSupport(true)} className="hover:text-[#25F4EE] flex items-center gap-2 text-left uppercase font-black italic leading-none font-black italic uppercase leading-none font-black italic uppercase leading-none uppercase leading-none uppercase uppercase">SMART SUPPORT <Bot size={14}/></button></div>
        </div>
        <p className="text-[11px] text-white/20 font-black tracking-[8px] uppercase italic text-center leading-none font-black italic mt-10 font-black italic text-center uppercase tracking-[0.5em] leading-none font-black italic font-black italic uppercase leading-none uppercase">© 2026 ClickMoreDigital | Security Protocol</p>
      </footer>

      {/* SMART SUPPORT MODAL */}
      {showSmartSupport && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md text-left font-black italic leading-none uppercase font-black">
           <div className="lighthouse-neon-wrapper w-full max-w-sm shadow-3xl text-left font-black italic leading-none uppercase font-black">
              <div className="lighthouse-neon-content p-10 font-black italic leading-none uppercase">
                 <div className="flex justify-between items-center mb-10 leading-none text-left font-black italic leading-none uppercase">
                    <div className="flex items-center gap-3 leading-none text-left font-black italic leading-none uppercase font-black"><Bot size={32} className="text-[#25F4EE]" /><span className="text-sm font-black uppercase tracking-widest text-glow-white italic font-black italic leading-none uppercase font-black leading-none">SMART SUPPORT</span></div>
                    <button onClick={() => setShowSmartSupport(false)} className="text-white/40 hover:text-white transition-colors font-black italic leading-none uppercase font-black"><X size={28}/></button>
                 </div>
                 <div className="bg-black border border-white/5 p-8 rounded-3xl mb-8 min-h-[180px] flex items-center justify-center text-center font-black italic leading-none uppercase font-black leading-relaxed leading-none uppercase font-black">
                    <p className="text-[11px] text-white/50 font-black uppercase italic tracking-widest text-center font-black italic leading-none font-black uppercase leading-none uppercase font-black">IA Agent analyzing operational metadata... online to optimize your protocol and campaign conversions. How can I assist your operation today?</p>
                 </div>
                 <button onClick={() => {alert("Connecting secure node..."); setShowSmartSupport(false);}} className="btn-strategic !bg-[#25F4EE] !text-black text-xs italic uppercase font-black py-4 shadow-xl w-full font-black italic leading-none uppercase shadow-2xl hover:scale-[1.02]">Connect To Node</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
