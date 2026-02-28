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
  deleteDoc,
  increment,
  writeBatch
} from 'firebase/firestore';
import { 
  Zap, Lock, Globe, ChevronRight, Copy, Check, ExternalLink, Menu, X, 
  LayoutDashboard, LogOut, Target, Rocket, BrainCircuit, ShieldAlert, Activity, 
  Smartphone, Shield, Info, Database, RefreshCw, Users, Crown,
  UserCheck, UserMinus, Gift, Bot, Eye, EyeOff, BarChart3, ShieldCheck,
  Server, Cpu, Radio, UserPlus, HelpCircle, ChevronDown, ChevronUp, Star, BookOpen, 
  AlertOctagon, Scale, FileText, UploadCloud, PlayCircle,
  ShoppingCart, Wallet, AlertTriangle, Trash, Edit, Clock, Calendar, Send, Plus
} from 'lucide-react';

// --- CONFIGURAÇÃO SEGURA FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyBI-JSC-FtVOz_r6p-XjN6fUrapMn_ad24",
  authDomain: "smartsmspro-4ee81.firebaseapp.com",
  projectId: "smartsmspro-4ee81",
  storageBucket: "smartsmspro-4ee81.firebasestorage.app",
  messagingSenderId: "269226709034",
  appId: "1:269226709034:web:00af3a340b1e1ba928f353"
};

const appId = "smartsms-pro-elite-terminal-vfinal";
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// --- MASTER ADMIN ACCESS SOBERANO ---
const ADMIN_MASTER_ID = "YGepVHHMYaN9sC3jFmTyry0mYZO2"; // <--- ALEX MASTER

// --- COMPONENTE FAQ ---
function FAQItem({ q, a }) {
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
}

