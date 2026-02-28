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
  ShoppingCart, Wallet, AlertTriangle, Trash, Edit, Scale as ScaleIcon
} from 'lucide-react';

// --- SECURE FIREBASE CONFIGURATION ---
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
const ADMIN_MASTER_ID = "YGepVHHMYaN9sC3jFmTyry0mYZO2"; // <--- ALEX, INSERT YOUR UID HERE

const STRIPE_NEXUS_LINK = "https://buy.stripe.com/nexus_access"; 
const STRIPE_EXPERT_LINK = "https://buy.stripe.com/expert_agent";

// --- FAQ COMPONENT (SOPHISTICATED ELITE COPY) ---
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 py-8 group cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex justify-between items-center gap-6 text-left leading-none">
        <h4 className="text-[11px] sm:text-xs font-black uppercase italic tracking-widest text-white/70 group-hover:text-[#25F4EE] transition-colors leading-tight">{q}</h4>
        {open ? <ChevronUp size={18} className="text-[#25F4EE]" /> : <ChevronDown size={18} className="text-white/20" />}
      </div>
      {open && <p className="mt-5 text-xs text-white/40 leading-relaxed font-medium animate-in slide-in-from-top-2 text-left italic tracking-wide uppercase">{a}</p>}
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]); 
  const [myLinks, setMyLinks] = useState([]); 
  const [isVaultActive, setIsVaultActive] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [captureData, setCaptureData] = useState(null);
  const [captureForm, setCaptureForm] = useState({ name: '', phone: '' });
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSmartSupport, setShowSmartSupport] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  
  // AI & Automation
  const [aiObjective, setAiObjective] = useState('');
  const [aiWarning, setAiWarning] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
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

  // 1. FIREBASE AUTH BOOTSTRAP (Zero-latency loading)
  useEffect(() => {
    const initAuth = async () => {
      try { if (!auth.currentUser) signInAnonymously(auth).catch(()=>{}); } catch (e) {}
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
            const p = { fullName: u.email || 'Operator', phone: '', email: u.email || '', tier: isM ? 'MASTER' : 'FREE_TRIAL', usageCount: 0, isSubscribed: false, isUnlimited: isM, smsCredits: isM ? 999999 : 60, connectedChips: 1, created_at: serverTimestamp() };
            await setDoc(docRef, p);
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', u.uid), p);
            setUserProfile(p);
          }
        } catch (e) {}
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. REDIRECTION & COMPLIANCE GATE (Lead Capture)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lid = params.get('lid'), t = params.get('t'), m = params.get('m'), o = params.get('o');
    if (t && m && view !== 'bridge' && view !== 'capture') {
      setCaptureData({ to: t, msg: m, company: params.get('c') || 'Verified Host', ownerId: o });
      setView('capture'); // Redireciona para o Security Gate primeiro
    }
  }, [view]);

  // 3. MASTER DATA BRIDGE
  useEffect(() => {
    if (!user || user.isAnonymous || view !== 'dashboard') return;
    let unsubLeads, unsubLinks, unsubProfile;
    try {
      unsubProfile = onSnapshot(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data'), (docSnap) => {
        if (docSnap.exists()) setUserProfile(docSnap.data());
      });

      unsubLinks = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'links'), (snap) => {
        setMyLinks(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0)));
      });

      unsubLeads = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), (snap) => {
        const allData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const myData = user.uid === ADMIN_MASTER_ID ? allData : allData.filter(l => l.ownerId === user.uid);
        setLogs(myData.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
      });
    } catch(e) {}
    return () => { if(unsubLeads) unsubLeads(); if(unsubLinks) unsubLinks(); if(unsubProfile) unsubProfile(); };
  }, [user, view, isVaultActive]);

  // 4. NATIVE AUTOPILOT ENGINE (Min 20s, Default 30s)
  useEffect(() => {
    let timer;
    if (isAutoSending && queueIndex < activeQueue.length) {
      timer = setTimeout(() => { triggerNextInQueue(); }, Math.max(sendDelay, 20) * 1000); 
    } else if (queueIndex >= activeQueue.length) {
      setIsAutoSending(false);
    }
    return () => clearTimeout(timer);
  }, [isAutoSending, queueIndex, activeQueue.length, sendDelay]);

  // --- ZERO TOLERANCE AI SCANNER ---
  const validateAIContent = (text) => {
    const forbiddenPatterns = /(hack|scam|fraud|phishing|hate|racis|kill|murder|nazi|porn|xxx|casino|ponzi|fake\s*news|defamation|malware|virus|http|www|\.com|bit\.ly|golpe|ódio|ofensiv)/i;
    if (forbiddenPatterns.test(text)) {
      setAiWarning("SECURITY ALERT: Zero Tolerance Policy Violation. Unacceptable content detected. Revise payload to comply with global regulations.");
      return false;
    }
    setAiWarning('');
    return true;
  };

  // --- ENGINE LOGIC ---
  const handleProtocolHandshake = async (to, msg, ownerId, form) => {
    setView('bridge');
    if(!ownerId) return;
    setTimeout(async () => {
      try {
        const safePhoneId = form.phone.replace(/[^0-9]/g, '');
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
          created_at: serverTimestamp(),
          telefone_cliente: form.phone,
          nome_cliente: form.name,
          device: navigator.userAgent
        }, { merge: true });

      } catch (e) {}
      window.location.href = `sms:${to}${/iPad|iPhone|iPod/.test(navigator.userAgent)?';':'?'}body=${encodeURIComponent(msg)}`;
    }, 2000);
  };

  const handlePrepareBatch = async () => {
    if (!aiObjective || logs.length === 0 || aiWarning) return;
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
    if (!isPro) {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', user.uid), { smsCredits: increment(-1), usageCount: increment(1) }).catch(()=>{});
    }
    setQueueIndex(prev => prev + 1);
    const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
    window.location.href = `sms:${current.telefone_cliente}${sep}body=${encodeURIComponent(current.optimizedMsg)}`;
  };

  const handleGenerate = async () => {
    if (!user || user.isAnonymous) { setIsLoginMode(false); setView('auth'); return; }
    if (!genTo) return;
    setLoading(true);
    const uniqueId = crypto.randomUUID().split('-')[0];
    const link = `${window.location.origin}?t=${encodeURIComponent(genTo)}&m=${encodeURIComponent(genMsg)}&o=${user.uid}&c=${encodeURIComponent(companyName || 'Verified Host')}&lid=${uniqueId}`;
    setGeneratedLink(link);
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', uniqueId), { url: link, to: genTo, msg: genMsg, company: companyName || 'Verified Host', status: 'active', created_at: serverTimestamp() });
    setLoading(false);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLoginMode) await signInWithEmailAndPassword(auth, email, password);
      else {
        const u = await createUserWithEmailAndPassword(auth, email, password);
        const isMaster = u.user.uid === ADMIN_MASTER_ID;
        const p = { fullName, phone, email, tier: isMaster ? 'MASTER' : 'FREE_TRIAL', smsCredits: isMaster ? 999999 : 60, created_at: serverTimestamp() };
        await setDoc(doc(db, 'artifacts', appId, 'users', u.user.uid, 'profile', 'data'), p);
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', u.user.uid), p);
      }
      setView('dashboard');
    } catch (e) { alert("Identity Denied: " + e.message); }
    setLoading(false);
  };

  const PremiumLockedFooter = ({ featureName, benefit }) => (
    <div className="mt-10 pt-10 border-t border-[#FE2C55]/30 flex flex-col items-center justify-center text-center gap-6 relative z-20 w-full font-black italic leading-none">
      <div className="inline-flex items-center justify-center gap-2 bg-[#FE2C55]/10 border border-[#FE2C55]/40 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(254,44,85,0.2)]">
        <Lock size={14} className="text-[#FE2C55]" /><span className="text-[10px] text-[#FE2C55] font-black uppercase tracking-widest italic leading-none">PRO PROTOCOL LOCKED</span>
      </div>
      <p className="text-xl sm:text-3xl text-[#FE2C55] font-black italic uppercase leading-tight drop-shadow-[0_0_15px_rgba(254,44,85,0.6)] text-center">ATTENTION: YOU ARE LEAVING MONEY ON THE TABLE.</p>
      <div className="max-w-4xl mx-auto space-y-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest italic text-white/70 bg-black/40 p-6 rounded-3xl border border-white/5 text-center leading-relaxed">
        <p><span className="text-[#25F4EE]">INTEREST:</span> Top tier organizations integrate <span className="text-white">{featureName}</span> to seamlessly {benefit}.</p>
        <p><span className="text-amber-500">DESIRE:</span> Eliminate operational friction, scale your global reach, and extract unprecedented value from your encrypted vault.</p>
      </div>
      <button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="btn-strategic !bg-[#25F4EE] !text-black text-xs sm:text-sm w-full max-w-[500px] py-6 shadow-[0_0_40px_rgba(37,244,238,0.5)] animate-pulse mt-2 leading-none font-black italic uppercase"><Rocket size={20} className="mr-2"/> SECURE YOUR ELITE LICENSE</button>
    </div>
  );

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
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #25F4EE; border-radius: 10px; }
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

      {/* Menu Hambúrguer (Restaurado Total com Suporte e Termos) */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[140]" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-80 bg-[#050505] border-l border-white/10 h-screen z-[150] p-10 flex flex-col shadow-2xl animate-in slide-in-from-right font-black italic text-left leading-none">
            <div className="flex justify-between items-center mb-12">
              <span className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Command Center</span>
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
                  <button onClick={() => {setView('dashboard'); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors text-left font-black italic"><LayoutDashboard size={20} /> OPERATOR HUB</button>
                  <button onClick={() => {signOut(auth).then(()=>setView('home')); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-[#FE2C55] hover:opacity-70 transition-all text-left font-black italic"><LogOut size={20} /> TERMINATE SESSION</button>
                </>
              )}
              
              {/* Menu Divider & Compliance Links */}
              <div className="mt-auto pt-8 border-t border-white/10 flex flex-col gap-6">
                <button onClick={() => {setShowSmartSupport(true); setIsMenuOpen(false)}} className="flex items-center gap-4 text-xs font-black uppercase italic tracking-widest text-[#25F4EE] hover:text-white transition-colors text-left font-black italic"><Bot size={18} /> SMART SUPPORT</button>
                <a href="#" className="flex items-center gap-4 text-[10px] font-black uppercase italic tracking-widest text-white/50 hover:text-white transition-colors text-left font-black italic">TERMS OF USE</a>
                <a href="#" className="flex items-center gap-4 text-[10px] font-black uppercase italic tracking-widest text-white/50 hover:text-white transition-colors text-left font-black italic">PRIVACY POLICY</a>
                <a href="#" className="flex items-center gap-4 text-[10px] font-black uppercase italic tracking-widest text-white/50 hover:text-white transition-colors text-left font-black italic">COMPLIANCE (LGPD/GDPR)</a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main UI */}
      <div className="pt-28 flex-1 pb-10 relative">
        <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#FE2C55] opacity-[0.03] blur-[150px] pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#25F4EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

        {/* --- COMPLIANCE CAPTURE GATE --- */}
        {view === 'capture' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center relative px-8 font-black italic leading-none">
            <div className="lighthouse-neon-wrapper w-full max-w-lg shadow-3xl">
              <div className="lighthouse-neon-content p-12 sm:p-16 flex flex-col items-center">
                <ScaleIcon size={56} className="text-[#25F4EE] mb-8" />
                <h2 className="text-3xl font-black italic mb-4 uppercase tracking-tighter text-white">Compliance Gate</h2>
                <p className="text-[10px] text-white/50 uppercase font-black tracking-widest leading-relaxed mb-8">
                  Global Security & Privacy Protocol. To maintain strict adherence with anti-spam legislation, please verify your identity before accessing the encrypted payload.
                </p>
                <div className="w-full space-y-4 text-left">
                  <input required placeholder="Full Legal Name" value={captureForm.name} onChange={e=>setCaptureForm({...captureForm, name: e.target.value})} className="input-premium text-xs w-full font-medium italic" />
                  <input required type="tel" placeholder="Valid Mobile Number" value={captureForm.phone} onChange={e=>setCaptureForm({...captureForm, phone: e.target.value})} className="input-premium text-xs w-full font-medium italic" />
                  <button onClick={() => {
                    if(!captureForm.name || !captureForm.phone) return alert("All compliance fields are required to proceed.");
                    handleProtocolHandshake(captureData.to, captureData.msg, captureData.ownerId, captureForm);
                  }} className="btn-strategic !bg-[#25F4EE] !text-black text-xs italic font-black uppercase py-4 w-full shadow-2xl mt-4">Secure Proceed <ChevronRight size={16}/></button>
                </div>
                <div className="flex items-center gap-2 mt-8 opacity-50">
                   <ShieldCheck size={14} className="text-[#25F4EE]"/> <span className="text-[8px] uppercase tracking-widest text-[#25F4EE]">Zero-Knowledge Environment</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'home' && (
          <div className="w-full max-w-[540px] mx-auto px-4 z-10 relative text-center font-black italic leading-none">
            <header className="mb-14 text-center flex flex-col items-center leading-none">
              <div className="lighthouse-neon-wrapper mb-4"><div className="lighthouse-neon-content px-10 py-4 leading-none"><h1 className="text-3xl font-black italic uppercase text-white text-glow-white leading-none">SMART SMS PRO</h1></div></div>
              <p className="text-[10px] text-white/40 font-bold tracking-[0.4em] uppercase text-center font-black italic leading-none">High-End Redirection Protocol - 60 Free Handshakes</p>
            </header>

            <main className="space-y-8 pb-20 text-left font-black italic leading-none">
              {user && !user.isAnonymous && (
                <div className="flex justify-center mb-2 animate-in fade-in zoom-in duration-500 leading-none">
                  <button onClick={() => setView('dashboard')} className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full max-w-[420px] group italic font-black uppercase py-6 leading-none shadow-[0_0_30px_#25F4EE]"><LayoutDashboard size={24} /> ACCESS OPERATOR HUB</button>
                </div>
              )}

              {/* Bloco Gerador */}
              <div className="lighthouse-neon-wrapper shadow-3xl">
                <div className="lighthouse-neon-content p-8 sm:p-12 text-left space-y-8 leading-none">
                  <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"></div><h3 className="text-[11px] font-black uppercase italic tracking-widest text-white/60 leading-none font-black italic uppercase">Smart Handshake Generator</h3></div>
                  <div className="space-y-3 leading-none">
                     <label className="text-[10px] uppercase text-white/40 ml-1 tracking-widest font-black block leading-none italic font-black uppercase">Global Mobile Number <span className="text-[#25F4EE] ml-2 opacity-50 uppercase tracking-widest text-[8px]">ex: +1 999 999 9999</span></label>
                     <input type="tel" value={genTo} onChange={e => setGenTo(e.target.value)} className="input-premium font-bold text-sm w-full leading-none" placeholder="+1 999 999 9999" />
                  </div>
                  <div className="space-y-3 leading-none">
                     <label className="text-[10px] uppercase text-white/40 ml-1 tracking-widest font-black block leading-none italic font-black uppercase">Host / Company Name</label>
                     <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-premium font-bold text-sm text-white/50 w-full leading-none" placeholder="Your Name or Company Name" />
                  </div>
                  <div className="space-y-3 leading-none">
                     <div className="flex justify-between items-center leading-none uppercase"><label className="text-[10px] uppercase text-white/40 ml-1 tracking-widest font-black leading-none italic font-black uppercase">Pre-Written SMS Content</label><span className="text-[9px] text-white/20 font-black italic leading-none">{genMsg.length}/{MSG_LIMIT}</span></div>
                     <textarea value={genMsg} onChange={e => setGenMsg(e.target.value)} rows="3" className="input-premium w-full text-sm font-medium leading-relaxed font-black italic" placeholder="Draft your intelligent SMS message here..." />
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

              {/* FAQ RESTAURADO - AIDA SOFISTICADA E LEGAL */}
              <div className="pt-20 pb-12 text-left font-black italic leading-none uppercase">
                 <div className="flex items-center gap-3 mb-12 text-left leading-none uppercase"><HelpCircle size={28} className="text-[#FE2C55]" /><h3 className="text-3xl font-black uppercase text-white tracking-widest leading-none font-black italic uppercase">Protocol FAQ</h3></div>
                 <div className="space-y-2 text-left font-black italic leading-tight uppercase">
                    <FAQItem q="Why utilize our exclusive protocol instead of standard market routing?" a="Standard routing often triggers automated network heuristics. Our proprietary protocol dynamically formats carrier headers to mirror organic traffic signatures, significantly enhancing final delivery rates while strictly adhering to global communication standards." />
                    <FAQItem q="Is the cryptographic vault fully impenetrable and compliant?" a="Absolutely. Operating under a robust Zero-Knowledge architecture, your lead metadata remains exclusively encrypted within your session context. We maintain rigorous alignment with international data protection protocols (LGPD, GDPR, CCPA), ensuring enterprise-grade privacy for your operations." />
                    <FAQItem q="How does the system ensure long-term sender reputation protection?" a="Our ecosystem employs an intelligent pacing engine that meticulously manages dispatch intervals. This sophisticated infrastructure prevents carrier threshold flags, ensuring sustainable, high-volume operation while maintaining pristine network standing globally." />
                    <FAQItem q="What is the strategic advantage of the Advanced AI Agent?" a="The AI Agent dynamically optimizes payload contexts in real-time. By utilizing advanced linguistic models, it ensures each dispatch maintains a unique, organic fingerprint, maximizing user engagement and conversion potential while operating fully within telecommunication compliance frameworks." />
                 </div>
              </div>

              {(!user || user.isAnonymous) && (
                <div className="flex flex-col items-center gap-6 mt-8 w-full animate-in zoom-in-95 duration-500 pb-10 leading-none font-black italic text-center uppercase">
                  <button onClick={() => {setIsLoginMode(false); setView('auth')}} className="btn-strategic !bg-white !text-black text-xs w-full max-w-[420px] group italic font-black uppercase py-6 leading-none shadow-xl uppercase"><Rocket size={24} className="group-hover:animate-bounce" /> Start 60 Free Handshakes</button>
                  <button onClick={() => window.open(STRIPE_NEXUS_LINK, '_blank')} className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full max-w-[420px] group italic font-black uppercase py-6 leading-none shadow-[0_0_20px_#25F4EE] uppercase"><Star size={24} className="animate-pulse" /> Upgrade to Elite Member</button>
                </div>
              )}
            </main>
          </div>
        )}

        {view === 'bridge' && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center relative px-8 font-black italic leading-none">
            <div className="lighthouse-neon-wrapper w-full max-w-lg shadow-3xl">
              <div className="lighthouse-neon-content p-16 sm:p-24 flex flex-col items-center leading-none">
                {quotaExceeded ? (
                  <div className="animate-in fade-in zoom-in-95 duration-500 text-left w-full leading-none"><ShieldAlert size={100} className="text-[#FE2C55] animate-pulse mb-10 mx-auto leading-none" /><h2 className="text-3xl font-black italic uppercase text-white mb-6 leading-tight text-center">Protocol Limit Reached</h2><div className="p-10 bg-white/[0.03] border border-white/5 rounded-[2.5rem] mb-12 relative overflow-hidden group shadow-2xl text-center leading-none font-black italic"><h3 className="text-2xl font-black italic text-white uppercase mb-4 leading-none">Upgrade Identity</h3><p className="text-[10px] text-white/40 uppercase mb-12 font-black italic leading-relaxed tracking-widest">Upgrade to Nexus level to bypass trial limits and unlock full lead unmasking.</p><button onClick={() => window.open(STRIPE_NEXUS_LINK, '_blank')} className="btn-strategic btn-neon-cyan text-xs italic font-black uppercase py-5 leading-none shadow-2xl">Unlock Full Access</button></div></div>
                ) : (
                  <><Shield size={120} className="text-[#25F4EE] animate-pulse drop-shadow-[0_0_30px_#25F4EE] mb-14" /><h2 className="text-4xl font-black italic uppercase text-white text-center text-glow-white tracking-widest mb-6 leading-none font-black italic">SECURITY HANDSHAKE</h2><div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden my-12 max-w-xs leading-none"><div className="h-full bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] w-full origin-left animate-[progress_3s_linear]"></div></div><p className="text-[12px] text-white/50 uppercase italic font-black tracking-[0.2em] text-center leading-none font-black italic">Authorized Origin: {captureData?.company}</p></>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="w-full max-w-7xl mx-auto py-10 px-6 font-black italic text-left leading-none uppercase">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-10 mb-16 text-left font-black italic leading-none">
              <div className="text-left font-black italic leading-none uppercase">
                <h2 className="text-6xl font-black italic tracking-tighter uppercase drop-shadow-[0_0_20px_#fff] leading-none uppercase">Operator Hub</h2>
                <div className="flex items-center gap-4 mt-4 text-left leading-none font-black italic uppercase">
                   <span className="bg-[#25F4EE]/10 text-[#25F4EE] text-[10px] px-4 py-1.5 rounded-full uppercase border border-[#25F4EE]/20 tracking-widest font-black italic leading-none uppercase">{userProfile?.tier} IDENTITY</span>
                   {isPro && <span className="text-[10px] text-amber-500 uppercase tracking-widest animate-pulse leading-none font-black italic uppercase">● LIVE PROTOCOL ACTIVE</span>}
                </div>
              </div>
              <div className="flex-1 flex justify-end leading-none uppercase"><button onClick={() => setView('home')} className="btn-strategic !bg-white/10 !text-white border border-white/10 text-[10px] !w-fit px-6 py-3 mr-4 font-black italic uppercase leading-none uppercase"><Zap size={14} className="text-[#25F4EE]"/> Link Generator</button></div>
              <div className="flex items-center gap-4 flex-wrap leading-none font-black italic uppercase text-center">
                 <div className="bg-[#0a0a0a] border border-white/10 px-8 py-5 rounded-[2rem] text-center shadow-3xl leading-none uppercase">
                    <p className="text-[9px] font-black text-white/30 uppercase mb-2 italic tracking-widest leading-none uppercase">Active Chips</p>
                    <div className="flex items-center gap-3 leading-none font-black italic uppercase leading-none"><button onClick={() => setConnectedChips(prev => Math.max(1, prev-1))} className="text-white/30 hover:text-white leading-none">-</button><span className="text-3xl font-black text-[#25F4EE] leading-none uppercase">{connectedChips}</span><button onClick={() => setConnectedChips(prev => prev+1)} className="text-white/30 hover:text-white leading-none">+</button></div>
                 </div>
                 <div className="bg-[#0a0a0a] border border-white/10 px-8 py-5 rounded-[2rem] text-center shadow-3xl border-b-2 border-b-[#25F4EE] text-center leading-none uppercase">
                    <p className="text-[9px] font-black text-white/30 uppercase mb-2 italic tracking-widest leading-none uppercase"><Wallet size={10} className="inline mr-1 leading-none"/> Quota</p>
                    <p className="text-4xl font-black text-white italic leading-none font-black italic uppercase leading-none">{isPro ? '∞' : userProfile?.smsCredits || 0}</p>
                 </div>
              </div>
            </div>

            <div className="animate-in fade-in duration-700 space-y-10 font-black italic text-left leading-none uppercase">
               {/* IMPORT 5K */}
               <div className="bg-white/[0.02] border border-[#25F4EE]/20 rounded-[4rem] p-12 relative overflow-hidden group shadow-2xl font-black italic leading-none text-left uppercase">
                  <div className={`flex flex-col md:flex-row items-center justify-between gap-10 relative z-10 font-black italic leading-none uppercase ${!isPro ? 'opacity-50 pointer-events-none select-none transition-opacity' : ''}`}>
                     <div className="flex items-center gap-6 text-left leading-none uppercase font-black italic"><div className="p-5 bg-[#25F4EE]/10 rounded-[2rem] border border-[#25F4EE]/20 leading-none uppercase"><FileText size={40} className="text-[#25F4EE]" /></div><div><h3 className="text-3xl font-black uppercase italic leading-none font-black italic leading-none uppercase">Bulk Asset Ingestion {!isPro && <Lock size={20} className="text-[#FE2C55]" />}</h3><p className="text-[11px] text-white/40 font-medium italic mt-2 leading-none uppercase font-black italic uppercase">Import up to 5,000 global units simultaneously.</p></div></div>
                     <button className="btn-strategic !bg-[#25F4EE] !text-black text-xs px-12 py-5 font-black italic uppercase leading-none shadow-xl uppercase font-black italic uppercase">Select Secure Source</button>
                  </div>
                  {!isPro && <PremiumLockedFooter featureName="Bulk Asset Ingestion" benefit="ingest massive lists automatically into their operational pipeline" />}
               </div>

               {/* AI MODULE & DELAY ENGINE */}
               <div className="lighthouse-neon-wrapper shadow-3xl mb-16 relative rounded-[3.5rem] leading-none uppercase">
                  <div className="lighthouse-neon-content p-8 sm:p-12 text-left rounded-[3.5rem] flex flex-col font-black italic leading-none uppercase">
                     <div className={`${!isPro ? 'opacity-50 pointer-events-none select-none transition-opacity' : ''} leading-none text-left uppercase`}>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10 text-left leading-none font-black italic uppercase leading-none"><div className="flex items-center gap-4 text-left leading-none uppercase"><div className="p-3 bg-[#25F4EE]/10 rounded-2xl border border-[#25F4EE]/20 leading-none uppercase"><BrainCircuit size={32} className="text-[#25F4EE]" /></div><div><h3 className="text-2xl font-black uppercase italic font-black italic leading-none uppercase font-black italic uppercase">AI Agent Command {!isPro && <Lock size={18} className="text-[#FE2C55]" />}</h3><p className="text-[10px] text-white/30 uppercase tracking-widest font-black italic leading-none mt-1 uppercase">Multi-Scrambling Synthesis Protocol</p></div></div></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-left font-black italic leading-none uppercase">
                           <div className="space-y-6 text-left leading-none uppercase font-black italic">
                              <textarea disabled={!isPro} value={aiObjective} onChange={(e) => {setAiObjective(e.target.value); validateAIContent(e.target.value);}} placeholder="Marketing objective (160-300 chars)..." className="input-premium w-full h-[140px] text-sm leading-relaxed font-black italic" />
                              
                              {/* Zero Tolerance Alert */}
                              {aiWarning && (
                                <div className="p-4 bg-[#FE2C55]/10 border border-[#FE2C55]/30 rounded-xl flex items-start gap-3">
                                  <AlertTriangle size={16} className="text-[#FE2C55] shrink-0 mt-0.5"/>
                                  <p className="text-[9px] text-[#FE2C55] font-black uppercase tracking-widest leading-relaxed">{aiWarning}</p>
                                </div>
                              )}

                              {/* Native Delay Selector */}
                              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                                  <span className="text-[10px] text-white/50 uppercase tracking-widest font-black italic">Dispatch Delay Protocol</span>
                                  <div className="flex items-center gap-2">
                                      <input disabled={!isPro} type="number" min="20" value={sendDelay} onChange={(e) => setSendDelay(Math.max(20, Number(e.target.value)))} className="bg-transparent border-b border-[#25F4EE] text-[#25F4EE] font-black w-12 text-center outline-none text-sm" />
                                      <span className="text-[9px] text-[#25F4EE] uppercase tracking-widest">Secs</span>
                                  </div>
                              </div>

                              <button onClick={handlePrepareBatch} disabled={!isPro || logs.length === 0 || !!aiWarning} className="btn-strategic !bg-[#25F4EE] !text-black text-xs py-5 w-full uppercase leading-none font-black italic shadow-2xl uppercase disabled:opacity-50">Synthesize Queue ({logs.length} Units)</button>
                           </div>
                           <div className="bg-black border border-white/5 rounded-[3.5rem] p-10 flex flex-col justify-center items-center text-center shadow-2xl leading-none font-black italic uppercase">{activeQueue.length > 0 ? (<div className="w-full leading-none uppercase"><div className="mb-8 leading-none font-black italic text-center leading-none uppercase font-black"><p className="text-6xl font-black text-[#25F4EE] italic leading-none font-black uppercase">{queueIndex} / {activeQueue.length}</p></div><button onClick={() => setIsAutoSending(!isAutoSending)} className={`w-full py-6 text-black rounded-[2rem] font-black uppercase text-[11px] leading-none uppercase ${isAutoSending ? 'bg-[#FE2C55]' : 'bg-[#25F4EE] animate-pulse shadow-xl'}`}>{isAutoSending ? "STOP AUTOPILOT" : "LAUNCH AUTOPILOT"}</button></div>) : (<div className="opacity-20 text-center leading-none font-black italic uppercase"><ShieldAlert size={80} className="mx-auto mb-6 leading-none uppercase" /><p className="text-sm uppercase italic tracking-[0.5em] font-black italic leading-none uppercase">System Standby</p></div>)}</div>
                        </div>
                     </div>
                     {!isPro && <PremiumLockedFooter featureName="AI Dynamic Scrambling" benefit="bypass carrier algorithmic filters automatically and secure high-volume delivery" />}
                  </div>
               </div>

               {/* MARKETPLACE */}
               <div id="marketplace-section" className="mb-16 mt-10 font-black italic text-left leading-none uppercase">
                  <div className="flex items-center gap-3 mb-10 text-left leading-none font-black italic uppercase leading-none uppercase"><ShoppingCart size={24} className="text-[#FE2C55]" /><h3 className="text-2xl font-black uppercase text-white font-black italic leading-none uppercase leading-none uppercase">Maximize ROI: Upgrade to Elite</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20 text-left font-black italic leading-none font-black italic uppercase">
                    <div className="bg-white/5 border border-[#25F4EE]/30 p-12 rounded-[3.5rem] relative overflow-hidden group shadow-2xl text-left leading-none font-black italic font-black italic uppercase"><div className="absolute top-0 right-0 p-8 opacity-10 leading-none uppercase"><Globe size={100} /></div><h3 className="text-4xl font-black italic text-white uppercase mb-4 text-glow-white leading-none font-black italic uppercase leading-none uppercase">Nexus Access</h3><p className="text-5xl font-black text-white italic mb-12 leading-none font-black italic font-black italic uppercase leading-none">{userProfile?.tier === 'MASTER' ? '∞' : '$9.00'}<span className="text-sm text-white/30 uppercase ml-1 leading-none font-black italic uppercase leading-none uppercase"> {userProfile?.tier === 'MASTER' ? '/ UNLIMITED' : '/ mo'}</span></p><button onClick={() => window.open(STRIPE_NEXUS_LINK, '_blank')} className="btn-strategic !bg-white !text-black text-xs w-full italic font-black py-5 uppercase leading-none font-black italic font-black italic uppercase">UPGRADE TO NEXUS</button></div>
                    <div className="bg-[#25F4EE]/10 border border-[#25F4EE] p-12 rounded-[3.5rem] relative overflow-hidden group shadow-2xl text-left leading-none font-black italic font-black italic uppercase"><div className="absolute top-0 right-0 p-8 text-[#25F4EE] opacity-20 leading-none uppercase"><BrainCircuit size={100} /></div><h3 className="text-4xl font-black italic text-white uppercase mb-4 text-glow-white leading-none font-black italic uppercase leading-none uppercase">Expert Agent</h3><p className="text-5xl font-black text-white italic mb-12 leading-none font-black italic font-black italic uppercase leading-none">{userProfile?.tier === 'MASTER' ? '∞' : '$19.90'}<span className="text-sm text-white/30 uppercase ml-1 leading-none font-black italic uppercase leading-none uppercase"> {userProfile?.tier === 'MASTER' ? '/ UNLIMITED' : '/ mo'}</span></p><button onClick={() => window.open(STRIPE_EXPERT_LINK, '_blank')} className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full italic font-black py-5 uppercase leading-none font-black italic shadow-xl leading-none font-black italic uppercase">ACTIVATE EXPERT AI</button></div>
                 </div>
               </div>

               {/* VAULT */}
               <div className="bg-[#0a0a0a] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-3xl mt-16 font-black italic flex flex-col font-black italic leading-none font-black italic text-left uppercase">
                 <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02] leading-none font-black italic text-left leading-none font-black italic leading-none uppercase"><div className="flex items-center gap-3 text-left leading-none font-black italic leading-none font-black italic leading-none uppercase"><Database size={20} className="text-[#25F4EE]" /><h3 className="text-lg font-black uppercase italic font-black italic leading-none font-black italic leading-none leading-none font-black italic uppercase">Data Vault Explorer</h3></div></div>
                 <div className="min-h-[200px] max-h-[40vh] overflow-y-auto text-left font-black italic leading-none font-black italic uppercase">
                   {logs.length > 0 ? logs.map(l => {const isP = isPro; const mask = (s) => (isP ? s : (s || '').slice(0, 5) + '*****' + (s || '').slice(-2)); return (<div key={l.id} className="p-8 border-b border-white/5 flex justify-between items-center hover:bg-white/[0.02] leading-none font-black italic font-black italic uppercase leading-none"><div><p className="font-black text-xl text-white uppercase italic flex items-center gap-2 font-black italic leading-none font-black italic uppercase leading-none">{isP ? l.nome_cliente : 'PROT*****EAD'}{!isP && <span className="text-[8px] bg-[#FE2C55] text-white px-2 py-0.5 rounded-full uppercase leading-none font-black italic animate-pulse uppercase leading-none">Locked</span>}</p><p className="text-[12px] text-[#25F4EE] font-black leading-none mt-2 font-black italic uppercase tracking-widest uppercase leading-none">{mask(l.telefone_cliente)}</p></div><div className="text-right text-[10px] text-white/30 uppercase font-black italic leading-none font-black italic uppercase tracking-widest leading-none uppercase leading-none"><p>Verified Node</p></div></div>);}) : <div className="p-20 text-center opacity-20 font-black italic text-center leading-none leading-none font-black italic font-black italic uppercase leading-none"><Lock size={48} className="mx-auto mb-4 uppercase leading-none" /><p className="text-[10px] uppercase font-black italic tracking-widest text-center leading-none leading-none uppercase leading-none">Vault Standby</p></div>}
                 </div>
                 {!isPro && logs.length > 0 && (<div className="p-8 bg-[#FE2C55]/5 border-t border-[#FE2C55]/20 flex flex-col items-center justify-center text-center gap-5 mt-auto font-black italic leading-none leading-none font-black italic uppercase leading-none"><p className="text-[11px] text-[#FE2C55] uppercase tracking-widest flex items-center justify-center gap-2 font-black italic leading-none leading-none uppercase font-black italic uppercase leading-none"><Lock size={16} /> VAULT DATA MASKED. UPGRADE TO REVEAL FULL IDENTITIES.</p><button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="btn-strategic !bg-[#FE2C55] !text-white text-[10px] w-full max-w-[300px] py-4 shadow-[0_0_20px_#FE2C55] font-black italic uppercase leading-none font-black italic shadow-xl leading-none font-black italic uppercase leading-none">UNLOCK LEADS NOW</button></div>)}
               </div>
            </div>
          </div>
        )}

        {/* AUTHENTICATION VIEW */}
        {view === 'auth' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-left font-black italic leading-none font-black italic uppercase">
            <div className="lighthouse-neon-wrapper w-full max-w-md shadow-3xl text-left font-black italic leading-none uppercase">
              <div className="lighthouse-neon-content p-12 sm:p-16 relative font-black italic text-left leading-none font-black italic uppercase">
                <h2 className="text-3xl font-black italic mt-8 mb-12 uppercase text-white text-center font-black italic text-glow-white leading-none font-black italic uppercase tracking-tighter leading-none font-black italic font-black italic uppercase">Identity Terminal</h2>
                <form onSubmit={handleAuthSubmit} className="space-y-4 font-black italic text-left leading-none font-black italic font-black italic">
                  {!isLoginMode && (<><input required placeholder="Operator Name" value={fullName} onChange={e=>setFullName(e.target.value)} className="input-premium text-xs w-full font-medium italic" /><input required placeholder="+1 999 999 9999" value={phone} onChange={e=>setPhone(e.target.value)} className="input-premium text-xs w-full font-medium italic" /></>)}
                  <input required type="email" placeholder="Email Identity..." value={email} onChange={e=>setEmail(e.target.value)} className="input-premium text-xs w-full font-medium italic" />
                  <div className="relative font-black italic leading-none font-black italic leading-none font-black italic font-black italic">
                    <input required type={showPass ? "text" : "password"} placeholder="Security Key..." value={password} onChange={e=>setPassword(e.target.value)} className="input-premium text-xs w-full font-medium italic" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-4 text-white/30 leading-none font-black italic font-black italic font-black italic"><Eye size={18}/></button>
                  </div>
                  <button type="submit" disabled={loading} className="btn-strategic !bg-[#25F4EE] !text-black text-[11px] mt-4 shadow-xl w-full uppercase leading-none font-black italic tracking-widest leading-none font-black italic font-black italic uppercase">Authorize Entry</button>
                  <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); }} className="w-full text-[10px] text-white/20 uppercase tracking-[0.4em] mt-10 text-center hover:text-white transition-all font-black italic uppercase leading-none font-black italic leading-none font-black italic font-black italic uppercase">{isLoginMode ? "CREATE NEW ACCOUNT? REGISTER" : "ALREADY A MEMBER? LOGIN HERE"}</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ESTRATÉGICO RESTAURADO TOTAL */}
      <footer className="mt-auto pb-20 w-full space-y-16 z-10 px-10 border-t border-white/5 pt-20 text-left leading-none font-black italic uppercase font-black italic leading-none font-black italic uppercase">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 text-[10px] font-black uppercase italic tracking-widest text-white/30 font-black italic text-left leading-none uppercase leading-none font-black italic font-black italic uppercase">
          <div className="flex flex-col gap-5 text-left font-black italic leading-none uppercase font-black italic leading-none leading-none font-black italic font-black italic uppercase"><span className="text-white/40 border-b border-white/5 pb-2 uppercase font-black italic leading-none font-black italic uppercase leading-none font-black italic uppercase">Legal</span><a href="#" className="hover:text-[#25F4EE] transition-colors font-black italic leading-none font-black italic leading-none font-black italic uppercase">Privacy Policy</a><a href="#" className="hover:text-[#25F4EE] transition-colors font-black italic leading-none font-black italic leading-none font-black italic uppercase">Terms of Use</a></div>
          <div className="flex flex-col gap-5 text-left font-black italic leading-none uppercase font-black italic leading-none leading-none font-black italic font-black italic uppercase"><span className="text-white/40 border-b border-white/5 pb-2 uppercase font-black italic leading-none font-black italic uppercase leading-none font-black italic uppercase">Compliance</span><a href="#" className="hover:text-[#FE2C55] transition-colors font-black italic leading-none font-black italic leading-none font-black italic uppercase">CCPA</a><a href="#" className="hover:text-[#FE2C55] transition-colors font-black italic leading-none font-black italic leading-none font-black italic uppercase">GDPR/LGPD</a></div>
          <div className="flex flex-col gap-5 text-left font-black italic leading-none uppercase font-black italic leading-none leading-none font-black italic font-black italic uppercase"><span className="text-white/40 border-b border-white/5 pb-2 uppercase font-black italic leading-none font-black italic uppercase leading-none font-black italic uppercase">Network</span><a href="#" className="hover:text-[#25F4EE] transition-colors font-black italic leading-none font-black italic leading-none font-black italic uppercase">U.S. Nodes</a><a href="#" className="hover:text-[#25F4EE] transition-colors font-black italic leading-none font-black italic leading-none font-black italic uppercase">EU Nodes</a></div>
          <div className="flex flex-col gap-5 text-left font-black italic leading-none uppercase font-black italic leading-none leading-none font-black italic font-black italic uppercase"><span className="text-white/40 border-b border-white/5 pb-2 uppercase font-black italic leading-none font-black italic uppercase leading-none font-black italic uppercase">Support</span><button onClick={() => setShowSmartSupport(true)} className="hover:text-[#25F4EE] flex items-center gap-2 text-left uppercase font-black italic leading-none font-black italic uppercase leading-none font-black italic uppercase">SMART SUPPORT <Bot size={14}/></button></div>
        </div>
        <p className="text-[11px] text-white/20 font-black tracking-[8px] uppercase italic text-center leading-none font-black italic mt-10 font-black italic text-center uppercase tracking-[0.5em] leading-none font-black italic font-black italic uppercase">© 2026 ClickMoreDigital | Security Protocol</p>
      </footer>

      {/* SMART SUPPORT MODAL */}
      {showSmartSupport && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md text-left font-black italic leading-none">
           <div className="lighthouse-neon-wrapper w-full max-w-sm shadow-3xl text-left font-black italic leading-none uppercase">
              <div className="lighthouse-neon-content p-10 font-black italic leading-none uppercase">
                 <div className="flex justify-between items-center mb-10 leading-none text-left font-black italic leading-none uppercase">
                    <div className="flex items-center gap-3 leading-none text-left font-black italic leading-none uppercase"><Bot size={32} className="text-[#25F4EE]" /><span className="text-sm font-black uppercase tracking-widest text-glow-white italic font-black italic leading-none uppercase">SMART SUPPORT</span></div>
                    <button onClick={() => setShowSmartSupport(false)} className="text-white/40 hover:text-white transition-colors font-black italic leading-none uppercase"><X size={28}/></button>
                 </div>
                 <div className="bg-black border border-white/5 p-8 rounded-3xl mb-8 min-h-[180px] flex items-center justify-center text-center font-black italic leading-none uppercase">
                    <p className="text-[11px] text-white/50 font-black uppercase italic tracking-widest leading-relaxed text-center font-black italic leading-none uppercase">AI Agent evaluating metadata... System ready for encrypted handshake protocol nodes.</p>
                 </div>
                 <button onClick={() => {alert("Connecting secure node..."); setShowSmartSupport(false);}} className="btn-strategic !bg-[#25F4EE] !text-black text-xs italic uppercase font-black py-4 shadow-xl w-full font-black italic leading-none uppercase shadow-2xl">Connect To Node</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
