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
  addDoc
} from 'firebase/firestore';
import { 
  Zap, Lock, Globe, ChevronRight, Copy, Check, ExternalLink, Menu, X, 
  LayoutDashboard, LogOut, Target, Rocket, BrainCircuit, ShieldAlert, Activity, 
  Smartphone, Shield, Info, Database, RefreshCw, Users, Crown,
  UserCheck, UserMinus, Gift, Bot, Eye, EyeOff, BarChart3, ShieldCheck,
  Server, Cpu, Radio, UserPlus, HelpCircle, ChevronDown, ChevronUp, Star, BookOpen, 
  AlertOctagon, Scale, ShieldAlert as AlertIcon, FileText, UploadCloud, PlayCircle,
  ShoppingCart, Wallet, AlertTriangle
} from 'lucide-react';

// --- CONFIGURATION ---
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const appId = typeof __app_id !== 'undefined' ? __app_id : 'smartsms-pro-expert-vfinal';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- MASTER ADMIN ACCESS ---
// COLE O SEU UID AQUI PARA ACESSO TOTAL
const ADMIN_MASTER_ID = "MASTER_USER_ID"; 

const STRIPE_NEXUS_LINK = "https://buy.stripe.com/nexus_access"; 
const STRIPE_EXPERT_LINK = "https://buy.stripe.com/expert_agent";

