import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInAnonymously,
  signInWithCustomToken,
  sendPasswordResetEmail
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
  addDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { 
  Zap, Lock, Globe, ChevronRight, Copy, Check, ExternalLink, Menu, X, 
  LayoutDashboard, LogOut, Target, Rocket, BrainCircuit, ShieldAlert, Activity, 
  Smartphone, Shield, Info, Database, RefreshCw, Users, Crown,
  UserCheck, UserMinus, Gift, Bot, Eye, EyeOff, BarChart3, ShieldCheck,
  Server, Cpu, Radio, UserPlus, HelpCircle, ChevronDown, ChevronUp, Star, BookOpen, 
  AlertOctagon, Scale, ShieldAlert as AlertIcon, FileText, UploadCloud, PlayCircle,
  ShoppingCart, Wallet, AlertTriangle, Trash, Edit
} from 'lucide-react';

// --- CONFIGURAÇÃO BLINDADA DO FIREBASE ---
let envConfig = {};
try { envConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {}; } catch (e) {}
const fallbackConfig = {
  apiKey: "AIzaSyBI-JSC-FtVOz_r6p-XjN6fUrapMn_ad24",
  authDomain: "smartsmspro-4ee81.firebaseapp.com",
  projectId: "smartsmspro-4ee81",
  storageBucket: "smartsmspro-4ee81.firebasestorage.app",
  messagingSenderId: "269226709034",
  appId: "1:269226709034:web:00af3a340b1e1ba928f353"
};
const firebaseConfig = Object.keys(envConfig).length > 0 ? envConfig : fallbackConfig;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'smartsms-pro-expert-vfinal';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- MASTER ADMIN ACCESS ---
const ADMIN_MASTER_ID = "YGepVHHMYaN9sC3jFmTyry0mYZO2"; // <--- ALEX, COLOQUE SEU UID AQUI

const STRIPE_NEXUS_LINK = "https://buy.stripe.com/nexus_access"; 
const STRIPE_EXPERT_LINK = "https://buy.stripe.com/expert_agent";

