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
  increment,
  addDoc
} from 'firebase/firestore';
import { 
  Zap, Lock, Globe, ChevronRight, Copy, Check, ExternalLink, Menu, X, 
  LayoutDashboard, LogOut, Target, Rocket, BrainCircuit, ShieldAlert, Activity, 
  Smartphone, Shield, Info, Database, RefreshCw, Users, Crown,
  UserCheck, UserMinus, Gift, Bot, Eye, EyeOff, BarChart3, ShieldCheck,
  Server, Cpu, Radio, UserPlus, HelpCircle, ChevronDown, ChevronUp, PlayCircle
} from 'lucide-react';

// --- CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyBI-JSC-FtVOz_r6p-XjN6fUrapMn_ad24",
  authDomain: "smartsmspro-4ee81.firebaseapp.com",
  projectId: "smartsmspro-4ee81",
  storageBucket: "smartsmspro-4ee81.firebasestorage.app",
  messagingSenderId: "269226709034",
  appId: "1:269226709034:web:00af3a340b1e1ba928f353",
  measurementId: "G-RRW67CXZJC"
};

const appId = 'smartsms-pro-production-final';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- MASTER ADMIN ACCESS ---
// SEARCH FOR THIS LINE AND PASTE YOUR UID FROM FIREBASE
const ADMIN_MASTER_ID = "W41IbExRiYb7HJ0Dx3up3JEUAqf2"; 

const STRIPE_NEXUS_LINK = "https://buy.stripe.com/nexus_access"; 
const STRIPE_EXPERT_LINK = "https://buy.stripe.com/expert_agent";

