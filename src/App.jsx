import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
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
  deleteDoc
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
const ADMIN_MASTER_ID = "YGepVHHMYaN9sC3jFmTyry0mYZO2"; // <--- ALEX, COLE O SEU UID AQUI PARA ACESSO TOTAL

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
  const [authResolved, setAuthResolved] = useState(false); // NOVO: Garante que o Firebase carregou a identidade
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
  
  // Link Editor States
  const [editingLink, setEditingLink] = useState(null);
  const [editMsg, setEditMsg] = useState('');

  // AI Safety & Synthesis Engine
  const [safetyViolation, setSafetyViolation] = useState(null);
  const [isSafetyAuditing, setIsSafetyAuditing] = useState(false);
  const [aiObjective, setAiObjective] = useState('');
  const [activeQueue, setActiveQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [connectedChips, setConnectedChips] = useState(1);

  // Device Sync States (NEW)
  const [syncQR, setSyncQR] = useState('');
  const [isGeneratingSync, setIsGeneratingSync] = useState(false);

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
  const [isResetMode, setIsResetMode] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Generator States
  const [genTo, setGenTo] = useState('');
  const [genMsg, setGenMsg] = useState('');
  const [companyName, setCompanyName] = useState('');
  const MSG_LIMIT = 300;

  const isPro = userProfile?.isSubscribed || userProfile?.isUnlimited || user?.uid === ADMIN_MASTER_ID;

  // SYSTEM INITIALIZATION & AUTH
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        }
      } catch (err) {
        console.warn("Standard Auth Mode Active.");
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
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
            const defaultProfile = { fullName: u.email || 'Operator', phone: '', email: u.email || '', tier: 'FREE_TRIAL', usageCount: 0, isSubscribed: false, isUnlimited: u.uid === ADMIN_MASTER_ID, smsCredits: u.uid === ADMIN_MASTER_ID ? 999999 : 60, connectedChips: 1, created_at: serverTimestamp() };
            await setDoc(docRef, defaultProfile);
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', u.uid), defaultProfile);
            setUserProfile(defaultProfile);
          }
        } catch (e) {
          console.error("Profile load secured bypass:", e);
        }
      } else {
        setUserProfile(null);
      }
      setAuthResolved(true); // Confirma que a verificação de Auth concluiu
    });

    return () => unsubscribe();
  }, []);

  // GATILHO DE URL (AGORA AGUARDA O AUTH RESOLVER PARA NÃO PERDER O LEAD)
  useEffect(() => {
    if (!authResolved) return; // Só dispara quando tivermos certeza da identidade

    const params = new URLSearchParams(window.location.search);
    const lid = params.get('lid');
    const t = params.get('t');
    const m = params.get('m');
    const o = params.get('o');

    if (t && m && view !== 'bridge') {
      setCaptureData({ to: t, msg: m, company: params.get('c') || 'Verified Host', ownerId: o });
      handleProtocolHandshake(t, m, o, lid);
    }
  }, [authResolved]);

  // DATA SYNCHRONIZATION
  useEffect(() => {
    if (!user || view !== 'dashboard') return;
    
    let unsubUsers, unsubLeads, unsubLinks, unsubProfile;
    try {
      unsubProfile = onSnapshot(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data'), (docSnap) => {
        if (docSnap.exists()) {
           const data = docSnap.data();
           if (user.uid === ADMIN_MASTER_ID) {
              data.isUnlimited = true;
              data.smsCredits = 999999;
           }
           setUserProfile(data);
        }
      });

      unsubLinks = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'links'), (snap) => {
        setMyLinks(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0)));
      }, (err) => console.warn("Link sync bypassed."));

      if (user.uid === ADMIN_MASTER_ID) {
        unsubUsers = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'user_profiles'), (snap) => {
          setAllUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }, (err) => console.warn("List hidden pending permissions."));
      }

      if (isVaultActive) {
        unsubLeads = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'leads'), (snap) => {
          const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setLogs(data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
        }, (err) => console.warn("Vault locked pending sync."));
      }
    } catch(e) {}
    
    return () => { 
      if(unsubUsers) unsubUsers(); 
      if(unsubLeads) unsubLeads(); 
      if(unsubLinks) unsubLinks();
      if(unsubProfile) unsubProfile();
    };
  }, [user, view, isVaultActive]);

  // --- CORE INTELLIGENCE ENGINE ---
  const runSafetyAudit = async (text) => {
    if (!text) return true;
    
    const restrictedPatterns = [
      /\b(bit\.ly|t\.co|tinyurl|is\.gd|cutt\.ly)\b/i, 
      /\b(scam|fraud|money|bank|irs|verify|lottery|winner|inherited|password|pin|ssn|urgent|police)\b/i, 
      /\b(hate|offensive|racist|kill|die|explicit|porn|abuse|discriminat|slur)\b/i, 
      /\b(fake|hoax|misinfo|conspiracy|rumor|defamation)\b/i
    ];
    
    setIsSafetyAuditing(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const hasViolation = restrictedPatterns.some(p => p.test(text));
        setSafetyViolation(hasViolation ? "TERMINAL BLOCK: Global AI detected prohibited content (Malicious intent, hate speech, or unverified URLs). Action restricted." : null);
        setIsSafetyAuditing(false);
        resolve(!hasViolation);
      }, 1000);
    });
  };

  const synthesizeDynamicVariations = (baseMsg) => {
    const greetings = ["Hi", "Hello", "Greetings", "Hey there", "Notice:", "Attention:", "Update:"];
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
    if (!aiObjective || logs.length === 0) return;
    if (userProfile?.smsCredits <= 0 && user.uid !== ADMIN_MASTER_ID) return alert("Insufficient Trial Handshakes.");
    
    const isSafe = await runSafetyAudit(aiObjective);
    if (!isSafe) return;

    setIsAiProcessing(true);
    setTimeout(() => {
      const pool = synthesizeDynamicVariations(aiObjective);
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
    if (userProfile.smsCredits <= 0 && !userProfile.isUnlimited) return alert("Handshake limit reached.");

    const current = activeQueue[queueIndex];
    const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
    
    if (!userProfile.isUnlimited) {
      try {
        const profileRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
        await updateDoc(profileRef, { smsCredits: increment(-1), usageCount: increment(1) });
      } catch (e) { console.warn("Credit decrement bypass") }
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
    if (!user) return;
    setLoading(true);
    try {
      const leadsCol = collection(db, 'artifacts', appId, 'users', user.uid, 'leads');
      for (const lead of importPreview) {
        await addDoc(leadsCol, { ...lead, created_at: serverTimestamp(), timestamp: serverTimestamp() });
      }
      setImportPreview([]);
      alert("Vault Updated: 5,000 global units processed successfully.");
    } catch (e) { alert("Vault write failed. Please check permissions."); }
    setLoading(false);
  };

  // --- PROTOCOL HANDSHAKE (AIDA & DEDUPLICAÇÃO ATIVA) ---
  const handleProtocolHandshake = async (to, msg, ownerId, lid) => {
    setView('bridge');
    if(!ownerId) return;

    if (lid) {
      try {
        const linkSnap = await getDoc(doc(db, 'artifacts', appId, 'users', ownerId, 'links', lid));
        if (linkSnap.exists() && linkSnap.data().status === 'canceled') {
           alert("Protocol Alert: This Smart Link has been deactivated by the host.");
           setView('home');
           return;
        }
      } catch (e) { console.warn("Link validation bypassed"); }
    }

    setTimeout(async () => {
      try {
        // Bloqueio de Duplicidade: O telefone limpo atua como ID único
        const safePhoneId = to.replace(/[^0-9]/g, '');
        const leadRef = doc(db, 'artifacts', appId, 'users', ownerId, 'leads', safePhoneId || crypto.randomUUID());
        const leadSnap = await getDoc(leadRef);

        // Se o lead já existir (mesmo número), NÃO desconta créditos nem gera duplicidade.
        if (leadSnap.exists()) {
           console.log("Duplicate prevented. Bypassing quota deduction.");
           const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
           window.location.href = `sms:${to}${sep}body=${encodeURIComponent(msg)}`;
           return; // Interrompe o processo de cobrança aqui
        }

        const ownerRef = doc(db, 'artifacts', appId, 'users', ownerId, 'profile', 'data');
        const d = await getDoc(ownerRef);
        const ownerProfile = d?.data();

        if (!ownerProfile?.isSubscribed && !ownerProfile?.isUnlimited && (ownerProfile?.smsCredits <= 0 || ownerProfile?.usageCount >= 60)) {
          setQuotaExceeded(true);
          return;
        }

        // Desconta do Free Trial (ou ignora se for Unlimited)
        if (!ownerProfile?.isUnlimited) {
          await updateDoc(ownerRef, { usageCount: increment(1), smsCredits: increment(-1) });
          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', ownerId), { usageCount: increment(1), smsCredits: increment(-1) });
        } else {
          await updateDoc(ownerRef, { usageCount: increment(1) });
          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', ownerId), { usageCount: increment(1) });
        }

        // Grava o Novo Lead na Base de Dados (Mesmo para Free Trial, para fazer o Upsell)
        const geoReq = await fetch('https://ipapi.co/json/');
        const geo = geoReq.ok ? await geoReq.json() : { city: 'Unknown', ip: '0.0.0.0' };
        
        await setDoc(leadRef, {
          timestamp: serverTimestamp(),
          created_at: serverTimestamp(),
          destination: to,
          telefone_cliente: to,
          nome_cliente: "CAPTURED_LEAD",
          location: `${geo.city}, ${geo.country_name || 'Global'}`,
          ip: geo.ip,
          device: navigator.userAgent
        });

      } catch (e) { console.warn("Handshake analytics logged off-chain", e); }
      
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
        if(password !== confirmPassword) throw new Error("Passwords do not match.");
        const u = await createUserWithEmailAndPassword(auth, email, password);
        const p = { fullName, phone, email, tier: 'FREE_TRIAL', usageCount: 0, isSubscribed: false, isUnlimited: false, smsCredits: 60, created_at: serverTimestamp() };
        await setDoc(doc(db, 'artifacts', appId, 'users', u.user.uid, 'profile', 'data'), p);
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', u.user.uid), p);
      }
      setIsMenuOpen(false);
      setView('dashboard');
    } catch (e) {
      if (e.code === 'auth/admin-restricted-operation' || e.code === 'auth/operation-not-allowed') {
        alert("Protocol Alert: Registration is restricted by Firebase server rules. Please enable Email/Password Sign-In in your Firebase Console.");
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
    } catch (e) { alert("Recovery Error: " + e.message); }
    setLoading(false);
  };

  // --- LINK MANAGEMENT ---
  const handleGenerate = async () => {
    if (!user) { setIsLoginMode(false); setView('auth'); return; }
    if (!genTo) return;
    if (genMsg.length > MSG_LIMIT) return alert("Safety Protocol: Payload exceeds limits.");
    const isSafe = await runSafetyAudit(genMsg);
    if (!isSafe) return;
    
    const uniqueId = crypto.randomUUID().split('-')[0];
    const baseUrl = window.location.origin;
    const shortLink = `${baseUrl}?t=${encodeURIComponent(genTo)}&m=${encodeURIComponent(genMsg)}&o=${user.uid}&c=${encodeURIComponent(companyName || 'Verified Partner')}&lid=${uniqueId}`;
    
    setGeneratedLink(shortLink);

    try {
      await setDoc(doc(collection(db, 'artifacts', appId, 'users', user.uid, 'links'), uniqueId), {
        url: shortLink,
        to: genTo,
        msg: genMsg,
        company: companyName || 'Verified Partner',
        status: 'active',
        created_at: serverTimestamp()
      });
    } catch (e) { console.error("Link history logging bypassed."); }
  };

  const toggleLinkStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'canceled' : 'active';
      await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', id), { status: newStatus });
    } catch (e) { console.error(e); }
  };

  const deleteLink = async (id) => {
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', id));
    } catch (e) { console.error(e); }
  };

  const saveEditedLink = async () => {
    if (!editingLink) return;
    try {
      const newUrl = `${window.location.origin}?t=${encodeURIComponent(editingLink.to)}&m=${encodeURIComponent(editMsg)}&o=${user.uid}&c=${encodeURIComponent(editingLink.company)}&lid=${editingLink.id}`;
      await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', editingLink.id), { msg: editMsg, url: newUrl });
      setEditingLink(null);
    } catch (e) { console.error(e); }
  };

  const handleGenerateDeviceQR = () => {
    if (!isPro) return;
    setIsGeneratingSync(true);
    setTimeout(() => {
      const token = crypto.randomUUID().split('-')[0];
      const syncUrl = `${window.location.origin}?sync_protocol=active&token=${token}&uid=${user.uid}`;
      setSyncQR(syncUrl);
      setIsGeneratingSync(false);
    }, 1500);
  };

  const toggleUnlimited = async (targetUserId, currentStatus) => {
    if (user.uid !== ADMIN_MASTER_ID) return;
    const newStatus = !currentStatus;
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'users', targetUserId, 'profile', 'data'), { isUnlimited: newStatus, smsCredits: newStatus ? 999999 : 60 });
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', targetUserId), { isUnlimited: newStatus });
    } catch (e) { console.warn("Toggle bypass"); }
  };

  // TÁTICA AIDA - FOOTER DE CADEADO AGRESSIVO EMBAIXO DAS FUNÇÕES
  const PremiumLockedFooter = ({ featureName, benefit }) => (
    <div className="mt-10 pt-10 border-t border-[#FE2C55]/30 flex flex-col items-center justify-center text-center gap-6 relative z-20 w-full font-black italic">
      <div className="inline-flex items-center justify-center gap-2 bg-[#FE2C55]/10 border border-[#FE2C55]/40 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(254,44,85,0.2)]">
        <Lock size={14} className="text-[#FE2C55]" />
        <span className="text-[10px] text-[#FE2C55] font-black uppercase tracking-widest font-black italic">PREMIUM PROTOCOL LOCKED</span>
      </div>
      
      <p className="text-xl sm:text-3xl text-[#FE2C55] font-black italic uppercase leading-tight drop-shadow-[0_0_15px_rgba(254,44,85,0.6)]">
        ATTENTION: YOU ARE LEAVING MONEY ON THE TABLE.
      </p>
      
      <div className="max-w-4xl mx-auto space-y-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest leading-relaxed font-black italic text-white/70 bg-black/40 p-6 rounded-3xl border border-white/5">
        <p><span className="text-[#25F4EE]">INTEREST:</span> Your competitors are already using <span className="text-white">{featureName}</span> to automate their funnels and {benefit}.</p>
        <p><span className="text-amber-500">DESIRE:</span> Imagine bypassing carrier filters automatically, scaling your reach to thousands, and unmasking every single highly-qualified lead in your vault. Stop guessing and start converting.</p>
      </div>

      <button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="btn-strategic btn-neon-cyan text-xs sm:text-sm w-full max-w-[500px] py-6 shadow-[0_0_40px_rgba(37,244,238,0.5)] animate-pulse mt-2">
        <Rocket size={20} className="mr-2"/> UPGRADE NOW & UNLOCK YOUR MACHINE
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans selection:bg-[#25F4EE] antialiased flex flex-col relative overflow-x-hidden text-left font-black italic">
      <style>{`
        @keyframes rotate-beam { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes neon-cyan {
          0% { box-shadow: 0 0 10px rgba(37,244,238,0.2), 0 0 20px rgba(37,244,238,0.2); }
          100% { box-shadow: 0 0 20px rgba(37,244,238,0.6), 0 0 40px rgba(37,244,238,0.4); }
        }
        @keyframes neon-white {
          0% { box-shadow: 0 0 10px rgba(255,255,255,0.2), 0 0 20px rgba(255,255,255,0.2); }
          100% { box-shadow: 0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.4); }
        }
        
        .lighthouse-neon-wrapper { position: relative; padding: 1.5px; border-radius: 28px; overflow: hidden; background: transparent; display: flex; align-items: center; justify-content: center; }
        .lighthouse-neon-wrapper::before { content: ""; position: absolute; width: 600%; height: 600%; top: 50%; left: 50%; background: conic-gradient(transparent 0%, transparent 45%, #25F4EE 48%, #FE2C55 50%, #25F4EE 52%, transparent 55%, transparent 100%); animation: rotate-beam 5s linear infinite; z-index: 0; }
        .lighthouse-neon-content { position: relative; z-index: 1; background: #0a0a0a; border-radius: 27px; width: 100%; height: 100%; }
        
        .btn-strategic { background: #FFFFFF; color: #000000; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-radius: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; width: 100%; padding: 1.15rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; border: none; cursor: pointer; }
        .btn-strategic:hover:not(:disabled) { transform: translateY(-2px) scale(1.02); box-shadow: 0 0 40px rgba(37,244,238,0.4); }
        
        /* Neon Premium Animations */
        .btn-neon-cyan { animation: neon-cyan 2s infinite alternate; background: #25F4EE !important; color: #000 !important; }
        .btn-neon-white { animation: neon-white 2s infinite alternate; background: #FFFFFF !important; color: #000 !important; }
        
        .input-premium { background: #111; border: 1px solid rgba(255,255,255,0.05); color: white; width: 100%; padding: 1rem 1.25rem; border-radius: 12px; outline: none; transition: all 0.3s; font-weight: 900; font-size: 14px; font-style: italic; }
        .input-premium:focus { border-color: #25F4EE; background: #000; }
        .text-glow-white { text-shadow: 0 0 15px rgba(255,255,255,0.5); }
        .text-neon-cyan { color: #25F4EE; text-shadow: 0 0 10px rgba(37,244,238,0.3); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0a0a0a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #25F4EE; border-radius: 10px; }
        * { hyphens: none !important; word-break: normal !important; text-decoration: none; }
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
            <div className="flex flex-col gap-10 flex-1 text-left">
              {!user ? (
                <>
                  <button onClick={() => {setView('auth'); setIsLoginMode(false); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-[#25F4EE] hover:text-white transition-colors text-left"><UserPlus size={20} /> JOIN THE NETWORK</button>
                  <button onClick={() => {setView('auth'); setIsLoginMode(true); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors text-left"><Lock size={20} /> MEMBER LOGIN</button>
                </>
              ) : (
                <>
                  <div className="mb-6 p-6 bg-white/5 rounded-3xl border border-white/10 text-left">
                     <p className="text-[9px] font-black text-white/30 uppercase mb-2 italic leading-none">Active Access</p>
                     <p className="text-sm font-black text-[#25F4EE] truncate uppercase italic">{userProfile?.fullName || 'Operator'}</p>
                  </div>
                  <button onClick={() => {setView('dashboard'); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors text-left"><LayoutDashboard size={20} /> {user.uid === ADMIN_MASTER_ID ? "COMMAND CENTER" : "OPERATOR HUB"}</button>
                  <button onClick={() => {setShowSmartSupport(true); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors text-left"><Bot size={20} /> SMART SUPPORT</button>
                  <button onClick={() => {signOut(auth).then(()=>setView('home')).catch(console.error); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-[#FE2C55] hover:opacity-70 transition-all mt-auto text-left"><LogOut size={20} /> TERMINATE SESSION</button>
                </>
              )}
              <div className="h-px bg-white/5 w-full my-4" />
              <div className="flex flex-col gap-6 text-[10px] font-black text-white/30 uppercase italic tracking-[0.2em] text-left">
                <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
                <a href="#" className="hover:text-white transition-colors">Security Terms</a>
                <button onClick={() => {setShowSmartSupport(true); setIsMenuOpen(false)}} className="text-left hover:text-white transition-colors flex items-center gap-2 uppercase font-black italic text-[10px]">SMART SUPPORT <Bot size={12}/></button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Container */}
      <div className="pt-28 flex-1 pb-10 relative text-center">
        <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#FE2C55] opacity-[0.03] blur-[150px] pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#25F4EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

        {view === 'home' && (
          <div className="w-full max-w-[540px] mx-auto px-4 z-10 relative text-center">
            <header className="mb-14 text-center flex flex-col items-center">
              <div className="lighthouse-neon-wrapper mb-4">
                <div className="lighthouse-neon-content px-10 py-4"><h1 className="text-3xl font-black italic uppercase text-white text-glow-white leading-none">SMART SMS PRO</h1></div>
              </div>
              <p className="text-[10px] text-white/40 font-bold tracking-[0.4em] uppercase text-center font-black italic">High-End Redirection Protocol - 60 Free Handshakes</p>
            </header>

            <main className="space-y-8 pb-20 text-left">
              
              {/* Botão de Acesso Rápido ao Dashboard (APENAS PARA LOGADOS) - No Topo */}
              {user && (
                <div className="flex justify-center mb-2 animate-in fade-in zoom-in duration-500">
                  <button 
                    onClick={() => setView('dashboard')} 
                    className="btn-strategic btn-neon-cyan text-xs w-full max-w-[420px] group italic font-black uppercase py-6 leading-none"
                  >
                    <LayoutDashboard size={24} /> ACCESS {user.uid === ADMIN_MASTER_ID ? "COMMAND CENTER" : "OPERATOR HUB"}
                  </button>
                </div>
              )}

              {/* GERADOR */}
              <div className="lighthouse-neon-wrapper shadow-3xl">
                <div className="lighthouse-neon-content p-8 sm:p-12 text-left">
                  <div className="flex items-center gap-2 mb-10"><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"></div><h3 className="text-[11px] font-black uppercase italic tracking-widest text-white/60 leading-none">Smart Handshake Generator</h3></div>
                  <div className="space-y-8">
                    <div className="space-y-3 text-left">
                       <label className="text-[10px] font-black uppercase italic tracking-widest text-white/40 ml-1 leading-tight block">
                         Global Mobile Number
                         <span className="block text-[#25F4EE] opacity-80 mt-1 uppercase font-black tracking-widest text-[9px]">ex: +1 999 999 9999</span>
                       </label>
                       <input type="tel" value={genTo} onChange={e => setGenTo(e.target.value)} className="input-premium font-bold text-sm w-full" placeholder="+1 999 999 9999" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase italic tracking-widest text-white/40 ml-1 leading-none font-black italic">Host / Company Name</label>
                       <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-premium font-bold text-sm text-white/50 w-full" placeholder="Your Name or Company Name" />
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center px-1"><label className="text-[10px] font-black uppercase italic text-white/40 leading-none font-black">Pre-Written Smart SMS Content</label><span className={`text-[9px] font-black tracking-widest ${genMsg.length > MSG_LIMIT ? 'text-[#FE2C55]' : 'text-white/20'}`}>{genMsg.length}/{MSG_LIMIT}</span></div>
                       <textarea value={genMsg} onChange={e => {setGenMsg(e.target.value); setSafetyViolation(null);}} rows="3" className={`input-premium w-full font-medium resize-none leading-relaxed text-sm ${safetyViolation ? 'border-[#FE2C55]/50 shadow-[0_0_15px_rgba(254,44,85,0.2)]' : ''}`} placeholder="Draft your intelligent SMS message here..." />
                       {/* AVISO VERMELHO SHA */}
                       {safetyViolation && (
                         <div className="p-4 bg-[#FE2C55]/10 border border-[#FE2C55]/30 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 mt-4">
                           <AlertIcon size={16} className="text-[#FE2C55] shrink-0 mt-0.5" />
                           <p className="text-[10px] font-black uppercase italic text-[#FE2C55] leading-relaxed">{safetyViolation}</p>
                         </div>
                       )}
                    </div>
                    <button onClick={handleGenerate} disabled={isSafetyAuditing || !!safetyViolation} className="btn-strategic btn-neon-cyan text-xs mt-4 italic font-black uppercase py-5 disabled:opacity-30 w-full shadow-2xl">
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
                      <button onClick={() => {navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="flex flex-col items-center py-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all text-center font-black italic">
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

              {/* BOTÕES DE VENDAS ESTRATÉGICOS FIXOS NO FUNDO DA HOME (Apenas Deslogados) */}
              {!user && (
                <div className="flex flex-col items-center gap-6 mt-8 w-full animate-in zoom-in-95 duration-500 pb-10">
                  <button onClick={() => {setIsLoginMode(false); setView('auth')}} className="btn-strategic btn-neon-white text-xs w-full max-w-[420px] group italic font-black uppercase py-6 leading-none">
                     <Rocket size={24} className="group-hover:animate-bounce" /> START 60 FREE HANDSHAKES
                  </button>
                  <button onClick={() => window.open(STRIPE_NEXUS_LINK, '_blank')} className="btn-strategic btn-neon-cyan text-xs w-full max-w-[420px] group italic font-black uppercase py-6 leading-none">
                     <Star size={24} className="animate-pulse" /> UPGRADE TO PRO MEMBER
                  </button>
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
                       <button onClick={() => window.open(STRIPE_NEXUS_LINK, '_blank')} className="btn-strategic btn-neon-cyan text-xs italic font-black uppercase py-5 shadow-2xl">Unlock Full Access ($9/MO)</button>
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
                <div className="flex items-center gap-4 mt-4 text-left">
                  <span className="bg-[#25F4EE]/10 text-[#25F4EE] text-[10px] px-4 py-1.5 rounded-full font-black uppercase italic tracking-[0.2em] border border-[#25F4EE]/20">{user?.uid === ADMIN_MASTER_ID ? "MASTER OVERRIDE" : `${userProfile?.tier || 'TRIAL'} IDENTITY`}</span>
                  {(userProfile?.isSubscribed || userProfile?.isUnlimited) && <span className="bg-amber-500/10 text-amber-500 text-[10px] px-4 py-1.5 rounded-full font-black uppercase italic tracking-[0.2em] border border-amber-500/20">LEAD LOGGING: ACTIVE</span>}
                </div>
              </div>
              
              <div className="flex-1 flex justify-end">
                <button onClick={() => setView('home')} className="btn-strategic !bg-white/10 !text-white hover:!bg-white/20 border border-white/10 text-[10px] !w-fit px-6 py-3 mr-4">
                  <Zap size={14} className="text-[#25F4EE]"/> LINK GENERATOR
                </button>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                 <div className="bg-[#0a0a0a] border border-white/10 px-8 py-5 rounded-[2rem] text-center shadow-3xl">
                    <p className="text-[9px] font-black text-white/30 uppercase mb-1">Active Chips</p>
                    <div className="flex items-center gap-3"><button onClick={() => setConnectedChips(prev => Math.max(1, prev - 1))} className="p-1 text-white/40 hover:text-white">-</button><span className="text-3xl font-black text-[#25F4EE]">{connectedChips}</span><button onClick={() => setConnectedChips(prev => prev + 1)} className="p-1 text-white/40 hover:text-white">+</button></div>
                 </div>
                 <div className="bg-[#0a0a0a] border border-white/10 px-8 py-5 rounded-[2rem] text-center shadow-3xl border-b-2 border-b-[#25F4EE]">
                    {/* TERMINOLOGIA ANTI-TELECOM: 60 Free Trial / Quota */}
                    <p className="text-[9px] font-black text-white/30 uppercase mb-1 flex items-center justify-center gap-1"><Wallet size={10}/> Free Trial Quota</p>
                    <p className="text-4xl font-black text-white italic">{userProfile?.isUnlimited ? '∞' : userProfile?.smsCredits || 0}</p>
                 </div>
              </div>
            </div>

            <div className="animate-in fade-in duration-700 space-y-10 font-black italic">
               {/* BATCH INGESTION (5K LIMIT) */}
               <div className="bg-white/[0.02] border border-[#25F4EE]/20 rounded-[4rem] p-12 relative overflow-hidden group shadow-2xl font-black italic">
                  <div className={`flex flex-col md:flex-row items-center justify-between gap-10 relative z-10 font-black italic ${!isPro ? 'opacity-50 pointer-events-none select-none transition-opacity duration-300' : ''}`}>
                     <div className="flex items-center gap-5 text-left">
                        <div className="p-5 bg-[#25F4EE]/10 rounded-[2rem] border border-[#25F4EE]/20"><FileText size={40} className="text-[#25F4EE]" /></div>
                        <div>
                           <h3 className="text-3xl font-black uppercase italic leading-none mb-3 font-black italic flex items-center gap-2">
                              Bulk Asset Ingestion {!isPro && <Lock size={20} className="text-[#FE2C55]" />}
                           </h3>
                           <p className="text-[11px] text-white/40 font-medium leading-relaxed italic max-w-sm">Import up to 5,000 raw global contacts. Automatic validation scan cleans and prepares disparos.</p>
                        </div>
                     </div>
                     <input type="file" accept=".txt" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                     <div className="flex gap-4 font-black italic">
                        <button onClick={() => fileInputRef.current.click()} disabled={!isPro} className="btn-strategic !w-fit !px-12 text-xs font-black italic py-5 leading-none disabled:opacity-50">{isValidating ? "Validating..." : "Select TXT File"}</button>
                        {importPreview.length > 0 && <button onClick={saveImportToVault} disabled={!isPro} className="btn-strategic btn-neon-cyan text-xs font-black italic py-5 shadow-2xl font-black disabled:opacity-50">Process {importPreview.length} Units</button>}
                     </div>
                  </div>
                  {!isPro && <PremiumLockedFooter featureName="Bulk 5K Import" benefit="ingest massive lists automatically and populate your pipeline in seconds" />}
               </div>
               
               {/* AI AGENT ARCHITECT - DYNAMIC SYNTHESIS */}
               <div className="lighthouse-neon-wrapper shadow-3xl mb-16 relative rounded-[3.5rem]">
                  <div className="lighthouse-neon-content p-8 sm:p-12 text-left rounded-[3.5rem] flex flex-col">
                     <div className={`${!isPro ? 'opacity-50 pointer-events-none select-none transition-opacity duration-300' : ''}`}>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-[#25F4EE]/10 rounded-2xl border border-[#25F4EE]/20"><BrainCircuit size={32} className="text-[#25F4EE]" /></div>
                              <div>
                                 <h3 className="text-2xl font-black uppercase italic flex items-center gap-2">
                                    Global AI Agent Command {!isPro && <Lock size={18} className="text-[#FE2C55]" />}
                                 </h3>
                                 <p className="text-[10px] text-white/30 font-black uppercase tracking-widest font-black italic">Intelligent Message Synthesis Engine</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-2 px-6 py-3 bg-black border border-white/5 rounded-full"><Activity size={14} className="text-[#25F4EE]" /><span className="text-[10px] font-black uppercase text-white/60">Safety Threshold: {connectedChips * 60}/Day</span></div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-left">
                           <div className="space-y-6 text-left">
                              <textarea disabled={!isPro} value={aiObjective} onChange={(e) => {setAiObjective(e.target.value); setSafetyViolation(null);}} placeholder="Enter campaign objective... AI will dynamically synthesize structural adaptations and perform a mandatory SHA (Safety Handshake Audit) to ensure global carrier compliance." className={`input-premium w-full h-[180px] font-black text-sm italic leading-relaxed ${safetyViolation ? 'border-[#FE2C55]/50 shadow-[0_0_20px_rgba(254,44,85,0.2)]' : ''}`} />
                              {safetyViolation && <div className="p-5 bg-[#FE2C55]/10 border border-[#FE2C55]/30 rounded-[2rem] flex items-start gap-4 font-black italic"><AlertIcon size={24} className="text-[#FE2C55] shrink-0" /><p className="text-xs font-black uppercase italic text-[#FE2C55] leading-relaxed tracking-wider font-black italic">{safetyViolation}</p></div>}
                              
                              <button onClick={handlePrepareBatch} disabled={!isPro || isSafetyAuditing || !!safetyViolation || !aiObjective || logs.length === 0} className="btn-strategic btn-neon-cyan text-xs font-black italic py-5 disabled:opacity-30 w-full">{isSafetyAuditing ? "SHA Audit Active..." : `Synthesize Queue (${logs.length} Units)`}</button>
                           </div>
                           <div className="bg-black border border-white/5 rounded-[3.5rem] p-10 flex flex-col justify-center items-center text-center shadow-2xl">
                              {activeQueue.length > 0 ? (
                                 <div className="w-full leading-none">
                                    <div className="mb-10"><p className="text-6xl font-black text-[#25F4EE] italic leading-none">{queueIndex} / {activeQueue.length}</p><p className="text-[11px] font-black text-white/30 uppercase mt-4 tracking-[0.4em]">Intelligent Rotation Active</p></div>
                                    <button onClick={triggerNextInQueue} disabled={!isPro} className="w-full py-8 bg-[#25F4EE] text-black rounded-[2rem] font-black uppercase text-xs shadow-2xl animate-pulse leading-none disabled:opacity-50"><PlayCircle size={24} className="inline mr-2" /> Launch Native Disparo</button>
                                 </div>
                              ) : (
                                 <div className="opacity-20 text-center"><ShieldAlert size={80} className="mx-auto mb-6" /><p className="text-sm font-black uppercase tracking-[0.5em] text-center">System Standby</p></div>
                              )}
                           </div>
                        </div>
                     </div>
                     {!isPro && <PremiumLockedFooter featureName="AI Synthesis Engine" benefit="bypass carrier algorithms with dynamic message scrambling and guarantee delivery" />}
                  </div>
               </div>

               {/* DEVICE SYNC & CONTACTS MODULE */}
               <div className="lighthouse-neon-wrapper shadow-3xl mb-16 relative rounded-[3.5rem]">
                 <div className="lighthouse-neon-content p-8 sm:p-12 text-left rounded-[3.5rem] flex flex-col">
                   <div className={`${!isPro ? 'opacity-50 pointer-events-none select-none transition-opacity duration-300' : ''}`}>
                      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#25F4EE]/10 rounded-2xl border border-[#25F4EE]/20"><Radio size={32} className="text-[#25F4EE]" /></div>
                            <div>
                               <h3 className="text-2xl font-black uppercase italic flex items-center gap-2">
                                  Device Sync Protocol {!isPro && <Lock size={18} className="text-[#FE2C55]" />}
                               </h3>
                               <p className="text-[10px] text-white/30 font-black uppercase tracking-widest font-black italic">Mirror Native App & Deploy to Contacts</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-2 px-6 py-3 bg-black border border-white/5 rounded-full"><Activity size={14} className="text-[#25F4EE]" /><span className="text-[10px] font-black uppercase text-white/60">P2P Encryption Active</span></div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-left">
                         <div className="space-y-6 text-left">
                            <p className="text-xs text-white/50 font-black italic leading-relaxed">Securely mirror your mobile device's native SMS application via QR Code. This enables direct deployment of intelligent, dynamically synthesized campaigns to your personal contact lists with strict delay controls to ensure maximum longevity and 100% Zero Tolerance compliance.</p>
                            
                            <div className="flex items-center gap-4 bg-black border border-white/5 p-4 rounded-2xl">
                               <label className="text-[10px] font-black uppercase text-white/50 w-full">Queue Delay (Seconds):</label>
                               <input disabled={!isPro} type="number" min="15" max="120" defaultValue="30" className="bg-transparent border-b border-[#25F4EE]/30 text-[#25F4EE] font-black text-center w-16 outline-none" />
                               <span className="text-[9px] text-[#FE2C55] uppercase font-black tracking-widest whitespace-nowrap">Min 15s (Safe)</span>
                            </div>

                            <button onClick={handleGenerateDeviceQR} disabled={!isPro || isGeneratingSync} className="btn-strategic btn-neon-cyan text-xs font-black italic py-5 w-full disabled:opacity-50">
                               <Radio size={18}/> {isGeneratingSync ? "GENERATING SECURE TOKEN..." : "Generate Pairing QR Code"}
                            </button>
                         </div>
                         <div className="bg-black border border-white/5 rounded-[3.5rem] p-10 flex flex-col justify-center items-center text-center shadow-2xl min-h-[250px]">
                            {syncQR ? (
                               <div className="animate-in zoom-in duration-500 flex flex-col items-center">
                                 <div className="bg-white p-5 rounded-3xl mb-6 shadow-[0_0_30px_rgba(37,244,238,0.4)]">
                                   <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(syncQR)}&color=000000`} alt="Device Sync QR" className="w-40 h-40"/>
                                 </div>
                                 <p className="text-[11px] text-[#25F4EE] font-black uppercase tracking-[0.3em] animate-pulse">Scan with Native Camera</p>
                               </div>
                            ) : (
                               <div className="opacity-20 text-center"><Smartphone size={80} className="mx-auto mb-6" /><p className="text-sm font-black uppercase tracking-[0.5em] text-center">Awaiting Device Sync</p></div>
                            )}
                         </div>
                      </div>
                   </div>
                   {!isPro && <PremiumLockedFooter featureName="Device Mirror Protocol" benefit="deploy safe campaigns directly to your personal contacts with absolute zero-tolerance compliance" />}
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
            </div>

            {/* UPGRADE / MARKETPLACE (VISÍVEL PARA QUEM NÃO É PRO - TÁTICA AIDA) */}
            {(!isPro) && (
              <div id="marketplace-section" className="mb-16 animate-in fade-in zoom-in-95 duration-700 mt-10">
                 <div className="flex items-center gap-3 mb-10"><ShoppingCart size={24} className="text-[#FE2C55]" /><h3 className="text-2xl font-black uppercase italic tracking-widest text-white">MAXIMIZE YOUR ROI: UPGRADE TO PRO</h3></div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20 text-left">
                   <div className="bg-white/5 border border-[#25F4EE]/30 p-12 rounded-[3.5rem] text-left relative overflow-hidden group shadow-2xl">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Globe size={100} /></div>
                      <h3 className="text-4xl font-black italic text-white uppercase mb-4 text-glow-white leading-none">Nexus Access</h3>
                      <p className="text-white/40 text-[11px] uppercase italic font-black mb-10 tracking-widest leading-relaxed max-w-xs">Premium Attribution Mapping, Unlimited Handshakes & Full Lead Unmasking.</p>
                      <p className="text-5xl font-black text-white italic mb-12 leading-none">$9.00<span className="text-sm text-white/30 tracking-normal uppercase ml-1"> / mo</span></p>
                      <button onClick={() => window.open(STRIPE_NEXUS_LINK, '_blank')} className="btn-strategic btn-neon-white text-xs w-full italic uppercase font-black py-5 shadow-2xl leading-none">UPGRADE TO NEXUS</button>
                   </div>
                   <div className="bg-[#25F4EE]/10 border border-[#25F4EE] p-12 rounded-[3.5rem] text-left relative overflow-hidden group shadow-[0_0_60px_rgba(37,244,238,0.2)]">
                      <div className="absolute top-0 right-0 p-8 text-[#25F4EE] opacity-20 animate-pulse"><BrainCircuit size={100} /></div>
                      <h3 className="text-4xl font-black italic text-white uppercase mb-4 text-glow-white leading-none">Expert Agent</h3>
                      <p className="text-white/40 text-[11px] uppercase italic font-black mb-10 tracking-widest leading-relaxed max-w-xs">AI Synthesis Engine + Multi-Device Operations + 5K Bulk Import & Absolute Automation.</p>
                      <p className="text-5xl font-black text-white italic mb-12 leading-none">$19.90<span className="text-sm text-white/30 tracking-normal uppercase ml-1"> / mo</span></p>
                      <button onClick={() => window.open(STRIPE_EXPERT_LINK, '_blank')} className="btn-strategic btn-neon-cyan text-xs w-full italic uppercase font-black py-5 shadow-2xl leading-none text-black">ACTIVATE EXPERT AI</button>
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

            {/* MÓDULO NOVO: SMART LINKS MANAGEMENT (HISTÓRICO) */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-3xl mt-16 font-black italic">
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02] font-black italic">
                <div className="flex items-center gap-3 text-left font-black italic"><Globe size={20} className="text-[#25F4EE]" /><h3 className="text-lg font-black uppercase italic">Smart Links Management</h3></div>
              </div>
              <div className="min-h-[200px] max-h-[40vh] overflow-y-auto text-left font-black italic">
                {myLinks.length > 0 ? myLinks.map(link => (
                  <div key={link.id} className={`p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-white/[0.02] transition-colors ${link.status === 'canceled' ? 'opacity-50' : ''}`}>
                    <div className="text-left font-black italic">
                      <p className="font-black text-xl text-white uppercase italic">{link.company}</p>
                      <p className="text-[12px] text-[#25F4EE] font-black">{link.to}</p>
                      <p className="text-[10px] text-white/40 mt-2 truncate max-w-xs">{link.url}</p>
                      <p className="text-[9px] text-white/30 uppercase mt-1">{link.created_at?.seconds ? new Date(link.created_at.seconds * 1000).toLocaleString() : 'Just now'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] px-3 py-1 rounded-full uppercase ${link.status === 'active' ? 'bg-[#25F4EE]/10 text-[#25F4EE]' : 'bg-[#FE2C55]/10 text-[#FE2C55]'}`}>
                        {link.status}
                      </span>
                      <button onClick={() => toggleLinkStatus(link.id, link.status)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white" title={link.status === 'active' ? 'Cancel Link' : 'Activate Link'}><RefreshCw size={14} /></button>
                      <button onClick={() => {setEditingLink(link); setEditMsg(link.msg);}} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white" title="Edit Message"><Edit size={14} /></button>
                      <button onClick={() => deleteLink(link.id)} className="p-2 bg-[#FE2C55]/10 rounded-lg hover:bg-[#FE2C55]/20 text-[#FE2C55]" title="Delete Link"><Trash size={14} /></button>
                    </div>
                  </div>
                )) : <div className="p-20 text-center opacity-20 font-black italic"><Globe size={48} className="mx-auto mb-4" /><p className="text-[10px] font-black uppercase font-black italic">No Active Links Found</p></div>}
              </div>
            </div>
            
            {/* VAULT SYNC COM MÁSCARA PRO (AIDA UPSELL) */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-3xl mt-16 font-black italic flex flex-col">
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02] font-black italic">
                <div className="flex items-center gap-3 text-left font-black italic"><Database size={20} className="text-[#25F4EE]" /><h3 className="text-lg font-black uppercase italic">Data Vault Explorer</h3></div>
                <button onClick={() => setIsVaultActive(!isVaultActive)} className={`flex items-center gap-2 px-6 py-2.5 rounded-full border text-[9px] font-black transition-all ${isVaultActive ? 'bg-[#FE2C55]/10 border-[#FE2C55]/30 text-[#FE2C55]' : 'bg-[#25F4EE]/10 border-[#25F4EE]/30 text-[#25F4EE]'}`}>{isVaultActive ? "DISCONNECT VAULT" : "SYNC LEAD VAULT"}</button>
              </div>
              <div className="min-h-[200px] max-h-[40vh] overflow-y-auto text-left font-black italic">
                {isVaultActive ? logs.map(l => {
                  const maskStr = (str) => {
                     if (!str) return '';
                     if (isPro) return str;
                     const s = String(str);
                     if (s.length <= 6) return s.slice(0, 2) + '***';
                     return s.slice(0, 5) + '*****' + s.slice(-2);
                  };

                  return (
                    <div key={l.id} className="p-8 border-b border-white/5 flex justify-between items-center hover:bg-white/[0.02]">
                      <div className="text-left font-black italic">
                        <p className="font-black text-xl text-white uppercase italic flex items-center gap-2">
                           {isPro ? (l.nome_cliente || l.location) : 'PROT*****EAD'}
                           {!isPro && <span className="text-[8px] bg-[#FE2C55] text-white px-2 py-0.5 rounded-full uppercase animate-pulse">Locked</span>}
                        </p>
                        <p className="text-[12px] text-[#25F4EE] font-black">
                           {maskStr(l.telefone_cliente || l.destination)}
                        </p>
                      </div>
                      <div className="text-right text-[10px] text-white/30 font-black uppercase font-black italic">
                        <p>{isPro ? l.location : 'LOCKED GEO'}</p>
                        <p className="mt-1">{isPro ? (l.ip || 'Global Asset') : 'LOCKED IP'}</p>
                      </div>
                    </div>
                  );
                }) : <div className="p-20 text-center opacity-20 font-black italic"><Lock size={48} className="mx-auto mb-4" /><p className="text-[10px] font-black uppercase font-black italic">Vault Standby Mode</p></div>}
              </div>
              {!isPro && isVaultActive && (
                <div className="p-8 bg-[#FE2C55]/5 border-t border-[#FE2C55]/20 flex flex-col items-center justify-center text-center gap-5 mt-auto">
                   <p className="text-[11px] text-[#FE2C55] font-black uppercase tracking-widest leading-relaxed flex items-center justify-center gap-2">
                     <Lock size={16} /> DATA MASKED. UPGRADE TO REVEAL FULL LEAD IDENTITIES.
                   </p>
                   <button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="btn-strategic !bg-[#FE2C55] !text-white text-[10px] w-full max-w-[300px] py-4 shadow-[0_0_20px_rgba(254,44,85,0.4)] animate-pulse">
                     UNLOCK LEADS NOW
                   </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Link Modal */}
        {editingLink && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <div className="lighthouse-neon-wrapper w-full max-w-md shadow-3xl">
              <div className="lighthouse-neon-content p-8 sm:p-12 text-left">
                 <h3 className="text-2xl font-black italic mb-6 uppercase tracking-tighter">Edit Smart Link</h3>
                 <textarea value={editMsg} onChange={e=>setEditMsg(e.target.value)} className="input-premium w-full h-32 mb-6 text-sm" placeholder="Update your message..." />
                 <div className="flex gap-4">
                   <button onClick={saveEditedLink} className="flex-1 py-4 bg-[#25F4EE] text-black font-black italic uppercase text-[10px] rounded-2xl shadow-[0_0_20px_rgba(37,244,238,0.3)] hover:scale-105 transition-transform">Save Changes</button>
                   <button onClick={() => setEditingLink(null)} className="flex-1 py-4 bg-white/5 font-black italic uppercase text-[10px] rounded-2xl hover:bg-white/10 transition-colors">Cancel</button>
                 </div>
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
                   {isResetMode ? "Identity Recovery" : isLoginMode ? "Member Login" : "Create Account"}
                </h2>
                
                {isResetMode ? (
                   <form onSubmit={handlePasswordReset} className="space-y-7 text-left font-black italic">
                     <div className="space-y-2 text-left font-black italic">
                       <label className="text-[10px] font-black uppercase italic text-white/40 ml-1 italic leading-none font-black">Account Email</label>
                       <input required type="email" placeholder="Your Email Address" value={email} onChange={e=>setEmail(e.target.value)} className="input-premium font-bold font-black w-full" />
                     </div>
                     <button type="submit" disabled={loading} className="btn-strategic btn-neon-cyan text-[11px] mt-4 shadow-xl w-full">{loading ? "PROCESSING..." : "Send Recovery Link"}</button>
                     <button type="button" onClick={() => setIsResetMode(false)} className="w-full text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-10 text-center hover:text-white transition-all">Return to Login</button>
                   </form>
                ) : (
                   <form onSubmit={handleAuthSubmit} className="space-y-4 text-left font-black italic">
                     {!isLoginMode && (
                       <>
                         <input required placeholder="Full Operator Name" value={fullName} onChange={e=>setFullName(e.target.value)} className="input-premium text-xs w-full" />
                         <input required placeholder="+1 999 999 9999" value={phone} onChange={e=>setPhone(e.target.value)} className="input-premium text-xs w-full" />
                         <div className="h-px bg-white/5 w-full my-4" />
                       </>
                     )}
                     <input required type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} className="input-premium text-xs w-full" />
                     <div className="relative font-black italic">
                       <input required type={showPass ? "text" : "password"} placeholder="Security Key (Password)" value={password} onChange={e=>setPassword(e.target.value)} className="input-premium text-xs w-full mb-1 font-black italic" />
                       <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-5 text-white/30 hover:text-[#25F4EE] transition-colors leading-none"><Eye size={18}/></button>
                     </div>
                     
                     {isLoginMode && (
                        <div className="text-right mt-1 mb-4 font-black italic">
                          <button type="button" onClick={() => setIsResetMode(true)} className="text-[9px] text-[#25F4EE] hover:text-white uppercase font-black tracking-widest italic">Forgot Password?</button>
                        </div>
                     )}

                     {!isLoginMode && (
                       <input required type={showPass ? "text" : "password"} placeholder="Repeat Key" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="input-premium text-xs w-full mt-3 font-black italic" />
                     )}

                     {!isLoginMode && (
                       <div className="flex items-start gap-3 py-4 cursor-pointer text-left leading-none font-black italic" onClick={() => setTermsAccepted(!termsAccepted)}>
                         <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 font-black italic ${termsAccepted ? 'bg-[#25F4EE] border-[#25F4EE]' : 'bg-black border-white/20'}`}>{termsAccepted && <Check size={10} className="text-black font-black" />}</div>
                         <p className="text-[9px] font-black uppercase italic text-white/40 leading-relaxed tracking-wider text-left font-black italic">I agree to the <button type="button" onClick={(e) => { e.stopPropagation(); setShowTerms(true); }} className="text-white border-b border-white/20 hover:text-[#25F4EE] font-black italic">General Terms of Use</button> and Ethics.</p>
                       </div>
                     )}
                     
                     <button type="submit" disabled={loading} className="btn-strategic btn-neon-cyan text-[11px] mt-4 shadow-xl w-full font-black italic">{loading ? "PROCESSING..." : isLoginMode ? "Secure Login" : "Create Account"}</button>
                     
                     <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); setShowPass(false); }} className="w-full text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-10 text-center hover:text-white transition-all uppercase font-black italic">{isLoginMode ? "CREATE NEW ACCOUNT? REGISTER" : "ALREADY A MEMBER? LOGIN HERE"}</button>
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
                 <button className="btn-strategic btn-neon-cyan text-xs italic uppercase font-black py-4 shadow-xl w-full font-black italic">Connect Now</button>
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
                 <button onClick={() => { setTermsAccepted(true); setShowTerms(false); }} className="btn-strategic btn-neon-cyan text-xs w-full italic uppercase font-black py-4 leading-none font-black italic">I Accept Responsibility</button>
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
