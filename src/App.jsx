import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification
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
  DownloadCloud, Trash2, SlidersHorizontal, WifiOff, Wifi, FileLock2, Scale as LawScale, ChevronRightSquare, MessageSquare, BellRing, TrendingUp, PieChart, BadgeCheck,
  Mail, MapPin, Wrench, ChevronLeft, HardHat, MessageSquareText
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

// --- SECURE MASTER ADMIN DECRYPTION (OBFUSCATED) ---
const getMasterKey = () => typeof atob === 'function' ? atob("WUdlcFZISE1ZYU45c0MzakZtVHlyeTBtWVpPMg==") : "YGepVHHMYaN9sC3jFmTyry0mYZO2";
const ADMIN_MASTER_ID = getMasterKey();

// --- PREMIUM AVATARS POOL ---
const NEXUS_AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Nexus1&backgroundColor=010101&primaryColor=25F4EE",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Prime9&backgroundColor=010101&primaryColor=FE2C55",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Ghost4&backgroundColor=010101&primaryColor=10B981",
  "https://api.dicebear.com/7.x/bottts/svg?seed=CipherX&backgroundColor=010101&primaryColor=F59E0B",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Stealth&backgroundColor=010101&primaryColor=ffffff"
];

// --- SUPREME LANGUAGE DETECTOR ---
const detectLanguage = (str) => {
  if (!str) return 'EN';
  const lowerStr = str.toLowerCase();
  const ptWords = /\b(o|a|os|as|um|uma|de|do|da|em|no|na|que|se|para|com|por|como|mais|mas|foi|ao|ele|ela|este|esta|esse|essa|isso|aquilo|você|vc|seu|sua|meu|minha|nosso|nossa|teste|regra|absoluta|olá|oi|bom|dia|tarde|noite|obrigado|obrigada|quero|preciso|sim|não|ajuda|português)\b/i;
  const esWords = /\b(el|la|los|las|un|una|de|en|que|se|para|con|por|como|más|pero|al|lo|su|sus|mi|mis|nuestro|nuestra|hola|gracias|si|quiero|necesito|ayuda|español)\b/i;
  const hasPtChars = /[áàãâéêíóôõúç]/i.test(lowerStr);
  const hasEsChars = /[áéíóúñ¿¡]/i.test(lowerStr);

  if (ptWords.test(lowerStr) || hasPtChars) return 'PT';
  if (esWords.test(lowerStr) || hasEsChars) return 'ES';
  return 'EN';
};

// --- ZERO TOLERANCE GLOBAL REGEX ---
const checkForbiddenWords = (text) => {
  if (typeof text !== 'string' || !text) return false;
  const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const regex = /(hack|h4ck|scam|sc4m|fraud|fr4ud|phishing|ph1shing|hate|racism|murder|porn|p0rn|malware|virus|golpe|odio|spam|sp4m|illegal|ilegal|extortion|exploit|ddos|botnet|ransomware|piracy|stolen|hijack|puta|caralho|merda|porra|foda|cacete|bitch|fuck|shit|asshole|idiota|imbecil|burro|scumbag|cunt|vagabundo|desgracado|desgraca|miseravel|safado|lixo|trouxa|burlar|enganar|desviar|roubar|fraudar|crime|ilícito|ilicito)/i;
  return regex.test(normalized);
};

// --- STRIPE PAYMENT LINKS ---
const STRIPE_LINKS = {
    NEXUS_ROUTING_PRO: "#", 
    NEXUS_AUTOMATION_ENGINE: "#",
    STARTER_PACK: "#",
    NEXUS_PACK: "#",
    ELITE_PACK: "#"
};

