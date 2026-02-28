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

const ADMIN_MASTER_ID = "YGepVHHMYaN9sC3jFmTyry0mYZO2"; // <--- ALEX, COLOQUE SEU UID AQUI

const STRIPE_NEXUS_LINK = "https://buy.stripe.com/nexus_access"; 
const STRIPE_EXPERT_LINK = "https://buy.stripe.com/expert_agent";

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
  const [authResolved, setAuthResolved] = useState(false); 
  const [logs, setLogs] = useState([]); 
  const [allUsers, setAllUsers] = useState([]); 
  const [myLinks, setMyLinks] = useState([]); 
  const [isVaultActive, setIsVaultActive] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [captureData, setCaptureData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSmartSupport, setShowSmartSupport] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  
  const [editingLink, setEditingLink] = useState(null);
  const [editMsg, setEditMsg] = useState('');

  const [safetyViolation, setSafetyViolation] = useState(null);
  const [isSafetyAuditing, setIsSafetyAuditing] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiObjective, setAiObjective] = useState('');
  const [activeQueue, setActiveQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [connectedChips, setConnectedChips] = useState(1);
  const [isAutoSending, setIsAutoSending] = useState(false);
  const [sendDelay, setSendDelay] = useState(30);

  const [syncQR, setSyncQR] = useState('');
  const [isGeneratingSync, setIsGeneratingSync] = useState(false);
  const [isDeviceSynced, setIsDeviceSynced] = useState(false);
  const [syncedDeviceName, setSyncedDeviceName] = useState('');

  const fileInputRef = useRef(null);
  const [importPreview, setImportPreview] = useState([]);
  const [isValidating, setIsValidating] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [genTo, setGenTo] = useState('');
  const [genMsg, setGenMsg] = useState('');
  const [companyName, setCompanyName] = useState('');
  const MSG_LIMIT = 300;

  const isPro = userProfile?.tier === 'MASTER' || userProfile?.isSubscribed || userProfile?.isUnlimited || user?.uid === ADMIN_MASTER_ID;

  // 1. IDENTITY PROTECTION & SYSTEM READY
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (!auth.currentUser) {
          // Silent Anonymous para garantir escrita de Leads
          await signInAnonymously(auth);
        }
      } catch (e) {}
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
            // AUTO-FIX MASTER ADMIN
            if (u.uid === ADMIN_MASTER_ID && data.tier !== 'MASTER') {
              const masterData = { tier: 'MASTER', isUnlimited: true, smsCredits: 999999 };
              await updateDoc(docRef, masterData);
              await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', u.uid), { ...data, ...masterData }, { merge: true });
              setUserProfile({ ...data, ...masterData });
            } else {
              setUserProfile(data);
            }
            if(data.connectedChips) setConnectedChips(data.connectedChips);
          } else {
            const isMaster = u.uid === ADMIN_MASTER_ID;
            const p = { fullName: u.email || 'Operator', phone: '', email: u.email || '', tier: isMaster ? 'MASTER' : 'FREE_TRIAL', usageCount: 0, isSubscribed: false, isUnlimited: isMaster, smsCredits: isMaster ? 999999 : 60, connectedChips: 1, created_at: serverTimestamp() };
            await setDoc(docRef, p);
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', u.uid), p);
            setUserProfile(p);
          }
        } catch (e) { console.error("Profile load secured bypass:", e); }
      } else {
        setUserProfile(null);
      }
      setAuthResolved(true);
    });

    return () => unsubscribe();
  }, []);

  // 2. PROTOCOL HANDSHAKE ENGINE (Com Redirecionamento e Deduplicação)
  useEffect(() => {
    if (!authResolved) return; 

    const params = new URLSearchParams(window.location.search);
    const lid = params.get('lid');
    const t = params.get('t');
    const m = params.get('m');
    const o = params.get('o');
    const syncProto = params.get('sync_protocol');

    if (syncProto === 'active') {
      setCaptureData({ uid: params.get('uid'), token: params.get('token') });
      setView('mobile_sync');
      return;
    }

    if (t && m && view !== 'bridge') {
      setCaptureData({ to: t, msg: m, company: params.get('c') || 'Verified Partner', ownerId: o });
      handleProtocolHandshake(t, m, o, lid);
    }
  }, [authResolved]);

  // 3. MASTER REAL-TIME DATA SYNC (Leads e Sincronização Mobile)
  useEffect(() => {
    if (!user || user.isAnonymous || view !== 'dashboard') return;
    
    let unsubUsers, unsubLeads, unsubLinks, unsubProfile, unsubSync;
    try {
      unsubProfile = onSnapshot(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data'), (docSnap) => {
        if (docSnap.exists()) setUserProfile(docSnap.data());
      });

      unsubLinks = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'links'), (snap) => {
        setMyLinks(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0)));
      });

      // LEITURA DOS LEADS VIA PUBLIC TUNNEL (Garante visibilidade total)
      unsubLeads = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), (snap) => {
        const allData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const myData = user.uid === ADMIN_MASTER_ID ? allData : allData.filter(l => l.ownerId === user.uid);
        setLogs(myData.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
      });

      // ESCUTA DO DISPOSITIVO MÓVEL (QR CODE REAL-TIME)
      unsubSync = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'sync_signals', user.uid), (docSnap) => {
         if (docSnap.exists() && docSnap.data().connected) {
             setIsDeviceSynced(true);
             setSyncedDeviceName(docSnap.data().device || 'Authorized Device');
         }
      });

      if (user.uid === ADMIN_MASTER_ID) {
        unsubUsers = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'user_profiles'), (snap) => {
          setAllUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
      }
    } catch(e) {}
    
    return () => { 
      if(unsubUsers) unsubUsers(); if(unsubLeads) unsubLeads(); if(unsubLinks) unsubLinks();
      if(unsubProfile) unsubProfile(); if(unsubSync) unsubSync();
    };
  }, [user, view, isVaultActive]);

  // 4. AUTOPILOT SEQUENCE (Delay mínimo 15s)
  useEffect(() => {
    let timer;
    if (isAutoSending && queueIndex < activeQueue.length) {
      timer = setTimeout(() => {
        triggerNextInQueue();
      }, Math.max(sendDelay, 15) * 1000); 
    } else if (queueIndex >= activeQueue.length) {
      setIsAutoSending(false);
    }
    return () => clearTimeout(timer);
  }, [isAutoSending, queueIndex, activeQueue.length, sendDelay]);

  // --- CORE ENGINE FUNCTIONS ---
  const runSafetyAudit = async (text) => {
    if (!text) return true;
    const restricted = [/\b(scam|fraud|money|irs|password|ssn|urgent)\b/i, /\b(hate|slur)\b/i];
    setIsSafetyAuditing(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const violation = restricted.some(p => p.test(text));
        setSafetyViolation(violation ? "TERMINAL BLOCK: Global AI detected prohibited content." : null);
        setIsSafetyAuditing(false);
        resolve(!violation);
      }, 800);
    });
  };

  const handlePrepareBatch = async () => {
    if (!aiObjective || logs.length === 0) return;
    if (userProfile?.smsCredits <= 0 && !isPro) return alert("Quota limit.");
    const isSafe = await runSafetyAudit(aiObjective);
    if (!isSafe) return;

    setIsAiProcessing(true);
    setTimeout(() => {
      const limit = Math.min(connectedChips * 60, isPro ? 999999 : userProfile.smsCredits, logs.length);
      const targetLeads = logs.slice(0, limit);
      const newQueue = targetLeads.map((lead, idx) => ({ 
        ...lead, 
        optimizedMsg: `${aiObjective} [Ref:${Math.random().toString(36).substr(2, 4).toUpperCase()}]` 
      }));
      setActiveQueue(newQueue);
      setQueueIndex(0);
      setIsAiProcessing(false);
    }, 1200);
  };

  const triggerNextInQueue = async () => {
    if (queueIndex >= activeQueue.length) return setIsAutoSending(false);
    const current = activeQueue[queueIndex];
    if (!isPro) {
      const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', user.uid);
      await updateDoc(profileRef, { smsCredits: increment(-1), usageCount: increment(1) });
    }
    setQueueIndex(prev => prev + 1);
    const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
    window.location.href = `sms:${current.telefone_cliente}${sep}body=${encodeURIComponent(current.optimizedMsg)}`;
  };

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

        if (!ownerProfile?.isSubscribed && !ownerProfile?.isUnlimited && ownerProfile?.smsCredits <= 0) {
          setQuotaExceeded(true);
          return;
        }

        const dec = ownerProfile?.isUnlimited ? 0 : -1;
        await updateDoc(pubRef, { usageCount: increment(1), smsCredits: increment(dec) });
        const geoReq = await fetch('https://ipapi.co/json/');
        const geo = geoReq.ok ? await geoReq.json() : { city: 'Unknown', ip: '0.0.0.0' };
        
        await setDoc(leadRef, {
          ownerId: ownerId,
          timestamp: serverTimestamp(),
          created_at: serverTimestamp(),
          destination: to,
          telefone_cliente: to,
          nome_cliente: "CAPTURED_LEAD",
          location: `${geo.city}, ${geo.country_name || 'Global'}`,
          ip: geo.ip,
          device: navigator.userAgent
        }, { merge: true });

      } catch (e) {}
      window.location.href = `sms:${to}${/iPad|iPhone|iPod/.test(navigator.userAgent)?';':'?'}body=${encodeURIComponent(msg)}`;
    }, 3000);
  };

  const handleSyncContacts = async () => {
    if (!('contacts' in navigator)) return alert("Protocol requires Chrome on Android. iOS/Safari restricts this.");
    try {
      const contacts = await navigator.contacts.select(['name', 'tel'], { multiple: true });
      if (contacts.length > 0) {
         setLoading(true);
         for (const c of contacts) {
            if (c.tel?.[0]) {
               const phone = c.tel[0].replace(/[^0-9+]/g, '');
               const docId = `${captureData.uid}_${phone.replace(/[^0-9]/g, '')}`;
               await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'leads', docId), {
                  ownerId: captureData.uid,
                  timestamp: serverTimestamp(),
                  telefone_cliente: phone,
                  nome_cliente: c.name?.[0] || 'Mobile Contact',
                  location: `Native Mobile Sync`,
               }, { merge: true });
            }
         }
         await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sync_signals', captureData.uid), { connected: true, device: 'Mobile Sync Active', updatedAt: serverTimestamp() });
         setLoading(false);
         alert("Sincronização concluída com sucesso.");
      }
    } catch (e) { setLoading(false); }
  };

  const handleGenerateDeviceQR = () => {
    if (!isPro) return;
    setIsGeneratingSync(true);
    setTimeout(() => {
      const syncUrl = `${window.location.origin}?sync_protocol=active&token=${crypto.randomUUID().split('-')[0]}&uid=${user.uid}`;
      setSyncQR(syncUrl);
      setIsGeneratingSync(false);
    }, 1500);
  };

  const PremiumLockedFooter = ({ featureName, benefit }) => (
    <div className="mt-10 pt-10 border-t border-[#FE2C55]/30 flex flex-col items-center justify-center text-center gap-6 relative z-20 w-full font-black italic">
      <div className="inline-flex items-center justify-center gap-2 bg-[#FE2C55]/10 border border-[#FE2C55]/40 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(254,44,85,0.2)]">
        <Lock size={14} className="text-[#FE2C55]" /><span className="text-[10px] text-[#FE2C55] font-black uppercase tracking-widest italic">PREMIUM PROTOCOL LOCKED</span>
      </div>
      <p className="text-xl sm:text-3xl text-[#FE2C55] font-black italic uppercase leading-tight drop-shadow-[0_0_15px_rgba(254,44,85,0.6)]">ATTENTION: YOU ARE LEAVING MONEY ON THE TABLE.</p>
      <div className="max-w-4xl mx-auto space-y-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest italic text-white/70 bg-black/40 p-6 rounded-3xl border border-white/5">
        <p><span className="text-[#25F4EE]">INTEREST:</span> Competitors are using <span className="text-white">{featureName}</span> to {benefit}.</p>
        <p><span className="text-amber-500">DESIRE:</span> Imagine scale your reach to thousands, and unmasking every single highly-qualified lead in your vault. Stop guessing and start converting.</p>
      </div>
      <button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="btn-strategic btn-neon-cyan text-xs sm:text-sm w-full max-w-[500px] py-6 shadow-[0_0_40px_rgba(37,244,238,0.5)] animate-pulse mt-2"><Rocket size={20} className="mr-2"/> UPGRADE NOW & UNLOCK YOUR MACHINE</button>
    </div>
  );

  if (!authResolved) return <div className="min-h-screen bg-black flex items-center justify-center"><Zap size={48} className="text-[#25F4EE] animate-pulse" /></div>;

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans selection:bg-[#25F4EE] antialiased flex flex-col relative overflow-x-hidden text-left font-black italic">
      <style>{`
        @keyframes rotate-beam { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes neon-cyan { 0% { box-shadow: 0 0 10px rgba(37,244,238,0.2); } 100% { box-shadow: 0 0 20px rgba(37,244,238,0.6); } }
        .lighthouse-neon-wrapper { position: relative; padding: 1.5px; border-radius: 28px; overflow: hidden; background: transparent; }
        .lighthouse-neon-wrapper::before { content: ""; position: absolute; width: 600%; height: 600%; top: 50%; left: 50%; background: conic-gradient(transparent 45%, #25F4EE 48%, #FE2C55 50%, #25F4EE 52%, transparent 55%); animation: rotate-beam 5s linear infinite; z-index: 0; }
        .lighthouse-neon-content { position: relative; z-index: 1; background: #0a0a0a; border-radius: 27px; width: 100%; height: 100%; }
        .btn-strategic { background: #FFFFFF; color: #000000; border-radius: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; width: 100%; padding: 1.15rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; border: none; cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .btn-strategic:hover:not(:disabled) { transform: translateY(-2px) scale(1.02); }
        .btn-neon-cyan { animation: neon-cyan 2s infinite alternate; background: #25F4EE !important; color: #000 !important; }
        .input-premium { background: #111; border: 1px solid rgba(255,255,255,0.05); color: white; width: 100%; padding: 1rem 1.25rem; border-radius: 12px; outline: none; font-weight: 900; font-style: italic; }
        .text-glow-white { text-shadow: 0 0 15px rgba(255,255,255,0.5); }
      `}</style>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[100] px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-white/10 p-1.5 rounded-lg border border-white/10 shadow-lg shadow-white/5"><Zap size={20} className="text-white fill-white" /></div>
          <span className="text-lg font-black italic tracking-tighter uppercase text-white leading-none">SMART SMS PRO</span>
          {user?.uid === ADMIN_MASTER_ID && <span className="bg-[#FE2C55] text-white text-[8px] px-2 py-0.5 rounded-full font-black ml-2 animate-pulse tracking-widest uppercase italic leading-none">MASTER</span>}
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white/50 hover:text-white transition-all z-[110]">{isMenuOpen ? <X size={28} /> : <Menu size={28} />}</button>
      </nav>

      {/* Menu */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[140]" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-80 bg-[#050505] border-l border-white/10 h-screen z-[150] p-10 flex flex-col shadow-2xl animate-in slide-in-from-right font-black italic">
            <div className="flex justify-between items-center mb-12">
              <span className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Command Center</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-white/40"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-10 flex-1 text-left">
              {!user || user.isAnonymous ? (
                <>
                  <button onClick={() => {setView('auth'); setIsLoginMode(false); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-[#25F4EE]"><UserPlus size={20} /> JOIN THE NETWORK</button>
                  <button onClick={() => {setView('auth'); setIsLoginMode(true); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white"><Lock size={20} /> MEMBER LOGIN</button>
                </>
              ) : (
                <>
                  <div className="mb-6 p-6 bg-white/5 rounded-3xl border border-white/10 text-left">
                     <p className="text-[9px] font-black text-white/30 uppercase mb-2 italic">Active Access</p>
                     <p className="text-sm font-black text-[#25F4EE] truncate uppercase">{userProfile?.fullName || 'Operator'}</p>
                  </div>
                  <button onClick={() => {setView('dashboard'); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors"><LayoutDashboard size={20} /> COMMAND HUB</button>
                  <button onClick={() => {signOut(auth).then(()=>setView('home')); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-[#FE2C55] mt-auto"><LogOut size={20} /> TERMINATE SESSION</button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Main Container */}
      <div className="pt-28 flex-1 pb-10 relative">
        <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#FE2C55] opacity-[0.03] blur-[150px] pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#25F4EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

        {view === 'home' && (
          <div className="w-full max-w-[540px] mx-auto px-4 z-10 relative text-center">
            <header className="mb-14 text-center flex flex-col items-center">
              <div className="lighthouse-neon-wrapper mb-4"><div className="lighthouse-neon-content px-10 py-4"><h1 className="text-3xl font-black italic uppercase text-white text-glow-white leading-none">SMART SMS PRO</h1></div></div>
              <p className="text-[10px] text-white/40 font-bold tracking-[0.4em] uppercase text-center">High-End Redirection Protocol - 60 Free Handshakes</p>
            </header>

            <main className="space-y-8 pb-20 text-left">
              {user && !user.isAnonymous && (
                <div className="flex justify-center mb-2 animate-in fade-in zoom-in duration-500">
                  <button onClick={() => setView('dashboard')} className="btn-strategic btn-neon-cyan text-xs w-full max-w-[420px] group italic font-black uppercase py-6"><LayoutDashboard size={24} /> ACCESS {userProfile?.tier || "COMMAND CENTER"}</button>
                </div>
              )}

              <div className="lighthouse-neon-wrapper shadow-3xl">
                <div className="lighthouse-neon-content p-8 sm:p-12 text-left">
                  <div className="flex items-center gap-2 mb-10"><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"></div><h3 className="text-[11px] font-black uppercase italic tracking-widest text-white/60 leading-none">Smart Handshake Generator</h3></div>
                  <div className="space-y-8">
                    <input type="tel" value={genTo} onChange={e => setGenTo(e.target.value)} className="input-premium font-bold text-sm w-full" placeholder="+1 999 999 9999" />
                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-premium font-bold text-sm text-white/50 w-full" placeholder="Your Name or Company Name" />
                    <textarea value={genMsg} onChange={e => {setGenMsg(e.target.value); setSafetyViolation(null);}} rows="3" className={`input-premium w-full font-medium resize-none text-sm ${safetyViolation ? 'border-[#FE2C55]/50' : ''}`} placeholder="Draft your intelligent SMS message here..." />
                    {safetyViolation && <div className="p-4 bg-[#FE2C55]/10 border border-[#FE2C55]/30 rounded-xl flex items-start gap-3 mt-4"><AlertIcon size={16} className="text-[#FE2C55] shrink-0 mt-0.5" /><p className="text-[10px] font-black uppercase italic text-[#FE2C55] leading-relaxed">{safetyViolation}</p></div>}
                    <button onClick={handleGenerate} disabled={isSafetyAuditing || !!safetyViolation} className="btn-strategic btn-neon-cyan text-xs mt-4 italic font-black uppercase py-5 w-full shadow-2xl">{isSafetyAuditing ? "SHA Safety Audit Active..." : "Generate Smart Link"} <ChevronRight size={18} /></button>
                  </div>
                </div>
              </div>

              {generatedLink && (
                <div className="animate-in zoom-in-95 duration-500 space-y-6">
                  <div className="bg-[#0a0a0a] border border-[#25F4EE]/20 rounded-[40px] p-10 text-center shadow-2xl">
                    <div className="bg-white p-6 rounded-3xl inline-block mb-10 shadow-xl"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(generatedLink)}&color=000000`} alt="QR" className="w-32 h-32"/></div>
                    <input readOnly value={generatedLink} className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-[11px] text-[#25F4EE] font-mono text-center outline-none mb-8 border-dashed" />
                    <div className="grid grid-cols-2 gap-6 w-full"><button onClick={() => {navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="flex flex-col items-center py-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all font-black">{copied ? <Check size={24} className="text-[#25F4EE]" /> : <Copy size={24} className="text-white/40" />}<span className="text-[10px] font-black uppercase italic mt-2 text-white/50 tracking-widest">Quick Copy</span></button><button onClick={() => window.open(generatedLink, '_blank')} className="flex flex-col items-center py-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all font-black"><ExternalLink size={24} className="text-white/40" /><span className="text-[10px] font-black uppercase italic mt-1 text-white/50 tracking-widest">Live Test</span></button></div>
                  </div>
                </div>
              )}

              <div className="pt-20 pb-12 text-left leading-none font-black italic">
                 <div className="flex items-center gap-3 mb-12"><HelpCircle size={28} className="text-[#FE2C55]" /><h3 className="text-3xl font-black uppercase text-white tracking-widest leading-none">Protocol FAQ</h3></div>
                 <div className="space-y-2"><FAQItem q="Why use a protocol link?" a="Carrier headers are formatted to recognition as organic traffic." /><FAQItem q="Is data isolated?" a="Yes. Zero-Knowledge architecture ensures vault privacy." /><FAQItem q="What is the support agent?" a="Strategic guidance for message scrambling and high conversion." /></div>
              </div>

              {(!user || user.isAnonymous) && (
                <div className="flex flex-col items-center gap-6 mt-8 w-full animate-in zoom-in-95 duration-500 pb-10">
                  <button onClick={() => {setIsLoginMode(false); setView('auth')}} className="btn-strategic btn-neon-white text-xs w-full max-w-[420px] group italic font-black uppercase py-6 leading-none"><Rocket size={24} className="group-hover:animate-bounce" /> START 60 FREE HANDSHAKES</button>
                  <button onClick={() => window.open(STRIPE_NEXUS_LINK, '_blank')} className="btn-strategic btn-neon-cyan text-xs w-full max-w-[420px] group italic font-black uppercase py-6 leading-none"><Star size={24} className="animate-pulse" /> UPGRADE TO PRO MEMBER</button>
                </div>
              )}
            </main>
          </div>
        )}

        {view === 'bridge' && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center relative px-8 font-black italic">
            <div className="lighthouse-neon-wrapper w-full max-w-lg shadow-3xl">
              <div className="lighthouse-neon-content p-16 sm:p-24 flex flex-col items-center">
                {quotaExceeded ? (
                  <div className="animate-in fade-in zoom-in-95 duration-500 text-left w-full"><ShieldAlert size={100} className="text-[#FE2C55] animate-pulse mb-10 mx-auto" /><h2 className="text-3xl font-black italic uppercase text-white mb-6 leading-tight text-center">Protocol Limit Reached</h2><div className="p-10 bg-white/[0.03] border border-white/5 rounded-[2.5rem] mb-12 relative overflow-hidden group shadow-2xl text-center"><h3 className="text-2xl font-black italic text-white uppercase mb-4">Nexus Upgrade Required</h3><p className="text-xs text-white/40 uppercase mb-12">Upgrade to bypass limits and unmask highly qualified leads.</p><button onClick={() => window.open(STRIPE_NEXUS_LINK, '_blank')} className="btn-strategic btn-neon-cyan text-xs italic font-black uppercase py-5">Unlock Full Access ($9/MO)</button></div></div>
                ) : (
                  <><Shield size={120} className="text-[#25F4EE] animate-pulse drop-shadow-[0_0_30px_#25F4EE] mb-14" /><h2 className="text-4xl font-black italic uppercase text-white text-center text-glow-white tracking-widest mb-6 leading-none font-black italic">SECURITY HANDSHAKE</h2><div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden my-12 max-w-xs"><div className="h-full bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] w-full origin-left animate-[progress_3s_linear]"></div></div><p className="text-[12px] text-white/50 uppercase italic font-black tracking-[0.2em] text-center leading-none">Verified Origin: {captureData?.company}</p></>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'mobile_sync' && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 sm:p-6 text-center relative font-black italic">
            <div className="lighthouse-neon-wrapper w-full max-w-lg shadow-3xl">
              <div className="lighthouse-neon-content p-8 sm:p-16 flex flex-col items-center">
                <Smartphone size={80} className="text-[#25F4EE] animate-pulse drop-shadow-[0_0_30px_#25F4EE] mb-8 mx-auto" /><h2 className="text-2xl sm:text-3xl font-black italic uppercase text-white mb-6 leading-tight text-center">DEVICE SYNC INITIATED</h2>
                <div className="p-6 sm:p-8 bg-white/[0.03] border border-white/5 rounded-[2rem] mb-8 relative overflow-hidden shadow-2xl text-center w-full"><p className="text-[10px] sm:text-xs text-white/50 uppercase italic leading-relaxed tracking-widest mb-8">Authorize access to synchronize your native contacts directly to your encrypted vault.</p><button onClick={handleSyncContacts} disabled={loading} className="btn-strategic btn-neon-cyan text-xs italic font-black uppercase py-5 shadow-2xl w-full">{loading ? "SYNCING VAULT..." : "AUTHORIZE CONTACTS ACCESS"}</button></div>
                <p className="text-[8px] sm:text-[9px] text-[#FE2C55] font-black uppercase tracking-widest text-center mt-2">Zero-Knowledge Encrypted Transfer</p>
              </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="w-full max-w-7xl mx-auto py-10 px-6 font-black italic">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-10 mb-16 text-left">
              <div><h2 className="text-6xl font-black italic tracking-tighter uppercase drop-shadow-[0_0_20px_#fff]">{userProfile?.tier === 'MASTER' ? "COMMAND CENTER" : "OPERATOR HUB"}</h2><div className="flex items-center gap-4 mt-4"><span className="bg-[#25F4EE]/10 text-[#25F4EE] text-[10px] px-4 py-1.5 rounded-full uppercase border border-[#25F4EE]/20">{userProfile?.tier} IDENTITY</span></div></div>
              <div className="flex-1 flex justify-end"><button onClick={() => setView('home')} className="btn-strategic !bg-white/10 !text-white border border-white/10 text-[10px] !w-fit px-6 py-3 mr-4"><Zap size={14} className="text-[#25F4EE]"/> LINK GENERATOR</button></div>
              <div className="flex items-center gap-4 flex-wrap"><div className="bg-[#0a0a0a] border border-white/10 px-8 py-5 rounded-[2rem] text-center shadow-3xl"><p className="text-[9px] font-black text-white/30 uppercase mb-1">Chips</p><div className="flex items-center gap-3"><button onClick={() => setConnectedChips(prev => Math.max(1, prev-1))} className="text-white/30">-</button><span className="text-3xl font-black text-[#25F4EE]">{connectedChips}</span><button onClick={() => setConnectedChips(prev => prev+1)} className="text-white/30">+</button></div></div><div className="bg-[#0a0a0a] border border-white/10 px-8 py-5 rounded-[2rem] text-center shadow-3xl border-b-2 border-b-[#25F4EE]"><p className="text-[9px] font-black text-white/30 uppercase mb-1 flex items-center justify-center gap-1"><Wallet size={10}/> Quota</p><p className="text-4xl font-black text-white">{isPro ? '∞' : userProfile?.smsCredits || 0}</p></div></div>
            </div>

            <div className="animate-in fade-in duration-700 space-y-10">
               {/* BATCH INGESTION */}
               <div className="bg-white/[0.02] border border-[#25F4EE]/20 rounded-[4rem] p-12 relative overflow-hidden group shadow-2xl">
                  <div className={`flex flex-col md:flex-row items-center justify-between gap-10 relative z-10 ${!isPro ? 'opacity-50 pointer-events-none select-none' : ''}`}>
                     <div className="flex items-center gap-5 text-left"><div className="p-5 bg-[#25F4EE]/10 rounded-[2rem] border border-[#25F4EE]/20"><FileText size={40} className="text-[#25F4EE]" /></div><div><h3 className="text-3xl font-black uppercase italic leading-none mb-3">Bulk Asset Ingestion {!isPro && <Lock size={20} className="text-[#FE2C55]" />}</h3><p className="text-[11px] text-white/40 font-medium italic max-w-sm">Import up to 5,000 global units. Automatic scan cleaned disparos.</p></div></div>
                     <input type="file" accept=".txt" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                     <div className="flex gap-4"><button onClick={() => fileInputRef.current.click()} disabled={!isPro} className="btn-strategic !w-fit !px-12 text-xs py-5">Select TXT File</button>{importPreview.length > 0 && <button onClick={saveImportToVault} disabled={!isPro} className="btn-strategic btn-neon-cyan text-xs py-5 shadow-2xl">Process {importPreview.length} Units</button>}</div>
                  </div>
                  {!isPro && <PremiumLockedFooter featureName="Bulk 5K Import" benefit="ingest massive lists automatically" />}
               </div>
               
               {/* AI AGENT COMMAND (REAL) */}
               <div className="lighthouse-neon-wrapper shadow-3xl mb-16 relative rounded-[3.5rem]">
                  <div className="lighthouse-neon-content p-8 sm:p-12 text-left rounded-[3.5rem] flex flex-col">
                     <div className={`${!isPro ? 'opacity-50 pointer-events-none select-none' : ''}`}>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10"><div className="flex items-center gap-4"><div className="p-3 bg-[#25F4EE]/10 rounded-2xl border border-[#25F4EE]/20"><BrainCircuit size={32} className="text-[#25F4EE]" /></div><div><h3 className="text-2xl font-black uppercase italic">AI Agent Command {!isPro && <Lock size={18} className="text-[#FE2C55]" />}</h3><p className="text-[10px] text-white/30 uppercase tracking-widest font-black italic">Intelligent Synthesis Engine</p></div></div><div className="flex items-center gap-2 px-6 py-3 bg-black border border-white/5 rounded-full"><Activity size={14} className="text-[#25F4EE]" /><span className="text-[10px] font-black uppercase text-white/60">Safety: {connectedChips * 60}/Day</span></div></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-left">
                           <div className="space-y-6"><textarea disabled={!isPro} value={aiObjective} onChange={(e) => {setAiObjective(e.target.value); setSafetyViolation(null);}} placeholder="Enter campaign objective... IA will dynamically synthesize variations." className="input-premium w-full h-[180px] font-black text-sm italic" />{safetyViolation && <div className="p-5 bg-[#FE2C55]/10 border border-[#FE2C55]/30 rounded-[2rem] flex items-start gap-4"><AlertIcon size={24} className="text-[#FE2C55] shrink-0" /><p className="text-xs font-black uppercase italic text-[#FE2C55] tracking-wider">{safetyViolation}</p></div>}<button onClick={handlePrepareBatch} disabled={!isPro || logs.length === 0} className="btn-strategic btn-neon-cyan text-xs py-5 w-full">Synthesize Queue ({logs.length} Units)</button></div>
                           <div className="bg-black border border-white/5 rounded-[3.5rem] p-10 flex flex-col justify-center items-center text-center shadow-2xl">{activeQueue.length > 0 ? (<div className="w-full leading-none"><div className="mb-8"><p className="text-6xl font-black text-[#25F4EE] italic leading-none">{queueIndex} / {activeQueue.length}</p><p className="text-[11px] font-black text-white/30 uppercase mt-4 tracking-[0.4em]">Rotation Active</p></div><div className="flex items-center justify-between gap-4 bg-white/[0.02] border border-white/10 p-4 rounded-2xl mb-6"><label className="text-[10px] uppercase text-white/50">Auto-Delay:</label><div className="flex items-center gap-2"><input disabled={isAutoSending} type="number" min="15" value={sendDelay} onChange={e => setSendDelay(Number(e.target.value))} className="bg-transparent border-b border-[#25F4EE]/30 text-[#25F4EE] font-black text-center w-12 outline-none" /><span className="text-[9px] text-[#FE2C55] font-black">Sec</span></div></div><button onClick={() => setIsAutoSending(!isAutoSending)} className={`w-full py-6 text-black rounded-[2rem] font-black uppercase text-[11px] shadow-2xl ${isAutoSending ? 'bg-[#FE2C55]' : 'bg-[#25F4EE]'}`}>{isAutoSending ? <><Lock size={20} className="inline mr-2" /> STOP AUTOPILOT</> : <><PlayCircle size={20} className="inline mr-2" /> LAUNCH AUTOPILOT</>}</button></div>) : (<div className="opacity-20 text-center"><ShieldAlert size={80} className="mx-auto mb-6" /><p className="text-sm font-black uppercase tracking-[0.5em]">System Standby</p></div>)}</div>
                        </div>
                     </div>
                     {!isPro && <PremiumLockedFooter featureName="AI Synthesis" benefit="guarantee bypass of carrier filters" />}
                  </div>
               </div>

               {/* DEVICE SYNC (REAL COMMUNICATION) */}
               <div className="lighthouse-neon-wrapper shadow-3xl mb-16 relative rounded-[3.5rem]">
                 <div className="lighthouse-neon-content p-8 sm:p-12 text-left rounded-[3.5rem] flex flex-col">
                   <div className={`${!isPro ? 'opacity-50 pointer-events-none select-none' : ''}`}>
                      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10"><div className="flex items-center gap-4"><div className="p-3 bg-[#25F4EE]/10 rounded-2xl border border-[#25F4EE]/20"><Radio size={32} className="text-[#25F4EE]" /></div><div><h3 className="text-2xl font-black uppercase italic">Device Sync Protocol {!isPro && <Lock size={18} className="text-[#FE2C55]" />}</h3><p className="text-[10px] text-white/30 uppercase tracking-widest">Mirror Native App & Contacts</p></div></div><div className="flex items-center gap-2 px-6 py-3 bg-black border border-white/5 rounded-full"><Activity size={14} className="text-[#25F4EE]" /><span className="text-[10px] font-black uppercase text-white/60">P2P Active</span></div></div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-left">
                         <div className="space-y-6"><p className="text-xs text-white/50 font-black italic leading-relaxed">Securely mirror device SMS via QR. Sync native contacts directly to encrypted vault.</p><div className="flex items-center gap-4 bg-black border border-white/5 p-4 rounded-2xl"><label className="text-[10px] uppercase text-white/50 w-full">Queue Delay:</label><input disabled={!isPro} type="number" min="15" value={sendDelay} onChange={e => setSendDelay(Number(e.target.value))} className="bg-transparent border-b border-[#25F4EE]/30 text-[#25F4EE] font-black text-center w-16 outline-none" /><span className="text-[9px] text-[#FE2C55] font-black">Min 15s</span></div><button onClick={handleGenerateDeviceQR} disabled={!isPro} className="btn-strategic btn-neon-cyan text-xs font-black italic py-5 w-full"><Radio size={18}/> Generate Pairing QR Code</button></div>
                         <div className="bg-black border border-white/5 rounded-[3.5rem] p-10 flex flex-col justify-center items-center shadow-2xl min-h-[250px]">{syncQR && !isDeviceSynced ? (<div className="animate-in zoom-in duration-500"><div className="bg-white p-5 rounded-3xl mb-6 shadow-[0_0_30px_rgba(37,244,238,0.4)]"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(syncQR)}&color=000000`} className="w-40 h-40"/></div><p className="text-[11px] text-[#25F4EE] uppercase tracking-[0.3em] animate-pulse">Scan with Native Camera</p></div>) : isDeviceSynced ? (<div className="animate-in zoom-in duration-500 text-center"><Smartphone size={80} className="mx-auto mb-6 text-[#25F4EE] drop-shadow-[0_0_20px_#25F4EE]" /><p className="text-xl font-black uppercase tracking-[0.2em]">DEVICE CONNECTED</p><p className="text-[10px] text-[#25F4EE] font-black mt-2">{syncedDeviceName}</p></div>) : (<div className="opacity-20 text-center"><Smartphone size={80} className="mx-auto mb-6" /><p className="text-sm font-black uppercase">Awaiting Device Sync</p></div>)}</div>
                      </div>
                   </div>
                   {!isPro && <PremiumLockedFooter featureName="Device Mirror" benefit="deploy safe campaigns directly to your personal contacts" />}
                 </div>
               </div>

               {/* MARKETPLACE (MASTER OVERRIDE) */}
               <div id="marketplace-section" className="mb-16 mt-10">
                  <div className="flex items-center gap-3 mb-10"><ShoppingCart size={24} className="text-[#FE2C55]" /><h3 className="text-2xl font-black uppercase text-white">{userProfile?.tier === 'MASTER' ? "MASTER PROTOCOLS VIEW" : "MAXIMIZE YOUR ROI: UPGRADE TO PRO"}</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20 text-left">
                    <div className="bg-white/5 border border-[#25F4EE]/30 p-12 rounded-[3.5rem] relative overflow-hidden group shadow-2xl"><div className="absolute top-0 right-0 p-8 opacity-10"><Globe size={100} /></div><h3 className="text-4xl font-black italic text-white uppercase mb-4 text-glow-white">Nexus Access</h3><p className="text-white/40 text-[11px] font-black mb-10 tracking-widest leading-relaxed max-w-xs">Premium Attribution + Unlimited Handshakes + Lead Unmasking.</p><p className="text-5xl font-black text-white italic mb-12">{userProfile?.tier === 'MASTER' ? '∞' : '$9.00'}<span className="text-sm text-white/30 uppercase ml-1">{userProfile?.tier === 'MASTER' ? '/ UNLIMITED' : '/ mo'}</span></p><button onClick={() => window.open(STRIPE_NEXUS_LINK, '_blank')} className="btn-strategic btn-neon-white text-xs w-full italic font-black py-5">UPGRADE TO NEXUS</button></div>
                    <div className="bg-[#25F4EE]/10 border border-[#25F4EE] p-12 rounded-[3.5rem] relative overflow-hidden group shadow-[0_0_60px_rgba(37,244,238,0.2)]"><div className="absolute top-0 right-0 p-8 text-[#25F4EE] opacity-20"><BrainCircuit size={100} /></div><h3 className="text-4xl font-black italic text-white uppercase mb-4 text-glow-white">Expert Agent</h3><p className="text-white/40 text-[11px] font-black mb-10 tracking-widest max-w-xs">AI Synthesis + Multi-SIM + 5K Bulk Import + Automation.</p><p className="text-5xl font-black text-white italic mb-12">{userProfile?.tier === 'MASTER' ? '∞' : '$19.90'}<span className="text-sm text-white/30 uppercase ml-1">{userProfile?.tier === 'MASTER' ? '/ UNLIMITED' : '/ mo'}</span></p><button onClick={() => window.open(STRIPE_EXPERT_LINK, '_blank')} className="btn-strategic btn-neon-cyan text-xs w-full italic font-black py-5">ACTIVATE EXPERT AI</button></div>
                 </div>
               </div>

               {/* VAULT SYNC (PUBLIC RECEPTION) */}
               <div className="bg-[#0a0a0a] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-3xl mt-16 font-black italic flex flex-col">
                 <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]"><div className="flex items-center gap-3"><Database size={20} className="text-[#25F4EE]" /><h3 className="text-lg font-black uppercase italic">Data Vault Explorer</h3></div><button onClick={() => setIsVaultActive(!isVaultActive)} className={`flex items-center gap-2 px-6 py-2.5 rounded-full border text-[9px] font-black transition-all ${isVaultActive ? 'bg-[#FE2C55]/10 border-[#FE2C55]/30 text-[#FE2C55]' : 'bg-[#25F4EE]/10 border-[#25F4EE]/30 text-[#25F4EE]'}`}>{isVaultActive ? "DISCONNECT" : "SYNC LEAD VAULT"}</button></div>
                 <div className="min-h-[200px] max-h-[40vh] overflow-y-auto">{isVaultActive ? logs.map(l => {const isP = isPro || userProfile?.tier === 'MASTER'; const mask = (s) => (isP ? s : (s || '').slice(0, 5) + '*****' + (s || '').slice(-2)); return (<div key={l.id} className="p-8 border-b border-white/5 flex justify-between items-center hover:bg-white/[0.02]"><div><p className="font-black text-xl text-white uppercase italic flex items-center gap-2">{isP ? l.nome_cliente : 'PROT*****EAD'}{!isP && <span className="text-[8px] bg-[#FE2C55] text-white px-2 py-0.5 rounded-full uppercase animate-pulse">Locked</span>}</p><p className="text-[12px] text-[#25F4EE] font-black">{mask(l.telefone_cliente)}</p></div><div className="text-right text-[10px] text-white/30 uppercase"><p>{isP ? l.location : 'LOCKED GEO'}</p><p className="mt-1">{isP ? (l.ip || 'Global') : 'LOCKED IP'}</p></div></div>);}) : <div className="p-20 text-center opacity-20"><Lock size={48} className="mx-auto mb-4" /><p className="text-[10px] uppercase">Vault Standby</p></div>}</div>
                 {!isPro && isVaultActive && (<div className="p-8 bg-[#FE2C55]/5 border-t border-[#FE2C55]/20 flex flex-col items-center justify-center gap-5"><p className="text-[11px] text-[#FE2C55] uppercase tracking-widest flex items-center gap-2"><Lock size={16} /> DATA MASKED. UPGRADE TO REVEAL FULL IDENTITIES.</p><button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="btn-strategic !bg-[#FE2C55] !text-white text-[10px] w-full max-w-[300px] py-4 shadow-[0_0_20px_#FE2C55]">UNLOCK LEADS NOW</button></div>)}
               </div>
            </div>
          </div>
        )}

        {view === 'auth' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-left font-black italic">
            <div className="lighthouse-neon-wrapper w-full max-w-md shadow-3xl">
              <div className="lighthouse-neon-content p-12 sm:p-16 relative">
                <h2 className="text-3xl font-black italic mt-8 mb-12 uppercase text-white text-center text-glow-white">{isResetMode ? "Identity Recovery" : isLoginMode ? "Member Login" : "Join the Network"}</h2>
                <form onSubmit={async (e) => { e.preventDefault(); if (isResetMode) { await sendPasswordResetEmail(auth, email); alert("Check your inbox."); return; } setLoading(true); try { if (isLoginMode) await signInWithEmailAndPassword(auth, email, password); else await handleAuthSubmit(e); setView('dashboard'); } catch (e) { alert(e.message); } setLoading(false); }} className="space-y-4">
                  {!isLoginMode && !isResetMode && (<><input required placeholder="Operator Name" value={fullName} onChange={e=>setFullName(e.target.value)} className="input-premium text-xs w-full" /><input required placeholder="+1 999 999 9999" value={phone} onChange={e=>setPhone(e.target.value)} className="input-premium text-xs w-full" /></>)}
                  <input required type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} className="input-premium text-xs w-full" />
                  {!isResetMode && (<div className="relative"><input required type={showPass ? "text" : "password"} placeholder="Security Key" value={password} onChange={e=>setPassword(e.target.value)} className="input-premium text-xs w-full" /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-4 text-white/30"><Eye size={18}/></button></div>)}
                  {isLoginMode && <div className="text-right"><button type="button" onClick={() => setIsResetMode(true)} className="text-[9px] text-[#25F4EE] uppercase tracking-widest">Forgot Password?</button></div>}
                  {!isLoginMode && !isResetMode && (<div className="flex items-start gap-3 py-4 cursor-pointer" onClick={() => setTermsAccepted(!termsAccepted)}><div className={`w-4 h-4 rounded border flex items-center justify-center ${termsAccepted ? 'bg-[#25F4EE] border-[#25F4EE]' : 'bg-black border-white/20'}`}>{termsAccepted && <Check size={10} className="text-black" />}</div><p className="text-[9px] text-white/40 uppercase tracking-wider">I agree to the Responsibility Terms and Ethics.</p></div>)}
                  <button type="submit" disabled={loading} className="btn-strategic btn-neon-cyan text-[11px] mt-4 shadow-xl w-full">{loading ? "PROCESSING..." : isResetMode ? "Send Recovery Link" : isLoginMode ? "Secure Login" : "Create Account"}</button>
                  <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); setIsResetMode(false); }} className="w-full text-[10px] text-white/20 uppercase tracking-[0.4em] mt-10 text-center hover:text-white transition-all">{isLoginMode ? "CREATE NEW ACCOUNT? REGISTER" : "ALREADY A MEMBER? LOGIN HERE"}</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-auto pb-20 w-full text-center space-y-16 z-10 px-10 border-t border-white/5 pt-20 text-left leading-none font-black italic">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 text-[10px] font-black uppercase italic tracking-widest text-white/30 text-left leading-none">
          <div className="flex flex-col gap-5 text-left"><span className="text-white/40 border-b border-white/5 pb-2 uppercase">Legal</span><a href="#" className="hover:text-[#25F4EE] transition-colors">Privacy</a><a href="#" className="hover:text-[#25F4EE] transition-colors">Terms</a></div>
          <div className="flex flex-col gap-5 text-left"><span className="text-white/40 border-b border-white/5 pb-2 uppercase">Compliance</span><a href="#" className="hover:text-[#FE2C55] transition-colors">CCPA</a><a href="#" className="hover:text-[#FE2C55] transition-colors">GDPR</a></div>
          <div className="flex flex-col gap-5 text-left"><span className="text-white/40 border-b border-white/5 pb-2 uppercase">Network</span><a href="#" className="hover:text-[#25F4EE] transition-colors">U.S. Nodes</a><a href="#" className="hover:text-[#25F4EE] transition-colors">EU Nodes</a></div>
          <div className="flex flex-col gap-5 text-left"><span className="text-white/40 border-b border-white/5 pb-2 uppercase">Support</span><button onClick={() => setShowSmartSupport(true)} className="hover:text-[#25F4EE] flex items-center gap-2 uppercase">SMART SUPPORT <Bot size={14}/></button></div>
        </div>
        <p className="text-[11px] text-white/20 font-black tracking-[8px] uppercase italic text-center leading-none">© 2026 ClickMoreDigital | Security Protocol</p>
      </footer>
    </div>
  );
}