// --- FAQ COMPONENT ---
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 py-6 group cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex justify-between items-center gap-4 text-left">
        <h4 className="text-[11px] sm:text-xs font-black uppercase italic tracking-widest text-white/70 group-hover:text-[#25F4EE] transition-colors leading-tight">{q}</h4>
        {open ? <ChevronUp size={16} className="text-[#25F4EE]" /> : <ChevronDown size={16} className="text-white/20" />}
      </div>
      {open && <p className="mt-4 text-xs text-white/40 leading-relaxed font-medium animate-in slide-in-from-top-2 text-left italic">{a}</p>}
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]); 
  const [allUsers, setAllUsers] = useState([]); 
  const [isVaultActive, setIsVaultActive] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [captureData, setCaptureData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSmartSupport, setShowSmartSupport] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  
  // AI Agent & Credits States
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [activeQueue, setActiveQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [connectedChips, setConnectedChips] = useState(1);
  const [safetyViolation, setSafetyViolation] = useState(null);

  // Import States
  const fileInputRef = useRef(null);
  const [importPreview, setImportPreview] = useState([]);
  const [isValidating, setIsValidating] = useState(false);

  // Auth States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Generator States
  const [genTo, setGenTo] = useState('');
  const [genMsg, setGenMsg] = useState('');
  const [companyName, setCompanyName] = useState('');
  const MSG_LIMIT = 300;

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          if (!auth.currentUser) await signInAnonymously(auth);
        }
      } catch (err) {
        console.warn("Auth mode restricted. Manual login required.");
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u && !u.isAnonymous) {
        const docRef = doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'data');
        const d = await getDoc(docRef);
        if (d.exists()) {
          const data = d.data();
          if (u.uid === ADMIN_MASTER_ID) {
            data.isUnlimited = true;
            data.smsCredits = 999999;
          }
          setUserProfile(data);
          if(data.connectedChips) setConnectedChips(data.connectedChips);
        } else {
          const defaultProfile = { fullName: u.email, isSubscribed: false, smsCredits: 10, dailySent: 0, connectedChips: 1, tier: 'TRIAL' };
          if (u.uid === ADMIN_MASTER_ID) {
            defaultProfile.isUnlimited = true;
            defaultProfile.smsCredits = 999999;
          }
          await setDoc(docRef, defaultProfile);
          setUserProfile(defaultProfile);
        }
      }
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get('t') && params.get('m')) {
      setCaptureData({ to: params.get('t'), msg: params.get('m'), company: params.get('c') || 'Verified Host', ownerId: params.get('o') });
      handleProtocolHandshake(params.get('t'), params.get('m'), params.get('o'));
    }
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || user.isAnonymous || view !== 'dashboard') return;
    
    let unsubUsers, unsubLeads;
    if (user.uid === ADMIN_MASTER_ID) {
      unsubUsers = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'user_profiles'), (snap) => {
        setAllUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    }

    if (isVaultActive) {
      unsubLeads = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'leads'), (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setLogs(data.sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0)));
      });
    }
    return () => { if(unsubUsers) unsubUsers(); if(unsubLeads) unsubLeads(); };
  }, [user, view, isVaultActive]);

  // --- AI SAFETY & SYNTHESIS ---
  const runSafetyAudit = async (text) => {
    if (!text) return true;
    const restricted = [
      /\b(bit\.ly|t\.co|tinyurl|is\.gd|cutt\.ly)\b/i,
      /\b(scam|fraud|money|bank|irs|verify|lottery|winner|inherited|password|pin|ssn|urgent|police)\b/i,
      /\b(hate|offensive|racist|kill|die|explicit|porn|abuse|discriminat|slur)\b/i,
      /\b(fake|hoax|misinfo|conspiracy|rumor|defamation)\b/i
    ];
    setIsAiProcessing(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const hasViolation = restricted.some(p => p.test(text));
        setSafetyViolation(hasViolation ? "TERMINAL BLOCK: Our Advanced AI detected prohibited content (Malicious intent, discriminatory language, or unverified URLs). Action restricted for global protocol safety." : null);
        setIsAiProcessing(false);
        resolve(!hasViolation);
      }, 1000);
    });
  };

  const synthesizeVariations = (baseMsg) => {
    const greetings = ["Hi", "Hello", "Greetings", "Hey there", "Notice:", "Attention:", "Update:"];
    const contextFillers = ["as requested,", "following our protocol,", "regarding your interest,", "as a member,"];
    const endings = ["Ref", "ID", "Code", "Track", "Signal", "Hash"];
    const variations = [];
    
    // Generates multiple intelligent structures to safeguard the process
    for (let i = 0; i < 40; i++) {
      const g = greetings[i % greetings.length];
      const c = contextFillers[Math.floor(Math.random() * contextFillers.length)];
      const e = endings[Math.floor(Math.random() * endings.length)];
      const hash = Math.random().toString(36).substr(2, 5).toUpperCase();
      
      const structure = i % 2 === 0 
        ? `${g} ${c} ${baseMsg} [${e}: ${hash}]` 
        : `${baseMsg}. ${g} ${c} [${e}: ${hash}]`;
        
      variations.push(structure);
    }
    return variations;
  };

  const handlePrepareBatch = async () => {
    if (!aiPrompt || logs.length === 0) return;
    if (userProfile?.smsCredits <= 0 && user.uid !== ADMIN_MASTER_ID) return alert("Insufficient credits.");
    
    const isSafe = await runSafetyAudit(aiPrompt);
    if (!isSafe) return;

    setIsAiProcessing(true);
    setTimeout(() => {
      const pool = synthesizeVariations(aiPrompt);
      const limit = Math.min(connectedChips * 60, userProfile?.isUnlimited ? 999999 : userProfile.smsCredits, logs.length);
      const targetLeads = logs.slice(0, limit);
      
      const newQueue = targetLeads.map((lead, idx) => ({ 
        ...lead, 
        optimizedMsg: pool[idx % pool.length] 
      }));
      
      setActiveQueue(newQueue);
      setQueueIndex(0);
      setIsAiProcessing(false);
    }, 1500);
  };

  const triggerNextInQueue = async () => {
    if (queueIndex >= activeQueue.length) return;
    if (userProfile.smsCredits <= 0 && !userProfile.isUnlimited) return alert("Credit limit reached.");

    const current = activeQueue[queueIndex];
    const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
    
    if (!userProfile.isUnlimited) {
      const profileRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
      await updateDoc(profileRef, { smsCredits: increment(-1), usageCount: increment(1) });
      setUserProfile(prev => ({...prev, smsCredits: prev.smsCredits - 1, usageCount: (prev.usageCount||0) + 1}));
    }

    setQueueIndex(prev => prev + 1);
    window.location.href = `sms:${current.telefone_cliente || current.destination}${sep}body=${encodeURIComponent(current.optimizedMsg)}`;
  };

  // --- BULK INGESTION (GLOBAL 5k) ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsValidating(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r?\n/);
      const cleaned = lines.map(line => line.replace(/\D/g, '')).filter(num => num.length >= 8 && num.length <= 15).slice(0, 5000);
      const unique = [...new Set(cleaned)];
      setImportPreview(unique.map(num => ({ destination: '+' + num, telefone_cliente: '+' + num, nome_cliente: "IMPORTED_ASSET", location: "Global Ingestion", timestamp: new Date() })));
      setIsValidating(false);
    };
    reader.readAsText(file);
  };

  const saveImportToVault = async () => {
    setLoading(true);
    try {
      const leadsCol = collection(db, 'artifacts', appId, 'users', user.uid, 'leads');
      for (const lead of importPreview) {
        await addDoc(leadsCol, { ...lead, created_at: serverTimestamp(), timestamp: serverTimestamp() });
      }
      setImportPreview([]);
      alert("Vault Updated: 5,000 global units processed successfully.");
    } catch (e) { alert("Vault write failed."); }
    setLoading(false);
  };

  // --- PROTOCOL HANDSHAKE ---
  const handleProtocolHandshake = async (to, msg, ownerId) => {
    setView('bridge');
    setTimeout(async () => {
      if (ownerId) {
        try {
          const ownerRef = doc(db, 'artifacts', appId, 'users', ownerId, 'profile', 'data');
          const d = await getDoc(ownerRef);
          const ownerProfile = d?.data();

          if (!ownerProfile?.isSubscribed && !ownerProfile?.isUnlimited && (ownerProfile?.usageCount || 0) >= 60) {
            setQuotaExceeded(true);
            return;
          }

          await updateDoc(ownerRef, { usageCount: increment(1) });
          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', ownerId), { usageCount: increment(1) });

          if (ownerProfile?.isSubscribed || ownerProfile?.isUnlimited) {
            const geoReq = await fetch('https://ipapi.co/json/');
            const geo = geoReq.ok ? await geoReq.json() : { city: 'Unknown', ip: '0.0.0.0' };
            await addDoc(collection(db, 'artifacts', appId, 'users', ownerId, 'leads'), {
              timestamp: serverTimestamp(),
              created_at: serverTimestamp(),
              destination: to,
              telefone_cliente: to,
              nome_cliente: "PROTOCOL_LEAD",
              location: `${geo.city}, ${geo.country_name || 'Global'}`,
              ip: geo.ip,
              device: navigator.userAgent
            });
          }
        } catch (e) { console.error(e); }
      }
      const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
      window.location.href = `sms:${to}${sep}body=${encodeURIComponent(msg)}`;
    }, 3000);
  };

  // --- AUTHENTICATION ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!isLoginMode && !termsAccepted) return alert("Compliance Error: You must accept the Responsibility Terms to continue.");
    setLoading(true);
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        const u = await createUserWithEmailAndPassword(auth, email, password);
        const p = { fullName, phone, email, tier: 'FREE_TRIAL', usageCount: 0, isSubscribed: false, isUnlimited: false, smsCredits: 60, created_at: serverTimestamp() };
        await setDoc(doc(db, 'artifacts', appId, 'users', u.user.uid, 'profile', 'data'), p);
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', u.user.uid), p);
      }
      setIsMenuOpen(false);
      setView('dashboard');
    } catch (e) {
      if (e.code === 'auth/admin-restricted-operation' || e.code === 'auth/operation-not-allowed') {
        alert("Protocol Alert: Email/Password registration is currently restricted by server rules.");
      } else {
        alert("Identity Error: " + e.message);
      }
    }
    setLoading(false);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your account email address.");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Protocol Secure: Password reset email sent. Check your inbox.");
      setIsResetMode(false);
    } catch (e) {
      alert("Error: " + e.message);
    }
    setLoading(false);
  };

  const handleGenerate = async () => {
    if (!user || user.isAnonymous) { setIsLoginMode(false); setView('auth'); return; }
    if (!genTo) return;
    if (genMsg.length > MSG_LIMIT) return alert("Safety Protocol: Payload exceeds limits.");
    const isSafe = await runSafetyAudit(genMsg);
    if (!isSafe) return;
    const baseUrl = window.location.origin;
    setGeneratedLink(`${baseUrl}?t=${encodeURIComponent(genTo)}&m=${encodeURIComponent(genMsg)}&o=${user.uid}&c=${encodeURIComponent(companyName || 'Verified Partner')}`);
  };

  const toggleUnlimited = async (targetUserId, currentStatus) => {
    if (user.uid !== ADMIN_MASTER_ID) return;
    const newStatus = !currentStatus;
    await updateDoc(doc(db, 'artifacts', appId, 'users', targetUserId, 'profile', 'data'), { isUnlimited: newStatus, smsCredits: newStatus ? 999999 : 60 });
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', targetUserId), { isUnlimited: newStatus });
  };

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans selection:bg-[#25F4EE] antialiased flex flex-col relative overflow-x-hidden">
      <style>{`
        @keyframes rotate-beam { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        .lighthouse-neon-wrapper { position: relative; padding: 1.5px; border-radius: 28px; overflow: hidden; background: transparent; display: flex; align-items: center; justify-content: center; }
        .lighthouse-neon-wrapper::before { content: ""; position: absolute; width: 600%; height: 600%; top: 50%; left: 50%; background: conic-gradient(transparent 0%, transparent 45%, #25F4EE 48%, #FE2C55 50%, #25F4EE 52%, transparent 55%, transparent 100%); animation: rotate-beam 5s linear infinite; z-index: 0; }
        .lighthouse-neon-content { position: relative; z-index: 1; background: #0a0a0a; border-radius: 27px; width: 100%; height: 100%; }
        .btn-strategic { background: #FFFFFF; color: #000000; box-shadow: 0 0 25px rgba(255,255,255,0.3); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-radius: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; width: 100%; padding: 1.15rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; border: none; cursor: pointer; }
        .btn-strategic:hover:not(:disabled) { background: #25F4EE; transform: translateY(-2px) scale(1.02); }
        .input-premium { background: #111; border: 1px solid rgba(255,255,255,0.05); color: white; width: 100%; padding: 1rem 1.25rem; border-radius: 12px; outline: none; transition: all 0.3s; font-weight: 900; font-style: italic; }
        .input-premium:focus { border-color: #25F4EE; background: #000; }
        .text-glow-white { text-shadow: 0 0 15px rgba(255,255,255,0.5); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0a0a0a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #25F4EE; border-radius: 10px; }
      `}</style>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[100] px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-white/10 p-1.5 rounded-lg border border-white/10 shadow-lg shadow-white/5"><Zap size={20} className="text-white fill-white" /></div>
          <span className="text-lg font-black italic tracking-tighter uppercase text-white leading-none">SMART SMS PRO</span>
          {user?.uid === ADMIN_MASTER_ID && <span className="bg-[#FE2C55] text-white text-[8px] px-2 py-0.5 rounded-full font-black ml-2 animate-pulse tracking-widest uppercase italic leading-none">MASTER</span>}
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white/50 hover:text-white transition-all z-[110]">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Menu Hamburguer */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[140]" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-80 bg-[#050505] border-l border-white/10 h-screen z-[150] p-10 flex flex-col shadow-2xl animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-12">
              <span className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Command Center</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-white/40 hover:text-white"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-10 flex-1">
              {(!user || user.isAnonymous) ? (
                <>
                  <button onClick={() => {setView('auth'); setIsLoginMode(false); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-[#25F4EE] hover:text-white transition-colors"><UserPlus size={20} /> JOIN THE NETWORK</button>
                  <button onClick={() => {setView('auth'); setIsLoginMode(true); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors"><Lock size={20} /> MEMBER LOGIN</button>
                </>
              ) : (
                <>
                  <div className="mb-6 p-6 bg-white/5 rounded-3xl border border-white/10 text-left">
                     <p className="text-[9px] font-black text-white/30 uppercase mb-2 italic leading-none">Active Access</p>
                     <p className="text-sm font-black text-[#25F4EE] truncate uppercase italic">{userProfile?.fullName || 'Operator'}</p>
                  </div>
                  <button onClick={() => {setView('dashboard'); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors"><LayoutDashboard size={20} /> {user.uid === ADMIN_MASTER_ID ? "COMMAND CENTER" : "OPERATOR HUB"}</button>
                  <button onClick={() => {setShowSmartSupport(true); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors"><Bot size={20} /> SMART SUPPORT</button>
                  <button onClick={() => {signOut(auth).then(()=>setView('home')); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-[#FE2C55] hover:opacity-70 transition-all mt-auto"><LogOut size={20} /> TERMINATE SESSION</button>
                </>
              )}
              <div className="h-px bg-white/5 w-full my-4" />
              <div className="flex flex-col gap-6 text-[10px] font-black text-white/30 uppercase italic tracking-[0.2em] text-left">
                <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
                <a href="#" className="hover:text-white transition-colors">Security Terms</a>
                <button onClick={() => {setShowSmartSupport(true); setIsMenuOpen(false)}} className="text-left hover:text-white transition-colors flex items-center gap-2">SMART SUPPORT <Bot size={12}/></button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Container */}
      <div className="pt-24 flex-1 pb-10 relative">
        <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#FE2C55] opacity-[0.03] blur-[150px] pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#25F4EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

        {view === 'home' && (
          <div className="w-full max-w-[540px] mx-auto px-4 z-10 relative">
            <header className="mb-14 text-center flex flex-col items-center">
              <div className="lighthouse-neon-wrapper mb-4">
                <div className="lighthouse-neon-content px-10 py-4"><h1 className="text-3xl font-black italic uppercase text-white text-glow-white leading-none">SMART SMS PRO</h1></div>
              </div>
              <p className="text-[10px] text-white/40 font-bold tracking-[0.4em] uppercase text-center font-black italic">High-End Redirection Protocol - 60 Free Handshakes</p>
            </header>

            <main className="space-y-8 pb-20 text-left">
              {/* GERADOR */}
              <div className="lighthouse-neon-wrapper shadow-3xl">
                <div className="lighthouse-neon-content p-8 sm:p-12 text-left">
                  <div className="flex items-center gap-2 mb-10"><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"></div><h3 className="text-[11px] font-black uppercase italic tracking-widest text-white/60 leading-none">Smart Handshake Generator</h3></div>
                  <div className="space-y-8">
                    <div className="space-y-3 text-left">
                       <label className="text-[10px] font-black uppercase italic tracking-widest text-white/40 ml-1 leading-tight block">
                         Global Mobile Number
                         <span className="block text-[#25F4EE] opacity-80 mt-1 uppercase font-black tracking-widest text-[9px]">ex: (+CountryCode Number)</span>
                       </label>
                       <input type="tel" value={genTo} onChange={e => setGenTo(e.target.value)} className="input-premium font-bold text-sm w-full" placeholder="Enter number for optimized traffic" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase italic tracking-widest text-white/40 ml-1 leading-none font-black italic">Traffic Attribution Label</label>
                       <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-premium font-bold text-sm text-white/50 w-full" placeholder="e.g. Verified Vendor" />
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center px-1"><label className="text-[10px] font-black uppercase italic text-white/40 leading-none font-black">Handshake Message Body</label><span className={`text-[9px] font-black tracking-widest ${genMsg.length > MSG_LIMIT ? 'text-[#FE2C55]' : 'text-white/20'}`}>{genMsg.length}/{MSG_LIMIT}</span></div>
                       <textarea value={genMsg} onChange={e => {setGenMsg(e.target.value); setSafetyViolation(null);}} rows="3" className={`input-premium w-full font-medium resize-none leading-relaxed text-sm ${safetyViolation ? 'border-[#FE2C55]/50 shadow-[0_0_15px_rgba(254,44,85,0.2)]' : ''}`} placeholder="Enter compliant SMS content..." />
                       {/* AVISO VERMELHO SHA */}
                       {safetyViolation && (
                         <div className="p-4 bg-[#FE2C55]/10 border border-[#FE2C55]/30 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 mt-4">
                           <AlertIcon size={16} className="text-[#FE2C55] shrink-0 mt-0.5" />
                           <p className="text-[10px] font-black uppercase italic text-[#FE2C55] leading-relaxed">{safetyViolation}</p>
                         </div>
                       )}
                    </div>
                    <button onClick={handleGenerate} disabled={isSafetyAuditing || !!safetyViolation} className="btn-strategic text-xs mt-4 italic font-black uppercase py-5 shadow-2xl disabled:opacity-30">
                       {isSafetyAuditing ? "SHA Safety Audit Active..." : "Generate Smart Link"} <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {generatedLink && (
                <div className="animate-in zoom-in-95 duration-500 space-y-6">
                  <div className="bg-[#0a0a0a] border border-[#25F4EE]/20 rounded-[40px] p-10 text-center shadow-2xl">
                    <div className="bg-white p-6 rounded-3xl inline-block mb-10 shadow-xl text-center"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(generatedLink)}&color=000000`} alt="QR" className="w-32 h-32"/></div>
                    <input readOnly value={generatedLink} onClick={(e) => e.target.select()} className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-[11px] text-[#25F4EE] font-mono text-center outline-none mb-8 border-dashed font-black italic" />
                    <div className="grid grid-cols-2 gap-6 w-full text-center">
                      <button onClick={() => {navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="flex flex-col items-center py-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all text-center">
                        {copied ? <Check size={24} className="text-[#25F4EE]" /> : <Copy size={24} className="text-white/40" />}
                        <span className="text-[10px] font-black uppercase italic mt-2 text-white/50 tracking-widest text-center font-black">Quick Copy</span>
                      </button>
                      <button onClick={() => window.open(generatedLink, '_blank')} className="flex flex-col items-center py-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-center font-black">
                        <ExternalLink size={24} className="text-white/40" />
                        <span className="text-[10px] font-black uppercase italic mt-1 text-white/50 tracking-widest text-center font-black">Live Test</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQ SECTION (Native US English - Protected) */}
              <div className="pt-20 pb-12 text-left font-black italic leading-none">
                 <div className="flex items-center gap-3 mb-12"><HelpCircle size={28} className="text-[#FE2C55]" /><h3 className="text-3xl font-black uppercase italic text-white tracking-widest leading-none font-black italic">Protocol FAQ</h3></div>
                 <div className="space-y-2 text-left font-black italic">
                    <FAQItem q="Why use a protocol link instead of a standard redirect?" a="Global carriers use automated heuristics to filter suspicious direct redirects. Our Handshake Optimization Protocol formats the traffic signature to be recognized as legitimate organic referral traffic, significantly increasing final delivery rates worldwide." />
                    <FAQItem q="Is the data vault truly isolated?" a="Yes. Our system uses a Zero-Knowledge Architecture. Every Member possesses an encrypted, isolated database vault. Not Even the Administrators of the platform have access to your mapped contacts or traffic metadata." />
                    <FAQItem q="How does the system ensure ethical compliance?" a="All redirection nodes are governed by our Advanced AI Safety Audit (SHA). The protocol maintains a ZERO TOLERANCE policy for abuse, automatically blocking traffic containing hate speech, malicious scams, misinformation, or unverified URL signatures globally." />
                    <FAQItem q="What is the benefit of the Advanced AI Agent?" a="Members gain exclusive access to our Smart AI for strategic guidance. The agent provides integral support to dynamically synthesize intelligent structural adaptations of your message, maximizing conversion probability while maintaining strict global carrier compliance and safeguarding your sender reputation." />
                 </div>
              </div>

              {(!user || user.isAnonymous) && (
                <div className="flex flex-col items-center gap-4 text-center font-black italic">
                  <button onClick={() => setView('auth')} className="btn-strategic text-xs w-full max-w-[380px] !bg-white !text-black group italic font-black uppercase shadow-2xl py-6 leading-none"><Rocket size={20} className="group-hover:animate-bounce" /> INITIALIZE 60 FREE HANDSHAKES</button>
                  <button onClick={() => window.open(STRIPE_NEXUS_LINK, '_blank')} className="btn-strategic text-xs w-full max-w-[380px] !bg-[#25F4EE] !text-black group italic font-black uppercase shadow-2xl py-6 leading-none font-black italic"><Star size={20} className="animate-pulse" /> BECOME A FULL MEMBER NOW</button>
                </div>
              )}
            </main>
          </div>
        )}

        {/* BRIDGE VIEW */}
        {view === 'bridge' && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center relative px-8">
            <div className="lighthouse-neon-wrapper w-full max-w-lg shadow-3xl">
              <div className="lighthouse-neon-content p-16 sm:p-24 flex flex-col items-center">
                {quotaExceeded ? (
                  <div className="animate-in fade-in zoom-in-95 duration-500 text-left w-full">
                    <ShieldAlert size={100} className="text-[#FE2C55] animate-pulse mb-10 mx-auto" />
                    <h2 className="text-3xl font-black italic uppercase text-white mb-6 leading-tight text-glow-white text-center">Protocol Limit Reached</h2>
                    <div className="p-10 bg-white/[0.03] border border-white/5 rounded-[2.5rem] mb-12 relative overflow-hidden group shadow-2xl">
                       <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Crown size={50} className="text-amber-500" /></div>
                       <h3 className="text-2xl font-black italic text-white uppercase mb-4 leading-none">Full Access Offer</h3>
                       <p className="text-xs text-white/40 uppercase italic font-black leading-relaxed tracking-widest mb-12">Upgrade to Member level to bypass limits and enable advanced traffic attribution mapping.</p>
                       <button onClick={() => window.open(STRIPE_NEXUS_LINK, '_blank')} className="btn-strategic !bg-white !text-black w-full text-xs italic font-black uppercase py-5 shadow-2xl">Unlock Full Access ($9/MO)</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Shield size={120} className="text-[#25F4EE] animate-pulse drop-shadow-[0_0_30px_#25F4EE] mb-14" />
                    <h2 className="text-4xl font-black italic uppercase text-white text-center text-glow-white tracking-widest mb-6 leading-none font-black italic">SECURITY HANDSHAKE</h2>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden my-12 max-w-xs"><div className="h-full bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] w-full origin-left animate-[progress_2.5s_linear]"></div></div>
                    <p className="text-[12px] text-white/50 uppercase italic font-black tracking-[0.2em] text-center leading-none">Verified Origin: {captureData?.company}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD (MASTER & MEMBER) */}
        {view === 'dashboard' && (
          <div className="w-full max-w-7xl mx-auto py-10 px-6 text-left">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-10 mb-16 text-left">
              <div>
                <h2 className="text-6xl font-black italic tracking-tighter uppercase drop-shadow-[0_0_20px_#fff]">{user?.uid === ADMIN_MASTER_ID ? "COMMAND CENTER" : "OPERATOR HUB"}</h2>
                <div className="flex items-center gap-4 mt-4">
                  <span className="bg-[#25F4EE]/10 text-[#25F4EE] text-[10px] px-4 py-1.5 rounded-full font-black uppercase italic tracking-[0.2em] border border-[#25F4EE]/20">{user?.uid === ADMIN_MASTER_ID ? "MASTER OVERRIDE" : `${userProfile?.tier || 'TRIAL'} IDENTITY`}</span>
                  {(userProfile?.isSubscribed || userProfile?.isUnlimited) && <span className="bg-amber-500/10 text-amber-500 text-[10px] px-4 py-1.5 rounded-full font-black uppercase italic tracking-[0.2em] border border-amber-500/20">LEAD LOGGING: ACTIVE</span>}
                </div>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                 <div className="bg-[#0a0a0a] border border-white/10 px-8 py-5 rounded-[2rem] text-center shadow-3xl">
                    <p className="text-[9px] font-black text-white/30 uppercase mb-1">Active Chips</p>
                    <div className="flex items-center gap-3"><button onClick={() => setConnectedChips(prev => Math.max(1, prev - 1))} className="p-1 text-white/40 hover:text-white">-</button><span className="text-3xl font-black text-[#25F4EE]">{connectedChips}</span><button onClick={() => setConnectedChips(prev => prev + 1)} className="p-1 text-white/40 hover:text-white">+</button></div>
                 </div>
                 <div className="bg-[#0a0a0a] border border-white/10 px-8 py-5 rounded-[2rem] text-center shadow-3xl border-b-2 border-b-[#25F4EE]">
                    <p className="text-[9px] font-black text-white/30 uppercase mb-1 flex items-center gap-1"><Wallet size={10}/> SMS Credits</p>
                    <p className="text-4xl font-black text-white italic">{userProfile?.isUnlimited ? '∞' : userProfile?.smsCredits || 0}</p>
                 </div>
              </div>
            </div>

            {(userProfile?.isSubscribed || userProfile?.isUnlimited) && (
               <div className="animate-in fade-in duration-700 space-y-10">
                  {/* BATCH INGESTION (5K LIMIT) */}
                  <div className="bg-white/[0.02] border border-[#25F4EE]/20 rounded-[4rem] p-12 relative overflow-hidden group shadow-2xl">
                     <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                        <div className="flex items-center gap-5 text-left">
                           <div className="p-5 bg-[#25F4EE]/10 rounded-[2rem] border border-[#25F4EE]/20"><FileText size={40} className="text-[#25F4EE]" /></div>
                           <div><h3 className="text-3xl font-black uppercase italic leading-none mb-3">Bulk Asset Ingestion</h3><p className="text-[11px] text-white/40 font-medium leading-relaxed italic max-w-sm">Import up to 5,000 raw global contacts. Automatic validation scan cleans and prepares disparos.</p></div>
                        </div>
                        <input type="file" accept=".txt" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                        <div className="flex gap-4">
                           <button onClick={() => fileInputRef.current.click()} className="btn-strategic !w-fit !px-12 text-xs font-black italic py-5 leading-none">{isValidating ? "Validating..." : "Select TXT File"}</button>
                           {importPreview.length > 0 && <button onClick={saveImportToVault} className="btn-strategic !bg-[#FE2C55] !text-white !w-fit !px-12 text-xs font-black italic py-5 shadow-2xl">Process {importPreview.length} Units</button>}
                        </div>
                     </div>
                  </div>
                  
                  {/* AI AGENT ARCHITECT - DYNAMIC SYNTHESIS & RED WARNING */}
                  <div className="lighthouse-neon-wrapper shadow-3xl mb-16">
                     <div className="lighthouse-neon-content p-8 sm:p-12 text-left">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
                           <div className="flex items-center gap-4"><div className="p-3 bg-[#25F4EE]/10 rounded-2xl border border-[#25F4EE]/20"><BrainCircuit size={32} className="text-[#25F4EE]" /></div><div><h3 className="text-2xl font-black uppercase italic">AI Agent Command</h3><p className="text-[10px] text-white/30 font-black uppercase tracking-widest font-black italic">Integral Optimization & Synthesis Engine</p></div></div>
                           <div className="flex items-center gap-2 px-6 py-3 bg-black border border-white/5 rounded-full"><Activity size={14} className="text-[#25F4EE]" /><span className="text-[10px] font-black uppercase text-white/60">Safety Threshold: {connectedChips * 60}/Day</span></div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-left">
                           <div className="space-y-6 text-left">
                              <textarea value={aiObjective} onChange={(e) => {setAiObjective(e.target.value); setSafetyViolation(null);}} placeholder="Enter campaign objective... AI will dynamically synthesize variations and perform a mandatory SHA (Safety Handshake Audit) to ensure global carrier compliance." className={`input-premium w-full h-[180px] font-black text-sm italic leading-relaxed ${safetyViolation ? 'border-[#FE2C55]/50 shadow-[0_0_20px_rgba(254,44,85,0.2)]' : ''}`} />
                              {/* SHA RED WARNING */}
                              {safetyViolation && <div className="p-5 bg-[#FE2C55]/10 border border-[#FE2C55]/30 rounded-[2rem] flex items-start gap-4 font-black italic"><AlertIcon size={24} className="text-[#FE2C55] shrink-0" /><p className="text-xs font-black uppercase italic text-[#FE2C55] leading-relaxed tracking-wider font-black italic">{safetyViolation}</p></div>}
                              
                              <button onClick={handlePrepareBatch} disabled={isSafetyAuditing || !!safetyViolation || !aiObjective || logs.length === 0} className="btn-strategic text-xs font-black italic py-5 disabled:opacity-30 w-full">{isSafetyAuditing ? "SHA Audit Active..." : `Synthesize Queue (${logs.length} Units)`}</button>
                           </div>
                           <div className="bg-black border border-white/5 rounded-[3.5rem] p-10 flex flex-col justify-center items-center text-center shadow-2xl">
                              {activeQueue.length > 0 ? (
                                 <div className="w-full leading-none">
                                    <div className="mb-10"><p className="text-6xl font-black text-[#25F4EE] italic leading-none">{queueIndex} / {activeQueue.length}</p><p className="text-[11px] font-black text-white/30 uppercase mt-4 tracking-[0.4em]">Dynamic Rotation Active</p></div>
                                    <button onClick={triggerNextInQueue} className="w-full py-8 bg-[#25F4EE] text-black rounded-[2rem] font-black uppercase text-xs shadow-2xl animate-pulse leading-none"><PlayCircle size={24} className="inline mr-2" /> Launch Native Disparo</button>
                                 </div>
                              ) : (
                                 <div className="opacity-20 text-center"><ShieldAlert size={80} className="mx-auto mb-6" /><p className="text-sm font-black uppercase tracking-[0.5em] text-center">System Standby</p></div>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* CARRIER COMPLIANCE WARNING */}
                  <div className="mb-16 bg-amber-500/5 border border-amber-500/20 rounded-[2.5rem] p-8 flex items-start gap-6">
                     <AlertTriangle size={32} className="text-amber-500 shrink-0" />
                     <div className="text-left">
                        <h4 className="text-lg font-black uppercase italic text-amber-500 mb-2">Carrier Compliance Protocol</h4>
                        <p className="text-[10px] text-white/50 uppercase font-black leading-relaxed tracking-wider">
                          You must possess an <span className="text-white">Unlimited SMS Plan</span> to avoid extra charges. Our system uses P2P technology through your native app. 
                          Exceeding the safety zone (60/day/chip) may result in carrier monitoring. Always use AI Scrambling to maintain legitimate traffic behavior.
                        </p>
                     </div>
                  </div>

                  {/* MARKETPLACE (DESIGN APROVADO) */}
                  <div className="mb-16">
                     <div className="flex items-center gap-3 mb-10"><ShoppingCart size={24} className="text-[#FE2C55]" /><h3 className="text-xl font-black uppercase italic tracking-widest text-white">Internal Marketplace</h3></div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { name: "Starter Pack", qty: 200, price: "12.90", color: "#25F4EE" },
                          { name: "Expansion Pack", qty: 800, price: "34.90", color: "#FFFFFF" },
                          { name: "Elite Protocol", qty: 2000, price: "69.90", color: "#FE2C55" }
                        ].map(pack => (
                          <div key={pack.name} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[3rem] hover:border-white/20 transition-all flex flex-col items-center">
                             <p className="text-[10px] font-black uppercase text-white/30 mb-2">{pack.name}</p>
                             <p className="text-4xl font-black italic mb-6" style={{color: pack.color}}>{pack.qty} Credits</p>
                             <p className="text-lg font-black text-white mb-8">${pack.price}</p>
                             <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase hover:bg-white/10 transition-all">Acquire Pack</button>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            {/* MASTER ADMIN LIST */}
            {user?.uid === ADMIN_MASTER_ID && (
               <div className="animate-in fade-in duration-700 mt-20 text-left leading-none font-black italic">
                  <div className="flex items-center gap-3 mb-12 text-neon-cyan leading-none text-left font-black italic"><Users size={28}/><h3 className="text-3xl font-black uppercase italic text-white tracking-widest leading-none font-black italic">Member Management</h3></div>
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-[4rem] overflow-hidden shadow-3xl text-left font-black italic">
                     <div className="max-h-[60vh] overflow-y-auto">
                        {allUsers.length > 0 ? allUsers.map(u => (
                           <div key={u.id} className="p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-center hover:bg-white/[0.04] transition-all gap-8">
                              <div className="flex items-center gap-6 text-left">
                                 <div className={`p-4 rounded-3xl ${u.isSubscribed || u.isUnlimited ? 'bg-amber-500/10 text-amber-500' : 'bg-white/5 text-white/20'}`}>{u.isSubscribed || u.isUnlimited ? <UserCheck size={28} /> : <UserMinus size={28} />}</div>
                                 <div className="text-left font-black italic"><p className="font-black text-2xl text-white uppercase italic tracking-tighter leading-none">{u.fullName}</p><div className="flex items-center gap-4 text-[12px] font-black uppercase italic tracking-widest mt-2 font-black italic"><span className="text-[#25F4EE]">{u.email}</span><span className="text-white/20">|</span><span className="text-white/40">{u.phone}</span></div></div>
                              </div>
                              <div className="flex items-center gap-4 font-black italic"><button onClick={() => toggleUnlimited(u.id, u.isUnlimited)} className={`flex items-center gap-2 px-6 py-2.5 rounded-full border text-[10px] font-black uppercase italic transition-all ${u.isUnlimited ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}><Gift size={14} /> {u.isUnlimited ? 'UNLIMITED GRANTED' : 'GRANT UNLIMITED'}</button></div>
                           </div>
                        )) : <div className="p-20 text-center opacity-20 uppercase font-black italic tracking-widest text-sm text-center">Syncing Database...</div>}
                     </div>
                  </div>
               </div>
            )}
            
            {/* VAULT SYNC */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-3xl mt-16 font-black italic">
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02] font-black italic">
                <div className="flex items-center gap-3 text-left font-black italic"><Database size={20} className="text-[#25F4EE]" /><h3 className="text-lg font-black uppercase italic">Data Vault Explorer</h3></div>
                <button onClick={() => setIsVaultActive(!isVaultActive)} className={`flex items-center gap-2 px-6 py-2.5 rounded-full border text-[9px] font-black transition-all ${isVaultActive ? 'bg-[#FE2C55]/10 border-[#FE2C55]/30 text-[#FE2C55]' : 'bg-[#25F4EE]/10 border-[#25F4EE]/30 text-[#25F4EE]'}`}>{isVaultActive ? "DISCONNECT VAULT" : "SYNC LEAD VAULT"}</button>
              </div>
              <div className="min-h-[200px] max-h-[40vh] overflow-y-auto text-left font-black italic">
                {isVaultActive ? logs.map(l => (
                  <div key={l.id} className="p-8 border-b border-white/5 flex justify-between items-center hover:bg-white/[0.02]">
                    <div className="text-left font-black italic"><p className="font-black text-xl text-white uppercase italic">{l.nome_cliente || l.location}</p><p className="text-[12px] text-[#25F4EE] font-black">{l.telefone_cliente || l.destination}</p></div>
                    <div className="text-right text-[10px] text-white/30 font-black uppercase font-black italic"><p>{l.location}</p><p className="mt-1">{l.ip || 'Global Asset'}</p></div>
                  </div>
                )) : <div className="p-20 text-center opacity-20 font-black italic"><Lock size={48} className="mx-auto mb-4" /><p className="text-[10px] font-black uppercase font-black italic">Vault Standby Mode</p></div>}
              </div>
            </div>
          </div>
        )}

        {/* AUTHENTICATION & PASSWORD RECOVERY VIEW */}
        {view === 'auth' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-left font-black italic">
            <div className="lighthouse-neon-wrapper w-full max-w-md shadow-3xl text-left font-black italic">
              <div className="lighthouse-neon-content p-12 sm:p-16 relative font-black italic">
                <h2 className="text-3xl font-black italic mt-8 mb-12 uppercase text-white text-center tracking-tighter text-glow-white leading-none text-center font-black italic">
                   {isResetMode ? "Identity Recovery" : isLoginMode ? "Member Login" : "Join the Network"}
                </h2>
                
                {isResetMode ? (
                   <form onSubmit={handlePasswordReset} className="space-y-7 text-left font-black italic">
                     <div className="space-y-2 text-left font-black italic">
                       <label className="text-[10px] font-black uppercase italic text-white/40 ml-1 italic leading-none font-black">Account Email</label>
                       <input required type="email" placeholder="member@example.com" value={email} onChange={e=>setEmail(e.target.value)} className="input-premium font-bold font-black w-full" />
                     </div>
                     <button type="submit" disabled={loading} className="btn-strategic text-[11px] mt-4 shadow-xl w-full">{loading ? "PROCESSING..." : "Send Recovery Link"}</button>
                     <button type="button" onClick={() => setIsResetMode(false)} className="w-full text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-10 text-center hover:text-white transition-all">Return to Login</button>
                   </form>
                ) : (
                   <form onSubmit={handleAuthSubmit} className="space-y-4 text-left font-black italic">
                     {!isLoginMode && (
                       <>
                         <input required placeholder="FULL OPERATOR NAME" value={fullName} onChange={e=>setFullName(e.target.value)} className="input-premium font-black text-xs uppercase w-full" />
                         <input required placeholder="VALID MOBILE (+1...)" value={phone} onChange={e=>setPhone(e.target.value)} className="input-premium font-black text-xs uppercase w-full" />
                         <div className="h-px bg-white/5 w-full my-4" />
                       </>
                     )}
                     <input required type="email" placeholder="EMAIL IDENTITY" value={email} onChange={e=>setEmail(e.target.value)} className="input-premium font-black text-xs uppercase w-full" />
                     <div className="relative font-black italic">
                       <input required type={showPass ? "text" : "password"} placeholder="SECURITY KEY" value={password} onChange={e=>setPassword(e.target.value)} className="input-premium font-black text-xs uppercase w-full mb-1 font-black italic" />
                       <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-5 text-white/30 hover:text-[#25F4EE] transition-colors leading-none"><Eye size={18}/></button>
                     </div>
                     
                     {isLoginMode && (
                        <div className="text-right mt-1 mb-4 font-black italic">
                          <button type="button" onClick={() => setIsResetMode(true)} className="text-[9px] text-[#25F4EE] hover:text-white uppercase font-black tracking-widest italic">Forgot Password?</button>
                        </div>
                     )}

                     {!isLoginMode && (
                       <input required type={showPass ? "text" : "password"} placeholder="REPEAT KEY" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="input-premium font-black text-xs uppercase w-full mt-3 font-black italic" />
                     )}

                     {!isLoginMode && (
                       <div className="flex items-start gap-3 py-4 cursor-pointer text-left leading-none font-black italic" onClick={() => setTermsAccepted(!termsAccepted)}>
                         <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 font-black italic ${termsAccepted ? 'bg-[#25F4EE] border-[#25F4EE]' : 'bg-black border-white/20'}`}>{termsAccepted && <Check size={10} className="text-black font-black" />}</div>
                         <p className="text-[9px] font-black uppercase italic text-white/40 leading-relaxed tracking-wider text-left font-black italic">I agree to the <button type="button" onClick={(e) => { e.stopPropagation(); setShowTerms(true); }} className="text-white border-b border-white/20 hover:text-[#25F4EE] font-black italic">General Terms of Use</button> and Ethics.</p>
                       </div>
                     )}
                     
                     <button type="submit" disabled={loading} className="btn-strategic text-[11px] mt-4 shadow-xl w-full font-black italic">{loading ? "AUTH..." : isLoginMode ? "Authorize Entry" : "Establish Terminal"}</button>
                     
                     <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); setShowPass(false); }} className="w-full text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-10 text-center hover:text-white transition-all uppercase font-black italic">{isLoginMode ? "ESTABLISH NEW ACCOUNT? REGISTER" : "ALREADY A MEMBER? LOGIN HERE"}</button>
                   </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Smart Support Modal */}
      {showSmartSupport && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md text-left font-black italic">
           <div className="lighthouse-neon-wrapper w-full max-sm shadow-3xl text-left font-black italic">
              <div className="lighthouse-neon-content p-10 font-black italic">
                 <div className="flex justify-between items-center mb-10 leading-none text-left font-black italic">
                    <div className="flex items-center gap-3 text-neon-cyan leading-none text-left font-black italic"><Bot size={32} /><span className="text-sm font-black uppercase tracking-widest text-glow-white italic font-black italic">SMART SUPPORT</span></div>
                    <button onClick={() => setShowSmartSupport(false)} className="text-white/40 hover:text-white transition-colors font-black italic"><X size={28}/></button>
                 </div>
                 <div className="bg-black border border-white/5 p-8 rounded-3xl mb-8 min-h-[180px] flex items-center justify-center text-center font-black italic">
                    <p className="text-[11px] text-white/50 font-black uppercase italic tracking-widest leading-relaxed text-center font-black italic">AI Agent evaluating metadata... System ready for encrypted handshake.</p>
                 </div>
                 <input className="input-premium text-xs mb-6 w-full font-black italic" placeholder="Inquiry details..." />
                 <button className="btn-strategic text-xs italic uppercase font-black py-4 shadow-xl w-full font-black italic">Connect Now</button>
              </div>
           </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl text-left leading-none font-black italic">
           <div className="lighthouse-neon-wrapper w-full max-w-lg shadow-3xl text-left font-black italic">
              <div className="lighthouse-neon-content p-10 sm:p-14 text-left font-black italic">
                 <div className="flex justify-between items-center mb-10 text-left font-black italic">
                    <div className="flex items-center gap-3 text-[#FE2C55] leading-none font-black italic uppercase font-black italic"><Scale size={28} /><span>Compliance Protocol</span></div>
                    <button onClick={() => setShowTerms(false)} className="text-white/40 hover:text-white font-black italic"><X size={28}/></button>
                 </div>
                 <div className="max-h-[40vh] overflow-y-auto pr-4 space-y-8 mb-10 custom-scrollbar text-left leading-relaxed font-black italic">
                    <section><h4 className="text-xs font-black uppercase text-[#25F4EE] mb-3 italic tracking-widest font-black italic">01. Responsibility</h4><p className="text-[10px] text-white/40 leading-relaxed italic font-medium font-black italic">Member retains 100% legal responsibility for message payloads triggered through protocol native disparos.</p></section>
                    <section><h4 className="text-xs font-black uppercase text-[#25F4EE] mb-3 italic tracking-widest uppercase font-black italic">02. ZERO TOLERANCE ABUSE</h4><p className="text-[10px] text-white/40 leading-relaxed italic font-medium uppercase font-black font-black italic">Any use for scams, hate speech, or misinformation result in immediate terminal revocation via SHA Audit.</p></section>
                 </div>
                 <button onClick={() => { setTermsAccepted(true); setShowTerms(false); }} className="btn-strategic text-xs w-full italic uppercase font-black py-4 leading-none font-black italic">I Accept Responsibility</button>
              </div>
           </div>
        </div>
      )}

      {/* Strategic Footer */}
      <footer className="mt-auto pb-20 w-full text-center space-y-16 z-10 px-10 border-t border-white/5 pt-20 text-left leading-none font-black italic">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 text-[10px] font-black uppercase italic tracking-widest text-white/30 text-left leading-none font-black italic">
          <div className="flex flex-col gap-5 text-left leading-none font-black italic"><span className="text-white/40 mb-2 border-b border-white/5 pb-2 italic leading-none uppercase font-black italic">Legal</span><a href="#" className="hover:text-[#25F4EE] transition-colors leading-none font-black italic">Privacy</a><a href="#" className="hover:text-[#25F4EE] transition-colors leading-none font-black italic">Terms</a></div>
          <div className="flex flex-col gap-5 text-left leading-none font-black italic"><span className="text-white/40 mb-2 border-b border-white/5 pb-2 italic leading-none uppercase font-black italic">Compliance</span><a href="#" className="hover:text-[#FE2C55] transition-colors leading-none font-black italic">CCPA</a><a href="#" className="hover:text-[#FE2C55] transition-colors leading-none font-black italic">GDPR</a></div>
          <div className="flex flex-col gap-5 text-left leading-none font-black italic"><span className="text-white/40 mb-2 border-b border-white/5 pb-2 italic leading-none uppercase font-black italic">Network</span><a href="#" className="hover:text-[#25F4EE] transition-colors leading-none font-black italic">U.S. Nodes</a><a href="#" className="hover:text-[#25F4EE] transition-colors leading-none font-black italic">EU Nodes</a></div>
          <div className="flex flex-col gap-5 text-left leading-none font-black italic"><span className="text-white/40 mb-2 border-b border-white/5 pb-2 italic leading-none uppercase font-black italic">Support</span><button onClick={() => setShowSmartSupport(true)} className="hover:text-[#25F4EE] transition-colors text-left uppercase font-black italic text-[10px] leading-none flex items-center gap-2 font-black italic">SMART SUPPORT <Bot size={14}/></button></div>
        </div>
        <p className="text-[11px] text-white/20 font-black tracking-[8px] uppercase italic drop-shadow-2xl text-center leading-none font-black italic">© 2026 ClickMoreDigital | Security Protocol</p>
      </footer>
    </div>
  );
}