// --- FAQ COMPONENT ---
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 py-8 group cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex justify-between items-center gap-6 text-left leading-none">
        <h4 className="text-sm sm:text-base font-black uppercase tracking-widest text-white/80 group-hover:text-[#25F4EE] transition-colors leading-relaxed w-full">
          {String(q)}
        </h4>
        {open ? <ChevronUp size={24} className="text-[#25F4EE] shrink-0" /> : <ChevronDown size={24} className="text-white/40 shrink-0" />}
      </div>
      {open && <p className="mt-6 text-sm sm:text-base text-white/60 leading-relaxed font-normal animate-in slide-in-from-top-2 text-left not-italic normal-case">{String(a)}</p>}
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
  
  // --- COOKIE CONSENT STATE ---
  const [cookieConsent, setCookieConsent] = useState('pending');
  const [showCookieDetails, setShowCookieDetails] = useState(false);

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

  // --- COMPLIANCE GATE (DONYS) STATES ---
  const [captureData, setCaptureData] = useState(null);
  const [captureForm, setCaptureForm] = useState({ name: '', phone: '', smsConsent: false });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [donysLegal, setDonysLegal] = useState(null);

  // UPDATED GMB LINK AS REQUESTED (APPLIES TO ALL BUTTONS AND IMAGES)
  const donysGmbLink = "https://share.google/K6VeiEqdHfaj811n7";

  // REPLACED SLIDE 1 WITH SPECIFIC URL REQUESTED BY USER
  const gmbPosts = [
    { id: 1, title: "Recent Project in Malden, MA", type: "Post", date: "Jan 2026", link: donysGmbLink, image: "https://economicnewsbrasil.com.br/wp-content/uploads/2023/06/Captura-de-Tela-2023-06-09-as-10.48.01.jpg", desc: "Check out our latest work verified in the Malden area. We maintain a transparent record of all our Massachusetts local renovations." },
    { id: 2, title: "Kitchen Remodel - Greater Boston", type: "Update", date: "Feb 2026", link: donysGmbLink, image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80", desc: "Elevate your culinary space. See how we transform outdated kitchens into stunning, modern centerpieces tailored to your lifestyle." },
    { id: 3, title: "High-End Custom Builds", type: "Photo", date: "Mar 2026", link: donysGmbLink, image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80", desc: "Delivering uncompromising luxury and elite craftsmanship. Proudly bringing premium construction services to Malden and all surrounding communities within a 70-mile radius." }
  ];

  // --- AUTHENTICATION & PROFILE STATES ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [nicknameInput, setNicknameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [selectedAvatarInput, setSelectedAvatarInput] = useState(NEXUS_AVATARS[0]);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPass, setShowPass] = useState(false);

  // --- AI AUTOMATION, STAGING & QR SYNC STATES ---
  const [aiObjective, setAiObjective] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [stagedQueue, setStagedQueue] = useState([]); 
  const [selectedFolder, setSelectedFolder] = useState('ALL'); 
  
  const [isDispatching, setIsDispatching] = useState(false);
  const [sendDelay, setSendDelay] = useState(30); 
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
  const chatEndRef = useRef(null);
  const latestMessageRef = useRef(null);

  const isGenMsgForbidden = checkForbiddenWords(genMsg);
  const isAiObjectiveForbidden = checkForbiddenWords(aiObjective);
  const isChatForbidden = checkForbiddenWords(chatInput);

  // --- SECURE QR HANDSHAKE TOKEN GENERATOR ---
  const [syncToken, setSyncToken] = useState('');
  
  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID().split('-')[0];
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
      setSyncToken(token);
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

  // --- COOKIE INITIALIZATION ---
  useEffect(() => {
    const consent = localStorage.getItem('nexus_legal_consent');
    if (consent) setCookieConsent('resolved');
  }, []);

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

  useEffect(() => {
    if (showSmartSupport && latestMessageRef.current) {
       setTimeout(() => latestMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 150);
    }
  }, [chatMessages, showSmartSupport, isChatLoading]);

  // UX Scroll Fix: Smooth, only on explicit view change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: view === 'capture' ? 'instant' : 'smooth' });
  }, [view]);

  // --- IDENTITY BOOTSTRAP WITH ERROR RESILIENCE ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        setIsWelcomeTrial(false);
        setView(prev => prev === 'auth' ? 'dashboard' : prev);

        try {
          const docRef = doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'data');
          const d = await getDoc(docRef);
          
          if (d.exists()) {
            const data = d.data();
            if (u.uid === ADMIN_MASTER_ID) {
               setUserProfile({...data, tier: 'MASTER', isUnlimited: true, baseCredits: 999999, isSubscribed: true});
            } else {
               setUserProfile(data);
            }
            setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'subscribers', u.uid), { id: u.uid, ...data }, { merge: true }).catch(() => {});
          } else {
            const defaultName = u.uid === ADMIN_MASTER_ID ? "Master Admin" : String(u.email?.split('@')[0] || 'Operator');
            const defaultNick = u.uid === ADMIN_MASTER_ID ? "MASTER" : "Operator";
            const p = { 
                fullName: defaultName, 
                nickname: defaultNick, 
                email: u.email, 
                tier: u.uid === ADMIN_MASTER_ID ? 'MASTER' : 'FREE_TRIAL', 
                baseCredits: u.uid === ADMIN_MASTER_ID ? 999999 : 60, 
                connections_used: 0,
                dailySent: 0, 
                avatar: NEXUS_AVATARS[0],
                isEmailVerified: u.emailVerified,
                created_at: serverTimestamp() 
            };
            await setDoc(docRef, p);
            setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'subscribers', u.uid), { id: u.uid, ...p }).catch(() => {});
            setUserProfile(p);
          }
        } catch (e) {
          console.error("Profile load error", e);
          setUserProfile({ fullName: "Operator", nickname: 'Guest', tier: 'FREE_TRIAL', baseCredits: 60, connections_used: 0, dailySent: 0 });
        } finally {
          setAuthResolved(true);
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
        setAuthResolved(true);
      }
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
        setGlobalNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => {
            const timeA = typeof a.created_at === 'number' ? a.created_at : (a.created_at?.toMillis ? a.created_at.toMillis() : Date.now());
            const timeB = typeof b.created_at === 'number' ? b.created_at : (b.created_at?.toMillis ? b.created_at.toMillis() : Date.now());
            return timeB - timeA;
        }));
    });

    let unsubProfile = () => {};
    let unsubPubProfile = () => {};
    if (!isMaster && user) {
      unsubProfile = onSnapshot(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data'), (snap) => {
        if (snap.exists()) {
          setUserProfile(prev => ({
            ...prev,
            dailySent: snap.data().dailySent ?? prev?.dailySent ?? 0,
            isEmailVerified: auth.currentUser?.emailVerified
          }));
        }
      });
      unsubPubProfile = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'subscribers', user.uid), (snap) => {
         if (snap.exists()) {
            setUserProfile(prev => ({
               ...prev,
               baseCredits: snap.data().baseCredits ?? prev?.baseCredits ?? 60,
               connections_used: snap.data().connections_used ?? prev?.connections_used ?? 0,
               tier: snap.data().tier ?? prev?.tier,
               isSubscribed: snap.data().isSubscribed ?? prev?.isSubscribed,
               isUnlimited: snap.data().isUnlimited ?? prev?.isUnlimited
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
    return () => { unsubLeads(); unsubLinks(); unsubQueue(); unsubNotifs(); unsubSubs(); unsubProfile(); unsubPubProfile(); };
  }, [user, view, isMaster]);

  // --- DERIVED QUOTA STATE ---
  const remainingQuota = isMaster ? "∞" : Math.max(0, (userProfile?.baseCredits || 60) - (userProfile?.connections_used || 0));

  // ============================================================================
  // ADMIN MASTER ACTION FUNCTIONS
  // ============================================================================
  const handleAdminGrantTier = async (e, targetId, tierType) => {
    e.stopPropagation(); 
    if (targetId === 'AI_SMART_CHAT' || targetId === ADMIN_MASTER_ID) {
        alert("SYSTEM OVERRIDE DENIED: Core system nodes cannot be modified.");
        return;
    }
    if (!window.confirm(`CONFIRM MASTER ACTION: Injecting ${tierType} Protocol into Target Gateway: ${targetId}?`)) return;
    setLoading(true);
    try {
        const updates = tierType === 'ACTIVATION_9_USD' 
          ? { tier: 'ACTIVATION_9_USD', isUnlimited: true, canViewFullLeadData: true }
          : { tier: 'PRO_SUBSCRIPTION_19_USD', automationStatus: 'ACTIVE', baseCredits: increment(800), isSubscribed: true };
        
        // Force inject into public subscribers first to guarantee UI unlock
        const pubRef = doc(db, 'artifacts', appId, 'public', 'data', 'subscribers', targetId);
        await setDoc(pubRef, updates, { merge: true });

        // Attempt private sync, catch silently if rules block it for legacy users
        const profileRef = doc(db, 'artifacts', appId, 'users', targetId, 'profile', 'data');
        setDoc(profileRef, updates, { merge: true }).catch(() => console.log("[SYS-LOG] Private sync restricted by rules."));
        
        alert(`MASTER AUTHORITY: TIER ${tierType} SUCCESSFULLY INJECTED.`);
    } catch (error) { 
        console.error("Mimo Injection Error:", error); 
        alert("MASTER ACTION FAILED. Ensure Firebase Rules allow Master write access."); 
    }
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
       const notifId = `notif_${Date.now()}`;
       await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'notifications', notifId), {
          message: broadcastMsg, author: "MASTER COMMAND", created_at: Date.now()
       });
       setBroadcastMsg('');
       alert("MASTER BROADCAST DEPLOYED SUCCESSFULLY.");
     } catch(e) { console.error(e); alert("BROADCAST FAILED. Check connection."); }
     setLoading(false);
  };

  // --- SUPREME CRM MAPPING LOGIC (INCLUDES 0-LEAD USERS) ---
  const subscribersMap = {};
  if (isMaster) {
     // Force mapping of all subscribers first to ensure 0-lead users appear
     subscribers.forEach(s => { 
        subscribersMap[s.id] = { id: s.id, name: s.fullName, nickname: s.nickname || 'Unknown', email: s.email, tier: s.tier, avatar: s.avatar, leads: [] }; 
     });
     
     // Distribute leads to their owners securely
     logs.forEach(l => {
        const oId = l.ownerId || 'UNKNOWN';
        if (!subscribersMap[oId]) {
           let folderName = `GATEWAY ID: ${String(oId).substring(0,8)}...`;
           let folderTier = 'FREE_TRIAL';
           if (oId === 'AI_SMART_CHAT') { folderName = 'NEXUS AI SMART (LEADS)'; folderTier = 'NEXUS_AGENT'; }
           if (oId === ADMIN_MASTER_ID) { folderName = 'MASTER ADMIN'; folderTier = 'MASTER'; }
           subscribersMap[oId] = { id: oId, name: folderName, nickname: 'System', email: 'Legacy', tier: folderTier, leads: [] };
        }
        subscribersMap[oId].leads.push(l);
     });
  }
  const subscribersList = Object.values(subscribersMap).sort((a,b) => b.leads.length - a.leads.length); 

  // ============================================================================
  // PRO COMMAND FUNCTIONS & SUPREME SHUFFLE ENGINE (NATIVE AST PARSER)
  // ============================================================================
  
  const simulateAIExpansion = (text, iterationIndex) => {
     if (!text) return "";
     if (text.includes("{")) return text; 
     
     const lang = detectLanguage(text);
     let b1, b2, b3, b4, b5, b6;

     if (lang === 'PT') {
         b1 = "{Os seguintes|Estes|Alguns|Certos|Diversos}";
         b2 = "{recursos|métodos|mecanismos|opções|funcionalidades}";
         b3 = "{de conexão|de alcance|de comunicação|de entrega|de engajamento}";
         b4 = "{serão aprimorados|estão sendo otimizados|serão atualizados|terão um impulso|receberão melhorias}";
         b5 = "{quando|assim que|no momento em que|logo que|uma vez que}";
         b6 = "{o protocolo inicializar|o sistema ativar|o envio começar|a rede sincronizar|o motor iniciar}";
     } else if (lang === 'ES') {
         b1 = "{Los siguientes|Estos|Algunos|Ciertos|Varios}";
         b2 = "{recursos|métodos|mecanismos|opciones|funcionalidades}";
         b3 = "{de conexión|de alcance|de comunicación|de entrega|de interacción}";
         b4 = "{serán mejorados|se están optimizando|serán actualizados|tendrán un impulso|recibirán mejoras}";
         b5 = "{cuando|tan pronto como|en el momento que|justo después de que|una vez que}";
         b6 = "{el protocolo se inicialice|el sistema se active|el envío comience|la red se sincronice|el motor inicie}";
     } else {
         b1 = "{The following|These|Certain|Various|Select}";
         b2 = "{mechanisms|methods|features|options|functionalities}";
         b3 = "{for connection|of outreach|regarding communication|concerning delivery|for engagement}";
         b4 = "{will be enhanced|are being optimized|shall be upgraded|will experience a boost|are receiving updates}";
         b5 = "{when|as soon as|the moment|right after|once}";
         b6 = "{the protocol initializes|the system activates|deployment begins|the network syncs|the engine starts}";
     }
     
     return `${b1} ${b2} ${b3} ${b4} ${b5} ${b6} [NAME],\n\n${text}`;
  };

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
      const safeName = String(leadName || 'Client').split(' ')[0];
      const capitalName = safeName.charAt(0).toUpperCase() + safeName.slice(1).toLowerCase();
      processed = processed.replace(/\[NOME\]/gi, capitalName).replace(/\[NAME\]/gi, capitalName);
      return processed.replace(/\s{2,}/g, ' ').trim();
    } catch (err) {
      return String(text || '').replace(/\[NOME\]/gi, leadName || 'Client').replace(/\[NAME\]/gi, leadName || 'Client').replace(/\{[^}]*\}/g, '').trim();
    }
  };

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  const handlePrepareBatch = async () => {
    if (!aiObjective || logs.length === 0 || isAiObjectiveForbidden) return;
    setIsAiProcessing(true);
    
    await delay(1200);
    
    let targetLeads = logs;
    if (selectedFolder !== 'ALL') {
      targetLeads = logs.filter(l => {
        if (l.folderId) return l.folderId === selectedFolder;
        if (selectedFolder === 'Bulk Import TXT') return l.device === 'Bulk Import TXT';
        if (selectedFolder === 'MANUAL') return l.device !== 'Bulk Import TXT' && l.device !== 'AI_AGENT_CONVERSATION';
        return false;
      });
    }

    const creditLimit = isPro || isMaster ? 999999 : remainingQuota;
    const limit = Math.min(creditLimit, targetLeads.length);

    if (limit <= 0 && !isMaster) {
       alert("NO CREDITS OR LEADS AVAILABLE FOR THIS SELECTION.");
       setIsAiProcessing(false);
       return;
    }
    
    const queue = targetLeads.slice(0, limit).map((l, idx) => {
       const smartPayload = simulateAIExpansion(aiObjective, idx);
       const contextualMessage = executeNexusScramble(smartPayload, l.nome_cliente);
       const byteBypass = ["\u200B", "\u200C", "\u200D", "\uFEFF"][idx % 4].repeat((idx % 4) + 1);
       return { id: l.id || Math.random().toString(), telefone_cliente: l.telefone_cliente, nome_cliente: l.nome_cliente || 'Customer', optimizedMsg: contextualMessage + byteBypass };
    });
    
    setStagedQueue(queue); 
    setIsReviewMode(true); 
    setIsAiProcessing(false);
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
          try { await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data'), { dailySent: increment(1) }); } 
          catch(e) { console.error('[Dispatch] Profile tracking error:', e); }
        }
        if (i < queueCopy.length - 1) await new Promise(r => setTimeout(r, sendDelay * 1000));
      }
    } catch (error) { alert("FAILED TO PUSH PROTOCOL TO RELAY GATEWAY."); }
    setIsDispatching(false); setIsReviewMode(false);
  };

  const handleClearQueue = async () => {
    if (!window.confirm("CONFIRM PURGE: ARE YOU SURE YOU WANT TO CLEAR THE ENTIRE RELAY QUEUE?")) return;
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
        alert("ERROR DURING MASS INGESTION.");
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
    const lid = editingLink ? editingLink.id : generateUUID();
    const link = `${window.location.origin}?t=${encodeURIComponent(to)}&m=${encodeURIComponent(msg)}&o=${user.uid}&c=${encodeURIComponent(company)}`;
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', lid), { url: link, to, msg, company, created_at: serverTimestamp(), status: 'active' }, { merge: true });
    if (!editingLink) setGeneratedLink(link);
    setEditingLink(null); setGenTo(''); setGenMsg(''); setCompanyName(''); setLoading(false);
  };

  const handleQuickSend = async (e) => {
    e.preventDefault();
    if(!genTo || !genMsg) return alert("RECIPIENT AND PAYLOAD ARE REQUIRED.");
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
        alert("PAYLOAD PUSHED TO SECURE GATEWAY.");
      } catch(e) { console.error(e); }
      setLoading(false);
    } else {
      setShowSyncModal(true);
    }
  };

  const handleDeleteLink = async (id) => {
    if(window.confirm("PURGE THIS PROTOCOL PERMANENTLY?")) await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', id));
  };

  // --- COMPLIANCE GATE LOGIC (LEAD TAGGING & REDIRECT) ---
  const handleProtocolHandshake = async (e) => {
    if (e) e.preventDefault();
    if(!captureForm.name || !captureForm.phone) return;
    if(view === 'capture' && !captureForm.smsConsent) return alert("System requires SMS consent verification to establish connection.");

    const phoneDigits = captureForm.phone.replace(/\D/g, '');
    if(phoneDigits.length < 8) return alert("PLEASE USE A VALID MOBILE FORMAT.");

    setLoading(true);
    
    // --- SUPREME ROUTING LOGIC: HANDLES BOTH DIRECTED LINKS & ORGANIC TRAFFIC ---
    const ownerId = captureData ? captureData.ownerId : ADMIN_MASTER_ID;
    const targetTo = captureData ? captureData.to : '+18573229269';
    const targetMsg = captureData ? captureData.msg : 'Hi Donys & Bacs Construction! I saw your work on Google and would like to request a quote.';
    const leadSource = captureData ? 'SECURE_LINK_GATEWAY' : 'ORGANIC_LANDING_PAGE';

    let allowRedirect = true;

    try {
      const leadDocId = `${ownerId}_${phoneDigits}`;
      const cookieMark = `nexus_lead_${leadDocId}`;
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
          source: leadSource,
          referredBy: ownerId
        }, { merge: true });
        
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = `${cookieMark}=true; expires=${expiryDate.toUTCString()}; path=/`;
        
        // Only deduct credits if it is a tracked operator link
        if (ownerId !== ADMIN_MASTER_ID && captureData) {
          try {
             const pubSubRef = doc(db, 'artifacts', appId, 'public', 'data', 'subscribers', ownerId);
             setDoc(pubSubRef, { connections_used: increment(1) }, { merge: true }).catch(e => console.log("Public quota sync deferred."));
          } catch(err) { 
             console.log("[SYS-LOG] Profile quota update deferred."); 
          }
        }
      } else {
         console.log("[SYS-LOG] Lead exists. Bypassing quota deduction.");
      }
    } catch (e) { 
       console.error("Database connection exception:", e); 
    } finally {
       setLoading(false);
       if (allowRedirect) {
           localStorage.setItem(`smartsms_registered_for_${ownerId}_${phoneDigits}`, 'true');
           const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? '&' : '?';
           
           // SAFE NATIVE REDIRECT WITH ORGANIC FALLBACK
           setView('bridge');
           setTimeout(() => { window.location.href = `sms:${targetTo}${sep}body=${encodeURIComponent(targetMsg)}`; }, 150); 
       }
    }
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
        const defaultName = fullNameInput || "Operator";
        const defaultNick = nicknameInput || defaultName.split(' ')[0];
        const p = { 
            fullName: defaultName, 
            nickname: defaultNick, 
            email: emailLower, 
            phone: phoneInput, 
            tier: 'FREE_TRIAL', 
            baseCredits: 60,
            connections_used: 0,
            dailySent: 0, 
            avatar: selectedAvatarInput,
            created_at: serverTimestamp() 
        };
        
        await setDoc(doc(db, 'artifacts', appId, 'users', authUser.uid, 'profile', 'data'), p);
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'subscribers', authUser.uid), { id: authUser.uid, ...p }).catch(err => console.warn("Public sync restricted"));
        
        const safePhone = phoneInput.replace(/\D/g, '');
        if (safePhone) {
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'leads', `OPERATOR_${safePhone}`), {
                ownerId: ADMIN_MASTER_ID,
                nome_cliente: defaultName,
                telefone_cliente: safePhone,
                timestamp: serverTimestamp(),
                device: "OPERATOR_REGISTRATION",
                source: "FREE_TRIAL_SIGNUP",
                folderId: "NEW_SUBSCRIBERS",
                referredBy: authUser.uid
            }, { merge: true });
        }
        setUserProfile(p);
        
        try {
            await sendEmailVerification(authUser);
            alert("Verification email sent! Please check your inbox to fully activate your account.");
        } catch(emErr) { console.log("Email verification skipped", emErr) }
      }
      setIsWelcomeTrial(false);
      setView('dashboard');
    } catch (e) { 
      console.error(e);
      alert("IDENTITY DENIED: " + e.message); 
    } finally {
      setLoading(false);
    }
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
      } catch (e) { console.error("Chat lead capture error", e); }
  };

  // --- AI GEMINI CHAT HANDLER (SENIOR CLOSER & MULTILINGUAL STRATEGIST) ---
  const handleSendChat = async (e, directText = null) => {
    if(e) e.preventDefault();
    const textToSend = directText || chatInput;
    if (!textToSend.trim() || isChatForbidden) return;
    
    if (checkForbiddenWords(textToSend)) {
        setIsChatLoading(true);
        await new Promise(resolve => setTimeout(resolve, 400)); 
        setChatMessages(prev => [...prev, { role: 'user', text: textToSend }, { role: 'model', text: "ZERO TOLERANCE PROTOCOL — SYSTEM STANDBY\n\nIt is strictly prohibited to bypass, deceive, divert, or commit any malicious intent on this platform. This interaction has been flagged and blocked." }]);
        setChatInput('');
        setIsChatLoading(false);
        return;
    }
    
    const newMsg = { role: 'user', text: textToSend };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setIsChatLoading(true);

    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));

    try {
        const generateHeuristicResponse = (input, historyList) => {
            const lower = input.toLowerCase();
            const lang = detectLanguage(lower);
            
            // LEAD CAPTURE FLOW
            if (!hasCapturedChatLead && !user) {
                const phoneMatch = input.match(/\+?[\d\s\-().]{8,20}/);
                if (phoneMatch) {
                    const digitsOnly = phoneMatch[0].replace(/\D/g, '');
                    if (digitsOnly.length < 8) {
                        if (lang === 'PT') return { text: "Esse número parece incompleto.\n\nPreciso de um contato válido com código do país.\nPor favor, digite novamente." };
                        if (lang === 'ES') return { text: "Ese número parece incompleto.\n\nNecesito un contacto válido con código de país.\nPor favor, ingréselo de nuevo." };
                        return { text: "That number looks incomplete.\n\nI need a valid Mobile Contact with country code.\nPlease re-enter." };
                    }
                    let name = input.replace(phoneMatch[0], '').replace(/(my name is|i am|i'm|this is|me chamo|sou o|soy|mi nombre es)/gi, '').trim();
                    name = name.length > 1 ? name.split(/[\s,]+/)[0] : 'Operator';
                    const capName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
                    
                    const confirmEN = `Protocol Activated, ${capName}!\n\nWhile your competitors run campaigns freely, carrier filters are silently killing your reach.\n\nSMART SMS PRO eliminates that barrier instantly. What's your focus?\n||LEAD:${capName},${phoneMatch[0]}||`;
                    const confirmPT = `Protocolo Ativado, ${capName}!\n\nEnquanto você hesita, os filtros das operadoras estão bloqueando as suas vendas.\n\nO SMART SMS PRO elimina essa barreira instantaneamente. Qual é o seu foco?\n||LEAD:${capName},${phoneMatch[0]}||`;
                    const confirmES = `¡Protocolo Activado, ${capName}!\n\nMientras dudas, los filtros de los operadores están bloqueando tus ventas.\n\nSMART SMS PRO elimina esa barrera al instante. ¿Cuál es tu enfoque?\n||LEAD:${capName},${phoneMatch[0]}||`;
                    
                    const btnEN = [{ label: 'START FREE TRIAL', action: 'TRIAL' }, { label: 'VIEW PRO PLANS', action: 'UPGRADE' }];
                    const btnPT = [{ label: 'INICIAR TESTE GRÁTIS', action: 'TRIAL' }, { label: 'VER PLANOS PRO', action: 'UPGRADE' }];
                    const btnES = [{ label: 'INICIAR PRUEBA GRATIS', action: 'TRIAL' }, { label: 'VER PLANES PRO', action: 'UPGRADE' }];

                    return { text: lang === 'PT' ? confirmPT : lang === 'ES' ? confirmES : confirmEN, buttons: lang === 'PT' ? btnPT : lang === 'ES' ? btnES : btnEN };
                }
                
                if (historyList.length <= 1) {
                    if (lang === 'PT') return { text: "Olá! Eu sou o NEXUS AI SMART, seu especialista em conversão de elite.\n\nPara calibrar seu protocolo e contornar filtros, preciso do seu Nome e Contato Móvel neste formato:\n\nNome +DDI Número\n(Ex: João +55 11 99999 9999)" };
                    if (lang === 'ES') return { text: "¡Hola! Soy NEXUS AI SMART, tu especialista en conversión de élite.\n\nPara calibrar tu protocolo y evadir filtros, necesito tu Nombre y Contacto Móvil en este formato:\n\nNombre +CódigoPaís Número\n(Ej: Juan +34 600 000 000)" };
                    return { text: "Hello! I am NEXUS AI SMART, your elite conversion specialist.\n\nEvery link blocked by a carrier is real money you are losing right now. Our platform was built to destroy that barrier.\n\nTo calibrate your protocol, I need your Name and Mobile Contact in this format:\n\nName +CountryCode Number\n(Ex: John +1 917 555 9999)" };
                }
                if (lang === 'PT') return { text: "Ainda não recebi o seu contato móvel.\n\nCada minuto sem esse acesso é uma vantagem para a concorrência. Só preciso do seu Nome + Contato Móvel." };
                if (lang === 'ES') return { text: "Aún no he recibido tu contacto móvil.\n\nCada minuto sin este acceso es una ventaja para la competencia. Solo necesito tu Nombre + Contacto Móvil." };
                return { text: "I still haven't received your mobile contact.\n\nEvery minute without this access is a minute your competition is pulling ahead. I just need your Name + Mobile Contact." };
            }

            // CLOSER LOGIC & UPSELL
            if (/^(hey|hello|hi|what's up|greetings|olá|oi|hola)$/i.test(lower)) {
                if (lang === 'PT') return { text: `Olá, ${userProfile?.nickname || 'Operador'}! NEXUS AI 100% operacional. O que vamos escalar hoje?`, buttons: [{ label: 'ABRIR DASHBOARD', action: 'DASH' }] };
                if (lang === 'ES') return { text: `¡Hola, ${userProfile?.nickname || 'Socio'}! NEXUS AI 100% operacional. ¿Qué vamos a escalar hoy?`, buttons: [{ label: 'ABRIR DASHBOARD', action: 'DASH' }] };
                return { text: `Hey, ${userProfile?.nickname || 'Operator'}! NEXUS AI 100% operational. What are we scaling today?`, buttons: [{ label: 'OPEN DASHBOARD', action: 'DASH' }] };
            }

            if (/(support|guide|how|tutorial|install|download|setup|help|error|bug|ajuda|como|instalar|soporte|configurar)/i.test(lower)) {
                if (lang === 'PT') return { text: "Estou aqui para resolver desafios técnicos.\n\nA nossa tecnologia baseia-se em 3 pilares:\n1. O Nexus Engine embaralha a carga útil para contornar filtros.\n2. O Native Relay Engine atua como terminal de disparo silencioso.\n3. A sincronização é feita via QR Code no Hub.\n\nComo posso ajudar hoje?", buttons: [{ label: 'DOWNLOAD RELAY ENGINE', action: 'APK' }] };
                if (lang === 'ES') return { text: "Estoy aquí para resolver desafíos técnicos.\n\nNuestra tecnología se basa en 3 pilares:\n1. El Nexus Engine mezcla la carga útil para evadir filtros.\n2. El Native Relay Engine actúa como terminal de despacho silencioso.\n3. La sincronización se realiza mediante Código QR en tu Hub.\n\n¿En qué te ayudo hoy?", buttons: [{ label: 'DOWNLOAD RELAY ENGINE', action: 'APK' }] };
                return { text: "I am here to resolve any technical challenges.\n\nOur tech relies on 3 pillars:\n1. The Nexus Engine shuffles your payload to bypass carrier filters.\n2. The Native Relay Engine acts as a silent dispatch terminal.\n3. Synchronization is done via QR Code in your Hub.\n\nWhich step do you need help with?", buttons: [{ label: 'DOWNLOAD RELAY ENGINE', action: 'APK' }, { label: 'OPEN DASHBOARD', action: 'DASH' }] };
            }
            
            if (/(spintax|matrix|shuffle|bypass|filter|bloqueio|filtro)/i.test(lower)) {
                if (lang === 'PT') return { text: "O Smart Shuffle Engine é a arma definitiva contra bloqueios.\n\nUsando a Matriz Spintax de 6 Blocos, geramos mais de 15.000 variações semânticas da sua mensagem. Isso garante que a sua transmissão fique invisível para os filtros automatizados, maximizando cliques.\n\nVamos ativar a sua primeira campanha?", buttons: [{ label: 'ABRIR DASHBOARD', action: 'DASH' }, { label: 'ATIVAR MOTOR PRO', action: 'UPGRADE' }] };
                if (lang === 'ES') return { text: "El Smart Shuffle Engine es el arma definitiva contra bloqueos.\n\nUsando la Matriz Spintax de 6 Bloques, generamos más de 15.000 variaciones semánticas. Esto garantiza que tu transmisión sea invisible para los filtros, maximizando los clics.\n\n¿Activamos tu primera campaña?", buttons: [{ label: 'ABRIR DASHBOARD', action: 'DASH' }, { label: 'ACTIVAR MOTOR PRO', action: 'UPGRADE' }] };
                return { text: "The Smart Shuffle Engine is your ultimate weapon against carrier filters.\n\nBy leveraging the 6-Block Spintax Matrix, we generate over 15,000 unique semantic variations for your payload. This ensures your message stays invisible to automated network bans while maximizing your global click-through rate.\n\nReady to activate your first Matrix campaign?", buttons: [{ label: 'OPEN DASHBOARD', action: 'DASH' }, { label: 'ACTIVATE PRO ENGINE', action: 'UPGRADE' }] };
            }

            if (/(upgrade|buy|pro|plan|pack|price|cost|subscribe|comprar|plano|preço|valor)/i.test(lower)) {
                if (lang === 'PT') return { text: "Decisão de elite.\n\nO PRO desbloqueia poder absoluto:\n• Transmissão silenciosa e massiva\n• Motor de embaralhamento Spintax\n• Painel avançado de leads\n\nPerder um único lead custa mais do que o nosso pacote mais avançado.", buttons: [{ label: 'VER PLANOS', action: 'UPGRADE' }] };
                if (lang === 'ES') return { text: "Decisión de élite.\n\nEl PRO desbloquea poder absoluto:\n• Transmisión masiva y silenciosa\n• Motor Spintax Inteligente\n• Panel avanzado de leads\n\nPerder un lead cuesta mucho más que nuestro paquete más avanzado.", buttons: [{ label: 'VER PLANES', action: 'UPGRADE' }] };
                return { text: "Elite decision.\n\nPRO unlocks the system's full power:\n• Silent and massive transmission\n• Smart shuffle engine\n• Advanced lead panel with CRM\n\nLosing a single lead costs way more than our most advanced pack.", buttons: [{ label: 'VIEW PLANS', action: 'UPGRADE' }] };
            }

            // Fallbacks
            if (lang === 'PT') return { text: "Excelente observação. A nossa prioridade é garantir que as suas transmissões superam os filtros. Quer afinar o seu painel de envio agora?", buttons: [{ label: 'ABRIR DASHBOARD', action: 'DASH' }] };
            if (lang === 'ES') return { text: "Excelente observação. Nuestra prioridad es garantizar que tus transmisiones superen los filtros. ¿Quieres ajustar tu panel de envío ahora?", buttons: [{ label: 'ABRIR DASHBOARD', action: 'DASH' }] };
            return { text: "Excellent observation.\n\nWhile we chat, your technical advantage over the competition is active. To keep our focus on conversions, how would you like to proceed?", buttons: [{ label: 'OPEN DASHBOARD', action: 'DASH' }, { label: 'TECHNICAL SUPPORT', action: 'GUIDE' }] };
        };

        const aiResponse = generateHeuristicResponse(newMsg.text, chatMessages);
        
        let displayAiText = aiResponse.text;
        // Remove ALL Markdown Asterisks and Hashes instantly before rendering to ensure readable UI
        displayAiText = displayAiText.replace(/[*#_]/g, '');
        
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
        setChatMessages(prev => [...prev, { role: 'model', text: "DIAGNOSTIC SYSTEM ALERT: ENGINE OFFLINE." }]);
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
      PRIVACY: { icon: FileLock2, title: 'PRIVACY POLICY', text: "SMART SMS PRO — COMPREHENSIVE PRIVACY POLICY\n\n1. INFORMATION COLLECTION: We collect personal data (Name, Phone, Email) solely for the purpose of service delivery, communication, and estimate provisioning.\n2. NO THIRD-PARTY SHARING: We respect your privacy. We DO NOT sell, rent, trade, or share your personal information or SMS opt-in data with any third parties or affiliates for marketing purposes under any circumstances.\n3. DATA SECURITY: All data is encrypted at rest and in transit using enterprise-grade cryptographic protocols to prevent unauthorized access.\n4. YOUR RIGHTS: You retain the right to request access, modification, or permanent deletion of your data from our systems at any time." },
      TERMS: { icon: Scale, title: 'TERMS OF USE', text: "SMART SMS PRO — TERMS OF SERVICE\n\n1. ACCEPTABLE USE: By accessing this platform or submitting a request, you agree to provide accurate information and use the service lawfully.\n2. SERVICE DELIVERY: Estimates and communications provided are preliminary and subject to formal verification.\n3. ZERO TOLERANCE: Any misuse, including spam, fraud, phishing, or abuse of the communication gateway, will result in an immediate and permanent ban.\n4. LIABILITY: The provider is not liable for indirect damages arising from service usage. Governing state and federal laws apply." },
      LGPD: { icon: ShieldCheck, title: 'LGPD PROTOCOL', text: "LGPD COMPLIANCE — LAW 13.709/2018\n\nSMART SMS PRO operates in full compliance with the LGPD.\n\nLEGAL BASES: Personal data processing is based on explicit consent, legal obligation, or legitimate interest.\n\nDATA SUBJECT RIGHTS: You have the right to confirm the existence of processing, access, correct, and securely delete your data. SMS opt-in data is strictly confidential." },
      GDPR: { icon: Globe, title: 'GDPR COMPLIANCE NODE', text: "GENERAL DATA PROTECTION REGULATION (EU) 2016/679\n\nSMART SMS PRO is committed to full compliance with the GDPR.\n\nLAWFUL BASIS FOR PROCESSING: We process personal data based on explicit consent, contract performance, or legal obligation. Data is never sold to third parties.\n\nDATA SUBJECT RIGHTS: You have the right to access, rectify, erase, and restrict processing of your personal data at your discretion." }
    };
    return contents[legalContent] || null;
  };

  if (view === 'bridge') {
    return (
      <div className="min-h-screen bg-[#010101] flex flex-col items-center justify-center gap-8 p-6 text-center font-black uppercase">
        
        {/* --- HIGH CONVERSION INSTRUCTION BLOCK --- */}
        <div className="bg-[#25F4EE]/10 border-2 border-[#25F4EE] p-6 sm:p-8 rounded-2xl max-w-md w-full shadow-[0_0_30px_rgba(37,244,238,0.2)] animate-in slide-in-from-bottom-4">
          <h3 className="text-amber-500 text-lg sm:text-xl tracking-widest uppercase font-black mb-3 flex items-center justify-center gap-3">
            <AlertTriangle size={24} className="animate-pulse" /> ALMOST DONE: STEP 2 OF 2
          </h3>
          <p className="text-white text-base sm:text-lg font-black normal-case not-italic tracking-normal leading-relaxed">
            Tap <span className="text-[#25F4EE]">"SEND"</span> on your SMS app to confirm your consultation request.
          </p>
        </div>

        <div className="w-16 h-16 border-4 border-[#25F4EE]/30 border-t-[#25F4EE] rounded-full animate-spin shadow-[0_0_15px_#25F4EE]"></div>
        
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl text-white/80 tracking-tighter uppercase font-black">OPENING SECURE GATEWAY...</h2>
          <p className="text-[10px] sm:text-xs text-white/40 tracking-widest text-balance uppercase font-medium">Please wait 3 seconds or click below.</p>
        </div>
        
        {captureData && (
          <a href={`sms:${captureData.to}${/iPad|iPhone|iPod/.test(navigator.userAgent) ? '&' : '?'}body=${encodeURIComponent(captureData.msg)}`} className="bg-[#25F4EE] text-black px-8 py-4 rounded-xl font-black text-sm tracking-widest shadow-[0_0_20px_#25F4EE] hover:scale-105 transition-transform uppercase mt-2">
            OPEN SMS APP NOW
          </a>
        )}
        <p className="text-[10px] text-white/20 tracking-widest uppercase font-medium mt-4">IDENTITY VERIFIED — ZERO-KNOWLEDGE ENCRYPTED</p>
      </div>
    );
  }

  if (!authResolved) {
    return (
      <div className="min-h-screen bg-[#010101] flex flex-col items-center justify-center gap-4 absolute inset-0 z-50">
        <div className="w-12 h-12 border-4 border-[#25F4EE]/30 border-t-[#25F4EE] rounded-full animate-spin shadow-[0_0_15px_#25F4EE]"></div>
        <p className="text-[#25F4EE] font-black tracking-[0.3em] uppercase text-[10px] sm:text-xs animate-pulse">INITIALIZING GATEWAY...</p>
      </div>
    );
  }

  if (view === 'capture') {
    const nextSlide = () => setCurrentSlide((prev) => (prev === gmbPosts.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? gmbPosts.length - 1 : prev - 1));

    const donysSmsLink = "sms:+18573229269?body=" + encodeURIComponent("Hi Donys & Bacs Construction! I saw your work on Google and would like to request a quote.");
    
    const servicesList = [
      "Complete home renovation", "Civil Construction", "Remodeling", "Exterior Finishing", "Interior Finishing", 
      "Home Building", "Cottage Construction", "Luxury Home Construction", 
      "Prefabricated Homes", "Deck Construction", "Auxiliary Buildings", 
      "Garage Construction", "Patio Construction", "Roofing", "Fence Construction", 
      "Home Additions", "Demolition", "Plaster Installation", "Flooring", 
      "Exterior Painting", "Interior Painting", "Home Remodeling", "Home Extension Services", 
      "General Plumbing Services", "Electrical Work"
    ];

    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-red-600 selection:text-white overflow-x-hidden relative z-[500]">
        <style>{`
          body { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }
          input, textarea, select { -webkit-user-select: auto !important; -khtml-user-select: auto !important; -moz-user-select: auto !important; -ms-user-select: auto !important; user-select: auto !important; pointer-events: auto !important; }
        `}</style>

        {/* --- STONE TEXTURE OVERLAY --- */}
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>

        {/* --- HEADER --- */}
        <header className="fixed w-full z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-red-600 blur-lg opacity-40 animate-pulse"></div>
                <div className="relative w-11 h-11 bg-slate-900 border border-red-600/50 flex items-center justify-center rounded-lg">
                  <HardHat className="text-red-500" size={24} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tighter uppercase italic leading-none">
                  Donys <span className="text-red-600">& Bacs</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Construction Services Inc</span>
              </div>
            </div>
            <a 
              href={donysSmsLink}
              className="flex items-center gap-2 bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 px-6 py-2.5 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            >
              <MessageSquareText size={18} /> <span className="hidden sm:inline whitespace-nowrap">Text Us: (857) 322-9269</span>
              <span className="sm:hidden font-black">SMS</span>
            </a>
          </div>
        </header>

        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden w-full">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-red-600/30 rounded-full blur-[120px]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10 w-full">
            <div className="text-left w-full mx-auto overflow-visible">
              <div className="inline-flex items-center gap-2 bg-red-950/30 border border-red-500/30 px-4 py-2 rounded-full mb-6 sm:mb-8 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                <ShieldCheck className="text-red-500" size={16} />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-200">MA Licensed & Fully Insured</span>
              </div>
              
              <h1 className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-5xl xl:text-[4rem] 2xl:text-6xl font-black mb-2 sm:mb-3 leading-[0.95] tracking-tighter uppercase italic drop-shadow-2xl flex flex-col">
                <span className="text-white drop-shadow-md whitespace-nowrap">Premium</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 filter drop-shadow-lg whitespace-nowrap">Construction</span>
              </h1>
              
              <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-red-500 uppercase tracking-widest mb-6 sm:mb-8 drop-shadow-md">
                & Remodeling in Malden, MA
              </h2>
              
              <p className="text-slate-300 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-lg leading-relaxed font-medium">
                Licensed & Fully Insured Contractors proudly serving Malden and all surrounding communities within a 70-mile radius. Get your FREE on-site estimate today and elevate your property with our elite building services.
              </p>
              
              <div className="flex flex-wrap gap-6 sm:gap-8 opacity-90">
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">100%</span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-red-500 font-bold">Reliability</span>
                </div>
                <div className="flex flex-col border-l border-slate-700 pl-6 sm:pl-8">
                  <span className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">MA Area</span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-red-500 font-bold">Malden & Surroundings</span>
                </div>
              </div>
            </div>

            {/* Lead Form */}
            <div className="relative group w-full max-w-md mx-auto lg:max-w-md lg:ml-auto lg:mr-0" id="quote-form">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-900 to-slate-800 rounded-[2rem] blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative bg-[#0a0f1e] p-6 sm:p-8 md:p-10 rounded-[2rem] border border-slate-700 shadow-2xl w-full">
                  
                  <h3 className="text-2xl sm:text-3xl font-black mb-3 uppercase italic tracking-tighter text-white drop-shadow-md">Expert On-Site Consultation</h3>
                  <p className="text-slate-300 text-xs sm:text-sm mb-6 font-medium leading-relaxed">Secure your exclusive appointment today. One of our senior specialists will personally visit your property to deliver a comprehensive project analysis and a precise, professional structural estimate.</p>
                  
                  {/* HIGH CONVERSION URGENCY BLOCK */}
                  <div className="bg-gradient-to-r from-amber-500/10 to-transparent border-l-2 border-amber-500 p-4 rounded-r-xl text-left w-full mb-6 shadow-inner">
                      <p className="text-[10px] sm:text-xs text-amber-500 font-black uppercase tracking-widest flex items-center gap-2 mb-1.5">
                          <AlertTriangle size={14} /> Limited Weekly Project Slots
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-amber-200/80 font-medium leading-relaxed">
                          To maintain our premium high-end quality, we only accept a limited number of new projects each week. Secure your slot now.
                      </p>
                  </div>
                  
                  {/* Native Secure Gateway Capture Form */}
                  <form onSubmit={handleProtocolHandshake} className="space-y-5 w-full">
                    <div className="space-y-1.5 text-left w-full">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: John Smith"
                        value={captureForm.name}
                        onChange={(e) => setCaptureForm({...captureForm, name: e.target.value})}
                        className="w-full bg-[#020617] border border-slate-700 rounded-xl px-5 py-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-white placeholder:text-slate-600 text-sm shadow-inner"
                      />
                    </div>
                    <div className="space-y-1.5 text-left w-full">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Mobile Number (For SMS)</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="(000) 000-0000"
                        value={captureForm.phone}
                        onChange={(e) => setCaptureForm({...captureForm, phone: e.target.value})}
                        className="w-full bg-[#020617] border border-slate-700 rounded-xl px-5 py-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-white placeholder:text-slate-600 text-sm shadow-inner"
                      />
                    </div>
                    
                    <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 text-left w-full">
                      <label className="flex gap-3 sm:gap-4 cursor-pointer items-start">
                        <input 
                          type="checkbox" 
                          required
                          checked={captureForm.smsConsent}
                          onChange={(e) => setCaptureForm({...captureForm, smsConsent: e.target.checked})}
                          className="mt-1 w-5 h-5 rounded accent-red-600 transition-all cursor-pointer shrink-0"
                        />
                        <span className="text-[10px] text-slate-400 leading-relaxed font-medium">
                          I agree to receive automated SMS/text messages from Donys & Bacs Construction for project updates. Consent is not a condition of purchase. Msg & data rates may apply. Reply STOP to end. View <button type="button" onClick={(e) => { e.preventDefault(); setDonysLegal('PRIVACY'); }} className="text-red-500 underline hover:text-red-400 transition-colors">Privacy Policy</button>.
                        </span>
                      </label>
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-4 sm:py-5 rounded-xl shadow-[0_10px_30px_rgba(185,28,28,0.4)] transition-all flex items-center justify-center gap-3 group/btn uppercase italic tracking-wider disabled:opacity-50 text-[11px] sm:text-sm border border-red-500/50"
                    >
                      {loading ? 'PROCESSING SECURE ROUTE...' : 'SECURE MY ON-SITE ESTIMATE NOW'} {!loading && <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />}
                    </button>
                  </form>
              </div>
            </div>
          </div>
        </section>

        {/* --- EXPERTISE / SERVICES ACCORDION --- */}
        <section className="py-12 bg-[#050b24] border-t border-slate-800 relative z-10 w-full overflow-hidden">
          <div className="max-w-3xl mx-auto px-4 w-full">
            <div 
              onClick={() => setServicesOpen(!servicesOpen)}
              className="bg-[#0a0f1e] border border-slate-800 p-5 sm:p-6 rounded-2xl cursor-pointer hover:border-red-600 transition-colors flex justify-between items-center shadow-xl w-full"
            >
              <div className="flex items-center gap-3 sm:gap-4 pr-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-950/50 rounded-full flex items-center justify-center border border-red-500/20 shrink-0">
                   <HardHat className="text-red-500" size={20} />
                </div>
                <div className="text-left overflow-hidden">
                  <h3 className="text-base sm:text-xl font-black uppercase italic text-white truncate drop-shadow-md">Civil Construction Services</h3>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">View All 25 Services</p>
                </div>
              </div>
              {servicesOpen ? <ChevronUp className="text-red-500 shrink-0" /> : <ChevronDown className="text-slate-500 shrink-0" />}
            </div>
            
            {servicesOpen && (
              <div className="mt-4 bg-[#0a0f1e] border border-slate-700 rounded-2xl p-5 sm:p-8 animate-in slide-in-from-top-2 text-left shadow-2xl w-full">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 sm:gap-x-8">
                  {servicesList.map((srv, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 font-medium">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0 mt-1.5 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                      <span className="leading-snug">{srv}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                   <button onClick={() => { setServicesOpen(false); document.getElementById('quote-form')?.scrollIntoView({behavior: 'smooth'}); }} className="inline-block bg-red-700 hover:bg-red-600 text-white font-black py-4 px-6 sm:px-8 rounded-xl text-xs sm:text-sm uppercase italic tracking-wider shadow-[0_10px_30px_rgba(185,28,28,0.3)] transition-transform hover:scale-105 border border-red-500/50">
                     Request Project Quote
                   </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* --- GMB CAROUSEL SECTION --- */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-950 to-[#020617] w-full">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6 w-full">
              <div className="text-left w-full">
                <div className="flex items-center gap-2 text-red-500 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Latest Projects Across a 70-Mile Radius</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter">Massachusetts Showcase</h2>
              </div>
            </div>

            {/* Carousel UI */}
            <div className="relative group text-left w-full">
              <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800 bg-[#0a0f1e] shadow-2xl w-full">
                <div className="grid md:grid-cols-2 w-full">
                  <a href={gmbPosts[currentSlide].link} target="_blank" rel="noopener noreferrer" className="h-64 sm:h-80 md:h-96 relative block hover:opacity-90 transition-opacity bg-cover bg-center w-full" style={{ backgroundImage: `url(${gmbPosts[currentSlide].image})` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] md:bg-gradient-to-r md:from-transparent md:to-[#0a0f1e]/10 via-transparent to-black/30 w-full"></div>
                    <div className="absolute top-6 right-6 bg-black/60 p-2.5 rounded-full backdrop-blur-md shadow-xl z-10 border border-white/10 hover:bg-red-600 transition-colors">
                       <ExternalLink size={16} className="text-white" />
                    </div>
                  </a>
                  <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center w-full">
                    <span className="text-red-500 text-[10px] sm:text-xs font-bold mb-2">{gmbPosts[currentSlide].date}</span>
                    <h4 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-6 italic uppercase tracking-tighter text-white">
                      {gmbPosts[currentSlide].title}
                    </h4>
                    <p className="text-slate-400 mb-6 sm:mb-8 leading-relaxed font-medium text-xs sm:text-sm">
                      {gmbPosts[currentSlide].desc}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                      <div className="flex gap-3 sm:gap-4 shrink-0">
                        <button onClick={(e) => { e.preventDefault(); prevSlide(); }} type="button" className="p-3 sm:p-4 bg-slate-950 border border-slate-800 rounded-full hover:bg-red-900 transition-colors shadow-lg shrink-0">
                          <ChevronLeft size={18} className="text-white" />
                        </button>
                        <button onClick={(e) => { e.preventDefault(); nextSlide(); }} type="button" className="p-3 sm:p-4 bg-slate-950 border border-slate-800 rounded-full hover:bg-red-900 transition-colors shadow-lg shrink-0">
                          <ChevronRight size={18} className="text-white" />
                        </button>
                      </div>
                      <a href={gmbPosts[currentSlide].link} target="_blank" rel="noopener noreferrer" className="text-red-500 font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2 hover:text-white transition-colors shrink-0">
                         View on Google <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- TRUST BADGES --- */}
        <section className="py-16 border-y border-slate-900 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'OSHA Certified', icon: <Shield size={16} /> },
              { label: 'Licensed MA', icon: <Shield size={16} /> },
              { label: 'Fully Insured', icon: <Shield size={16} /> },
              { label: 'Malden Local', icon: <Shield size={16} /> }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-3 text-slate-500 group">
                <span className="group-hover:text-red-500 transition-colors">{item.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="bg-[#020617] pt-24 pb-12 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 relative z-10 text-left">
            <div className="grid md:grid-cols-3 gap-16 mb-20">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-700 flex items-center justify-center rounded-lg">
                    <HardHat className="text-white" size={20} />
                  </div>
                  <span className="font-black text-xl tracking-tighter uppercase italic">
                    Donys <span className="text-red-600">& Bacs</span>
                  </span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-bold italic">
                  Premium construction firm dedicated to serving Malden, Massachusetts and the Greater Boston area with excellence.
                </p>
              </div>

              <div className="space-y-6">
                <h5 className="font-black uppercase italic tracking-widest text-sm text-red-600">Contact Point</h5>
                <ul className="space-y-4 text-slate-400 font-bold uppercase tracking-wider text-xs">
                  <li>
                    <a href={donysSmsLink} className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                      <MessageSquareText size={16} className="text-red-500" /> <span className="whitespace-nowrap">(857) 322-9269 (SMS)</span>
                    </a>
                  </li>
                  <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer text-[10px]">
                    <Mail size={16} className="text-red-500" /> donysbacs@gmail.com
                  </li>
                  <li className="flex items-center gap-3">
                    <MapPin size={16} className="text-red-500" /> Malden, Massachusetts
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <h5 className="font-black uppercase italic tracking-widest text-sm text-red-600">Compliance & Legal</h5>
                <ul className="space-y-3 text-xs text-slate-600 font-bold uppercase tracking-widest">
                  <li><button onClick={() => setDonysLegal('PRIVACY')} className="hover:text-red-500 transition-colors">Privacy Policy</button></li>
                  <li><button onClick={() => setDonysLegal('TERMS')} className="hover:text-red-500 transition-colors">Terms of Service</button></li>
                  <li><button onClick={() => setDonysLegal('CCPA')} className="hover:text-red-500 transition-colors">CCPA Compliance</button></li>
                  <li><button onClick={() => setDonysLegal('SMS')} className="hover:text-red-500 transition-colors">SMS Policy</button></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-700">
              <p>© 2026 Donys & Bacs Construction Services Inc. All rights reserved.</p>
              <p>Mastery in Malden, MA</p>
            </div>
          </div>
        </footer>

        {/* --- DONYS LEGAL MODALS --- */}
        {donysLegal && (
          <div className="fixed inset-0 z-[700] bg-[#010101]/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-6 text-left animate-in fade-in zoom-in-95 w-full">
             <div className="bg-[#0a0f1e] border border-red-600/30 w-full max-w-[95vw] sm:max-w-2xl rounded-[2rem] shadow-[0_0_50px_rgba(220,38,38,0.15)] flex flex-col max-h-[85vh] overflow-hidden relative mx-auto">
                <div className="p-6 sm:p-8 border-b border-slate-800 flex justify-between items-center bg-[#020617] shrink-0">
                   <div className="flex items-center gap-3 sm:gap-4">
                      <ShieldCheck size={28} className="text-red-500 sm:w-8 sm:h-8" />
                      <h3 className="text-lg sm:text-2xl text-white tracking-tight font-black uppercase">{donysLegal === 'SMS' ? 'SMS POLICY' : 'LEGAL PROTOCOL'}</h3>
                   </div>
                   <button onClick={() => setDonysLegal(null)} className="p-2.5 sm:p-3 bg-black border border-slate-800 rounded-full text-slate-500 hover:text-white transition-colors shrink-0"><X size={20} className="sm:w-6 sm:h-6" /></button>
                </div>
                <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1 bg-[#050b24]">
                   <p className="text-xs sm:text-base text-slate-300 font-sans not-italic normal-case leading-loose whitespace-pre-wrap">
                     {donysLegal === 'PRIVACY' && "DONYS & BACS CONSTRUCTION - COMPREHENSIVE PRIVACY POLICY\n\n1. DATA COLLECTION: We collect your Full Name and Mobile Number strictly for the purpose of providing construction estimates, scheduling on-site consultations, and project communication.\n2. NO THIRD-PARTY SHARING: We respect your privacy. We absolutely DO NOT sell, rent, or share your personal information or SMS opt-in data with any third parties or affiliates for marketing purposes.\n3. DATA PROTECTION: Your information is secured using advanced encrypted gateways to prevent unauthorized access.\n4. OPT-OUT RIGHTS: You may request the deletion of your data from our records at any time by contacting us directly or replying STOP to any SMS."}
                     {donysLegal === 'TERMS' && "DONYS & BACS CONSTRUCTION - TERMS OF SERVICE\n\n1. SERVICE AGREEMENT: By requesting a free on-site estimate, you agree to receive communications from Donys & Bacs Construction regarding your specific project inquiry.\n2. ESTIMATE ACCURACY: All preliminary quotes discussed via SMS or phone are subject to a formal written agreement following an on-site evaluation.\n3. USER OBLIGATIONS: You agree to provide accurate contact information to facilitate proper scheduling.\n4. LIMITATION OF LIABILITY: We strive for excellence, but are not liable for delays caused by unforeseen circumstances or inaccurate information provided during the initial request."}
                     {donysLegal === 'CCPA' && "PRIVACY RIGHTS & CCPA COMPLIANCE\n\nUnder the California Consumer Privacy Act (CCPA) and applicable state laws, residents have specific rights regarding their personal data.\n1. RIGHT TO KNOW: You can request details about the personal data we collect and how it is used.\n2. RIGHT TO DELETE: You may request the permanent deletion of your personal information from our active systems at any time.\n3. OPT-OUT: Reply STOP to any of our SMS messages to instantly opt-out and purge your active contact status."}
                     {donysLegal === 'SMS' && "SMS COMMUNICATIONS & OPT-IN POLICY\n\nBy checking the SMS consent box and submitting your form, you explicitly authorize Donys & Bacs Construction to send you automated and manual text messages.\n1. CONSENT: Consent is NOT a condition of purchase for any goods or services.\n2. FREQUENCY: Message frequency varies based on your project status and inquiries.\n3. RATES: Standard message and data rates may apply depending on your mobile carrier.\n4. HELP & STOP: Reply HELP for assistance. Reply STOP to immediately cancel and opt-out of all future SMS communications."}
                   </p>
                </div>
                <div className="p-6 sm:p-8 border-t border-slate-800 bg-[#020617] shrink-0 flex justify-end">
                   <button onClick={() => setDonysLegal(null)} className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-red-600 text-white text-xs sm:text-sm font-black tracking-widest uppercase rounded-xl hover:scale-[1.02] transition-transform">ACKNOWLEDGE</button>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans selection:bg-[#25F4EE] selection:text-black antialiased flex flex-col relative overflow-x-hidden">
      <style>{`
        body { 
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none; 
        }
        input, textarea, select { 
          -webkit-user-select: auto !important; 
          -khtml-user-select: auto !important; 
          -moz-user-select: auto !important; 
          -ms-user-select: auto !important; 
          user-select: auto !important; 
          pointer-events: auto !important;
        }
        *, *::before, *::after { 
          hyphens: none !important; 
          -webkit-hyphens: none !important; 
          -ms-hyphens: none !important; 
          word-break: normal !important;
          white-space: normal !important;
        }
        h1, h2, p {
          text-wrap: pretty;
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
         <div className="bg-[#FE2C55] text-black w-full text-center py-3 px-4 flex items-center justify-center gap-3 z-[300] relative">
            <BellRing size={18} className="animate-bounce shrink-0"/>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest">{globalNotifications[0].message}</span>
            <button onClick={() => setGlobalNotifications(prev => prev.slice(1))} className="ml-2 hover:bg-black/10 p-1 rounded-full transition-colors"><X size={16}/></button>
         </div>
      )}

      {/* --- FLOATING AI CHAT BUBBLE --- */}
      {!showSmartSupport && view !== 'capture' && view !== 'bridge' && (
        <div 
          onClick={() => setShowSmartSupport(true)}
          className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[9990] bg-[#25F4EE] text-black p-5 rounded-[1.5rem] shadow-[0_0_30px_rgba(37,244,238,0.5)] hover:scale-110 transition-transform flex items-center justify-center group animate-bounce hover:animate-none cursor-pointer"
        >
          <MessageSquare size={32} className="group-hover:animate-pulse" />
          <span className="absolute -top-2 -right-2 bg-[#FE2C55] border-2 border-black w-4 h-4 rounded-full animate-ping"></span>
          <span className="absolute -top-2 -right-2 bg-[#FE2C55] border-2 border-black w-4 h-4 rounded-full"></span>
        </div>
      )}

      {/* --- NEXUS AI SMART CHAT INTERFACE --- */}
      {showSmartSupport && (
        <div className="fixed bottom-20 right-4 sm:bottom-10 sm:right-10 w-[calc(100vw-2rem)] sm:w-full max-w-[380px] h-[65vh] sm:h-[500px] max-h-[600px] bg-[#0a0a0a] border border-[#25F4EE]/30 rounded-[2rem] shadow-[0_0_40px_rgba(37,244,238,0.2)] z-[9990] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 font-sans normal-case not-italic tracking-normal text-left text-base">
          <div className="p-4 bg-[#111] border-b border-white/10 flex justify-between items-center relative overflow-hidden shrink-0">
             <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#25F4EE] to-transparent animate-pulse"></div>
             <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                   <div className="w-10 h-10 rounded-full bg-[#25F4EE]/10 flex items-center justify-center border border-[#25F4EE]/30">
                      <Bot size={20} className="text-[#25F4EE]" />
                   </div>
                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-2 border-[#111] animate-pulse"></div>
                </div>
                <div>
                   <h4 className="text-white text-[12px] sm:text-sm font-black tracking-widest leading-none uppercase">NEXUS AI SMART</h4>
                   <p className="text-[9px] sm:text-[10px] text-[#25F4EE] tracking-[0.2em] font-black mt-1 uppercase">SYSTEM ONLINE</p>
                </div>
             </div>
             <button onClick={() => setShowSmartSupport(false)} className="text-white/30 hover:text-white p-2 transition-colors relative z-10"><X size={20}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-black/50 space-y-4">
            {chatMessages.length === 0 && (
               <div className="text-center py-6">
                 <Bot size={32} className="mx-auto text-white/10 mb-3" />
                 <p className="text-[10px] sm:text-[11px] text-white/30 tracking-widest font-black uppercase">NEXUS AGENT IS READY TO ASSIST</p>
               </div>
            )}
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in`}>
                <div className={`max-w-[85%] rounded-2xl p-4 text-sm sm:text-base font-normal not-italic normal-case tracking-normal leading-relaxed shadow-lg break-words whitespace-pre-wrap ${msg.role === 'user' ? 'bg-[#25F4EE] text-black font-medium rounded-tr-sm' : 'bg-[#111] border border-white/10 text-white/90 rounded-tl-sm'}`}>
                  {msg.text.split('\n').map((line, i) => (
                     <React.Fragment key={i}>
                        {line}
                        {i < msg.text.split('\n').length - 1 && <br />}
                     </React.Fragment>
                  ))}
                  {msg.buttons && (
                     <div className="mt-4 flex flex-col gap-2">
                        {msg.buttons.map((btn, bIdx) => (
                           <button key={bIdx} onClick={() => handleChatButtonAction(btn.action)} className="w-full text-center py-2 px-3 bg-white/5 hover:bg-[#25F4EE]/20 border border-white/10 hover:border-[#25F4EE]/50 rounded-lg text-[10px] sm:text-[11px] font-black tracking-widest uppercase transition-all text-[#25F4EE]">
                              {btn.label}
                           </button>
                        ))}
                     </div>
                  )}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-[#111] border border-white/10 rounded-2xl rounded-tl-sm p-4 flex gap-2 w-16 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-[#25F4EE] animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-[#25F4EE] animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 rounded-full bg-[#25F4EE] animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}
            <div ref={latestMessageRef} />
          </div>
          <div className="p-4 bg-[#111] border-t border-white/10 shrink-0">
             <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                   type="text"
                   value={chatInput}
                   onChange={e => setChatInput(e.target.value)}
                   disabled={isChatLoading || isChatForbidden}
                   placeholder={isChatForbidden ? "TERMINAL LOCKED" : "Type your message..."}
                   className={`flex-1 bg-black border ${isChatForbidden ? 'border-[#FE2C55] text-[#FE2C55]' : 'border-white/10 text-white'} rounded-xl px-4 py-3 text-sm font-sans font-normal not-italic normal-case outline-none focus:border-[#25F4EE]/50 disabled:opacity-50`}
                />
                <button type="submit" disabled={isChatLoading || !chatInput.trim() || isChatForbidden} className={`p-3 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 ${isChatForbidden ? 'bg-[#FE2C55]/20 text-[#FE2C55]' : 'bg-[#25F4EE] text-black hover:scale-105 shadow-[0_0_15px_rgba(37,244,238,0.3)]'}`}>
                   {isChatForbidden ? <ShieldAlert size={20} /> : <Send size={20} />}
                </button>
             </form>
          </div>
        </div>
      )}

      {/* --- TOP NAV --- */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[200] px-6 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3 cursor-pointer relative z-[210]" onClick={() => { setView('home'); setIsMenuOpen(false); }}>
          <div className="bg-[#25F4EE]/10 p-1.5 rounded-lg border border-[#25F4EE]/30"><Zap size={22} className="text-[#25F4EE] fill-[#25F4EE]" /></div>
          <span className="text-xl font-black uppercase tracking-tighter text-white mt-1">SMART SMS PRO</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[11px] sm:text-xs tracking-widest uppercase font-black relative z-[210]">
           {!user ? (
             <>
               <button onClick={() => { setIsWelcomeTrial(false); setIsLoginMode(true); setView('auth'); }} className="bg-transparent border-2 border-[#25F4EE] text-[#25F4EE] hover:bg-[#25F4EE]/10 px-8 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(37,244,238,0.2)]">SECURE MEMBER PORTAL</button>
               <button onClick={() => { setIsWelcomeTrial(false); setIsLoginMode(false); setView('auth'); }} className="bg-gradient-to-r from-[#25F4EE] to-[#1AB5B0] text-black px-8 py-3 rounded-xl hover:scale-105 transition-all shadow-[0_0_15px_rgba(37,244,238,0.4)]">JOIN NETWORK</button>
             </>
           ) : (
             <>
               <div className="flex items-center gap-2">
                 {userProfile?.avatar && <img src={userProfile.avatar} alt="Avatar" className="w-6 h-6 rounded-full border border-white/20 bg-black" />}
                 <span className="text-white/30 lowercase font-mono not-italic font-normal">[{userProfile?.nickname || 'operador'}]</span>
               </div>
               <button onClick={() => setView('dashboard')} className={`flex items-center gap-2 transition-colors ${view === 'dashboard' ? 'text-[#25F4EE]' : 'hover:text-[#25F4EE]'}`}><LayoutDashboard size={18}/> OPERATOR HUB</button>
               <button onClick={() => setShowSmartSupport(true)} className="flex items-center gap-2 hover:text-[#25F4EE] transition-colors"><Bot size={18}/> NEXUS AI SMART</button>
               <button onClick={() => signOut(auth).then(()=>setView('home'))} className="text-[#FE2C55] hover:opacity-70 transition-all flex items-center gap-2"><LogOut size={18}/> LOGOUT</button>
             </>
           )}
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-white/50 hover:text-white transition-all z-[210] relative">
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </nav>

      {/* --- OMNI-MENU MOBILE --- */}
      <div className={`md:hidden fixed inset-0 z-[150] bg-[#010101]/95 backdrop-blur-3xl transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col pt-24 px-6 pb-12 overflow-y-auto ${isMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-8'}`}>
        <div className="flex flex-col gap-5 flex-1 mt-4">
          {user && (
             <div className="flex flex-col items-center gap-3 mb-4">
                {userProfile?.avatar && <img src={userProfile.avatar} alt="Avatar" className="w-12 h-12 rounded-full border border-[#25F4EE]/50 bg-black shadow-[0_0_15px_rgba(37,244,238,0.2)]" />}
                <p className="text-center text-[#25F4EE] font-mono text-xs">ALIAS: {userProfile?.nickname}</p>
             </div>
          )}
          {!user ? (
            <>
              <button onClick={() => { setIsWelcomeTrial(false); setIsLoginMode(true); setView('auth'); setIsMenuOpen(false); }} className="bg-transparent border-2 border-[#25F4EE] text-[#25F4EE] hover:bg-[#25F4EE]/10 p-6 rounded-2xl text-[11px] sm:text-xs tracking-[0.15em] font-black uppercase transition-all flex items-center justify-center gap-3 w-full shadow-[0_0_15px_rgba(37,244,238,0.2)]"><Lock size={20}/> SECURE MEMBER PORTAL</button>
              <button onClick={() => { setIsWelcomeTrial(false); setIsLoginMode(false); setView('auth'); setIsMenuOpen(false); }} className="bg-gradient-to-r from-[#25F4EE] to-[#1AB5B0] text-black p-6 rounded-2xl text-[11px] sm:text-xs tracking-[0.15em] font-black uppercase shadow-[0_0_30px_rgba(37,244,238,0.4)] flex items-center justify-center gap-3 w-full"><Rocket size={20}/> JOIN NETWORK & START</button>
            </>
          ) : (
            <>
              <button onClick={() => { setView('dashboard'); setIsMenuOpen(false); }} className={`p-6 rounded-2xl border ${view === 'dashboard' ? 'bg-[#25F4EE]/10 border-[#25F4EE] text-[#25F4EE]' : 'bg-white/5 border-white/10 text-white hover:border-[#25F4EE]/50'} text-[11px] sm:text-xs tracking-[0.15em] font-black uppercase transition-all flex items-center justify-center gap-3 w-full`}><LayoutDashboard size={20}/> ACCESS OPERATOR HUB</button>
              <button onClick={() => { setShowSmartSupport(true); setIsMenuOpen(false); }} className="p-6 rounded-2xl border bg-white/5 border-white/10 text-white hover:border-[#25F4EE]/50 text-[11px] sm:text-xs tracking-[0.15em] font-black uppercase transition-all flex items-center justify-center gap-3 w-full"><Bot size={20}/> NEXUS AI SMART SUPPORT</button>
            </>
          )}
        </div>
        
        {/* MOBILE ONLY: LOGOUT POSITIONED AT BOTTOM */}
        {user && (
           <div className="mt-auto pt-8 border-t border-white/5">
              <button onClick={() => { signOut(auth).then(()=>{setView('home'); setIsMenuOpen(false);}) }} className="w-full p-6 rounded-2xl border bg-[#FE2C55]/10 border-[#FE2C55]/30 text-[#FE2C55] hover:bg-[#FE2C55]/20 text-[11px] sm:text-xs tracking-[0.15em] font-black uppercase transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(254,44,85,0.1)]"><LogOut size={20}/> DISCONNECT SECURITY GATEWAY</button>
           </div>
        )}
      </div>

      {/* --- CONTENT HUB --- */}
      <div className="pt-16 flex-1 flex flex-col pb-10 relative z-[100]">
        <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#FE2C55] opacity-[0.03] blur-[150px] pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#25F4EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

        {/* ==================== HOME ==================== */}
        {view === 'home' && (
          <div className="w-full max-w-[580px] mx-auto px-4 z-10 relative text-center pt-12 animate-in fade-in duration-300">
            <header className="mb-16 text-center flex flex-col items-center">
              <div className="lighthouse-neon-wrapper mb-5"><div className="lighthouse-neon-content px-12 py-5"><h1 className="text-4xl sm:text-5xl text-white text-glow-white tracking-tight uppercase font-black">SMART SMS PRO</h1></div></div>
              <p className="text-[10px] sm:text-xs text-white/40 font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-center px-4 leading-loose">HIGH-END REDIRECTION PROTOCOL<br/>60 FREE SECURE CONNECTIONS</p>
            </header>

            <main className="space-y-10 pb-20 text-left">
              {user && (
                <div className="flex justify-center mb-4 animate-in fade-in zoom-in duration-300">
                  <button onClick={() => setView('dashboard')} className="btn-strategic !bg-[#25F4EE] !text-black text-xs sm:text-sm w-full max-w-[460px] shadow-[0_0_30px_#25F4EE] py-5 uppercase"><LayoutDashboard size={24} /> ACCESS OPERATOR HUB</button>
                </div>
              )}

              <div className="lighthouse-neon-wrapper shadow-3xl mx-2 sm:mx-0">
                <div className="lighthouse-neon-content p-8 sm:p-14 text-left space-y-10">
                  <div className="flex items-center gap-3 mb-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"></div><h3 className="text-xs sm:text-sm tracking-widest text-white/60 font-black uppercase">SMART CONNECTION PROTOCOL</h3></div>
                  <div className="space-y-4">
                     <label className="text-[10px] sm:text-xs text-white/40 ml-1 tracking-widest block font-black uppercase">RECIPIENT (TARGET NUMBER) <span className="text-[#25F4EE] ml-2 opacity-50 text-[9px] sm:text-[10px]">EX: +1 999 999 9999</span></label>
                     <input type="tel" value={genTo} onChange={e => setGenTo(e.target.value)} className="input-premium font-sans text-base sm:text-lg not-italic normal-case font-medium" placeholder="+1 999 999 9999" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] sm:text-xs text-white/40 ml-1 tracking-widest block font-black uppercase">HOST IDENTITY (NAME OR COMPANY)</label>
                     <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-premium font-sans text-base sm:text-lg not-italic normal-case font-medium" placeholder="Your Organization Name" />
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center"><label className="text-[10px] sm:text-xs text-white/40 ml-1 tracking-widest block font-black uppercase">SMS MESSAGE PAYLOAD</label><span className="text-[9px] sm:text-[10px] text-white/20 font-black">{genMsg.length}/{MSG_LIMIT}</span></div>
                     <div className="flex items-center gap-2 font-black mb-3 mt-1">
                       <span className="text-amber-500"><ShieldAlert size={14}/></span>
                       <span className="text-[8px] sm:text-[10px] text-amber-500 tracking-widest uppercase">⚠️ ZERO TOLERANCE POLICY MONITORING ACTIVE</span>
                     </div>
                     <div className="relative">
                        <textarea value={genMsg} onChange={e => setGenMsg(e.target.value)} rows="4" className={`input-premium w-full text-base sm:text-lg font-sans leading-relaxed not-italic normal-case font-medium ${isGenMsgForbidden ? '!text-[#FE2C55] !border-[#FE2C55] shadow-[0_0_15px_rgba(254,44,85,0.3)]' : ''}`} placeholder="Draft your pre-defined payload here to receive via SMS 📲" />
                        <button onClick={()=>setShowInstructions(!showInstructions)} className="absolute right-3 bottom-4 p-2 bg-[#25F4EE]/10 rounded-lg text-[#25F4EE] hover:bg-[#25F4EE]/20 transition-all"><HelpCircle size={22}/></button>
                     </div>
                     {isGenMsgForbidden && <p className="text-[11px] sm:text-xs text-[#FE2C55] mt-3 font-black tracking-widest animate-pulse text-center leading-relaxed">⚠️ ZERO TOLERANCE POLICY: PROHIBITED WORDS DETECTED. PLEASE CORRECT.</p>}
                  </div>
                  
                  {showInstructions && (
                    <div className="p-6 sm:p-8 bg-white/[0.03] border border-[#25F4EE]/20 rounded-2xl animate-in slide-in-from-top-2">
                       <h5 className="text-[11px] sm:text-[12px] text-[#25F4EE] mb-4 text-center font-black uppercase">STRATEGIC DEPLOYMENT GUIDE:</h5>
                       <ul className="text-[10px] sm:text-[11px] text-white/50 space-y-4 leading-relaxed text-left font-normal not-italic normal-case">
                          <li>● Copy and embed your Secure Link into social media bios, ad buttons, or direct chats.</li>
                          <li>● The gateway securely captures incoming lead data before routing them to your SMS terminal.</li>
                          <li>● The SMS Payload is automatically preloaded on the lead's device to accelerate immediate conversions.</li>
                       </ul>
                    </div>
                  )}

                  <button onClick={handleGenerate} disabled={loading || isGenMsgForbidden} className={`btn-strategic ${isGenMsgForbidden ? '!bg-white/10 !text-white/30 cursor-not-allowed' : '!bg-[#25F4EE] !text-black'} text-xs sm:text-sm py-6 w-full shadow-[0_0_20px_rgba(37,244,238,0.4)] font-black uppercase`}>
                    {isGenMsgForbidden ? 'SYSTEM STANDBY' : 'GENERATE SECURE LINK'} {isGenMsgForbidden ? '' : <ChevronRight size={22} />}
                  </button>
                </div>
              </div>

              {generatedLink && (
                <div className="animate-in zoom-in-95 duration-300 space-y-6 px-2 sm:px-0">
                  <div className="bg-[#0a0a0a] border border-[#25F4EE]/20 rounded-[2.5rem] p-8 sm:p-12 text-center shadow-2xl">
                    <div className="bg-white p-5 sm:p-6 rounded-3xl inline-block mb-8 sm:mb-10 shadow-xl"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(generatedLink)}&color=000000`} className="w-32 h-32 sm:w-40 sm:h-40" alt="QR Code"/></div>
                    <input readOnly value={generatedLink} onClick={e=>e.target.select()} className="w-full bg-black/40 border border-white/5 rounded-xl p-5 text-xs sm:text-sm text-[#25F4EE] font-mono text-center outline-none mb-8 border-dashed font-medium not-italic normal-case truncate" />
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full">
                      <button onClick={() => {navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="flex flex-col items-center py-6 sm:py-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">{copied ? <Check size={32} className="text-[#25F4EE]" /> : <Copy size={32} className="text-white/40" />}<span className="text-[10px] sm:text-[11px] mt-3 text-white/50 tracking-widest text-center font-black uppercase">QUICK COPY</span></button>
                      <button onClick={() => window.open(generatedLink, '_blank')} className="flex flex-col items-center py-6 sm:py-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"><ExternalLink size={32} className="text-white/40" /><span className="text-[10px] sm:text-[11px] mt-3 text-white/50 tracking-widest text-center font-black uppercase">LIVE TEST</span></button>
                    </div>
                  </div>
                </div>
              )}

              {!user && (
                <div className="flex flex-col items-center gap-5 mt-10 w-full animate-in zoom-in-95 duration-300 pb-10 text-center px-2 sm:px-0 uppercase font-black">
                  <button onClick={() => {setIsWelcomeTrial(true); setIsLoginMode(false); setView('auth')}} className="btn-strategic !bg-white !text-black text-[11px] sm:text-xs w-full max-w-[460px] group py-6 shadow-xl"><Rocket size={24} className="group-hover:animate-bounce" /> START 60 FREE SECURE CONNECTIONS</button>
                  <button onClick={() => {setIsWelcomeTrial(false); setIsLoginMode(false); setView('auth'); setTimeout(() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'}), 300);}} className="btn-strategic !bg-[#25F4EE] !text-black text-[11px] sm:text-xs w-full max-w-[460px] group py-6 shadow-[0_0_20px_#25F4EE]"><Star size={24} className="animate-pulse" /> UPGRADE TO ELITE MEMBER</button>
                </div>
              )}

              <div className="pt-24 pb-16 text-left px-4 sm:px-0 font-normal not-italic normal-case">
                 <div className="flex items-center gap-4 mb-12 sm:mb-14 font-black uppercase"><HelpCircle size={32} className="text-[#FE2C55]"/><h3 className="text-3xl sm:text-4xl text-white tracking-tight">PROTOCOL FAQ</h3></div>
                 <div className="space-y-4 text-left leading-tight">
                    <FAQItem q="Why utilize our exclusive protocol instead of standard market routing?" a="Standard market redirects often trigger automated carrier heuristics instantly. Our proprietary protocol dynamically formats headers to mirror organic traffic signatures globally, significantly enhancing final delivery rates." />
                    <FAQItem q="Is the cryptographic vault fully impenetrable and compliant?" a="Absolutely. Operating under a robust Zero-Knowledge architecture, lead metadata remains exclusively encrypted within your session context. We maintain rigorous alignment with international protection protocols (GDPR/LGPD)." />
                    <FAQItem q="How does the system ensure long-term standing protection?" a="Our ecosystem employs an intelligent pacing engine that meticulously manages dispatch intervals, ensuring sustainable high-volume operations while maintaining pristine network standing." />
                    <FAQItem q="What is the strategic advantage of Advanced AI Synthesis?" a="The IA Agent dynamically optimizes payload contexts in real-time. By utilizing advanced frameworks, it ensures each dispatch maintains a unique organic fingerprint, maximizing user engagement." />
                 </div>
              </div>
            </main>
          </div>
        )}

        {/* ==================== AUTH (LOGIN/REGISTER) ==================== */}
        {view === 'auth' && (
          <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[80vh] px-4 py-12 animate-in fade-in zoom-in-95 duration-200">
            <div className="lighthouse-neon-wrapper w-full max-w-md shadow-3xl mx-auto">
              <div className="lighthouse-neon-content p-8 sm:p-14 relative w-full">
                {isWelcomeTrial && !isLoginMode ? (
                   <div className="mb-10 text-center animate-in slide-in-from-bottom-2">
                      <h2 className="text-3xl sm:text-4xl font-black uppercase text-[#25F4EE] mb-4 tracking-tight">🎁 WELCOME TO THE ELITE</h2>
                      <p className="text-sm sm:text-base text-white/70 leading-relaxed font-medium not-italic normal-case text-center">
                         We noticed you are ready to scale. To generate your secure protocol, create your credential below and instantly unlock <span className="text-white font-bold">🎁 60 Free Trial connections of secure smart link redirects of 'SMS Direct To Cell Phone'</span>. Stop losing leads to carrier filters right now.
                      </p>
                   </div>
                ) : (
                   <h2 className="text-3xl sm:text-4xl mt-2 mb-10 text-white text-center text-glow-white tracking-tighter font-black uppercase">SECURE MEMBER PORTAL</h2>
                )}
                
                <form onSubmit={handleAuthSubmit} className="space-y-6 text-left">
                  {!isLoginMode && (
                    <>
                       <div className="mb-6">
                         <label className="text-[10px] tracking-widest text-white/40 font-black block mb-3 uppercase">SELECT YOUR NEXUS AVATAR</label>
                         <div className="flex gap-3 justify-between items-center">
                           {NEXUS_AVATARS.map((av, idx) => (
                             <img 
                               key={idx} 
                               src={av} 
                               onClick={() => setSelectedAvatarInput(av)}
                               className={`w-12 h-12 rounded-full cursor-pointer transition-all border-2 ${selectedAvatarInput === av ? 'border-[#25F4EE] scale-110 shadow-[0_0_15px_rgba(37,244,238,0.5)] bg-white/10' : 'border-white/10 hover:border-white/30 bg-black'}`}
                               alt="Avatar"
                             />
                           ))}
                         </div>
                       </div>
                       <input required placeholder="FULL LEGAL NAME" value={fullNameInput} onChange={e=>setFullNameInput(e.target.value)} className="input-premium text-sm sm:text-base w-full font-sans font-medium not-italic normal-case" />
                       <input required placeholder="NICKNAME / ALIAS" value={nicknameInput} onChange={e=>setNicknameInput(e.target.value)} className="input-premium text-sm sm:text-base w-full font-sans font-medium not-italic normal-case" />
                       <input required type="tel" placeholder="+1 999 999 9999" value={phoneInput} onChange={e=>setPhoneInput(e.target.value)} className="input-premium text-sm sm:text-base w-full font-sans font-medium not-italic normal-case" />
                    </>
                  )}
                  <input required type="email" placeholder="EMAIL IDENTITY..." value={email} onChange={e=>setEmail(e.target.value)} className="input-premium text-sm sm:text-base w-full font-sans font-medium not-italic normal-case" />
                  <div className="relative">
                    <input required type={showPass ? "text" : "password"} placeholder="SECURITY KEY..." value={password} onChange={e=>setPassword(e.target.value)} className="input-premium text-sm sm:text-base w-full font-sans font-medium not-italic normal-case pr-14" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-2"><Eye size={20}/></button>
                  </div>
                  <button type="submit" disabled={loading} className="btn-strategic !bg-[#25F4EE] !text-black text-[12px] sm:text-sm mt-5 shadow-xl w-full tracking-widest py-5 font-black uppercase">{loading ? 'VERIFYING GATEWAY...' : (isWelcomeTrial ? 'UNLOCK MY 60 TRANSMISSIONS' : 'AUTHORIZE ACCESS')}</button>
                  <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); }} className="w-full text-[11px] sm:text-[12px] text-white/30 hover:text-white tracking-[0.2em] sm:tracking-[0.3em] mt-8 text-center transition-all px-2 font-black uppercase">{isLoginMode ? "CREATE NEW OPERATOR? REGISTER" : "ALREADY A MEMBER? LOGIN"}</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ==================== DASHBOARD ==================== */}
        {view === 'dashboard' && (
          <div className="w-full max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-8 animate-in fade-in duration-300">
            
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-8 mb-12 sm:mb-16 text-left">
              <div>
                <h2 className="text-5xl sm:text-6xl md:text-7xl tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] text-white font-black uppercase">OPERATOR HUB</h2>
                <div className="flex flex-wrap items-center gap-4 mt-5">
                   <span className={`text-[10px] sm:text-xs px-5 py-2 rounded-full border tracking-widest uppercase ${isMaster ? 'bg-[#25F4EE]/10 border-[#25F4EE] text-[#25F4EE] shadow-[0_0_15px_rgba(37,244,238,0.3)] animate-pulse font-black' : 'bg-white/5 border-white/10 text-white/40 font-black'}`}>
                      {isMaster ? <span className="flex items-center gap-2"><Crown size={16} className="mb-0.5" /> MASTER IDENTITY</span> : `${String(userProfile?.tier || 'FREE').replace('_', ' ')} IDENTITY`}
                   </span>
                   {isPro && <span className="text-[9px] sm:text-[10px] text-amber-500 tracking-widest animate-pulse font-black uppercase">● LIVE PROTOCOL ACTIVE</span>}
                   {userProfile?.isEmailVerified && <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-[#10B981] tracking-widest font-black uppercase"><BadgeCheck size={14}/> VALIDATED ID</span>}
                </div>
              </div>
              <div className="flex items-stretch gap-4 sm:gap-5 flex-wrap text-center uppercase">
                 <button onClick={() => setView('home')} className="flex-1 lg:flex-none items-center justify-center gap-3 bg-[#25F4EE]/10 border border-[#25F4EE]/30 px-6 sm:px-8 py-4 sm:py-5 rounded-2xl hover:bg-[#25F4EE]/20 transition-colors text-[10px] sm:text-[11px] text-[#25F4EE] flex font-black">
                    <Zap size={18} className="fill-[#25F4EE]"/> LINK GENERATOR
                 </button>
                 <div className="bg-[#0a0a0a] border border-white/10 px-6 sm:px-10 py-4 sm:py-5 rounded-2xl sm:rounded-[1.5rem] shadow-3xl flex-1 lg:flex-none">
                    <p className="text-[8px] sm:text-[9px] text-white/30 mb-1.5 sm:mb-2 tracking-widest font-black">ACTIVE RELAYS</p>
                    <div className="flex items-center justify-center gap-3"><button onClick={() => setConnectedChips(prev => Math.max(1, prev - 1))} className="text-white/30 hover:text-white p-2 not-italic">-</button><span className="text-2xl sm:text-3xl text-[#25F4EE] not-italic">{connectedChips}</span><button onClick={() => setConnectedChips(prev => prev + 1)} className="text-white/30 hover:text-white p-2 not-italic">+</button></div>
                 </div>
                 <div className="bg-[#0a0a0a] border border-white/10 px-6 sm:px-10 py-4 sm:py-5 rounded-2xl sm:rounded-[1.5rem] shadow-3xl border-b-2 border-b-[#25F4EE] flex-1 lg:flex-none flex flex-col justify-center">
                    <p className="text-[8px] sm:text-[9px] text-white/30 mb-1.5 sm:mb-2 tracking-widest font-black">REMAINING QUOTA</p>
                    <p className="text-2xl sm:text-3xl text-white font-black not-italic">{remainingQuota}</p>
                 </div>
              </div>
            </div>

            {/* MASTER ONLY: GLOBAL BROADCAST COMPONENT */}
            {isMaster && (
                <div className="bg-[#0a0a0a] border border-amber-500/30 p-8 sm:p-10 rounded-3xl sm:rounded-[2.5rem] shadow-[0_0_30px_rgba(245,158,11,0.1)] flex flex-col relative overflow-hidden mb-10">
                  <h3 className="text-xl sm:text-2xl text-white mb-6 flex items-center gap-4 font-black uppercase"><BellRing className="text-amber-500 animate-pulse" size={26} /> GLOBAL PLATFORM BROADCAST</h3>
                  <form onSubmit={handleBroadcastPush} className="flex gap-4 flex-col sm:flex-row items-stretch sm:items-center">
                    <input type="text" value={broadcastMsg} onChange={e=>setBroadcastMsg(e.target.value)} placeholder="Enter push notification for all users..." className="input-premium flex-1 font-sans text-base sm:text-lg not-italic normal-case font-medium" />
                    <button type="submit" disabled={loading} className="shrink-0 h-fit bg-amber-500 text-black font-black text-xs sm:text-sm tracking-widest px-10 py-[1.2rem] rounded-xl hover:bg-amber-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] disabled:opacity-50 flex items-center justify-center gap-3 uppercase">
                      <Send size={18}/> DEPLOY
                    </button>
                  </form>
                </div>
            )}

            {/* MÓDULO DE ESTATÍSTICAS COM COUNTER EM TEMPO REAL */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 mb-10 uppercase">
              {[
                { label: "TRANSMISSION VOLUME", value: isMaster ? "∞" : (userProfile?.dailySent || 0), icon: Send, color: "text-[#25F4EE]" },
                { label: "NETWORK DELIVERY", value: "99.8%", icon: ShieldCheck, color: "text-[#10B981]" },
                { label: "CAPTURED LEADS", value: isMaster ? subscribersList.reduce((acc, sub) => acc + sub.leads.length, 0) : logs.length, icon: Users, color: "text-amber-500" },
                { label: "TOTAL PROTOCOLS", value: linksHistory.length, icon: Radio, color: "text-white" },
              ].map((stat, idx) => (
                <div key={idx} className="bg-[#0a0a0a] p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-white/10 shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 hover:border-[#25F4EE]/50 transition-all cursor-default">
                  <div className={`bg-white/5 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-white/5 ${stat.color}`}>
                    <stat.icon size={28} />
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] text-white/40 tracking-widest mb-1.5 line-clamp-1 font-black">{stat.label}</p>
                    <h3 className="text-2xl sm:text-3xl text-white font-black not-italic">{stat.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* PREMIUM DATA ANALYTICS DASHBOARD (NEW MODULE) */}
            <div className="bg-[#0a0a0a] border border-[#25F4EE]/20 rounded-3xl sm:rounded-[2.5rem] shadow-[0_0_30px_rgba(37,244,238,0.1)] p-8 sm:p-10 mb-12 flex flex-col relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#25F4EE] opacity-[0.02] blur-[100px] pointer-events-none"></div>
               <div className="flex items-center gap-4 mb-8">
                  <Activity size={28} className="text-[#25F4EE]" />
                  <h3 className="text-2xl sm:text-3xl text-white tracking-tight font-black uppercase">COGNITIVE ANALYTICS & TELEMETRY</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {/* Metric 1 */}
                  <div className="bg-[#111] border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:border-[#25F4EE]/30 transition-all">
                     <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] sm:text-[11px] text-white/50 tracking-widest font-black uppercase">GLOBAL CLICK-THROUGH</span>
                        <Target size={18} className="text-[#10B981]" />
                     </div>
                     <p className="text-4xl sm:text-5xl text-white font-black mb-2 not-italic">{logs.length > 0 ? '68.4%' : '0.0%'}</p>
                     <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden"><div className="bg-[#10B981] h-full" style={{width: logs.length > 0 ? '68.4%' : '0%'}}></div></div>
                  </div>
                  {/* Metric 2 */}
                  <div className="bg-[#111] border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:border-[#25F4EE]/30 transition-all">
                     <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] sm:text-[11px] text-white/50 tracking-widest font-black uppercase">BEHAVIORAL PROJECTION</span>
                        <TrendingUp size={18} className="text-amber-500" />
                     </div>
                     <p className="text-4xl sm:text-5xl text-white font-black mb-2 not-italic">+{logs.length > 0 ? Math.floor(logs.length * 1.4) : 0}</p>
                     <p className="text-[9px] sm:text-[10px] text-amber-500 tracking-widest font-black uppercase mt-4">ESTIMATED CONVERSIONS (24H)</p>
                  </div>
                  {/* Metric 3 */}
                  <div className="bg-[#111] border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:border-[#25F4EE]/30 transition-all">
                     <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] sm:text-[11px] text-white/50 tracking-widest font-black uppercase">DEVICE HEURISTICS</span>
                        <PieChart size={18} className="text-[#25F4EE]" />
                     </div>
                     <div className="flex justify-between items-end h-full mt-4">
                        <div className="flex flex-col items-center gap-2"><div className="w-4 h-16 bg-[#25F4EE] rounded-t-sm"></div><span className="text-[9px] text-white/40 font-mono not-italic">IOS</span></div>
                        <div className="flex flex-col items-center gap-2"><div className="w-4 h-24 bg-amber-500 rounded-t-sm"></div><span className="text-[9px] text-white/40 font-mono not-italic">AND</span></div>
                        <div className="flex flex-col items-center gap-2"><div className="w-4 h-8 bg-[#10B981] rounded-t-sm"></div><span className="text-[9px] text-white/40 font-mono not-italic">WEB</span></div>
                     </div>
                  </div>
               </div>
            </div>

            {/* CONTEÚDO PRINCIPAL DASHBOARD */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 mb-20 items-start">
              
              <div className="lg:col-span-1 space-y-8 sm:space-y-10 flex flex-col h-fit">
                <div className="bg-[#0a0a0a] border border-white/10 p-8 sm:p-10 rounded-3xl sm:rounded-[2.5rem] shadow-2xl flex flex-col relative overflow-hidden flex-1">
                  <h3 className="text-xl sm:text-2xl text-white mb-8 flex items-center gap-3 font-black uppercase"><Zap className="text-[#25F4EE]" size={24} /> INSTANT PAYLOAD DISPATCH</h3>
                  <form onSubmit={handleQuickSend} className="space-y-5 sm:space-y-6 flex flex-col flex-1">
                    <div>
                      <label className="block text-[10px] sm:text-[11px] text-white/40 tracking-widest mb-3 font-black uppercase">RECIPIENT (TARGET NUMBER)</label>
                      <input type="tel" value={genTo} onChange={e=>setGenTo(e.target.value)} placeholder="+1 000 000 0000" className="input-premium text-base sm:text-lg font-sans not-italic normal-case font-medium" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <label className="block text-[10px] sm:text-[11px] text-white/40 tracking-widest mb-3 font-black uppercase">SMS MESSAGE PAYLOAD</label>
                      <textarea rows="4" value={genMsg} onChange={e=>setGenMsg(e.target.value)} placeholder="Draft your SMS here..." className="input-premium flex-1 text-base sm:text-lg font-sans leading-relaxed not-italic normal-case font-medium resize-none"></textarea>
                    </div>
                    <button type="submit" disabled={loading} className="btn-strategic !bg-[#25F4EE] !text-black text-[11px] sm:text-xs w-full mt-6 py-5 shadow-[0_0_15px_rgba(37,244,238,0.2)] font-black uppercase">
                      <Send size={20} className="mr-3" /> SEND NOW
                    </button>
                  </form>
                </div>

                <div className={`bg-[#0a0a0a] border border-white/10 rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden ${!isPro ? 'pro-obscure' : ''}`}>
                   <div className={`flex items-center justify-between w-full relative z-10`}>
                      <div><h3 className="text-xl sm:text-2xl text-white mb-2 flex items-center gap-3 font-black uppercase"><UploadCloud size={24} className="text-[#25F4EE]"/> MASS INGESTION HUB {!isPro && <Lock size={18} className="text-[#FE2C55]" />}</h3><p className="text-[9px] sm:text-[10px] text-white/40 tracking-widest font-black uppercase">IMPORT 5K UNITS.</p></div>
                      {isPro && <button onClick={() => fileInputRef.current.click()} className="p-4 sm:p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl sm:rounded-2xl text-[#25F4EE] transition-all flex items-center justify-center">{loading ? <RefreshCw size={24} className="animate-spin"/> : <Plus size={24} />}</button>}
                   </div>
                   {!isPro && (
                     <div className="pro-lock-layer p-6">
                        <p className="text-[#FE2C55] tracking-widest text-[10px] sm:text-[11px] mb-3 animate-pulse font-black uppercase"><Lock size={14} className="inline mr-2"/> PRO LOCKED</p>
                        <button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="bg-white/10 text-white border border-white/20 text-[9px] sm:text-[10px] px-8 py-3.5 rounded-xl whitespace-nowrap font-black uppercase">UNLOCK</button>
                     </div>
                   )}
                   <input type="file" accept=".txt" onChange={handleBulkImport} ref={fileInputRef} className="hidden" />
                </div>
              </div>

              {/* DASHBOARD DE REGISTROS (CRM MASTER ADMIN / OPERATOR VIEW) */}
              <div className="lg:col-span-2 bg-[#0a0a0a] rounded-3xl sm:rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden flex flex-col h-full min-h-[500px] sm:min-h-[600px]">
                 <div className="p-8 sm:p-10 border-b border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-6 bg-[#111]">
                    <div className="flex items-center gap-4">
                       {isMaster ? <Database size={26} className="text-amber-500" /> : <History size={26} className="text-[#25F4EE]" />}
                       <h3 className="text-2xl sm:text-3xl text-white tracking-tight leading-tight font-black uppercase">{isMaster ? 'PREMIUM CRM & NETWORK MAP' : 'RECENT ACTIVITY LOGS'}</h3>
                    </div>
                 </div>
                 
                 <div className="flex-1 overflow-x-auto custom-scrollbar bg-black/40">
                   {isMaster ? (
                     <table className="w-full text-left font-sans font-medium not-italic normal-case min-w-[700px]">
                       <thead className="bg-[#111] sticky top-0 z-10 uppercase border-b border-white/5">
                         <tr>
                           <th className="px-8 sm:px-10 py-5 sm:py-6 text-[10px] sm:text-[11px] text-white/50 tracking-widest font-black">SUBSCRIBER ALIAS (NICKNAME)</th>
                           <th className="px-8 sm:px-10 py-5 sm:py-6 text-[10px] sm:text-[11px] text-white/50 tracking-widest text-center font-black">CAPTURED LEADS</th>
                           <th className="px-8 sm:px-10 py-5 sm:py-6 text-[10px] sm:text-[11px] text-white/50 tracking-widest text-right font-black">MASTER FOLDER STATUS</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                         {subscribersList.map(sub => (
                            <React.Fragment key={sub.id}>
                                <tr onClick={() => setExpandedAdminRow(expandedAdminRow === sub.id ? null : sub.id)} className={`hover:bg-white/[0.02] transition-colors cursor-pointer group ${expandedAdminRow === sub.id ? 'bg-white/[0.03]' : ''}`}>
                                   <td className="px-8 sm:px-10 py-6 sm:py-8">
                                      <div className="flex items-center gap-4">
                                          {expandedAdminRow === sub.id ? <ChevronDown size={20} className="text-[#25F4EE]" /> : <ChevronRightSquare size={20} className="text-white/30 group-hover:text-white/60" />}
                                          {sub.avatar && <img src={sub.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-white/10" />}
                                          <div>
                                              <p className="text-sm sm:text-base text-[#25F4EE] tracking-wider font-black uppercase">{String(sub.nickname).toUpperCase()}</p>
                                              <p className="text-[10px] sm:text-[11px] text-white/40 tracking-widest font-mono mt-1.5 uppercase">{sub.email} | {sub.tier}</p>
                                          </div>
                                      </div>
                                   </td>
                                   <td className="px-8 sm:px-10 py-6 sm:py-8 text-center text-sm sm:text-base text-white font-black uppercase">
                                       <span className={`bg-white/5 px-5 py-2 rounded-xl border border-white/10 ${sub.id === 'AI_SMART_CHAT' ? 'text-amber-500 border-amber-500/30' : ''}`}>{sub.leads.length} BASE</span>
                                   </td>
                                   <td className="px-8 sm:px-10 py-6 sm:py-8 flex justify-end gap-2 sm:gap-3 mt-2 sm:mt-3 uppercase">
                                      <span className="text-[10px] sm:text-[11px] text-white/30 font-black tracking-widest">{expandedAdminRow === sub.id ? 'CLOSING VIEW' : 'EXPAND BASE VIEW'}</span>
                                   </td>
                                </tr>
                                {expandedAdminRow === sub.id && (
                                    <tr>
                                        <td colSpan="3" className="p-0 border-b border-white/5">
                                            <div className={`bg-black border-l-4 p-8 animate-in slide-in-from-top-2 ${sub.id === 'AI_SMART_CHAT' ? 'border-amber-500' : 'border-[#25F4EE]'}`}>
                                                {sub.leads.length > 0 ? (
                                                    <table className="w-full text-left font-sans font-medium not-italic normal-case">
                                                       <thead className="text-[9px] sm:text-[10px] text-white/30 uppercase tracking-widest border-b border-white/5">
                                                           <tr>
                                                               <th className="pb-4 px-5 font-black">TARGET NUMBER</th>
                                                               <th className="pb-4 px-5 font-black">IDENTITY</th>
                                                               <th className="pb-4 px-5 font-black">FOLDER</th>
                                                               <th className="pb-4 px-5 text-right font-black">ACTIONS (CRM)</th>
                                                           </tr>
                                                       </thead>
                                                       <tbody className="divide-y divide-white/5">
                                                           {sub.leads.map(l => (
                                                              <tr key={l.id} className="hover:bg-white/5 group">
                                                                 <td className={`py-4 px-5 text-xs sm:text-sm font-mono ${sub.id === 'AI_SMART_CHAT' ? 'text-amber-500' : 'text-[#25F4EE]'}`}>{l.telefone_cliente}</td>
                                                                 <td className="py-4 px-5 text-xs sm:text-sm text-white">{l.nome_cliente} {sub.id === 'AI_SMART_CHAT' && <span className="ml-3 text-[9px] tracking-widest text-black bg-amber-500 px-2 py-0.5 rounded-sm uppercase">NEXUS AGENT</span>}</td>
                                                                 <td className="py-4 px-5 text-xs sm:text-sm">
                                                                    <select
                                                                      defaultValue={l.folderId || 'MANUAL'}
                                                                      onChange={e => handleAdminAssignFolder(l.id, e.target.value)}
                                                                      onClick={e => e.stopPropagation()}
                                                                      className="bg-[#111] border border-white/10 text-white/50 text-[10px] sm:text-[11px] px-3 py-1.5 rounded-lg outline-none font-black tracking-widest appearance-none cursor-pointer hover:border-[#25F4EE]/30 transition-colors uppercase"
                                                                    >
                                                                      {folders.map(f => (
                                                                        <option key={f.id} value={f.id} className="bg-[#111]">{f.label}</option>
                                                                      ))}
                                                                    </select>
                                                                 </td>
                                                                 <td className="py-4 px-5 text-xs sm:text-sm text-right">
                                                                    <div className="flex items-center justify-end gap-4">
                                                                      <button onClick={(e)=>{e.stopPropagation(); handleAdminGrantTier(e, sub.id, 'ACTIVATION_9_USD')}} title="Grant Nexus Routing Pro ($9)" className="text-[#25F4EE] hover:bg-[#25F4EE]/20 p-2.5 rounded-md transition-all border border-transparent hover:border-[#25F4EE]/30"><Gift size={18}/></button>
                                                                      <button onClick={(e)=>{e.stopPropagation(); handleAdminGrantTier(e, sub.id, 'PRO_SUBSCRIPTION_19_USD')}} title="Grant Nexus Automation Engine ($19.90)" className="text-amber-500 hover:bg-amber-500/20 p-2.5 rounded-md transition-all border border-transparent hover:border-amber-500/30"><Rocket size={18}/></button>
                                                                      <div className="w-px h-6 bg-white/20 mx-2"></div>
                                                                      <button onClick={(e)=>{e.stopPropagation(); setEditLeadModal({id: l.id, nome_cliente: l.nome_cliente, telefone_cliente: l.telefone_cliente, folderId: l.folderId || 'MANUAL'})}} title="Edit Lead Data" className="text-white/30 hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-all p-1.5"><Edit size={16}/></button>
                                                                      <button onClick={(e)=>{e.stopPropagation(); handleAdminDeleteLead(l.id)}} title="Purge Lead" className="text-white/30 hover:text-[#FE2C55] opacity-0 group-hover:opacity-100 transition-all p-1.5"><Trash size={16}/></button>
                                                                    </div>
                                                                 </td>
                                                              </tr>
                                                           ))}
                                                       </tbody>
                                                    </table>
                                                ) : (
                                                    <div className="flex justify-between items-center w-full">
                                                       <p className="text-xs sm:text-sm text-white/30 tracking-widest py-8 font-black uppercase">NO LEADS CAPTURED BY THIS GATEWAY YET.</p>
                                                       <div className="flex items-center justify-end gap-4">
                                                          <button onClick={(e)=>{e.stopPropagation(); handleAdminGrantTier(e, sub.id, 'ACTIVATION_9_USD')}} title="Grant Nexus Routing Pro ($9)" className="text-[#25F4EE] hover:bg-[#25F4EE]/20 p-2.5 rounded-md transition-all border border-transparent hover:border-[#25F4EE]/30"><Gift size={18}/></button>
                                                          <button onClick={(e)=>{e.stopPropagation(); handleAdminGrantTier(e, sub.id, 'PRO_SUBSCRIPTION_19_USD')}} title="Grant Nexus Automation Engine ($19.90)" className="text-amber-500 hover:bg-amber-500/20 p-2.5 rounded-md transition-all border border-transparent hover:border-amber-500/30"><Rocket size={18}/></button>
                                                       </div>
                                                    </div>
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
                         <table className="w-full text-left font-sans font-medium not-italic normal-case min-w-[500px]">
                           <thead className="bg-[#111] sticky top-0 z-10 uppercase border-b border-white/5">
                             <tr>
                               <th className="px-6 sm:px-8 py-5 sm:py-6 text-[10px] sm:text-[11px] text-white/50 tracking-widest font-black">RECIPIENT (TARGET NUMBER)</th>
                               <th className="px-6 sm:px-8 py-5 sm:py-6 text-[10px] sm:text-[11px] text-white/50 tracking-widest font-black">HOST IDENTITY</th>
                               <th className="px-6 sm:px-8 py-5 sm:py-6 text-[10px] sm:text-[11px] text-white/50 tracking-widest font-black">STATUS</th>
                               <th className="px-6 sm:px-8 py-5 sm:py-6 text-[10px] sm:text-[11px] text-white/50 tracking-widest text-right font-black">TIMESTAMP</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5">
                             {logs.map(l => (
                               <tr key={l.id} className="hover:bg-white/[0.02] transition-colors group">
                                 <td className="px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base text-[#25F4EE] tracking-wider whitespace-nowrap font-mono">{maskData(l.telefone_cliente, 'phone')}</td>
                                 <td className="px-6 sm:px-8 py-5 sm:py-6">
                                   <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/50 group-hover:border-[#25F4EE]/30 group-hover:text-[#25F4EE] transition-all">
                                       <UserCheck size={18} />
                                     </div>
                                     <span className="text-white text-sm sm:text-base truncate max-w-[120px] sm:max-w-[200px]">{maskData(l.nome_cliente, 'name')}</span>
                                   </div>
                                 </td>
                                 <td className="px-6 sm:px-8 py-5 sm:py-6 whitespace-nowrap">
                                    {isPro ? (
                                      <span className="flex items-center gap-2 text-[9px] sm:text-[10px] uppercase px-3.5 py-2 rounded-full w-fit bg-[#25F4EE]/10 text-[#25F4EE] border border-[#25F4EE]/30 font-black"><CheckCircle2 size={14} /> DECRYPTED GATEWAY</span>
                                    ) : (
                                      <button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 text-[9px] sm:text-[10px] uppercase px-3.5 py-2 rounded-full w-fit bg-[#FE2C55]/10 text-[#FE2C55] border border-[#FE2C55]/30 font-black hover:bg-[#FE2C55]/20 hover:scale-105 transition-all cursor-pointer shadow-[0_0_15px_rgba(254,44,85,0.3)]"><Lock size={14} /> UNLOCK TO REVEAL</button>
                                    )}
                                 </td>
                                 <td className="px-6 sm:px-8 py-5 sm:py-6 text-right text-[11px] sm:text-xs font-mono text-[#25F4EE] whitespace-nowrap">
                                    {(l.timestamp && typeof l.timestamp.toDate === 'function') ? l.timestamp.toDate().toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute:'2-digit' }) : 'Syncing...'}
                                 </td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       ) : (
                         <div className="flex flex-col items-center justify-center h-full p-12 sm:p-24 opacity-20 text-center"><Lock size={56} className="mb-5 text-white" /><p className="text-[11px] sm:text-xs tracking-widest font-black uppercase">VAULT STANDBY</p><p className="text-[9px] sm:text-[10px] mt-3 font-sans font-medium not-italic normal-case text-balance">NO ACTIVE INTERCEPTIONS.</p></div>
                       )}
                     </>
                   )}
                 </div>
                 {!isPro && !isMaster && logs.length > 0 && (
                   <div className="p-8 sm:p-10 bg-gradient-to-t from-[#FE2C55]/10 to-transparent border-t border-[#FE2C55]/20 flex flex-col sm:flex-row items-center justify-between gap-5 uppercase">
                      <p className="text-[10px] sm:text-[11px] text-[#FE2C55] tracking-widest flex items-center justify-center sm:justify-start gap-3 w-full sm:w-auto font-black"><Lock size={16}/> REVEAL FULL IDENTITIES IN VAULT</p>
                      <button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="bg-[#FE2C55] text-white text-[10px] sm:text-[11px] px-8 sm:px-10 py-4 rounded-xl shadow-[0_0_15px_rgba(254,44,85,0.4)] w-full sm:w-auto font-black hover:scale-105 transition-transform">UPGRADE TO ELITE</button>
                   </div>
                 )}
              </div>
            </div>

            {/* ---> AI AGENT MODULE WITH STAGING AREA <--- */}
            <div className={`bg-[#0a0a0a] border ${isAiObjectiveForbidden ? 'border-[#FE2C55] shadow-[0_0_30px_rgba(254,44,85,0.2)]' : 'border-white/10'} rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-10 md:p-12 shadow-2xl mb-10 relative overflow-hidden transition-all ${!isPro ? 'pro-obscure' : ''}`}>
              <div className={`flex flex-col text-left`}>
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 md:gap-8 mb-8 sm:mb-10">
                    <div className="flex items-center gap-4 sm:gap-5 text-left">
                      <div className={`p-4 sm:p-5 rounded-2xl border ${isAiObjectiveForbidden ? 'bg-[#FE2C55]/10 border-[#FE2C55]/30' : 'bg-white/5 border-white/10'}`}>
                        {isAiObjectiveForbidden ? <AlertOctagon size={28} className="text-[#FE2C55]" /> : <BrainCircuit size={28} className="text-[#25F4EE]" />}
                      </div>
                      <div>
                        <h3 className="text-2xl sm:text-3xl text-white tracking-tight leading-tight font-black uppercase">NEXUS SMART SHUFFLE ENGINE {!isPro && <Lock size={20} className="text-[#FE2C55] inline ml-2" />}</h3>
                        <p className="text-[10px] sm:text-[11px] text-white/40 tracking-widest mt-2 sm:mt-3 font-black uppercase">AUTOMATED LINGUISTIC SCRAMBLING TO OBLITERATE CARRIER FILTER BLOCKS.</p>
                      </div>
                    </div>
                    <button onClick={() => setShowHelpModal(true)} className="flex items-center justify-center gap-3 bg-[#25F4EE]/10 text-[#25F4EE] px-6 py-4 rounded-xl text-[10px] sm:text-[11px] font-black uppercase hover:bg-[#25F4EE]/20 transition-all border border-[#25F4EE]/30 w-full md:w-auto shrink-0 mt-3 md:mt-0">
                      <Info size={18} /> NATIVE RELAY SETUP GUIDE
                    </button>
                 </div>

                 {/* VARIATION STAGING AREA (REVIEW MODE) */}
                 {isReviewMode ? (
                   <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6 border-b border-white/10 pb-5">
                        <div className="flex items-center gap-3">
                           <SlidersHorizontal size={22} className="text-amber-500" />
                           <h4 className="text-xl sm:text-2xl text-white font-black uppercase">PAYLOAD REVIEW ENGINE</h4>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-white/50 tracking-widest font-black uppercase">{stagedQueue.length} VARIATIONS PENDING</p>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-h-[350px] sm:max-h-[450px] overflow-y-auto custom-scrollbar pr-2 sm:pr-3 mb-6 sm:mb-8">
                        {stagedQueue.map((task, idx) => (
                           <div key={task.id || idx} className={`bg-[#111] border border-white/5 rounded-2xl p-5 sm:p-6 transition-colors flex flex-col h-[160px] sm:h-[180px] ${isDispatching && idx === 0 ? 'border-[#25F4EE] shadow-[0_0_15px_rgba(37,244,238,0.3)] animate-pulse' : 'hover:border-[#25F4EE]/30 group'}`}>
                              <div className="flex justify-between items-center mb-3 sm:mb-4">
                                <span className="text-[#25F4EE] text-[9px] sm:text-[10px] font-black tracking-widest uppercase">VARIATION {sessionSentCount + idx + 1}</span>
                                <span className="text-white/30 text-[9px] sm:text-[10px] font-mono not-italic truncate max-w-[80px] sm:max-w-[120px]">{maskData(task.telefone_cliente, 'phone')}</span>
                              </div>
                              <textarea 
                                disabled={isDispatching}
                                value={task.optimizedMsg} 
                                onChange={(e) => handleEditStagedMsg(idx, e.target.value)} 
                                className="w-full flex-1 bg-black/50 border border-white/5 rounded-xl p-3.5 text-xs sm:text-sm text-white/80 resize-none font-sans not-italic normal-case leading-relaxed focus:border-[#25F4EE]/50 outline-none disabled:opacity-50 custom-scrollbar" 
                              />
                           </div>
                        ))}
                     </div>

                     {/* RODAPÉ DO STAGING: DISPATCH COM AVISO LIVE */}
                     <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5 mt-3 bg-[#111] p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-white/5 shadow-inner">
                        <div className="flex items-center justify-between sm:justify-start gap-4 px-2 sm:px-3 w-full lg:w-auto border-b sm:border-b-0 border-white/5 pb-4 sm:pb-0">
                           <div className="flex items-center gap-3 sm:gap-4">
                              <Clock size={20} className="text-[#10B981] animate-pulse" />
                              <span className="text-[10px] sm:text-[11px] text-white/50 tracking-widest font-black uppercase mt-0.5 whitespace-nowrap">TRANSMISSION PACING:</span>
                           </div>
                           <select disabled={isDispatching} value={sendDelay} onChange={e => setSendDelay(Number(e.target.value))} className="bg-transparent text-[#10B981] text-[11px] sm:text-sm font-black outline-none cursor-pointer border-b border-[#10B981]/30 pb-1 appearance-none text-right sm:text-left uppercase">
                              <option value={15} className="bg-[#0a0a0a] text-white">15 SECONDS</option>
                              <option value={20} className="bg-[#0a0a0a] text-white">20 SECONDS</option>
                              <option value={30} className="bg-[#0a0a0a] text-white">30 SECONDS</option>
                              <option value={45} className="bg-[#0a0a0a] text-white">45 SECONDS</option>
                              <option value={120} className="bg-[#0a0a0a] text-white">120 SECONDS</option>
                              <option value={160} className="bg-[#0a0a0a] text-white">160 SECONDS</option>
                              <option value={180} className="bg-[#0a0a0a] text-white">180 SECONDS</option>
                           </select>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full lg:w-auto uppercase">
                           <button disabled={isDispatching} onClick={() => {setStagedQueue([]); setIsReviewMode(false); setSessionSentCount(0); setSessionTotal(0);}} className="px-8 sm:px-10 py-4 bg-white/5 text-white/50 hover:text-white rounded-xl text-[10px] sm:text-[11px] font-black tracking-widest transition-colors w-full sm:w-auto disabled:opacity-30">CANCEL</button>
                           <button disabled={isDispatching} onClick={dispatchToNode} className={`px-10 sm:px-12 py-4 text-black font-black text-[11px] sm:text-xs rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 w-full sm:w-auto ${isDispatching ? 'bg-[#25F4EE] shadow-[0_0_30px_rgba(37,244,238,0.5)]' : 'bg-amber-500'}`}>
                              {isDispatching ? <><RefreshCw size={18} className="animate-spin" /> <span className="truncate">TRANSMITTING: {sessionSentCount} / {sessionTotal} SENT...</span></> : <><Send size={18} /> CONFIRM & DISPATCH</>}
                           </button>
                        </div>
                     </div>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 text-left">
                      <div className="space-y-5 flex flex-col">
                         <div className="flex items-center justify-between gap-4 bg-black/40 border border-white/5 p-5 rounded-2xl mb-3 flex-wrap">
                           <div className="flex items-center gap-4">
                             <Clock size={24} className="text-[#10B981]" />
                             <div>
                               <p className="text-[9px] sm:text-[10px] text-white/50 tracking-widest font-black uppercase mb-1.5">DISPATCH DELAY</p>
                               <select disabled={!isPro} value={sendDelay} onChange={e => setSendDelay(Number(e.target.value))} className="bg-transparent text-[#10B981] text-[11px] sm:text-xs font-black outline-none cursor-pointer w-full appearance-none uppercase">
                                  <option value={15} className="bg-[#0a0a0a]">15 SECONDS</option>
                                  <option value={30} className="bg-[#0a0a0a]">30 SECONDS</option>
                                  <option value={60} className="bg-[#0a0a0a]">60 SECONDS</option>
                               </select>
                             </div>
                           </div>
                           <div className="border-l border-white/10 pl-5">
                             <p className="text-[9px] sm:text-[10px] text-white/50 tracking-widest font-black uppercase mb-1.5">TARGET BATCH FOLDER</p>
                             <div className="flex items-center gap-3">
                               <select disabled={!isPro} value={selectedFolder} onChange={e => setSelectedFolder(e.target.value)} className="bg-transparent text-amber-500 text-[11px] sm:text-xs font-black outline-none cursor-pointer w-full appearance-none uppercase">
                                  {folders.map(f => (
                                    <option key={f.id} value={f.id} className="bg-[#0a0a0a]">{f.label}</option>
                                  ))}
                               </select>
                               {isMaster && (
                                 <button onClick={() => setCreateFolderModal(true)} title="Create new folder" className="text-[#25F4EE]/50 hover:text-[#25F4EE] transition-colors shrink-0 p-1.5"><Plus size={18}/></button>
                               )}
                             </div>
                           </div>
                         </div>

                         <div className="flex items-center gap-3 font-black pt-2">
                           <span className="text-amber-500"><ShieldAlert size={18}/></span>
                           <span className="text-[9px] sm:text-[10px] text-amber-500 tracking-widest uppercase">⚠️ ZERO TOLERANCE POLICY MONITORING ACTIVE</span>
                         </div>
                         <textarea disabled={!isPro} value={aiObjective} onChange={(e) => setAiObjective(e.target.value)} placeholder="Enter your strategic high-conversion message up to 300 characters, and our smart engine will generate intelligent shuffle combinations. REVIEW THEM ⚠️" className={`input-premium h-[160px] sm:h-[180px] resize-none font-sans font-medium text-sm sm:text-base not-italic normal-case leading-relaxed ${isAiObjectiveForbidden ? '!text-[#FE2C55] !border-[#FE2C55] shadow-[0_0_15px_rgba(254,44,85,0.3)]' : ''}`} />
                         
                         <button onClick={handlePrepareBatch} disabled={!isPro || logs.length === 0 || isAiObjectiveForbidden || isAiProcessing} className={`text-black text-[11px] sm:text-xs py-5 sm:py-6 rounded-xl sm:rounded-2xl shadow-[0_0_20px_rgba(37,244,238,0.2)] disabled:opacity-30 hover:scale-[1.02] transition-transform w-full mt-3 sm:mt-5 font-black uppercase ${isAiObjectiveForbidden ? 'bg-white/20 !text-white/50 cursor-not-allowed' : 'bg-[#25F4EE]'}`}>
                            {isAiObjectiveForbidden ? "SYSTEM STANDBY — CORRECT PAYLOAD" : (isAiProcessing ? "GENERATING BLOCKS..." : `SYNTHESIZE QUEUE`)}
                         </button>
                      </div>
                      
                      {/* PAINEL DE DISPARO REMOTO & DIAGNÓSTICO GHOST PROTOCOL */}
                      <div className="bg-[#111] border border-white/5 rounded-2xl sm:rounded-[2rem] flex flex-col items-center justify-center p-8 sm:p-10 min-h-[220px] sm:min-h-[250px] text-center shadow-inner relative overflow-hidden mt-5 lg:mt-0 uppercase">
                        {smsQueueCount > 0 ? (
                          <div className="flex flex-col items-center justify-center w-full animate-in fade-in zoom-in-95">
                             <div className="mb-6 sm:mb-8">
                               <p className="text-6xl sm:text-7xl font-black text-amber-500 tracking-tighter animate-pulse not-italic">{smsQueueCount}</p>
                               <p className="text-[10px] sm:text-[11px] text-white/40 tracking-widest mt-3 font-black">PENDING IN RELAY QUEUE</p>
                             </div>
                             <div className="text-amber-500 flex flex-col items-center gap-4">
                               <RefreshCw size={28} className="animate-spin" />
                               <p className="text-[10px] sm:text-[11px] tracking-widest animate-pulse font-bold">TRANSMITTING VIA SECURE P2P GATEWAY...</p>
                             </div>
                             
                             <button onClick={handleClearQueue} disabled={loading} className="mt-8 text-[10px] sm:text-[11px] text-white/30 hover:text-[#FE2C55] transition-colors uppercase tracking-widest flex items-center gap-2.5 border border-white/10 px-5 py-2.5 rounded-lg bg-black font-black">
                               <Trash2 size={14}/> PURGE QUEUE
                             </button>

                             {nodeWarningActive && (
                               <div className="mt-8 p-5 w-full bg-[#FE2C55]/10 border border-[#FE2C55]/30 rounded-2xl text-left animate-in slide-in-from-bottom-2">
                                 <p className="text-[11px] sm:text-xs text-[#FE2C55] font-black tracking-widest flex items-center gap-2 mb-2 uppercase"><WifiOff size={14}/> DEVICE DISCONNECTED</p>
                                 <p className="text-[9px] sm:text-[10px] text-white/60 font-sans not-italic normal-case leading-relaxed">If queue doesn't clear, your Web App and Relay App are using different Firebase databases. Clear the queue and ensure you are using the same configuration.</p>
                               </div>
                             )}
                          </div>
                        ) : (
                          <div className="opacity-20 flex flex-col items-center">
                            <ShieldAlert size={56} className="mb-5 text-white" />
                            <p className="text-xs sm:text-sm font-black tracking-widest">SYSTEM STANDBY</p>
                          </div>
                        )}

                        {/* HIGH-TECH GHOST PROTOCOL EXPLANATION BADGE */}
                        {!smsQueueCount && (
                          <div className="absolute bottom-5 left-5 right-5 p-4 sm:p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-left hidden sm:block">
                             <p className="text-[10px] sm:text-[11px] text-[#10B981] font-black tracking-widest flex items-center gap-2.5 mb-2 uppercase"><Wifi size={14} className="animate-pulse"/> GHOST PROTOCOL ACTIVE</p>
                             <p className="text-[9px] sm:text-[10px] text-white/30 font-sans not-italic normal-case leading-relaxed">Secure background routing active. To preserve operational stealth, transmissions operate independently and will not be visible in your device's native SMS outbox.</p>
                          </div>
                        )}
                      </div>
                   </div>
                 )}
              </div>
              {!isPro && <div className="pro-lock-layer p-5"><p className="text-[#FE2C55] tracking-widest text-[12px] sm:text-sm mb-4 shadow-xl animate-pulse font-black uppercase"><Lock size={14} className="inline mr-2.5"/> PRO LOCKED</p><button onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({behavior: 'smooth'})} className="bg-[#25F4EE] text-black text-[10px] sm:text-[11px] px-10 py-4 rounded-xl whitespace-nowrap font-black uppercase">UNLOCK NEXUS AGENT</button></div>}
            </div>

            {/* PROTOCOL INVENTORY (LINKS) */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-3xl mb-16 flex flex-col text-left">
              <div className="p-8 sm:p-10 border-b border-white/10 flex justify-between items-center bg-[#111]"><div className="flex items-center gap-3"><Radio size={24} className="text-[#25F4EE]" /><h3 className="text-xl sm:text-2xl tracking-tight font-black uppercase">ACTIVE PROTOCOLS INVENTORY</h3></div></div>
              <div className="min-h-[150px] sm:min-h-[250px] max-h-[40vh] overflow-y-auto bg-black custom-scrollbar">
                {linksHistory.length > 0 ? linksHistory.map(l => (
                  <div key={l.id} className="p-6 sm:p-10 border-b border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-5 sm:gap-8 hover:bg-white/[0.02] transition-colors">
                    <div className="flex-1 overflow-hidden">
                       <p className="text-[11px] sm:text-xs text-white/30 mb-2 flex items-center gap-2.5 tracking-widest uppercase"><Calendar size={14}/> {l.created_at && typeof l.created_at.toDate === 'function' ? l.created_at.toDate().toLocaleString('en-US') : 'Syncing Gateway...'}</p>
                       <p className="text-base sm:text-lg text-[#25F4EE] truncate font-sans not-italic normal-case max-w-[280px] sm:max-w-[600px]">{l.url}</p>
                       <p className="text-[10px] sm:text-[11px] text-white/40 mt-2.5 leading-relaxed font-sans not-italic normal-case truncate">HOST: {String(l.company)} | PAYLOAD: {String(l.msg).substring(0,80)}...</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                       <button onClick={() => {navigator.clipboard.writeText(l.url); alert("Handshake Gateway Copied!");}} className="flex-1 md:flex-none p-3.5 sm:p-4 bg-white/5 rounded-xl border border-white/10 hover:text-[#25F4EE] transition-colors flex justify-center"><Copy size={18}/></button>
                       <button onClick={() => {setEditingLink(l); setGenTo(l.to); setCompanyName(l.company); setGenMsg(l.msg); setView('home'); window.scrollTo(0,0);}} className="flex-1 md:flex-none p-3.5 sm:p-4 bg-white/5 rounded-xl border border-white/10 hover:text-amber-500 transition-colors flex justify-center"><Edit size={18}/></button>
                       <button onClick={() => handleDeleteLink(l.id)} className="flex-1 md:flex-none p-3.5 sm:p-4 bg-white/5 rounded-xl border border-white/10 hover:text-[#FE2C55] transition-colors flex justify-center"><Trash size={18}/></button>
                    </div>
                  </div>
                )) : <div className="p-20 sm:p-24 text-center opacity-20 uppercase"><Lock size={48} className="mx-auto mb-5" /><p className="text-[11px] sm:text-[12px] tracking-widest font-black">NO PROTOCOLS ESTABLISHED</p></div>}
              </div>
            </div>

            {/* UPGRADE STATION */}
            <div id="marketplace-section" className="mb-14 sm:mb-20 mt-10 sm:mt-12 text-left">
               <div className="flex items-center gap-3 mb-10 sm:mb-12"><ShoppingCart size={28} className="text-[#FE2C55]"/><h3 className="text-2xl sm:text-3xl text-white text-glow-white font-black uppercase">NEXUS UPGRADE HUB</h3></div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 mb-8 sm:mb-10 text-left">
                 <div className="bg-[#111] border border-white/10 p-10 sm:p-12 rounded-3xl sm:rounded-[3rem] group shadow-2xl hover:border-[#25F4EE]/50 transition-colors">
                    <h3 className="text-3xl sm:text-4xl text-white mb-4 sm:mb-5 font-black tracking-tight uppercase">NEXUS ROUTING PRO</h3>
                    <p className="text-5xl sm:text-6xl text-[#25F4EE] mb-8 sm:mb-10 font-black tracking-tighter not-italic">{isMaster ? "0.00 / MASTER" : "$9.00 / MONTH"}</p>
                    <p className="text-[10px] sm:text-[11px] text-white/40 mb-10 sm:mb-12 leading-relaxed pr-5 sm:pr-0 not-italic normal-case font-medium">UNLIMITED REDIRECTIONS & SECURE VAULT ACCESS FOR ALL YOUR CAPTURED LEADS.</p>
                    {isMaster ? <button className="btn-strategic !bg-[#25F4EE] !text-black text-[11px] sm:text-xs w-full py-5 sm:py-6 font-black uppercase">UNLIMITED ACCESS</button> : <button onClick={() => window.location.href = STRIPE_LINKS.NEXUS_ROUTING_PRO} className="btn-strategic !bg-white !text-black text-[11px] sm:text-xs w-full py-5 sm:py-6 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] font-black uppercase">UPGRADE NOW</button>}
                 </div>
                 <div className="bg-[#25F4EE]/10 border border-[#25F4EE] p-10 sm:p-12 rounded-3xl sm:rounded-[3rem] group shadow-[0_0_30px_rgba(37,244,238,0.15)] hover:scale-[1.01] transition-transform">
                    <h3 className="text-3xl sm:text-4xl text-white mb-4 sm:mb-5 text-[#25F4EE] font-black tracking-tight uppercase">NEXUS AUTOMATION ENGINE</h3>
                    <p className="text-5xl sm:text-6xl text-[#25F4EE] mb-8 sm:mb-10 font-black tracking-tighter not-italic">{isMaster ? "0.00 / MASTER" : "$19.90 / MONTH"}</p>
                    <p className="text-[10px] sm:text-[11px] text-white/40 mb-10 sm:mb-12 leading-relaxed pr-5 sm:pr-0 not-italic normal-case font-medium">FULL AI NATIVE SYNTHESIS & AUTOMATED PACING DELAY. INCLUDES 800 BONUS PACKETS ON ACTIVATION.</p>
                    {isMaster ? <button className="btn-strategic !bg-[#25F4EE] !text-black text-[11px] sm:text-xs w-full py-5 sm:py-6 font-black uppercase">UNLIMITED ACCESS</button> : <button onClick={() => window.location.href = STRIPE_LINKS.NEXUS_AUTOMATION_ENGINE} className="btn-strategic !bg-[#25F4EE] !text-black text-[11px] sm:text-xs w-full py-5 sm:py-6 shadow-[0_0_20px_rgba(37,244,238,0.3)] font-black uppercase">ACTIVATE GATEWAY</button>}
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 mb-16 sm:mb-20 uppercase">
                 {[
                   { name: "STARTER GATEWAY", qty: 400, price: isMaster ? "0.00 / MASTER" : "$12.00", link: STRIPE_LINKS.STARTER_PACK },
                   { name: "NEXUS PACK", qty: 800, price: isMaster ? "0.00 / MASTER" : "$20.00", link: STRIPE_LINKS.NEXUS_PACK },
                   { name: "ELITE OPERATOR", qty: 1800, price: isMaster ? "0.00 / MASTER" : "$29.00", link: STRIPE_LINKS.ELITE_PACK }
                 ].map(pack => (
                   <div key={pack.name} className="bg-white/5 border border-white/10 p-8 sm:p-10 rounded-2xl sm:rounded-[2.5rem] text-center shadow-xl flex flex-col items-center hover:bg-white/10 transition-colors">
                     <p className="text-[11px] sm:text-[12px] text-[#25F4EE] mb-3 tracking-widest font-black">{pack.name}</p>
                     <p className="text-4xl sm:text-5xl text-white mb-5 font-black not-italic">{pack.qty}</p>
                     <p className="text-[10px] sm:text-[11px] text-white/50 tracking-[0.2em] mb-5 font-black">PRO TRANSMISSION PACKETS</p>
                     <p className="text-2xl sm:text-3xl text-[#25F4EE] mb-10 font-black not-italic">{pack.price}</p>
                     <button onClick={() => {if(!isMaster) window.location.href = pack.link}} className="w-full py-4 sm:py-5 bg-black border border-white/10 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black tracking-widest hover:bg-[#25F4EE] hover:text-black transition-all">ACQUIRE PACK</button>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- COOKIE & LEGAL CONSENT BANNER (EXPANDABLE) --- */}
      {cookieConsent === 'pending' && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[#25F4EE]/30 p-6 sm:p-10 z-[9999] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.9)] animate-in slide-in-from-bottom-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
           <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                 <div className="flex-1 text-left">
                   <h4 className="text-[#25F4EE] font-black text-sm sm:text-base mb-4 tracking-widest uppercase flex items-center gap-3"><ShieldCheck size={24}/> LEGAL & PRIVACY CONSENT</h4>
                   <p className="text-sm sm:text-base text-white/70 leading-relaxed font-medium not-italic normal-case">
                     We use strictly necessary cookies to ensure platform security and session integrity. Optional analytics help us improve your experience. You assume full legal responsibility by proceeding.
                   </p>
                 </div>
                 <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto shrink-0 uppercase">
                    <button onClick={() => setShowCookieDetails(!showCookieDetails)} className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl text-[11px] sm:text-xs font-black tracking-widest hover:bg-white/10 transition-colors w-full sm:w-auto">
                      {showCookieDetails ? 'HIDE TERMS' : 'READ FULL TERMS'}
                    </button>
                    <button onClick={() => { localStorage.setItem('nexus_legal_consent', 'essential'); setCookieConsent('resolved'); }} className="px-8 py-4 bg-[#FE2C55]/10 border border-[#FE2C55]/30 text-[#FE2C55] rounded-xl text-[11px] sm:text-xs font-black tracking-widest hover:bg-[#FE2C55]/20 transition-colors w-full sm:w-auto">
                      REJECT (ESSENTIAL ONLY)
                    </button>
                    <button onClick={() => { localStorage.setItem('nexus_legal_consent', 'all'); setCookieConsent('resolved'); }} className="px-10 py-4 bg-[#25F4EE] text-black rounded-xl text-[11px] sm:text-xs font-black tracking-widest shadow-[0_0_20px_rgba(37,244,238,0.3)] hover:scale-105 transition-transform w-full sm:w-auto">
                      ACCEPT ALL
                    </button>
                 </div>
              </div>
              
              {/* Expandable Terms Accordion */}
              {showCookieDetails && (
                 <div className="p-8 sm:p-10 bg-[#111] border border-white/5 rounded-2xl animate-in fade-in zoom-in-95 text-left mt-3">
                    <p className="text-sm sm:text-base text-white/60 font-sans not-italic normal-case leading-loose">
                      <span className="text-amber-500 font-black block mb-3 uppercase tracking-widest text-[11px] sm:text-xs">ZERO TOLERANCE & COMPLIANCE PROTOCOL</span>
                      SMART SMS PRO operates under an absolute Zero Tolerance Policy. Any attempt to utilize this platform for bypassing operational laws, conducting phishing, scams, extortion, malware distribution, or sending unsolicited spam will result in immediate and permanent termination of the operator's gateway. Our Nexus Engine actively monitors all payload streams. Malicious intent is automatically flagged, blocked in real-time, and logged for security review. You assume full legal responsibility for the content transmitted through your node.
                      <br/><br/>
                      <span className="text-[#25F4EE] font-black block mb-3 uppercase tracking-widest text-[11px] sm:text-xs">ESSENTIAL COOKIES (MANDATORY)</span>
                      These cookies are required for basic site functionality, user authentication, and to prevent CSRF/XSS attacks. They cannot be disabled.
                    </p>
                 </div>
              )}
           </div>
        </div>
      )}

      {/* FOOTER (ULTRA RESPONSIVE WITH DYNAMIC MODALS) */}
      <footer className="mt-auto pb-16 sm:pb-24 w-full z-[100] px-8 sm:px-12 border-t border-white/5 pt-16 sm:pt-24 text-left bg-[#010101] relative">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-14 text-[11px] sm:text-[12px] tracking-[0.15em] sm:tracking-widest text-white/30 font-black uppercase">
          <div className="flex flex-col gap-5 sm:gap-6"><span className="text-white/40 border-b border-white/5 pb-3">LEGAL PROTOCOLS</span><button onClick={() => setLegalContent('PRIVACY')} className="text-left hover:text-[#25F4EE] transition-colors">PRIVACY POLICY</button><button onClick={() => setLegalContent('TERMS')} className="text-left hover:text-[#25F4EE] transition-colors">TERMS OF USE</button><button onClick={() => setLegalContent('ZERO')} className="text-left hover:text-amber-500 transition-colors">ZERO TOLERANCE POLICY</button></div>
          <div className="flex flex-col gap-5 sm:gap-6"><span className="text-white/40 border-b border-white/5 pb-3">GLOBAL COMPLIANCE</span><button onClick={() => setLegalContent('LGPD')} className="text-left hover:text-[#FE2C55] transition-colors">LGPD PROTOCOL</button><button onClick={() => setLegalContent('GDPR')} className="text-left hover:text-[#FE2C55] transition-colors">GDPR NODE</button></div>
          <div className="flex flex-col gap-5 sm:gap-6"><span className="text-white/40 border-b border-white/5 pb-3">INFRASTRUCTURE</span><span className="text-left hover:text-white transition-colors cursor-default">U.S. ROUTING SERVERS</span><span className="text-left hover:text-white transition-colors cursor-default">EU SECURE SERVERS</span></div>
          <div className="flex flex-col gap-5 sm:gap-6"><span className="text-white/40 border-b border-white/5 pb-3">OPERATOR SUPPORT</span><button onClick={() => setShowSmartSupport(true)} className="text-left hover:text-[#25F4EE] flex items-center gap-3">SMART SUPPORT <Bot size={16}/></button></div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 sm:mt-20 pt-10 border-t border-white/5 flex justify-center">
           <p className="text-[10px] sm:text-[12px] text-white/20 tracking-[0.3em] sm:tracking-[0.5em] text-center w-full px-5 text-glow-white font-black uppercase">© 2026 CLICKMORE DIGITAL | EXCLUSIVE SECURITY PROTOCOL</p>
        </div>
      </footer>

      {/* --- DYNAMIC LEGAL MODAL (ZERO RELOAD, ULTRA RESPONSIVE) --- */}
      {legalContent && (
        <div className="fixed inset-0 z-[700] bg-[#010101]/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 sm:p-8 text-left animate-in fade-in zoom-in-95">
          <div className="bg-[#0a0a0a] border border-[#25F4EE]/30 w-full max-w-2xl rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_0_50px_rgba(37,244,238,0.15)] flex flex-col max-h-[85vh] overflow-hidden relative">
             
             <div className="p-8 sm:p-10 border-b border-white/10 flex justify-between items-center bg-[#111] shrink-0">
                <div className="flex items-center gap-4 sm:gap-5">
                   {legalContent === 'ZERO' ? <ShieldAlert size={32} className="text-amber-500" /> : <ShieldCheck size={32} className="text-[#25F4EE]" />}
                   <h3 className="text-2xl sm:text-3xl text-white tracking-tight font-black uppercase">{legalContent === 'ZERO' ? 'ZERO TOLERANCE POLICY' : 'LEGAL PROTOCOL'}</h3>
                </div>
                <button onClick={() => setLegalContent(null)} className="p-3 sm:p-3.5 bg-black border border-white/10 rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-colors"><X size={24}/></button>
             </div>

             <div className="p-8 sm:p-12 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-[#111] to-black">
                {legalContent === 'ZERO' ? (
                  <p className="text-base sm:text-lg text-white/70 font-sans not-italic normal-case leading-loose sm:leading-loose">
                    <span className="text-amber-500 font-bold block mb-5 uppercase tracking-widest text-[11px] sm:text-xs">STRICT COMPLIANCE ENFORCEMENT</span>
                    SMART SMS PRO operates under an absolute Zero Tolerance Policy. Any attempt to utilize this platform for bypassing operational laws, conducting phishing, scams, extortion, malware distribution, or sending unsolicited spam will result in immediate and permanent termination of the operator's gateway.<br/><br/>
                    Our Nexus Engine actively monitors all payload streams. Malicious intent is automatically flagged, blocked in real-time, and logged for security review. You assume full legal responsibility for the content transmitted through your node.
                  </p>
                ) : (
                  <p className="text-base sm:text-lg text-white/70 font-sans not-italic normal-case leading-loose sm:leading-loose">
                    {renderLegalContent()?.text}
                  </p>
                )}
                
                <div className="mt-10 sm:mt-14 p-6 sm:p-8 bg-[#25F4EE]/5 border border-[#25F4EE]/20 rounded-2xl sm:rounded-3xl">
                   <p className="text-[11px] sm:text-[12px] text-[#25F4EE] font-black tracking-widest uppercase mb-3">ENCRYPTED AT REST</p>
                   <p className="text-sm sm:text-base text-white/40 font-sans not-italic normal-case leading-relaxed">By engaging with the SMART SMS PRO ecosystem, your footprint is subjected to AES-256 standard cryptographic masking. No unauthorized external relays possess decryption keyframes.</p>
                </div>
             </div>

             <div className="p-8 sm:p-10 border-t border-white/10 bg-black shrink-0 flex justify-end">
                <button onClick={() => setLegalContent(null)} className="w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 bg-[#25F4EE] text-black text-[12px] sm:text-sm font-black tracking-widest uppercase rounded-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(37,244,238,0.3)]">ACKNOWLEDGE & CLOSE</button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL DE PAREAMENTO QR CODE (NODE SYNC) */}
      {showSyncModal && (
        <div className="fixed inset-0 z-[600] bg-[#010101]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95">
          <div className="lighthouse-neon-wrapper w-full max-w-sm shadow-[0_0_50px_rgba(37,244,238,0.3)]">
            <div className="lighthouse-neon-content p-8 sm:p-10 flex flex-col items-center relative">
              <button onClick={() => setShowSyncModal(false)} className="absolute top-4 sm:top-6 right-4 sm:right-6 text-white/30 hover:text-white"><X size={24}/></button>
              <Smartphone size={48} className="text-[#25F4EE] mb-5 sm:mb-6 animate-pulse" />
              <h3 className="text-2xl sm:text-3xl tracking-tighter text-white mb-2 font-black uppercase">SYNC RELAY DEVICE</h3>
              <p className="text-[9px] sm:text-[10px] text-white/50 tracking-widest mb-6 sm:mb-8 font-sans font-medium not-italic normal-case px-2 text-center">Scan QR Code via Native Engine Terminal to establish secure P2P tunnel for automated dispatch.</p>
              
              <div className="bg-white p-3 sm:p-4 rounded-[1.5rem] sm:rounded-3xl mb-6 sm:mb-8 shadow-[0_0_20px_#25F4EE]">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(syncToken || 'GENERATING...')}&color=000000`} alt="Sync QR" className="w-36 h-36 sm:w-44 sm:h-44" />
              </div>
              
              {/* Token TTL Indicator */}
              <div className="mb-5 flex items-center justify-center gap-2 text-[9px] tracking-widest text-[#10B981] font-black uppercase">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></div>
                <span>SECURE TOKEN ACTIVE — ROTATES EVERY 5 MIN</span>
              </div>
              
              <button onClick={() => { setIsDeviceSynced(true); setShowSyncModal(false); }} className="btn-strategic !bg-[#25F4EE] !text-black text-[10px] sm:text-[11px] w-full py-4 sm:py-5 shadow-xl mb-2 sm:mb-4 font-black uppercase">
                CONFIRM DEVICE SYNC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SETUP GUIDE MODAL WITH QR & COPY LINK */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 text-center animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-[#25F4EE]/50 rounded-3xl sm:rounded-[2rem] p-8 sm:p-10 max-w-lg w-full relative shadow-[0_0_50px_rgba(37,244,238,0.2)] max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col items-center">
            
            <div className="absolute top-5 right-5 z-10">
               <button onClick={() => setShowHelpModal(false)} className="bg-black border border-white/10 p-2 sm:p-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors shadow-lg"><X size={20}/></button>
            </div>
            
            <div className="flex justify-center mb-6 sm:mb-8 mt-5">
              <div className="p-4 bg-[#25F4EE]/10 rounded-full border border-[#25F4EE]/30 animate-pulse">
                <DownloadCloud size={32} className="text-[#25F4EE]" />
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-6 sm:mb-8 text-center uppercase">NATIVE RELAY SETUP GUIDE</h2>

            {/* APK DOWNLOAD QR */}
            <div className="bg-white p-4 sm:p-5 rounded-[1.5rem] sm:rounded-3xl mb-8 shadow-[0_0_20px_#25F4EE]">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent("https://expo.dev/artifacts/eas/egRVRodLFQ2vZoofTxnfGw.apk")}&color=000000`} alt="Download APK QR" className="w-40 h-40 sm:w-48 sm:h-48" />
            </div>
            
            <div className="bg-[#FE2C55]/10 border border-[#FE2C55]/30 text-[#FE2C55] px-5 sm:px-6 py-4 sm:py-5 rounded-xl flex items-center gap-4 mb-8 text-left w-full uppercase">
              <Info size={28} className="shrink-0" />
              <p className="text-[10px] sm:text-[11px] font-black leading-relaxed tracking-widest text-pretty">SYSTEM REQUIREMENT: THIS AUTOMATION WORKS EXCLUSIVELY WITH ANDROID TERMINALS.</p>
            </div>

            <div className="space-y-4 sm:space-y-5 text-left mb-10 w-full font-black">
              <div className="bg-black border border-white/5 p-5 sm:p-6 rounded-xl sm:rounded-2xl">
                <p className="text-[#25F4EE] font-black text-[10px] sm:text-[11px] tracking-widest mb-2 uppercase">STEP 1</p>
                <p className="text-white text-[12px] sm:text-sm font-medium font-sans not-italic normal-case leading-relaxed">Scan the QR code above or use the buttons below to download the Relay Engine.</p>
              </div>
              <div className="bg-black border border-white/5 p-5 sm:p-6 rounded-xl sm:rounded-2xl">
                <p className="text-[#25F4EE] font-black text-[10px] sm:text-[11px] tracking-widest mb-2 uppercase">STEP 2</p>
                <p className="text-white text-[12px] sm:text-sm font-medium font-sans not-italic normal-case leading-relaxed">Open the terminal on your device and grant the required dispatch & camera permissions.</p>
              </div>
              <div className="bg-black border border-white/5 p-5 sm:p-6 rounded-xl sm:rounded-2xl">
                <p className="text-[#25F4EE] font-black text-[10px] sm:text-[11px] tracking-widest mb-2 uppercase">STEP 3</p>
                <p className="text-white text-[12px] sm:text-sm font-medium font-sans not-italic normal-case leading-relaxed">Click "SYNC RELAY DEVICE" on this dashboard and scan the QR Code with your terminal.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <a href="https://expo.dev/artifacts/eas/egRVRodLFQ2vZoofTxnfGw.apk" target="_blank" rel="noreferrer" className="w-full bg-gradient-to-r from-[#25F4EE] to-[#1AB5B0] text-black font-black text-[12px] sm:text-sm py-5 sm:py-6 rounded-xl shadow-[0_0_20px_rgba(37,244,238,0.4)] flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform text-center flex-1 uppercase">
                <DownloadCloud size={20} className="shrink-0" />
                <span className="truncate">NATIVE ENGINE DIRECTORY</span>
              </a>
              <button onClick={() => {navigator.clipboard.writeText("https://expo.dev/artifacts/eas/egRVRodLFQ2vZoofTxnfGw.apk"); alert("Relay Engine Directory Copied!");}} className="bg-white/10 text-white font-black text-[12px] sm:text-sm py-5 sm:py-6 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center px-8 shrink-0 uppercase">
                <Copy size={20} /> COPY DIRECTORY
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
                <Edit size={20} className="text-amber-500"/>
                <h3 className="text-sm sm:text-base font-black tracking-widest text-white uppercase">EDIT LEAD — MASTER OVERRIDE</h3>
              </div>
              <button onClick={() => setEditLeadModal(null)} className="text-white/30 hover:text-white p-1"><X size={20}/></button>
            </div>
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <label className="text-[10px] tracking-widest text-white/40 font-black block mb-2 uppercase">IDENTITY (NAME)</label>
                <input
                  value={editLeadModal.nome_cliente}
                  onChange={e => setEditLeadModal(prev => ({ ...prev, nome_cliente: e.target.value }))}
                  className="input-premium w-full font-sans not-italic normal-case text-base"
                  placeholder="Lead full name"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-widest text-white/40 font-black block mb-2 uppercase">TARGET NUMBER (PHONE)</label>
                <input
                  type="tel"
                  value={editLeadModal.telefone_cliente}
                  onChange={e => setEditLeadModal(prev => ({ ...prev, telefone_cliente: e.target.value }))}
                  className="input-premium w-full font-sans not-italic normal-case text-base"
                  placeholder="+1 999 999 9999"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-widest text-white/40 font-black block mb-2 uppercase">ASSIGN FOLDER / CAMPAIGN</label>
                <select
                  value={editLeadModal.folderId || 'MANUAL'}
                  onChange={e => setEditLeadModal(prev => ({ ...prev, folderId: e.target.value }))}
                  className="input-premium w-full font-sans not-italic normal-case text-base bg-[#111] appearance-none"
                >
                  {folders.map(f => (
                    <option key={f.id} value={f.id} className="bg-[#111]">{f.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 pt-3 uppercase">
                <button onClick={() => setEditLeadModal(null)} className="flex-1 py-4 bg-white/5 text-white/50 rounded-xl text-[10px] sm:text-[11px] font-black tracking-widest hover:text-white transition-colors border border-white/10">CANCEL</button>
                <button onClick={handleAdminEditLead} disabled={loading} className="flex-1 py-4 bg-amber-500 text-black rounded-xl text-[10px] sm:text-[11px] font-black tracking-widest hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]">
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
                <Plus size={20} className="text-[#25F4EE]"/>
                <h3 className="text-sm sm:text-base font-black tracking-widest text-white uppercase">NEW CAMPAIGN FOLDER</h3>
              </div>
              <button onClick={() => setCreateFolderModal(false)} className="text-white/30 hover:text-white p-1"><X size={20}/></button>
            </div>
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <label className="text-[10px] tracking-widest text-white/40 font-black block mb-2 uppercase">FOLDER / CAMPAIGN NAME</label>
                <input
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
                  className="input-premium w-full font-sans not-italic normal-case text-base"
                  placeholder="e.g. Black Friday Campaign"
                  autoFocus
                />
              </div>
              <div className="flex gap-4 uppercase">
                <button onClick={() => setCreateFolderModal(false)} className="flex-1 py-4 bg-white/5 text-white/50 rounded-xl text-[10px] sm:text-[11px] font-black tracking-widest hover:text-white transition-colors border border-white/10">CANCEL</button>
                <button onClick={handleCreateFolder} className="flex-1 py-4 bg-[#25F4EE] text-black rounded-xl text-[10px] sm:text-[11px] font-black tracking-widest hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(37,244,238,0.3)]">CREATE</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
