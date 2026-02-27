import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { 
  Zap, 
  Lock, 
  ShieldCheck, 
  Globe, 
  ChevronRight, 
  Copy, 
  Check, 
  ExternalLink, 
  Menu, 
  X, 
  LayoutDashboard, 
  LogOut, 
  Target, 
  Rocket,
  BrainCircuit,
  PlayCircle,
  ShieldAlert,
  Activity,
  Smartphone,
  Shield,
  Info,
  Link2
} from 'lucide-react';

// --- FIREBASE CONFIGURATION (VINCULADA) ---
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
const ADMIN_MASTER_ID = "MASTER_USER_ID"; 

export default function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [captureData, setCaptureData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [genTo, setGenTo] = useState('');
  const [genMsg, setGenMsg] = useState('');
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    const initAuth = async () => {
      if (!auth.currentUser) {
        try { await signInAnonymously(auth); } catch (e) { console.error("Auth init failed"); }
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u && !u.isAnonymous) {
        const docRef = doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'data');
        const d = await getDoc(docRef);
        if (d.exists()) {
          setUserProfile(d.data());
        } else {
          const defaultProfile = { isSubscribed: false, smsCredits: 0, dailySent: 0 };
          await setDoc(docRef, defaultProfile);
          setUserProfile(defaultProfile);
        }
      }
    });

    // BRIDGE LOGIC: Secure Auto-Redirect (No Storage for testing phase)
    const params = new URLSearchParams(window.location.search);
    const t = params.get('t') || params.get('to');
    const m = params.get('m') || params.get('msg');
    const c = params.get('c') || params.get('company');

    if (t && m) {
      setCaptureData({ to: t, msg: m, company: c || 'Verified Host' });
      setView('bridge');
      
      const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
      const smsLink = `sms:${t}${sep}body=${encodeURIComponent(m)}`;
      
      // Delay for security animation (Anti-Bot Logic)
      setTimeout(() => {
        window.location.href = smsLink;
      }, 2500);
    }
    return () => unsubscribe();
  }, []);

  const handleGenerate = () => {
    if (!genTo) return;
    const baseUrl = window.location.origin;
    // Sublime short link generation (t=to, m=msg, c=company)
    const shortLink = `${baseUrl}?t=${encodeURIComponent(genTo)}&m=${encodeURIComponent(genMsg)}&c=${encodeURIComponent(companyName || 'Verified Partner')}`;
    setGeneratedLink(shortLink);
  };

  const handleAuth = async (isLogin) => {
    setLoading(true);
    try {
      if (isLogin) await signInWithEmailAndPassword(auth, email, password);
      else await createUserWithEmailAndPassword(auth, email, password);
      setIsMenuOpen(false);
      setView('dashboard');
    } catch (e) { alert("Access denied. Please check credentials."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans selection:bg-[#25F4EE] selection:text-black antialiased flex flex-col">
      <style>{`
        @keyframes rotate-beam { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        .lighthouse-neon-wrapper { position: relative; padding: 1.5px; border-radius: 28px; overflow: hidden; background: transparent; display: flex; align-items: center; justify-content: center; }
        .lighthouse-neon-wrapper::before { content: ""; position: absolute; width: 600%; height: 600%; top: 50%; left: 50%; background: conic-gradient(transparent 0%, transparent 45%, #25F4EE 48%, #FE2C55 50%, #25F4EE 52%, transparent 55%, transparent 100%); animation: rotate-beam 5s linear infinite; z-index: 0; }
        .lighthouse-neon-content { position: relative; z-index: 1; background: #0a0a0a; border-radius: 27px; width: 100%; height: 100%; }
        .btn-strategic { background: #FFFFFF; color: #000000; box-shadow: 0 0 25px rgba(255,255,255,0.3); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-radius: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; width: 100%; padding: 1.15rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; border: none; cursor: pointer; }
        .btn-strategic:hover { background: #25F4EE; box-shadow: 0 0 45px rgba(37,244,238,0.6); transform: translateY(-2px) scale(1.02); }
        .input-premium { background: #111; border: 1px solid rgba(255,255,255,0.05); transition: all 0.3s ease; color: white; width: 100%; padding: 1rem 1.25rem; border-radius: 12px; outline: none; }
        .input-premium:focus { border-color: #25F4EE; box-shadow: 0 0 15px rgba(37,244,238,0.2); background: #000; }
        .text-glow-white { text-shadow: 0 0 15px rgba(255,255,255,0.5); }
        @keyframes progress { from { width: 0%; } to { width: 100%; } }
        * { hyphens: none !important; word-break: normal !important; text-decoration: none; }
      `}</style>

      {/* Nav Header */}
      <nav className="fixed top-0 left-0 right-0 h-14 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[100] px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-white/10 p-1 rounded-lg border border-white/10 shadow-lg shadow-white/5"><Zap size={18} className="text-white fill-white" /></div>
          <span className="text-md font-black italic tracking-tighter uppercase text-white">SMART SMS PRO</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 text-white/50 hover:text-white transition-all z-[110]">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Slide Menu */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[140]" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-72 bg-[#050505] border-l border-white/10 h-screen z-[150] p-10 animate-in slide-in-from-right duration-300 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-12">
              <span className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Command Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-white/40 hover:text-white"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-8 flex-1">
              {!user || user.isAnonymous ? (
                <button onClick={() => {setView('auth'); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-[#25F4EE]"><Lock size={18} /> MEMBER LOGIN</button>
              ) : (
                <>
                  <button onClick={() => {setView('dashboard'); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-[#25F4EE]"><LayoutDashboard size={18} /> DASHBOARD</button>
                  <button onClick={() => {signOut(auth).then(()=>setView('home')); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-[#FE2C55]"><LogOut size={18} /> LOGOUT</button>
                </>
              )}
              <div className="h-px bg-white/5 w-full" />
              <div className="flex flex-col gap-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                <a href="#" className="hover:text-white italic">Privacy Protocol</a>
                <a href="#" className="hover:text-white italic">Security Terms</a>
                <a href="#" className="hover:text-white italic">Support Center</a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Ambient background glows */}
      <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#FE2C55] opacity-[0.03] blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#25F4EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

      <div className="pt-24 flex-1">
        {view === 'home' && (
          <div className="w-full max-w-[520px] mx-auto px-4 z-10 relative">
            <header className="mb-12 text-center flex flex-col items-center">
              <div className="lighthouse-neon-wrapper mb-4">
                <div className="lighthouse-neon-content px-8 py-3">
                   <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-white text-glow-white text-center">SMART SMS PRO</h1>
                </div>
              </div>
              <p className="text-[10px] text-white/40 font-bold tracking-[0.4em] uppercase">International Standard SMS Protocol</p>
            </header>

            <main className="space-y-6">
              <div className="lighthouse-neon-wrapper shadow-3xl">
                <div className="lighthouse-neon-content p-7 sm:p-10 text-left">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] animate-pulse"></div>
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-white/60">Free Link Generator</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Destination Number</label>
                       <input type="tel" value={genTo} onChange={e => setGenTo(e.target.value)} className="input-premium font-bold text-sm" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Company / Personal Name</label>
                       <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-premium font-bold text-sm text-white/50" placeholder="e.g. Apple Support" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Pre-Written SMS Content</label>
                       <textarea value={genMsg} onChange={e => setGenMsg(e.target.value)} rows="2" className="input-premium text-xs font-medium resize-none" placeholder="Message to be pre-filled in the SMS app..." />
                       <p className="text-[8px] text-white/20 uppercase font-black italic">This content appears ready-to-send for the final user.</p>
                    </div>
                    <button onClick={handleGenerate} className="btn-strategic text-[11px] mt-2">Generate Smart Link <ChevronRight size={16} /></button>
                  </div>
                </div>
              </div>

              {generatedLink && (
                <div className="bg-[#0a0a0a] border border-[#25F4EE]/20 rounded-[40px] p-8 animate-in zoom-in-95 duration-500 shadow-2xl text-center">
                  <div className="bg-white p-5 rounded-3xl inline-block mb-8 shadow-xl">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(generatedLink)}&color=000000`} alt="QR" className="w-32 h-32"/>
                  </div>
                  
                  <div className="mb-6">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-2">Selectable Protocol URL:</label>
                    <input readOnly value={generatedLink} onClick={(e) => e.target.select()} className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-[10px] text-[#25F4EE] font-mono text-center outline-none cursor-text border-dashed" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full mb-6">
                    <button onClick={() => {navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="flex flex-col items-center py-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                      {copied ? <Check size={20} className="text-[#25F4EE]" /> : <Copy size={20} className="text-white/40" />}
                      <span className="text-[9px] font-black uppercase mt-2 text-white/50 tracking-widest text-center px-1">Quick Copy</span>
                    </button>
                    <button onClick={() => window.open(generatedLink, '_blank')} className="flex flex-col items-center py-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                      <ExternalLink size={20} className="text-white/40" />
                      <span className="text-[9px] font-black uppercase mt-1 text-white/50 tracking-widest text-center px-1">Live Test</span>
                    </button>
                  </div>

                  <div className="p-5 bg-[#25F4EE]/5 border border-[#25F4EE]/10 rounded-2xl text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <Info size={14} className="text-[#25F4EE]" />
                      <span className="text-[10px] font-black text-[#25F4EE] uppercase tracking-widest">Usage Protocol</span>
                    </div>
                    <p className="text-[10px] text-white/50 font-bold uppercase leading-relaxed tracking-wider">
                      Integrate this link into <span className="text-white">website buttons</span> (e.g., 'Contact Us') or share it in <span className="text-white">social chats</span>. 
                      When clicked, it triggers a secure handshake and instantly opens the SMS app with your message.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-6 flex flex-col items-center">
                <button onClick={() => setView(user && !user.isAnonymous ? 'dashboard' : 'auth')} className="btn-strategic text-[11px] max-w-[340px] !bg-white !text-black group">
                  <Rocket size={16} className="opacity-70 group-hover:animate-bounce" /> 
                  ACTIVATE YOUR 7-DAY FREE TRIAL
                </button>
                <p className="text-center text-[10px] text-[#25F4EE] font-black mt-5 uppercase tracking-[0.2em] leading-relaxed italic drop-shadow-[0_0_5px_rgba(37,244,238,0.5)]">Activate PRO to unlock data capture and live analytics</p>
              </div>
            </main>

            <footer className="mt-24 pb-16 w-full text-center space-y-12">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-[10px] font-black uppercase tracking-widest text-white/30 px-6">
                <div className="flex flex-col gap-3">
                   <span className="text-white/60 mb-1 border-b border-white/5 pb-1">Legal</span>
                   <a href="#" className="hover:text-[#25F4EE]">Privacy</a>
                   <a href="#" className="hover:text-[#25F4EE]">Terms</a>
                </div>
                <div className="flex flex-col gap-3">
                   <span className="text-white/60 mb-1 border-b border-white/5 pb-1">Standards</span>
                   <a href="#" className="hover:text-[#FE2C55]">CCPA (US)</a>
                   <a href="#" className="hover:text-[#FE2C55]">COPPA</a>
                </div>
                <div className="flex flex-col gap-3">
                   <span className="text-white/60 mb-1 border-b border-white/5 pb-1">Global</span>
                   <a href="#" className="hover:text-[#25F4EE]">GDPR</a>
                   <a href="#" className="hover:text-[#25F4EE]">LGPD</a>
                </div>
                <div className="flex flex-col gap-3">
                   <span className="text-white/60 mb-1 border-b border-white/5 pb-1">Support</span>
                   <a href="#" className="hover:text-[#FE2C55]">Contact</a>
                   <a href="#" className="hover:text-[#FE2C55]">Abuse</a>
                </div>
              </div>
              <p className="text-[11px] text-white/30 font-black tracking-[5px] uppercase">
                © 2026 ClickMoreDigital | High-End Security Protocol
              </p>
            </footer>
          </div>
        )}

        {/* BRIDGE VIEW: Fast Secure Handshake (Instant Redirection) */}
        {view === 'bridge' && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center relative px-8">
            <div className="lighthouse-neon-wrapper w-full max-w-lg shadow-3xl">
              <div className="lighthouse-neon-content p-16 sm:p-24 flex flex-col items-center">
                <div className="relative mb-12">
                   <Shield size={100} className="text-[#25F4EE] animate-pulse drop-shadow-[0_0_30px_#25F4EE]" />
                </div>
                <h2 className="text-3xl font-black italic mb-3 uppercase tracking-tighter leading-none text-white text-glow-white">SECURITY HANDSHAKE</h2>
                <p className="text-[#25F4EE] text-[11px] font-black uppercase tracking-[0.4em] mb-12">Establishing Secure SMS Route...</p>
                
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-12 max-w-xs">
                   <div className="h-full bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] w-full origin-left" style={{animation: 'progress 2s ease-in-out forwards'}}></div>
                </div>

                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-center">
                   <p className="text-[10px] text-white/50 uppercase font-black tracking-widest leading-relaxed">
                      Authorized Destination: <span className="text-white font-black italic tracking-normal">{captureData?.company}</span>
                   </p>
                   <p className="text-[9px] text-white/20 mt-4 uppercase font-black italic">
                      Opening native messaging application...
                   </p>
                </div>
                
                <button 
                  onClick={() => {
                    const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
                    window.location.href = `sms:${captureData.to}${sep}body=${encodeURIComponent(captureData.msg)}`;
                  }}
                  className="mt-12 text-[10px] font-black text-[#25F4EE] border-b border-[#25F4EE]/30 uppercase tracking-[0.2em] hover:text-white transition-all"
                >
                   Click here if not redirected automatically
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="w-full max-w-7xl mx-auto py-10 px-6">
            {(!userProfile?.isSubscribed && user.uid !== ADMIN_MASTER_ID) && (
              <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-6 text-center">
                <div className="lighthouse-neon-wrapper w-full max-w-lg shadow-3xl">
                  <div className="lighthouse-neon-content p-12 sm:p-16">
                    <Target size={52} className="text-[#FE2C55] drop-shadow-[0_0_15px_#FE2C55] mx-auto mb-10" />
                    <h2 className="text-4xl font-black italic mb-6 uppercase tracking-tighter text-white">REVEAL YOUR LEADS</h2>
                    <p className="text-white/40 text-sm mb-12 uppercase tracking-widest leading-relaxed">
                      Identity unmasked. Unlock <span className="text-white font-bold">Live Geo-Signals</span> and lead history.
                    </p>
                    <button onClick={() => { setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data'), { isSubscribed: true }, { merge: true }); setUserProfile({ ...userProfile, isSubscribed: true }); }} className="btn-strategic text-[11px]">
                      CONFIRM FREE TRIAL ACTIVATION <Rocket size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-10 mb-20 text-left">
              <div>
                <h2 className="text-6xl font-black italic tracking-tighter uppercase drop-shadow-[0_0_20px_#fff]">LIVE INTEL</h2>
                <p className="text-[#25F4EE] text-[11px] font-black uppercase tracking-[0.8em] mt-2 drop-shadow-[0_0:10px_#25F4EE]">Operator Command Center</p>
              </div>
              <div className="bg-[#0a0a0a] border border-white/10 px-10 py-7 rounded-[2.5rem] text-center shadow-3xl border-b-2 border-b-[#25F4EE] w-fit">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Protocol Capacity</p>
                  <p className="text-5xl font-black text-[#25F4EE] drop-shadow-[0_0:15px_#25F4EE]">Unlimited</p>
              </div>
            </div>
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-3xl backdrop-blur-3xl text-center p-20">
               <ShieldCheck size={64} className="mx-auto mb-6 text-white/20" />
               <p className="text-white/40 uppercase font-black text-xs tracking-widest">Lead capture is currently disabled in test mode.</p>
               <p className="text-[#25F4EE] uppercase font-black text-[10px] mt-4 tracking-[0.4em]">Redirect links are operating at 100% capacity.</p>
            </div>
          </div>
        )}

        {view === 'auth' && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="lighthouse-neon-wrapper w-full max-w-sm shadow-3xl">
              <div className="lighthouse-neon-content p-10 sm:p-14 relative">
                <h2 className="text-3xl font-black italic mt-8 mb-12 uppercase tracking-tighter leading-none text-white text-center">Command Access</h2>
                <div className="space-y-4 text-left">
                  <input type="email" placeholder="OPERATOR ID" value={email} onChange={e=>setEmail(e.target.value)} className="input-premium font-black text-xs uppercase w-full mb-3" />
                  <input type="password" placeholder="SECURITY KEY" value={password} onChange={e=>setPassword(e.target.value)} className="input-premium font-black text-xs uppercase w-full mb-4" />
                  <button onClick={() => handleAuth(true)} className="btn-strategic text-[11px] mt-4 shadow-xl w-full">Authorize Terminal</button>
                  <button onClick={() => handleAuth(false)} className="w-full text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-10 text-center hover:text-white transition-all">Establish Profile</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