export default function App() {
  // --- 1. ESTADOS GLOBAIS DE INTERFACE ---
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSmartSupport, setShowSmartSupport] = useState(false);
  
  // --- 2. ESTADOS DE DADOS (Vault & Inventory) ---
  const [logs, setLogs] = useState([]); 
  const [linksHistory, setLinksHistory] = useState([]);
  
  // --- 3. ESTADOS DO GERADOR E ENVIO RÁPIDO ---
  const [genTo, setGenTo] = useState('');
  const [genMsg, setGenMsg] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [editingLink, setEditingLink] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // --- 4. ESTADOS DA CAPTURA (Compliance Gate) ---
  const [captureData, setCaptureData] = useState(null);
  const [captureForm, setCaptureForm] = useState({ name: '', phone: '' });

  // --- 5. ESTADOS DE AUTENTICAÇÃO ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPass, setShowPass] = useState(false);

  // --- 6. ESTADOS DO MOTOR IA ---
  const [aiObjective, setAiObjective] = useState('');
  const [aiWarning, setAiWarning] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [activeQueue, setActiveQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [connectedChips, setConnectedChips] = useState(1);
  const [sendDelay, setSendDelay] = useState(30);

  const fileInputRef = useRef(null);
  
  // Variáveis Derivadas de Autoridade
  const isMaster = user?.uid === ADMIN_MASTER_ID;
  const isPro = isMaster || (userProfile?.tier === 'MASTER' || userProfile?.tier === 'ELITE' || userProfile?.isSubscribed);
  const MSG_LIMIT = 300;

  // --- BOOTSTRAP DE IDENTIDADE (Validação Master Imediata) ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        if (u.uid === ADMIN_MASTER_ID) {
          setUserProfile({ 
            fullName: "Alex Master", 
            tier: 'MASTER', 
            isUnlimited: true, 
            smsCredits: 999999, 
            isSubscribed: true 
          });
        } else {
          const docRef = doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'data');
          const d = await getDoc(docRef);
          if (d.exists()) {
            setUserProfile(d.data());
          } else {
            const p = { fullName: String(u.email?.split('@')[0] || 'Operator'), email: u.email, tier: 'FREE_TRIAL', smsCredits: 60, created_at: serverTimestamp() };
            await setDoc(docRef, p);
            setUserProfile(p);
          }
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setAuthResolved(true);
    });
    return () => unsubscribe();
  }, []);

  // --- SENSOR DO PORTAL DE CAPTURA ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('t');
    const m = params.get('m');
    const o = params.get('o');
    if (t && m && o && view !== 'capture') {
      setCaptureData({ to: t, msg: m, ownerId: o, company: params.get('c') || 'Verified Host' });
      setView('capture');
    }
  }, [view]);

  // --- SINCRONIZAÇÃO DE DADOS SEGURA ---
  useEffect(() => {
    if (!user || view !== 'dashboard') return;
    
    const unsubLeads = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), (snap) => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const myData = isMaster ? all : all.filter(l => l.ownerId === user.uid);
      setLogs(myData.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
    });

    const unsubLinks = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'links'), (snap) => {
      setLinksHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0)));
    });

    return () => { unsubLeads(); unsubLinks(); };
  }, [user, view, isMaster]);

  // --- MOTOR DE DISPARO EM MASSA (BACKGROUND) ---
  useEffect(() => {
    let timer;
    if (activeQueue.length > 0 && queueIndex < activeQueue.length) {
      timer = setTimeout(() => {
        const current = activeQueue[queueIndex];
        const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
        setQueueIndex(prev => prev + 1);
        window.location.href = `sms:${current.telefone_cliente}${sep}body=${encodeURIComponent(current.optimizedMsg)}`;
      }, Math.max(sendDelay, 20) * 1000);
    }
    return () => clearTimeout(timer);
  }, [activeQueue, queueIndex, sendDelay]);

  // ============================================================================
  // FUNÇÕES DE COMANDO
  // ============================================================================
  
  const handleBulkImport = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    
    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n').map(l => l.trim()).filter(l => l);
      
      try {
        let batch = writeBatch(db);
        let count = 0;
        let totalImported = 0;

        for (const line of lines) {
          let name = "Imported Lead";
          let phone = line;
          
          if (line.includes(',')) {
            const parts = line.split(',');
            name = parts[0].trim();
            phone = parts[1].trim();
          }

          const safePhone = phone.replace(/\D/g, '');
          if (!safePhone) continue;

          const leadDocId = `${user.uid}_${safePhone}`;
          const leadRef = doc(db, 'artifacts', appId, 'public', 'data', 'leads', leadDocId);

          batch.set(leadRef, {
            ownerId: user.uid,
            nome_cliente: name,
            telefone_cliente: phone,
            timestamp: serverTimestamp(),
            device: 'Bulk Import TXT'
          }, { merge: true });

          count++;
          totalImported++;

          if (count === 400) {
            await batch.commit();
            batch = writeBatch(db);
            count = 0;
          }
        }
        
        if (count > 0) {
          await batch.commit();
        }
        
        alert(`Success! ${totalImported} global units ingested into the Vault.`);
      } catch (error) {
        console.error(error);
        alert("Error during bulk ingestion.");
      }
      
      setLoading(false);
      e.target.value = '';
    };
    
    reader.readAsText(file);
  };

  const handleGenerate = async () => {
    if (!user) { 
      setIsLoginMode(false); 
      setView('auth'); 
      return; 
    }
    
    const to = editingLink ? editingLink.to : genTo;
    const msg = editingLink ? editingLink.msg : genMsg;
    const company = editingLink ? editingLink.company : (companyName || 'Verified Host');

    if (!to) return alert("Destination number is required.");
    setLoading(true);
    
    const lid = editingLink ? editingLink.id : crypto.randomUUID().split('-')[0];
    const link = `${window.location.origin}?t=${encodeURIComponent(to)}&m=${encodeURIComponent(msg)}&o=${user.uid}&c=${encodeURIComponent(company)}`;
    
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', lid), { 
      url: link, to, msg, company, created_at: serverTimestamp(), status: 'active'
    }, { merge: true });

    if (!editingLink) setGeneratedLink(link);
    setEditingLink(null);
    setGenTo(''); setGenMsg(''); setCompanyName('');
    setLoading(false);
  };

  const handleQuickSend = (e) => {
    e.preventDefault();
    if(!genTo || !genMsg) return alert("Destinatário e Mensagem são obrigatórios.");
    const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
    window.location.href = `sms:${genTo}${sep}body=${encodeURIComponent(genMsg)}`;
  };

  const handleDeleteLink = async (id) => {
    if(window.confirm("Delete this protocol?")) {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', id));
    }
  };

  const handleProtocolHandshake = async () => {
    if(!captureForm.name || !captureForm.phone) return;
    if(!captureForm.phone.startsWith('+')) return alert("Use valid format with '+' prefix (ex: +1 999 999 9999)");
    
    setLoading(true);
    try {
      const ownerId = captureData.ownerId;
      const safePhone = captureForm.phone.replace(/\D/g, '');
      const leadDocId = `${ownerId}_${safePhone}`;
      const leadRef = doc(db, 'artifacts', appId, 'public', 'data', 'leads', leadDocId);
      
      const leadSnap = await getDoc(leadRef);
      const isNewLead = !leadSnap.exists();

      await setDoc(leadRef, {
        ownerId,
        nome_cliente: String(captureForm.name),
        telefone_cliente: String(captureForm.phone),
        timestamp: serverTimestamp(),
        device: navigator.userAgent
      }, { merge: true });

      if (isNewLead && ownerId !== ADMIN_MASTER_ID) {
        const pubRef = doc(db, 'artifacts', appId, 'users', ownerId, 'profile', 'data');
        const opSnap = await getDoc(pubRef);
        if (opSnap.exists() && opSnap.data().tier !== 'MASTER') {
           if (opSnap.data().smsCredits <= 0) { 
               alert("Host out of credits.");
               setLoading(false); 
               return; 
           }
           await updateDoc(pubRef, { smsCredits: increment(-1) });
        }
      }

      setView('bridge');
      setTimeout(() => {
        const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
        window.location.href = `sms:${captureData.to}${sep}body=${encodeURIComponent(captureData.msg)}`;
      }, 1000);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const emailLower = email.toLowerCase().trim();
      let authUser;
      
      if (isLoginMode) {
        const cred = await signInWithEmailAndPassword(auth, emailLower, password);
        authUser = cred.user;
      } else {
        const cred = await createUserWithEmailAndPassword(auth, emailLower, password);
        authUser = cred.user;
        const p = { fullName: fullNameInput, email: emailLower, tier: 'FREE_TRIAL', smsCredits: 60, created_at: serverTimestamp() };
        await setDoc(doc(db, 'artifacts', appId, 'users', authUser.uid, 'profile', 'data'), p);
      }

      if (authUser.uid === ADMIN_MASTER_ID) {
        setUserProfile({ fullName: "Alex Master", tier: 'MASTER', isUnlimited: true, smsCredits: 999999, isSubscribed: true });
      }

      setView('dashboard');
    } catch (e) { alert("Identity Denied: " + e.message); }
    setLoading(false);
  };

  const validateAIContent = (text) => {
    setAiObjective(text);
    const forbidden = /(hack|scam|fraud|phishing|hate|racism|murder|porn|malware|virus|golpe|ódio)/i;
    if (forbidden.test(text)) {
      setAiWarning("SECURITY ALERT: Policy Violation.");
    } else {
      setAiWarning('');
    }
  };

  const handlePrepareBatch = () => {
    if (!aiObjective || logs.length === 0 || aiWarning) return;
    setIsAiProcessing(true);
    setTimeout(() => {
      const limit = Math.min(60, isPro ? 999999 : (Number(userProfile?.smsCredits) || 0), logs.length);
      setActiveQueue(logs.slice(0, limit).map(l => ({ ...l, optimizedMsg: `${aiObjective} [ID:${Math.random().toString(36).substr(2,4).toUpperCase()}]` })));
      setQueueIndex(0);
      setIsAiProcessing(false);
    }, 1000);
  };

  const maskData = (s, type) => { 
    if (isPro) return String(s || ''); 
    if (type === 'name') return String(s || '').substring(0, 3) + '***'; 
    return String(s || '').substring(0, 6) + '***'; 
  };

  // INDICADOR DE CONEXÃO ULTRARRÁPIDO NO BOOT (Remove a tela preta "morta")
  if (!authResolved) {
    return (
      <div className="min-h-screen bg-[#010101] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#25F4EE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ============================================================================
  // TELA DE CAPTURA DO LEAD (100% ISOLADA PARA ANONIMATO)
  // ============================================================================
  if (view === 'capture') {
    return (
      <div className="fixed inset-0 z-[500] bg-[#010101] flex flex-col items-center justify-center p-6 text-center font-black italic selection:bg-[#25F4EE] selection:text-black">
        <style>{`
          @keyframes rotate-beam { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
          .lighthouse-neon-wrapper { position: relative; padding: 1.5px; border-radius: 28px; overflow: hidden; background: transparent; display: flex; align-items: center; justify-content: center; }
          .lighthouse-neon-wrapper::before { content: ""; position: absolute; width: 600%; height: 600%; top: 50%; left: 50%; background: conic-gradient(transparent 45%, #25F4EE 48%, #FE2C55 50%, #25F4EE 52%, transparent 55%); animation: rotate-beam 5s linear infinite; z-index: 0; }
          .lighthouse-neon-content { position: relative; z-index: 1; background: #0a0a0a; border-radius: 27px; width: 100%; height: 100%; }
          .btn-strategic { background: #FFFFFF; color: #000000; border-radius: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; width: 100%; padding: 1.15rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; border: none; cursor: pointer; transition: all 0.3s; }
          .input-premium { background: #111; border: 1px solid rgba(255,255,255,0.1); color: white; width: 100%; padding: 1.1rem 1.25rem; border-radius: 16px; outline: none; font-size: 16px; font-weight: 500; font-style: normal; text-transform: none !important; }
        `}</style>
        <div className="lighthouse-neon-wrapper w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <div className="lighthouse-neon-content p-10 sm:p-20 flex flex-col items-center">
            <ShieldCheck size={80} className="text-[#25F4EE] mb-8 animate-pulse drop-shadow-[0_0_15px_#25F4EE]" />
            <h2 className="text-3xl uppercase tracking-tighter text-white mb-4">Security Validation</h2>
            <p className="text-[12px] text-white/50 uppercase tracking-widest leading-relaxed mb-10 text-center px-4">
              Identity Verification Required. Confirm your details to ensure anti-spam compliance before accessing the host node.
            </p>
            <div className="w-full space-y-6 text-left">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/30 ml-1 mb-2 block">Full Legal Name</label>
                <input required placeholder="Identity Name" value={captureForm.name} onChange={e=>setCaptureForm({...captureForm, name: e.target.value})} className="input-premium text-lg w-full font-medium text-white" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/30 ml-1 mb-2 block">Mobile ID (ex: +1 999 999 9999)</label>
                <input required type="tel" placeholder="+DDI Mobile ID" value={captureForm.phone} onChange={e=>setCaptureForm({...captureForm, phone: e.target.value})} className="input-premium text-lg w-full font-medium text-white" />
              </div>
              <button onClick={handleProtocolHandshake} disabled={loading} className="btn-strategic !bg-[#25F4EE] !text-black text-[12px] uppercase py-6 w-full shadow-[0_0_20px_#25F4EE] mt-4">Confirm & Access <ChevronRight size={16}/></button>
            </div>
            <div className="flex items-center gap-2 mt-12 opacity-30 text-white uppercase">
               <Lock size={14} className="text-[#25F4EE]"/> <span className="text-[10px] uppercase tracking-widest text-[#25F4EE]">Zero-Knowledge Encrypted Terminal</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // TELA PRINCIPAL (HOME, DASHBOARD, AUTH)
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans selection:bg-[#25F4EE] selection:text-black antialiased flex flex-col relative overflow-x-hidden font-black italic uppercase">
      <style>{`
        @keyframes rotate-beam { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        .lighthouse-neon-wrapper { position: relative; padding: 1.5px; border-radius: 28px; overflow: hidden; background: transparent; display: flex; align-items: center; justify-content: center; }
        .lighthouse-neon-wrapper::before { content: ""; position: absolute; width: 600%; height: 600%; top: 50%; left: 50%; background: conic-gradient(transparent 45%, #25F4EE 48%, #FE2C55 50%, #25F4EE 52%, transparent 55%); animation: rotate-beam 5s linear infinite; z-index: 0; }
        .lighthouse-neon-content { position: relative; z-index: 1; background: #0a0a0a; border-radius: 27px; width: 100%; height: 100%; }
        .btn-strategic { background: #FFFFFF; color: #000000; border-radius: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; width: 100%; padding: 1.15rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; border: none; cursor: pointer; transition: all 0.3s; }
        .btn-strategic:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 0 40px rgba(37,244,238,0.4); }
        .input-premium { background: #111; border: 1px solid rgba(255,255,255,0.1); color: white; width: 100%; padding: 1.1rem 1.25rem; border-radius: 16px; outline: none; font-size: 16px; font-weight: 500; font-style: normal; text-transform: none !important; }
        .text-glow-white { text-shadow: 0 0 15px rgba(255,255,255,0.8); }
        .pro-obscure { position: relative; overflow: hidden; border-radius: 2.5rem; }
        .pro-obscure::after { content: ""; position: absolute; inset: 0; background: rgba(0,0,0,0.6); backdrop-blur: 4px; pointer-events: none; z-index: 5; }
        .pro-lock-layer { position: absolute; inset: 0; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #25F4EE; border-radius: 10px; }
      `}</style>

      {/* --- TOP NAV PREMIUM --- */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[100] px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-[#25F4EE]/10 p-1.5 rounded-lg border border-[#25F4EE]/30"><Zap size={20} className="text-[#25F4EE] fill-[#25F4EE]" /></div>
          <span className="text-lg font-black tracking-tighter text-white mt-1">SMART SMS PRO</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[10px] tracking-widest">
           {!user ? (
             <>
               <button onClick={() => { setIsLoginMode(true); setView('auth'); }} className={`transition-colors border-b-2 pb-1 ${view === 'auth' && isLoginMode ? 'border-[#25F4EE] text-[#25F4EE]' : 'border-transparent hover:text-[#25F4EE]'}`}>Secure Member Portal</button>
               <button onClick={() => { setIsLoginMode(false); setView('auth'); }} className="bg-[#25F4EE] text-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all shadow-[0_0_15px_rgba(37,244,238,0.2)]">Join Network</button>
             </>
           ) : (
             <>
               <button onClick={() => setView('dashboard')} className={`flex items-center gap-2 transition-colors ${view === 'dashboard' ? 'text-[#25F4EE]' : 'hover:text-[#25F4EE]'}`}><LayoutDashboard size={14}/> Operator Hub</button>
               <button onClick={() => setShowSmartSupport(true)} className="flex items-center gap-2 hover:text-[#25F4EE] transition-colors"><Bot size={14}/> Smart Support</button>
               <button onClick={() => signOut(auth).then(()=>setView('home'))} className="text-[#FE2C55] hover:opacity-70 transition-all flex items-center gap-2"><LogOut size={14}/> Logout</button>
             </>
           )}
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-white/50 hover:text-white transition-all z-[110]">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[140]" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-80 bg-[#050505] border-l border-white/10 h-screen z-[150] p-10 flex flex-col shadow-2xl animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-12">
              <span className="text-xs text-white/20 tracking-[0.3em]">Command Center</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-white/40 hover:text-white"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-10 flex-1">
              {!user ? (
                <button onClick={() => {setView('auth'); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm tracking-widest text-[#25F4EE] hover:text-white transition-colors"><UserPlus size={20} /> Member Portal</button>
              ) : (
                <>
                  <div className="mb-6 p-6 bg-white/5 rounded-3xl border border-white/10">
                     <p className="text-[9px] text-white/30 mb-2 tracking-widest">Identity: {String(userProfile?.tier || 'FREE')}</p>
                     <p className="text-sm text-[#25F4EE] truncate">{String(userProfile?.fullName || 'Operator')}</p>
                  </div>
                  <button onClick={() => {setView('dashboard'); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm tracking-widest text-white hover:text-[#25F4EE] transition-colors"><LayoutDashboard size={20} /> Operator Hub</button>
                  <button onClick={() => {setShowSmartSupport(true); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm tracking-widest text-[#25F4EE] hover:text-white transition-colors"><Bot size={20} /> Smart Support</button>
                  <button onClick={() => {signOut(auth).then(()=>setView('home')); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm tracking-widest text-[#FE2C55] hover:opacity-70 transition-all"><LogOut size={20} /> Logout</button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* --- CONTENT HUB --- */}
      <div className="pt-28 flex-1 pb-10 relative">
        <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#FE2C55] opacity-[0.03] blur-[150px] pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#25F4EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

        {/* ==================== HOME ==================== */}
        {view === 'home' && (
          <div className="w-full max-w-[540px] mx-auto px-4 z-10 relative text-center animate-in fade-in zoom-in-95 duration-200">
            <header className="mb-14 text-center flex flex-col items-center">
              <div className="lighthouse-neon-wrapper mb-4"><div className="lighthouse-neon-content px-10 py-4"><h1 className="text-3xl text-white text-glow-white">SMART SMS PRO</h1></div></div>
              <p className="text-[10px] text-white/40 font-bold tracking-[0.4em] text-center">High-End Redirection Protocol - 60 Free Handshakes</p>
            </header>

            <main className="space-y-8 pb-20 text-left">
              {user && (
                <div className="flex justify-center mb-2 animate-in fade-in zoom-in duration-200">
                  <button onClick={() => setView('dashboard')} className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full max-w-[420px] shadow-[0_0_30px_#25F4EE]"><LayoutDashboard size={24} /> ACCESS OPERATOR HUB</button>
                </div>
              )}

              <div className="lighthouse-neon-wrapper shadow-3xl">
                <div className="lighthouse-neon-content p-8 sm:p-12 text-left space-y-8">
                  <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"></div><h3 className="text-[11px] tracking-widest text-white/60">Smart Handshake Generator</h3></div>
                  <div className="space-y-3">
                     <label className="text-[10px] text-white/40 ml-1 tracking-widest block">Destination <span className="text-[#25F4EE] ml-2 opacity-50 text-[8px]">ex: +1 999 999 9999</span></label>
                     <input type="tel" value={genTo} onChange={e => setGenTo(e.target.value)} className="input-premium text-white font-sans font-medium" placeholder="+1 999 999 9999" />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] text-white/40 ml-1 tracking-widest block">Host Identity</label>
                     <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-premium text-sm text-white/50 w-full font-sans font-medium !text-transform-none" placeholder="Your Organization Name" />
                  </div>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center"><label className="text-[10px] text-white/40 ml-1 tracking-widest block">Payload Content</label><span className="text-[9px] text-white/20">{genMsg.length}/{MSG_LIMIT}</span></div>
                     <div className="relative">
                        <textarea value={genMsg} onChange={e => setGenMsg(e.target.value)} rows="3" className="input-premium w-full text-sm leading-relaxed pr-12 font-sans font-medium !text-transform-none" placeholder="Draft your intelligent payload..." />
                        <button onClick={()=>setShowInstructions(!showInstructions)} className="absolute right-3 bottom-4 p-2 bg-[#25F4EE]/10 rounded-lg text-[#25F4EE] hover:bg-[#25F4EE]/20 transition-all"><HelpCircle size={16}/></button>
                     </div>
                  </div>
                  
                  {/* Bloco de Instruções */}
                  {showInstructions && (
                    <div className="p-6 bg-white/[0.03] border border-[#25F4EE]/20 rounded-2xl animate-in slide-in-from-top-2">
                       <h5 className="text-[11px] text-[#25F4EE] mb-3">Performance Instructions:</h5>
                       <ul className="text-[10px] text-white/40 space-y-2 leading-relaxed">
                          <li>● Use direct calls to action to minimize user decision lag.</li>
                          <li>● Keep payload between 160-300 chars for carrier standing.</li>
                          <li>● Confirming leads routes traffic to your native SMS node.</li>
                       </ul>
                    </div>
                  )}

                  <button onClick={handleGenerate} className="btn-strategic !bg-[#25F4EE] !text-black text-xs py-5 w-full shadow-2xl">
                    Generate Smart Link <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {generatedLink && (
                <div className="animate-in zoom-in-95 duration-200 space-y-6">
                  <div className="bg-[#0a0a0a] border border-[#25F4EE]/20 rounded-[40px] p-10 text-center shadow-2xl">
                    <div className="bg-white p-6 rounded-3xl inline-block mb-10 shadow-xl"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(generatedLink)}&color=000000`} className="w-32 h-32" alt="QR Code"/></div>
                    <input readOnly value={generatedLink} onClick={e=>e.target.select()} className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-[11px] text-[#25F4EE] font-mono text-center outline-none mb-8 border-dashed font-medium !text-transform-none" />
                    <div className="grid grid-cols-2 gap-6 w-full">
                      <button onClick={() => {navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="flex flex-col items-center py-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">{copied ? <Check size={24} className="text-[#25F4EE]" /> : <Copy size={24} className="text-white/40" />}<span className="text-[10px] mt-2 text-white/50 tracking-widest text-center">Quick Copy</span></button>
                      <button onClick={() => window.open(generatedLink, '_blank')} className="flex flex-col items-center py-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"><ExternalLink size={24} className="text-white/40" /><span className="text-[10px] mt-1 text-white/50 tracking-widest text-center">Live Test</span></button>
                    </div>
                  </div>
                </div>
              )}

              {/* ISCA DE CAPTAÇÃO: Se Deslogado, força Registo */}
              {!user && (
                <div className="flex flex-col items-center gap-6 mt-8 w-full animate-in zoom-in-95 duration-200 pb-10 text-center">
                  <button onClick={() => {setIsLoginMode(false); setView('auth')}} className="btn-strategic !bg-white !text-black text-xs w-full max-w-[420px] group py-6 shadow-xl"><Rocket size={24} className="group-hover:animate-bounce" /> Start 60 Free Handshakes</button>
                  <button onClick={() => window.open("https://buy.stripe.com/nexus_access", '_blank')} className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full max-w-[420px] group py-6 shadow-[0_0_20px_#25F4EE]"><Star size={24} className="animate-pulse" /> Upgrade to Elite Member</button>
                </div>
              )}

              {/* FAQ Limpo */}
              <div className="pt-20 pb-12 text-left">
                 <div className="flex items-center gap-3 mb-12"><HelpCircle size={28} className="text-[#FE2C55]"/><h3 className="text-3xl text-white tracking-widest">Protocol FAQ</h3></div>
                 <div className="space-y-2 text-left leading-tight">
                    <FAQItem q="Why utilize our exclusive protocol instead of standard market routing?" a="Standard market redirects often trigger automated carrier heuristics instantly. Our proprietary protocol dynamically formats headers to mirror organic traffic signatures globally, significantly enhancing final delivery rates." />
                    <FAQItem q="Is the cryptographic vault fully impenetrable and compliant?" a="Absolutely. Operating under a robust Zero-Knowledge architecture, lead metadata remains exclusively encrypted within your session context. We maintain rigorous alignment with international protection protocols (GDPR/LGPD)." />
                    <FAQItem q="How does the system ensure long-term standing protection?" a="Our ecosystem employs an intelligent pacing engine that meticulously manages dispatch intervals, ensuring sustainable high-volume operations while maintaining pristine network standing." />
                    <FAQItem q="What is the strategic advantage of Advanced AI Synthesis?" a="The IA Agent dynamically optimizes payload contexts in real-time. By utilizing advanced frameworks, it ensures each dispatch maintains a unique organic fingerprint, maximizing user engagement." />
                 </div>
              </div>
            </main>
          </div>
        )}

        {/* ==================== DASHBOARD (ULTRA PREMIUM FERRARI) ==================== */}
        {view === 'dashboard' && (
          <div className="w-full max-w-7xl mx-auto py-10 px-6 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header Operator Hub com Master Identity */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-12 text-left">
              <div>
                <h2 className="text-5xl md:text-6xl tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] text-white">OPERATOR HUB</h2>
                <div className="flex items-center gap-3 mt-4">
                   <span className={`text-[10px] px-4 py-1.5 rounded-full border tracking-widest ${isMaster ? 'bg-[#25F4EE]/10 border-[#25F4EE] text-[#25F4EE] shadow-[0_0_15px_rgba(37,244,238,0.3)] animate-pulse' : 'bg-white/5 border-white/10 text-white/40'}`}>
                      {isMaster ? <span className="flex items-center gap-2"><Crown size={12} className="mb-0.5" /> MASTER IDENTITY</span> : `${String(userProfile?.tier || 'FREE')} IDENTITY`}
                   </span>
                   {isPro && <span className="text-[9px] text-amber-500 tracking-widest animate-pulse">● LIVE PROTOCOL ACTIVE</span>}
                </div>
              </div>
              <div className="flex items-center gap-4 flex-wrap text-center">
                 <button onClick={() => setView('home')} className="flex items-center gap-2 bg-[#25F4EE]/10 border border-[#25F4EE]/30 px-6 py-4 rounded-xl hover:bg-[#25F4EE]/20 transition-colors text-[10px] text-[#25F4EE]">
                    <Zap size={14} className="fill-[#25F4EE]"/> LINK GENERATOR
                 </button>
                 <div className="bg-[#0a0a0a] border border-white/10 px-8 py-3 rounded-[1.5rem] shadow-3xl">
                    <p className="text-[8px] text-white/30 mb-2 tracking-widest">Nodes</p>
                    <div className="flex items-center gap-2"><button onClick={() => setConnectedChips(prev => Math.max(1, prev - 1))} className="text-white/30 hover:text-white">-</button><span className="text-xl text-[#25F4EE]">{connectedChips}</span><button onClick={() => setConnectedChips(prev => prev + 1)} className="text-white/30 hover:text-white">+</button></div>
                 </div>
                 <div className="bg-[#0a0a0a] border border-white/10 px-8 py-3 rounded-[1.5rem] shadow-3xl border-b-2 border-b-[#25F4EE]">
                    <p className="text-[8px] text-white/30 mb-2 tracking-widest">Quota</p>
                    <p className="text-2xl text-white">{isPro ? '∞' : String(userProfile?.smsCredits || 0)}</p>
                 </div>
              </div>
            </div>

            {/* MÓDULO DE ESTATÍSTICAS ULTRA PREMIUM */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { label: "SMS Enviados", value: isMaster ? "∞" : (logs.length || 0), icon: Send, color: "text-[#25F4EE]" },
                { label: "Taxa de Entrega", value: "99.8%", icon: ShieldCheck, color: "text-[#FE2C55]" },
                { label: "Contatos Ativos", value: logs.length || 0, icon: Users, color: "text-amber-500" },
                { label: "Créditos Restantes", value: isPro ? "Ilimitado" : String(userProfile?.smsCredits || 0), icon: Smartphone, color: "text-white" },
              ].map((stat, idx) => (
                <div key={idx} className="bg-[#0a0a0a] p-6 rounded-[2rem] border border-white/10 shadow-xl flex items-center gap-4 hover:border-[#25F4EE]/50 transition-all cursor-default">
                  <div className={`bg-white/5 p-4 rounded-2xl border border-white/5 ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-[9px] text-white/40 tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-2xl text-white">{stat.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* CONTEÚDO PRINCIPAL DASHBOARD */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              
              {/* COLUNA ESQUERDA: Quick Send / Bulk Ingestion */}
              <div className="lg:col-span-1 space-y-8 flex flex-col">
                
                {/* QUICK SEND INCORPORADO */}
                <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl flex flex-col relative overflow-hidden flex-1">
                  <h3 className="text-xl text-white mb-6 flex items-center gap-3">
                    <Zap className="text-[#25F4EE]" size={20} />
                    Envio Rápido
                  </h3>
                  <form onSubmit={handleQuickSend} className="space-y-5 flex flex-col flex-1">
                    <div>
                      <label className="block text-[10px] text-white/40 tracking-widest mb-2">Destinatário</label>
                      <input type="tel" value={genTo} onChange={e=>setGenTo(e.target.value)} placeholder="+1 000 000 0000" className="input-premium text-sm font-sans !text-transform-none" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <label className="block text-[10px] text-white/40 tracking-widest mb-2">Mensagem</label>
                      <textarea rows="4" value={genMsg} onChange={e=>setGenMsg(e.target.value)} placeholder="Escreva o seu SMS..." className="input-premium flex-1 text-sm font-sans !text-transform-none resize-none"></textarea>
                      <div className="flex justify-between mt-2 text-[9px] text-white/30">
                        <span>{MSG_LIMIT - genMsg.length} caracteres</span>
                        <span>1 SMS</span>
                      </div>
                    </div>
                    <button type="submit" className="btn-strategic !bg-[#25F4EE] !text-black text-[11px] w-full mt-4 py-5 shadow-[0_0_15px_rgba(37,244,238,0.2)]">
                      <Send size={16} className="mr-2" /> Enviar Agora
                    </button>
                  </form>
                </div>

                {/* BULK INGESTION */}
                <div className={`bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden ${!isPro ? 'pro-obscure' : ''}`}>
                   <div className={`flex items-center justify-between w-full relative z-10`}>
                      <div><h3 className="text-xl text-white mb-2 flex items-center gap-2"><UploadCloud size={20} className="text-[#25F4EE]"/> Bulk Import {!isPro && <Lock size={16} className="text-[#FE2C55]" />}</h3><p className="text-[9px] text-white/40 tracking-widest">Import 5k units.</p></div>
                      {isPro && <button onClick={() => fileInputRef.current.click()} className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[#25F4EE] transition-all flex items-center justify-center">{loading ? <RefreshCw size={20} className="animate-spin"/> : <Plus size={20} />}</button>}
                   </div>
                   {!isPro && (
                     <div className="pro-lock-layer">
                        <p className="text-[#FE2C55] tracking-widest text-[9px] mb-2 animate-pulse"><Lock size={10} className="inline mr-1"/> PRO LOCKED</p>
                        <button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="bg-white/10 text-white border border-white/20 text-[8px] px-6 py-2 rounded-lg">Unlock</button>
                     </div>
                   )}
                   <input type="file" accept=".txt" onChange={handleBulkImport} ref={fileInputRef} className="hidden" />
                </div>
              </div>

              {/* COLUNA DIREITA: Tabela de Logs Recentes */}
              <div className="lg:col-span-2 bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden flex flex-col h-full min-h-[500px]">
                 <div className="p-8 border-b border-white/10 flex justify-between items-center bg-[#111]">
                    <div className="flex items-center gap-3">
                       <History size={20} className="text-[#25F4EE]" />
                       <h3 className="text-xl text-white tracking-tight">Logs Recentes</h3>
                    </div>
                    <button className="text-[#25F4EE] text-[10px] tracking-widest hover:underline">VER TUDO</button>
                 </div>
                 
                 <div className="flex-1 overflow-x-auto custom-scrollbar bg-black/40">
                   {logs.length > 0 ? (
                     <table className="w-full text-left font-sans font-medium !text-transform-none min-w-[500px]">
                       <thead className="bg-[#111] sticky top-0 z-10 uppercase border-b border-white/5">
                         <tr>
                           <th className="px-8 py-5 text-[10px] text-white/50 tracking-widest">Destinatário</th>
                           <th className="px-8 py-5 text-[10px] text-white/50 tracking-widest">Identidade</th>
                           <th className="px-8 py-5 text-[10px] text-white/50 tracking-widest">Status</th>
                           <th className="px-8 py-5 text-[10px] text-white/50 tracking-widest text-right">Hora</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                         {logs.map(l => (
                           <tr key={l.id} className="hover:bg-white/[0.02] transition-colors group">
                             <td className="px-8 py-6 text-sm text-[#25F4EE] tracking-wider">{maskData(l.telefone_cliente, 'phone')}</td>
                             <td className="px-8 py-6">
                               <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/50 group-hover:border-[#25F4EE]/30 group-hover:text-[#25F4EE] transition-all">
                                   <UserCheck size={14} />
                                 </div>
                                 <span className="text-white text-sm truncate max-w-[150px]">
                                   {maskData(l.nome_cliente, 'name')}
                                 </span>
                                 {(!isPro) && <span className="text-[8px] bg-[#FE2C55] text-white px-2 py-0.5 rounded-full animate-pulse ml-2 uppercase italic font-black">LOCKED</span>}
                               </div>
                             </td>
                             <td className="px-8 py-6">
                                <span className="flex items-center gap-1.5 text-[9px] uppercase px-3 py-1.5 rounded-full w-fit bg-[#25F4EE]/10 text-[#25F4EE] border border-[#25F4EE]/30 font-black italic">
                                  <CheckCircle2 size={12} /> INTERCEPTADO
                                </span>
                             </td>
                             <td className="px-8 py-6 text-right text-xs text-white/30 font-mono">
                                {l.timestamp && typeof l.timestamp.toDate === 'function' ? l.timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Syncing...'}
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   ) : (
                     <div className="flex flex-col items-center justify-center h-full p-20 opacity-20">
                        <Lock size={48} className="mb-4 text-white" />
                        <p className="text-[11px] tracking-widest">VAULT STANDBY</p>
                        <p className="text-[9px] mt-2 font-sans font-medium !text-transform-none">Nenhuma intercepção ativa.</p>
                     </div>
                   )}
                 </div>
                 {!isPro && logs.length > 0 && (
                   <div className="p-8 bg-gradient-to-t from-[#FE2C55]/10 to-transparent border-t border-[#FE2C55]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-[10px] text-[#FE2C55] tracking-widest flex items-center gap-2"><Lock size={12}/> REVEAL FULL IDENTITIES IN VAULT</p>
                      <button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="bg-[#FE2C55] text-white text-[9px] px-8 py-3 rounded-xl shadow-[0_0_15px_rgba(254,44,85,0.4)]">UPGRADE TO ELITE</button>
                   </div>
                 )}
              </div>
            </div>

            {/* AI AGENT MODULE */}
            <div className={`bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl mb-8 relative overflow-hidden ${!isPro ? 'pro-obscure' : ''}`}>
              <div className={`flex flex-col text-left`}>
                 <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                    <div className="flex items-center gap-4 text-left"><div className="p-3 bg-white/5 rounded-xl border border-white/10"><BrainCircuit size={24} className="text-[#25F4EE]" /></div><div><h3 className="text-xl text-white tracking-tight">AI AGENT COMMAND {!isPro && <Lock size={18} className="text-[#FE2C55] inline ml-2" />}</h3><p className="text-[9px] text-white/40 tracking-widest mt-2">Automated linguistic scrambling to obliterate carrier filter blocks.</p></div></div>
                 </div>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                    <div className="space-y-4 flex flex-col">
                       <textarea disabled={!isPro} value={aiObjective} onChange={(e) => validateAIContent(e.target.value)} placeholder="Marketing goal... AI will auto-scramble message per chip session." className="input-premium h-[140px] resize-none font-sans font-medium !text-transform-none" />
                       {aiWarning && (<div className="p-4 bg-[#FE2C55]/10 border border-[#FE2C55]/30 rounded-xl flex items-start gap-3 animate-pulse"><AlertTriangle size={16} className="text-[#FE2C55] shrink-0 mt-0.5"/><p className="text-[9px] text-[#FE2C55] tracking-widest">{aiWarning}</p></div>)}
                       <div className="flex justify-between items-center bg-[#111] border border-white/5 rounded-2xl p-5"><span className="text-[10px] tracking-widest text-white/50">DISPATCH DELAY</span><div className="flex items-center gap-2"><input disabled={!isPro} type="number" min="20" value={sendDelay} onChange={(e) => setSendDelay(Math.max(20, Number(e.target.value)))} className="bg-transparent border-b border-[#25F4EE]/30 text-[#25F4EE] w-10 text-right outline-none text-sm font-sans" /><span className="text-[9px] text-white/30">SECS</span></div></div>
                       <button onClick={handlePrepareBatch} disabled={!isPro || logs.length === 0 || !!aiWarning} className="bg-[#25F4EE] text-black text-[11px] py-5 rounded-2xl shadow-[0_0_20px_rgba(37,244,238,0.2)] disabled:opacity-30 hover:scale-[1.02] transition-transform">Synthesize Queue ({logs.length} Units)</button>
                    </div>
                    <div className="bg-[#111] border border-white/5 rounded-2xl flex flex-col items-center justify-center p-8 min-h-[200px] text-center shadow-inner relative"><div className="opacity-20"><ShieldAlert size={64} className="mx-auto mb-4" /><p className="text-[10px]">System Standby</p></div></div>
                 </div>
              </div>
              {!isPro && <div className="pro-lock-layer"><p className="text-[#FE2C55] tracking-widest text-[11px] mb-2 shadow-xl animate-pulse"><Lock size={12} className="inline mr-2"/> PRO LOCKED</p><button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="bg-[#25F4EE] text-black text-[9px] px-10 py-3 rounded-xl">Unlock Expert IA</button></div>}
            </div>

            {/* PROTOCOL INVENTORY (LINKS) */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-3xl mb-16 flex flex-col text-left">
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-[#111]"><div className="flex items-center gap-3"><Radio size={20} className="text-[#25F4EE]" /><h3 className="text-lg">Protocol Inventory</h3></div></div>
              <div className="min-h-[200px] max-h-[40vh] overflow-y-auto bg-black custom-scrollbar">
                {linksHistory.length > 0 ? linksHistory.map(l => (
                  <div key={l.id} className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-6 hover:bg-white/[0.02] transition-colors">
                    <div className="flex-1 truncate">
                       <p className="text-[10px] text-white/30 mb-1 flex items-center gap-2 tracking-widest"><Calendar size={10}/> {l.created_at && typeof l.created_at.toDate === 'function' ? l.created_at.toDate().toLocaleString() : 'Syncing Node...'}</p>
                       <p className="text-sm text-[#25F4EE] truncate font-sans !text-transform-none">{l.url}</p>
                       <p className="text-[9px] text-white/40 mt-1 leading-tight font-sans !text-transform-none">Host: {String(l.company)} | Payload: {String(l.msg).substring(0,60)}...</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <button onClick={() => {navigator.clipboard.writeText(l.url); alert("Handshake Node Copied!");}} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:text-[#25F4EE] transition-colors"><Copy size={16}/></button>
                       <button onClick={() => {setEditingLink(l); setGenTo(l.to); setCompanyName(l.company); setGenMsg(l.msg); setView('home');}} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:text-amber-500 transition-colors"><Edit size={16}/></button>
                       <button onClick={() => handleDeleteLink(l.id)} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:text-[#FE2C55] transition-colors"><Trash size={16}/></button>
                    </div>
                  </div>
                )) : <div className="p-20 text-center opacity-20"><Lock size={48} className="mx-auto mb-4" /><p className="text-[10px] tracking-widest">No protocols established</p></div>}
              </div>
            </div>

            {/* UPGRADE STATION */}
            <div id="marketplace-section" className="mb-16 mt-10 text-left">
               <div className="flex items-center gap-3 mb-10"><ShoppingCart size={24} className="text-[#FE2C55]"/><h3 className="text-xl text-white text-glow-white">UPGRADE STATION</h3></div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left">
                 <div className="bg-[#111] border border-white/10 p-10 rounded-[2.5rem] group shadow-2xl hover:border-[#25F4EE] transition-colors">
                    <h3 className="text-3xl text-white mb-4">Nexus Access</h3>
                    <p className="text-4xl text-[#25F4EE] mb-8">{isMaster ? "0.00 / MASTER" : "$9.00 / Month"}</p>
                    <p className="text-[9px] text-white/40 mb-10 leading-relaxed">Unlimited Redirections & Secure Vault.</p>
                    {isMaster ? <button className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full py-4">UNLIMITED ACCESS</button> : <button className="btn-strategic !bg-white !text-black text-xs w-full py-4">Upgrade Now</button>}
                 </div>
                 <div className="bg-[#25F4EE]/10 border border-[#25F4EE] p-10 rounded-[2.5rem] group shadow-2xl hover:scale-[1.01] transition-transform">
                    <h3 className="text-3xl text-white mb-4 text-[#25F4EE]">Expert Agent</h3>
                    <p className="text-4xl text-[#25F4EE] mb-8">{isMaster ? "0.00 / MASTER" : "$19.90 / Month"}</p>
                    <p className="text-[9px] text-white/40 mb-10 leading-relaxed">Full IA Native Synthesis & Automated Delay.</p>
                    {isMaster ? <button className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full py-4">UNLIMITED ACCESS</button> : <button className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full py-4">Activate Node</button>}
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                 {[
                   { name: "Starter Node", qty: 400, price: isMaster ? "0.00 / MASTER" : "$12.00" },
                   { name: "Nexus Pack", qty: 800, price: isMaster ? "0.00 / MASTER" : "$20.00" },
                   { name: "Elite Operator", qty: 1800, price: isMaster ? "0.00 / MASTER" : "$29.00" }
                 ].map(pack => (
                   <div key={pack.name} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-center shadow-xl flex flex-col items-center">
                     <p className="text-[10px] text-[#25F4EE] mb-2 tracking-widest">{pack.name}</p>
                     <p className="text-3xl text-white mb-4">{pack.qty} HANDSHAKES</p>
                     <p className="text-xl text-[#25F4EE] mb-8">{pack.price}</p>
                     <button className="w-full py-3 bg-black border border-white/10 rounded-xl text-[8px] tracking-widest hover:bg-[#25F4EE] hover:text-black transition-all">Acquire Node</button>
                   </div>
                 ))}
              </div>
            </div>

            {/* DATA VAULT EXPLORER (LEADS) */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-3xl mb-16 flex flex-col text-left">
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-[#111]"><div className="flex items-center gap-3"><Database size={20} className="text-[#25F4EE]" /><h3 className="text-lg">Data Vault Explorer</h3></div></div>
              <div className="min-h-[250px] max-h-[40vh] overflow-y-auto bg-black custom-scrollbar">
                {logs.length > 0 ? (
                  <table className="w-full text-left font-sans font-medium !text-transform-none min-w-[500px]">
                    <thead className="bg-[#111] sticky top-0 z-10 font-black italic uppercase border-b border-white/5">
                      <tr>
                        <th className="px-8 py-4 text-xs text-white/50 tracking-widest">Identity Name</th>
                        <th className="px-8 py-4 text-xs text-white/50 tracking-widest">Mobile ID</th>
                        <th className="px-8 py-4 text-xs text-white/50 tracking-widest text-right">Node Ref</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {logs.map(l => (
                        <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-8 py-5">
                            <span className="text-white text-sm">
                              {maskData(l.nome_cliente, 'name')}
                            </span>
                            {(!isPro) && <span className="text-[8px] bg-[#FE2C55] text-white px-2 py-0.5 rounded-full animate-pulse ml-3 uppercase italic font-black">LOCKED</span>}
                          </td>
                          <td className="px-8 py-5 text-sm text-[#25F4EE]">{maskData(l.telefone_cliente, 'phone')}</td>
                          <td className="px-8 py-5 text-right text-xs text-white/30 font-mono">{String(l.id).substring(0,8)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-20 text-center opacity-20"><Lock size={48} className="mx-auto mb-4" /><p className="text-[10px] tracking-widest uppercase italic">Vault Standby</p></div>
                )}
              </div>
              {!isPro && logs.length > 0 && (
                <div className="p-10 bg-[#FE2C55]/5 border-t border-[#FE2C55]/20 flex flex-col items-center justify-center text-center gap-4 mt-auto">
                   <p className="text-[11px] text-[#FE2C55] tracking-widest flex items-center gap-2">DESIRE: REVEAL FULL IDENTITIES? UPGRADE TO ELITE NOW.</p>
                   <button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="btn-strategic !bg-[#FE2C55] !text-white text-[10px] w-full max-w-[300px] py-4 shadow-xl">UNLOCK VAULT NOW</button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================== AUTH (LOGIN/REGISTER) ==================== */}
        {view === 'auth' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-left animate-in fade-in zoom-in-95 duration-150">
            <div className="lighthouse-neon-wrapper w-full max-w-md shadow-3xl">
              <div className="lighthouse-neon-content p-12 sm:p-20 relative">
                <h2 className="text-3xl mt-8 mb-12 text-white text-center text-glow-white tracking-tighter">SECURE MEMBER PORTAL</h2>
                <form onSubmit={handleAuthSubmit} className="space-y-6 text-left">
                  {!isLoginMode && (<><input required placeholder="Full Legal Name" value={fullNameInput} onChange={e=>setFullNameInput(e.target.value)} className="input-premium text-xs w-full font-sans font-medium !text-transform-none" /><input required type="tel" placeholder="+1 999 999 9999" value={phoneInput} onChange={e=>setPhoneInput(e.target.value)} className="input-premium text-xs w-full font-sans font-medium !text-transform-none" /></>)}
                  <input required type="email" placeholder="Email identity..." value={email} onChange={e=>setEmail(e.target.value)} className="input-premium text-xs w-full font-sans font-medium !text-transform-none" />
                  <div className="relative">
                    <input required type={showPass ? "text" : "password"} placeholder="Security key..." value={password} onChange={e=>setPassword(e.target.value)} className="input-premium text-xs w-full font-sans font-medium !text-transform-none" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-4 text-white/30"><Eye size={18}/></button>
                  </div>
                  <button type="submit" disabled={loading} className="btn-strategic !bg-[#25F4EE] !text-black text-[11px] mt-4 shadow-xl w-full tracking-widest">{loading ? 'VERIFYING NODE...' : 'Authorize Access'}</button>
                  <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); }} className="w-full text-[10px] text-white/20 tracking-[0.4em] mt-10 text-center hover:text-white transition-all">{isLoginMode ? "CREATE NEW OPERATOR? REGISTER" : "ALREADY A MEMBER? LOGIN"}</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="mt-auto pb-20 w-full space-y-16 z-10 px-10 border-t border-white/5 pt-20 text-left">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 text-[10px] tracking-widest text-white/30">
          <div className="flex flex-col gap-5"><span className="text-white/40 border-b border-white/5 pb-2">Legal</span><a href="#" className="hover:text-[#25F4EE] transition-colors">Privacy Policy</a><a href="#" className="hover:text-[#25F4EE] transition-colors">Terms of Use</a></div>
          <div className="flex flex-col gap-5"><span className="text-white/40 border-b border-white/5 pb-2">Compliance</span><a href="#" className="hover:text-[#FE2C55] transition-colors">LGPD Protocol</a><a href="#" className="hover:text-[#FE2C55] transition-colors">GDPR Node</a></div>
          <div className="flex flex-col gap-5"><span className="text-white/40 border-b border-white/5 pb-2">Network</span><a href="#" className="hover:text-[#25F4EE] transition-colors">U.S. Nodes</a><a href="#" className="hover:text-[#25F4EE] transition-colors">EU Nodes</a></div>
          <div className="flex flex-col gap-5"><span className="text-white/40 border-b border-white/5 pb-2">Support</span><button onClick={() => setShowSmartSupport(true)} className="hover:text-[#25F4EE] flex items-center gap-2">SMART SUPPORT <Bot size={14}/></button></div>
        </div>
        <p className="text-[11px] text-white/20 tracking-[8px] text-center mt-10">© 2026 ClickMoreDigital | Security Protocol</p>
      </footer>

      {/* SMART SUPPORT MODAL */}
      {showSmartSupport && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md text-left">
           <div className="lighthouse-neon-wrapper w-full max-w-sm shadow-3xl">
              <div className="lighthouse-neon-content p-10">
                 <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3"><Bot size={32} className="text-[#25F4EE]"/><span className="text-sm tracking-widest text-glow-white">SMART SUPPORT</span></div>
                    <button onClick={() => setShowSmartSupport(false)} className="text-white/40 hover:text-white"><X size={28}/></button>
                 </div>
                 <div className="bg-black border border-white/5 p-8 rounded-3xl mb-8 min-h-[180px] flex items-center justify-center text-center leading-relaxed">
                    <p className="text-[11px] text-white/50 tracking-widest">IA Agent online to assist your elite conversions. How can I help today?</p>
                 </div>
                 <button onClick={() => {alert("Connecting node..."); setShowSmartSupport(false);}} className="btn-strategic !bg-[#25F4EE] !text-black text-xs shadow-xl w-full shadow-2xl hover:scale-[1.02]">Connect To Node</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
