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
  ShoppingCart, Wallet, AlertTriangle, Trash, Edit, Scale as ScaleIcon, Clock
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
const appId = "smartsms-pro-elite-terminal-vfinal";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- MASTER ADMIN ACCESS ---
const ADMIN_MASTER_ID = "YGepVHHMYaN9sC3jFmTyry0mYZO2"; // <--- ALEX, COLOQUE SEU UID REAL AQUI

// --- FAQ COMPONENT (CLEAN & AUTHORITATIVE) ---
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 py-8 group cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex justify-between items-center gap-6 text-left leading-none">
        <h4 className="text-[12px] sm:text-[14px] font-black uppercase italic tracking-widest text-white/70 group-hover:text-[#25F4EE] transition-colors leading-tight">
          {String(q)}
        </h4>
        {open ? <ChevronUp size={18} className="text-[#25F4EE]" /> : <ChevronDown size={18} className="text-white/20" />}
      </div>
      {open && <p className="mt-5 text-xs text-white/40 leading-relaxed font-medium animate-in slide-in-from-top-2 text-left italic tracking-wide uppercase">{String(a)}</p>}
    </div>
  );
};

export default function App() {
  // --- STATES ---
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  const [logs, setLogs] = useState([]); 
  const [generatedLink, setGeneratedLink] = useState('');
  const [captureData, setCaptureData] = useState(null);
  const [captureForm, setCaptureForm] = useState({ name: '', phone: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSmartSupport, setShowSmartSupport] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // AI & Automation
  const [aiObjective, setAiObjective] = useState('');
  const [aiWarning, setAiWarning] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [activeQueue, setActiveQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [connectedChips, setConnectedChips] = useState(1);
  const [sendDelay, setSendDelay] = useState(30);
  const [isAutoSending, setIsAutoSending] = useState(false);

  // Inputs
  const [genTo, setGenTo] = useState('');
  const [genMsg, setGenMsg] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPass, setShowPass] = useState(false);

  const fileInputRef = useRef(null);
  const isMaster = user?.uid === ADMIN_MASTER_ID;
  const isPro = isMaster || (userProfile?.tier === 'MASTER' || userProfile?.tier === 'ELITE' || userProfile?.isSubscribed);
  const MSG_LIMIT = 300;

  // --- IDENTITY BOOTSTRAP (MASTER PRIORITY) ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        if (u.uid === ADMIN_MASTER_ID) {
          setUserProfile({ 
            fullName: "Alex Master Admin", 
            tier: 'MASTER', 
            isUnlimited: true, 
            smsCredits: 999999, 
            isSubscribed: true 
          });
          setAuthResolved(true);
          return;
        }
        const docRef = doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'data');
        const d = await getDoc(docRef);
        if (d.exists()) {
          setUserProfile(d.data());
        } else {
          const p = { fullName: String(u.email?.split('@')[0] || 'Operator'), email: u.email, tier: 'FREE_TRIAL', smsCredits: 60, created_at: serverTimestamp() };
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

  // --- GATE SENSING ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('t'), m = params.get('m'), o = params.get('o');
    if (t && m && o && view !== 'bridge' && view !== 'capture') {
      setCaptureData({ to: t, msg: m, ownerId: o, company: params.get('c') || 'Verified Host' });
      setView('capture');
    }
  }, [view]);

  // --- DATA SYNC ---
  useEffect(() => {
    if (!user || view !== 'dashboard') return;
    const unsubLeads = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), (snap) => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const myData = isMaster ? all : all.filter(l => l.ownerId === user.uid);
      setLogs(myData.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
    });
    return () => unsubLeads();
  }, [user, view, isMaster]);

  // --- HANDLERS ---
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

  const handleProtocolHandshake = async () => {
    if(!captureForm.name || !captureForm.phone) return;
    if(!captureForm.phone.startsWith('+')) return alert("Use identification with '+' prefix (ex: +1 999 999 9999)");
    
    setLoading(true);
    try {
      const ownerId = captureData.ownerId;
      const safeId = captureForm.phone.replace(/\D/g, '');
      const leadId = `${ownerId}_${safeId}`;
      
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'leads', leadId), {
        ownerId,
        nome_cliente: String(captureForm.name),
        telefone_cliente: String(captureForm.phone),
        timestamp: serverTimestamp(),
        device: navigator.userAgent
      }, { merge: true });

      const pubRef = doc(db, 'artifacts', appId, 'users', ownerId, 'profile', 'data');
      const ownerProfSnap = await getDoc(pubRef);
      if (ownerProfSnap.exists()) {
         const op = ownerProfSnap.data();
         if (op.tier !== 'MASTER' && op.smsCredits <= 0) {
           setQuotaExceeded(true);
           setLoading(false);
           return;
         }
         if (op.tier !== 'MASTER' && ownerId !== ADMIN_MASTER_ID) await updateDoc(pubRef, { smsCredits: increment(-1) });
      }

      setView('bridge');
      setTimeout(() => {
        const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
        window.location.href = `sms:${captureData.to}${sep}body=${encodeURIComponent(captureData.msg)}`;
      }, 1000);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handlePrepareBatch = () => {
    if (!aiObjective || logs.length === 0) return;
    setIsAiProcessing(true);
    setTimeout(() => {
      const limit = Math.min(60, isPro ? 999999 : (Number(userProfile?.smsCredits) || 0), logs.length);
      setActiveQueue(logs.slice(0, limit).map(l => ({ ...l, optimizedMsg: `${aiObjective} [ID:${Math.random().toString(36).substr(2,4).toUpperCase()}]` })));
      setQueueIndex(0);
      setIsAiProcessing(false);
    }, 1000);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLoginMode) await signInWithEmailAndPassword(auth, email, password);
      else {
        const u = await createUserWithEmailAndPassword(auth, email, password);
        const p = { fullName: fullNameInput, phone: phoneInput, email, tier: 'FREE_TRIAL', smsCredits: 60, created_at: serverTimestamp() };
        await setDoc(doc(db, 'artifacts', appId, 'users', u.user.uid, 'profile', 'data'), p);
      }
      setView('dashboard');
    } catch (e) { alert("Identity Denied: " + e.message); }
    setLoading(false);
  };

  // --- CAPTURE RENDER (ISOLATED) ---
  if (view === 'capture') {
    return (
      <div className="fixed inset-0 z-[500] bg-[#010101] flex flex-col items-center justify-center p-6 text-center overflow-hidden leading-none font-black italic">
        <style>{`
          @keyframes rotate-beam { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
          .lighthouse-neon-wrapper { position: relative; padding: 1.5px; border-radius: 28px; overflow: hidden; background: transparent; display: flex; align-items: center; justify-content: center; }
          .lighthouse-neon-wrapper::before { content: ""; position: absolute; width: 600%; height: 600%; top: 50%; left: 50%; background: conic-gradient(transparent 45%, #25F4EE 48%, #FE2C55 50%, #25F4EE 52%, transparent 55%); animation: rotate-beam 5s linear infinite; z-index: 0; }
          .lighthouse-neon-content { position: relative; z-index: 1; background: #0a0a0a; border-radius: 27px; width: 100%; height: 100%; }
          .btn-strategic { background: #FFFFFF; color: #000000; border-radius: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; width: 100%; padding: 1.15rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; border: none; cursor: pointer; transition: all 0.3s; }
          .input-premium { background: #111; border: 1px solid rgba(255,255,255,0.1); color: white; width: 100%; padding: 1.1rem 1.25rem; border-radius: 16px; outline: none; font-size: 16px; font-weight: 500; font-style: normal; text-transform: none !important; }
        `}</style>
        <div className="lighthouse-neon-wrapper w-full max-w-lg shadow-3xl">
          <div className="lighthouse-neon-content p-10 sm:p-20 flex flex-col items-center">
            <ShieldCheck size={80} className="text-[#25F4EE] mb-8 animate-pulse" />
            <h2 className="text-3xl font-black italic mb-4 uppercase tracking-tighter text-white">Security Validation</h2>
            <p className="text-[12px] text-white/50 uppercase font-black tracking-widest leading-relaxed mb-10 text-center px-4">
              Identity Verification Required. Confirm your details to ensure anti-spam compliance before accessing the host.
            </p>
            <div className="w-full space-y-6 text-left px-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/30 ml-1 mb-2 block">Full Legal Name</label>
                <input required placeholder="Identity Name" value={captureForm.name} onChange={e=>setCaptureForm({...captureForm, name: e.target.value})} className="input-premium text-lg w-full font-medium text-white" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/30 ml-1 mb-2 block">Mobile ID (ex: +1 999 999 9999)</label>
                <input required type="tel" placeholder="+DDI DDD Number" value={captureForm.phone} onChange={e=>setCaptureForm({...captureForm, phone: e.target.value})} className="input-premium text-lg w-full font-medium text-white" />
              </div>
              <button onClick={handleProtocolHandshake} className="btn-strategic !bg-[#25F4EE] !text-black text-[12px] italic font-black uppercase py-6 w-full shadow-2xl mt-6">Confirm & Access <ChevronRight size={16}/></button>
            </div>
            <div className="flex items-center gap-2 mt-12 opacity-30 text-white font-black italic uppercase">
               <Lock size={14} className="text-[#25F4EE]"/> <span className="text-[10px] uppercase tracking-widest text-[#25F4EE]">Zero-Knowledge Encrypted Terminal</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        .input-premium { background: #111; border: 1px solid rgba(255,255,255,0.1); color: white; width: 100%; padding: 1.1rem 1.25rem; border-radius: 16px; outline: none; font-size: 16px; font-weight: 500; font-style: normal; text-transform: none !important; }
        .text-glow-white { text-shadow: 0 0 15px rgba(255,255,255,0.8); }
        .pro-obscure { position: relative; overflow: hidden; border-radius: 2.5rem; }
        .pro-obscure::after { content: ""; position: absolute; inset: 0; background: rgba(0,0,0,0.5); backdrop-blur: 3px; pointer-events: none; z-index: 5; }
        .pro-lock-layer { position: absolute; inset: 0; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; }
      `}</style>

      {/* Header Nav Desktop Premium */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[100] px-6 flex justify-between items-center leading-none">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-white/10 p-1.5 rounded-lg border border-white/10 shadow-lg shadow-white/5"><Zap size={20} className="text-white fill-white" /></div>
          <span className="text-lg font-black italic tracking-tighter uppercase text-white mt-1 leading-none">SMART SMS PRO</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase italic tracking-widest leading-none">
           {!user ? (
             <>
               <button onClick={() => { setIsLoginMode(true); setView('auth'); }} className={`transition-colors border-b-2 pb-1 ${view === 'auth' && isLoginMode ? 'border-[#25F4EE] text-[#25F4EE]' : 'border-transparent hover:text-[#25F4EE]'}`}>Secure Member Portal</button>
               <button onClick={() => { setIsLoginMode(false); setView('auth'); }} className={`bg-[#25F4EE] text-black px-6 py-2.5 rounded-xl font-black hover:scale-105 transition-all ${view === 'auth' && !isLoginMode && 'shadow-[0_0_20px_#25F4EE]'}`}>Join Network</button>
             </>
           ) : (
             <>
               <button onClick={() => setView('dashboard')} className="flex items-center gap-2 hover:text-[#25F4EE] transition-colors font-black uppercase italic"><LayoutDashboard size={14}/> Operator Hub</button>
               <button onClick={() => setShowSmartSupport(true)} className="flex items-center gap-2 hover:text-[#25F4EE] transition-colors font-black uppercase italic"><Bot size={16}/> Smart Support</button>
               <button onClick={() => signOut(auth).then(()=>setView('home'))} className="text-[#FE2C55] hover:opacity-70 transition-all uppercase font-black italic">Logout</button>
             </>
           )}
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-white/50 hover:text-white transition-all z-[110] font-black italic leading-none">{isMenuOpen ? <X size={28} /> : <Menu size={28} />}</button>
      </nav>

      <div className="pt-28 flex-1 pb-10 relative leading-none font-black italic">
        <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#FE2C55] opacity-[0.03] blur-[150px] pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#25F4EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

        {view === 'home' && (
          <div className="w-full max-w-[540px] mx-auto px-4 z-10 relative text-center font-black italic animate-in fade-in duration-500 leading-none">
            <header className="mb-14 text-center flex flex-col items-center">
              <div className="lighthouse-neon-wrapper mb-4"><div className="lighthouse-neon-content px-10 py-4 leading-none font-black italic"><h1 className="text-3xl font-black italic uppercase text-white text-glow-white leading-none uppercase">SMART SMS PRO</h1></div></div>
              <p className="text-[10px] text-white/40 font-bold tracking-[0.4em] uppercase text-center uppercase font-black italic">High-End Redirection Protocol - 60 Free Handshakes</p>
            </header>

            <main className="space-y-8 pb-20 text-left font-black italic leading-none">
              <div className="lighthouse-neon-wrapper shadow-3xl">
                <div className="lighthouse-neon-content p-8 sm:p-12 text-left space-y-8 leading-none font-black italic">
                  <div className="flex items-center gap-2 mb-2 font-black italic leading-none uppercase"><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"></div><h3 className="text-[11px] font-black uppercase italic tracking-widest text-white/60 leading-none font-black italic uppercase">Smart Handshake Generator</h3></div>
                  <div className="space-y-3 leading-none">
                     <label className="text-[10px] uppercase text-white/40 ml-1 tracking-widest font-black block leading-none italic font-black uppercase">Destination <span className="text-[#25F4EE] ml-2 opacity-50 text-[8px] uppercase font-black italic">ex: +1 999 999 9999</span></label>
                     <input type="tel" value={genTo} onChange={e => setGenTo(e.target.value)} className="input-premium font-medium italic leading-none font-black" placeholder="+1 999 999 9999" />
                  </div>
                  <div className="space-y-3 leading-none font-black italic">
                     <label className="text-[10px] uppercase text-white/40 ml-1 tracking-widest font-black block leading-none italic font-black uppercase font-black italic">Host Identity</label>
                     <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-premium font-bold text-sm text-white/50 w-full leading-none !text-transform-none font-black italic" placeholder="Your Organization Name" />
                  </div>
                  <div className="space-y-3 leading-none font-black italic">
                     <div className="flex justify-between items-center leading-none uppercase font-black italic"><label className="text-[10px] uppercase text-white/40 ml-1 tracking-widest font-black leading-none italic font-black uppercase font-black italic">Payload Content</label><span className="text-[9px] text-white/20 font-black italic leading-none uppercase font-black italic">{genMsg.length}/{MSG_LIMIT}</span></div>
                     <div className="relative">
                        <textarea value={genMsg} onChange={e => setGenMsg(e.target.value)} rows="3" className="input-premium w-full text-sm font-medium leading-relaxed font-black italic !text-transform-none font-black italic leading-none" placeholder="Draft your intelligent payload..." />
                        <button onClick={()=>setShowInstructions(!showInstructions)} className="absolute right-3 bottom-3 p-1.5 bg-[#25F4EE]/10 rounded-lg text-[#25F4EE] hover:bg-[#25F4EE]/20 transition-all font-black italic leading-none font-black italic"><HelpCircle size={14}/></button>
                     </div>
                  </div>
                  {showInstructions && (
                    <div className="p-6 bg-white/[0.03] border border-[#25F4EE]/20 rounded-2xl animate-in slide-in-from-top-2">
                       <h5 className="text-[11px] text-[#25F4EE] font-black uppercase italic mb-3 font-black italic leading-none uppercase font-black italic">Performance Instructions:</h5>
                       <ul className="text-[10px] text-white/40 space-y-2 uppercase font-black italic leading-relaxed font-black italic leading-none">
                          <li>● Use direct calls to action to minimize user decision lag.</li>
                          <li>● Keep payload between 160-300 chars for carrier standing.</li>
                          <li>● Confirming leads routes traffic to your native SMS node.</li>
                       </ul>
                    </div>
                  )}
                  <button onClick={handleGenerate} className="btn-strategic !bg-[#25F4EE] !text-black text-xs italic font-black uppercase py-5 w-full shadow-2xl leading-none font-black italic uppercase font-black italic font-black italic">Generate Smart Link <ChevronRight size={18} /></button>
                </div>
              </div>

              {generatedLink && (
                <div className="animate-in zoom-in-95 duration-500 space-y-6 leading-none">
                  <div className="bg-[#0a0a0a] border border-[#25F4EE]/20 rounded-[40px] p-10 text-center shadow-2xl leading-none font-black italic uppercase">
                    <div className="bg-white p-6 rounded-3xl inline-block mb-10 shadow-xl leading-none font-black italic"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(generatedLink)}&color=000000`} className="w-32 h-32" alt="QR Code"/></div>
                    <input readOnly value={generatedLink} className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-[11px] text-[#25F4EE] font-mono text-center outline-none mb-8 border-dashed font-black" />
                    <div className="grid grid-cols-2 gap-6 w-full leading-none font-black italic">
                      <button onClick={() => {navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="flex flex-col items-center py-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all font-black italic leading-none">{copied ? <Check size={24} className="text-[#25F4EE]" /> : <Copy size={24} className="text-white/40" />}<span className="text-[10px] font-black uppercase italic mt-2 text-white/50 tracking-widest text-center leading-none font-black italic uppercase">Quick Copy</span></button>
                      <button onClick={() => window.open(generatedLink, '_blank')} className="flex flex-col items-center py-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all font-black text-center italic uppercase leading-none font-black italic"><ExternalLink size={24} className="text-white/40" /><span className="text-[10px] font-black uppercase italic mt-1 text-white/50 tracking-widest text-center leading-none font-black italic uppercase">Live Test</span></button>
                    </div>
                  </div>
                </div>
              )}

              {!user && (
                <div className="flex flex-col items-center gap-6 mt-8 w-full animate-in zoom-in-95 duration-500 pb-10 leading-none font-black italic text-center uppercase font-black italic leading-none">
                  <button onClick={() => {setIsLoginMode(false); setView('auth')}} className="btn-strategic !bg-white !text-black text-xs w-full max-w-[420px] group italic font-black uppercase py-6 shadow-xl uppercase font-black italic font-black italic"><Rocket size={24} className="group-hover:animate-bounce" /> Start 60 Free Handshakes</button>
                  <button onClick={() => window.open("https://buy.stripe.com/nexus_access", '_blank')} className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full max-w-[420px] group italic font-black uppercase py-6 leading-none shadow-[0_0_20px_#25F4EE] uppercase font-black italic font-black italic"><Star size={24} className="animate-pulse" /> Upgrade to Elite Member</button>
                </div>
              )}

              <div className="pt-20 pb-12 text-left font-black italic leading-none uppercase font-black italic leading-none">
                 <div className="flex items-center gap-3 mb-12 text-left leading-none uppercase font-black italic font-black italic leading-none"><HelpCircle size={28} className="text-[#FE2C55] font-black italic leading-none font-black italic"/><h3 className="text-3xl font-black uppercase text-white tracking-widest leading-none font-black italic uppercase font-black italic font-black italic">Protocol FAQ</h3></div>
                 <div className="space-y-2 text-left font-black italic leading-tight uppercase font-black italic font-black italic leading-none">
                    <FAQItem q="Why utilize our exclusive protocol instead of standard redirects?" a="Standard market redirects often trigger automated carrier heuristics instantly. Our proprietary protocol dynamically formats headers to mirror organic traffic signatures, significantly enhancing final delivery rates." />
                    <FAQItem q="Is the cryptographic vault fully impenetrable and compliant?" a="Absolutely. Operating under a robust Zero-Knowledge architecture, lead metadata remains exclusively encrypted within your session context. We maintain rigorous alignment with international protection protocols." />
                    <FAQItem q="How does the system ensure long-term standing protection?" a="Our ecosystem employs an intelligent pacing engine that meticulously manages dispatch intervals, ensuring sustainable high-volume operations while maintaining pristine standings." />
                    <FAQItem q="What is the strategic advantage of Advanced AI Synthesis?" a="The IA Agent dynamically optimizes payload contexts in real-time. By utilizing advanced frameworks, it ensures each dispatch maintains a unique organic fingerprint, maximizing engagement." />
                 </div>
              </div>
            </main>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="w-full max-w-7xl mx-auto py-10 px-6 font-black italic text-left leading-none uppercase animate-in fade-in duration-700 font-black italic leading-none">
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-12 text-left font-black italic leading-none font-black italic font-black italic leading-none">
              <div className="text-left font-black italic leading-none uppercase font-black italic leading-none font-black italic">
                <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] leading-none uppercase text-white font-black italic font-black italic">OPERATOR HUB</h2>
                <div className="flex items-center gap-3 mt-4 text-left leading-none font-black italic uppercase font-black italic font-black italic leading-none">
                   <span className="bg-[#25F4EE]/10 text-[#25F4EE] text-[10px] px-4 py-1.5 rounded-full uppercase border border-[#25F4EE]/20 tracking-widest font-black italic leading-none uppercase font-black italic font-black italic leading-none font-black italic">{String(userProfile?.tier || 'FREE')} IDENTITY</span>
                   {isPro && <span className="text-[9px] text-amber-500 uppercase tracking-widest animate-pulse leading-none font-black italic uppercase font-black italic font-black italic leading-none font-black italic">● LIVE PROTOCOL ACTIVE</span>}
                </div>
              </div>
              <div className="flex items-center gap-4 flex-wrap leading-none font-black italic uppercase text-center font-black italic font-black italic leading-none font-black italic">
                 <button onClick={() => setView('home')} className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-4 rounded-xl hover:bg-white/10 transition-colors text-[10px] font-black italic uppercase text-white leading-none font-black italic font-black italic leading-none"><Zap size={14} className="text-[#25F4EE]"/> LINK GENERATOR</button>
                 <div className="bg-[#0a0a0a] border border-white/10 px-8 py-3 rounded-[1.5rem] text-center shadow-3xl leading-none uppercase font-black font-black italic font-black italic leading-none font-black italic">
                    <p className="text-[8px] font-black text-white/30 uppercase mb-2 italic tracking-widest leading-none font-black uppercase font-black italic font-black italic leading-none">Nodes</p>
                    <div className="flex items-center gap-2 leading-none font-black italic uppercase leading-none font-black font-black italic font-black italic leading-none font-black italic"><button onClick={() => setConnectedChips(prev => Math.max(1, prev-1))} className="text-white/30 hover:text-white leading-none font-black italic font-black italic leading-none font-black italic">-</button><span className="text-xl font-black text-[#25F4EE] leading-none uppercase font-black font-black italic font-black italic leading-none font-black italic">{connectedChips}</span><button onClick={() => setConnectedChips(prev => prev+1)} className="text-white/30 hover:text-white leading-none font-black italic font-black italic leading-none font-black italic">+</button></div>
                 </div>
                 <div className="bg-[#0a0a0a] border border-white/10 px-8 py-3 rounded-[1.5rem] text-center shadow-3xl border-b-2 border-b-[#25F4EE] text-center leading-none uppercase font-black font-black italic font-black italic leading-none font-black italic">
                    <p className="text-[8px] font-black text-white/30 uppercase mb-2 italic font-black uppercase leading-none font-black italic font-black italic leading-none font-black italic">Quota</p>
                    <p className="text-2xl font-black text-white italic font-black italic leading-none uppercase font-black font-black italic font-black italic leading-none">{isPro ? '∞' : String(userProfile?.smsCredits || 0)}</p>
                 </div>
              </div>
            </div>

            <div className="space-y-10 font-black italic uppercase font-black italic leading-none">
               {/* BULK INGESTION */}
               <div className={`bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 mb-8 font-black italic text-left uppercase ${!isPro ? 'pro-obscure' : ''}`}>
                  <div className={`flex items-center gap-5 w-full relative z-10 font-black italic leading-none font-black italic font-black italic leading-none font-black italic`}>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/10 leading-none uppercase font-black italic font-black italic leading-none"><FileText size={32} className="text-[#25F4EE]" /></div>
                     <div><h3 className="text-2xl font-black uppercase italic leading-none text-white tracking-tight font-black italic font-black italic leading-none font-black italic">BULK ASSET INGESTION {!isPro && <Lock size={20} className="text-[#FE2C55] inline ml-2 font-black italic font-black italic leading-none font-black italic" />}</h3><p className="text-[10px] text-white/40 font-bold italic tracking-widest mt-2 leading-none uppercase font-black italic tracking-tighter uppercase font-black italic leading-none font-black italic font-black italic leading-none">Import up to 5,000 global units simultaneously with zero operation lag.</p></div>
                  </div>
                  {!isPro ? (
                    <div className="pro-lock-layer font-black italic leading-none">
                       <p className="text-[#FE2C55] font-black uppercase tracking-widest text-[11px] mb-2 shadow-xl animate-pulse font-black italic leading-none font-black italic font-black italic leading-none font-black italic"><Lock size={12} className="inline mr-2 font-black italic font-black italic leading-none"/> PRO LOCKED</p>
                       <button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="bg-[#25F4EE] text-black text-[9px] px-10 py-3 rounded-xl font-black uppercase italic font-black italic leading-none font-black italic uppercase font-black italic leading-none font-black italic uppercase font-black italic leading-none font-black italic uppercase">Unlock Ferrari Module</button>
                    </div>
                  ) : (
                    <button onClick={() => fileInputRef.current.click()} className="bg-[#25F4EE] text-black text-[11px] px-12 py-5 rounded-2xl font-black uppercase italic shadow-[0_0_20px_rgba(37,244,238,0.3)] hover:scale-105 transition-transform whitespace-nowrap relative z-10 font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">Select Source</button>
                  )}
                  <input type="file" accept=".txt" ref={fileInputRef} className="hidden font-black italic leading-none font-black italic" />
               </div>

               {/* AI AGENT */}
               <div className={`bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl mb-8 leading-none uppercase relative overflow-hidden font-black italic ${!isPro ? 'pro-obscure' : ''}`}>
                  <div className={`flex flex-col font-black italic leading-none text-left`}>
                     <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8 text-left leading-none font-black italic uppercase font-black italic font-black italic leading-none">
                        <div className="flex items-center gap-4 text-left leading-none font-black italic font-black italic leading-none"><div className="p-3 bg-white/5 rounded-xl border border-white/10 leading-none uppercase font-black italic font-black italic leading-none font-black italic"><BrainCircuit size={24} className="text-[#25F4EE]" /></div><div><h3 className="text-xl font-black uppercase italic font-black italic leading-none uppercase font-black italic uppercase text-white tracking-tight font-black italic">AI AGENT COMMAND {!isPro && <Lock size={18} className="text-[#FE2C55] inline ml-2 font-black italic" />}</h3><p className="text-[9px] text-white/40 font-bold uppercase tracking-widest font-black italic leading-none mt-2 uppercase font-black italic leading-none font-black italic font-black italic leading-none font-black italic">Automated linguistic scrambling to obliterate carrier filter blocks.</p></div></div>
                     </div>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left uppercase font-black italic">
                        <div className="space-y-4 flex flex-col font-black italic leading-none">
                           <textarea disabled={!isPro} value={aiObjective} onChange={(e) => setAiObjective(e.target.value)} placeholder="Marketing goal..." className="input-premium h-[140px] font-black italic leading-relaxed !text-transform-none font-black italic leading-none font-black italic font-black italic leading-none font-black italic" />
                           <div className="flex justify-between items-center bg-[#111] border border-white/5 rounded-2xl p-5 font-black italic font-black italic leading-none font-black italic"><span className="text-[10px] font-black uppercase tracking-widest text-white/50 italic leading-none font-black italic leading-none font-black italic">DISPATCH DELAY</span><div className="flex items-center gap-2 font-black italic leading-none font-black italic font-black italic leading-none font-black italic"><input disabled={!isPro} type="number" min="20" value={sendDelay} onChange={(e) => setSendDelay(Math.max(20, Number(e.target.value)))} className="bg-transparent border-b border-[#25F4EE]/30 text-[#25F4EE] font-black w-10 text-right outline-none text-sm leading-none font-black italic leading-none font-black italic" /><span className="text-[9px] text-white/30 font-black leading-none font-black italic leading-none font-black italic">SECS</span></div></div>
                           <button onClick={handlePrepareBatch} disabled={!isPro || logs.length === 0} className="bg-[#25F4EE] text-black text-[11px] py-5 rounded-2xl font-black uppercase italic shadow-[0_0_20px_rgba(37,244,238,0.2)] disabled:opacity-30 hover:scale-[1.02] transition-transform font-black italic leading-none font-black italic">Synthesize Queue ({logs.length} Units)</button>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-2xl flex flex-col items-center justify-center p-8 min-h-[200px] text-center shadow-inner leading-none font-black italic uppercase relative font-black italic leading-none font-black italic"><div className="opacity-20 text-center leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic"><ShieldAlert size={64} className="mx-auto mb-4 leading-none uppercase font-black italic leading-none font-black italic" /><p className="text-[10px] uppercase italic tracking-widest font-black italic leading-none uppercase font-black italic leading-none font-black italic">System Standby</p></div></div>
                     </div>
                  </div>
                  {!isPro && <div className="pro-lock-layer font-black italic leading-none font-black italic font-black italic leading-none font-black italic"><p className="text-[#FE2C55] font-black uppercase tracking-widest text-[11px] mb-2 shadow-xl animate-pulse font-black italic leading-none font-black italic font-black italic leading-none font-black italic"><Lock size={12} className="inline mr-2 font-black italic leading-none font-black italic font-black italic leading-none font-black italic"/> PRO LOCKED</p><button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="bg-[#25F4EE] text-black text-[9px] px-10 py-3 rounded-xl font-black uppercase italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic uppercase font-black italic leading-none font-black italic font-black italic leading-none font-black italic uppercase">Unlock Expert IA</button></div>}
               </div>

               {/* MARKETPLACE STATION */}
               <div id="marketplace-section" className="mb-16 mt-10 font-black italic text-left leading-none uppercase font-black italic font-black italic leading-none font-black italic">
                  <div className="flex items-center gap-3 mb-10 leading-none font-black italic uppercase font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic uppercase"><ShoppingCart size={24} className="text-[#FE2C55] leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic" /><h3 className="text-xl font-black uppercase text-white text-glow-white leading-none font-black italic font-black italic leading-none font-black italic">UPGRADE STATION</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left font-black italic leading-none uppercase font-black italic">
                    <div className="bg-[#111] border border-white/10 p-10 rounded-[2.5rem] group shadow-2xl hover:border-[#25F4EE] transition-colors font-black italic leading-none">
                       <h3 className="text-3xl font-black text-white uppercase mb-4 leading-none font-black italic font-black italic leading-none font-black italic">Nexus Access</h3>
                       <p className="text-4xl font-black text-[#25F4EE] italic mb-8 leading-none uppercase font-black italic font-black italic leading-none font-black italic">{isMaster ? "0.00 / MASTER" : "$9.00 / Month"}</p>
                       <p className="text-[9px] text-white/40 mb-10 uppercase font-black italic leading-relaxed font-black italic font-black italic leading-none font-black italic">Unlimited Redirections & Secure Vault.</p>
                       {isMaster ? <button className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full py-4 uppercase font-black italic leading-none font-black italic leading-none font-black italic">UNLIMITED ACCESS</button> : <button className="btn-strategic !bg-white !text-black text-xs w-full py-4 uppercase font-black italic leading-none font-black italic leading-none font-black italic">Upgrade Now</button>}
                    </div>
                    <div className="bg-[#25F4EE]/10 border border-[#25F4EE] p-10 rounded-[2.5rem] group shadow-2xl hover:scale-[1.01] transition-transform font-black italic leading-none">
                       <h3 className="text-3xl font-black text-white uppercase mb-4 text-[#25F4EE] leading-none font-black italic font-black italic leading-none font-black italic">Expert Agent</h3>
                       <p className="text-4xl font-black text-[#25F4EE] italic mb-8 leading-none uppercase font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">{isMaster ? "0.00 / MASTER" : "$19.90 / Month"}</p>
                       <p className="text-[9px] text-white/40 mb-10 uppercase font-black italic leading-relaxed font-black italic font-black italic leading-none font-black italic">Full IA Native Synthesis & Automated Delay.</p>
                       {isMaster ? <button className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full py-4 uppercase font-black italic leading-none font-black italic leading-none font-black italic">UNLIMITED ACCESS</button> : <button className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full py-4 uppercase font-black italic leading-none font-black italic leading-none font-black italic">Activate Node</button>}
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-black italic leading-none uppercase font-black italic">
                    {[
                      { name: "Starter Node", qty: 400, price: isMaster ? "0.00 / MASTER" : "$12.00" },
                      { name: "Nexus Pack", qty: 800, price: isMaster ? "0.00 / MASTER" : "$20.00" },
                      { name: "Elite Operator", qty: 1800, price: isMaster ? "0.00 / MASTER" : "$29.00" }
                    ].map(pack => (
                      <div key={pack.name} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-center shadow-xl flex flex-col items-center font-black italic leading-none font-black italic font-black italic leading-none font-black italic">
                        <p className="text-[10px] font-black text-[#25F4EE] mb-2 uppercase tracking-widest font-black italic leading-none">{pack.name}</p>
                        <p className="text-3xl font-black text-white italic mb-4 uppercase leading-none font-black italic leading-none">{pack.qty} HANDSHAKES</p>
                        <p className="text-xl font-black text-[#25F4EE] mb-8 font-black uppercase italic leading-none font-black italic leading-none">{pack.price}</p>
                        <button className="w-full py-3 bg-black border border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-[#25F4EE] hover:text-black transition-all font-black italic leading-none font-black italic">Acquire Node</button>
                      </div>
                    ))}
                 </div>
               </div>

               {/* DATA VAULT */}
               <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-3xl mb-16 font-black italic flex flex-col text-left uppercase font-black italic leading-none">
                  <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-[#111] leading-none uppercase font-black italic"><div className="flex items-center gap-3"><Database size={20} className="text-[#25F4EE]" /><h3 className="text-lg font-black uppercase text-white tracking-tight uppercase font-black italic">DATA VAULT EXPLORER</h3></div></div>
                  <div className="min-h-[250px] max-h-[40vh] overflow-y-auto bg-black custom-scrollbar font-black italic leading-none">
                    {logs.length > 0 ? logs.map(l => {
                      const mask = (s, type) => { if (isPro) return String(s || ''); if (type === 'name') return String(s || '').substring(0, 2) + '***'; return String(s || '').substring(0, 5) + '***'; }; 
                      return (<div key={l.id} className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center hover:bg-white/[0.02] transition-colors font-black italic leading-none font-black italic"><div><p className="font-black text-lg md:text-xl text-white uppercase italic flex items-center gap-2 font-black italic leading-none">{mask(l.nome_cliente, 'name')}{(!isPro) && <span className="text-[8px] bg-[#FE2C55] text-white px-2 py-0.5 rounded-full animate-pulse font-black leading-none uppercase ml-2 font-black italic">LOCKED</span>}</p><p className="text-[11px] md:text-[12px] text-[#25F4EE] font-black mt-2 tracking-widest font-black leading-none">{mask(l.telefone_cliente, 'phone')}</p></div><div className="text-right text-[9px] md:text-[10px] text-white/30 uppercase font-black italic leading-none font-black italic uppercase font-black italic">ID: {String(l.id).substring(0,8)}</div></div>);
                    }) : <div className="p-20 text-center opacity-20 font-black italic text-center leading-none font-black italic leading-none"><Lock size={48} className="mx-auto mb-4" /><p className="text-[10px] uppercase font-black italic leading-none font-black italic">Vault Standby</p></div>}
                  </div>
                </div>
            </div>
          </div>
        )}

        {view === 'auth' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-left font-black italic uppercase leading-none font-black italic font-black italic leading-none font-black italic">
            <div className="lighthouse-neon-wrapper w-full max-w-md shadow-3xl text-left uppercase font-black italic font-black italic leading-none">
              <div className="lighthouse-neon-content p-12 sm:p-20 relative font-black italic text-left uppercase leading-none font-black italic font-black italic leading-none">
                <h2 className="text-3xl font-black italic mt-8 mb-12 uppercase text-white text-center font-black italic text-glow-white leading-none uppercase tracking-tighter font-black italic font-black italic leading-none">Secure Member Portal</h2>
                <form onSubmit={handleAuthSubmit} className="space-y-6 font-black italic text-left uppercase font-black italic leading-none font-black italic font-black italic leading-none">
                  {!isLoginMode && (<><input required placeholder="Full Legal Name" value={fullNameInput} onChange={e=>setFullNameInput(e.target.value)} className="input-premium text-xs w-full font-medium italic !text-transform-none font-black italic leading-none font-black italic" /><input required placeholder="+1 999 999 9999" value={phoneInput} onChange={e=>setPhoneInput(e.target.value)} className="input-premium text-xs w-full font-medium italic !text-transform-none font-black italic leading-none font-black italic" /></>)}
                  <input required type="email" placeholder="Email identity..." value={email} onChange={e=>setEmail(e.target.value)} className="input-premium text-xs w-full font-medium italic !text-transform-none font-black italic leading-none font-black italic" />
                  <div className="relative font-black italic leading-none uppercase font-black italic leading-none font-black italic font-black italic leading-none font-black italic">
                    <input required type={showPass ? "text" : "password"} placeholder="Security key..." value={password} onChange={e=>setPassword(e.target.value)} className="input-premium text-xs w-full font-medium italic !text-transform-none font-black italic leading-none font-black italic" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-4 text-white/30 uppercase font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none"><Eye size={18}/></button>
                  </div>
                  <button type="submit" disabled={loading} className="btn-strategic !bg-[#25F4EE] !text-black text-[11px] mt-4 shadow-xl w-full uppercase leading-none font-black italic tracking-widest font-black italic leading-none font-black italic font-black italic leading-none font-black italic">Authorize Access</button>
                  <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); }} className="w-full text-[10px] text-white/20 uppercase tracking-[0.4em] mt-10 text-center hover:text-white transition-all font-black italic uppercase font-black italic leading-none font-black italic font-black italic leading-none font-black italic leading-none font-black italic leading-none font-black italic leading-none font-black italic leading-none font-black italic leading-none font-black italic font-black italic leading-none font-black italic">{isLoginMode ? "CREATE NEW OPERATOR? REGISTER" : "ALREADY A MEMBER? LOGIN"}</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-auto pb-20 w-full space-y-16 z-10 px-10 border-t border-white/5 pt-20 text-left font-black italic uppercase leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 text-[10px] font-black uppercase italic tracking-widest text-white/30 text-left uppercase font-black italic leading-none font-black italic font-black italic leading-none font-black italic">
          <div className="flex flex-col gap-5 text-left font-black leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic"><span className="text-white/40 border-b border-white/5 pb-2 uppercase leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">Legal</span><a href="#" className="hover:text-[#25F4EE] transition-colors leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">Privacy Policy</a><a href="#" className="hover:text-[#25F4EE] transition-colors leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">Terms of Use</a></div>
          <div className="flex flex-col gap-5 text-left font-black leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic"><span className="text-white/40 border-b border-white/5 pb-2 uppercase leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">Compliance</span><a href="#" className="hover:text-[#FE2C55] transition-colors leading-none font-black uppercase font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">LGPD Protocol</a><a href="#" className="hover:text-[#FE2C55] transition-colors leading-none font-black uppercase font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">GDPR Node</a></div>
          <div className="flex flex-col gap-5 text-left font-black leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic"><span className="text-white/40 border-b border-white/5 pb-2 uppercase font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">Network</span><a href="#" className="hover:text-[#25F4EE] transition-colors font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">U.S. Nodes</a><a href="#" className="hover:text-[#25F4EE] transition-colors font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">EU Nodes</a></div>
          <div className="flex flex-col gap-5 text-left font-black leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic"><span className="text-white/40 border-b border-white/5 pb-2 uppercase font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">Support</span><button onClick={() => setShowSmartSupport(true)} className="hover:text-[#25F4EE] flex items-center gap-2 text-left uppercase leading-none font-black italic font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">SMART SUPPORT <Bot size={14}/></button></div>
        </div>
        <p className="text-[11px] text-white/20 font-black tracking-[8px] uppercase text-center leading-none mt-10 font-black italic uppercase font-black italic font-black italic leading-none font-black italic">© 2026 ClickMoreDigital | Security Protocol</p>
      </footer>

      {showSmartSupport && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md text-left font-black italic uppercase leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">
           <div className="lighthouse-neon-wrapper w-full max-sm shadow-3xl text-left uppercase font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">
              <div className="lighthouse-neon-content p-10 font-black italic leading-none uppercase font-black font-black italic leading-none font-black italic font-black italic leading-none font-black italic">
                 <div className="flex justify-between items-center mb-10 leading-none text-left uppercase font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">
                    <div className="flex items-center gap-3 leading-none text-left font-black italic uppercase font-black font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic"><Bot size={32} className="text-[#25F4EE] font-black leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic" /><span className="text-sm font-black uppercase tracking-widest text-glow-white italic uppercase font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">SMART SUPPORT</span></div>
                    <button onClick={() => setShowSmartSupport(false)} className="text-white/40 hover:text-white transition-colors uppercase font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic"><X size={28}/></button>
                 </div>
                 <div className="bg-black border border-white/5 p-8 rounded-3xl mb-8 min-h-[180px] flex items-center justify-center text-center font-black italic leading-relaxed uppercase font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">
                    <p className="text-[11px] text-white/50 font-black uppercase italic tracking-widest text-center uppercase font-black italic leading-none">IA Agent evaluating operational metadata... online to assist your elite conversions. How can I help today?</p>
                 </div>
                 <button onClick={() => {alert("Connecting node..."); setShowSmartSupport(false);}} className="btn-strategic !bg-[#25F4EE] !text-black text-xs italic uppercase font-black py-4 shadow-xl w-full uppercase shadow-2xl hover:scale-[1.02] font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic font-black italic leading-none font-black italic">Connect To Node</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
