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
  writeBatch,
  query,
  getDocs
} from 'firebase/firestore';
import { 
  Zap, Lock, Globe, ChevronRight, Copy, Check, ExternalLink, Menu, X, 
  LayoutDashboard, LogOut, Target, Rocket, BrainCircuit, ShieldAlert, Activity, 
  Smartphone, Shield, Info, Database, RefreshCw, Users, Crown,
  UserCheck, UserMinus, Gift, Bot, Eye, EyeOff, BarChart3, ShieldCheck,
  Server, Cpu, Radio, UserPlus, HelpCircle, ChevronDown, ChevronUp, Star, BookOpen, 
  AlertOctagon, Scale, FileText, UploadCloud, PlayCircle,
  ShoppingCart, Wallet, AlertTriangle, Trash, Edit, Clock, Calendar, Send, Plus, History, CheckCircle2,
  DownloadCloud, Trash2, SlidersHorizontal
} from 'lucide-react';

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : {
      apiKey: "AIzaSyBI-JSC-FtVOz_r6p-XjN6fUrapMn_ad24",
      authDomain: "smartsmspro-4ee81.firebaseapp.com",
      projectId: "smartsmspro-4ee81",
      storageBucket: "smartsmspro-4ee81.firebasestorage.app",
      messagingSenderId: "269226709034",
      appId: "1:269226709034:web:00af3a340b1e1ba928f353"
    };

const appId = typeof __app_id !== 'undefined' ? __app_id : "smartsms-pro-elite-terminal-vfinal";
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// --- MASTER ADMIN ACCESS ---
const ADMIN_MASTER_ID = "YGepVHHMYaN9sC3jFmTyry0mYZO2";