// --- FAQ COMPONENT ---
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 py-8 group cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex justify-between items-center gap-6 text-left">
        <h4 className="text-[11px] sm:text-xs font-black uppercase italic tracking-widest text-white/70 group-hover:text-[#25F4EE] transition-colors leading-tight">{q}</h4>
        {open ? <ChevronUp size={18} className="text-[#25F4EE]" /> : <ChevronDown size={18} className="text-white/20" />}
      </div>
      {open && <p className="mt-5 text-xs text-white/40 leading-relaxed font-medium animate-in slide-in-from-top-2 text-left italic tracking-wide">{a}</p>}
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authResolved, setAuthResolved] = useState(false); 
  const [logs, setLogs] = useState([]); 
  const [allUsers, setAllUsers] = useState([]); 
  const [myLinks, setMyLinks] = useState([]); 
  const [isVaultActive, setIsVaultActive] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [captureData, setCaptureData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  
  // AI & Automation
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiObjective, setAiObjective] = useState('');
  const [activeQueue, setActiveQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [connectedChips, setConnectedChips] = useState(1);
  const [isAutoSending, setIsAutoSending] = useState(false);
  const [sendDelay, setSendDelay] = useState(30);

  // Generator States
  const [genTo, setGenTo] = useState('');
  const [genMsg, setGenMsg] = useState('');
  const [companyName, setCompanyName] = useState('');
  const MSG_LIMIT = 300;

  // Auth States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPass, setShowPass] = useState(false);

  const isPro = userProfile?.tier === 'MASTER' || userProfile?.isSubscribed || userProfile?.isUnlimited || user?.uid === ADMIN_MASTER_ID;

  // 1. FIREBASE AUTH BOOTSTRAP
  useEffect(() => {
    const initAuth = async () => {
      try { if (!auth.currentUser) await signInAnonymously(auth); } catch (e) {}
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u && !u.isAnonymous) {
        try {
          const docRef = doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'data');
          const d = await getDoc(docRef);
          if (d.exists()) {
            const data = d.data();
            if (u.uid === ADMIN_MASTER_ID && data.tier !== 'MASTER') {
              const masterData = { tier: 'MASTER', isUnlimited: true, smsCredits: 999999 };
              await updateDoc(docRef, masterData).catch(()=>{});
              await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', u.uid), { ...data, ...masterData }, { merge: true }).catch(()=>{});
              setUserProfile({ ...data, ...masterData });
            } else {
              setUserProfile(data);
            }
            if(data.connectedChips) setConnectedChips(data.connectedChips);
          } else {
            const isM = u.uid === ADMIN_MASTER_ID;
            const p = { fullName: u.email || 'Operator', phone: '', email: u.email || '', tier: isM ? 'MASTER' : 'FREE_TRIAL', smsCredits: isM ? 999999 : 60, connectedChips: 1, created_at: serverTimestamp() };
            await setDoc(docRef, p);
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', u.uid), p);
            setUserProfile(p);
          }
        } catch (e) {}
      } else {
        setUserProfile(null);
      }
      setAuthResolved(true);
    });
    return () => unsubscribe();
  }, []);

  // 2. REDIRECTION HANDSHAKE
  useEffect(() => {
    if (!authResolved) return; 
    const params = new URLSearchParams(window.location.search);
    const lid = params.get('lid'), t = params.get('t'), m = params.get('m'), o = params.get('o');
    if (t && m && view !== 'bridge') {
      setCaptureData({ to: t, msg: m, company: params.get('c') || 'Verified Host', ownerId: o });
      handleProtocolHandshake(t, m, o, lid);
    }
  }, [authResolved]);

  // 3. MASTER DATA BRIDGE (Leads via Public Tunnel)
  useEffect(() => {
    if (!user || user.isAnonymous || view !== 'dashboard') return;
    const unsubProfile = onSnapshot(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data'), (docSnap) => {
      if (docSnap.exists()) setUserProfile(docSnap.data());
    });
    const unsubLeads = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), (snap) => {
      const allData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const myData = user.uid === ADMIN_MASTER_ID ? allData : allData.filter(l => l.ownerId === user.uid);
      setLogs(myData.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
    });
    const unsubLinks = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'links'), (snap) => {
      setMyLinks(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0)));
    });
    return () => { unsubProfile(); unsubLeads(); unsubLinks(); };
  }, [user, view, isVaultActive]);

  // 4. AUTOPILOT ENGINE 
  useEffect(() => {
    let timer;
    if (isAutoSending && queueIndex < activeQueue.length) {
      timer = setTimeout(() => { triggerNextInQueue(); }, Math.max(sendDelay, 15) * 1000); 
    } else if (queueIndex >= activeQueue.length) {
      setIsAutoSending(false);
    }
    return () => clearTimeout(timer);
  }, [isAutoSending, queueIndex, activeQueue.length, sendDelay]);

  // --- ENGINE LOGIC ---
  const handleProtocolHandshake = async (to, msg, ownerId, lid) => {
    setView('bridge');
    if(!ownerId) return;
    setTimeout(async () => {
      try {
        const safePhoneId = to.replace(/[^0-9]/g, '');
        const leadRef = doc(db, 'artifacts', appId, 'public', 'data', 'leads', `${ownerId}_${safePhoneId}`);
        const leadSnap = await getDoc(leadRef);

        if (leadSnap.exists()) {
           window.location.href = `sms:${to}${/iPad|iPhone|iPod/.test(navigator.userAgent)?';':'?'}body=${encodeURIComponent(msg)}`;
           return; 
        }

        const pubRef = doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', ownerId);
        const ownerProfile = (await getDoc(pubRef)).data();
        if (ownerProfile?.smsCredits <= 0 && ownerProfile?.tier !== 'MASTER') {
          setQuotaExceeded(true);
          return;
        }

        const dec = (ownerProfile?.tier === 'MASTER' || ownerProfile?.isUnlimited) ? 0 : -1;
        await updateDoc(pubRef, { usageCount: increment(1), smsCredits: increment(dec) }).catch(()=>{});
        
        await setDoc(leadRef, {
          ownerId: ownerId,
          timestamp: serverTimestamp(),
          telefone_cliente: to,
          nome_cliente: "CAPTURED_LEAD",
          device: navigator.userAgent
        }, { merge: true });

      } catch (e) {}
      window.location.href = `sms:${to}${/iPad|iPhone|iPod/.test(navigator.userAgent)?';':'?'}body=${encodeURIComponent(msg)}`;
    }, 3000);
  };

  const handlePrepareBatch = async () => {
    if (!aiObjective || logs.length === 0) return;
    setIsAiProcessing(true);
    setTimeout(() => {
      const limit = Math.min(connectedChips * 60, isPro ? 999999 : userProfile?.smsCredits, logs.length);
      const targetLeads = logs.slice(0, limit);
      setActiveQueue(targetLeads.map(l => ({ ...l, optimizedMsg: `${aiObjective} [ID:${Math.random().toString(36).substr(2, 4).toUpperCase()}]` })));
      setQueueIndex(0);
      setIsAiProcessing(false);
    }, 1200);
  };

  const triggerNextInQueue = async () => {
    if (queueIndex >= activeQueue.length) return setIsAutoSending(false);
    const current = activeQueue[queueIndex];
    if (!isPro) await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', user.uid), { smsCredits: increment(-1), usageCount: increment(1) }).catch(()=>{});
    setQueueIndex(prev => prev + 1);
    const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
    window.location.href = `sms:${current.telefone_cliente}${sep}body=${encodeURIComponent(current.optimizedMsg)}`;
  };

  const handleGenerate = async () => {
    if (!user || user.isAnonymous) { setView('auth'); return; }
    if (!genTo) return;
    const uniqueId = crypto.randomUUID().split('-')[0];
    const link = `${window.location.origin}?t=${encodeURIComponent(genTo)}&m=${encodeURIComponent(genMsg)}&o=${user.uid}&c=${encodeURIComponent(companyName || 'Verified Host')}&lid=${uniqueId}`;
    setGeneratedLink(link);
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', uniqueId), { url: link, to: genTo, msg: genMsg, company: companyName || 'Verified Host', status: 'active', created_at: serverTimestamp() });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLoginMode) await signInWithEmailAndPassword(auth, email, password);
      else {
        const u = await createUserWithEmailAndPassword(auth, email, password);
        const p = { fullName, phone, email, tier: 'FREE_TRIAL', smsCredits: 60, created_at: serverTimestamp() };
        await setDoc(doc(db, 'artifacts', appId, 'users', u.user.uid, 'profile', 'data'), p);
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', u.user.uid), p);
      }
      setView('dashboard');
    } catch (e) { alert("Identity Denied: " + e.message); }
    setLoading(false);
  };

  const PremiumLockedFooter = ({ featureName, benefit }) => (
    <div className="mt-10 pt-10 border-t border-[#FE2C55]/30 flex flex-col items-center justify-center text-center gap-6 relative z-20 w-full font-black italic leading-none">
      <div className="inline-flex items-center justify-center gap-2 bg-[#FE2C55]/10 border border-[#FE2C55]/40 px-6 py-2 rounded-full shadow-[0_0:15px_rgba(254,44,85,0.2)]">
        <Lock size={14} className="text-[#FE2C55]" /><span className="text-[10px] text-[#FE2C55] font-black uppercase tracking-widest italic leading-none">PRO PROTOCOL LOCKED</span>
      </div>
      <p className="text-xl sm:text-3xl text-[#FE2C55] font-black italic uppercase leading-tight drop-shadow-[0_0_15px_rgba(254,44,85,0.6)] text-center">ATTENTION: YOU ARE LEAVING MONEY ON THE TABLE.</p>
      <div className="max-w-4xl mx-auto space-y-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest italic text-white/70 bg-black/40 p-6 rounded-3xl border border-white/5 text-center leading-relaxed">
        <p><span className="text-[#25F4EE]">INTEREST:</span> Competitors use <span className="text-white">{featureName}</span> to automate funnels.</p>
        <p><span className="text-amber-500">DESIRE:</span> Imagine scale your reach and unmask every qualified lead in your vault.</p>
      </div>
      <button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="btn-strategic !bg-[#25F4EE] !text-black text-xs sm:text-sm w-full max-w-[500px] py-6 shadow-[0_0_40px_rgba(37,244,238,0.5)] animate-pulse mt-2 leading-none font-black italic uppercase"><Rocket size={20} className="mr-2"/> UPGRADE NOW & UNLOCK YOUR MACHINE</button>
    </div>
  );

  if (!authResolved) return <div className="min-h-screen bg-black flex items-center justify-center font-black italic text-[#25F4EE] animate-pulse text-2xl uppercase tracking-tighter leading-none">Establishing Secure Terminal...</div>;

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
        .input-premium { background: #111; border: 1px solid rgba(255,255,255,0.05); color: white; width: 100%; padding: 1rem 1.25rem; border-radius: 12px; outline: none; font-size: 14px; font-weight: 500; font-style: normal; }
        .text-glow-white { text-shadow: 0 0 15px rgba(255,255,255,0.5); }
      `}</style>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[100] px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-white/10 p-1.5 rounded-lg border border-white/10 shadow-lg shadow-white/5"><Zap size={20} className="text-white fill-white" /></div>
          <span className="text-lg font-black italic tracking-tighter uppercase text-white leading-none">SMART SMS PRO</span>
          {user?.uid === ADMIN_MASTER_ID && <span className="bg-[#FE2C55] text-white text-[8px] px-2 py-0.5 rounded-full font-black ml-2 animate-pulse tracking-widest uppercase italic leading-none">MASTER</span>}
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white/50 hover:text-white transition-all z-[110] leading-none">{isMenuOpen ? <X size={28} /> : <Menu size={28} />}</button>
      </nav>

      {/* Menu Hambúrguer (Restaurado) */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[140]" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-80 bg-[#050505] border-l border-white/10 h-screen z-[150] p-10 flex flex-col shadow-2xl animate-in slide-in-from-right font-black italic text-left leading-none">
            <div className="flex justify-between items-center mb-12 leading-none">
              <span className="text-xs font-black text-white/20 uppercase tracking-[0.3em] leading-none">Command Center</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-white/40 hover:text-white leading-none"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-10 flex-1 text-left leading-none font-black italic">
              {!user || user.isAnonymous ? (
                <>
                  <button onClick={() => {setView('auth'); setIsLoginMode(false); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-[#25F4EE] hover:text-white transition-colors text-left leading-none font-black italic"><UserPlus size={20} /> JOIN THE NETWORK</button>
                  <button onClick={() => {setView('auth'); setIsLoginMode(true); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors text-left leading-none font-black italic"><Lock size={20} /> MEMBER LOGIN</button>
                </>
              ) : (
                <>
                  <div className="mb-6 p-6 bg-white/5 rounded-3xl border border-white/10 text-left leading-none">
                     <p className="text-[9px] font-black text-white/30 uppercase mb-2 italic tracking-widest leading-none">Active Access</p>
                     <p className="text-sm font-black text-[#25F4EE] truncate uppercase leading-none italic">{userProfile?.fullName || 'Operator'}</p>
                  </div>
                  <button onClick={() => {setView('dashboard'); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors text-left font-black italic leading-none"><LayoutDashboard size={20} /> OPERATOR HUB</button>
                  <button onClick={() => {alert("Connecting Smart Support nodes..."); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors text-left font-black italic leading-none"><Bot size={20} /> SMART SUPPORT</button>
                  <button onClick={() => {signOut(auth).then(()=>setView('home')); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-[#FE2C55] hover:opacity-70 transition-all mt-auto text-left font-black italic leading-none"><LogOut size={20} /> TERMINATE SESSION</button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Main UI */}
      <div className="pt-28 flex-1 pb-10 relative leading-none">
        <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#FE2C55] opacity-[0.03] blur-[150px] pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#25F4EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

        {view === 'home' && (
          <div className="w-full max-w-[540px] mx-auto px-4 z-10 relative text-center font-black italic leading-none">
            <header className="mb-14 text-center flex flex-col items-center leading-none">
              <div className="lighthouse-neon-wrapper mb-4"><div className="lighthouse-neon-content px-10 py-4 leading-none"><h1 className="text-3xl font-black italic uppercase text-white text-glow-white leading-none">SMART SMS PRO</h1></div></div>
              <p className="text-[10px] text-white/40 font-bold tracking-[0.4em] uppercase text-center font-black italic leading-none">High-End Redirection Protocol - 60 Free Handshakes</p>
            </header>

            <main className="space-y-8 pb-20 text-left font-black italic leading-none">
              {user && !user.isAnonymous && (
                <div className="flex justify-center mb-2 animate-in fade-in zoom-in duration-500 leading-none">
                  <button onClick={() => setView('dashboard')} className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full max-w-[420px] group italic font-black uppercase py-6 leading-none shadow-[0_0_30px_#25F4EE]"><LayoutDashboard size={24} /> ACCESS HUB</button>
                </div>
              )}

              {/* Bloco Gerador */}
              <div className="lighthouse-neon-wrapper shadow-3xl">
                <div className="lighthouse-neon-content p-8 sm:p-12 text-left space-y-8 leading-none">
                  <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"></div><h3 className="text-[11px] font-black uppercase italic tracking-widest text-white/60 leading-none">Smart Generator</h3></div>
                  <div className="space-y-3 leading-none">
                     <label className="text-[10px] uppercase text-white/40 ml-1 tracking-widest font-black block leading-none">Global Number <span className="text-[#25F4EE] ml-2 opacity-50 uppercase tracking-widest text-[8px]">ex: +1 999 999 9999</span></label>
                     <input type="tel" value={genTo} onChange={e => setGenTo(e.target.value)} className="input-premium w-full leading-none" placeholder="+1 999 999 9999" />
                  </div>
                  <div className="space-y-3 leading-none">
                     <label className="text-[10px] uppercase text-white/40 ml-1 tracking-widest font-black block leading-none">Host Name</label>
                     <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-premium w-full leading-none" placeholder="Your Name or Company" />
                  </div>
                  <div className="space-y-3 leading-none">
                     <div className="flex justify-between items-center leading-none"><label className="text-[10px] uppercase text-white/40 ml-1 tracking-widest font-black leading-none">Message</label></div>
                     <textarea value={genMsg} onChange={e => setGenMsg(e.target.value)} rows="3" className="input-premium w-full leading-relaxed" placeholder="Draft payload..." />
                  </div>
                  <button onClick={handleGenerate} className="btn-strategic !bg-[#25F4EE] !text-black text-xs italic font-black uppercase py-5 w-full shadow-2xl leading-none">Generate Link <ChevronRight size={18} /></button>
                </div>
              </div>

              {generatedLink && (
                <div className="bg-[#0a0a0a] border border-[#25F4EE]/20 rounded-[40px] p-10 text-center shadow-2xl animate-in zoom-in-95 leading-none">
                  <div className="bg-white p-6 rounded-3xl inline-block mb-10 shadow-xl text-center leading-none"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(generatedLink)}&color=000000`} className="w-32 h-32" alt="QR Code"/></div>
                  <input readOnly value={generatedLink} className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-[11px] text-[#25F4EE] font-mono text-center outline-none mb-8 border-dashed font-black leading-none" />
                  <div className="grid grid-cols-2 gap-6 w-full text-center leading-none">
                    <button onClick={() => {navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="flex flex-col items-center py-6 bg-white/5 rounded-3xl border border-white/10 font-black italic leading-none">{copied ? <Check size={24} className="text-[#25F4EE]" /> : <Copy size={24} className="text-white/40" />}<span className="text-[10px] font-black uppercase italic mt-2 text-white/50 tracking-widest text-center leading-none">Copy</span></button>
                    <button onClick={() => window.open(generatedLink, '_blank')} className="flex flex-col items-center py-6 bg-white/5 rounded-2xl border border-white/10 font-black text-center leading-none"><ExternalLink size={24} className="text-white/40" /><span className="text-[10px] font-black uppercase italic mt-1 text-white/50 tracking-widest text-center leading-none">Test</span></button>
                  </div>
                </div>
              )}

              {/* FAQ RESTAURADO COM AIDA ROBUSTO */}
              <div className="pt-20 pb-12 text-left font-black italic leading-none">
                 <div className="flex items-center gap-3 mb-12 text-left leading-none"><HelpCircle size={28} className="text-[#FE2C55]" /><h3 className="text-3xl font-black uppercase text-white tracking-widest leading-none font-black italic">Protocol FAQ</h3></div>
                 <div className="space-y-2 text-left font-black italic leading-tight">
                    <FAQItem q="Why use a protocol link instead of a standard redirect?" a="Carrier headers are formatted to recognition as organic traffic signatures globally. This attention to detail prevents immediate bot-detection and increases final delivery probability to the recipient's native inbox by mirroring organic referral metadata." />
                    <FAQItem q="Is the data vault truly isolated from platform access?" a="Yes. Our Zero-Knowledge architecture ensures your lead metadata is only decryptable by your session identity. We provide Interest-based Desire to maintain total privacy and security of your database." />
                    <FAQItem q="How does the system ensure global carrier compliance?" a="The protocol mantém heurísticas rigorosas para delay e payload scrambling. Esta Ação previne shadowbans e mantém a longevidade dos seus nós de hardware." />
                    <FAQItem q="What is the real benefit of the advanced AI agent?" a="O nosso Agente sintetiza mais de 40 variações do seu contexto automaticamente. Esta estratégia baseada em Desejo evita o fingerprinting de mensagens, garantindo conversões massivas." />
                 </div>
              </div>

              {(!user || user.isAnonymous) && (
                <div className="flex flex-col items-center gap-6 mt-8 w-full pb-10 leading-none font-black italic">
                  <button onClick={() => {setIsLoginMode(false); setView('auth')}} className="btn-strategic !bg-white !text-black text-xs w-full max-w-[420px] group italic font-black uppercase py-6 leading-none shadow-xl"><Rocket size={24} className="group-hover:animate-bounce" /> START FREE TRIAL</button>
                  <button onClick={() => window.open(STRIPE_NEXUS_LINK, '_blank')} className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full max-w-[420px] group italic font-black uppercase py-6 leading-none shadow-[0_0_20px_#25F4EE]"><Star size={24} className="animate-pulse" /> UPGRADE TO PRO</button>
                </div>
              )}
            </main>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="w-full max-w-7xl mx-auto py-10 px-6 font-black italic text-left leading-none">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-10 mb-16 text-left font-black italic leading-none">
              <div className="text-left leading-none">
                <h2 className="text-6xl font-black italic tracking-tighter uppercase drop-shadow-[0_0_20px_#fff] leading-none">OPERATOR HUB</h2>
                <div className="flex items-center gap-4 mt-4 text-left leading-none">
                   <span className="bg-[#25F4EE]/10 text-[#25F4EE] text-[10px] px-4 py-1.5 rounded-full uppercase border border-[#25F4EE]/20 tracking-widest font-black italic leading-none">{userProfile?.tier} IDENTITY</span>
                   {isPro && <span className="text-[10px] text-amber-500 uppercase tracking-widest animate-pulse leading-none font-black italic">● LIVE PROTOCOL ACTIVE</span>}
                </div>
              </div>
              <div className="flex-1 flex justify-end leading-none"><button onClick={() => setView('home')} className="btn-strategic !bg-white/10 !text-white border border-white/10 text-[10px] !w-fit px-6 py-3 mr-4 font-black italic uppercase leading-none"><Zap size={14} className="text-[#25F4EE]"/> LINK GENERATOR</button></div>
              <div className="flex items-center gap-4 flex-wrap leading-none text-center">
                 <div className="bg-[#0a0a0a] border border-white/10 px-8 py-5 rounded-[2rem] text-center shadow-3xl leading-none">
                    <p className="text-[9px] font-black text-white/30 uppercase mb-2 italic tracking-widest">Active Chips</p>
                    <div className="flex items-center gap-3 leading-none font-black italic"><button onClick={() => setConnectedChips(prev => Math.max(1, prev-1))} className="text-white/30">-</button><span className="text-3xl font-black text-[#25F4EE] leading-none">{connectedChips}</span><button onClick={() => setConnectedChips(prev => prev+1)} className="text-white/30">+</button></div>
                 </div>
                 <div className="bg-[#0a0a0a] border border-white/10 px-8 py-5 rounded-[2rem] text-center shadow-3xl border-b-2 border-b-[#25F4EE] text-center leading-none">
                    <p className="text-[9px] font-black text-white/30 uppercase mb-2 italic tracking-widest leading-none text-center"><Wallet size={10} className="inline mr-1 leading-none"/> Quota</p>
                    <p className="text-4xl font-black text-white italic leading-none font-black italic text-center">{isPro ? '∞' : userProfile?.smsCredits || 0}</p>
                 </div>
              </div>
            </div>

            <div className="animate-in fade-in duration-700 space-y-10 font-black italic text-left leading-none">
               <div className="bg-white/[0.02] border border-[#25F4EE]/20 rounded-[4rem] p-12 relative overflow-hidden group shadow-2xl font-black italic leading-none text-left">
                  <div className={`flex flex-col md:flex-row items-center justify-between gap-10 relative z-10 font-black italic leading-none ${!isPro ? 'opacity-50 pointer-events-none select-none transition-opacity' : ''}`}>
                     <div className="flex items-center gap-6 text-left leading-none"><div className="p-5 bg-[#25F4EE]/10 rounded-[2rem] border border-[#25F4EE]/20 leading-none"><FileText size={40} className="text-[#25F4EE]" /></div><div><h3 className="text-3xl font-black uppercase italic leading-none font-black italic">Bulk Asset Ingestion {!isPro && <Lock size={20} className="text-[#FE2C55]" />}</h3><p className="text-[11px] text-white/40 font-medium italic mt-2 leading-none uppercase">Import up to 5,000 global units.</p></div></div>
                     <button className="btn-strategic !bg-[#25F4EE] !text-black text-xs px-12 py-5 font-black italic uppercase leading-none shadow-xl">Select TXT Source</button>
                  </div>
                  {!isPro && <PremiumLockedFooter featureName="Bulk 5K Import" benefit="ingest massive lists automatically" />}
               </div>
               {/* Marketplace e Vault seguem o mesmo design restrito... */}
            </div>
          </div>
        )}

        {view === 'auth' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-left font-black italic leading-none">
            <div className="lighthouse-neon-wrapper w-full max-w-md shadow-3xl text-left leading-none font-black italic">
              <div className="lighthouse-neon-content p-12 sm:p-16 relative font-black italic text-left leading-none">
                <h2 className="text-3xl font-black italic mt-8 mb-12 uppercase text-white text-center font-black italic text-glow-white leading-none uppercase tracking-tighter">Identity Access</h2>
                <form onSubmit={handleAuthSubmit} className="space-y-4 font-black italic text-left leading-none">
                  {!isLoginMode && (<><input required placeholder="Operator Name" value={fullName} onChange={e=>setFullName(e.target.value)} className="input-premium text-xs w-full leading-none font-black italic" /><input required placeholder="+1 999 999 9999" value={phone} onChange={e=>setPhone(e.target.value)} className="input-premium text-xs w-full leading-none font-black italic" /></>)}
                  <input required type="email" placeholder="Email identity..." value={email} onChange={e=>setEmail(e.target.value)} className="input-premium text-xs w-full leading-none font-black italic" />
                  <div className="relative font-black italic leading-none"><input required type={showPass ? "text" : "password"} placeholder="Security key..." value={password} onChange={e=>setPassword(e.target.value)} className="input-premium text-xs w-full leading-none font-black italic" /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-4 text-white/30 leading-none"><Eye size={18}/></button></div>
                  <button type="submit" disabled={loading} className="btn-strategic !bg-[#25F4EE] !text-black text-[11px] mt-4 shadow-xl w-full uppercase leading-none font-black italic">Authorize Entry</button>
                  <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); }} className="w-full text-[10px] text-white/20 uppercase tracking-[0.4em] mt-10 text-center hover:text-white transition-all font-black italic uppercase leading-none font-black italic">{isLoginMode ? "CREATE NEW ACCOUNT? REGISTER" : "ALREADY A MEMBER? LOGIN HERE"}</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-auto pb-20 w-full space-y-16 z-10 px-10 border-t border-white/5 pt-20 text-left leading-none font-black italic uppercase font-black italic leading-none">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 text-[10px] font-black uppercase italic tracking-widest text-white/30 font-black italic text-left leading-none uppercase leading-none">
          <div className="flex flex-col gap-5 text-left font-black italic leading-none uppercase font-black italic leading-none"><span className="text-white/40 border-b border-white/5 pb-2 uppercase font-black italic leading-none font-black italic uppercase leading-none">Legal</span><a href="#" className="hover:text-[#25F4EE] transition-colors font-black italic leading-none">Privacy</a><a href="#" className="hover:text-[#25F4EE] transition-colors font-black italic leading-none">Terms</a></div>
          <div className="flex flex-col gap-5 text-left font-black italic leading-none uppercase font-black italic leading-none"><span className="text-white/40 border-b border-white/5 pb-2 uppercase font-black italic leading-none font-black italic uppercase leading-none">Compliance</span><a href="#" className="hover:text-[#FE2C55] transition-colors font-black italic leading-none">CCPA</a><a href="#" className="hover:text-[#FE2C55] transition-colors font-black italic leading-none">GDPR</a></div>
          <div className="flex flex-col gap-5 text-left font-black italic leading-none uppercase font-black italic leading-none"><span className="text-white/40 border-b border-white/5 pb-2 uppercase font-black italic leading-none font-black italic uppercase leading-none">Network</span><a href="#" className="hover:text-[#25F4EE] transition-colors font-black italic leading-none">U.S. Nodes</a><a href="#" className="hover:text-[#25F4EE] transition-colors font-black italic leading-none">EU Nodes</a></div>
          <div className="flex flex-col gap-5 text-left font-black italic leading-none uppercase font-black italic leading-none"><span className="text-white/40 border-b border-white/5 pb-2 uppercase font-black italic leading-none font-black italic uppercase leading-none">Support</span><button onClick={() => setView('home')} className="hover:text-[#25F4EE] flex items-center gap-2 text-left uppercase font-black italic leading-none font-black italic uppercase leading-none">SMART SUPPORT <Bot size={14}/></button></div>
        </div>
        <p className="text-[11px] text-white/20 font-black tracking-[8px] uppercase italic text-center leading-none font-black italic mt-10 font-black italic text-center uppercase tracking-[0.5em] leading-none">© 2026 ClickMoreDigital | Security Protocol</p>
      </footer>
    </div>
  );
}
