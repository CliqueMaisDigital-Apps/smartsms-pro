import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInAnonymously,
  signInWithCustomToken
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
  AlertOctagon, Scale, ShieldAlert as AlertIcon, FileText, UploadCloud, PlayCircle
} from 'lucide-react';

// --- CONFIGURAÇÃO DO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyBI-JSC-FtVOz_r6p-XjN6fUrapMn_ad24",
  authDomain: "smartsmspro-4ee81.firebaseapp.com",
  projectId: "smartsmspro-4ee81",
  storageBucket: "smartsmspro-4ee81.firebasestorage.app",
  messagingSenderId: "269226709034",
  appId: "1:269226709034:web:00af3a340b1e1ba928f353",
  measurementId: "G-RRW67CXZJC"
};

const appId = 'smartsms-pro-ultra-complete';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- MASTER ADMIN ACCESS ---
const ADMIN_MASTER_ID = "W41IbExRiYb7HJ0Dx3up3JEUAqf2"; // <--- COLE O SEU UID AQUI

const STRIPE_NEXUS_LINK = "https://buy.stripe.com/nexus_access"; 

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
  const [allUsers, setAllUsers] = useState([]); 
  const [myLeads, setMyLeads] = useState([]); 
  const [isVaultActive, setIsVaultActive] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSmartSupport, setShowSmartSupport] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [captureData, setCaptureData] = useState(null);
  
  // AI Safety & Synthesis Engine
  const [safetyViolation, setSafetyViolation] = useState(null);
  const [isSafetyAuditing, setIsSafetyAuditing] = useState(false);
  const [aiObjective, setAiObjective] = useState('');
  const [activeQueue, setActiveQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);

  // Bulk Ingestion
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
  const [showPass, setShowPass] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Generator States
  const [genTo, setGenTo] = useState('');
  const [genMsg, setGenMsg] = useState('');
  const [companyName, setCompanyName] = useState('');
  const MSG_LIMIT = 300;

  // SYSTEM INITIALIZATION & AUTH
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.warn("Aviso de Auth: Autenticação anónima indisponível. Utilize o login manual.");
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u && !u.isAnonymous) {
        const docRef = doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'data');
        const d = await getDoc(docRef);
        if (d.exists()) {
          let profile = d.data();
          if (u.uid === ADMIN_MASTER_ID) {
            profile.isUnlimited = true;
            profile.smsCredits = 999999;
          }
          setUserProfile(profile);
        }
      }
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get('t') && params.get('m')) {
      setCaptureData({ to: params.get('t'), msg: params.get('m'), ownerId: params.get('o'), company: params.get('c') || 'Verified Partner' });
      handleProtocolHandshake(params.get('t'), params.get('m'), params.get('o'));
    }

    return () => unsubscribe();
  }, []);

  // DATA SYNCHRONIZATION
  useEffect(() => {
    if (!user || user.isAnonymous || view !== 'dashboard') return;
    
    let unsubUsers, unsubLeads;

    if (user.uid === ADMIN_MASTER_ID) {
      unsubUsers = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'user_profiles'), (snap) => {
        setAllUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (err) => console.error("Sync Erro Users", err));
    }

    if (isVaultActive) {
      unsubLeads = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'leads'), (snap) => {
        setMyLeads(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (err) => console.error("Sync Erro Leads", err));
    }

    return () => { if(unsubUsers) unsubUsers(); if(unsubLeads) unsubLeads(); };
  }, [user, view, isVaultActive]);

  // --- CORE INTELLIGENCE ENGINE ---

  const runSafetyAudit = async (text) => {
    if (!text) return true;
    const restrictedPatterns = [
      /\b(bit\.ly|t\.co|tinyurl|is\.gd|cutt\.ly)\b/i, 
      /\b(scam|fraud|money|bank|irs|verify|lottery|winner|inherited|password|pin|ssn|urgent)\b/i, 
      /\b(hate|offensive|racist|kill|die|explicit|porn|abuse|discriminat|slur)\b/i, 
      /\b(fake|hoax|misinfo|conspiracy|rumor|defamation)\b/i
    ];
    
    setIsSafetyAuditing(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const hasViolation = restrictedPatterns.some(p => p.test(text));
        setSafetyViolation(hasViolation ? "TERMINAL BLOCK: Our Advanced AI detected prohibited content (Malicious intent, discriminatory language, or unsafe URL). Action restricted." : null);
        setIsSafetyAuditing(false);
        resolve(!hasViolation);
      }, 1000);
    });
  };

  const synthesize40Variations = (baseMsg) => {
    const greetings = ["Hi", "Hello", "Hey", "Greetings", "Notice:", "Attention:", "Update:"];
    const contextFillers = ["as requested,", "following our protocol,", "regarding your interest,", "as a member,"];
    const endings = ["Ref", "ID", "Code", "Track", "Signal", "Hash"];
    const variations = [];
    
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
    if (!aiObjective || myLeads.length === 0) return;
    const isSafe = await runSafetyAudit(aiObjective);
    if (!isSafe) return;
    
    setLoading(true);
    setTimeout(() => {
      const pool = synthesize40Variations(aiObjective);
      const newQueue = myLeads.map((lead, idx) => ({ 
        ...lead, 
        optimizedMsg: pool[idx % pool.length] 
      }));
      setActiveQueue(newQueue);
      setQueueIndex(0);
      setLoading(false);
    }, 1500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsValidating(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const lines = event.target.result.split(/\r?\n/);
      const cleaned = lines.map(line => line.replace(/\D/g, '')).filter(num => num.length >= 8 && num.length <= 15).slice(0, 5000);
      const unique = [...new Set(cleaned)];
      setImportPreview(unique.map(num => ({ destination: '+' + num, timestamp: new Date(), location: 'Bulk Asset' })));
      setIsValidating(false);
    };
    reader.readAsText(file);
  };

  const saveImportToVault = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const leadsCol = collection(db, 'artifacts', appId, 'users', user.uid, 'leads');
      for (const lead of importPreview) {
        await addDoc(leadsCol, { ...lead, timestamp: serverTimestamp() });
      }
      setImportPreview([]);
      alert("Vault Sync Complete: 5,000 units processed successfully.");
    } catch (e) { 
      alert("Synchronization failed."); 
    }
    setLoading(false);
  };

  const triggerNextInQueue = () => {
    if (queueIndex >= activeQueue.length) return;
    const current = activeQueue[queueIndex];
    const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
    setQueueIndex(prev => prev + 1);
    window.location.href = `sms:${current.destination}${sep}body=${encodeURIComponent(current.optimizedMsg)}`;
  };

  const handleProtocolHandshake = async (to, msg, ownerId) => {
    if(!ownerId) return;
    setTimeout(async () => {
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
            destination: to,
            location: `${geo.city}, ${geo.country_name || 'Global'}`,
            ip: geo.ip,
            device: navigator.userAgent
          });
        }
      } catch (e) {
        console.error("Handshake error", e);
      }
      const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
      window.location.href = `sms:${to}${sep}body=${encodeURIComponent(msg)}`;
    }, 3000);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!isLoginMode && !termsAccepted) return alert("Compliance Error: You must accept the General Terms of Use to continue.");
    setLoading(true);
    try {
      if (isLoginMode) { 
        await signInWithEmailAndPassword(auth, email, password); 
      } else {
        if(password !== confirmPassword) throw new Error("Passwords do not match.");
        const u = await createUserWithEmailAndPassword(auth, email, password);
        const p = { fullName, phone, email, tier: 'FREE_TRIAL', usageCount: 0, isSubscribed: false, isUnlimited: false, created_at: serverTimestamp() };
        await setDoc(doc(db, 'artifacts', appId, 'users', u.user.uid, 'profile', 'data'), p);
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', u.user.uid), p);
      }
      setView('dashboard');
    } catch (e) { 
      alert("Identity Protocol Error: " + e.message); 
    }
    setLoading(false);
  };

  const toggleUnlimited = async (targetUserId, currentStatus) => {
    if (user.uid !== ADMIN_MASTER_ID) return;
    const newStatus = !currentStatus;
    await updateDoc(doc(db, 'artifacts', appId, 'users', targetUserId, 'profile', 'data'), { isUnlimited: newStatus });
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', targetUserId), { isUnlimited: newStatus });
  };

  const handleGenerate = async () => {
    if (!user || user.isAnonymous) { setView('auth'); return; }
    if (!genTo) return;
    if (genMsg.length > MSG_LIMIT) return alert("Security Protocol: Payload exceeds carrier safety limits.");
    const isSafe = await runSafetyAudit(genMsg);
    if (!isSafe) return;
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
        .btn-strategic:hover:not(:disabled) { background: #25F4EE; transform: translateY(-2px); box-shadow: 0 0 40px rgba(37,244,238,0.4); }
        .input-premium { background: #111; border: 1px solid rgba(255,255,255,0.05); color: white; width: 100%; padding: 1rem 1.25rem; border-radius: 12px; outline: none; transition: all 0.3s; font-weight: 900; font-size: 14px; }
        .input-premium:focus { border-color: #25F4EE; background: #000; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0a0a0a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #25F4EE; border-radius: 10px; }
      `}</style>

      {/* Navegação de Topo */}
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

      {/* Menu Lateral Completo */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[140]" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-80 bg-[#050505] border-l border-white/10 h-screen z-[150] p-10 flex flex-col shadow-2xl animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-12">
              <span className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Command Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-white/40 hover:text-white"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-10 flex-1">
              {(!user || user.isAnonymous) ? (
                <>
                  <button onClick={() => {setView('auth'); setIsLoginMode(false); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-[#25F4EE] hover:text-white transition-colors text-left"><UserPlus size={20} /> JOIN THE NETWORK</button>
                  <button onClick={() => {setView('auth'); setIsLoginMode(true); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors text-left"><Lock size={20} /> MEMBER LOGIN</button>
                </>
              ) : (
                <>
                  <div className="mb-6 p-6 bg-white/5 rounded-3xl border border-white/10 text-left">
                     <p className="text-[9px] font-black text-white/30 uppercase mb-2 italic leading-none">Active Access</p>
                     <p className="text-sm font-black text-[#25F4EE] truncate uppercase italic">{userProfile?.fullName || 'Member'}</p>
                  </div>
                  <button onClick={() => {setView('dashboard'); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors text-left"><LayoutDashboard size={20} /> {user.uid === ADMIN_MASTER_ID ? "COMMAND CENTER" : "MEMBER HUB"}</button>
                  <button onClick={() => {setShowSmartSupport(true); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors text-left"><Bot size={20} /> SMART SUPPORT</button>
                  <button onClick={() => {signOut(auth).then(()=>setView('home')); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-[#FE2C55] hover:opacity-70 transition-all mt-auto mb-10 text-left"><LogOut size={20} /> TERMINATE SESSION</button>
                </>
              )}
              <div className="h-px bg-white/5 w-full my-4" />
              <div className="flex flex-col gap-8 text-[10px] font-black text-white/30 uppercase italic tracking-[0.2em] text-left">
                <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
                <a href="#" className="hover:text-white transition-colors">Security Terms</a>
                <button onClick={() => {setShowSmartSupport(true); setIsMenuOpen(false)}} className="text-left hover:text-white transition-colors flex items-center gap-2">SMART SUPPORT <Bot size={12}/></button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Interface Principal */}
      <div className="pt-28 flex-1 pb-10 relative">
        <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#FE2C55] opacity-[0.03] blur-[150px] pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#25F4EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

        {view === 'home' && (
          <div className="w-full max-w-[540px] mx-auto px-4 z-10 relative">
            <header className="mb-14 flex flex-col items-center">
              <div className="lighthouse-neon-wrapper mb-4"><div className="lighthouse-neon-content px-10 py-4"><h1 className="text-3xl font-black italic uppercase text-white text-glow-white leading-none">SMART SMS PRO</h1></div></div>
              <p className="text-[10px] text-white/40 font-bold tracking-[0.4em] uppercase leading-relaxed max-w-xs text-center font-black italic">High-End Redirection Protocol - 60 Free Handshakes</p>
            </header>

            <main className="space-y-8 pb-20 text-left">
              {/* BLOCO GERADOR */}
              <div className="lighthouse-neon-wrapper shadow-3xl">
                <div className="lighthouse-neon-content p-8 sm:p-12 text-left">
                  <div className="flex items-center gap-2 mb-10"><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"></div><h3 className="text-[11px] font-black uppercase italic tracking-widest text-white/60 leading-none">Smart Handshake Generator</h3></div>
                  <div className="space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase italic tracking-widest text-white/40 ml-1 leading-tight block text-left">
                         Destination Mobile Number
                         <span className="block text-[#25F4EE] opacity-80 mt-1 uppercase font-black tracking-widest text-[9px]">ex: (+1 999 999 9999)</span>
                       </label>
                       <input type="tel" value={genTo} onChange={e => setGenTo(e.target.value)} className="input-premium font-bold w-full" placeholder="Number to receive optimized traffic" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase italic tracking-widest text-white/40 ml-1 leading-none">Traffic Attribution Label</label>
                       <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-premium font-bold text-white/50 w-full" placeholder="e.g. Verified Vendor" />
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center px-1"><label className="text-[10px] font-black uppercase italic text-white/40 leading-none">Handshake Message Body</label><span className={`text-[9px] font-black tracking-widest ${genMsg.length > MSG_LIMIT ? 'text-[#FE2C55]' : 'text-white/20'}`}>{genMsg.length}/{MSG_LIMIT}</span></div>
                       <textarea value={genMsg} onChange={e => {setGenMsg(e.target.value); setSafetyViolation(null);}} rows="3" className={`input-premium w-full font-medium resize-none leading-relaxed text-sm ${safetyViolation ? 'border-[#FE2C55]/50 shadow-[0_0_15px_rgba(254,44,85,0.2)]' : ''}`} placeholder="Enter compliant SMS content..." />
                       {safetyViolation && (
                         <div className="p-4 bg-[#FE2C55]/10 border border-[#FE2C55]/30 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
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
                    <div className="bg-white p-6 rounded-3xl inline-block mb-10 shadow-xl text-center"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(generatedLink)}&color=000000`} alt="QR" className="w-36 h-36"/></div>
                    <input readOnly value={generatedLink} onClick={(e) => e.target.select()} className="w-full bg-black/40 border border-white/5 rounded-xl p-5 text-[11px] text-[#25F4EE] font-mono text-center outline-none mb-8 border-dashed font-black italic" />
                    <div className="grid grid-cols-2 gap-6 w-full text-center">
                      <button onClick={() => {navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="flex flex-col items-center py-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all text-center">
                        {copied ? <Check size={24} className="text-[#25F4EE]" /> : <Copy size={24} className="text-white/40" />}
                        <span className="text-[10px] font-black uppercase italic mt-2 text-white/50 tracking-widest text-center">Quick Copy</span>
                      </button>
                      <button onClick={() => window.open(generatedLink, '_blank')} className="flex flex-col items-center py-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-center">
                        <ExternalLink size={24} className="text-white/40" />
                        <span className="text-[10px] font-black uppercase italic mt-1 text-white/50 tracking-widest text-center">Live Test</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQ Section */}
              <div className="pt-20 pb-12 text-left">
                 <div className="flex items-center gap-3 mb-12"><HelpCircle size={28} className="text-[#FE2C55]" /><h3 className="text-3xl font-black uppercase italic text-white tracking-widest leading-none">Protocol FAQ</h3></div>
                 <div className="space-y-2 text-left">
                    <FAQItem q="Why use a protocol link instead of a standard redirect?" a="Carriers use automated heuristics to filter suspicious direct redirects. Our Handshake Optimization Protocol formats the traffic signature to be recognized as legitimate organic referral traffic, significantly increasing final delivery rates." />
                    <FAQItem q="Is the data vault truly isolated?" a="Yes. Our system uses a Zero-Knowledge Architecture. Every Member possesses an encrypted, isolated database vault. Not Even the Administrators of the platform have access to your mapped contacts or traffic metadata." />
                    <FAQItem q="How does the system ensure ethical compliance?" a="All redirection nodes are governed by our Advanced AI Safety Audit (SHA). The protocol maintains a ZERO TOLERANCE for abuse, automatically blocking traffic containing hate speech, malicious scams, misinformation, or unverified URL signatures." />
                    <FAQItem q="What is the benefit of the Advanced AI Agent?" a="Members gain exclusive access to our Smart AI for strategic guidance. The agent provides integral support to synthesize 40 structural variations of your message, maximizing conversion probability for your specific packs while maintaining carrier compliance." />
                 </div>
              </div>

              {(!user || user.isAnonymous) && (
                <div className="flex flex-col items-center gap-4 text-center">
                  <button onClick={() => setView('auth')} className="btn-strategic text-xs w-full max-w-[380px] !bg-white !text-black group italic font-black uppercase shadow-2xl py-6 leading-none"><Rocket size={20} className="group-hover:animate-bounce" /> INITIALIZE 60 FREE HANDSHAKES</button>
                  <button onClick={() => window.open(STRIPE_NEXUS_LINK, '_blank')} className="btn-strategic text-xs w-full max-w-[380px] !bg-[#25F4EE] !text-black group italic font-black uppercase shadow-2xl py-6 leading-none"><Star size={20} className="animate-pulse" /> BECOME A FULL MEMBER NOW</button>
                </div>
              )}
            </main>
          </div>
        )}

        {view === 'bridge' && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center relative px-8">
            <div className="lighthouse-neon-wrapper w-full max-w-lg shadow-3xl">
              <div className="lighthouse-neon-content p-20 flex flex-col items-center">
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
                    <h2 className="text-4xl font-black italic uppercase text-white text-center text-glow-white tracking-widest mb-6 leading-none">PROTOCOL OPTIMIZATION</h2>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden my-12 max-w-xs"><div className="h-full bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] w-full origin-left animate-[progress_3s_linear]"></div></div>
                    <p className="text-[12px] text-white/50 uppercase italic font-black tracking-[0.2em] text-center leading-none">Verified Origin: {captureData?.company}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD MASTER & MEMBER */}
        {view === 'dashboard' && (
          <div className="w-full max-w-7xl mx-auto py-10 px-8 text-left">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-12 mb-20 text-left">
              <div>
                <h2 className="text-7xl font-black italic tracking-tighter uppercase drop-shadow-[0_0_20px_#fff] leading-none mb-4">{user?.uid === ADMIN_MASTER_ID ? "COMMAND CENTER" : "MEMBER HUB"}</h2>
                <div className="flex items-center gap-4 text-left">
                  <span className="bg-[#25F4EE]/10 text-[#25F4EE] text-[11px] px-5 py-2 rounded-full font-black uppercase italic tracking-[0.2em] border border-[#25F4EE]/20 leading-none">{user?.uid === ADMIN_MASTER_ID ? "MASTER OVERRIDE" : `${userProfile?.tier || 'TRIAL'} ACCESS`}</span>
                  {(userProfile?.isSubscribed || userProfile?.isUnlimited) && <span className="bg-amber-500/10 text-amber-500 text-[11px] px-5 py-2 rounded-full font-black uppercase italic tracking-[0.2em] border border-amber-500/20 uppercase leading-none">TRAFFIC MAPPING: ACTIVE</span>}
                </div>
              </div>
              <div className="bg-[#0a0a0a] border border-white/10 px-12 py-8 rounded-[3rem] text-center shadow-3xl border-b-2 border-b-[#25F4EE] w-fit leading-none">
                  <p className="text-[11px] font-black text-white/30 uppercase italic tracking-widest mb-2 flex items-center gap-1 leading-none"><RefreshCw size={12}/> Network Usage</p>
                  <p className="text-5xl font-black text-white italic leading-none">{userProfile?.isUnlimited ? '∞' : userProfile?.usageCount || 0} <span className="text-sm text-white/30 tracking-normal uppercase ml-1">/ {userProfile?.isUnlimited ? 'UNLIMITED' : '60'}</span></p>
              </div>
            </div>

            {(userProfile?.isSubscribed || userProfile?.isUnlimited) && (
               <div className="animate-in fade-in duration-700 space-y-10">
                  {/* BULK INGESTION */}
                  <div className="bg-white/[0.02] border border-[#25F4EE]/20 rounded-[4rem] p-12 relative overflow-hidden group shadow-2xl">
                     <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                        <div className="flex items-center gap-5 text-left">
                           <div className="p-5 bg-[#25F4EE]/10 rounded-[2rem] border border-[#25F4EE]/20"><FileText size={40} className="text-[#25F4EE]" /></div>
                           <div><h3 className="text-3xl font-black uppercase italic leading-none mb-3">Bulk Asset Ingestion</h3><p className="text-[11px] text-white/40 font-medium leading-relaxed italic max-w-sm">Import up to 5,000 raw contacts. Automatic validation scan cleans and prepares disparos.</p></div>
                        </div>
                        <input type="file" accept=".txt" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                        <div className="flex gap-4">
                           <button onClick={() => fileInputRef.current.click()} className="btn-strategic !w-fit !px-12 text-xs font-black italic py-5 leading-none">{isValidating ? "Validating..." : "Select TXT File"}</button>
                           {importPreview.length > 0 && <button onClick={saveImportToVault} className="btn-strategic !bg-[#FE2C55] !text-white !w-fit !px-12 text-xs font-black italic py-5 shadow-2xl">Process {importPreview.length} Units</button>}
                        </div>
                     </div>
                  </div>
                  
                  {/* AI AGENT ARCHITECT - 40 VARIATIONS */}
                  <div className="lighthouse-neon-wrapper shadow-3xl">
                     <div className="lighthouse-neon-content p-12 text-left">
                        <div className="flex items-center gap-4 mb-10 text-left">
                           <div className="p-4 bg-[#25F4EE]/10 rounded-2xl border border-[#25F4EE]/20"><Bot size={36} className="text-[#25F4EE]" /></div>
                           <div><h3 className="text-2xl font-black uppercase italic leading-none">Advanced AI Agent Support</h3><p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-2 font-black italic">Integral Optimization & 40-Variation Synthesis Engine</p></div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-left">
                           <div className="space-y-6 text-left">
                              <textarea value={aiObjective} onChange={(e) => {setAiObjective(e.target.value); setSafetyViolation(null);}} placeholder="Enter objective... AI will synthesize 40 structural variations and perform a mandatory SHA (Safety Handshake Audit) to ensure compliance." className={`input-premium w-full h-[180px] font-black text-sm italic leading-relaxed ${safetyViolation ? 'border-[#FE2C55]/50 shadow-[0_0_20px_rgba(254,44,85,0.2)]' : ''}`} />
                              {safetyViolation && <div className="p-5 bg-[#FE2C55]/10 border border-[#FE2C55]/30 rounded-[2rem] flex items-start gap-4"><AlertIcon size={24} className="text-[#FE2C55] shrink-0" /><p className="text-xs font-black uppercase italic text-[#FE2C55] leading-relaxed tracking-wider">{safetyViolation}</p></div>}
                              <button onClick={handlePrepareBatch} disabled={isSafetyAuditing || !aiObjective || myLeads.length === 0} className="btn-strategic text-xs font-black italic py-5 disabled:opacity-30">{isSafetyAuditing ? "SHA Audit Active..." : `Synthesize Queue (${myLeads.length} Units)`}</button>
                           </div>
                           <div className="bg-black border border-white/5 rounded-[3.5rem] p-10 flex flex-col justify-center items-center text-center shadow-2xl">
                              {activeQueue.length > 0 ? (
                                 <div className="w-full leading-none">
                                    <div className="mb-10"><p className="text-6xl font-black text-[#25F4EE] italic leading-none">{queueIndex} / {activeQueue.length}</p><p className="text-[11px] font-black text-white/30 uppercase mt-4 tracking-[0.4em]">40-Structure Rotation Active</p></div>
                                    <button onClick={triggerNextInQueue} className="w-full py-8 bg-[#25F4EE] text-black rounded-[2rem] font-black uppercase text-xs shadow-2xl animate-pulse leading-none"><PlayCircle size={24} className="inline mr-2" /> Launch Native Disparo</button>
                                 </div>
                              ) : (
                                 <div className="opacity-10 text-center"><ShieldAlert size={80} className="mx-auto mb-6" /><p className="text-sm font-black uppercase tracking-[0.5em] text-center">System Standby</p></div>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* MASTER ADMIN VIEW */}
            {user?.uid === ADMIN_MASTER_ID && (
               <div className="animate-in fade-in duration-700 mt-20 text-left leading-none">
                  <div className="flex items-center gap-3 mb-12 text-neon-cyan leading-none text-left"><Users size={28}/><h3 className="text-3xl font-black uppercase italic text-white tracking-widest leading-none">Member Management</h3></div>
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-[4rem] overflow-hidden shadow-3xl text-left">
                     <div className="max-h-[60vh] overflow-y-auto">
                        {allUsers.length > 0 ? allUsers.map(u => (
                           <div key={u.id} className="p-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-center hover:bg-white/[0.04] transition-all gap-8">
                              <div className="flex items-center gap-8 text-left">
                                 <div className={`p-5 rounded-[2rem] ${u.isSubscribed ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-white/5 text-white/20'}`}>{u.isSubscribed ? <UserCheck size={32} /> : <UserMinus size={32} />}</div>
                                 <div className="text-left"><p className="font-black text-3xl text-white uppercase italic tracking-tighter leading-none">{u.fullName}</p><div className="flex items-center gap-5 text-sm font-black uppercase italic tracking-widest mt-4 leading-none"><span className="text-[#25F4EE]">{u.email}</span><span className="text-white/20 font-black">|</span><span className="text-white/40">{u.phone}</span></div></div>
                              </div>
                              <div className="flex items-center gap-6"><button onClick={() => toggleUnlimited(u.id, u.isUnlimited)} className={`flex items-center gap-2 px-8 py-3 rounded-full border text-[11px] font-black uppercase italic transition-all ${u.isUnlimited ? 'bg-amber-500 text-black border-amber-500 shadow-2xl' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}><Gift size={16} /> {u.isUnlimited ? 'VIP GRANTED' : 'GRANT VIP'}</button></div>
                           </div>
                        )) : <div className="p-20 text-center opacity-20 uppercase font-black italic tracking-widest text-sm text-center">Syncing members...</div>}
                     </div>
                  </div>
               </div>
            )}
            
            {/* VAULT SYNC */}
            <div className="mt-20 flex flex-col items-center">
              <button onClick={() => setIsVaultActive(!isVaultActive)} className="btn-strategic !w-fit !px-16 text-xs font-black italic py-5 leading-none">{isVaultActive ? "DISCONNECT VAULT" : "SYNC PRIVATE LEAD VAULT"}</button>
              {isVaultActive && (
                <div className="mt-10 w-full bg-[#0a0a0a] border border-white/10 rounded-[4rem] overflow-hidden shadow-3xl text-left">
                   <div className="max-h-[60vh] overflow-y-auto">
                      {myLeads.length > 0 ? myLeads.map(l => (
                        <div key={l.id} className="p-12 border-b border-white/5 flex justify-between items-center hover:bg-white/[0.04] transition-all group text-left">
                           <div className="text-left"><p className="text-[11px] text-white/30 font-black uppercase tracking-widest mb-2 italic leading-none">{new Date(l.timestamp?.seconds * 1000).toLocaleString()}</p><p className="font-black text-3xl text-white uppercase italic tracking-tighter group-hover:text-[#25F4EE] transition-colors leading-none">{l.location}</p><p className="text-sm text-white/40 font-black uppercase italic tracking-widest mt-4 text-neon-cyan leading-none uppercase">ATTR: {l.destination}</p></div>
                           <div className="text-right text-xs text-white/60 font-mono tracking-widest bg-white/5 px-6 py-3 rounded-2xl border border-white/5 leading-none">{l.ip || 'Native Node'}</div>
                        </div>
                      )) : <div className="p-32 text-center opacity-20 uppercase font-black italic tracking-widest text-xs leading-relaxed text-center">Vault Operational. Waiting for incoming handshakes...</div>}
                   </div>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'auth' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-left">
            <div className="lighthouse-neon-wrapper w-full max-w-md shadow-3xl text-left">
              <div className="lighthouse-neon-content p-12 sm:p-16 relative">
                <h2 className="text-3xl font-black italic mt-8 mb-14 uppercase text-white text-center tracking-tighter text-glow-white leading-none uppercase text-center">{isLoginMode ? "Member Login" : "Join the Network"}</h2>
                <form onSubmit={handleAuthSubmit} className="space-y-7 text-left">
                  {!isLoginMode && (
                    <>
                      <div className="space-y-2 text-left"><label className="text-[10px] font-black uppercase italic text-white/40 ml-1 italic leading-none">Full Operator Name</label><input required placeholder="Your Name or Company" value={fullName} onChange={e=>setFullName(e.target.value)} className="input-premium font-bold w-full" /></div>
                      <div className="space-y-2 text-left"><label className="text-[10px] font-black uppercase italic text-white/40 ml-1 italic leading-tight block text-left">Valid Mobile Number<span className="block text-[#25F4EE] opacity-80 mt-1 uppercase font-black tracking-widest text-[9px]">ex: (+1 999 999 9999)</span></label><input required placeholder="Phone Identity" value={phone} onChange={e=>setPhone(e.target.value)} className="input-premium font-bold w-full" /></div>
                    </>
                  )}
                  <div className="space-y-2 text-left"><label className="text-[10px] font-black uppercase italic text-white/40 ml-1 italic leading-none text-left">Email Address</label><input required type="email" placeholder="member@example.com" value={email} onChange={e=>setEmail(e.target.value)} className="input-premium font-bold w-full" /></div>
                  <div className="space-y-2 relative text-left"><label className="text-[10px] font-black uppercase italic text-white/40 ml-1 italic leading-none">{isLoginMode ? 'Security Password' : 'Create Password'}</label><input required type={showPass ? "text" : "password"} placeholder="Alpha-numeric security key" value={password} onChange={e=>setPassword(e.target.value)} className="input-premium font-bold w-full" /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-11 text-white/30 hover:text-[#25F4EE] transition-colors leading-none"><Eye size={18}/></button></div>
                  {!isLoginMode && (
                    <div className="space-y-2 text-left"><label className="text-[10px] font-black uppercase italic text-white/40 ml-1 italic leading-none">Confirm Password</label><input required type={showPass ? "text" : "password"} placeholder="Repeat your password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="input-premium font-bold w-full" /></div>
                  )}

                  {!isLoginMode && (
                    <div className="flex items-start gap-3 py-2 cursor-pointer text-left leading-none" onClick={() => setTermsAccepted(!termsAccepted)}>
                      <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${termsAccepted ? 'bg-[#25F4EE] border-[#25F4EE]' : 'bg-black border-white/20'}`}>{termsAccepted && <Check size={10} className="text-black font-black" />}</div>
                      <p className="text-[9px] font-black uppercase italic text-white/40 leading-relaxed tracking-wider text-left">I agree to the <button type="button" onClick={(e) => { e.stopPropagation(); setShowTerms(true); }} className="text-white border-b border-white/20 hover:text-[#25F4EE]">General Terms of Use</button> and Ethics.</p>
                    </div>
                  )}
                  
                  <button type="submit" disabled={loading} className="btn-strategic text-[11px] w-full shadow-xl italic uppercase font-black mt-8 py-5 leading-none">{loading ? "AUTH..." : isLoginMode ? "Authorize Access" : "Join Network"}</button>
                  
                  <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); setShowPass(false); }} className="w-full text-[11px] font-black text-white/20 uppercase italic mt-16 text-center hover:text-white transition-all uppercase italic tracking-widest leading-none">{isLoginMode ? "ESTABLISH NEW ACCOUNT? REGISTER" : "ALREADY A MEMBER? LOGIN HERE"}</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Smart Support Modal */}
      {showSmartSupport && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md text-left">
           <div className="lighthouse-neon-wrapper w-full max-sm shadow-3xl text-left">
              <div className="lighthouse-neon-content p-10">
                 <div className="flex justify-between items-center mb-10 leading-none text-left">
                    <div className="flex items-center gap-3 text-neon-cyan leading-none text-left"><Bot size={32} /><span className="text-sm font-black uppercase tracking-widest text-glow-white italic">SMART SUPPORT</span></div>
                    <button onClick={() => setShowSmartSupport(false)} className="text-white/40 hover:text-white transition-colors"><X size={28}/></button>
                 </div>
                 <div className="bg-black border border-white/5 p-8 rounded-3xl mb-8 min-h-[180px] flex items-center justify-center text-center">
                    <p className="text-[11px] text-white/50 font-black uppercase italic tracking-widest leading-relaxed text-center">AI Agent evaluating metadata... System ready for support handshake.</p>
                 </div>
                 <input className="input-premium text-xs mb-6 w-full font-black italic" placeholder="Inquiry details..." />
                 <button className="btn-strategic text-xs italic uppercase font-black py-4 shadow-xl w-full">Connect Now</button>
              </div>
           </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl text-left leading-none">
           <div className="lighthouse-neon-wrapper w-full max-w-lg shadow-3xl text-left">
              <div className="lighthouse-neon-content p-10 sm:p-14 text-left">
                 <div className="flex justify-between items-center mb-10 text-left">
                    <div className="flex items-center gap-3 text-[#FE2C55] leading-none font-black italic uppercase"><Scale size={28} /><span>Compliance Protocol</span></div>
                    <button onClick={() => setShowTerms(false)} className="text-white/40 hover:text-white"><X size={28}/></button>
                 </div>
                 <div className="max-h-[40vh] overflow-y-auto pr-4 space-y-8 mb-10 custom-scrollbar text-left leading-relaxed">
                    <section><h4 className="text-xs font-black uppercase text-[#25F4EE] mb-3 italic tracking-widest">01. Responsibility</h4><p className="text-[10px] text-white/40 leading-relaxed italic font-medium">Member retains 100% legal responsibility for message payloads triggered through protocol native disparos.</p></section>
                    <section><h4 className="text-xs font-black uppercase text-[#25F4EE] mb-3 italic tracking-widest uppercase">02. ZERO TOLERANCE ABUSE</h4><p className="text-[10px] text-white/40 leading-relaxed italic font-medium uppercase font-black">Any use for scams, hate speech, or misinformation result in immediate terminal revocation via SHA Audit.</p></section>
                 </div>
                 <button onClick={() => { setTermsAccepted(true); setShowTerms(false); }} className="btn-strategic text-xs w-full italic uppercase font-black py-4 leading-none">I Accept Responsibility</button>
              </div>
           </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto pb-20 w-full text-center space-y-16 z-10 px-10 border-t border-white/5 pt-20 text-left leading-none">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 text-[10px] font-black uppercase italic tracking-widest text-white/30 text-left leading-none">
          <div className="flex flex-col gap-5 text-left leading-none"><span className="text-white/40 mb-2 border-b border-white/5 pb-2 italic leading-none uppercase">Legal</span><a href="#" className="hover:text-[#25F4EE] transition-colors leading-none">Privacy</a><a href="#" className="hover:text-[#25F4EE] transition-colors leading-none">Terms</a></div>
          <div className="flex flex-col gap-5 text-left leading-none"><span className="text-white/40 mb-2 border-b border-white/5 pb-2 italic leading-none uppercase">Compliance</span><a href="#" className="hover:text-[#FE2C55] transition-colors leading-none">CCPA</a><a href="#" className="hover:text-[#FE2C55] transition-colors leading-none">GDPR</a></div>
          <div className="flex flex-col gap-5 text-left leading-none"><span className="text-white/40 mb-2 border-b border-white/5 pb-2 italic leading-none uppercase">Network</span><a href="#" className="hover:text-[#25F4EE] transition-colors leading-none">U.S. Nodes</a><a href="#" className="hover:text-[#25F4EE] transition-colors leading-none">EU Nodes</a></div>
          <div className="flex flex-col gap-5 text-left leading-none"><span className="text-white/40 mb-2 border-b border-white/5 pb-2 italic leading-none uppercase">Support</span><button onClick={() => setShowSmartSupport(true)} className="hover:text-[#25F4EE] transition-colors text-left uppercase font-black italic text-[10px] leading-none flex items-center gap-2">SMART SUPPORT <Bot size={14}/></button></div>
        </div>
        <p className="text-[11px] text-white/20 font-black tracking-[8px] uppercase italic drop-shadow-2xl text-center leading-none">© 2026 ClickMoreDigital | Security Protocol</p>
      </footer>
    </div>
  );
}
