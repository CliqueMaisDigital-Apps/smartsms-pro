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
const FORBIDDEN_WORDS_REGEX = /(hack|h4ck|scam|sc4m|fraud|fr4ud|phishing|ph1shing|hate|racism|murder|porn|p0rn|malware|virus|golpe|ódio|odio|spam|sp4m|illegal|ilegal|extortion|exploit|ddos|botnet|ransomware|piracy|stolen|hijack|puta|caralho|merda|porra|foda|cacete|bitch|fuck|shit|asshole|idiota|imbecil|burro|scumbag|cunt|vagabundo|desgra[çc]ado|desgra[çc]a|miser[áa]vel|safado|lixo|trouxa)/i;

const checkForbiddenWords = (text) => {
  if (!text) return false;
  return FORBIDDEN_WORDS_REGEX.test(text);
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
  const [isChatBanned, setIsChatBanned] = useState(false);
  const chatEndRef = useRef(null);
  const latestMessageRef = useRef(null);

  // --- ZERO TOLERANCE COMPUTED STATES ---
  const isGenMsgForbidden = checkForbiddenWords(genMsg);
  const isAiObjectiveForbidden = checkForbiddenWords(aiObjective);
  const isChatForbidden = checkForbiddenWords(chatInput);

  // --- SECURE QR HANDSHAKE TOKEN GENERATOR ---
  const [syncToken, setSyncToken] = useState('');
  const [syncTokenExpiry, setSyncTokenExpiry] = useState(0);

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
  };{/* VARIATION STAGING AREA (REVIEW MODE) */}
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
                           <button disabled={isDispatching} onClick={dispatchToNode} className={`px-6 sm:px-10 py-3 sm:py-3.5 text-black font-black text-[10px] sm:text-[11px] rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 w-full sm:w-auto ${isDispatching ? 'bg-[#25F4EE] shadow-[0_0_30px_rgba(37,244,238,0.5)]' : 'bg-amber-500'}`}>
                              {isDispatching ? <><RefreshCw size={14} className="sm:w-4 sm:h-4 animate-spin" /> <span className="truncate">TRANSMITTING: {sessionSentCount} / {sessionTotal} SENT...</span></> : <><Send size={14} className="sm:w-4 sm:h-4" /> CONFIRM & DISPATCH</>}
                           </button>
                        </div>
                     </div>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 text-left">
                      <div className="space-y-4 flex flex-col">
                         <div className="flex items-center justify-between gap-3 bg-black/40 border border-white/5 p-3 rounded-xl sm:rounded-2xl mb-2 flex-wrap">
                           <div className="flex items-center gap-3">
                             <Clock size={18} className="sm:w-5 sm:h-5 text-[#10B981]" />
                             <div>
                               <p className="text-[8px] sm:text-[9px] text-white/50 tracking-widest font-black uppercase mb-1">DISPATCH DELAY</p>
                               <select disabled={!isPro} value={sendDelay} onChange={e => setSendDelay(Number(e.target.value))} className="bg-transparent text-[#10B981] text-[10px] sm:text-[11px] font-black outline-none cursor-pointer w-full appearance-none">
                                  <option value={15} className="bg-[#0a0a0a]">15 SECONDS</option>
                                  <option value={30} className="bg-[#0a0a0a]">30 SECONDS</option>
                                  <option value={60} className="bg-[#0a0a0a]">60 SECONDS</option>
                               </select>
                             </div>
                           </div>
                           <div className="border-l border-white/10 pl-3">
                             <p className="text-[8px] sm:text-[9px] text-white/50 tracking-widest font-black uppercase mb-1">TARGET BATCH FOLDER</p>
                             <div className="flex items-center gap-2">
                               <select disabled={!isPro} value={selectedFolder} onChange={e => setSelectedFolder(e.target.value)} className="bg-transparent text-amber-500 text-[10px] sm:text-[11px] font-black outline-none cursor-pointer w-full appearance-none">
                                  {folders.map(f => (
                                    <option key={f.id} value={f.id} className="bg-[#0a0a0a]">{f.label}</option>
                                  ))}
                               </select>
                               {isMaster && (
                                 <button onClick={() => setCreateFolderModal(true)} title="Create new folder" className="text-[#25F4EE]/50 hover:text-[#25F4EE] transition-colors shrink-0"><Plus size={13}/></button>
                               )}
                             </div>
                           </div>
                         </div>

                         <div className="flex items-center gap-2 font-black pt-2">
                           <span className="text-amber-500"><ShieldAlert size={14}/></span>
                           <span className="text-[8px] sm:text-[9px] text-amber-500 tracking-widest uppercase">⚠️ ZERO TOLERANCE POLICY MONITORING ACTIVE</span>
                         </div>
                         <textarea disabled={!isPro} value={aiObjective} onChange={(e) => setAiObjective(e.target.value)} placeholder="Enter your strategic high-conversion message up to 300 characters, and our smart engine will generate intelligent shuffle combinations. REVIEW THEM ⚠️" className={`input-premium h-[120px] sm:h-[140px] resize-none font-sans font-medium text-[12px] sm:text-[14px] !text-transform-none ${isAiObjectiveForbidden ? '!text-[#FE2C55] !border-[#FE2C55] shadow-[0_0_15px_rgba(254,44,85,0.3)]' : ''}`} />
                         
                         <button onClick={handlePrepareBatch} disabled={!isPro || logs.length === 0 || isAiObjectiveForbidden || isAiProcessing} className={`text-black text-[10px] sm:text-[11px] py-4 sm:py-5 rounded-xl sm:rounded-2xl shadow-[0_0_20px_rgba(37,244,238,0.2)] disabled:opacity-30 hover:scale-[1.02] transition-transform w-full mt-2 sm:mt-4 font-black ${isAiObjectiveForbidden ? 'bg-white/20 !text-white/50 cursor-not-allowed' : 'bg-[#25F4EE]'}`}>
                            {isAiObjectiveForbidden ? "SYSTEM STANDBY — CORRECT PAYLOAD" : (isAiProcessing ? "GENERATING BLOCKS..." : `SYNTHESIZE QUEUE`)}
                         </button>
                      </div>
                      
                      {/* PAINEL DE DISPARO REMOTO & DIAGNÓSTICO GHOST PROTOCOL */}
                      <div className="bg-[#111] border border-white/5 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center p-6 sm:p-8 min-h-[180px] sm:min-h-[200px] text-center shadow-inner relative overflow-hidden mt-4 lg:mt-0">
                        {smsQueueCount > 0 ? (
                          <div className="flex flex-col items-center justify-center w-full animate-in fade-in zoom-in-95">
                             <div className="mb-4 sm:mb-6">
                               <p className="text-4xl sm:text-5xl font-black text-amber-500 tracking-tighter animate-pulse">{smsQueueCount}</p>
                               <p className="text-[8px] sm:text-[9px] text-white/40 tracking-widest mt-1 sm:mt-2 font-black">PENDING IN NODE QUEUE</p>
                             </div>
                             <div className="text-amber-500 flex flex-col items-center gap-2 sm:gap-3">
                               <RefreshCw size={20} className="sm:w-6 sm:h-6 animate-spin" />
                               <p className="text-[8px] sm:text-[9px] tracking-widest animate-pulse font-bold">{isDispatching ? "AWAITING MOBILE NODE DISPATCH..." : "TRANSMITTING VIA SECURE P2P GATEWAY..."}</p>
                             </div>
                             
                             <button onClick={handleClearQueue} disabled={loading} className="mt-4 sm:mt-6 text-[8px] sm:text-[9px] text-white/30 hover:text-[#FE2C55] transition-colors uppercase tracking-widest flex items-center gap-1.5 border border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-black font-black">
                               <Trash2 size={10} className="sm:w-3 sm:h-3"/> PURGE QUEUE
                             </button>

                             {nodeWarningActive && (
                               <div className="mt-4 sm:mt-6 p-3 sm:p-4 w-full bg-[#FE2C55]/10 border border-[#FE2C55]/30 rounded-xl text-left animate-in slide-in-from-bottom-2">
                                 <p className="text-[9px] sm:text-[10px] text-[#FE2C55] font-black tracking-widest flex items-center gap-1.5 sm:gap-2 mb-1"><WifiOff size={10} className="sm:w-3 sm:h-3"/> DEVICE DISCONNECTED</p>
                                 <p className="text-[7px] sm:text-[8px] text-white/60 font-sans !text-transform-none leading-relaxed text-wrap-balance">If queue doesn't clear, your Web App and Android App are using different Firebase databases. Clear the queue and ensure you are using the same configuration.</p>
                               </div>
                             )}
                          </div>
                        ) : (
                          <div className="opacity-20 flex flex-col items-center">
                            <ShieldAlert size={40} className="sm:w-[54px] sm:h-[54px] mb-3 sm:mb-4 text-white" />
                            <p className="text-[10px] sm:text-[11px] font-black tracking-widest">SYSTEM STANDBY</p>
                          </div>
                        )}

                        {/* HIGH-TECH GHOST PROTOCOL EXPLANATION BADGE */}
                        {!smsQueueCount && (
                          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 p-2.5 sm:p-3 bg-white/[0.02] border border-white/5 rounded-xl text-left hidden sm:block">
                             <p className="text-[8px] sm:text-[9px] text-[#10B981] font-black tracking-widest flex items-center gap-1.5 sm:gap-2 mb-1"><Wifi size={10} className="sm:w-3 sm:h-3 animate-pulse"/> GHOST PROTOCOL ACTIVE</p>
                             <p className="text-[7px] sm:text-[8px] text-white/30 font-sans !text-transform-none leading-relaxed text-wrap-balance">Secure background routing active. To preserve operational stealth, transmissions operate independently and will not be visible in your device's native SMS outbox.</p>
                          </div>
                        )}
                      </div>
                   </div>
                 )}
              </div>
              {!isPro && <div className="pro-lock-layer p-4"><p className="text-[#FE2C55] tracking-widest text-[10px] sm:text-[11px] mb-2 shadow-xl animate-pulse font-black"><Lock size={10} className="sm:w-3 sm:h-3 inline mr-1.5 sm:mr-2"/> PRO LOCKED</p><button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="bg-[#25F4EE] text-black text-[8px] sm:text-[9px] px-6 sm:px-10 py-2.5 sm:py-3 rounded-xl whitespace-nowrap font-black">UNLOCK NEXUS AGENT</button></div>}
            </div>

            {/* PROTOCOL INVENTORY (LINKS) */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-3xl mb-16 flex flex-col text-left">
              <div className="p-6 sm:p-8 border-b border-white/10 flex justify-between items-center bg-[#111]"><div className="flex items-center gap-2 sm:gap-3"><Radio size={18} className="sm:w-5 sm:h-5 text-[#25F4EE]" /><h3 className="text-base sm:text-lg tracking-tight font-black">ACTIVE PROTOCOLS INVENTORY</h3></div></div>
              <div className="min-h-[150px] sm:min-h-[200px] max-h-[40vh] overflow-y-auto bg-black custom-scrollbar">
                {linksHistory.length > 0 ? linksHistory.map(l => (
                  <div key={l.id} className="p-5 sm:p-8 border-b border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-4 sm:gap-6 hover:bg-white/[0.02] transition-colors">
                    <div className="flex-1 overflow-hidden">
                       <p className="text-[9px] sm:text-[10px] text-white/30 mb-1 flex items-center gap-1.5 sm:gap-2 tracking-widest"><Calendar size={10}/> {l.created_at && typeof l.created_at.toDate === 'function' ? l.created_at.toDate().toLocaleString('en-US') : 'Syncing Gateway...'}</p>
                       <p className="text-xs sm:text-sm text-[#25F4EE] truncate font-sans !text-transform-none max-w-[280px] sm:max-w-[400px]">{l.url}</p>
                       <p className="text-[8px] sm:text-[9px] text-white/40 mt-1 sm:mt-1.5 leading-tight font-sans !text-transform-none truncate">HOST: {String(l.company)} | PAYLOAD: {String(l.msg).substring(0,40)}...</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto mt-2 md:mt-0">
                       <button onClick={() => {navigator.clipboard.writeText(l.url); alert("Handshake Gateway Copied!");}} className="flex-1 md:flex-none p-2.5 sm:p-3 bg-white/5 rounded-xl border border-white/10 hover:text-[#25F4EE] transition-colors flex justify-center"><Copy size={14} className="sm:w-4 sm:h-4"/></button>
                       <button onClick={() => {setEditingLink(l); setGenTo(l.to); setCompanyName(l.company); setGenMsg(l.msg); setView('home'); window.scrollTo(0,0);}} className="flex-1 md:flex-none p-2.5 sm:p-3 bg-white/5 rounded-xl border border-white/10 hover:text-amber-500 transition-colors flex justify-center"><Edit size={14} className="sm:w-4 sm:h-4"/></button>
                       <button onClick={() => handleDeleteLink(l.id)} className="flex-1 md:flex-none p-2.5 sm:p-3 bg-white/5 rounded-xl border border-white/10 hover:text-[#FE2C55] transition-colors flex justify-center"><Trash size={14} className="sm:w-4 sm:h-4"/></button>
                    </div>
                  </div>
                )) : <div className="p-16 sm:p-20 text-center opacity-20"><Lock size={36} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4" /><p className="text-[9px] sm:text-[10px] tracking-widest font-black">NO PROTOCOLS ESTABLISHED</p></div>}
              </div>
            </div>

            {/* UPGRADE STATION */}
            <div id="marketplace-section" className="mb-12 sm:mb-16 mt-8 sm:mt-10 text-left">
               <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-10"><ShoppingCart size={20} className="sm:w-6 sm:h-6 text-[#FE2C55]"/><h3 className="text-lg sm:text-xl text-white text-glow-white font-black">NEXUS UPGRADE HUB</h3></div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8 text-left">
                 <div className="bg-[#111] border border-white/10 p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] group shadow-2xl hover:border-[#25F4EE]/50 transition-colors">
                    <h3 className="text-2xl sm:text-3xl text-white mb-2 sm:mb-4 font-black">NEXUS ROUTING PRO</h3>
                    <p className="text-3xl sm:text-4xl text-[#25F4EE] mb-6 sm:mb-8 font-black">{isMaster ? "0.00 / MASTER" : "$9.00 / MONTH"}</p>
                    <p className="text-[8px] sm:text-[9px] text-white/40 mb-8 sm:mb-10 leading-relaxed pr-4 sm:pr-0">UNLIMITED REDIRECTIONS & SECURE VAULT ACCESS FOR ALL YOUR CAPTURED LEADS.</p>
                    {isMaster ? <button className="btn-strategic !bg-[#25F4EE] !text-black text-[10px] sm:text-xs w-full py-3.5 sm:py-4 font-black">UNLIMITED ACCESS</button> : <button className="btn-strategic !bg-white !text-black text-[10px] sm:text-xs w-full py-3.5 sm:py-4 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] font-black">UPGRADE NOW</button>}
                 </div>
                 <div className="bg-[#25F4EE]/10 border border-[#25F4EE] p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] group shadow-[0_0_30px_rgba(37,244,238,0.15)] hover:scale-[1.01] transition-transform">
                    <h3 className="text-2xl sm:text-3xl text-white mb-2 sm:mb-4 text-[#25F4EE] font-black">NEXUS AUTOMATION ENGINE</h3>
                    <p className="text-3xl sm:text-4xl text-[#25F4EE] mb-6 sm:mb-8 font-black">{isMaster ? "0.00 / MASTER" : "$19.90 / MONTH"}</p>
                    <p className="text-[8px] sm:text-[9px] text-white/40 mb-8 sm:mb-10 leading-relaxed pr-4 sm:pr-0">FULL AI NATIVE SYNTHESIS & AUTOMATED PACING DELAY. INCLUDES 800 BONUS PACKETS ON ACTIVATION.</p>
                    {isMaster ? <button className="btn-strategic !bg-[#25F4EE] !text-black text-[10px] sm:text-xs w-full py-3.5 sm:py-4 font-black">UNLIMITED ACCESS</button> : <button className="btn-strategic !bg-[#25F4EE] !text-black text-[10px] sm:text-xs w-full py-3.5 sm:py-4 shadow-[0_0_20px_rgba(37,244,238,0.3)] font-black">ACTIVATE GATEWAY</button>}
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
                 {[
                   { name: "STARTER GATEWAY", qty: 400, price: isMaster ? "0.00 / MASTER" : "$12.00" },
                   { name: "NEXUS PACK", qty: 800, price: isMaster ? "0.00 / MASTER" : "$20.00" },
                   { name: "ELITE OPERATOR", qty: 1800, price: isMaster ? "0.00 / MASTER" : "$29.00" }
                 ].map(pack => (
                   <div key={pack.name} className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] text-center shadow-xl flex flex-col items-center hover:bg-white/10 transition-colors">
                     <p className="text-[9px] sm:text-[10px] text-[#25F4EE] mb-1.5 sm:mb-2 tracking-widest font-black">{pack.name}</p>
                     <p className="text-2xl sm:text-3xl text-white mb-3 sm:mb-4 font-black">{pack.qty}</p>
                     <p className="text-[9px] sm:text-[10px] text-white/50 tracking-[0.2em] mb-3 sm:mb-4 font-black">PRO TRANSMISSION PACKETS</p>
                     <p className="text-lg sm:text-xl text-[#25F4EE] mb-6 sm:mb-8 font-black">{pack.price}</p>
                     <button className="w-full py-3 sm:py-3.5 bg-black border border-white/10 rounded-xl sm:rounded-2xl text-[8px] sm:text-[9px] font-black tracking-widest hover:bg-[#25F4EE] hover:text-black transition-all">ACQUIRE PACK</button>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== AUTH (LOGIN/REGISTER) ==================== */}
        {view === 'auth' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-8 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="lighthouse-neon-wrapper w-full max-w-md shadow-3xl">
              <div className="lighthouse-neon-content p-8 sm:p-12 md:p-16 relative">
                {isWelcomeTrial && !isLoginMode ? (
                   <div className="mb-8 text-center animate-in slide-in-from-bottom-2">
                      <h2 className="text-2xl sm:text-3xl font-black text-[#25F4EE] mb-2">🎁 WELCOME TO THE ELITE</h2>
                      <p className="text-[10px] sm:text-xs text-white/70 leading-relaxed font-medium !not-italic !normal-case text-center text-wrap-balance">
                         We noticed you are ready to scale. To generate your secure protocol, create your credential below and instantly unlock <span className="text-white font-bold">🎁 60 Free Trial connections of secure smart link redirects of 'SMS Direct To Cell Phone'</span>. Stop losing leads to carrier filters right now.
                      </p>
                   </div>
                ) : (
                   <h2 className="text-2xl sm:text-3xl mt-4 sm:mt-8 mb-8 sm:mb-12 text-white text-center text-glow-white tracking-tighter font-black">SECURE MEMBER PORTAL</h2>
                )}
                
                <form onSubmit={handleAuthSubmit} className="space-y-5 sm:space-y-6 text-left">
                  {!isLoginMode && (<><input required placeholder="FULL LEGAL NAME" value={fullNameInput} onChange={e=>setFullNameInput(e.target.value)} className="input-premium text-[11px] sm:text-xs w-full font-sans font-medium !text-transform-none" /><input required placeholder="NICKNAME" value={nicknameInput} onChange={e=>setNicknameInput(e.target.value)} className="input-premium text-[11px] sm:text-xs w-full font-sans font-medium !text-transform-none" /><input required type="tel" placeholder="+1 999 999 9999" value={phoneInput} onChange={e=>setPhoneInput(e.target.value)} className="input-premium text-[11px] sm:text-xs w-full font-sans font-medium !text-transform-none" /></>)}
                  <input required type="email" placeholder="EMAIL IDENTITY..." value={email} onChange={e=>setEmail(e.target.value)} className="input-premium text-[11px] sm:text-xs w-full font-sans font-medium !text-transform-none" />
                  <div className="relative">
                    <input required type={showPass ? "text" : "password"} placeholder="SECURITY KEY..." value={password} onChange={e=>setPassword(e.target.value)} className="input-premium text-[11px] sm:text-xs w-full font-sans font-medium !text-transform-none pr-12" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-2"><Eye size={16} className="sm:w-[18px] sm:h-[18px]"/></button>
                  </div>
                  <button type="submit" disabled={loading} className="btn-strategic !bg-[#25F4EE] !text-black text-[10px] sm:text-[11px] mt-4 shadow-xl w-full tracking-widest py-4 sm:py-5 font-black">{loading ? 'VERIFYING GATEWAY...' : (isWelcomeTrial ? 'UNLOCK MY 60 TRANSMISSIONS' : 'AUTHORIZE ACCESS')}</button>
                  <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); }} className="w-full text-[9px] sm:text-[10px] text-white/30 hover:text-white tracking-[0.2em] sm:tracking-[0.4em] mt-8 sm:mt-10 text-center transition-all px-2 font-black">{isLoginMode ? "CREATE NEW OPERATOR? REGISTER" : "ALREADY A MEMBER? LOGIN"}</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER (ULTRA RESPONSIVE WITH DYNAMIC MODALS) */}
      <footer className="mt-auto pb-12 sm:pb-20 w-full z-[100] px-6 sm:px-10 border-t border-white/5 pt-12 sm:pt-20 text-left bg-[#010101] relative">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-widest text-white/30 font-black">
          <div className="flex flex-col gap-4 sm:gap-5"><span className="text-white/40 border-b border-white/5 pb-2">LEGAL PROTOCOLS</span><button onClick={() => setLegalContent('PRIVACY')} className="text-left hover:text-[#25F4EE] transition-colors">PRIVACY POLICY</button><button onClick={() => setLegalContent('TERMS')} className="text-left hover:text-[#25F4EE] transition-colors">TERMS OF USE</button></div>
          <div className="flex flex-col gap-4 sm:gap-5"><span className="text-white/40 border-b border-white/5 pb-2">GLOBAL COMPLIANCE</span><button onClick={() => setLegalContent('LGPD')} className="text-left hover:text-[#FE2C55] transition-colors">LGPD PROTOCOL</button><button onClick={() => setLegalContent('GDPR')} className="text-left hover:text-[#FE2C55] transition-colors">GDPR NODE</button></div>
          <div className="flex flex-col gap-4 sm:gap-5"><span className="text-white/40 border-b border-white/5 pb-2">INFRASTRUCTURE</span><span className="text-left hover:text-white transition-colors cursor-default">U.S. ROUTING SERVERS</span><span className="text-left hover:text-white transition-colors cursor-default">EU SECURE SERVERS</span></div>
          <div className="flex flex-col gap-4 sm:gap-5"><span className="text-white/40 border-b border-white/5 pb-2">OPERATOR SUPPORT</span><button onClick={() => setShowSmartSupport(true)} className="text-left hover:text-[#25F4EE] flex items-center gap-2">SMART SUPPORT <Bot size={12} className="sm:w-3.5 sm:h-3.5"/></button></div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 sm:mt-16 pt-8 border-t border-white/5 flex justify-center">
           <p className="text-[8px] sm:text-[10px] text-white/20 tracking-[0.3em] sm:tracking-[0.5em] text-center w-full px-4 text-glow-white font-black text-wrap-balance">© 2026 CLICKMORE DIGITAL | EXCLUSIVE SECURITY PROTOCOL</p>
        </div>
      </footer>

      {/* --- DYNAMIC LEGAL MODAL (ZERO RELOAD, ULTRA RESPONSIVE) --- */}
      {legalContent && (
        <div className="fixed inset-0 z-[700] bg-[#010101]/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-6 text-left animate-in fade-in zoom-in-95">
          <div className="bg-[#0a0a0a] border border-[#25F4EE]/30 w-full max-w-2xl rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_0_50px_rgba(37,244,238,0.15)] flex flex-col max-h-[85vh] overflow-hidden relative">
             
             <div className="p-6 sm:p-8 border-b border-white/10 flex justify-between items-center bg-[#111] shrink-0">
                <div className="flex items-center gap-3 sm:gap-4">
                   {renderLegalContent()?.icon && React.createElement(renderLegalContent().icon, { size: 24, className: "text-[#25F4EE] sm:w-7 sm:h-7" })}
                   <h3 className="text-lg sm:text-xl text-white tracking-tight font-black">{renderLegalContent()?.title}</h3>
                </div>
                <button onClick={() => setLegalContent(null)} className="p-2 sm:p-2.5 bg-black border border-white/10 rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-colors"><X size={18} className="sm:w-5 sm:h-5"/></button>
             </div>

             <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-[#111] to-black">
                <p className="text-[11px] sm:text-sm text-white/70 font-sans !text-transform-none leading-loose sm:leading-loose">
                   {renderLegalContent()?.text}
                </p>
                
                <div className="mt-8 sm:mt-12 p-4 sm:p-5 bg-[#25F4EE]/5 border border-[#25F4EE]/20 rounded-xl sm:rounded-2xl">
                   <p className="text-[9px] sm:text-[10px] text-[#25F4EE] font-black tracking-widest uppercase mb-1 sm:mb-2">ENCRYPTED AT REST</p>
                   <p className="text-[10px] sm:text-xs text-white/40 font-sans !text-transform-none leading-relaxed text-wrap-balance">By engaging with the SMART SMS PRO ecosystem, your footprint is subjected to AES-256 standard cryptographic masking. No unauthorized external relays possess decryption keyframes.</p>
                </div>
             </div>

             <div className="p-6 sm:p-8 border-t border-white/10 bg-black shrink-0 flex justify-end">
                <button onClick={() => setLegalContent(null)} className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-3.5 bg-[#25F4EE] text-black text-[10px] sm:text-[11px] font-black tracking-widest rounded-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(37,244,238,0.3)]">ACKNOWLEDGE & CLOSE</button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL DE PAREAMENTO QR CODE (NODE SYNC) */}
      {showSyncModal && (
        <div className="fixed inset-0 z-[600] bg-[#010101]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95">
          <div className="lighthouse-neon-wrapper w-full max-w-sm shadow-[0_0_50px_rgba(37,244,238,0.3)]">
            <div className="lighthouse-neon-content p-8 sm:p-10 flex flex-col items-center relative">
              <button onClick={() => setShowSyncModal(false)} className="absolute top-4 sm:top-6 right-4 sm:right-6 text-white/30 hover:text-white"><X size={20}/></button>
              <Smartphone size={40} className="sm:w-12 sm:h-12 text-[#25F4EE] mb-5 sm:mb-6 animate-pulse" />
              <h3 className="text-xl sm:text-2xl tracking-tighter text-white mb-2 font-black">SYNC MOBILE DEVICE</h3>
              <p className="text-[8px] sm:text-[9px] text-white/50 tracking-widest mb-6 sm:mb-8 font-sans font-medium !text-transform-none px-2 text-center text-wrap-balance">Scan QR Code via Native Android App to establish secure P2P tunnel for automated dispatch.</p>
              
              <div className="bg-white p-3 sm:p-4 rounded-[1.5rem] sm:rounded-3xl mb-6 sm:mb-8 shadow-[0_0_20px_#25F4EE]">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(syncToken || 'GENERATING...')}&color=000000`} alt="Sync QR" className="w-32 h-32 sm:w-40 sm:h-40" />
              </div>
              
              {/* Token TTL Indicator */}
              <div className="mb-4 flex items-center justify-center gap-2 text-[8px] tracking-widest text-[#10B981] font-black">
                <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
                <span>SECURE TOKEN ACTIVE — ROTATES EVERY 5 MIN</span>
              </div>
              
              <button onClick={() => { setIsDeviceSynced(true); setShowSyncModal(false); }} className="btn-strategic !bg-[#25F4EE] !text-black text-[9px] sm:text-[10px] w-full py-3.5 sm:py-4 shadow-xl mb-2 sm:mb-4 font-black">
                CONFIRM DEVICE SYNC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SETUP GUIDE MODAL WITH QR & COPY LINK */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 text-center animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-[#25F4EE]/50 rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 max-w-lg w-full relative shadow-[0_0_50px_rgba(37,244,238,0.2)] max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col items-center">
            
            <div className="absolute top-4 right-4 z-10">
               <button onClick={() => setShowHelpModal(false)} className="bg-black border border-white/10 p-2 sm:p-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors shadow-lg"><X size={18} className="sm:w-5 sm:h-5"/></button>
            </div>
            
            <div className="flex justify-center mb-5 sm:mb-6 mt-4">
              <div className="p-3 sm:p-4 bg-[#25F4EE]/10 rounded-full border border-[#25F4EE]/30 animate-pulse">
                <DownloadCloud size={28} className="sm:w-8 sm:h-8 text-[#25F4EE]" />
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white italic tracking-tight mb-5 sm:mb-6 text-center">APK SETUP GUIDE</h2>

            {/* APK DOWNLOAD QR */}
            <div className="bg-white p-3 sm:p-4 rounded-[1.5rem] sm:rounded-3xl mb-6 shadow-[0_0_20px_#25F4EE]">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent("https://expo.dev/artifacts/eas/egRVRodLFQ2vZoofTxnfGw.apk")}&color=000000`} alt="Download APK QR" className="w-32 h-32 sm:w-40 sm:h-40" />
            </div>
            
            <div className="bg-[#FE2C55]/10 border border-[#FE2C55]/30 text-[#FE2C55] px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl flex items-center gap-2.5 sm:gap-3 mb-5 text-left w-full">
              <Info size={20} className="sm:w-6 sm:h-6 shrink-0" />
              <p className="text-[8px] sm:text-[9px] font-black leading-relaxed tracking-widest text-wrap-balance">SYSTEM REQUIREMENT: THIS AUTOMATION WORKS EXCLUSIVELY WITH ANDROID DEVICES.</p>
            </div>

            <div className="space-y-2.5 sm:space-y-3 text-left mb-6 w-full font-black">
              <div className="bg-black border border-white/5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl">
                <p className="text-[#25F4EE] font-black text-[8px] sm:text-[9px] tracking-widest mb-1">STEP 1</p>
                <p className="text-white text-[10px] sm:text-[11px] font-medium font-sans !text-transform-none">Scan the QR code above or use the buttons below to download the App.</p>
              </div>
              <div className="bg-black border border-white/5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl">
                <p className="text-[#25F4EE] font-black text-[8px] sm:text-[9px] tracking-widest mb-1">STEP 2</p>
                <p className="text-white text-[10px] sm:text-[11px] font-medium font-sans !text-transform-none">Open the app on your phone and grant the required SMS & Camera permissions.</p>
              </div>
              <div className="bg-black border border-white/5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl">
                <p className="text-[#25F4EE] font-black text-[8px] sm:text-[9px] tracking-widest mb-1">STEP 3</p>
                <p className="text-white text-[10px] sm:text-[11px] font-medium font-sans !text-transform-none">Click "SYNC MOBILE DEVICE" on this dashboard and scan the QR Code with your phone.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <a href="https://expo.dev/artifacts/eas/egRVRodLFQ2vZoofTxnfGw.apk" target="_blank" rel="noreferrer" className="w-full bg-gradient-to-r from-[#25F4EE] to-[#1AB5B0] text-black font-black text-[10px] sm:text-[11px] py-4 sm:py-5 rounded-xl shadow-[0_0_20px_rgba(37,244,238,0.4)] flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform text-center flex-1">
                <DownloadCloud size={16} className="sm:w-[18px] sm:h-[18px] shrink-0" />
                <span className="truncate">DOWNLOAD APK DIRECTLY</span>
              </a>
              <button onClick={() => {navigator.clipboard.writeText("https://expo.dev/artifacts/eas/egRVRodLFQ2vZoofTxnfGw.apk"); alert("APK Link Copied!");}} className="bg-white/10 text-white font-black text-[10px] sm:text-[11px] py-4 sm:py-5 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center px-6 shrink-0">
                <Copy size={16} /> COPY LINK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === MASTER ADMIN: LEAD EDIT MODAL === */}
      {editLeadModal && (
        <div className="fixed inset-0 z-[850] bg-[#010101]/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in zoom-in-95">
          <div className="bg-[#0a0a0a] border border-amber-500/40 rounded-[2rem] w-full max-w-md shadow-[0_0_40px_rgba(245,158,11,0.2)] overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-[#111] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Edit size={18} className="text-amber-500"/>
                <h3 className="text-sm font-black tracking-widest text-white">EDIT LEAD — MASTER OVERRIDE</h3>
              </div>
              <button onClick={() => setEditLeadModal(null)} className="text-white/30 hover:text-white p-1"><X size={18}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[9px] tracking-widest text-white/40 font-black block mb-2">IDENTITY (NAME)</label>
                <input
                  value={editLeadModal.nome_cliente}
                  onChange={e => setEditLeadModal(prev => ({ ...prev, nome_cliente: e.target.value }))}
                  className="input-premium w-full font-sans !text-transform-none text-sm"
                  placeholder="Lead full name"
                />
              </div>
              <div>
                <label className="text-[9px] tracking-widest text-white/40 font-black block mb-2">TARGET NUMBER (PHONE)</label>
                <input
                  type="tel"
                  value={editLeadModal.telefone_cliente}
                  onChange={e => setEditLeadModal(prev => ({ ...prev, telefone_cliente: e.target.value }))}
                  className="input-premium w-full font-sans !text-transform-none text-sm"
                  placeholder="+1 999 999 9999"
                />
              </div>
              <div>
                <label className="text-[9px] tracking-widest text-white/40 font-black block mb-2">ASSIGN FOLDER / CAMPAIGN</label>
                <select
                  value={editLeadModal.folderId || 'MANUAL'}
                  onChange={e => setEditLeadModal(prev => ({ ...prev, folderId: e.target.value }))}
                  className="input-premium w-full font-sans !text-transform-none text-sm bg-[#111] appearance-none"
                >
                  {folders.map(f => (
                    <option key={f.id} value={f.id} className="bg-[#111]">{f.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditLeadModal(null)} className="flex-1 py-3 bg-white/5 text-white/50 rounded-xl text-[9px] font-black tracking-widest hover:text-white transition-colors border border-white/10">CANCEL</button>
                <button onClick={handleAdminEditLead} disabled={loading} className="flex-1 py-3 bg-amber-500 text-black rounded-xl text-[9px] font-black tracking-widest hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  {loading ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === MASTER ADMIN: CREATE FOLDER MODAL === */}
      {createFolderModal && (
        <div className="fixed inset-0 z-[850] bg-[#010101]/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in zoom-in-95">
          <div className="bg-[#0a0a0a] border border-[#25F4EE]/40 rounded-[2rem] w-full max-w-sm shadow-[0_0_40px_rgba(37,244,238,0.15)] overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-[#111] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Plus size={18} className="text-[#25F4EE]"/>
                <h3 className="text-sm font-black tracking-widest text-white">NEW CAMPAIGN FOLDER</h3>
              </div>
              <button onClick={() => setCreateFolderModal(false)} className="text-white/30 hover:text-white p-1"><X size={18}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[9px] tracking-widest text-white/40 font-black block mb-2">FOLDER / CAMPAIGN NAME</label>
                <input
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
                  className="input-premium w-full font-sans !text-transform-none text-sm"
                  placeholder="e.g. Black Friday Campaign"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setCreateFolderModal(false)} className="flex-1 py-3 bg-white/5 text-white/50 rounded-xl text-[9px] font-black tracking-widest hover:text-white transition-colors border border-white/10">CANCEL</button>
                <button onClick={handleCreateFolder} className="flex-1 py-3 bg-[#25F4EE] text-black rounded-xl text-[9px] font-black tracking-widest hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(37,244,238,0.3)]">CREATE</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI SMART SUPPORT MODAL (LIVE HEURISTIC CHAT WITH BUTTONS) */}
      {showSmartSupport && (
        <div className="fixed inset-0 z-[900] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-[#010101]/95 backdrop-blur-xl animate-in fade-in sm:zoom-in-95">
           <div className="w-full max-w-lg bg-[#0a0a0a] sm:border border-[#25F4EE]/30 rounded-t-3xl sm:rounded-[2.5rem] shadow-[0_0_50px_rgba(37,244,238,0.2)] flex flex-col justify-between overflow-hidden" style={{ height: '85dvh', maxHeight: '750px' }}>
                 
                 {/* Chat Header */}
                 <header className="shrink-0 p-4 sm:p-6 border-b border-white/10 flex justify-between items-center bg-[#111]">
                     <div className="flex items-center gap-3">
                        <Bot size={24} className="sm:w-[28px] sm:h-[28px] text-[#25F4EE]"/>
                        <span className="text-xs sm:text-sm tracking-widest text-glow-white font-black">NEXUS AI SMART</span>
                     </div>
                     <button onClick={() => setShowSmartSupport(false)} className="text-white/40 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"><X size={20} className="sm:w-[24px] sm:h-[24px]"/></button>
                 </header>
                 
                 {/* Chat Body */}
                 <main className="flex-1 min-h-0 bg-black p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5 shadow-inner relative">
                    
                    {chatMessages.length === 0 && !isChatLoading && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center opacity-50 pointer-events-none px-4 text-center">
                          <Bot size={56} className="mb-4 text-[#10B981] animate-pulse drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                          <div className="bg-[#10B981]/10 border border-[#10B981]/30 px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] mb-3">
                             <span className="w-2.5 h-2.5 bg-[#10B981] rounded-full animate-ping absolute"></span> 
                             <span className="w-2.5 h-2.5 bg-[#10B981] rounded-full relative"></span> 
                             <span className="text-[10px] tracking-widest font-black text-[#10B981]">ONLINE</span>
                          </div>
                          <p className="text-[10px] tracking-[0.2em] font-medium text-white/70 font-black">24/7 NEXUS AI ACTIVE • READY TO BOOST CONVERSIONS</p>
                       </div>
                    )}

                    {chatMessages.map((msg, i) => (
                      <div 
                        key={i} 
                        ref={i === chatMessages.length - 1 ? latestMessageRef : null}
                        className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}
                      >
                         <div className={`p-4 sm:p-5 rounded-2xl max-w-[85%] font-sans !text-transform-none !not-italic font-normal text-[13.5px] sm:text-[15px] leading-relaxed tracking-wide whitespace-pre-line text-wrap-balance shadow-lg ${msg.role === 'user' ? 'bg-[#25F4EE] text-black font-medium rounded-tr-sm text-left' : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-sm text-left'}`}>
                            {msg.text}
                         </div>
                         {/* Action Buttons Render */}
                         {msg.buttons && msg.buttons.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3 max-w-[85%] justify-start">
                               {msg.buttons.map((btn, bIdx) => (
                                  <button key={bIdx} onClick={() => handleChatButtonAction(btn.action)} className="bg-[#25F4EE]/10 border border-[#25F4EE]/30 text-[#25F4EE] px-4 py-2 rounded-lg text-[10px] font-black tracking-widest hover:bg-[#25F4EE]/20 transition-all flex items-center gap-1.5 shadow-lg">
                                     {btn.label}
                                  </button>
                               ))}
                            </div>
                         )}
                      </div>
                    ))}
                    
                    {isChatLoading && (
                      <div className="flex w-full justify-start animate-in fade-in duration-300">
                         <div className="p-4 sm:p-5 rounded-2xl rounded-tl-sm max-w-[85%] bg-white/5 border border-white/10 flex items-center gap-3 shadow-lg">
                           <span className="flex gap-1.5 items-center h-5 ml-1">
                              <span className="w-2 h-2 bg-[#25F4EE] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                              <span className="w-2 h-2 bg-[#25F4EE] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                              <span className="w-2 h-2 bg-[#25F4EE] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                           </span>
                           <span className="text-[9px] tracking-widest uppercase italic text-[#25F4EE]/70 font-black ml-2">NEXUS AI IS TYPING...</span>
                         </div>
                      </div>
                    )}
                    <div ref={chatEndRef} className="h-1 shrink-0" />
                 </main>
                 
                 {/* Chat Footer */}
                 <footer className="shrink-0 p-4 sm:p-5 border-t border-white/10 bg-[#111]">
                     <form onSubmit={handleSendChat} className="flex gap-2 sm:gap-3 flex-col">
                        <div className="flex items-center justify-center gap-2">
                           <ShieldAlert size={12} className="text-amber-500" />
                           <span className="text-[8px] text-amber-500 font-black tracking-widest uppercase">⚠️ ZERO TOLERANCE POLICY MONITORING ACTIVE</span>
                        </div>
                        <div className="flex gap-2 sm:gap-3">
                            <input 
                              value={chatInput} 
                              onChange={(e) => setChatInput(e.target.value)} 
                              disabled={isChatLoading || isChatBanned}
                              placeholder={isChatForbidden ? "Forbidden content detected..." : (isChatBanned ? "Sessão Bloqueada" : "Type your message...")} 
                              className={`input-premium flex-1 font-sans !text-transform-none text-xs sm:text-sm bg-black disabled:opacity-50 ${isChatForbidden ? '!text-[#FE2C55] !border-[#FE2C55] shadow-[0_0_15px_rgba(254,44,85,0.3)]' : 'focus:border-[#25F4EE]/50'}`}
                            />
                            <button type="submit" disabled={isChatLoading || !chatInput.trim() || isChatForbidden || isChatBanned} className={`p-3 sm:p-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center shrink-0 ${isChatForbidden || isChatBanned ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-[#25F4EE] text-black shadow-[0_0_15px_rgba(37,244,238,0.2)]'}`}>
                              <Send size={18} className="sm:w-5 sm:h-5"/>
                            </button>
                        </div>
                     </form>
                 </footer>

           </div>
        </div>
      )}
    </div>
  );
}
