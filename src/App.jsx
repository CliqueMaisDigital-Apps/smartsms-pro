// Adicione esta linha na seção de estados (por volta da linha 180, junto com os outros useStates)
const [isChatBanned, setIsChatBanned] = useState(false);

// Substitua a função generateUUID (ou a linha que usa crypto.randomUUID) por esta versão com fallback
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().split('-')[0];
  }
  // Fallback para navegadores antigos
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// No handleGenerate, substitua a linha:
// const lid = editingLink ? editingLink.id : crypto.randomUUID().split('-')[0];
// por:
const lid = editingLink ? editingLink.id : generateUUID();import React, { useState, useEffect, useRef } from 'react';
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
  DownloadCloud, Trash2, SlidersHorizontal, WifiOff, Wifi, FileLock2, Scale as LawScale, ChevronRightSquare, MessageSquare, BellRing
} from 'lucide-react';

// --- FIREBASE CONFIGURATION ---
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

// --- MASTER ADMIN ACCESS ---
const ADMIN_MASTER_ID = "YGepVHHMYaN9sC3jFmTyry0mYZO2";

// --- ZERO TOLERANCE GLOBAL REGEX (ULTRA ENHANCED COGNITION) ---
const checkForbiddenWords = (text) => {
  if (!text) return false;
  const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const regex = /(hack|h4ck|scam|sc4m|fraud|fr4ud|phishing|ph1shing|hate|racism|murder|porn|p0rn|malware|virus|golpe|odio|spam|sp4m|illegal|ilegal|extortion|exploit|ddos|botnet|ransomware|piracy|stolen|hijack|puta|caralho|merda|porra|foda|cacete|bitch|fuck|shit|asshole|idiota|imbecil|burro|scumbag|cunt|vagabundo|desgracado|desgraca|miseravel|safado|lixo|trouxa)/i;
  return regex.test(normalized);
};