// --- FAQ COMPONENT ---
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
  // --- GLOBAL UI STATES ---
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSmartSupport, setShowSmartSupport] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  // --- DATA STATES ---
  const [logs, setLogs] = useState([]); 
  const [linksHistory, setLinksHistory] = useState([]);
  const [smsQueueCount, setSmsQueueCount] = useState(0); 
  
  // --- GENERATOR & QUICK SEND STATES ---
  const [genTo, setGenTo] = useState('');
  const [genMsg, setGenMsg] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [editingLink, setEditingLink] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // --- COMPLIANCE GATE STATES ---
  const [captureData, setCaptureData] = useState(null);
  const [captureForm, setCaptureForm] = useState({ name: '', phone: '' });

  // --- AUTHENTICATION STATES ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPass, setShowPass] = useState(false);

  // --- AI AUTOMATION, STAGING & QR SYNC STATES ---
  const [aiObjective, setAiObjective] = useState('');
  const [aiWarning, setAiWarning] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [stagedQueue, setStagedQueue] = useState([]); 
  
  // ---> NEW AI DELAY COMMANDER & REAL-TIME COUNTER STATES <---
  const [isDispatching, setIsDispatching] = useState(false);
  const [sendDelay, setSendDelay] = useState(30);
  const [sessionSentCount, setSessionSentCount] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  
  const [connectedChips, setConnectedChips] = useState(1);
  const [isDeviceSynced, setIsDeviceSynced] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);

  const fileInputRef = useRef(null);
  
  const isMaster = user?.uid === ADMIN_MASTER_ID;
  const isPro = isMaster || (userProfile?.tier === 'MASTER' || userProfile?.tier === 'ELITE' || userProfile?.isSubscribed);
  const MSG_LIMIT = 300;

  // --- IDENTITY BOOTSTRAP ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        if (u.uid === ADMIN_MASTER_ID) {
          setUserProfile({ fullName: "Alex Master", tier: 'MASTER', isUnlimited: true, smsCredits: 999999, dailySent: 0, isSubscribed: true });
        } else {
          try {
            const docRef = doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'data');
            const d = await getDoc(docRef);
            if (d.exists()) {
              setUserProfile(d.data());
            } else {
              const p = { fullName: String(u.email?.split('@')[0] || 'Operator'), email: u.email, tier: 'FREE_TRIAL', smsCredits: 60, dailySent: 0, created_at: serverTimestamp() };
              await setDoc(docRef, p);
              setUserProfile(p);
            }
          } catch (e) {
            console.error("Profile load error", e);
            setUserProfile({ fullName: "Operator", tier: 'FREE_TRIAL', smsCredits: 0, dailySent: 0 });
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

  // --- CAPTURE PORTAL SENSOR ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('t'), m = params.get('m'), o = params.get('o');
    if (t && m && o && view !== 'capture') {
      setCaptureData({ to: t, msg: m, ownerId: o, company: params.get('c') || 'Verified Host' });
      setView('capture');
    }
  }, [view]);

  // --- DATA SYNCHRONIZATION ---
  useEffect(() => {
    if (!user || view !== 'dashboard') return;
    
    const unsubLeads = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'leads'), 
      (snap) => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const myData = isMaster ? all : all.filter(l => l.ownerId === user.uid);
        setLogs(myData.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
      },
      (error) => console.error("Leads Sync Error:", error)
    );

    const unsubLinks = onSnapshot(
      collection(db, 'artifacts', appId, 'users', user.uid, 'links'), 
      (snap) => {
        setLinksHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0)));
      },
      (error) => console.error("Links Sync Error:", error)
    );

    const unsubQueue = onSnapshot(
      collection(db, 'artifacts', appId, 'users', user.uid, 'sms_queue'),
      (snap) => {
        setSmsQueueCount(snap.docs.length);
      },
      (error) => console.error("Queue Sync Error:", error)
    );

    return () => { unsubLeads(); unsubLinks(); unsubQueue(); };
  }, [user, view, isMaster]);

  // ============================================================================
  // PRO COMMAND FUNCTIONS
  // ============================================================================
  
  // ZERO TOLERANCE POLICY VALIDATION
  const validateAIContent = (text) => {
    setAiObjective(text);
    const forbidden = /(hack|scam|fraud|phishing|hate|racism|murder|porn|malware|virus|golpe|ódio|spam|illegal)/i;
    if (forbidden.test(text)) {
      setAiWarning("ZERO TOLERANCE POLICY ACTIVATED: PROHIBITED KEYWORDS DETECTED. SYSTEM LOCKED.");
    } else {
      setAiWarning('');
    }
  };

  // NATIVE AI CONTEXTUAL ENGINE (SUPER NLP SIMULATION)
  const superAIVariationEngine = (baseText, index, leadName) => {
    const ptMarkers = /\b(orçamento|cotação|gostaria|quero|trabalho|serviço|projeto|vocês|empresa|teste|olá|boa tarde|bom dia|para|com|como|fazer|preço)\b/gi;
    const enMarkers = /\b(quote|estimate|pricing|work|portfolio|projects|request|ask|hi|hello|hey|test|this|for|with)\b/gi;
    
    const ptMatch = (baseText.match(ptMarkers) || []).length;
    const enMatch = (baseText.match(enMarkers) || []).length;
    const detectedLang = ptMatch > enMatch ? 'pt' : 'en';

    const synonymsPT = [
      { rx: /\b(gostaria de|queria|quero)\b/gi, reps: ["gostaria de", "queria", "tenho interesse em", "estou buscando", "preciso de"] },
      { rx: /\b(um orçamento|orçamento|uma cotação|cotação)\b/gi, reps: ["um orçamento", "uma cotação", "uma estimativa", "saber os valores", "uma base de preço", "os custos"] },
      { rx: /\b(trabalho|serviço|projeto|fotos|perfil)\b/gi, reps: ["trabalho", "serviço", "projeto", "portfólio", "perfil", "resultado"] },
      { rx: /\b(vi|encontrei|achei|descobri)\b/gi, reps: ["vi", "encontrei", "achei", "descobri", "me deparei com"] },
      { rx: /\b(empresa|vocês|sua empresa)\b/gi, reps: ["empresa", "equipe", "vocês", "seu perfil", "seu negócio"] },
      { rx: /\b(teste)\b/gi, reps: ["teste", "ensaio", "validação", "experimento"] },
      { rx: /\b(bom dia|boa tarde|boa noite|olá|oi|ei)\b/gi, reps: ["Olá", "Oi", "Tudo bem?", "Saudações", "Opa", "Ei"] },
      { rx: /\b(google)\b/gi, reps: ["Google", "Google Search", "busca do Google", "Google Maps"] },
      { rx: /\b(pedir|solicitar)\b/gi, reps: ["pedir", "solicitar", "requerer", "agendar"] }
    ];

    const synonymsEN = [
      { rx: /\b(request a quote|get a quote|quote|estimate|pricing)\b/gi, reps: ["request a quote", "get an estimate", "ask for pricing", "get a proposal", "request an estimate"] },
      { rx: /\b(work|portfolio|projects|photos)\b/gi, reps: ["work", "portfolio", "projects", "services", "past jobs", "profile"] },
      { rx: /\b(saw|found|noticed)\b/gi, reps: ["saw", "found", "noticed", "came across", "discovered"] },
      { rx: /\b(request|ask for|get)\b/gi, reps: ["request", "ask for", "get", "receive", "inquire about"] },
      { rx: /\b(hi|hello|hey|greetings)\b/gi, reps: ["Hi", "Hello", "Hey", "Greetings", "Good day", "Hi there"] },
      { rx: /\b(test)\b/gi, reps: ["test", "trial", "validation", "check"] },
      { rx: /\b(google|google search)\b/gi, reps: ["Google", "Google Search", "Google Maps", "online search"] }
    ];

    const syns = detectedLang === 'pt' ? synonymsPT : synonymsEN;
    let spun = baseText;
    
    syns.forEach((s, i) => {
      let matchCount = 0;
      spun = spun.replace(s.rx, (match) => {
         const repIdx = (index * 11 + i * 7 + matchCount) % s.reps.length;
         let replacement = s.reps[repIdx];
         matchCount++;
         if (match[0] === match[0].toUpperCase()) {
            replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
         }
         return replacement;
      });
    });

    let finalMessage = spun;

    if (index % 2 !== 0 && !spun.endsWith('?')) {
        if (detectedLang === 'pt') {
            const ptClosings = [" Fico no aguardo.", " Aguardo retorno.", " Podemos conversar?", " Obrigado.", " Me avise."];
            finalMessage = `${spun}${ptClosings[(index) % ptClosings.length]}`;
        } else {
            const enClosings = [" Looking forward to hearing from you.", " Awaiting your reply.", " Can we chat?", " Thanks.", " Let me know."];
            finalMessage = `${spun}${enClosings[(index) % enClosings.length]}`;
        }
    }

    const invisibleChars = ["\u200B", "\u200C", "\u200D", "\uFEFF"];
    const byteBypass = invisibleChars[index % invisibleChars.length].repeat((index % 4) + 1);

    return (finalMessage.trim() + byteBypass).replace(/\s{2,}/g, ' ');
  };

  // GENERATE VARIATIONS & OPEN STAGING AREA
  const handlePrepareBatch = () => {
    if (!aiObjective || logs.length === 0 || aiWarning) return;
    setIsAiProcessing(true);
    
    setTimeout(() => {
      const limit = Math.min(60, isPro ? 999999 : (Number(userProfile?.smsCredits) || 0), logs.length);
      if (limit <= 0 && !isMaster) {
         alert("No credits available.");
         setIsAiProcessing(false);
         return;
      }
      
      const queue = logs.slice(0, limit).map((l, idx) => {
         const contextualMessage = superAIVariationEngine(aiObjective, idx, l.nome_cliente);
         return { 
           id: l.id || Math.random().toString(),
           telefone_cliente: l.telefone_cliente, 
           nome_cliente: l.nome_cliente || 'Valued Customer',
           optimizedMsg: contextualMessage 
         };
      });
      
      setStagedQueue(queue);
      setIsReviewMode(true);
      setIsAiProcessing(false);
      
    }, 1500);
  };

  // EDIT INDIVIDUAL VARIATION BLOCK
  const handleEditStagedMsg = (index, newMsg) => {
    const updatedQueue = [...stagedQueue];
    updatedQueue[index].optimizedMsg = newMsg;
    setStagedQueue(updatedQueue);
  };

  // ---> DISPATCH STAGED QUEUE WITH REAL-TIME COUNTER & SANITIZATION <---
  const dispatchToNode = async () => {
    if (stagedQueue.length === 0 || !user) return;
    
    if (!isDeviceSynced) {
       setShowSyncModal(true);
       return;
    }

    setIsDispatching(true);
    
    // Set HUD Counters
    const queueCopy = [...stagedQueue];
    setSessionTotal(queueCopy.length);
    setSessionSentCount(0);

    try {
      for (let i = 0; i < queueCopy.length; i++) {
        const task = queueCopy[i];
        
        // CRITICAL FIX: Sanitize Phone Number for Android Bridge (Remove spaces, brackets, dashes)
        const sanitizedPhone = task.telefone_cliente.replace(/[^\d+]/g, ''); 
        
        // Push single unit to Firebase
        const docRef = doc(collection(db, 'artifacts', appId, 'users', user.uid, 'sms_queue'));
        await setDoc(docRef, {
          telefone_cliente: sanitizedPhone,
          optimizedMsg: task.optimizedMsg,
          created_at: serverTimestamp()
        });

        // LIVE FEEDBACK: Remove message from screen & Update Session Counter
        setStagedQueue(prev => prev.slice(1));
        setSessionSentCount(i + 1);

        // LIVE FEEDBACK: Update Global Stats locally (avoids unnecessary DB reads)
        if (!isMaster) {
          const profileRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
          await updateDoc(profileRef, { 
            smsCredits: increment(-1),
            dailySent: increment(1)
          });
          setUserProfile(prev => ({ 
             ...prev, 
             smsCredits: (prev?.smsCredits || 0) - 1, 
             dailySent: (prev?.dailySent || 0) + 1 
          }));
        } else {
          setUserProfile(prev => ({ ...prev, dailySent: (prev?.dailySent || 0) + 1 }));
        }

        // NATIVE AI DELAY LOGIC: Wait before injecting next
        if (i < queueCopy.length - 1) {
          await new Promise(resolve => setTimeout(resolve, sendDelay * 1000));
        }
      }
    } catch (error) {
      console.error("Dispatch Error:", error);
      alert("Failed to push protocol to Node.");
    }
    
    setIsDispatching(false);
    setIsReviewMode(false);
  };

  // CLEAR STUCK QUEUE
  const handleClearQueue = async () => {
    if (!window.confirm("CONFIRMATION: Are you sure you want to completely clear the stuck queue?")) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'artifacts', appId, 'users', user.uid, 'sms_queue'));
      const snap = await getDocs(q);
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
    } catch (e) {
      console.error(e);
      alert("Failed to clear queue.");
    }
    setLoading(false);
  };

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
          
          // EXTRAI APENAS NÚMEROS PARA GERAR ID SEGURO DO DOCUMENTO
          const safeId = phone.replace(/\D/g, '');
          if (!safeId) continue;
          
          // FILTRO SANITIZADOR REGEX NATIVO: LIMPA DESDE O INÍCIO (Mantém o '+' e dígitos)
          const sanitizedPhone = phone.replace(/[^\d+]/g, ''); 
          
          const leadDocId = `${user.uid}_${safeId}`;
          const leadRef = doc(db, 'artifacts', appId, 'public', 'data', 'leads', leadDocId);
          batch.set(leadRef, {
            ownerId: user.uid,
            nome_cliente: name,
            telefone_cliente: sanitizedPhone, // GRAVA LIMPO E VALIDADO
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
        if (count > 0) { await batch.commit(); }
        alert(`SUCCESS: ${totalImported} GLOBAL UNITS INGESTED INTO THE VAULT.`);
      } catch (error) {
        console.error(error);
        alert("ERROR DURING BULK INGESTION.");
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
    if (!to) return alert("DESTINATION NUMBER IS REQUIRED.");
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

  const handleQuickSend = async (e) => {
    e.preventDefault();
    if(!genTo || !genMsg) return alert("RECIPIENT AND MESSAGE ARE REQUIRED.");
    if (isDeviceSynced && user) {
      setLoading(true);
      try {
        const sanitizedPhone = genTo.replace(/[^\d+]/g, '');
        const docRef = doc(collection(db, 'artifacts', appId, 'users', user.uid, 'sms_queue'));
        await setDoc(docRef, {
          telefone_cliente: sanitizedPhone,
          optimizedMsg: genMsg,
          created_at: serverTimestamp()
        });
        setGenTo(''); setGenMsg('');
        
        setUserProfile(prev => ({ ...prev, dailySent: (prev?.dailySent || 0) + 1 }));
        
        alert("PUSHED TO SECURE NODE!");
      } catch(e) { console.error(e); }
      setLoading(false);
    } else {
      setShowSyncModal(true);
    }
  };

  const handleDeleteLink = async (id) => {
    if(window.confirm("DELETE THIS PROTOCOL?")) {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', id));
    }
  };

  const handleProtocolHandshake = async () => {
    if(!captureForm.name || !captureForm.phone) return;
    if(!captureForm.phone.startsWith('+')) return alert("USE VALID FORMAT WITH '+' PREFIX (EX: +1 999 999 9999)");
    setLoading(true);
    try {
      const ownerId = captureData.ownerId;
      // EXTRAI APENAS NÚMEROS PARA GERAR ID SEGURO DO DOCUMENTO
      const safeId = captureForm.phone.replace(/\D/g, '');
      
      // FILTRO SANITIZADOR REGEX NATIVO: LIMPA A ENTRADA DO LEAD (Mantém o '+' e dígitos)
      const sanitizedPhone = captureForm.phone.replace(/[^\d+]/g, ''); 
      
      const leadDocId = `${ownerId}_${safeId}`;
      const leadRef = doc(db, 'artifacts', appId, 'public', 'data', 'leads', leadDocId);
      const leadSnap = await getDoc(leadRef);
      const isNewLead = !leadSnap.exists();
      
      await setDoc(leadRef, {
        ownerId,
        nome_cliente: String(captureForm.name),
        telefone_cliente: sanitizedPhone, // GRAVA LIMPO E VALIDADO NO BANCO
        timestamp: serverTimestamp(),
        device: navigator.userAgent
      }, { merge: true });
      
      if (isNewLead && ownerId !== ADMIN_MASTER_ID) {
        const pubRef = doc(db, 'artifacts', appId, 'users', ownerId, 'profile', 'data');
        const opSnap = await getDoc(pubRef);
        if (opSnap.exists() && opSnap.data().tier !== 'MASTER') {
           if (opSnap.data().smsCredits <= 0) { 
               alert("HOST OUT OF CREDITS.");
               setLoading(false); 
               return; 
           }
           await updateDoc(pubRef, { smsCredits: increment(-1) });
        }
      }
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const sep = isIOS ? '&' : '?';
      setView('bridge');
      setTimeout(() => {
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
        const p = { fullName: fullNameInput, email: emailLower, tier: 'FREE_TRIAL', smsCredits: 60, dailySent: 0, created_at: serverTimestamp() };
        await setDoc(doc(db, 'artifacts', appId, 'users', authUser.uid, 'profile', 'data'), p);
      }
      if (authUser.uid === ADMIN_MASTER_ID) {
        setUserProfile({ fullName: "Alex Master", tier: 'MASTER', isUnlimited: true, smsCredits: 999999, dailySent: 0, isSubscribed: true });
      }
      setView('dashboard');
    } catch (e) { alert("IDENTITY DENIED: " + e.message); }
    setLoading(false);
  };

  const maskData = (s, type) => { 
    if (isPro) return String(s || ''); 
    if (type === 'name') return String(s || '').substring(0, 3) + '***'; 
    return String(s || '').substring(0, 6) + '***'; 
  };

  if (!authResolved) {
    return (
      <div className="min-h-screen bg-[#010101] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#25F4EE]/30 border-t-[#25F4EE] rounded-full animate-spin shadow-[0_0_15px_#25F4EE]"></div>
        <p className="text-[#25F4EE] font-black italic tracking-[0.3em] uppercase text-[10px] animate-pulse">INITIALIZING NODE...</p>
      </div>
    );
  }

  // ============================================================================
  // CAPTURE PORTAL (ISOLATED)
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
            <h2 className="text-3xl uppercase tracking-tighter text-white mb-4">SECURITY VALIDATION</h2>
            <p className="text-[12px] text-white/50 uppercase tracking-widest leading-relaxed mb-10 text-center px-4">
              Identity Verification Required. Confirm your details to ensure anti-spam compliance before accessing the host node.
            </p>
            <div className="w-full space-y-6 text-left">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/30 ml-1 mb-2 block">FULL LEGAL NAME</label>
                <input required placeholder="Identity Name" value={captureForm.name} onChange={e=>setCaptureForm({...captureForm, name: e.target.value})} className="input-premium text-lg w-full font-medium text-white" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/30 ml-1 mb-2 block">MOBILE ID (EX: +1 999 999 9999)</label>
                <input required type="tel" placeholder="+DDI Mobile ID" value={captureForm.phone} onChange={e=>setCaptureForm({...captureForm, phone: e.target.value})} className="input-premium text-lg w-full font-medium text-white" />
              </div>
              <button onClick={handleProtocolHandshake} disabled={loading} className="btn-strategic !bg-[#25F4EE] !text-black text-[12px] uppercase py-6 w-full shadow-[0_0_20px_#25F4EE] mt-4">CONFIRM & ACCESS <ChevronRight size={16}/></button>
            </div>
            <div className="flex items-center gap-2 mt-12 opacity-30 text-white uppercase">
               <Lock size={14} className="text-[#25F4EE]"/> <span className="text-[10px] uppercase tracking-widest text-[#25F4EE]">ZERO-KNOWLEDGE ENCRYPTED TERMINAL</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN APP VIEW
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

      {/* --- TOP NAV --- */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[100] px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-[#25F4EE]/10 p-1.5 rounded-lg border border-[#25F4EE]/30"><Zap size={20} className="text-[#25F4EE] fill-[#25F4EE]" /></div>
          <span className="text-lg font-black tracking-tighter text-white mt-1">SMART SMS PRO</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[10px] tracking-widest">
           {!user ? (
             <>
               <button onClick={() => { setIsLoginMode(true); setView('auth'); }} className={`transition-colors border-b-2 pb-1 ${view === 'auth' && isLoginMode ? 'border-[#25F4EE] text-[#25F4EE]' : 'border-transparent hover:text-[#25F4EE]'}`}>SECURE MEMBER PORTAL</button>
               <button onClick={() => { setIsLoginMode(false); setView('auth'); }} className="bg-[#25F4EE] text-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all shadow-[0_0_15px_rgba(37,244,238,0.2)]">JOIN NETWORK</button>
             </>
           ) : (
             <>
               <button onClick={() => setView('dashboard')} className={`flex items-center gap-2 transition-colors ${view === 'dashboard' ? 'text-[#25F4EE]' : 'hover:text-[#25F4EE]'}`}><LayoutDashboard size={14}/> OPERATOR HUB</button>
               <button onClick={() => setShowSmartSupport(true)} className="flex items-center gap-2 hover:text-[#25F4EE] transition-colors"><Bot size={14}/> SMART SUPPORT</button>
               <button onClick={() => signOut(auth).then(()=>setView('home'))} className="text-[#FE2C55] hover:opacity-70 transition-all flex items-center gap-2"><LogOut size={14}/> LOGOUT</button>
             </>
           )}
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-white/50 hover:text-white transition-all z-[110]">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* --- CONTENT HUB --- */}
      <div className="pt-28 flex-1 pb-10 relative">
        <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#FE2C55] opacity-[0.03] blur-[150px] pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#25F4EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

        {/* ==================== HOME ==================== */}
        {view === 'home' && (
          <div className="w-full max-w-[540px] mx-auto px-4 z-10 relative text-center animate-in fade-in duration-300">
            <header className="mb-14 text-center flex flex-col items-center">
              <div className="lighthouse-neon-wrapper mb-4"><div className="lighthouse-neon-content px-10 py-4"><h1 className="text-3xl text-white text-glow-white">SMART SMS PRO</h1></div></div>
              <p className="text-[10px] text-white/40 font-bold tracking-[0.4em] text-center">HIGH-END REDIRECTION PROTOCOL - 60 FREE HANDSHAKES</p>
            </header>

            <main className="space-y-8 pb-20 text-left">
              {user && (
                <div className="flex justify-center mb-2 animate-in fade-in zoom-in duration-300">
                  <button onClick={() => setView('dashboard')} className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full max-w-[420px] shadow-[0_0_30px_#25F4EE]"><LayoutDashboard size={24} /> ACCESS OPERATOR HUB</button>
                </div>
              )}

              <div className="lighthouse-neon-wrapper shadow-3xl">
                <div className="lighthouse-neon-content p-8 sm:p-12 text-left space-y-8">
                  <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"></div><h3 className="text-[11px] tracking-widest text-white/60">SMART HANDSHAKE GENERATOR</h3></div>
                  <div className="space-y-3">
                     <label className="text-[10px] text-white/40 ml-1 tracking-widest block">DESTINATION <span className="text-[#25F4EE] ml-2 opacity-50 text-[8px]">EX: +1 999 999 9999</span></label>
                     <input type="tel" value={genTo} onChange={e => setGenTo(e.target.value)} className="input-premium text-white font-sans font-medium" placeholder="+1 999 999 9999" />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] text-white/40 ml-1 tracking-widest block">HOST IDENTITY</label>
                     <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-premium text-sm text-white/50 w-full font-sans font-medium !text-transform-none" placeholder="Your Organization Name" />
                  </div>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center"><label className="text-[10px] text-white/40 ml-1 tracking-widest block">PAYLOAD CONTENT</label><span className="text-[9px] text-white/20">{genMsg.length}/{MSG_LIMIT}</span></div>
                     <div className="relative">
                        <textarea value={genMsg} onChange={e => setGenMsg(e.target.value)} rows="3" className="input-premium w-full text-sm leading-relaxed pr-12 font-sans font-medium !text-transform-none" placeholder="Draft your intelligent payload..." />
                        <button onClick={()=>setShowInstructions(!showInstructions)} className="absolute right-3 bottom-4 p-2 bg-[#25F4EE]/10 rounded-lg text-[#25F4EE] hover:bg-[#25F4EE]/20 transition-all"><HelpCircle size={16}/></button>
                     </div>
                  </div>
                  
                  {showInstructions && (
                    <div className="p-6 bg-white/[0.03] border border-[#25F4EE]/20 rounded-2xl animate-in slide-in-from-top-2">
                       <h5 className="text-[11px] text-[#25F4EE] mb-3">PERFORMANCE INSTRUCTIONS:</h5>
                       <ul className="text-[10px] text-white/40 space-y-2 leading-relaxed">
                          <li>● Use direct calls to action to minimize user decision lag.</li>
                          <li>● Keep payload between 160-300 chars for carrier standing.</li>
                          <li>● Confirming leads routes traffic to your native SMS node.</li>
                       </ul>
                    </div>
                  )}

                  <button onClick={handleGenerate} className="btn-strategic !bg-[#25F4EE] !text-black text-xs py-5 w-full shadow-2xl">
                    GENERATE SMART LINK <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {generatedLink && (
                <div className="animate-in zoom-in-95 duration-300 space-y-6">
                  <div className="bg-[#0a0a0a] border border-[#25F4EE]/20 rounded-[40px] p-10 text-center shadow-2xl">
                    <div className="bg-white p-6 rounded-3xl inline-block mb-10 shadow-xl"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(generatedLink)}&color=000000`} className="w-32 h-32" alt="QR Code"/></div>
                    <input readOnly value={generatedLink} onClick={e=>e.target.select()} className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-[11px] text-[#25F4EE] font-mono text-center outline-none mb-8 border-dashed font-medium !text-transform-none" />
                    <div className="grid grid-cols-2 gap-6 w-full">
                      <button onClick={() => {navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="flex flex-col items-center py-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">{copied ? <Check size={24} className="text-[#25F4EE]" /> : <Copy size={24} className="text-white/40" />}<span className="text-[10px] mt-2 text-white/50 tracking-widest text-center">QUICK COPY</span></button>
                      <button onClick={() => window.open(generatedLink, '_blank')} className="flex flex-col items-center py-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"><ExternalLink size={24} className="text-white/40" /><span className="text-[10px] mt-1 text-white/50 tracking-widest text-center">LIVE TEST</span></button>
                    </div>
                  </div>
                </div>
              )}

              {!user && (
                <div className="flex flex-col items-center gap-6 mt-8 w-full animate-in zoom-in-95 duration-300 pb-10 text-center">
                  <button onClick={() => {setIsLoginMode(false); setView('auth')}} className="btn-strategic !bg-white !text-black text-xs w-full max-w-[420px] group py-6 shadow-xl"><Rocket size={24} className="group-hover:animate-bounce" /> START 60 FREE HANDSHAKES</button>
                  <button onClick={() => window.open("https://buy.stripe.com/nexus_access", '_blank')} className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full max-w-[420px] group py-6 shadow-[0_0_20px_#25F4EE]"><Star size={24} className="animate-pulse" /> UPGRADE TO ELITE MEMBER</button>
                </div>
              )}

              <div className="pt-20 pb-12 text-left">
                 <div className="flex items-center gap-3 mb-12"><HelpCircle size={28} className="text-[#FE2C55]"/><h3 className="text-3xl text-white tracking-widest">PROTOCOL FAQ</h3></div>
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

        {/* ==================== DASHBOARD ==================== */}
        {view === 'dashboard' && (
          <div className="w-full max-w-7xl mx-auto py-10 px-6 animate-in fade-in duration-300">
            
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
                    <p className="text-[8px] text-white/30 mb-2 tracking-widest">ACTIVE NODES</p>
                    <div className="flex items-center gap-2"><button onClick={() => setConnectedChips(prev => Math.max(1, prev - 1))} className="text-white/30 hover:text-white">-</button><span className="text-xl text-[#25F4EE]">{connectedChips}</span><button onClick={() => setConnectedChips(prev => prev + 1)} className="text-white/30 hover:text-white">+</button></div>
                 </div>
                 <div className="bg-[#0a0a0a] border border-white/10 px-8 py-3 rounded-[1.5rem] shadow-3xl border-b-2 border-b-[#25F4EE]">
                    <p className="text-[8px] text-white/30 mb-2 tracking-widest">SMS QUOTA</p>
                    <p className="text-2xl text-white">{isPro ? '∞' : String(userProfile?.smsCredits || 0)}</p>
                 </div>
              </div>
            </div>

            {/* MÓDULO DE ESTATÍSTICAS COM COUNTER EM TEMPO REAL */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { label: "DISPATCHED SMS", value: isMaster ? "∞" : (userProfile?.dailySent || 0), icon: Send, color: "text-[#25F4EE]" },
                { label: "DELIVERY RATE", value: "99.8%", icon: ShieldCheck, color: "text-[#10B981]" },
                { label: "ACTIVE CONTACTS", value: logs.length || 0, icon: Users, color: "text-amber-500" },
                { label: "REMAINING CREDITS", value: isPro ? "UNLIMITED" : String(userProfile?.smsCredits || 0), icon: Smartphone, color: "text-white" },
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
              
              <div className="lg:col-span-1 space-y-8 flex flex-col">
                <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl flex flex-col relative overflow-hidden flex-1">
                  <h3 className="text-xl text-white mb-6 flex items-center gap-3"><Zap className="text-[#25F4EE]" size={20} /> QUICK DISPATCH</h3>
                  <form onSubmit={handleQuickSend} className="space-y-5 flex flex-col flex-1">
                    <div>
                      <label className="block text-[10px] text-white/40 tracking-widest mb-2">RECIPIENT</label>
                      <input type="tel" value={genTo} onChange={e=>setGenTo(e.target.value)} placeholder="+1 000 000 0000" className="input-premium text-sm font-sans !text-transform-none" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <label className="block text-[10px] text-white/40 tracking-widest mb-2">MESSAGE PAYLOAD</label>
                      <textarea rows="4" value={genMsg} onChange={e=>setGenMsg(e.target.value)} placeholder="Draft your SMS here..." className="input-premium flex-1 text-sm font-sans !text-transform-none resize-none"></textarea>
                    </div>
                    <button type="submit" disabled={loading} className="btn-strategic !bg-[#25F4EE] !text-black text-[11px] w-full mt-4 py-5 shadow-[0_0_15px_rgba(37,244,238,0.2)]">
                      <Send size={16} className="mr-2" /> SEND NOW
                    </button>
                  </form>
                </div>

                <div className={`bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden ${!isPro ? 'pro-obscure' : ''}`}>
                   <div className={`flex items-center justify-between w-full relative z-10`}>
                      <div><h3 className="text-xl text-white mb-2 flex items-center gap-2"><UploadCloud size={20} className="text-[#25F4EE]"/> BULK IMPORT {!isPro && <Lock size={16} className="text-[#FE2C55]" />}</h3><p className="text-[9px] text-white/40 tracking-widest">IMPORT 5K UNITS.</p></div>
                      {isPro && <button onClick={() => fileInputRef.current.click()} className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[#25F4EE] transition-all flex items-center justify-center">{loading ? <RefreshCw size={20} className="animate-spin"/> : <Plus size={20} />}</button>}
                   </div>
                   {!isPro && (
                     <div className="pro-lock-layer">
                        <p className="text-[#FE2C55] tracking-widest text-[9px] mb-2 animate-pulse"><Lock size={10} className="inline mr-1"/> PRO LOCKED</p>
                        <button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="bg-white/10 text-white border border-white/20 text-[8px] px-6 py-2 rounded-lg">UNLOCK</button>
                     </div>
                   )}
                   <input type="file" accept=".txt" onChange={handleBulkImport} ref={fileInputRef} className="hidden" />
                </div>
              </div>

              <div className="lg:col-span-2 bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden flex flex-col h-full min-h-[500px]">
                 <div className="p-8 border-b border-white/10 flex justify-between items-center bg-[#111]">
                    <div className="flex items-center gap-3">
                       <History size={20} className="text-[#25F4EE]" />
                       <h3 className="text-xl text-white tracking-tight">RECENT ACTIVITY LOGS</h3>
                    </div>
                 </div>
                 
                 <div className="flex-1 overflow-x-auto custom-scrollbar bg-black/40">
                   {logs.length > 0 ? (
                     <table className="w-full text-left font-sans font-medium !text-transform-none min-w-[500px]">
                       <thead className="bg-[#111] sticky top-0 z-10 uppercase border-b border-white/5">
                         <tr>
                           <th className="px-8 py-5 text-[10px] text-white/50 tracking-widest">RECIPIENT</th>
                           <th className="px-8 py-5 text-[10px] text-white/50 tracking-widest">IDENTITY</th>
                           <th className="px-8 py-5 text-[10px] text-white/50 tracking-widest">STATUS</th>
                           <th className="px-8 py-5 text-[10px] text-white/50 tracking-widest text-right">TIMESTAMP</th>
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
                                 <span className="text-white text-sm truncate max-w-[150px]">{maskData(l.nome_cliente, 'name')}</span>
                               </div>
                             </td>
                             <td className="px-8 py-6"><span className="flex items-center gap-1.5 text-[9px] uppercase px-3 py-1.5 rounded-full w-fit bg-[#25F4EE]/10 text-[#25F4EE] border border-[#25F4EE]/30 font-black italic"><CheckCircle2 size={12} /> INTERCEPTED</span></td>
                             <td className="px-8 py-6 text-right text-xs text-white/30 font-mono">
                                {l.timestamp && typeof l.timestamp.toDate === 'function' ? l.timestamp.toDate().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}) : 'Syncing...'}
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   ) : (
                     <div className="flex flex-col items-center justify-center h-full p-20 opacity-20"><Lock size={48} className="mb-4 text-white" /><p className="text-[11px] tracking-widest">VAULT STANDBY</p><p className="text-[9px] mt-2 font-sans font-medium !text-transform-none">NO ACTIVE INTERCEPTIONS.</p></div>
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

            {/* ---> AI AGENT MODULE WITH STAGING AREA <--- */}
            <div className={`bg-[#0a0a0a] border ${aiWarning ? 'border-[#FE2C55] shadow-[0_0_30px_rgba(254,44,85,0.2)]' : 'border-white/10'} rounded-[2.5rem] p-8 md:p-10 shadow-2xl mb-8 relative overflow-hidden transition-all ${!isPro ? 'pro-obscure' : ''}`}>
              <div className={`flex flex-col text-left`}>
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8 mb-8">
                    <div className="flex items-center gap-4 text-left">
                      <div className={`p-3 rounded-xl border ${aiWarning ? 'bg-[#FE2C55]/10 border-[#FE2C55]/30' : 'bg-white/5 border-white/10'}`}>
                        {aiWarning ? <AlertOctagon size={24} className="text-[#FE2C55]" /> : <BrainCircuit size={24} className="text-[#25F4EE]" />}
                      </div>
                      <div>
                        <h3 className="text-xl text-white tracking-tight">AI AGENT COMMAND {!isPro && <Lock size={18} className="text-[#FE2C55] inline ml-2" />}</h3>
                        <p className="text-[9px] text-white/40 tracking-widest mt-2">AUTOMATED LINGUISTIC SCRAMBLING TO OBLITERATE CARRIER FILTER BLOCKS.</p>
                      </div>
                    </div>
                    <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-2 bg-[#25F4EE]/10 text-[#25F4EE] px-5 py-3 rounded-xl text-[10px] font-black hover:bg-[#25F4EE]/20 transition-all border border-[#25F4EE]/30 shrink-0">
                      <Info size={16}/> SETUP GUIDE & DOWNLOAD
                    </button>
                 </div>

                 {/* VARIATION STAGING AREA (REVIEW MODE) */}
                 {isReviewMode ? (
                   <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
                     <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                           <SlidersHorizontal size={20} className="text-amber-500" />
                           <h4 className="text-lg text-white">PAYLOAD REVIEW ENGINE</h4>
                        </div>
                        <p className="text-[10px] text-white/50 tracking-widest">{stagedQueue.length} VARIATIONS PENDING</p>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 mb-6">
                        {stagedQueue.map((task, idx) => (
                           <div key={task.id || idx} className={`bg-[#111] border border-white/5 rounded-xl p-5 transition-colors flex flex-col h-[150px] ${isDispatching && idx === 0 ? 'border-[#25F4EE] shadow-[0_0_15px_rgba(37,244,238,0.3)] animate-pulse' : 'hover:border-[#25F4EE]/30 group'}`}>
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-[#25F4EE] text-[9px] font-black tracking-widest uppercase">VARIATION {sessionSentCount + idx + 1}</span>
                                <span className="text-white/30 text-[9px] font-mono truncate max-w-[100px]">{maskData(task.telefone_cliente, 'phone')}</span>
                              </div>
                              <textarea 
                                disabled={isDispatching}
                                value={task.optimizedMsg} 
                                onChange={(e) => handleEditStagedMsg(idx, e.target.value)} 
                                className="w-full flex-1 bg-black/50 border border-white/5 rounded-lg p-3 text-xs text-white/80 resize-none font-sans !text-transform-none focus:border-[#25F4EE]/50 outline-none disabled:opacity-50" 
                              />
                           </div>
                        ))}
                     </div>

                     {/* RODAPÉ DO STAGING: DISPATCH COM AVISO LIVE */}
                     <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-2 bg-[#111] p-5 rounded-2xl border border-white/5 shadow-inner">
                        <div className="flex items-center gap-3 px-2">
                           <Clock size={20} className="text-[#25F4EE] animate-pulse" />
                           <span className="text-[10px] text-white/50 tracking-widest font-black uppercase mt-0.5">DISPATCH PACING:</span>
                           <span className="text-[#25F4EE] text-[12px] font-black">{sendDelay} SECONDS</span>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                           <button disabled={isDispatching} onClick={() => {setStagedQueue([]); setIsReviewMode(false); setSessionSentCount(0); setSessionTotal(0);}} className="px-8 py-3.5 bg-white/5 text-white/50 hover:text-white rounded-xl text-[10px] font-black tracking-widest transition-colors w-full md:w-auto disabled:opacity-30">CANCEL</button>
                           <button disabled={isDispatching} onClick={dispatchToNode} className={`px-10 py-3.5 text-black font-black text-[11px] rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 w-full md:w-auto ${isDispatching ? 'bg-[#25F4EE] shadow-[0_0_30px_rgba(37,244,238,0.5)]' : 'bg-amber-500'}`}>
                              {isDispatching ? <><RefreshCw size={16} className="animate-spin" /> TRANSMITTING: {sessionSentCount} / {sessionTotal} SENT...</> : <><Send size={16} /> CONFIRM & DISPATCH TO NODE</>}
                           </button>
                        </div>
                     </div>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                      <div className="space-y-4 flex flex-col">
                         {aiWarning && (
                            <div className="p-4 bg-[#FE2C55]/10 border border-[#FE2C55] rounded-xl flex items-start gap-3 animate-pulse shadow-[0_0_15px_rgba(254,44,85,0.2)]">
                              <AlertTriangle size={20} className="text-[#FE2C55] shrink-0 mt-0.5"/>
                              <p className="text-[10px] text-[#FE2C55] tracking-widest font-black leading-tight">{aiWarning}</p>
                            </div>
                         )}

                         <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-4 rounded-2xl mb-2">
                           <Clock size={20} className="text-[#25F4EE]" />
                           <div className="flex-1">
                             <p className="text-[9px] text-white/50 tracking-widest font-black uppercase mb-1">DISPATCH DELAY SETTING</p>
                             <select disabled={!isPro} value={sendDelay} onChange={e => setSendDelay(Number(e.target.value))} className="bg-transparent text-[#25F4EE] text-[11px] font-black outline-none cursor-pointer w-full appearance-none">
                                <option value={5}>5 SECONDS (AGGRESSIVE)</option>
                                <option value={15}>15 SECONDS (FAST)</option>
                                <option value={30}>30 SECONDS (RECOMMENDED)</option>
                                <option value={60}>1 MINUTE (SAFE)</option>
                                <option value={120}>2 MINUTES (ULTRA SAFE)</option>
                             </select>
                           </div>
                         </div>

                         <textarea disabled={!isPro} value={aiObjective} onChange={(e) => validateAIContent(e.target.value)} placeholder="Marketing goal... AI will auto-scramble message per chip session up to 60 variations." className={`input-premium h-[140px] resize-none font-sans font-medium !text-transform-none ${aiWarning ? 'border-[#FE2C55]/50 focus:border-[#FE2C55]' : ''}`} />
                         
                         <button onClick={handlePrepareBatch} disabled={!isPro || logs.length === 0 || !!aiWarning || isAiProcessing} className={`text-black text-[11px] py-5 rounded-2xl shadow-[0_0_20px_rgba(37,244,238,0.2)] disabled:opacity-30 hover:scale-[1.02] transition-transform w-full mt-4 ${aiWarning ? 'bg-white/20 !text-white/50 cursor-not-allowed' : 'bg-[#25F4EE]'}`}>
                            {isAiProcessing ? "GENERATING BLOCKS..." : `SYNTHESIZE QUEUE (${Math.min(60, logs.length)} UNITS)`}
                         </button>
                      </div>
                      
                      {/* PAINEL DE DISPARO REMOTO */}
                      <div className="bg-[#111] border border-white/5 rounded-2xl flex flex-col items-center justify-center p-8 min-h-[200px] text-center shadow-inner relative overflow-hidden">
                        {smsQueueCount > 0 ? (
                          <div className="flex flex-col items-center justify-center w-full animate-in fade-in zoom-in-95">
                             <div className="mb-6">
                               <p className="text-5xl font-black text-amber-500 tracking-tighter animate-pulse">{smsQueueCount}</p>
                               <p className="text-[9px] text-white/40 tracking-widest mt-2">PENDING IN NODE QUEUE</p>
                             </div>
                             <div className="text-amber-500 flex flex-col items-center gap-3">
                               <RefreshCw size={24} className="animate-spin" />
                               <p className="text-[9px] tracking-widest animate-pulse font-bold">{isDispatching ? "AWAITING MOBILE NODE DISPATCH..." : "TRANSMITTING VIA SECURE P2P NODE..."}</p>
                             </div>
                             
                             <button onClick={handleClearQueue} disabled={loading} className="mt-8 text-[9px] text-white/30 hover:text-[#FE2C55] transition-colors uppercase tracking-widest flex items-center gap-1.5 border border-white/10 px-4 py-2 rounded-lg bg-black">
                               <Trash2 size={12} /> CLEAR STUCK QUEUE
                             </button>
                          </div>
                        ) : (
                          <div className="opacity-20"><ShieldAlert size={64} className="mx-auto mb-4" /><p className="text-[10px] tracking-widest">SYSTEM STANDBY</p></div>
                        )}
                      </div>
                   </div>
                 )}
              </div>
              {!isPro && <div className="pro-lock-layer"><p className="text-[#FE2C55] tracking-widest text-[11px] mb-2 shadow-xl animate-pulse"><Lock size={12} className="inline mr-2"/> PRO LOCKED</p><button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="bg-[#25F4EE] text-black text-[9px] px-10 py-3 rounded-xl">UNLOCK EXPERT AI</button></div>}
            </div>

            {/* PROTOCOL INVENTORY (LINKS) */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-3xl mb-16 flex flex-col text-left">
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-[#111]"><div className="flex items-center gap-3"><Radio size={20} className="text-[#25F4EE]" /><h3 className="text-lg">PROTOCOL INVENTORY</h3></div></div>
              <div className="min-h-[200px] max-h-[40vh] overflow-y-auto bg-black custom-scrollbar">
                {linksHistory.length > 0 ? linksHistory.map(l => (
                  <div key={l.id} className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-6 hover:bg-white/[0.02] transition-colors">
                    <div className="flex-1 truncate">
                       <p className="text-[10px] text-white/30 mb-1 flex items-center gap-2 tracking-widest"><Calendar size={10}/> {l.created_at && typeof l.created_at.toDate === 'function' ? l.created_at.toDate().toLocaleString('en-US') : 'Syncing Node...'}</p>
                       <p className="text-sm text-[#25F4EE] truncate font-sans !text-transform-none">{l.url}</p>
                       <p className="text-[9px] text-white/40 mt-1 leading-tight font-sans !text-transform-none">HOST: {String(l.company)} | PAYLOAD: {String(l.msg).substring(0,60)}...</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <button onClick={() => {navigator.clipboard.writeText(l.url); alert("Handshake Node Copied!");}} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:text-[#25F4EE] transition-colors"><Copy size={16}/></button>
                       <button onClick={() => {setEditingLink(l); setGenTo(l.to); setCompanyName(l.company); setGenMsg(l.msg); setView('home');}} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:text-amber-500 transition-colors"><Edit size={16}/></button>
                       <button onClick={() => handleDeleteLink(l.id)} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:text-[#FE2C55] transition-colors"><Trash size={16}/></button>
                    </div>
                  </div>
                )) : <div className="p-20 text-center opacity-20"><Lock size={48} className="mx-auto mb-4" /><p className="text-[10px] tracking-widest">NO PROTOCOLS ESTABLISHED</p></div>}
              </div>
            </div>

            {/* UPGRADE STATION */}
            <div id="marketplace-section" className="mb-16 mt-10 text-left">
               <div className="flex items-center gap-3 mb-10"><ShoppingCart size={24} className="text-[#FE2C55]"/><h3 className="text-xl text-white text-glow-white">UPGRADE STATION</h3></div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left">
                 <div className="bg-[#111] border border-white/10 p-10 rounded-[2.5rem] group shadow-2xl hover:border-[#25F4EE] transition-colors">
                    <h3 className="text-3xl text-white mb-4">NEXUS ACCESS</h3>
                    <p className="text-4xl text-[#25F4EE] mb-8">{isMaster ? "0.00 / MASTER" : "$9.00 / MONTH"}</p>
                    <p className="text-[9px] text-white/40 mb-10 leading-relaxed">UNLIMITED REDIRECTIONS & SECURE VAULT.</p>
                    {isMaster ? <button className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full py-4">UNLIMITED ACCESS</button> : <button className="btn-strategic !bg-white !text-black text-xs w-full py-4">UPGRADE NOW</button>}
                 </div>
                 <div className="bg-[#25F4EE]/10 border border-[#25F4EE] p-10 rounded-[2.5rem] group shadow-2xl hover:scale-[1.01] transition-transform">
                    <h3 className="text-3xl text-white mb-4 text-[#25F4EE]">EXPERT AGENT</h3>
                    <p className="text-4xl text-[#25F4EE] mb-8">{isMaster ? "0.00 / MASTER" : "$19.90 / MONTH"}</p>
                    <p className="text-[9px] text-white/40 mb-10 leading-relaxed">FULL AI NATIVE SYNTHESIS & AUTOMATED DELAY.</p>
                    {isMaster ? <button className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full py-4">UNLIMITED ACCESS</button> : <button className="btn-strategic !bg-[#25F4EE] !text-black text-xs w-full py-4">ACTIVATE NODE</button>}
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                 {[
                   { name: "STARTER NODE", qty: 400, price: isMaster ? "0.00 / MASTER" : "$12.00" },
                   { name: "NEXUS PACK", qty: 800, price: isMaster ? "0.00 / MASTER" : "$20.00" },
                   { name: "ELITE OPERATOR", qty: 1800, price: isMaster ? "0.00 / MASTER" : "$29.00" }
                 ].map(pack => (
                   <div key={pack.name} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-center shadow-xl flex flex-col items-center">
                     <p className="text-[10px] text-[#25F4EE] mb-2 tracking-widest">{pack.name}</p>
                     <p className="text-3xl text-white mb-4">{pack.qty} HANDSHAKES</p>
                     <p className="text-xl text-[#25F4EE] mb-8">{pack.price}</p>
                     <button className="w-full py-3 bg-black border border-white/10 rounded-xl text-[8px] tracking-widest hover:bg-[#25F4EE] hover:text-black transition-all">ACQUIRE NODE</button>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== AUTH (LOGIN/REGISTER) ==================== */}
        {view === 'auth' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="lighthouse-neon-wrapper w-full max-w-md shadow-3xl">
              <div className="lighthouse-neon-content p-12 sm:p-20 relative">
                <h2 className="text-3xl mt-8 mb-12 text-white text-center text-glow-white tracking-tighter">SECURE MEMBER PORTAL</h2>
                <form onSubmit={handleAuthSubmit} className="space-y-6 text-left">
                  {!isLoginMode && (<><input required placeholder="FULL LEGAL NAME" value={fullNameInput} onChange={e=>setFullNameInput(e.target.value)} className="input-premium text-xs w-full font-sans font-medium !text-transform-none" /><input required type="tel" placeholder="+1 999 999 9999" value={phoneInput} onChange={e=>setPhoneInput(e.target.value)} className="input-premium text-xs w-full font-sans font-medium !text-transform-none" /></>)}
                  <input required type="email" placeholder="EMAIL IDENTITY..." value={email} onChange={e=>setEmail(e.target.value)} className="input-premium text-xs w-full font-sans font-medium !text-transform-none" />
                  <div className="relative">
                    <input required type={showPass ? "text" : "password"} placeholder="SECURITY KEY..." value={password} onChange={e=>setPassword(e.target.value)} className="input-premium text-xs w-full font-sans font-medium !text-transform-none" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-4 text-white/30"><Eye size={18}/></button>
                  </div>
                  <button type="submit" disabled={loading} className="btn-strategic !bg-[#25F4EE] !text-black text-[11px] mt-4 shadow-xl w-full tracking-widest">{loading ? 'VERIFYING NODE...' : 'AUTHORIZE ACCESS'}</button>
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
          <div className="flex flex-col gap-5"><span className="text-white/40 border-b border-white/5 pb-2">LEGAL</span><a href="#" className="hover:text-[#25F4EE] transition-colors">PRIVACY POLICY</a><a href="#" className="hover:text-[#25F4EE] transition-colors">TERMS OF USE</a></div>
          <div className="flex flex-col gap-5"><span className="text-white/40 border-b border-white/5 pb-2">COMPLIANCE</span><a href="#" className="hover:text-[#FE2C55] transition-colors">LGPD PROTOCOL</a><a href="#" className="hover:text-[#FE2C55] transition-colors">GDPR NODE</a></div>
          <div className="flex flex-col gap-5"><span className="text-white/40 border-b border-white/5 pb-2">NETWORK</span><a href="#" className="hover:text-[#25F4EE] transition-colors">U.S. NODES</a><a href="#" className="hover:text-[#25F4EE] transition-colors">EU NODES</a></div>
          <div className="flex flex-col gap-5"><span className="text-white/40 border-b border-white/5 pb-2">SUPPORT</span><button onClick={() => setShowSmartSupport(true)} className="hover:text-[#25F4EE] flex items-center gap-2">SMART SUPPORT <Bot size={14}/></button></div>
        </div>
        <p className="text-[11px] text-white/20 tracking-[8px] text-center mt-10">© 2026 CLICKMORE DIGITAL | SECURITY PROTOCOL</p>
      </footer>

      {/* MODAL DE PAREAMENTO QR CODE (NODE SYNC) */}
      {showSyncModal && (
        <div className="fixed inset-0 z-[600] bg-[#010101]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95">
          <div className="lighthouse-neon-wrapper w-full max-w-sm shadow-[0_0_50px_rgba(37,244,238,0.3)]">
            <div className="lighthouse-neon-content p-10 flex flex-col items-center relative">
              <button onClick={() => setShowSyncModal(false)} className="absolute top-6 right-6 text-white/30 hover:text-white"><X size={20}/></button>
              <Smartphone size={48} className="text-[#25F4EE] mb-6 animate-pulse" />
              <h3 className="text-2xl tracking-tighter text-white mb-2">SYNC MOBILE NODE</h3>
              <p className="text-[9px] text-white/50 tracking-widest mb-8 font-sans font-medium !text-transform-none">Scan QR Code via Native Android App to establish secure P2P tunnel for automated dispatch.</p>
              
              <div className="bg-white p-4 rounded-3xl mb-8 shadow-[0_0_20px_#25F4EE]">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=SMART_SMS_PRO_SYNC_${user?.uid}&color=000000`} alt="Sync QR" className="w-40 h-40" />
              </div>
              
              <button onClick={() => { setIsDeviceSynced(true); setShowSyncModal(false); }} className="btn-strategic !bg-[#25F4EE] !text-black text-[10px] w-full py-4 shadow-xl mb-4">
                CONFIRM NODE SYNC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SETUP GUIDE MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[600] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 text-center animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-[#25F4EE]/50 rounded-[2rem] p-8 max-w-lg w-full relative shadow-[0_0_50px_rgba(37,244,238,0.2)] max-h-[85vh] overflow-y-auto custom-scrollbar">
            
            <div className="sticky top-0 right-0 flex justify-end z-10 -mt-2 -mr-2">
               <button onClick={() => setShowHelpModal(false)} className="bg-black border border-white/10 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"><X size={20}/></button>
            </div>
            
            <div className="flex justify-center mb-6 mt-2">
              <div className="p-4 bg-[#25F4EE]/10 rounded-full border border-[#25F4EE]/30 animate-pulse">
                <DownloadCloud size={32} className="text-[#25F4EE]" />
              </div>
            </div>
            
            <h2 className="text-3xl font-black text-white italic tracking-tight mb-6">SETUP GUIDE</h2>
            
            <div className="bg-[#FE2C55]/10 border border-[#FE2C55]/30 text-[#FE2C55] px-4 py-3 rounded-xl flex items-center gap-3 mb-6 text-left">
              <Info size={24} className="shrink-0" />
              <p className="text-[9px] font-black leading-relaxed tracking-widest">SYSTEM REQUIREMENT: THIS AUTOMATION WORKS EXCLUSIVELY WITH ANDROID DEVICES.</p>
            </div>

            <div className="space-y-3 text-left mb-8">
              <div className="bg-black border border-white/5 p-4 rounded-2xl">
                <p className="text-[#25F4EE] font-black text-[9px] tracking-widest mb-1">STEP 1</p>
                <p className="text-white text-[11px] font-medium font-sans !text-transform-none">Download the QR-Code Mirroring App using the premium button below and install it on your Android phone.</p>
              </div>
              <div className="bg-black border border-white/5 p-4 rounded-2xl">
                <p className="text-[#25F4EE] font-black text-[9px] tracking-widest mb-1">STEP 2</p>
                <p className="text-white text-[11px] font-medium font-sans !text-transform-none">Open the app on your phone and grant the required SMS & Camera permissions.</p>
              </div>
              <div className="bg-black border border-white/5 p-4 rounded-2xl">
                <p className="text-[#25F4EE] font-black text-[9px] tracking-widest mb-1">STEP 3</p>
                <p className="text-white text-[11px] font-medium font-sans !text-transform-none">Click "SYNC NODE DEVICE" on this dashboard and scan the QR Code with your phone.</p>
              </div>
              <div className="bg-black border border-white/5 p-4 rounded-2xl">
                <p className="text-[#25F4EE] font-black text-[9px] tracking-widest mb-1">STEP 4</p>
                <p className="text-white text-[11px] font-medium font-sans !text-transform-none">Click "SYNTHESIZE QUEUE" to generate text blocks, then review them, and click "CONFIRM & DISPATCH". Your phone will do the rest!</p>
              </div>
            </div>

            <a href="https://expo.dev/artifacts/eas/egRVRodLFQ2vZoofTxnfGw.apk" target="_blank" rel="noreferrer" className="w-full bg-gradient-to-r from-[#25F4EE] to-[#1AB5B0] text-black font-black text-[11px] py-5 rounded-xl shadow-[0_0_20px_rgba(37,244,238,0.4)] flex items-center justify-center gap-2 hover:scale-105 transition-transform">
              <DownloadCloud size={18} />
              DOWNLOAD QR-CODE MIRRORING APP
            </a>
          </div>
        </div>
      )}

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
                    <p className="text-[11px] text-white/50 tracking-widest">AI AGENT ONLINE TO ASSIST YOUR ELITE CONVERSIONS. HOW CAN I HELP TODAY?</p>
                 </div>
                 <button onClick={() => {alert("Connecting node..."); setShowSmartSupport(false);}} className="btn-strategic !bg-[#25F4EE] !text-black text-xs shadow-xl w-full shadow-2xl hover:scale-[1.02]">CONNECT TO NODE</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