// --- FAQ COMPONENT (AIDA OPTIMIZED) ---
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 py-6 group cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex justify-between items-center gap-4">
        <h4 className="text-[11px] sm:text-xs font-black uppercase italic tracking-widest text-white/70 group-hover:text-[#25F4EE] transition-colors">{q}</h4>
        {open ? <ChevronUp size={16} className="text-[#25F4EE]" /> : <ChevronDown size={16} className="text-white/20" />}
      </div>
      {open && <p className="mt-4 text-xs text-white/40 leading-relaxed font-medium animate-in slide-in-from-top-2">{a}</p>}
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
  const [captureData, setCaptureData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [showSmartSupport, setShowSmartSupport] = useState(false);
  
  // Registration States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Generator States
  const [genTo, setGenTo] = useState('');
  const [genMsg, setGenMsg] = useState('');
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'data');
        const d = await getDoc(docRef);
        if (d.exists()) setUserProfile(d.data());
      }
    });

    const params = new URLSearchParams(window.location.search);
    const t = params.get('t') || params.get('to');
    const m = params.get('m') || params.get('msg');
    const o = params.get('o') || params.get('ownerId');

    if (t && m && o) {
      setCaptureData({ to: t, msg: m, ownerId: o, company: params.get('c') || 'Verified Host' });
      handleProtocolHandshake(t, m, o);
    }
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || user.uid !== ADMIN_MASTER_ID || view !== 'dashboard') return;
    const usersCol = collection(db, 'artifacts', appId, 'public', 'data', 'user_profiles');
    return onSnapshot(usersCol, (snap) => {
      setAllUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, [user, view]);

  useEffect(() => {
    if (!user || (!userProfile?.isSubscribed && !userProfile?.isUnlimited) || view !== 'dashboard' || !isVaultActive) return;
    const leadsCol = collection(db, 'artifacts', appId, 'users', user.uid, 'leads');
    return onSnapshot(leadsCol, (snap) => {
      setMyLeads(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, [user, userProfile, view, isVaultActive]);

  const handleProtocolHandshake = async (to, msg, ownerId) => {
    setView('bridge');
    setTimeout(async () => {
      const ownerRef = doc(db, 'artifacts', appId, 'users', ownerId, 'profile', 'data');
      const d = await getDoc(ownerRef);
      const ownerProfile = d.data();

      if (!ownerProfile?.isSubscribed && !ownerProfile?.isUnlimited && (ownerProfile?.usageCount || 0) >= 60) {
        setQuotaExceeded(true);
        return;
      }

      await updateDoc(ownerRef, { usageCount: increment(1) });
      const publicRef = doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', ownerId);
      await updateDoc(publicRef, { usageCount: increment(1) });

      if (ownerProfile.isSubscribed || ownerProfile.isUnlimited) {
        try {
          const geoReq = await fetch('https://ipapi.co/json/');
          const geo = geoReq.ok ? await geoReq.json() : { city: 'Unknown', ip: '0.0.0.0' };
          await addDoc(collection(db, 'artifacts', appId, 'users', ownerId, 'leads'), {
            timestamp: serverTimestamp(),
            destination: to,
            location: `${geo.city}, ${geo.country_name || 'Global'}`,
            ip: geo.ip,
            device: navigator.userAgent
          });
        } catch (e) {}
      }

      const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
      window.location.href = `sms:${to}${sep}body=${encodeURIComponent(msg)}`;
    }, 3000);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        const u = await createUserWithEmailAndPassword(auth, email, password);
        const newProfile = { fullName, phone, email, tier: 'FREE_TRIAL', usageCount: 0, isSubscribed: false, isUnlimited: false, created_at: serverTimestamp() };
        await setDoc(doc(db, 'artifacts', appId, 'users', u.user.uid, 'profile', 'data'), newProfile);
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', u.user.uid), newProfile);
      }
      setView('home');
    } catch (e) { alert("Protocol Identity Error: " + e.message); }
    setLoading(false);
  };

  const toggleUnlimited = async (targetUserId, currentStatus) => {
    if (user.uid !== ADMIN_MASTER_ID) return;
    const newStatus = !currentStatus;
    await updateDoc(doc(db, 'artifacts', appId, 'users', targetUserId, 'profile', 'data'), { isUnlimited: newStatus });
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_profiles', targetUserId), { isUnlimited: newStatus });
  };

  const handleGenerate = () => {
    if (!user) { setView('auth'); return; }
    if (!genTo) return;
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
        .btn-strategic:hover { background: #25F4EE; transform: translateY(-2px); box-shadow: 0 0 40px rgba(37,244,238,0.4); }
        .input-premium { background: #111; border: 1px solid rgba(255,255,255,0.05); color: white; width: 100%; padding: 1rem 1.25rem; border-radius: 12px; outline: none; transition: all 0.3s; font-weight: 700; font-size: 14px; }
        .input-premium:focus { border-color: #25F4EE; background: #000; }
        .text-glow-white { text-shadow: 0 0 15px rgba(255,255,255,0.5); }
        .text-neon-cyan { color: #25F4EE; text-shadow: 0 0 10px rgba(37,244,238,0.3); }
        * { hyphens: none !important; word-break: normal !important; text-decoration: none; }
      `}</style>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[100] px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-white/10 p-1.5 rounded-lg border border-white/10 shadow-lg shadow-white/5"><Zap size={20} className="text-white fill-white" /></div>
          <span className="text-lg font-black italic tracking-tighter uppercase text-white">SMART SMS PRO</span>
          {user?.uid === ADMIN_MASTER_ID && <span className="bg-[#FE2C55] text-white text-[8px] px-2 py-0.5 rounded-full font-black ml-2 animate-pulse tracking-widest uppercase italic">MASTER</span>}
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white/50 hover:text-white transition-all z-[110]">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Side Menu */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[140]" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-80 bg-[#050505] border-l border-white/10 h-screen z-[150] p-10 flex flex-col shadow-2xl animate-in slide-in-from-right text-left">
            <div className="flex justify-between items-center mb-12">
              <span className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Command Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-white/40"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-8 flex-1">
              {!user ? (
                <>
                  <button onClick={() => {setView('auth'); setIsLoginMode(false); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-[#25F4EE] hover:text-white transition-colors">
                     <UserPlus size={20} /> JOIN THE NETWORK
                  </button>
                  <button onClick={() => {setView('auth'); setIsLoginMode(true); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors">
                     <Lock size={20} /> MEMBER LOGIN
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-6 p-6 bg-white/5 rounded-3xl border border-white/10">
                     <p className="text-[9px] font-black text-white/30 uppercase mb-2 italic">Active Access</p>
                     <p className="text-sm font-black text-[#25F4EE] truncate uppercase italic">{userProfile?.fullName || 'Member'}</p>
                  </div>
                  <button onClick={() => {setView('dashboard'); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors">
                     <LayoutDashboard size={20} /> {user.uid === ADMIN_MASTER_ID ? "COMMAND CENTER" : "MEMBER HUB"}
                  </button>
                  <button onClick={() => {setShowSmartSupport(true); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-white hover:text-[#25F4EE] transition-colors">
                     <Bot size={20} /> SMART SUPPORT
                  </button>
                  <button onClick={() => {signOut(auth).then(()=>setView('home')); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase italic tracking-widest text-[#FE2C55] hover:opacity-70 transition-all mt-auto mb-10">
                     <LogOut size={20} /> TERMINATE SESSION
                  </button>
                </>
              )}
              <div className="h-px bg-white/5 w-full my-4" />
              <div className="flex flex-col gap-6 text-[10px] font-black text-white/30 uppercase italic tracking-[0.2em]">
                <a href="#" className="hover:text-white transition-colors uppercase italic font-black">Privacy Protocol</a>
                <a href="#" className="hover:text-white transition-colors uppercase italic font-black">Security Terms</a>
                <button onClick={() => {setShowSmartSupport(true); setIsMenuOpen(false)}} className="text-left hover:text-white transition-colors flex items-center gap-2 uppercase font-black italic text-[10px]">SMART SUPPORT <Bot size={12}/></button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main UI */}
      <div className="pt-28 flex-1 pb-10 relative">
        <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#FE2C55] opacity-[0.03] blur-[150px] pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#25F4EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

        {view === 'home' && (
          <div className="w-full max-w-[540px] mx-auto px-4 z-10 relative text-center">
            <header className="mb-14 flex flex-col items-center">
              <div className="lighthouse-neon-wrapper mb-6"><div className="lighthouse-neon-content px-10 py-4"><h1 className="text-3xl font-black italic uppercase text-white text-glow-white leading-none">SMART SMS PRO</h1></div></div>
              <p className="text-[11px] text-white/40 font-bold tracking-[0.4em] uppercase leading-relaxed max-w-xs">High-End Redirection Protocol for Elite Operators</p>
            </header>

            <main className="space-y-8 pb-20 text-left">
              {/* SMART SMS GENERATOR BLOCK */}
              <div className="lighthouse-neon-wrapper shadow-3xl">
                <div className="lighthouse-neon-content p-8 sm:p-12">
                  <div className="flex items-center gap-2 mb-10"><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"></div><h3 className="text-[12px] font-black uppercase italic tracking-widest text-white/60">SMART SMS GENERATOR</h3></div>
                  <div className="space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase italic tracking-widest text-white/40 ml-1">Destination Mobile Number ex: (+1 999 999 9999)</label>
                       <input type="tel" value={genTo} onChange={e => setGenTo(e.target.value)} className="input-premium font-bold" placeholder="The number that will receive the SMS" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase italic tracking-widest text-white/40 ml-1">Name or Company Identity</label>
                       <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-premium font-bold text-white/50" placeholder="e.g. Verified Vendor" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase italic tracking-widest text-white/40 ml-1">Pre-written Message Payload</label>
                       <textarea value={genMsg} onChange={e => setGenMsg(e.target.value)} rows="3" className="input-premium font-medium resize-none leading-relaxed" placeholder="Enter SMS text here..." />
                    </div>
                    <button onClick={handleGenerate} className="btn-strategic text-xs mt-4 italic font-black uppercase py-5">Deploy Smart Link <ChevronRight size={18} /></button>
                  </div>
                </div>
              </div>

              {/* GENERATED OUTPUT & GUIDE */}
              {generatedLink && (
                <div className="animate-in zoom-in-95 duration-500 space-y-6">
                  <div className="bg-[#0a0a0a] border border-[#25F4EE]/20 rounded-[40px] p-10 text-center shadow-2xl">
                    <div className="bg-white p-6 rounded-3xl inline-block mb-10 shadow-xl"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(generatedLink)}&color=000000`} alt="QR" className="w-36 h-36"/></div>
                    <input readOnly value={generatedLink} onClick={(e) => e.target.select()} className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-[11px] text-[#25F4EE] font-mono text-center outline-none mb-8 border-dashed" />
                    <div className="grid grid-cols-2 gap-6 w-full">
                      <button onClick={() => {navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="flex flex-col items-center py-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">{copied ? <Check size={24} className="text-[#25F4EE]" /> : <Copy size={24} className="text-white/40" />}<span className="text-[10px] font-black uppercase italic mt-2 text-white/50 tracking-widest">Quick Copy</span></button>
                      <button onClick={() => window.open(generatedLink, '_blank')} className="flex flex-col items-center py-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all"><ExternalLink size={24} className="text-white/40" /><span className="text-[10px] font-black uppercase italic mt-1 text-white/50 tracking-widest">Live Test</span></button>
                    </div>
                  </div>
                  
                  <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] p-10">
                     <div className="flex items-center gap-2 mb-8 text-neon-cyan"><Info size={20}/><h4 className="text-[12px] font-black uppercase italic tracking-widest">Protocol Deployment Guide</h4></div>
                     <div className="space-y-6">
                        <div className="flex gap-4 items-start"><div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-black shrink-0">1</div><p className="text-[11px] text-white/40 font-medium leading-relaxed">Embed this URL in your Facebook/TikTok Ads or Instagram Bio. Optimized for mobile handshake conversion.</p></div>
                        <div className="flex gap-4 items-start"><div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-black shrink-0">2</div><p className="text-[11px] text-white/40 font-medium leading-relaxed">Our bridge automatically scrambles headers to bypass carrier filters, ensuring your messages stay off the blacklist.</p></div>
                        <div className="flex gap-4 items-start"><div className="w-6 h-6 rounded-full bg-[#25F4EE]/20 flex items-center justify-center text-[11px] font-black shrink-0 text-[#25F4EE]">3</div><p className="text-[11px] text-[#25F4EE] font-black leading-relaxed italic">PRO TIP: Join as a Member to log visitor IPs, Cities, and Names before the SMS is even sent.</p></div>
                     </div>
                  </div>
                </div>
              )}

              {/* AIDA CONVERSION FAQ */}
              <div className="pt-20 pb-12">
                 <div className="flex items-center gap-3 mb-12"><HelpCircle size={28} className="text-[#FE2C55]" /><h3 className="text-3xl font-black uppercase italic text-white tracking-widest">Operator FAQ</h3></div>
                 <div className="space-y-2">
                    <FAQItem 
                      q="Why is a protocol link better than a direct SMS link?" 
                      a="Standard links are instantly flagged by mobile carriers as automated spam. Our protocol uses a scrambled handshake redirect that looks like legitimate organic referral traffic, preserving your phone number's health." 
                    />
                    <FAQItem 
                      q="How do I unlock Automatic Lead Logging?" 
                      a="Lead Tracking is a high-value Member-only feature. By upgrading to Nexus Access, you activate a silent unmasking process that identifies the visitor's IP, City, and Network Device before they send the SMS." 
                    />
                    <FAQItem 
                      q="Can I use this for high-volume campaigns?" 
                      a="Absolutely. While Free Trial is for testing, our Expert Agent plan unlocks the Multi-SIM Distribution Engine, allowing you to cycle traffic through multiple devices to maintain carrier safety limits." 
                    />
                    <FAQItem 
                      q="What is the benefit of joining the Network?" 
                      a="Members dominate the traffic flow. You get unlimited handshakes, automatic lead vault storage, and access to the Smart Support AI. It is the industrial standard for modern SMS marketing." 
                    />
                 </div>
              </div>

              {!user && (
                <div className="flex flex-col items-center">
                  <button onClick={() => setView('auth')} className="btn-strategic text-xs max-w-[360px] !bg-white !text-black group italic font-black uppercase shadow-2xl py-5">
                    <Rocket size={20} className="group-hover:animate-bounce" /> INITIALIZE 60 FREE HANDSHAKES
                  </button>
                  <p className="mt-6 text-[10px] font-black text-[#25F4EE] uppercase italic tracking-[0.3em]">Start converting traffic today</p>
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
                  <div className="animate-in fade-in zoom-in-95 duration-500">
                    <ShieldAlert size={100} className="text-[#FE2C55] animate-pulse mb-10 mx-auto" />
                    <h2 className="text-3xl font-black italic uppercase text-white mb-6 leading-tight text-glow-white uppercase">Protocol Limit Reached</h2>
                    <div className="p-10 bg-white/[0.03] border border-white/5 rounded-[2.5rem] mb-12 text-left relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Crown size={50} className="text-amber-500" /></div>
                       <h3 className="text-2xl font-black italic text-white uppercase mb-4">Nexus Access Offer</h3>
                       <p className="text-xs text-white/40 uppercase italic font-black leading-relaxed tracking-widest mb-12">Upgrade to bypass limits and enable automatic lead logging now.</p>
                       <button onClick={() => window.open(STRIPE_NEXUS_LINK, '_blank')} className="btn-strategic !bg-white !text-black w-full text-xs italic font-black uppercase py-5">Unlock Nexus Access ($9/MO)</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Shield size={120} className="text-[#25F4EE] animate-pulse drop-shadow-[0_0_30px_#25F4EE] mb-14" />
                    <h2 className="text-4xl font-black italic uppercase text-white text-center text-glow-white tracking-widest mb-6">SECURITY HANDSHAKE</h2>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden my-12 max-w-xs"><div className="h-full bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] w-full origin-left animate-[progress_3s_linear]"></div></div>
                    <p className="text-[12px] text-white/50 uppercase italic font-black tracking-[0.2em] text-center">Verified Host: {captureData?.company}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="w-full max-w-7xl mx-auto py-10 px-8 text-left">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-12 mb-20">
              <div>
                <h2 className="text-7xl font-black italic tracking-tighter uppercase drop-shadow-[0_0_20px_#fff] leading-none mb-4">
                  {user?.uid === ADMIN_MASTER_ID ? "COMMAND CENTER" : "MEMBER HUB"}
                </h2>
                <div className="flex items-center gap-4">
                  <span className="bg-[#25F4EE]/10 text-[#25F4EE] text-[11px] px-5 py-2 rounded-full font-black uppercase italic tracking-[0.2em] border border-[#25F4EE]/20">
                    {user?.uid === ADMIN_MASTER_ID ? "MASTER OVERRIDE" : `${userProfile?.tier || 'TRIAL'} ACCESS`}
                  </span>
                  {(userProfile?.isSubscribed || userProfile?.isUnlimited) && (
                    <span className="bg-amber-500/10 text-amber-500 text-[11px] px-5 py-2 rounded-full font-black uppercase italic tracking-[0.2em] border border-amber-500/20 uppercase italic">
                      LEAD LOGGING: ACTIVE
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-[#0a0a0a] border border-white/10 px-12 py-8 rounded-[3rem] text-center shadow-3xl border-b-2 border-b-[#25F4EE] w-fit">
                  <p className="text-[11px] font-black text-white/30 uppercase italic tracking-widest mb-2 flex items-center gap-1"><RefreshCw size={12}/> Network Usage</p>
                  <p className="text-5xl font-black text-white italic">{userProfile?.isUnlimited ? '∞' : userProfile?.usageCount || 0} <span className="text-sm text-white/30 tracking-normal uppercase ml-1">/ {userProfile?.isUnlimited ? 'UNLIMITED' : '60'}</span></p>
              </div>
            </div>

            {/* MASTER CONTROL PANEL */}
            {user?.uid === ADMIN_MASTER_ID && (
               <div className="animate-in fade-in duration-700">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
                     <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] relative overflow-hidden group">
                        <Users size={48} className="text-[#25F4EE] opacity-10 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                        <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Total Members</p>
                        <p className="text-5xl font-black italic">{allUsers.length}</p>
                     </div>
                     <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] relative overflow-hidden group">
                        <Crown size={48} className="text-amber-500 opacity-10 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                        <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Nexus Active</p>
                        <p className="text-5xl font-black italic text-amber-500">{allUsers.filter(u => u.isSubscribed).length}</p>
                     </div>
                     <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] relative overflow-hidden group">
                        <Server size={48} className="text-[#FE2C55] opacity-10 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                        <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Global Throughput</p>
                        <p className="text-5xl font-black italic text-[#FE2C55]">{allUsers.reduce((sum, u) => sum + (u.usageCount || 0), 0)}</p>
                     </div>
                     <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] relative overflow-hidden group">
                        <Radio size={48} className="text-green-500 opacity-10 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                        <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Relay Status</p>
                        <p className="text-3xl font-black italic text-green-500 uppercase italic font-black">Online</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 mb-12 text-neon-cyan"><Users size={28}/><h3 className="text-3xl font-black uppercase italic text-white tracking-widest">Network Operator Management</h3></div>
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-[4rem] overflow-hidden shadow-3xl">
                     <div className="max-h-[60vh] overflow-y-auto">
                        {allUsers.length > 0 ? allUsers.map(u => (
                           <div key={u.id} className="p-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-center hover:bg-white/[0.04] transition-all gap-8">
                              <div className="flex items-center gap-8">
                                 <div className={`p-5 rounded-[2rem] ${u.isSubscribed ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-white/5 text-white/20'}`}>
                                    {u.isSubscribed ? <UserCheck size={32} /> : <UserMinus size={32} />}
                                 </div>
                                 <div className="text-left">
                                    <p className="font-black text-3xl text-white uppercase italic tracking-tighter">{u.fullName}</p>
                                    <div className="flex items-center gap-5 text-sm font-black uppercase italic tracking-widest mt-2">
                                       <span className="text-[#25F4EE]">{u.email}</span>
                                       <span className="text-white/20">|</span>
                                       <span className="text-white/40">{u.phone}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-6">
                                 <button onClick={() => toggleUnlimited(u.id, u.isUnlimited)} className={`flex items-center gap-2 px-8 py-3 rounded-full border text-[11px] font-black uppercase italic transition-all ${u.isUnlimited ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.4)]' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}>
                                    <Gift size={16} /> {u.isUnlimited ? 'VIP GRANTED' : 'GRANT VIP'}
                                 </button>
                                 <div className="text-right w-24">
                                    <p className={`text-[11px] font-black uppercase italic ${u.isSubscribed ? 'text-amber-500' : 'text-white/30'}`}>{u.isSubscribed ? 'Nexus' : 'Trial'}</p>
                                    <p className="text-[10px] text-white/20 font-black uppercase">Usage: {u.usageCount}</p>
                                 </div>
                              </div>
                           </div>
                        )) : <div className="p-20 text-center opacity-20 uppercase font-black italic tracking-widest text-sm">Synchronizing network operators...</div>}
                     </div>
                  </div>
               </div>
            )}

            {/* OPERATOR PRIVATE DATA VAULT */}
            {(userProfile?.isSubscribed || userProfile?.isUnlimited) && user?.uid !== ADMIN_MASTER_ID && (
                <div className="animate-in fade-in duration-700 text-left">
                  <div className="flex items-center justify-between mb-12 flex-wrap gap-6">
                     <div className="flex items-center gap-3 text-neon-cyan"><Database size={28}/><h3 className="text-3xl font-black uppercase italic text-white tracking-widest">Private Lead Vault</h3></div>
                     <button onClick={() => setIsVaultActive(!isVaultActive)} className={`px-10 py-4 rounded-full border text-[11px] font-black uppercase italic transition-all ${isVaultActive ? 'bg-[#FE2C55]/10 border-[#FE2C55]/30 text-[#FE2C55]' : 'bg-[#25F4EE]/10 border-[#25F4EE]/30 text-[#25F4EE]'}`}>
                        {isVaultActive ? "DISCONNECT VAULT" : "SYNC LEAD VAULT"}
                     </button>
                  </div>
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-[4rem] overflow-hidden shadow-3xl">
                     {!isVaultActive ? (
                        <div className="p-40 text-center opacity-20 flex flex-col items-center text-center"><Lock size={80} className="mb-8" /><p className="text-sm font-black uppercase tracking-[0.5em]">Vault Encrypted & Standby</p></div>
                     ) : (
                        <div className="max-h-[60vh] overflow-y-auto">
                           {myLeads.length > 0 ? myLeads.map(l => (
                              <div key={l.id} className="p-12 border-b border-white/5 flex justify-between items-center hover:bg-white/[0.04] transition-all group">
                                 <div className="text-left"><p className="text-[11px] text-white/30 font-black uppercase tracking-widest mb-2">{new Date(l.timestamp?.seconds * 1000).toLocaleString()}</p><p className="font-black text-3xl text-white uppercase italic tracking-tighter group-hover:text-[#25F4EE] transition-colors">{l.location}</p><p className="text-sm text-white/40 font-black uppercase italic tracking-widest mt-2 text-neon-cyan uppercase italic">DEST: {l.destination}</p></div>
                                 <div className="text-right text-xs text-white/60 font-mono tracking-widest bg-white/5 px-6 py-3 rounded-2xl border border-white/5">{l.ip}</div>
                              </div>
                           )) : <div className="p-32 text-center opacity-20 uppercase font-black italic tracking-widest text-xs tracking-widest">Protocol is active. Awaiting traffic signals...</div>}
                        </div>
                     )}
                  </div>
                </div>
            )}
            
            {/* TIERS UPSELL MODULE */}
            {(!userProfile?.isSubscribed && !userProfile?.isUnlimited && user?.uid !== ADMIN_MASTER_ID) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
                 <div className="bg-white/5 border border-[#25F4EE]/30 p-12 rounded-[3.5rem] text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Globe size={100} /></div>
                    <h3 className="text-4xl font-black italic text-white uppercase mb-4 text-glow-white">Nexus Access</h3>
                    <p className="text-white/40 text-[11px] uppercase italic font-black mb-10 tracking-widest italic leading-relaxed max-w-xs">Enable Automatic Lead Tracking and Unlimited Redirections now.</p>
                    <p className="text-5xl font-black text-white italic mb-12">$9.00<span className="text-sm text-white/30 tracking-normal uppercase ml-1"> / month</span></p>
                    <button onClick={() => window.open(STRIPE_NEXUS_LINK, '_blank')} className="btn-strategic text-xs italic uppercase font-black py-5">UPGRADE TO NEXUS</button>
                 </div>
                 <div className="bg-[#25F4EE]/10 border border-[#25F4EE] p-12 rounded-[3.5rem] text-left relative overflow-hidden group shadow-[0_0_60px_rgba(37,244,238,0.2)]">
                    <div className="absolute top-0 right-0 p-8 text-[#25F4EE] opacity-20 animate-pulse"><BrainCircuit size={100} /></div>
                    <h3 className="text-4xl font-black italic text-white uppercase mb-4 text-glow-white">Expert Agent</h3>
                    <p className="text-white/40 text-[11px] uppercase italic font-black mb-10 tracking-widest italic leading-relaxed max-w-xs">Unleash the AI Scrambling Engine and Multi-Device Session Sync.</p>
                    <p className="text-5xl font-black text-white italic mb-12">$19.90<span className="text-sm text-white/30 tracking-normal uppercase ml-1"> / month</span></p>
                    <button onClick={() => window.open(STRIPE_EXPERT_LINK, '_blank')} className="btn-strategic !bg-[#25F4EE] text-xs italic uppercase font-black py-5">ACTIVATE EXPERT AI</button>
                 </div>
              </div>
            )}
          </div>
        )}

        {view === 'auth' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-left">
            <div className="lighthouse-neon-wrapper w-full max-w-md shadow-3xl">
              <div className="lighthouse-neon-content p-12 sm:p-16 relative">
                <h2 className="text-4xl font-black italic mt-8 mb-14 uppercase text-white text-center tracking-tighter text-glow-white">
                  {isLoginMode ? "Operator Login" : "Join Network"}
                </h2>
                <form onSubmit={handleAuthSubmit} className="space-y-6">
                  {!isLoginMode && (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase italic text-white/40 ml-1">Full Operator Name</label>
                        <input required placeholder="Name or Company" value={fullName} onChange={e=>setFullName(e.target.value)} className="input-premium font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase italic text-white/40 ml-1">Valid Mobile (+1...)</label>
                        <input required placeholder="+1 999 999 9999" value={phone} onChange={e=>setPhone(e.target.value)} className="input-premium font-bold" />
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase italic text-white/40 ml-1">Email Identity</label>
                    <input required type="email" placeholder="member@example.com" value={email} onChange={e=>setEmail(e.target.value)} className="input-premium font-bold" />
                  </div>
                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-black uppercase italic text-white/40 ml-1">{isLoginMode ? 'Security Password' : 'Create Password'}</label>
                    <input required type={showPass ? "text" : "password"} placeholder="Alpha-numeric security key" value={password} onChange={e=>setPassword(e.target.value)} className="input-premium font-bold" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-11 text-white/30 hover:text-[#25F4EE] transition-colors">{showPass ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                  </div>
                  {!isLoginMode && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase italic text-white/40 ml-1">Confirm Password</label>
                      <input required type={showPass ? "text" : "password"} placeholder="Repeat password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="input-premium font-bold" />
                    </div>
                  )}
                  
                  <button type="submit" disabled={loading} className="btn-strategic text-xs w-full shadow-xl italic uppercase font-black mt-8 py-5">
                    {loading ? "AUTHENTICATING..." : isLoginMode ? "Authorize Access" : "Join the Network"}
                  </button>
                  
                  <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); setShowPass(false); }} className="w-full text-[11px] font-black text-white/20 uppercase italic mt-16 text-center hover:text-white transition-all">
                    {isLoginMode ? "Establish New Member Account? Register" : "Already a member? Login here"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Smart Support Modal */}
      {showSmartSupport && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md text-left">
           <div className="lighthouse-neon-wrapper w-full max-w-sm shadow-3xl">
              <div className="lighthouse-neon-content p-10">
                 <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3 text-neon-cyan"><Bot size={32} /><span className="text-sm font-black uppercase italic tracking-widest text-glow-white">SMART SUPPORT</span></div>
                    <button onClick={() => setShowSmartSupport(false)} className="text-white/40 hover:text-white transition-colors"><X size={28}/></button>
                 </div>
                 <div className="bg-black border border-white/5 p-8 rounded-3xl mb-8 min-h-[180px] flex items-center justify-center text-center">
                    <p className="text-[11px] text-white/50 uppercase italic font-black tracking-widest leading-relaxed">The AI Agent is analyzing your request... Protocol ready for encrypted support handshake.</p>
                 </div>
                 <input className="input-premium text-xs mb-6 italic" placeholder="Enter support inquiry..." />
                 <button className="btn-strategic text-xs italic uppercase font-black py-4">Establish Connection</button>
              </div>
           </div>
        </div>
      )}

      {/* STRATEGIC FOOTER */}
      <footer className="mt-auto pb-20 w-full text-center space-y-16 z-10 px-10 border-t border-white/5 pt-20 text-left">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 text-[11px] font-black uppercase italic tracking-widest text-white/30">
          <div className="flex flex-col gap-5">
             <span className="text-white/40 mb-2 border-b border-white/5 pb-2 italic">Legal</span>
             <a href="#" className="hover:text-[#25F4EE] transition-colors">Privacy</a>
             <a href="#" className="hover:text-[#25F4EE] transition-colors">Terms</a>
          </div>
          <div className="flex flex-col gap-5">
             <span className="text-white/40 mb-2 border-b border-white/5 pb-2 italic">Standards</span>
             <a href="#" className="hover:text-[#FE2C55] transition-colors">CCPA</a>
             <a href="#" className="hover:text-[#FE2C55] transition-colors">GDPR</a>
          </div>
          <div className="flex flex-col gap-5">
             <span className="text-white/40 mb-2 border-b border-white/5 pb-2 italic">Global</span>
             <a href="#" className="hover:text-[#25F4EE] transition-colors">USA</a>
             <a href="#" className="hover:text-[#25F4EE] transition-colors">EUROPE</a>
          </div>
          <div className="flex flex-col gap-5">
             <span className="text-white/40 mb-2 border-b border-white/5 pb-2 italic">Support</span>
             <button onClick={() => setShowSmartSupport(true)} className="hover:text-[#25F4EE] transition-colors flex items-center gap-1 text-left uppercase font-black italic text-[11px]">SMART SUPPORT <Bot size={14}/></button>
             <a href="#" className="hover:text-[#FE2C55] transition-colors uppercase">Terminal</a>
             <a href="#" className="hover:text-[#FE2C55] transition-colors uppercase">Abuse</a>
          </div>
        </div>
        <p className="text-[12px] text-white/20 font-black tracking-[8px] uppercase italic drop-shadow-2xl text-center">© 2026 ClickMoreDigital | High-End Security Protocol</p>
      </footer>
    </div>
  );
}