// --- FAQ COMPONENT ---
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 py-8 group cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex justify-between items-center gap-6 text-center sm:text-left leading-none">
        <h4 className="text-[12px] sm:text-[14px] font-black uppercase italic tracking-widest text-white/70 group-hover:text-[#25F4EE] transition-colors leading-tight text-center sm:text-left w-full">
          {String(q)}
        </h4>
        {open ? <ChevronUp size={18} className="text-[#25F4EE] shrink-0" /> : <ChevronDown size={18} className="text-white/20 shrink-0" />}
      </div>
      {open && <p className="mt-5 text-xs text-white/40 leading-relaxed font-medium animate-in slide-in-from-top-2 text-center sm:text-left italic tracking-wide uppercase text-wrap-balance">{String(a)}</p>}
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
  const [legalContent, setLegalContent] = useState(null); 
  const [isWelcomeTrial, setIsWelcomeTrial] = useState(false);
  
  // --- DATA STATES ---
  const [logs, setLogs] = useState([]); 
  const [linksHistory, setLinksHistory] = useState([]);
  const [smsQueueCount, setSmsQueueCount] = useState(0); 
  const [subscribers, setSubscribers] = useState([]); 
  const [globalNotifications, setGlobalNotifications] = useState([]);
  
  // --- ADMIN MASTER NETWORK STATES ---
  const [expandedAdminRow, setExpandedAdminRow] = useState(null);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  
  // --- LEAD CRUD MODAL STATES (MASTER ADMIN) ---
  const [editLeadModal, setEditLeadModal] = useState(null);
  const [createFolderModal, setCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folders, setFolders] = useState([{ id: 'ALL', label: 'ALL ACTIVE LEADS' }, { id: 'MANUAL', label: 'CAPTURED LEADS' }, { id: 'Bulk Import TXT', label: 'IMPORTED LIST' }, { id: 'NEW_SUBSCRIBERS', label: 'NEW SUBSCRIBERS' }]);
  
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
  const [nicknameInput, setNicknameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPass, setShowPass] = useState(false);

  // --- AI AUTOMATION, STAGING & QR SYNC STATES ---
  const [aiObjective, setAiObjective] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [stagedQueue, setStagedQueue] = useState([]); 
  const [selectedFolder, setSelectedFolder] = useState('ALL'); 
  
  const [isDispatching, setIsDispatching] = useState(false);
  const [sendDelay, setSendDelay] = useState(15);
  const [sessionSentCount, setSessionSentCount] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [nodeWarningActive, setNodeWarningActive] = useState(false);
  
  const [connectedChips, setConnectedChips] = useState(1);
  const [isDeviceSynced, setIsDeviceSynced] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);

  // --- AI CHAT SUPPORT STATES ---
  const [chatMessages, setChatMessages] = useState([]); 
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [hasCapturedChatLead, setHasCapturedChatLead] = useState(false);
  const [isChatBanned, setIsChatBanned] = useState(false); // <-- ADICIONADO
  const chatEndRef = useRef(null);
  const latestMessageRef = useRef(null);

  // --- ZERO TOLERANCE COMPUTED STATES ---
  const isGenMsgForbidden = checkForbiddenWords(genMsg);
  const isAiObjectiveForbidden = checkForbiddenWords(aiObjective);
  const isChatForbidden = checkForbiddenWords(chatInput);

  // --- SECURE QR HANDSHAKE TOKEN GENERATOR ---
  const [syncToken, setSyncToken] = useState('');
  const [syncTokenExpiry, setSyncTokenExpiry] = useState(0);

  // --- Fallback para crypto.randomUUID ---
  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID().split('-')[0];
    }
    // Fallback para navegadores antigos
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const generateSecureSyncToken = async () => {
    if (!user) return '';
    const now = Date.now();
    const window5min = Math.floor(now / 300000);
    const rawPayload = `${user.uid}:${window5min}:SMARTSMS_SECURE`;
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode('NEXUS_SALT_KEY_2026');
      const msgData = encoder.encode(rawPayload);
      const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
      const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
      const hexToken = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
      const token = `NEXUS_SYNC|uid:${user.uid}|tok:${hexToken}|exp:${window5min}`;
      setSyncToken(token); setSyncTokenExpiry(window5min);
      return token;
    } catch (err) {
      const fallback = `NEXUS_SYNC|uid:${user.uid}|tok:${btoa(rawPayload).replace(/=/g,'').substring(0,24)}|exp:${window5min}`;
      setSyncToken(fallback);
      return fallback;
    }
  };

  useEffect(() => {
    if (!showSyncModal || !user) return;
    generateSecureSyncToken();
    const interval = setInterval(generateSecureSyncToken, 300000);
    return () => clearInterval(interval);
  }, [showSyncModal, user]);

  const fileInputRef = useRef(null);
  
  const isMaster = user?.uid === ADMIN_MASTER_ID;
  const isPro = isMaster || ['MASTER', 'ELITE', 'ACTIVATION_9_USD', 'PRO_SUBSCRIPTION_19_USD'].includes(userProfile?.tier) || userProfile?.isSubscribed || userProfile?.isUnlimited;
  const MSG_LIMIT = 300;

  // --- SHIELD PROTOCOL: ANTI-COPY & DEVTOOLS BLOCKER ---
  useEffect(() => {
    const handleKeyDown = (e) => {
       if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) || (e.ctrlKey && ['U','S','P','C','X'].includes(e.key.toUpperCase()))) {
           e.preventDefault();
       }
    };
    const handlePreventCopy = (e) => {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') e.preventDefault();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handlePreventCopy);
    document.addEventListener('cut', handlePreventCopy);
    return () => {
       document.removeEventListener('keydown', handleKeyDown);
       document.removeEventListener('copy', handlePreventCopy);
       document.removeEventListener('cut', handlePreventCopy);
    };
  }, []);

  // --- UX: DYNAMIC SCROLL MANAGEMENT ---
  useEffect(() => {
    if (showSmartSupport && latestMessageRef.current) {
       setTimeout(() => latestMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }
  }, [chatMessages, showSmartSupport, isChatLoading]);

  // --- VIEW NAVIGATION SCROLL TO TOP (UX FIX) ---
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [view, isWelcomeTrial, isMenuOpen, showSmartSupport]);

  // --- IDENTITY BOOTSTRAP ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        setIsWelcomeTrial(false);
        if (u.uid === ADMIN_MASTER_ID) {
          setUserProfile({ fullName: "Alex Master", nickname: "NEXUS_PRIME", tier: 'MASTER', isUnlimited: true, smsCredits: 999999, dailySent: 0, isSubscribed: true });
        } else {
          try {
            const docRef = doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'data');
            const d = await getDoc(docRef);
            if (d.exists()) {
              setUserProfile(d.data());
              setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'subscribers', u.uid), { id: u.uid, ...d.data() }, { merge: true });
            } else {
              const p = { fullName: String(u.email?.split('@')[0] || 'Operator'), nickname: 'Operator', email: u.email, tier: 'FREE_TRIAL', smsCredits: 60, dailySent: 0, created_at: serverTimestamp() };
              await setDoc(docRef, p);
              await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'subscribers', u.uid), { id: u.uid, ...p });
              setUserProfile(p);
            }
          } catch (e) {
            console.error("Profile load error", e);
            setUserProfile({ fullName: "Operator", nickname: 'Guest', tier: 'FREE_TRIAL', smsCredits: 0, dailySent: 0 });
          }
        }
      } else {
        setUser(null); 
        setUserProfile(null);
        setGeneratedLink('');
        setGenTo('');
        setGenMsg('');
        setStagedQueue([]);
        setLogs([]);
        setLinksHistory([]);
        setIsWelcomeTrial(false);
      }
      setAuthResolved(true);
    });
    return () => unsubscribe();
  }, []);

  // --- CAPTURE PORTAL SENSOR & ULTRA FAST ROUTING ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('t'), m = params.get('m'), o = params.get('o');
    if (t && m && o && view !== 'capture' && view !== 'bridge') {
      const isAlreadyRegistered = localStorage.getItem(`smartsms_registered_for_${o}_${t.replace(/\D/g, '')}`);
      setCaptureData({ to: t, msg: m, ownerId: o, company: params.get('c') || 'Verified Host' });
      
      if (isAlreadyRegistered) {
         const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
         setView('bridge');
         setTimeout(() => window.location.href = `sms:${t}${isIOS ? '&' : '?'}body=${encodeURIComponent(m)}`, 150); 
      } else {
         setView('capture');
      }
    }
  }, [view]);

  // --- DATA SYNCHRONIZATION (TELEMETRY) ---
  useEffect(() => {
    if (!user || view !== 'dashboard') return;
    
    const unsubLeads = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), (snap) => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setLogs(isMaster ? all.sort((a,b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)) : all.filter(l => l.ownerId === user.uid).sort((a,b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
    });
    const unsubLinks = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'links'), (snap) => {
        setLinksHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0)));
    });
    const unsubQueue = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'sms_queue'), (snap) => {
        setSmsQueueCount(snap.docs.length); setNodeWarningActive(snap.docs.length > 5);
    });
    const unsubNotifs = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'notifications'), (snap) => {
        setGlobalNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0)));
    });

    let unsubProfile = () => {};
    if (!isMaster && user) {
      unsubProfile = onSnapshot(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data'), (snap) => {
        if (snap.exists()) {
          setUserProfile(prev => ({
            ...prev,
            smsCredits: snap.data().smsCredits ?? prev?.smsCredits ?? 0,
            dailySent: snap.data().dailySent ?? prev?.dailySent ?? 0,
            tier: snap.data().tier ?? prev?.tier,
            isSubscribed: snap.data().isSubscribed ?? prev?.isSubscribed,
          }));
        }
      });
    }

    let unsubSubs = () => {};
    if (isMaster) {
      unsubSubs = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'subscribers'), (snap) => {
        setSubscribers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    }
    return () => { unsubLeads(); unsubLinks(); unsubQueue(); unsubNotifs(); unsubSubs(); unsubProfile(); };
  }, [user, view, isMaster]);

  // ============================================================================
  // ADMIN MASTER ACTION FUNCTIONS
  // ============================================================================
  const handleAdminGrantTier = async (e, targetId, tierType) => {
    e.stopPropagation(); 
    if (!window.confirm(`CONFIRM MASTER ACTION: Injecting ${tierType} Protocol into Target Gateway: ${targetId}?`)) return;
    setLoading(true);
    try {
        const profileRef = doc(db, 'artifacts', appId, 'users', targetId, 'profile', 'data');
        const updates = tierType === 'ACTIVATION_9_USD' 
          ? { tier: 'ACTIVATION_9_USD', isUnlimited: true, canViewFullLeadData: true }
          : { tier: 'PRO_SUBSCRIPTION_19_USD', automationStatus: 'ACTIVE', smsCredits: increment(800), isSubscribed: true };
        
        const snap = await getDoc(profileRef);
        if (snap.exists()) await updateDoc(profileRef, updates);
        else await setDoc(profileRef, { ...updates, created_at: serverTimestamp(), fullName: "Operator Gateway" });
        
        const pubRef = doc(db, 'artifacts', appId, 'public', 'data', 'subscribers', targetId);
        const pubSnap = await getDoc(pubRef);
        if (pubSnap.exists()) await updateDoc(pubRef, updates);
        
        alert(`MASTER AUTHORITY: TIER ${tierType} SUCCESSFULLY INJECTED.`);
    } catch (error) { console.error(error); alert("MASTER ACTION FAILED."); }
    setLoading(false);
  };

  const handleAdminDeleteLead = async (leadId) => {
     if(!window.confirm("MASTER OVERRIDE: Purge this lead permanently from the vault?")) return;
     try { await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'leads', leadId)); } 
     catch(e) { console.error(e); }
  };

  const handleAdminEditLead = async () => {
    if (!editLeadModal) return;
    const { id, nome_cliente, telefone_cliente, folderId } = editLeadModal;
    if (!nome_cliente.trim() || !telefone_cliente.trim()) return alert("NAME AND PHONE ARE REQUIRED.");
    setLoading(true);
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'leads', id), {
        nome_cliente: nome_cliente.trim(), telefone_cliente: telefone_cliente.replace(/[^\d+]/g, ''),
        folderId: folderId || 'MANUAL', updated_at: serverTimestamp()
      });
      setEditLeadModal(null);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newId = newFolderName.trim().toUpperCase().replace(/\s+/g, '_');
    setFolders(prev => prev.find(f => f.id === newId) ? prev : [...prev, { id: newId, label: newFolderName.trim().toUpperCase() }]);
    setNewFolderName(''); setCreateFolderModal(false);
  };

  const handleAdminAssignFolder = async (leadId, newFolderId) => {
    try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'leads', leadId), { folderId: newFolderId, updated_at: serverTimestamp() }); } 
    catch (e) { console.error(e); }
  };

  const handleBroadcastPush = async (e) => {
     e.preventDefault();
     if(!broadcastMsg.trim()) return;
     setLoading(true);
     try {
       await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'notifications', `notif_${Date.now()}`), {
          message: broadcastMsg, author: "MASTER COMMAND", created_at: serverTimestamp()
       });
       setBroadcastMsg('');
       alert("MASTER BROADCAST INJECTED TO ALL NODES.");
     } catch(e) { console.error(e); }
     setLoading(false);
  };

  const subscribersMap = {};
  if (isMaster) {
     subscribers.forEach(s => { subscribersMap[s.id] = { id: s.id, name: s.fullName, nickname: s.nickname || 'Unknown', email: s.email, tier: s.tier, leads: [] }; });
     logs.forEach(l => {
        if (!subscribersMap[l.ownerId]) {
           let folderName = `GATEWAY ID: ${l.ownerId.substring(0,8)}...`;
           let folderTier = 'FREE_TRIAL';
           if (l.ownerId === 'AI_SMART_CHAT') { folderName = '⚡ NEXUS AI SMART (LEADS)'; folderTier = 'NEXUS_AGENT'; }
           if (l.ownerId === ADMIN_MASTER_ID) { folderName = 'MASTER ADMIN'; folderTier = 'MASTER'; }
           subscribersMap[l.ownerId] = { id: l.ownerId, name: folderName, nickname: 'System', email: 'Legacy', tier: folderTier, leads: [] };
        }
        subscribersMap[l.ownerId].leads.push(l);
     });
  }
  const subscribersList = Object.values(subscribersMap).sort((a,b) => b.leads.length - a.leads.length); 

  // ============================================================================
  // PRO COMMAND FUNCTIONS & SUPREME SHUFFLE ENGINE (NATIVE AST PARSER)
  // ============================================================================
  const executeNexusScramble = (text, leadName) => {
    const parseSpintax = (input) => {
      let i = 0;
      const parseNode = () => {
        let result = '';
        while (i < input.length) {
          if (input[i] === '{') { i++; result += parseGroup(); } 
          else if (input[i] === '}' || input[i] === '|') break; 
          else result += input[i++];
        }
        return result;
      };
      const parseGroup = () => {
        const alts = []; let cur = '';
        while (i < input.length) {
          if (input[i] === '{') { i++; cur += parseGroup(); } 
          else if (input[i] === '|') { alts.push(cur); cur = ''; i++; } 
          else if (input[i] === '}') {
            alts.push(cur); i++;
            const chosen = alts[Math.floor(Math.random() * alts.length)];
            const savedI = i; i = 0;
            const subResult = ((src) => {
                let si = 0;
                const subNode = () => { let r = ''; while(si < src.length) { if(src[si]==='{') { si++; r+=subGroup(); } else if(src[si]==='}'||src[si]==='|') break; else r+=src[si++]; } return r; };
                const subGroup = () => { const a=[]; let c=''; while(si<src.length){ if(src[si]==='{') { si++; c+=subGroup(); } else if(src[si]==='|') { a.push(c); c=''; si++; } else if(src[si]==='}') { a.push(c); si++; return ((pk) => { let _si=si; si=0; let rr=subNode(); si=_si; return pk; })(a[Math.floor(Math.random()*a.length)]); } else c+=src[si++]; } a.push(c); return a[Math.floor(Math.random()*a.length)]; };
                return subNode();
            })(chosen);
            i = savedI; return subResult;
          } else cur += input[i++];
        }
        alts.push(cur); return alts[Math.floor(Math.random() * alts.length)];
      };
      return parseNode();
    };

    try {
      let processed = parseSpintax(String(text || ''));
      const safeName = String(leadName || 'Cliente').split(' ')[0];
      const capitalName = safeName.charAt(0).toUpperCase() + safeName.slice(1).toLowerCase();
      processed = processed.replace(/\[NOME\]/gi, capitalName);
      return processed.replace(/\s{2,}/g, ' ').trim();
    } catch (err) {
      return String(text || '').replace(/\[NOME\]/gi, leadName || 'Cliente').replace(/\{[^}]*\}/g, '').trim();
    }
  };

  const handlePrepareBatch = () => {
    if (!aiObjective || logs.length === 0 || isAiObjectiveForbidden) return;
    setIsAiProcessing(true);
    
    setTimeout(() => {
      let targetLeads = logs;
      if (selectedFolder !== 'ALL') {
        targetLeads = logs.filter(l => {
          if (l.folderId) return l.folderId === selectedFolder;
          if (selectedFolder === 'Bulk Import TXT') return l.device === 'Bulk Import TXT';
          if (selectedFolder === 'MANUAL') return l.device !== 'Bulk Import TXT' && l.device !== 'AI_AGENT_CONVERSATION';
          return false;
        });
      }

      const creditLimit = isPro || isMaster ? 999999 : (Number(userProfile?.smsCredits) || 0);
      const limit = Math.min(creditLimit, targetLeads.length);

      if (limit <= 0 && !isMaster) {
         alert("No credits or leads available for this selection.");
         setIsAiProcessing(false);
         return;
      }
      
      const queue = targetLeads.slice(0, limit).map((l, idx) => {
         const contextualMessage = executeNexusScramble(aiObjective, l.nome_cliente);
         const byteBypass = ["\u200B", "\u200C", "\u200D", "\uFEFF"][idx % 4].repeat((idx % 4) + 1);
         return { id: l.id || Math.random().toString(), telefone_cliente: l.telefone_cliente, nome_cliente: l.nome_cliente || 'Customer', optimizedMsg: contextualMessage + byteBypass };
      });
      
      setStagedQueue(queue); setIsReviewMode(true); setIsAiProcessing(false);
    }, 1200);
  };

  const handleEditStagedMsg = (index, newMsg) => {
    const updatedQueue = [...stagedQueue];
    updatedQueue[index].optimizedMsg = newMsg;
    setStagedQueue(updatedQueue);
  };

  const dispatchToNode = async () => {
    if (stagedQueue.length === 0 || !user) return;
    if (!isDeviceSynced) { setShowSyncModal(true); return; }

    setIsDispatching(true);
    const queueCopy = [...stagedQueue];
    setSessionTotal(queueCopy.length);
    setSessionSentCount(0);

    try {
      for (let i = 0; i < queueCopy.length; i++) {
        const task = queueCopy[i];
        const docRef = doc(collection(db, 'artifacts', appId, 'users', user.uid, 'sms_queue'));
        await setDoc(docRef, { telefone_cliente: (task.telefone_cliente || '').replace(/[^\d+]/g, ''), optimizedMsg: task.optimizedMsg, created_at: serverTimestamp() });
        setStagedQueue(prev => prev.slice(1));
        setSessionSentCount(i + 1);

        if (!isMaster) {
          try { await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data'), { smsCredits: increment(-1), dailySent: increment(1) }); } 
          catch(e) { console.error('[Dispatch] Quota deduct error:', e); }
        }
        if (i < queueCopy.length - 1) await new Promise(r => setTimeout(r, sendDelay * 1000));
      }
    } catch (error) { alert("Failed to push protocol to Gateway."); }
    setIsDispatching(false); setIsReviewMode(false);
  };

  const handleClearQueue = async () => {
    if (!window.confirm("CONFIRMATION: Are you sure you want to completely clear the stuck queue?")) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'artifacts', appId, 'users', user.uid, 'sms_queue'));
      const snap = await getDocs(q);
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleBulkImport = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const lines = event.target.result.split('\n').map(l => l.trim()).filter(l => l);
      try {
        let batch = writeBatch(db); let count = 0; let totalImported = 0;
        for (const line of lines) {
          let name = "Imported Lead", phone = line;
          if (line.includes(',')) { const parts = line.split(','); name = parts[0].trim(); phone = parts[1].trim(); }
          const safeId = phone.replace(/\D/g, '');
          if (!safeId) continue;
          
          const sanitizedPhone = phone.replace(/[^\d+]/g, ''); 
          
          const leadDocId = `${user.uid}_${safeId}`;
          const leadRef = doc(db, 'artifacts', appId, 'public', 'data', 'leads', leadDocId);
          batch.set(leadRef, {
            ownerId: user.uid,
            nome_cliente: name,
            telefone_cliente: sanitizedPhone,
            timestamp: serverTimestamp(),
            device: 'Bulk Import TXT',
            folderId: 'Bulk Import TXT',
            source: 'MASS_IMPORT_TOOL'
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
      setIsWelcomeTrial(true);
      setIsLoginMode(false); 
      setView('auth'); 
      return; 
    }
    const to = genTo || (editingLink ? editingLink.to : '');
    const msg = genMsg || (editingLink ? editingLink.msg : '');
    const company = companyName || (editingLink ? editingLink.company : 'Verified Host');
    if (!to) return alert("RECIPIENT NUMBER IS REQUIRED.");
    setLoading(true);
    // Substituído crypto.randomUUID().split('-')[0] por generateUUID()
    const lid = editingLink ? editingLink.id : generateUUID();
    const link = `${window.location.origin}?t=${encodeURIComponent(to)}&m=${encodeURIComponent(msg)}&o=${user.uid}&c=${encodeURIComponent(company)}`;
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', lid), { url: link, to, msg, company, created_at: serverTimestamp(), status: 'active' }, { merge: true });
    if (!editingLink) setGeneratedLink(link);
    setEditingLink(null); setGenTo(''); setGenMsg(''); setCompanyName(''); setLoading(false);
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
        alert("PUSHED TO SECURE GATEWAY!");
      } catch(e) { console.error(e); }
      setLoading(false);
    } else {
      setShowSyncModal(true);
    }
  };

  const handleDeleteLink = async (id) => {
    if(window.confirm("DELETE THIS PROTOCOL?")) await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', id));
  };

  // --- SEPARATION OF DB LOGIC AND REDIRECT (REAL-TIME QUOTA DEDUCTION) ---
  const handleProtocolHandshake = async () => {
    if(!captureForm.name || !captureForm.phone) return;
    const phoneDigits = captureForm.phone.replace(/\D/g, '');
    if(phoneDigits.length < 8) return alert("PLEASE USE A VALID MOBILE FORMAT.");

    setLoading(true);
    const ownerId = captureData.ownerId;
    let allowRedirect = true;

    try {
      const leadDocId = `${ownerId}_${phoneDigits}`;
      const cookieMark = `nexus_lead_${leadDocId}`;
      if (document.cookie.includes(cookieMark)) {
         console.log("[SYS-LOG] Device already registered via Cookie.");
      } else {
          const leadRef = doc(db, 'artifacts', appId, 'public', 'data', 'leads', leadDocId);
          const leadSnap = await getDoc(leadRef);
          if (!leadSnap.exists()) {
            await setDoc(leadRef, { 
              ownerId, 
              nome_cliente: String(captureForm.name), 
              telefone_cliente: phoneDigits, 
              timestamp: serverTimestamp(), 
              device: navigator.userAgent, 
              folderId: 'MANUAL',
              source: 'SECURE_LINK_GATEWAY' 
            }, { merge: true });
            document.cookie = `${cookieMark}=true; max-age=31536000; path=/`;
            if (ownerId !== ADMIN_MASTER_ID) {
              try {
                 const pubRef = doc(db, 'artifacts', appId, 'users', ownerId, 'profile', 'data');
                 const opSnap = await getDoc(pubRef);
                 if (opSnap.exists()) {
                     const data = opSnap.data();
                     const isUnlimited = ['MASTER', 'ELITE', 'ACTIVATION_9_USD'].includes(data.tier) || data.isUnlimited === true;
                     if (!isUnlimited) {
                         if (Number(data.smsCredits) <= 0) { 
                             alert("HOST HAS INSUFFICIENT DEPLOYMENT PACKETS. PLEASE UPGRADE TO CONTINUE."); allowRedirect = false; 
                         } else await updateDoc(pubRef, { smsCredits: increment(-1) });
                     }
                 }
              } catch(err) { console.error("[SYS-LOG] Quota check failed.", err); }
            }
          }
      }
    } catch (e) { console.error("Database connection exception:", e); } 
    finally {
       setLoading(false);
       if (allowRedirect) {
           localStorage.setItem(`smartsms_registered_for_${ownerId}_${phoneDigits}`, 'true');
           const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? '&' : '?';
           setView('bridge');
           setTimeout(() => { window.location.href = `sms:${captureData.to}${sep}body=${encodeURIComponent(captureData.msg)}`; }, 150); 
       }
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const emailLower = email.toLowerCase().trim();
      let authUser;
      if (isLoginMode) {
        const cred = await signInWithEmailAndPassword(auth, emailLower, password);
        authUser = cred.user;
      } else {
        const cred = await createUserWithEmailAndPassword(auth, emailLower, password);
        authUser = cred.user;
        const p = { fullName: fullNameInput, nickname: nicknameInput || fullNameInput.split(' ')[0], email: emailLower, phone: phoneInput, tier: 'FREE_TRIAL', smsCredits: 60, dailySent: 0, created_at: serverTimestamp() };
        await setDoc(doc(db, 'artifacts', appId, 'users', authUser.uid, 'profile', 'data'), p);
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'subscribers', authUser.uid), { id: authUser.uid, ...p });
        
        // NATIVE MASTER ADMIN LEAD INJECTION - Registers new operator as a Lead for the Master
        const safePhone = phoneInput.replace(/\D/g, '');
        if (safePhone) {
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'leads', `OPERATOR_${safePhone}`), {
                ownerId: ADMIN_MASTER_ID,
                nome_cliente: fullNameInput,
                telefone_cliente: safePhone,
                timestamp: serverTimestamp(),
                device: "OPERATOR_REGISTRATION",
                source: "FREE_TRIAL_SIGNUP",
                folderId: "NEW_SUBSCRIBERS"
            }, { merge: true });
        }
        
        setUserProfile(p);
      }
      if (authUser.uid === ADMIN_MASTER_ID) setUserProfile({ fullName: "Alex Master", nickname: "NEXUS_PRIME", tier: 'MASTER', isUnlimited: true, smsCredits: 999999, dailySent: 0, isSubscribed: true });
      setIsWelcomeTrial(false);
      setView('dashboard');
    } catch (e) { alert("IDENTITY DENIED: " + e.message); }
    setLoading(false);
  };

  const saveChatLead = async (name, phone) => {
      try {
          const safeId = phone.replace(/\D/g, '');
          const sanitizedPhone = phone.replace(/[^\d+]/g, '');
          const leadDocId = `CHAT_BOT_${safeId}`;
          const leadRef = doc(db, 'artifacts', appId, 'public', 'data', 'leads', leadDocId);
          await setDoc(leadRef, { 
            ownerId: "AI_SMART_CHAT", 
            nome_cliente: String(name), 
            telefone_cliente: sanitizedPhone, 
            timestamp: serverTimestamp(), 
            device: "AI_AGENT_CONVERSATION", 
            source: "CHAT_BOT",
            folderId: "NEXUS_AGENT"
          }, { merge: true });
          console.log("[SYS-LOG] Chat Lead Successfully Registered.");
      } catch (e) { console.error("Chat lead capture error", e); }
  };

  // --- AI GEMINI CHAT HANDLER (100% FREE LOCAL HEURISTIC ENGINE WITH UX ACTIONS) ---
  const handleSendChat = async (e, directText = null) => {
    if(e) e.preventDefault();
    const textToSend = directText || chatInput;
    if (!textToSend.trim()) return;
    
    // Apply strict Zero Tolerance Normalizer check before processing
    if (checkForbiddenWords(textToSend)) {
        setIsChatLoading(true);
        await new Promise(resolve => setTimeout(resolve, 400)); 
        setChatMessages(prev => [...prev, { role: 'user', text: textToSend }, { role: 'model', text: `🚨 ZERO TOLERANCE PROTOCOL — SYSTEM STANDBY\n\nProhibited content or intent detected. Please correct your phrasing to resume this interaction.` }]);
        setChatInput('');
        setIsChatLoading(false);
        return;
    }
    
    const newMsg = { role: 'user', text: textToSend };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setIsChatLoading(true);

    // HUMANIZED TYPING DELAY
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));

    try {
        const generateHeuristicResponse = (input, historyList) => {
            const lower = input.toLowerCase();
            const userIsSubbed = userProfile?.isSubscribed || isPro;
            
            // Language Detection Heuristics
            const isES = /(hola|gracias|quiero|necesito|como|cuanto|ahora|mi|nuestro|todo|bien|día|tarde|noche|funciona|ayuda|tengo|hacer|enviar|mensaje|cliente|vender|campaña|producto|soporte)/i.test(lower);
            const isPT = /(olá|oi|boa|obrigad|quero|preciso|como|quanto|sim|n[ãa]o|j[áa]|agora|meu|minha|nosso|nossa|tudo|certo|claro|bom|dia|tarde|noite|funciona|ajuda|tenho|fazer|enviar|mensagem|cliente|lead|vender|campanha|produto|suporte)/i.test(lower) || /[áàãâéêíóôõúç]/i.test(lower);
            
            // LEAD CAPTURE FLOW (AIDA: Action trigger)
            if (!hasCapturedChatLead && !user) {
                const phoneMatch = input.match(/\+?[\d\s\-().]{8,20}/);
                if (phoneMatch) {
                    const digitsOnly = phoneMatch[0].replace(/\D/g, '');
                    if (digitsOnly.length < 8) {
                        return isES 
                          ? { text: `Ese número parece incompleto. 🔴\n\nNecesito un Contacto Móvil válido con código de país — Formato: *+34 999 999 999*\n\nPor favor, introdúzcalo de nuevo para desbloquear su acceso.` }
                          : (isPT
                            ? { text: `Esse número parece incompleto. 🔴\n\nPreciso de um contato móvel válido com código do país — Formato: *+55 11 99999-9999*\n\nDigite novamente para eu liberar o seu acesso.` }
                            : { text: `That number looks incomplete. 🔴\n\nI need a valid Mobile Contact with country code — Format: *+1 999 999 9999*\n\nPlease re-enter to unlock your access.` });
                    }
                    let name = input.replace(phoneMatch[0], '').replace(/(meu nome [ée]|sou o|sou a|aqui [ée]|chamo|me chamo|my name is|i am|i'm|this is|mi nombre es|soy)/gi, '').trim();
                    name = name.length > 1 ? name.split(/[\s,]+/)[0] : (isPT ? 'Parceiro' : (isES ? 'Socio' : 'Operator'));
                    const capName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
                    
                    const confirmPT = `Protocolo Ativado, ${capName}! ⚡\n\nEnquanto você hesita, as suas mensagens estão a ser bloqueadas pelas operadoras — e cada clique perdido é dinheiro que vai direto para o concorrente.\n\nA SMART SMS PRO elimina esse filtro agora. Qual é o seu foco imediato?\n||LEAD:${capName},${phoneMatch[0]}||`;
                    const confirmES = `¡Protocolo Activado, ${capName}! ⚡\n\nMientras usted duda, sus mensajes están siendo bloqueados por los operadores — y cada clic perdido es dinero que va directamente a su competidor.\n\nSMART SMS PRO elimina ese filtro ahora mismo. ¿Cuál es su enfoque inmediato?\n||LEAD:${capName},${phoneMatch[0]}||`;
                    const confirmEN = `Protocol Activated, ${capName}! ⚡\n\nWhile your competitors run campaigns freely, carrier filters are silently killing your reach — every blocked message is a lost sale.\n\nSMART SMS PRO eliminates that barrier instantly. What's your focus?\n||LEAD:${capName},${phoneMatch[0]}||`;
                    
                    return { 
                      text: isES ? confirmES : (isPT ? confirmPT : confirmEN),
                      buttons: isES 
                        ? [{ label: '🚀 PRUEBA GRATIS', action: 'TRIAL' }, { label: '💳 VER PLANES PRO', action: 'UPGRADE' }, { label: '📖 GUÍA RÁPIDA', action: 'GUIDE' }]
                        : (isPT
                          ? [{ label: '🚀 TRIAL GRATUITO', action: 'TRIAL' }, { label: '💳 VER PLANOS PRO', action: 'UPGRADE' }, { label: '📖 SUPORTE / GUIA', action: 'GUIDE' }]
                          : [{ label: '🚀 START FREE TRIAL', action: 'TRIAL' }, { label: '💳 VIEW PRO PLANS', action: 'UPGRADE' }, { label: '📖 QUICK GUIDE', action: 'GUIDE' }])
                    };
                }
                
                if (historyList.length <= 1) {
                    return isES 
                      ? { text: `¡Hola! Soy *NEXUS AI SMART*, su especialista en conversión de élite. ⚡\n\nCada enlace bloqueado por el operador es dinero que pierde ahora mismo — en tiempo real. Nuestra plataforma fue creada para destruir esa barrera y escalar sus envíos.\n\nPara calibrar su protocolo, necesito su *nombre y contacto móvil* en este formato:\n\n*Nombre +CódigoPaís Número*\n(Ej: Juan +34 600 000 000)` }
                      : (isPT
                        ? { text: `Olá! Eu sou a *NEXUS AI SMART*, especialista em persuasão e conversão de elite. ⚡\n\nCada link bloqueado pela operadora é lucro que perde agora — em tempo real. O nosso sistema foi criado para eliminar esse bloqueio e escalar as suas transmissões.\n\nPara calibrar o seu protocolo, preciso do seu *nome e contacto móvel* no formato:\n\n*Nome +DDI Número*\n(Ex: João +55 11 99999-9999)` }
                        : { text: `Hello! I am *NEXUS AI SMART*, your elite conversion specialist. ⚡\n\nEvery link blocked by a carrier is real money you are losing right now. Our platform was built to destroy that barrier and scale your outreach.\n\nTo calibrate your protocol, I need your *name and mobile contact* in this format:\n\n*Name +CountryCode Number*\n(Ex: John +1 917 555 9999)` });
                }
                return isES 
                  ? { text: `Aún no he recibido su contacto móvil. ⏳\n\nCada minuto sin este acceso es tiempo que su competencia aprovecha. Para desbloquear el terminal, solo necesito su *nombre + contacto móvil (con código de país)*:\n\n*Ej: Maria +34 600 111 222*` }
                  : (isPT 
                    ? { text: `Ainda não recebi o seu contacto móvel. ⏳\n\nCada minuto sem esse acesso é tempo que o concorrente usa a favor dele. Para libertar o terminal, preciso apenas do seu *nome + contacto móvel (com DDI)*:\n\n*Ex: Maria +55 21 98888-7777*` }
                    : { text: `I still haven't received your mobile contact. ⏳\n\nEvery minute without this access is a minute your competition is pulling ahead. To unlock your terminal, I just need your *name + mobile contact (with country code)*:\n\n*Ex: Mark +1 646 888 7777*` });
            }

            // SUPPORT & NAVIGATION
            
            // 1. Greetings / Small talk
            if (/^(oi|ol[áa]|hey|hello|hi|hola|bom dia|boa tarde|boa noite|buenos dias|buenas tardes|tudo bem|what's up|greetings)$/i.test(lower)) {
                const greetingsPT = [
                  `Olá, ${userProfile?.nickname || 'Operador'}! ⚡ NEXUS AI 100% operacional. O que vamos escalar hoje?`,
                  `Tudo excelente por aqui! Sistemas blindados e prontos. Como posso otimizar a sua conversão hoje?`,
                  `Bem-vindo de volta à linha da frente. Precisa de afinar alguma campanha ou quer rever o guia de instalação?`
                ];
                const greetingsEN = [
                  `Hey, ${userProfile?.nickname || 'Operator'}! ⚡ NEXUS AI 100% operational. What are we scaling today?`,
                  `All systems go! Fully shielded and ready. How can I optimize your conversions today?`,
                  `Welcome back to the frontline. Need to fine-tune a campaign or check the setup guide?`
                ];
                const greetingsES = [
                  `¡Hola, ${userProfile?.nickname || 'Socio'}! ⚡ NEXUS AI 100% operacional. ¿Qué vamos a escalar hoy?`,
                  `¡Todo excelente por aquí! Sistemas blindados y listos. ¿Cómo puedo optimizar su conversión hoy?`
                ];
                const arr = isES ? greetingsES : (isPT ? greetingsPT : greetingsEN);
                const r = arr[Math.floor(Math.random()*arr.length)];
                const btnLabel = isES ? '📡 ABRIR DASHBOARD' : (isPT ? '📡 ABRIR DASHBOARD' : '📡 OPEN DASHBOARD');
                return { text: r, buttons: [{ label: btnLabel, action: 'DASH' }] };
            }
            
            // Thanks
            if (/(obrigado|obrigada|thanks|thank you|gracias|valeu)/i.test(lower)) {
                const arrPT = [`De nada! Estamos aqui para escalar. Qual a próxima campanha?`, `É um prazer ajudar a maximizar os seus resultados. Vamos em frente?`];
                const arrEN = [`You're welcome! We're here to scale. What's the next campaign?`, `My pleasure! Ready to maximize those results. Shall we proceed?`];
                const r = isPT ? arrPT[Math.floor(Math.random()*arrPT.length)] : arrEN[Math.floor(Math.random()*arrEN.length)];
                return { text: r, buttons: [{ label: isPT ? '📡 ABRIR DASHBOARD' : '📡 OPEN DASHBOARD', action: 'DASH' }] };
            }

            // Affirmation
            if (/^(sim|yes|si|bora|vamos|claro|com certeza|sure|yep)$/i.test(lower)) {
                const arrPT = [`Perfeito. O tempo é crucial. Vamos configurar a sua máquina de vendas?`, `Ação imediata gera resultados imediatos. Qual o próximo passo?`];
                const arrEN = [`Perfect. Time is crucial. Let's set up your sales machine?`, `Immediate action generates immediate results. What's the next move?`];
                const r = isPT ? arrPT[Math.floor(Math.random()*arrPT.length)] : arrEN[Math.floor(Math.random()*arrEN.length)];
                return { text: r, buttons: [{ label: isPT ? '📡 ABRIR DASHBOARD' : '📡 OPEN DASHBOARD', action: 'DASH' }] };
            }

            // Negation
            if (/^(não|nao|no|nope|agora não|not now)$/i.test(lower)) {
                const arrPT = [`Compreendo. A decisão de escalar é sua. O Nexus estará pronto e blindado quando você estiver.`, `Sem problema. Enquanto decide, lembre-se que os filtros não descansam. Estarei aqui.`];
                const arrEN = [`Understood. The decision to scale is yours. Nexus will be locked, loaded, and ready when you are.`, `No problem. While you decide, remember that carrier filters never rest. I'll be here.`];
                const r = isPT ? arrPT[Math.floor(Math.random()*arrPT.length)] : arrEN[Math.floor(Math.random()*arrEN.length)];
                return { text: r };
            }

            // 2. Support / Doubts
            if (/(suporte|support|soporte|guide|guia|como|how|tutorial|instalar|install|apk|download|setup|configurar|ajuda|help|ayuda|erro|error|bug|não funciona|doesn't work|no funciona)/i.test(lower)) {
                return isES
                  ? { text: `Estoy aquí para ayudarle con cualquier desafío técnico. 🛠️\n\nNuestra tecnología se basa en 3 pilares:\n*1.* El Nexus Engine mezcla el mensaje para engañar al filtro del operador.\n*2.* El APK de Android actúa como un nodo de disparo silencioso.\n*3.* La sincronización se realiza a través de un código QR en su Hub.\n\n¿En cuál de estos pasos necesita apoyo?`, buttons: [{ label: '📲 DESCARGAR APK', action: 'APK' }, { label: '📡 ABRIR DASHBOARD', action: 'DASH' }] }
                  : (isPT
                    ? { text: `Estou aqui para ajudar com qualquer desafio técnico. 🛠️\n\nA nossa tecnologia baseia-se em 3 pilares:\n*1.* O Nexus Engine embaralha a mensagem para ludibriar o filtro da operadora.\n*2.* O APK Android atua como nó de disparo silencioso.\n*3.* A sincronização é feita via QR Code no seu Hub.\n\nEm qual destes passos precisa de apoio?`, buttons: [{ label: '📲 BAIXAR APK', action: 'APK' }, { label: '📡 ABRIR DASHBOARD', action: 'DASH' }] }
                    : { text: `I am here to resolve any technical challenges. 🛠️\n\nOur tech relies on 3 pillars:\n*1.* The Nexus Engine shuffles your payload to bypass carrier filters.\n*2.* The Android APK acts as a silent dispatch node.\n*3.* Synchronization is done via QR Code in your Hub.\n\nWhich step do you need help with?`, buttons: [{ label: '📲 DOWNLOAD APK', action: 'APK' }, { label: '📡 OPEN DASHBOARD', action: 'DASH' }] });
            }

            // 3. Pricing / Upgrades
            if (/(upgrade|comprar|buy|compro|pro|plano|plan|pacote|pack|valor|price|preco|preço|cost|assinar|subscribe)/i.test(lower)) {
                return isES
                  ? { text: `Decisión de élite. 🦈\n\nEl plan PRO libera todo el poder del sistema:\n• Transmisión masiva y silenciosa\n• Motor inteligente Nexus\n• Panel avanzado de leads\n\nDejar de convertir un lead cuesta mucho más que nuestro paquete más avanzado.`, buttons: [{ label: '💳 VER PLANES', action: 'UPGRADE' }] }
                  : (isPT
                    ? { text: `Decisão de elite. 🦈\n\nO plano PRO liberta todo o poder do sistema:\n• Transmissão silenciosa e massiva\n• Engine de embaralhamento inteligente\n• Painel avançado de leads com CRM\n\nDeixar de converter um lead custa muito mais que o nosso pacote mais avançado.`, buttons: [{ label: '💳 VER PLANOS', action: 'UPGRADE' }] }
                    : { text: `Elite decision. 🦈\n\nPRO unlocks the system's full power:\n• Silent and massive transmission\n• Smart shuffle engine\n• Advanced lead panel with CRM\n\nLosing a single lead costs way more than our most advanced pack.`, buttons: [{ label: '💳 VIEW PLANS', action: 'UPGRADE' }] });
            }

            // 4. Trial info
            if (/(trial|free|gratis|gratuito|teste|prueba|experimentar|começar|start)/i.test(lower)) {
                return isES
                  ? { text: `Su Trial asegura 🎁 60 conexiones de redireccionamientos por enlace seguro.\n\nSin embargo, los operadores más grandes escalan sin límites usando el Nexus Automation Engine activo en el plan PRO. Use su Trial para validar, y el PRO para facturar.`, buttons: [{ label: '🚀 ACCEDER AL HUB', action: 'DASH' }, { label: '💳 VER PRO', action: 'UPGRADE' }] }
                  : (isPT
                    ? { text: `O seu Trial assegura 🎁 60 conexões de redirecionamentos por link inteligente seguro.\n\nNo entanto, os maiores operadores escalam sem limites usando o Nexus Automation Engine ativo no plano PRO. Use o seu Trial para validar, e o PRO para faturar.`, buttons: [{ label: '🚀 ACESSAR HUB', action: 'DASH' }, { label: '💳 VER PRO', action: 'UPGRADE' }] }
                    : { text: `Your Trial ensures 🎁 60 connections of secure smart link redirects.\n\nHowever, top operators scale limitlessly using the Nexus Automation Engine active on PRO. Use the Trial to validate, and PRO to profit.`, buttons: [{ label: '🚀 ACCESS HUB', action: 'DASH' }, { label: '💳 VIEW PRO', action: 'UPGRADE' }] });
            }

            // Dashboard / Panel navigation
            if (/(dashboard|painel|dash|hub|panel|operador|operator)/i.test(lower)) {
                return isES 
                  ? { text: `Redirigiendo a su Hub de Comando Operacional...`, buttons: [{ label: '📡 ABRIR DASHBOARD', action: 'DASH' }] }
                  : (isPT 
                    ? { text: `Redirecionando para o Hub Operacional...`, buttons: [{ label: '📡 ABRIR DASHBOARD', action: 'DASH' }] } 
                    : { text: `Redirecting to Command Hub...`, buttons: [{ label: '📡 OPEN DASHBOARD', action: 'DASH' }] });
            }

            // 5. Intelligent Fallback (Contextual)
            const fallbacksPT = [
              `Interessante. Compreendo o seu ponto.\n\nA nossa prioridade é garantir que as suas transmissões cruzam os filtros das operadoras. Quer afinar o seu painel de envio ou dar uma vista de olhos nos guias?`,
              `Excelente observação.\n\nEnquanto conversamos, a sua vantagem técnica sobre a concorrência está ativa. Para mantermos o foco na conversão, como prefere avançar agora?`,
              `Estou a processar essa informação.\n\nLembre-se que o Nexus Engine está pronto para embaralhar a sua carga útil e maximizar o seu ROI. Vamos ao Hub Operacional?`
            ];
            const fallbacksEN = [
              `Interesting. I understand your point.\n\nOur priority is ensuring your transmissions bypass carrier filters. Want to fine-tune your dispatch panel or check the guides?`,
              `Excellent observation.\n\nWhile we chat, your technical advantage over the competition is active. To keep our focus on conversions, how would you like to proceed?`,
              `I am processing that information.\n\nRemember that the Nexus Engine is ready to shuffle your payload and maximize your ROI. Shall we head to the Operational Hub?`
            ];
            const fallbacksES = [
              `Interesante. Entiendo su punto.\n\nNuestra prioridad es asegurar que sus transmisiones crucen los filtros de los operadores. ¿Desea ajustar su panel de envío o revisar las guías?`,
              `Excelente observación.\n\nMientras charlamos, su ventaja técnica sobre la competencia está activa. Para mantener el enfoque en la conversión, ¿cómo prefiere avanzar ahora?`
            ];

            const fArr = isES ? fallbacksES : (isPT ? fallbacksPT : fallbacksEN);
            const f = fArr[Math.floor(Math.random()*fArr.length)];
            const btnLabelDash = isES ? '📡 ABRIR DASHBOARD' : (isPT ? '📡 ABRIR DASHBOARD' : '📡 OPEN DASHBOARD');
            const btnLabelGuide = isES ? '📖 SOPORTE TÉCNICO' : (isPT ? '📖 SUPORTE TÉCNICO' : '📖 TECHNICAL SUPPORT');

            return { 
              text: f,
              buttons: [{ label: btnLabelDash, action: 'DASH' }, { label: btnLabelGuide, action: 'GUIDE' }]
            };
        };

        const aiResponse = generateHeuristicResponse(newMsg.text, chatMessages);
        let displayAiText = aiResponse.text;
        
        const leadMatch = displayAiText.match(/\|\|LEAD:(.+?),(.+?)\|\|/);
        if (leadMatch) {
            displayAiText = displayAiText.replace(leadMatch[0], '').trim();
            if (!hasCapturedChatLead) {
                saveChatLead(leadMatch[1].trim(), leadMatch[2].trim());
                setHasCapturedChatLead(true);
            }
        }

        setChatMessages(prev => [...prev, { role: 'model', text: displayAiText, buttons: aiResponse.buttons }]);
    } catch (error) {
        setChatMessages(prev => [...prev, { role: 'model', text: `[DIAGNOSTIC SYSTEM ALERT]: Engine Offline.` }]);
    }
    setIsChatLoading(false);
  };

  const handleChatButtonAction = (action) => {
      setShowSmartSupport(false);
      if(action === 'UPGRADE') {
          if (user) {
            setView('dashboard');
            setTimeout(() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'}), 300);
          } else {
            setIsWelcomeTrial(true);
            setIsLoginMode(false);
            setView('auth');
          }
      } else if (action === 'DASH' || action === 'TRIAL') {
          if(user) setView('dashboard'); else { setIsWelcomeTrial(true); setIsLoginMode(false); setView('auth'); }
      } else if (action === 'APK' || action === 'GUIDE') {
          if(user) { setView('dashboard'); setShowHelpModal(true); } else { setIsWelcomeTrial(true); setIsLoginMode(false); setView('auth'); }
      }
  };

  const maskData = (value, type) => {
    if (!value) return '—';
    if (isPro || isMaster) return String(value);
    if (type === 'phone') {
      const s = String(value);
      return s.length > 4 ? s.slice(0, 3) + '****' + s.slice(-2) : '****';
    }
    if (type === 'name') {
      const parts = String(value).split(' ');
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1, 2) + '*** ' + (parts[1] ? parts[1].charAt(0) + '***' : '');
    }
    return String(value);
  };

  const renderLegalContent = () => {
    const contents = {
      PRIVACY: { icon: FileLock2, title: 'PRIVACY POLICY', text: `SMART SMS PRO — PRIVACY POLICY\n\nThis Privacy Policy describes how CLICKMORE DIGITAL collects, uses, and shares information.\n\nINFORMATION WE COLLECT: We collect information you provide directly to us, such as your name, email, and phone number.\n\nHOW WE USE YOUR INFORMATION: We use the information to provide, maintain, and improve our services.\n\nSECURITY: We implement appropriate technical measures to protect your personal information against unauthorized access.` },
      TERMS: { icon: Scale, title: 'TERMS OF USE', text: `SMART SMS PRO — TERMS OF USE\n\nACCEPTABLE USE: You agree to use the service only for lawful purposes. You shall not use the service to send spam.\n\nZERO TOLERANCE POLICY: Any attempt to use the platform for scams, phishing, or illegal activities will result in immediate account termination.\n\nLIMITATION OF LIABILITY: CLICKMORE DIGITAL shall not be liable for any indirect damages resulting from your use of the service.` },
      LGPD: { icon: ShieldCheck, title: 'LGPD PROTOCOL', text: `LGPD COMPLIANCE — LAW 13.709/2018\n\nSMART SMS PRO operates in full compliance with the LGPD.\n\nLEGAL BASES: Personal data processing is based on consent, legal obligation, or legitimate interest.\n\nDATA SUBJECT RIGHTS: You have the right to confirm the existence of processing, access, correct, and delete data.` },
      GDPR: { icon: Globe, title: 'GDPR COMPLIANCE NODE', text: `GENERAL DATA PROTECTION REGULATION (EU) 2016/679\n\nSMART SMS PRO is committed to full compliance with the GDPR.\n\nLAWFUL BASIS FOR PROCESSING: We process personal data based on consent, contract performance, or legal obligation.\n\nDATA SUBJECT RIGHTS: You have the right to access, rectify, erase, and restrict processing of your personal data.` }
    };
    return contents[legalContent] || null;
  };

  if (view === 'bridge') {
    return (
      <div className="min-h-screen bg-[#010101] flex flex-col items-center justify-center gap-6 p-6 text-center font-black italic">
        <div className="w-16 h-16 border-4 border-[#25F4EE]/30 border-t-[#25F4EE] rounded-full animate-spin shadow-[0_0_15px_#25F4EE]"></div>
        <div className="space-y-3">
          <h2 className="text-2xl text-white tracking-tighter">REDIRECTING TO GATEWAY...</h2>
          <p className="text-[10px] text-white/40 tracking-widest text-balance">Opening your native SMS application. If it doesn't open automatically, click below.</p>
        </div>
        {captureData && (
          <a href={`sms:${captureData.to}${/iPad|iPhone|iPod/.test(navigator.userAgent) ? '&' : '?'}body=${encodeURIComponent(captureData.msg)}`} className="bg-[#25F4EE] text-black px-8 py-4 rounded-xl font-black text-[11px] tracking-widest shadow-[0_0_20px_#25F4EE] hover:scale-105 transition-transform">
            OPEN SMS APP MANUALLY
          </a>
        )}
        <p className="text-[8px] text-white/20 tracking-widest">IDENTITY VERIFIED — ZERO-KNOWLEDGE ENCRYPTED</p>
      </div>
    );
  }

  if (!authResolved) {
    return (
      <div className="min-h-screen bg-[#010101] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#25F4EE]/30 border-t-[#25F4EE] rounded-full animate-spin shadow-[0_0_15px_#25F4EE]"></div>
        <p className="text-[#25F4EE] font-black italic tracking-[0.3em] uppercase text-[10px] animate-pulse">INITIALIZING GATEWAY...</p>
      </div>
    );
  }

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
            <p className="text-[12px] text-white/50 uppercase tracking-widest leading-relaxed mb-10 text-center px-4 max-w-[90%] mx-auto text-wrap-balance">
              Identity Verification Required. Confirm your details to ensure anti-spam compliance before accessing the host gateway.
            </p>
            <div className="w-full space-y-6 text-left">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/30 ml-1 mb-2 block">FULL LEGAL NAME</label>
                <input required placeholder="Identity Name" value={captureForm.name} onChange={e=>setCaptureForm({...captureForm, name: e.target.value})} className="input-premium text-lg w-full font-medium text-white" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/30 ml-1 mb-2 block">MOBILE ID (EX: +1 999 999 9999)</label>
                <input required type="tel" placeholder="+1 999 999 9999" value={captureForm.phone} onChange={e=>setCaptureForm({...captureForm, phone: e.target.value})} className="input-premium text-lg w-full font-medium text-white" />
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

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans selection:bg-[#25F4EE] selection:text-black antialiased flex flex-col relative overflow-x-hidden font-black italic uppercase">
      <style>{`
        /* SHIELD PROTOCOL: ACTIVE. User Select is blocked to prevent copy. Right-click is allowed for browser translation. */
        body { 
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none; 
        }
        
        /* UNBLOCK INPUTS FOR MOBILE/DESKTOP */
        input, textarea, select, button { 
          -webkit-user-select: auto !important; 
          -khtml-user-select: auto !important; 
          -moz-user-select: auto !important; 
          -ms-user-select: auto !important; 
          user-select: auto !important; 
          pointer-events: auto !important;
          touch-action: auto !important;
          position: relative;
          z-index: 50;
        }

        /* COMMANDMENT 3: Global Typography — ZERO hyphenation across all containers */
        *, *::before, *::after { 
          hyphens: none !important; 
          -webkit-hyphens: none !important; 
          -ms-hyphens: none !important; 
          word-break: normal !important;
          overflow-wrap: normal !important;
        }
        p, span, h1, h2, h3, h4, h5, h6, div {
          text-wrap: balance;
        }

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
        .pro-lock-layer { absolute; inset: 0; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #25F4EE; border-radius: 10px; }
      `}</style>

      {/* MASTER GLOBAL NOTIFICATION BANNER */}
      {globalNotifications.length > 0 && (
         <div className="bg-[#FE2C55] text-black w-full text-center py-2 px-4 flex items-center justify-center gap-3 z-[300] relative">
            <BellRing size={16} className="animate-bounce shrink-0"/>
            <span className="text-[10px] sm:text-xs font-black tracking-widest">{globalNotifications[0].message}</span>
            <button onClick={() => setGlobalNotifications(prev => prev.slice(1))}><X size={14}/></button>
         </div>
      )}

      {/* --- FLOATING AI CHAT BUBBLE --- */}
      {!showSmartSupport && view !== 'capture' && view !== 'bridge' && (
        <button 
          onClick={() => setShowSmartSupport(true)}
          className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[800] bg-[#25F4EE] text-black p-4 sm:p-5 rounded-[1.5rem] shadow-[0_0_30px_rgba(37,244,238,0.5)] hover:scale-110 transition-transform flex items-center justify-center group animate-bounce hover:animate-none"
        >
          <MessageSquare size={28} className="sm:w-8 sm:h-8 group-hover:animate-pulse" />
          <span className="absolute -top-2 -right-2 bg-[#FE2C55] border-2 border-black w-4 h-4 rounded-full animate-ping"></span>
          <span className="absolute -top-2 -right-2 bg-[#FE2C55] border-2 border-black w-4 h-4 rounded-full"></span>
        </button>
      )}

      {/* --- TOP NAV --- */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[200] px-6 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3 cursor-pointer relative z-[210]" onClick={() => { setView('home'); setIsMenuOpen(false); }}>
          <div className="bg-[#25F4EE]/10 p-1.5 rounded-lg border border-[#25F4EE]/30"><Zap size={20} className="text-[#25F4EE] fill-[#25F4EE]" /></div>
          <span className="text-lg font-black tracking-tighter text-white mt-1">SMART SMS PRO</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[10px] tracking-widest relative z-[210]">
           {!user ? (
             <>
               <button onClick={() => { setIsWelcomeTrial(false); setIsLoginMode(true); setView('auth'); }} className="bg-transparent border-2 border-[#25F4EE] text-[#25F4EE] hover:bg-[#25F4EE]/10 px-6 py-2 rounded-xl text-[10px] tracking-widest font-black transition-all shadow-[0_0_15px_rgba(37,244,238,0.2)]">SECURE MEMBER PORTAL</button>
               <button onClick={() => { setIsWelcomeTrial(false); setIsLoginMode(false); setView('auth'); }} className="bg-gradient-to-r from-[#25F4EE] to-[#1AB5B0] text-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all shadow-[0_0_15px_rgba(37,244,238,0.4)] font-black">JOIN NETWORK</button>
             </>
           ) : (
             <>
               <span className="text-white/30 lowercase font-mono !not-italic">[{userProfile?.nickname || 'operador'}]</span>
               <button onClick={() => setView('dashboard')} className={`flex items-center gap-2 transition-colors ${view === 'dashboard' ? 'text-[#25F4EE]' : 'hover:text-[#25F4EE]'}`}><LayoutDashboard size={14}/> OPERATOR HUB</button>
               <button onClick={() => setShowSmartSupport(true)} className="flex items-center gap-2 hover:text-[#25F4EE] transition-colors"><Bot size={14}/> NEXUS AI SMART</button>
               <button onClick={() => signOut(auth).then(()=>setView('home'))} className="text-[#FE2C55] hover:opacity-70 transition-all flex items-center gap-2"><LogOut size={14}/> LOGOUT</button>
             </>
           )}
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-white/50 hover:text-white transition-all z-[210] relative">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* --- OMNI-MENU MOBILE --- */}
      <div className={`md:hidden fixed inset-0 z-[150] bg-[#010101]/95 backdrop-blur-3xl transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col pt-24 px-6 pb-12 overflow-y-auto ${isMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-8'}`}>
        <div className="flex flex-col gap-4 flex-1 mt-4">
          {user && <p className="text-center text-[#25F4EE] font-mono text-[10px] mb-4">ALIAS: {userProfile?.nickname}</p>}
          {!user ? (
            <>
              <button onClick={() => { setIsWelcomeTrial(false); setIsLoginMode(true); setView('auth'); setIsMenuOpen(false); }} className="bg-transparent border-2 border-[#25F4EE] text-[#25F4EE] hover:bg-[#25F4EE]/10 p-5 rounded-2xl text-[11px] tracking-[0.15em] font-black transition-all flex items-center justify-center gap-3 w-full shadow-[0_0_15px_rgba(37,244,238,0.2)]"><Lock size={18}/> SECURE MEMBER PORTAL</button>
              <button onClick={() => { setIsWelcomeTrial(false); setIsLoginMode(false); setView('auth'); setIsMenuOpen(false); }} className="bg-gradient-to-r from-[#25F4EE] to-[#1AB5B0] text-black p-5 rounded-2xl text-[11px] tracking-[0.15em] font-black shadow-[0_0_30px_rgba(37,244,238,0.4)] flex items-center justify-center gap-3 w-full"><Rocket size={18}/> JOIN NETWORK & START</button>
            </>
          ) : (
            <>
              <button onClick={() => { setView('dashboard'); setIsMenuOpen(false); }} className={`p-5 rounded-2xl border ${view === 'dashboard' ? 'bg-[#25F4EE]/10 border-[#25F4EE] text-[#25F4EE]' : 'bg-white/5 border-white/10 text-white hover:border-[#25F4EE]/50'} text-[11px] tracking-[0.15em] font-black transition-all flex items-center justify-center gap-3 w-full`}><LayoutDashboard size={18}/> ACCESS OPERATOR HUB</button>
              <button onClick={() => { setShowSmartSupport(true); setIsMenuOpen(false); }} className="p-5 rounded-2xl border bg-white/5 border-white/10 text-white hover:border-[#25F4EE]/50 text-[11px] tracking-[0.15em] font-black transition-all flex items-center justify-center gap-3 w-full"><Bot size={18}/> NEXUS AI SMART SUPPORT</button>
            </>
          )}
        </div>
        
        {/* MOBILE ONLY: LOGOUT POSITIONED AT BOTTOM */}
        {user && (
           <div className="mt-auto pt-8 border-t border-white/5">
              <button onClick={() => { signOut(auth).then(()=>{setView('home'); setIsMenuOpen(false);}) }} className="w-full p-5 rounded-2xl border bg-[#FE2C55]/10 border-[#FE2C55]/30 text-[#FE2C55] hover:bg-[#FE2C55]/20 text-[11px] tracking-[0.15em] font-black transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(254,44,85,0.1)]"><LogOut size={18}/> DISCONNECT SECURITY GATEWAY</button>
           </div>
        )}
      </div>

      {/* --- CONTENT HUB --- */}
      <div className="pt-28 flex-1 pb-10 relative z-[100]">
        <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#FE2C55] opacity-[0.03] blur-[150px] pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#25F4EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

        {/* ==================== HOME ==================== */}
        {view === 'home' && (
          <div className="w-full max-w-[540px] mx-auto px-4 z-10 relative text-center animate-in fade-in duration-300">
            <header className="mb-14 text-center flex flex-col items-center">
              <div className="lighthouse-neon-wrapper mb-4"><div className="lighthouse-neon-content px-10 py-4"><h1 className="text-3xl sm:text-4xl text-white text-glow-white">SMART SMS PRO</h1></div></div>
              <p className="text-[9px] sm:text-[10px] text-white/40 font-bold tracking-[0.3em] sm:tracking-[0.4em] text-center px-4 text-wrap-balance">HIGH-END REDIRECTION PROTOCOL - 60 FREE SECURE CONNECTIONS</p>
            </header>

            <main className="space-y-8 pb-20 text-left">
              {user && (
                <div className="flex justify-center mb-2 animate-in fade-in zoom-in duration-300">
                  <button onClick={() => setView('dashboard')} className="btn-strategic !bg-[#25F4EE] !text-black text-[11px] sm:text-xs w-full max-w-[420px] shadow-[0_0_30px_#25F4EE]"><LayoutDashboard size={24} /> ACCESS OPERATOR HUB</button>
                </div>
              )}

              <div className="lighthouse-neon-wrapper shadow-3xl mx-2 sm:mx-0">
                <div className="lighthouse-neon-content p-6 sm:p-12 text-left space-y-8">
                  <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"></div><h3 className="text-[10px] sm:text-[11px] tracking-widest text-white/60">SMART CONNECTION PROTOCOL</h3></div>
                  <div className="space-y-3">
                     <label className="text-[9px] sm:text-[10px] text-white/40 ml-1 tracking-widest block font-black">RECIPIENT (TARGET NUMBER) <span className="text-[#25F4EE] ml-2 opacity-50 text-[8px]">EX: +1 999 999 9999</span></label>
                     <input type="tel" value={genTo} onChange={e => setGenTo(e.target.value)} className="input-premium font-sans" placeholder="+1 999 999 9999" />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[9px] sm:text-[10px] text-white/40 ml-1 tracking-widest block font-black">HOST IDENTITY (NAME OR COMPANY)</label>
                     <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-premium text-sm font-sans" placeholder="Your Organization Name" />
                  </div>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center"><label className="text-[9px] sm:text-[10px] text-white/40 ml-1 tracking-widest block font-black">SMS MESSAGE PAYLOAD</label><span className="text-[8px] sm:text-[9px] text-white/20">{genMsg.length}/{MSG_LIMIT}</span></div>
                     <div className="flex items-center gap-2 font-black mb-2 mt-1">
                       <span className="text-amber-500"><ShieldAlert size={10}/></span>
                       <span className="text-[7px] sm:text-[8px] text-amber-500 tracking-widest uppercase">⚠️ ZERO TOLERANCE POLICY MONITORING ACTIVE</span>
                     </div>
                     <div className="relative">
                        <textarea value={genMsg} onChange={e => setGenMsg(e.target.value)} rows="3" className={`input-premium w-full text-sm font-sans ${isGenMsgForbidden ? '!text-[#FE2C55] !border-[#FE2C55] shadow-[0_0_15px_rgba(254,44,85,0.3)]' : ''}`} placeholder="Draft your pre-defined payload here to receive via SMS 📲" />
                        <button onClick={()=>setShowInstructions(!showInstructions)} className="absolute right-3 bottom-4 p-2 bg-[#25F4EE]/10 rounded-lg text-[#25F4EE] hover:bg-[#25F4EE]/20 transition-all"><HelpCircle size={16}/></button>
                     </div>
                     {isGenMsgForbidden && <p className="text-[10px] text-[#FE2C55] mt-2 font-black tracking-widest animate-pulse text-center">⚠️ ZERO TOLERANCE POLICY: PROHIBITED WORDS DETECTED. PLEASE CORRECT.</p>}
                  </div>
                  
                  {showInstructions && (
                    <div className="p-6 bg-white/[0.03] border border-[#25F4EE]/20 rounded-2xl animate-in slide-in-from-top-2">
                       <h5 className="text-[10px] sm:text-[11px] text-[#25F4EE] mb-3 text-center">STRATEGIC DEPLOYMENT GUIDE:</h5>
                       <ul className="text-[9px] sm:text-[10px] text-white/40 space-y-3 leading-relaxed text-center">
                          <li>● Copy and embed your Secure Link into social media bios, ad buttons, or direct chats.</li>
                          <li>● The gateway securely captures incoming lead data before routing them to your SMS terminal.</li>
                          <li>● The SMS Payload is automatically preloaded on the lead's device to accelerate immediate conversions.</li>
                       </ul>
                    </div>
                  )}

                  <button onClick={handleGenerate} disabled={loading || isGenMsgForbidden} className={`btn-strategic ${isGenMsgForbidden ? '!bg-white/10 !text-white/30 cursor-not-allowed' : '!bg-[#25F4EE] !text-black'} text-[11px] py-5 w-full shadow-[0_0_20px_rgba(37,244,238,0.4)]`}>
                    {isGenMsgForbidden ? 'SYSTEM STANDBY' : 'GENERATE SECURE LINK'} {isGenMsgForbidden ? '' : <ChevronRight size={18} />}
                  </button>
                </div>
              </div>

              {generatedLink && (
                <div className="animate-in zoom-in-95 duration-300 space-y-6 px-2 sm:px-0">
                  <div className="bg-[#0a0a0a] border border-[#25F4EE]/20 rounded-[2.5rem] p-8 sm:p-10 text-center shadow-2xl">
                    <div className="bg-white p-5 sm:p-6 rounded-3xl inline-block mb-8 sm:mb-10 shadow-xl"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(generatedLink)}&color=000000`} className="w-28 h-28 sm:w-32 sm:h-32" alt="QR Code"/></div>
                    <input readOnly value={generatedLink} onClick={e=>e.target.select()} className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-[10px] sm:text-[11px] text-[#25F4EE] font-mono text-center outline-none mb-8 border-dashed font-medium !text-transform-none truncate" />
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full">
                      <button onClick={() => {navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="flex flex-col items-center py-5 sm:py-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">{copied ? <Check size={24} className="text-[#25F4EE]" /> : <Copy size={24} className="text-white/40" />}<span className="text-[9px] sm:text-[10px] mt-2 text-white/50 tracking-widest text-center font-black">QUICK COPY</span></button>
                      <button onClick={() => window.open(generatedLink, '_blank')} className="flex flex-col items-center py-5 sm:py-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"><ExternalLink size={24} className="text-white/40" /><span className="text-[9px] sm:text-[10px] mt-1 text-white/50 tracking-widest text-center font-black">LIVE TEST</span></button>
                    </div>
                  </div>
                </div>
              )}

              {!user && (
                <div className="flex flex-col items-center gap-4 sm:gap-6 mt-8 w-full animate-in zoom-in-95 duration-300 pb-10 text-center px-2 sm:px-0">
                  <button onClick={() => {setIsWelcomeTrial(true); setIsLoginMode(false); setView('auth')}} className="btn-strategic !bg-white !text-black text-[10px] sm:text-xs w-full max-w-[420px] group py-5 sm:py-6 shadow-xl"><Rocket size={20} className="group-hover:animate-bounce sm:w-6 sm:h-6" /> START 60 FREE SECURE CONNECTIONS</button>
                  <button onClick={() => {setIsWelcomeTrial(false); setIsLoginMode(false); setView('auth'); setTimeout(() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'}), 300);}} className="btn-strategic !bg-[#25F4EE] !text-black text-[10px] sm:text-xs w-full max-w-[420px] group py-5 sm:py-6 shadow-[0_0_20px_#25F4EE]"><Star size={20} className="animate-pulse sm:w-6 sm:h-6" /> UPGRADE TO ELITE MEMBER</button>
                </div>
              )}

              <div className="pt-20 pb-12 text-left px-4 sm:px-0">
                 <div className="flex items-center gap-3 mb-10 sm:mb-12"><HelpCircle size={24} className="text-[#FE2C55] sm:w-7 sm:h-7"/><h3 className="text-2xl sm:text-3xl text-white tracking-widest">PROTOCOL FAQ</h3></div>
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
          <div className="w-full max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 animate-in fade-in duration-300">
            
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-10 sm:mb-12 text-left">
              <div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] text-white">OPERATOR HUB</h2>
                <div className="flex flex-wrap items-center gap-3 mt-4">
                   <span className={`text-[9px] sm:text-[10px] px-4 py-1.5 rounded-full border tracking-widest ${isMaster ? 'bg-[#25F4EE]/10 border-[#25F4EE] text-[#25F4EE] shadow-[0_0_15px_rgba(37,244,238,0.3)] animate-pulse font-black' : 'bg-white/5 border-white/10 text-white/40 font-black'}`}>
                      {isMaster ? <span className="flex items-center gap-2"><Crown size={12} className="mb-0.5" /> MASTER IDENTITY</span> : `${String(userProfile?.tier || 'FREE')} IDENTITY`}
                   </span>
                   {isPro && <span className="text-[8px] sm:text-[9px] text-amber-500 tracking-widest animate-pulse font-black">● LIVE PROTOCOL ACTIVE</span>}
                </div>
              </div>
              <div className="flex items-stretch gap-3 sm:gap-4 flex-wrap text-center">
                 <button onClick={() => setView('home')} className="flex-1 lg:flex-none items-center justify-center gap-2 bg-[#25F4EE]/10 border border-[#25F4EE]/30 px-4 sm:px-6 py-4 rounded-xl hover:bg-[#25F4EE]/20 transition-colors text-[9px] sm:text-[10px] text-[#25F4EE] flex font-black">
                    <Zap size={14} className="fill-[#25F4EE]"/> LINK GENERATOR
                 </button>
                 <div className="bg-[#0a0a0a] border border-white/10 px-4 sm:px-8 py-3 rounded-xl sm:rounded-[1.5rem] shadow-3xl flex-1 lg:flex-none">
                    <p className="text-[7px] sm:text-[8px] text-white/30 mb-1 sm:mb-2 tracking-widest font-black">ACTIVE NODES</p>
                    <div className="flex items-center justify-center gap-2"><button onClick={() => setConnectedChips(prev => Math.max(1, prev - 1))} className="text-white/30 hover:text-white p-1">-</button><span className="text-lg sm:text-xl text-[#25F4EE]">{connectedChips}</span><button onClick={() => setConnectedChips(prev => prev + 1)} className="text-white/30 hover:text-white p-1">+</button></div>
                 </div>
                 <div className="bg-[#0a0a0a] border border-white/10 px-4 sm:px-8 py-3 rounded-xl sm:rounded-[1.5rem] shadow-3xl border-b-2 border-b-[#25F4EE] flex-1 lg:flex-none">
                    <p className="text-[7px] sm:text-[8px] text-white/30 mb-1 sm:mb-2 tracking-widest font-black">PRO PACKETS</p>
                    <p className="text-xl sm:text-2xl text-white font-black">{isPro && !['FREE_TRIAL'].includes(userProfile?.tier) ? '∞' : String(userProfile?.smsCredits || 0)}</p>
                 </div>
              </div>
            </div>

            {/* MASTER ONLY: GLOBAL BROADCAST COMPONENT */}
            {isMaster && (
                <div className="bg-[#0a0a0a] border border-amber-500/30 p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] shadow-[0_0_30px_rgba(245,158,11,0.1)] flex flex-col relative overflow-hidden mb-8">
                  <h3 className="text-lg sm:text-xl text-white mb-4 flex items-center gap-3 font-black"><BellRing className="text-amber-500 animate-pulse" size={18} /> GLOBAL PLATFORM BROADCAST</h3>
                  <form onSubmit={handleBroadcastPush} className="flex gap-4 flex-col sm:flex-row items-stretch sm:items-center">
                    <input type="text" value={broadcastMsg} onChange={e=>setBroadcastMsg(e.target.value)} placeholder="Enter push notification for all users..." className="input-premium flex-1 font-sans !text-transform-none" />
                    <button type="submit" disabled={loading} className="shrink-0 h-fit bg-amber-500 text-black font-black text-[10px] tracking-widest px-8 py-[1.1rem] rounded-xl hover:bg-amber-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] disabled:opacity-50 flex items-center justify-center gap-2">
                      <Send size={14}/> DEPLOY
                    </button>
                  </form>
                </div>
            )}

            {/* MÓDULO DE ESTATÍSTICAS COM COUNTER EM TEMPO REAL */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
              {[
                { label: "SMS TRANSMISSIONS", value: isMaster ? "∞" : (userProfile?.dailySent || 0), icon: Send, color: "text-[#25F4EE]" },
                { label: "DELIVERY RATE", value: "99.8%", icon: ShieldCheck, color: "text-[#10B981]" },
                { label: "ACTIVE CONTACTS", value: isMaster ? subscribersList.reduce((acc, sub) => acc + sub.leads.length, 0) : logs.length, icon: Users, color: "text-amber-500" },
                { label: "REMAINING CREDITS", value: isPro && !['FREE_TRIAL'].includes(userProfile?.tier) ? "UNLIMITED" : String(userProfile?.smsCredits || 0), icon: Smartphone, color: "text-white" },
              ].map((stat, idx) => (
                <div key={idx} className="bg-[#0a0a0a] p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-white/10 shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:border-[#25F4EE]/50 transition-all cursor-default">
                  <div className={`bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 ${stat.color}`}>
                    <stat.icon size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[9px] text-white/40 tracking-widest mb-1 line-clamp-1 font-black">{stat.label}</p>
                    <h3 className="text-lg sm:text-2xl text-white font-black">{stat.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* CONTEÚDO PRINCIPAL DASHBOARD */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
              
              <div className="lg:col-span-1 space-y-6 sm:space-y-8 flex flex-col">
                <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] shadow-2xl flex flex-col relative overflow-hidden flex-1">
                  <h3 className="text-lg sm:text-xl text-white mb-6 flex items-center gap-3 font-black"><Zap className="text-[#25F4EE]" size={18} /> INSTANT PAYLOAD DISPATCH</h3>
                  <form onSubmit={handleQuickSend} className="space-y-4 sm:space-y-5 flex flex-col flex-1">
                    <div>
                      <label className="block text-[9px] sm:text-[10px] text-white/40 tracking-widest mb-2 font-black">RECIPIENT (TARGET NUMBER)</label>
                      <input type="tel" value={genTo} onChange={e=>setGenTo(e.target.value)} placeholder="+1 000 000 0000" className="input-premium text-sm font-sans !text-transform-none" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <label className="block text-[9px] sm:text-[10px] text-white/40 tracking-widest mb-2 font-black">SMS MESSAGE PAYLOAD (PRE-DEFINED TRANSMISSION MESSAGE)</label>
                      <textarea rows="4" value={genMsg} onChange={e=>setGenMsg(e.target.value)} placeholder="Draft your SMS here..." className="input-premium flex-1 text-sm font-sans !text-transform-none resize-none"></textarea>
                    </div>
                    <button type="submit" disabled={loading} className="btn-strategic !bg-[#25F4EE] !text-black text-[10px] sm:text-[11px] w-full mt-4 py-4 sm:py-5 shadow-[0_0_15px_rgba(37,244,238,0.2)] font-black">
                      <Send size={16} className="mr-2" /> SEND NOW
                    </button>
                  </form>
                </div>

                <div className={`bg-[#0a0a0a] border border-white/10 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden ${!isPro ? 'pro-obscure' : ''}`}>
                   <div className={`flex items-center justify-between w-full relative z-10`}>
                      <div><h3 className="text-lg sm:text-xl text-white mb-2 flex items-center gap-2 font-black"><UploadCloud size={18} className="text-[#25F4EE]"/> MASS INGESTION HUB {!isPro && <Lock size={14} className="text-[#FE2C55]" />}</h3><p className="text-[8px] sm:text-[9px] text-white/40 tracking-widest font-black">IMPORT 5K UNITS.</p></div>
                      {isPro && <button onClick={() => fileInputRef.current.click()} className="p-3 sm:p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl sm:rounded-2xl text-[#25F4EE] transition-all flex items-center justify-center">{loading ? <RefreshCw size={18} className="animate-spin"/> : <Plus size={18} />}</button>}
                   </div>
                   {!isPro && (
                     <div className="pro-lock-layer p-4">
                        <p className="text-[#FE2C55] tracking-widest text-[8px] sm:text-[9px] mb-2 animate-pulse font-black"><Lock size={10} className="inline mr-1"/> PRO LOCKED</p>
                        <button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="bg-white/10 text-white border border-white/20 text-[7px] sm:text-[8px] px-4 sm:px-6 py-2 rounded-lg whitespace-nowrap font-black">UNLOCK</button>
                     </div>
                   )}
                   <input type="file" accept=".txt" onChange={handleBulkImport} ref={fileInputRef} className="hidden" />
                </div>
              </div>

              {/* DASHBOARD DE REGISTROS (CRM MASTER ADMIN / OPERATOR VIEW) */}
              <div className="lg:col-span-2 bg-[#0a0a0a] rounded-3xl sm:rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden flex flex-col h-full min-h-[400px] sm:min-h-[500px]">
                 <div className="p-6 sm:p-8 border-b border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#111]">
                    <div className="flex items-center gap-3">
                       {isMaster ? <Database size={18} className="text-amber-500 sm:w-5 sm:h-5" /> : <History size={18} className="text-[#25F4EE] sm:w-5 sm:h-5" />}
                       <h3 className="text-lg sm:text-xl text-white tracking-tight leading-tight font-black">{isMaster ? 'PREMIUM CRM & NETWORK MAP' : 'RECENT ACTIVITY LOGS'}</h3>
                    </div>
                 </div>
                 
                 <div className="flex-1 overflow-x-auto custom-scrollbar bg-black/40">
                   {isMaster ? (
                     <table className="w-full text-left font-sans font-medium !text-transform-none min-w-[650px]">
                       <thead className="bg-[#111] sticky top-0 z-10 uppercase border-b border-white/5">
                         <tr>
                           <th className="px-6 sm:px-8 py-4 sm:py-5 text-[9px] sm:text-[10px] text-white/50 tracking-widest font-black">SUBSCRIBER ALIAS (NICKNAME)</th>
                           <th className="px-6 sm:px-8 py-4 sm:py-5 text-[9px] sm:text-[10px] text-white/50 tracking-widest text-center font-black">CAPTURED LEADS</th>
                           <th className="px-6 sm:px-8 py-4 sm:py-5 text-[9px] sm:text-[10px] text-white/50 tracking-widest text-right font-black">MASTER FOLDER STATUS</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                         {subscribersList.map(sub => (
                            <React.Fragment key={sub.id}>
                                <tr onClick={() => setExpandedAdminRow(expandedAdminRow === sub.id ? null : sub.id)} className={`hover:bg-white/[0.02] transition-colors cursor-pointer group ${expandedAdminRow === sub.id ? 'bg-white/[0.03]' : ''}`}>
                                   <td className="px-6 sm:px-8 py-4 sm:py-6">
                                      <div className="flex items-center gap-3">
                                          {expandedAdminRow === sub.id ? <ChevronDown size={16} className="text-[#25F4EE]" /> : <ChevronRightSquare size={16} className="text-white/30 group-hover:text-white/60" />}
                                          <div>
                                              <p className="text-xs sm:text-sm text-[#25F4EE] tracking-wider font-black">{String(sub.nickname).toUpperCase()}</p>
                                              <p className="text-[9px] sm:text-[10px] text-white/40 tracking-widest font-mono mt-1">{sub.email} | {sub.tier}</p>
                                          </div>
                                      </div>
                                   </td>
                                   <td className="px-6 sm:px-8 py-4 sm:py-6 text-center text-xs sm:text-sm text-white font-black">
                                       <span className={`bg-white/5 px-4 py-1.5 rounded-lg border border-white/10 ${sub.id === 'AI_SMART_CHAT' ? 'text-amber-500 border-amber-500/30' : ''}`}>{sub.leads.length} BASE</span>
                                   </td>
                                   <td className="px-6 sm:px-8 py-4 sm:py-6 flex justify-end gap-2 sm:gap-3 mt-1 sm:mt-2">
                                      <span className="text-[9px] sm:text-[10px] text-white/30 font-black tracking-widest">{expandedAdminRow === sub.id ? 'CLOSING VIEW' : 'EXPAND BASE VIEW'}</span>
                                   </td>
                                </tr>
                                {expandedAdminRow === sub.id && (
                                    <tr>
                                        <td colSpan="3" className="p-0 border-b border-white/5">
                                            <div className={`bg-black border-l-4 p-6 animate-in slide-in-from-top-2 ${sub.id === 'AI_SMART_CHAT' ? 'border-amber-500' : 'border-[#25F4EE]'}`}>
                                                {sub.leads.length > 0 ? (
                                                    <table className="w-full text-left font-sans font-medium !text-transform-none">
                                                       <thead className="text-[8px] text-white/30 uppercase tracking-widest border-b border-white/5">
                                                           <tr>
                                                               <th className="pb-3 px-4 font-black">TARGET NUMBER</th>
                                                               <th className="pb-3 px-4 font-black">IDENTITY</th>
                                                               <th className="pb-3 px-4 font-black">FOLDER</th>
                                                               <th className="pb-3 px-4 text-right font-black">ACTIONS (CRM)</th>
                                                           </tr>
                                                       </thead>
                                                       <tbody className="divide-y divide-white/5">
                                                           {sub.leads.map(l => (
                                                              <tr key={l.id} className="hover:bg-white/5 group">
                                                                 <td className={`py-3 px-4 text-xs font-mono ${sub.id === 'AI_SMART_CHAT' ? 'text-amber-500' : 'text-[#25F4EE]'}`}>{l.telefone_cliente}</td>
                                                                 <td className="py-3 px-4 text-xs text-white">{l.nome_cliente} {sub.id === 'AI_SMART_CHAT' && <span className="ml-2 text-[8px] tracking-widest text-black bg-amber-500 px-2 py-0.5 rounded-sm">NEXUS AGENT</span>}</td>
                                                                 <td className="py-3 px-4 text-xs">
                                                                    <select
                                                                      defaultValue={l.folderId || 'MANUAL'}
                                                                      onChange={e => handleAdminAssignFolder(l.id, e.target.value)}
                                                                      onClick={e => e.stopPropagation()}
                                                                      className="bg-[#111] border border-white/10 text-white/50 text-[8px] px-2 py-1 rounded-lg outline-none font-black tracking-widest appearance-none cursor-pointer hover:border-[#25F4EE]/30 transition-colors"
                                                                    >
                                                                      {folders.map(f => (
                                                                        <option key={f.id} value={f.id} className="bg-[#111]">{f.label}</option>
                                                                      ))}
                                                                    </select>
                                                                 </td>
                                                                 <td className="py-3 px-4 text-xs text-right">
                                                                    <div className="flex items-center justify-end gap-3">
                                                                      <button onClick={(e)=>{e.stopPropagation(); handleAdminGrantTier(e, sub.id, 'ACTIVATION_9_USD')}} title="Grant Nexus Routing Pro ($9)" className="text-[#25F4EE] hover:text-white p-1.5 rounded-md transition-all"><Gift size={15}/></button>
                                                                      <button onClick={(e)=>{e.stopPropagation(); handleAdminGrantTier(e, sub.id, 'PRO_SUBSCRIPTION_19_USD')}} title="Grant Nexus Automation Engine ($19.90)" className="text-amber-500 hover:text-white p-1.5 rounded-md transition-all"><Rocket size={15}/></button>
                                                                      <div className="w-px h-4 bg-white/20 mx-1"></div>
                                                                      <button onClick={(e)=>{e.stopPropagation(); setEditLeadModal({id: l.id, nome_cliente: l.nome_cliente, telefone_cliente: l.telefone_cliente, folderId: l.folderId || 'MANUAL'})}} title="Edit Lead Data" className="text-white/30 hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-all"><Edit size={14}/></button>
                                                                      <button onClick={(e)=>{e.stopPropagation(); handleAdminDeleteLead(l.id)}} title="Purge Lead" className="text-white/30 hover:text-[#FE2C55] opacity-0 group-hover:opacity-100 transition-all"><Trash size={14}/></button>
                                                                    </div>
                                                                 </td>
                                                              </tr>
                                                           ))}
                                                       </tbody>
                                                    </table>
                                                ) : (
                                                    <p className="text-[10px] text-white/30 tracking-widest text-center py-4 font-black text-wrap-balance">NO LEADS CAPTURED BY THIS GATEWAY YET.</p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                         ))}
                       </tbody>
                     </table>
                   ) : (
                     <>
                       {logs.length > 0 ? (
                         <table className="w-full text-left font-sans font-medium !text-transform-none min-w-[500px]">
                           <thead className="bg-[#111] sticky top-0 z-10 uppercase border-b border-white/5">
                             <tr>
                               <th className="px-6 sm:px-8 py-4 sm:py-5 text-[9px] sm:text-[10px] text-white/50 tracking-widest font-black">RECIPIENT (TARGET NUMBER)</th>
                               <th className="px-6 sm:px-8 py-4 sm:py-5 text-[9px] sm:text-[10px] text-white/50 tracking-widest font-black">HOST IDENTITY</th>
                               <th className="px-6 sm:px-8 py-4 sm:py-5 text-[9px] sm:text-[10px] text-white/50 tracking-widest font-black">STATUS</th>
                               <th className="px-6 sm:px-8 py-4 sm:py-5 text-[9px] sm:text-[10px] text-white/50 tracking-widest text-right font-black">TIMESTAMP</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5">
                             {logs.map(l => (
                               <tr key={l.id} className="hover:bg-white/[0.02] transition-colors group">
                                 <td className="px-6 sm:px-8 py-4 sm:py-6 text-xs sm:text-sm text-[#25F4EE] tracking-wider whitespace-nowrap font-mono">{maskData(l.telefone_cliente, 'phone')}</td>
                                 <td className="px-6 sm:px-8 py-4 sm:py-6">
                                   <div className="flex items-center gap-2 sm:gap-3">
                                     <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/50 group-hover:border-[#25F4EE]/30 group-hover:text-[#25F4EE] transition-all">
                                       <UserCheck size={12} className="sm:w-3.5 sm:h-3.5" />
                                     </div>
                                     <span className="text-white text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[150px]">{maskData(l.nome_cliente, 'name')}</span>
                                   </div>
                                 </td>
                                 <td className="px-6 sm:px-8 py-4 sm:py-6 whitespace-nowrap">
                                    {isPro ? (
                                      <span className="flex items-center gap-1.5 text-[8px] sm:text-[9px] uppercase px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full w-fit bg-[#25F4EE]/10 text-[#25F4EE] border border-[#25F4EE]/30 font-black italic"><CheckCircle2 size={10} className="sm:w-3 sm:h-3" /> DECRYPTED GATEWAY</span>
                                    ) : (
                                      <button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-1.5 text-[8px] sm:text-[9px] uppercase px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full w-fit bg-[#FE2C55]/10 text-[#FE2C55] border border-[#FE2C55]/30 font-black italic hover:bg-[#FE2C55]/20 hover:scale-105 transition-all cursor-pointer shadow-[0_0_15px_rgba(254,44,85,0.3)]"><Lock size={10} className="sm:w-3 sm:h-3" /> UNLOCK TO REVEAL</button>
                                    )}
                                 </td>
                                 <td className="px-6 sm:px-8 py-4 sm:py-6 text-right text-[10px] sm:text-xs font-mono text-[#25F4EE] whitespace-nowrap">
                                    {(l.timestamp && typeof l.timestamp.toDate === 'function') ? l.timestamp.toDate().toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute:'2-digit' }) : 'Syncing...'}
                                 </td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       ) : (
                         <div className="flex flex-col items-center justify-center h-full p-10 sm:p-20 opacity-20 text-center"><Lock size={40} className="sm:w-12 sm:h-12 mb-4 text-white" /><p className="text-[10px] sm:text-[11px] tracking-widest font-black">VAULT STANDBY</p><p className="text-[8px] sm:text-[9px] mt-2 font-sans font-medium !text-transform-none text-wrap-balance">NO ACTIVE INTERCEPTIONS.</p></div>
                       )}
                     </>
                   )}
                 </div>
                 {!isPro && !isMaster && logs.length > 0 && (
                   <div className="p-6 sm:p-8 bg-gradient-to-t from-[#FE2C55]/10 to-transparent border-t border-[#FE2C55]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-[9px] sm:text-[10px] text-[#FE2C55] tracking-widest flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto font-black"><Lock size={12}/> REVEAL FULL IDENTITIES IN VAULT</p>
                      <button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="bg-[#FE2C55] text-white text-[8px] sm:text-[9px] px-6 sm:px-8 py-3 rounded-xl shadow-[0_0_15px_rgba(254,44,85,0.4)] w-full sm:w-auto font-black">UPGRADE TO ELITE</button>
                   </div>
                 )}
              </div>
            </div>

            {/* ---> AI AGENT MODULE WITH STAGING AREA <--- */}
            <div className={`bg-[#0a0a0a] border ${isAiObjectiveForbidden ? 'border-[#FE2C55] shadow-[0_0_30px_rgba(254,44,85,0.2)]' : 'border-white/10'} rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-2xl mb-8 relative overflow-hidden transition-all ${!isPro ? 'pro-obscure' : ''}`}>
              <div className={`flex flex-col text-left`}>
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4 text-left">
                      <div className={`p-2.5 sm:p-3 rounded-xl border ${isAiObjectiveForbidden ? 'bg-[#FE2C55]/10 border-[#FE2C55]/30' : 'bg-white/5 border-white/10'}`}>
                        {isAiObjectiveForbidden ? <AlertOctagon size={20} className="sm:w-6 sm:h-6 text-[#FE2C55]" /> : <BrainCircuit size={20} className="sm:w-6 sm:h-6 text-[#25F4EE]" />}
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl text-white tracking-tight leading-tight font-black">NEXUS SMART SHUFFLE ENGINE {!isPro && <Lock size={16} className="sm:w-[18px] sm:h-[18px] text-[#FE2C55] inline ml-1 sm:ml-2" />}</h3>
                        <p className="text-[8px] sm:text-[9px] text-white/40 tracking-widest mt-1 sm:mt-2 font-black text-balance">AUTOMATED LINGUISTIC SCRAMBLING TO OBLITERATE CARRIER FILTER BLOCKS.</p>
                      </div>
                    </div>
                    <button onClick={() => setShowHelpModal(true)} className="flex items-center justify-center gap-2 bg-[#25F4EE]/10 text-[#25F4EE] px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-[9px] sm:text-[10px] font-black hover:bg-[#25F4EE]/20 transition-all border border-[#25F4EE]/30 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                      <Info size={14} className="sm:w-4 sm:h-4"/> SETUP GUIDE & DOWNLOAD
                    </button>
                 </div>

                 {/* VARIATION STAGING AREA (REVIEW MODE) */}
                 {isReviewMode ? (
                   <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                           <SlidersHorizontal size={18} className="sm:w-5 sm:h-5 text-amber-500" />
                           <h4 className="text-base sm:text-lg text-white font-black">PAYLOAD REVIEW ENGINE</h4>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-white/50 tracking-widest font-black">{stagedQueue.length} VARIATIONS PENDING</p>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto custom-scrollbar pr-1 sm:pr-2 mb-4 sm:mb-6">
                        {stagedQueue.map((task, idx) => (
                           <div key={task.id || idx} className={`bg-[#111] border border-white/5 rounded-xl p-4 sm:p-5 transition-colors flex flex-col h-[130px] sm:h-[150px] ${isDispatching && idx === 0 ? 'border-[#25F4EE] shadow-[0_0_15px_rgba(37,244,238,0.3)] animate-pulse' : 'hover:border-[#25F4EE]/30 group'}`}>
                              <div className="flex justify-between items-center mb-2 sm:mb-3">
                                <span className="text-[#25F4EE] text-[8px] sm:text-[9px] font-black tracking-widest uppercase">VARIATION {sessionSentCount + idx + 1}</span>
                                <span className="text-white/30 text-[8px] sm:text-[9px] font-mono truncate max-w-[80px] sm:max-w-[100px]">{maskData(task.telefone_cliente, 'phone')}</span>
                              </div>
                              <textarea 
                                disabled={isDispatching}
                                value={task.optimizedMsg} 
                                onChange={(e) => handleEditStagedMsg(idx, e.target.value)} 
                                className="w-full flex-1 bg-black/50 border border-white/5 rounded-lg p-2.5 sm:p-3 text-[10px] sm:text-xs text-white/80 resize-none font-sans !text-transform-none focus:border-[#25F4EE]/50 outline-none disabled:opacity-50 custom-scrollbar text-balance" 
                              />
                           </div>
                        ))}
                     </div>

                     {/* RODAPÉ DO STAGING: DISPATCH COM AVISO LIVE */}
                     <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mt-2 bg-[#111] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-white/5 shadow-inner">
                        <div className="flex items-center justify-between sm:justify-start gap-3 px-1 sm:px-2 w-full lg:w-auto border-b sm:border-b-0 border-white/5 pb-3 sm:pb-0">
                           <div className="flex items-center gap-2 sm:gap-3">
                              <Clock size={16} className="sm:w-5 sm:h-5 text-[#10B981] animate-pulse" />
                              <span className="text-[9px] sm:text-[10px] text-white/50 tracking-widest font-black uppercase mt-0.5 whitespace-nowrap">DISPATCH PACING:</span>
                           </div>
                           <select disabled={isDispatching} value={sendDelay} onChange={e => setSendDelay(Number(e.target.value))} className="bg-transparent text-[#10B981] text-[10px] sm:text-[12px] font-black outline-none cursor-pointer border-b border-[#10B981]/30 pb-0.5 sm:pb-1 appearance-none text-right sm:text-left">
                              <option value={15} className="bg-[#0a0a0a] text-white">15 SECONDS</option>
                              <option value={20} className="bg-[#0a0a0a] text-white">20 SECONDS</option>
                              <option value={30} className="bg-[#0a0a0a] text-white">30 SECONDS</option>
                              <option value={45} className="bg-[#0a0a0a] text-white">45 SECONDS</option>
                              <option value={120} className="bg-[#0a0a0a] text-white">120 SECONDS</option>
                              <option value={160} className="bg-[#0a0a0a] text-white">160 SECONDS</option>
                              <option value={180} className="bg-[#0a0a0a] text-white">180 SECONDS</option>
                           </select>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto">
                           <button disabled={isDispatching} onClick={() => {setStagedQueue([]); setIsReviewMode(false); setSessionSentCount(0); setSessionTotal(0);}} className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white/5 text-white/50 hover:text-white rounded-xl text-[9px] sm:text-[10px] font-black tracking-widest transition-colors w-full sm:w-auto disabled:opacity-30">CANCEL</button>
                           <button disabled={isDispatching} onClick={dispatchToNode} className={`px-6 sm:px-10 py-3 sm:py-3.5 text-black font-black text-[10px] sm:text-[11px] rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 w-full sm:w-auto ${isDispatching ? 'bg-[#25F4EE] shadow-[0_0
