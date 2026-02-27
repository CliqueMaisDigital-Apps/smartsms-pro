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
  collection, 
  addDoc, 
  onSnapshot, 
  serverTimestamp,
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
  Smartphone
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

// Professional DDI List with Flags
const countryCodes = [
  { code: '+1', name: 'US', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+351', name: 'PT', flag: '🇵🇹' },
  { code: '+55', name: 'BR', flag: '🇧🇷' },
  { code: '+34', name: 'ES', flag: '🇪🇸' },
  { code: '+33', name: 'FR', flag: '🇫🇷' },
  { code: '+49', name: 'DE', flag: '🇩🇪' },
  { code: '+61', name: 'AU', flag: '🇦🇺' },
  { code: '+54', name: 'AR', flag: '🇦🇷' },
  { code: '+52', name: 'MX', flag: '🇲🇽' },
];

export default function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [generatedLink, setGeneratedLink] = useState('');
  const [captureData, setCaptureData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Capture States
  const [selectedDdi, setSelectedDdi] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [genTo, setGenTo] = useState('');
  const [genMsg, setGenMsg] = useState('');
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    const initAuth = async () => {
      if (!auth.currentUser) {
        try { await signInAnonymously(auth); } catch (e) { console.error("Session failed:", e); }
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

    const params = new URLSearchParams(window.location.search);
    const t = params.get('t') || params.get('to');
    const m = params.get('m') || params.get('msg');
    const c = params.get('c') || params.get('company');

    if (t && m) {
      setCaptureData({ to: t, msg: m, company: c || 'Verified Protocol' });
      setView('capture');
    }
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || user.isAnonymous || view !== 'dashboard' || (!userProfile?.isSubscribed && user.uid !== ADMIN_MASTER_ID)) return;
    const leadsCol = collection(db, 'artifacts', appId, 'public', 'data', 'leads');
    return onSnapshot(leadsCol, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const filtered = user.uid === ADMIN_MASTER_ID ? data : data.filter(l => l.ownerId === user.uid || l.ownerId === "PUBLIC_GEN");
      setLogs(filtered.sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0)));
    });
  }, [user, view, userProfile]);

  const handleGenerate = () => {
    if (!genTo) return;
    const baseUrl = window.location.origin;
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
    } catch (e) { alert(e.message); }
    setLoading(false);
  };

  const handleSocialLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setIsMenuOpen(false);
      setView('dashboard');
    } catch (e) { alert("Social auth failed."); }
    setLoading(false);
  };

  const handleCapture = async (e) => {
    e.preventDefault();
    if (!cookieAccepted) return;
    setLoading(true);
    try {
      let geoData = { city: 'Unknown', country_name: 'Unknown', ip: '0.0.0.0' };
      try {
        const geoReq = await fetch('https://ipapi.co/json/');
        if (geoReq.ok) geoData = await geoReq.json();
      } catch (e) { console.warn("Geo bypassed"); }

      const fullPhone = `${selectedDdi}${phoneNumber.replace(/\D/g, '')}`;

      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), {
        nome_cliente: e.target.nome.value,
        telefone_cliente: fullPhone,
        destino: captureData.to,
        mensagem: captureData.msg,
        localizacao: `${geoData.city}, ${geoData.country_name}`,
        ip: geoData.ip,
        dispositivo: navigator.userAgent,
        created_at: serverTimestamp(),
        ownerId: "PUBLIC_GEN"
      });
      
      const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
      window.location.href = `sms:${captureData.to}${sep}body=${encodeURIComponent(captureData.msg)}`;
    } catch (err) { alert("Handshake interrupted."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans selection:bg-[#25F4EE] selection:text-black antialiased overflow-x-hidden">
      <style>{`
        @keyframes rotate-beam { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        .lighthouse-neon-wrapper { position: relative; padding: 1.5px; border-radius: 28px; overflow: hidden; background: transparent; display: flex; align-items: center; justify-content: center; }
        .lighthouse-neon-wrapper::before { content: ""; position: absolute; width: 500%; height: 500%; top: 50%; left: 50%; background: conic-gradient(transparent 0%, transparent 45%, #25F4EE 48%, #FE2C55 50%, #25F4EE 52%, transparent 55%, transparent 100%); animation: rotate-beam 5s linear infinite; z-index: 0; }
        .lighthouse-neon-content { position: relative; z-index: 1; background: #0a0a0a; border-radius: 27px; width: 100%; height: 100%; }
        .btn-strategic { background: #FFFFFF; color: #000000; box-shadow: 0 0 25px rgba(255,255,255,0.3); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-radius: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; width: 100%; padding: 1.15rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; border: none; cursor: pointer; }
        .btn-strategic:hover { background: #25F4EE; box-shadow: 0 0 45px rgba(37,244,238,0.6); transform: translateY(-2px) scale(1.02); }
        .input-premium { background: #111; border: 1px solid rgba(255,255,255,0.05); transition: all 0.3s ease; color: white; width: 100%; padding: 1rem 1.25rem; border-radius: 12px; outline: none; }
        .input-premium:focus { border-color: #25F4EE; box-shadow: 0 0 15px rgba(37,244,238,0.2); background: #000; }
        .text-glow-white { text-shadow: 0 0 15px rgba(255,255,255,0.5); }
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

      {/* RESTORED: Extended Menu with Policies */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[140]" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-72 bg-[#050505] border-l border-white/10 h-screen z-[150] p-10 animate-in slide-in-from-right duration-300 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-12">
              <span className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Command Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-white/40 hover:text-white"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-8">
              {!user || user.isAnonymous ? (
                <button onClick={() => {setView('auth'); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-[#25F4EE]"><Lock size={18} /> MEMBER LOGIN</button>
              ) : (
                <>
                  <button onClick={() => {setView('dashboard'); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-[#25F4EE]"><LayoutDashboard size={18} /> OPERATOR HUB</button>
                  <button onClick={() => {signOut(auth).then(()=>setView('home')); setIsMenuOpen(false)}} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-[#FE2C55]"><LogOut size={18} /> LOGOUT</button>
                </>
              )}
              
              <div className="h-px bg-white/5 w-full my-2" />
              
              <div className="flex flex-col gap-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2 italic">Privacy Protocol</a>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2 italic">Security Terms</a>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2 italic">Support Center</a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Ambient backgrounds */}
      <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#FE2C55] opacity-[0.03] blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#25F4EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

      <div className="pt-24 pb-16 px-4">
        {view === 'home' && (
          <div className="w-full max-w-[480px] mx-auto z-10 relative">
            <header className="mb-10 text-center flex flex-col items-center">
              <div className="lighthouse-neon-wrapper mb-4">
                <div className="lighthouse-neon-content px-8 py-3">
                   <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-white text-glow-white text-center">SMART SMS PRO</h1>
                </div>
              </div>
              <p className="text-[10px] text-white/40 font-bold tracking-[0.4em] uppercase">International Standard SMS Protocol</p>
            </header>

            <main className="space-y-6">
              <div className="lighthouse-neon-wrapper shadow-3xl">
                <div className="lighthouse-neon-content p-7 sm:p-10">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] animate-pulse"></div>
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-white/60">Free Link Generator</h3>
                  </div>
                  <div className="space-y-6 text-left">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Destination Number</label>
                       <input type="tel" value={genTo} onChange={e => setGenTo(e.target.value)} className="input-premium font-bold text-sm" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Company Label</label>
                       <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-premium font-bold text-sm text-white/50" placeholder="e.g. Apple Support" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Pre-Written SMS Payload</label>
                       <textarea value={genMsg} onChange={e => setGenMsg(e.target.value)} rows="2" className="input-premium text-xs font-medium resize-none" placeholder="Enter the message you want to pre-fill..." />
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
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <button onClick={() => {navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="flex flex-col items-center py-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                      {copied ? <Check size={20} className="text-[#25F4EE]" /> : <Copy size={20} className="text-white/40" />}
                      <span className="text-[9px] font-black uppercase mt-2 text-white/50 tracking-widest">Copy URL</span>
                    </button>
                    <button onClick={() => window.open(generatedLink, '_blank')} className="flex flex-col items-center py-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                      <ExternalLink size={20} className="text-white/40" />
                      <span className="text-[9px] font-black uppercase mt-1 text-white/50 tracking-widest">Live Test</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-6 flex flex-col items-center">
                <button onClick={() => setView(user && !user.isAnonymous ? 'dashboard' : 'auth')} className="btn-strategic text-[11px] max-w-[340px] !bg-white !text-black group">
                  <Rocket size={16} className="opacity-70 group-hover:animate-bounce" /> 
                  ACTIVATE YOUR 7-DAY FREE TRIAL
                </button>
                <p className="text-center text-[10px] text-[#25F4EE] font-black mt-5 uppercase tracking-[0.2em] leading-relaxed italic drop-shadow-[0_0_5px_rgba(37,244,238,0.5)]">Unlock lead history and live geo-signals</p>
              </div>
            </main>

            {/* RESTORED: Complete Professional Footer */}
            <footer className="mt-20 w-full text-center space-y-12">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-[10px] font-black uppercase tracking-widest text-white/30">
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
              <p className="text-[12px] text-white font-black tracking-[5px] uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
                © 2026 ClickMoreDigital | High-End Security Protocol
              </p>
            </footer>
          </div>
        )}

        {view === 'capture' && (
          <div className="w-full max-w-[480px] mx-auto z-10 relative">
            <div className="lighthouse-neon-wrapper shadow-3xl">
              <div className="lighthouse-neon-content p-8 sm:p-14">
                <div className="bg-white/5 p-8 rounded-[3.5rem] border border-white/20 w-fit mx-auto mb-10 shadow-2xl text-[#25F4EE]">
                  <ShieldCheck size={72} className="drop-shadow-[0_0:25px_#25F4EE]" />
                </div>
                <h2 className="text-3xl font-black italic mb-3 uppercase tracking-tighter leading-none text-white text-glow-white text-center">Security Gateway</h2>
                <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.6em] mb-16 italic text-center">Authorized Host: <span className="text-white font-black drop-shadow-[0_0:10px_#fff] uppercase">{captureData?.company}</span></p>
                
                <form onSubmit={handleCapture} className="space-y-6 text-left">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Identity Verification</label>
                    <input required name="nome" placeholder="Full Identity Name" className="input-premium uppercase text-xs font-black py-4 w-full" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Mobile Identity</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative w-full sm:w-36 shrink-0">
                        <select 
                          value={selectedDdi} 
                          onChange={(e) => setSelectedDdi(e.target.value)}
                          className="input-premium text-xs font-black appearance-none text-center bg-black border border-white/10 h-full py-4 w-full cursor-pointer"
                        >
                          {countryCodes.map(c => (
                            <option key={c.code} value={c.code} className="bg-black text-white">{c.flag} {c.code}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">▾</div>
                      </div>
                      <input 
                        required 
                        type="tel" 
                        placeholder="Mobile Number" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1 input-premium uppercase text-xs font-black py-4 w-full" 
                      />
                    </div>
                  </div>

                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5 mb-4">
                     <p className="text-[10px] text-white/50 uppercase font-black tracking-widest italic leading-relaxed text-center">
                        <Smartphone size={14} className="inline mr-2 text-[#25F4EE]" /> 
                        ESTABLISHING SECURE CONNECTION WILL OPEN YOUR NATIVE SMS APP WITH A PRE-WRITTEN MESSAGE.
                     </p>
                  </div>

                  <div className="flex items-start gap-4 p-5 bg-white/5 rounded-[2rem] border border-white/10">
                    <input type="checkbox" id="cookie-consent" checked={cookieAccepted} onChange={(e) => setCookieAccepted(e.target.checked)} className="w-6 h-6 accent-[#25F4EE] cursor-pointer shrink-0 mt-1" />
                    <label htmlFor="cookie-consent" className="text-[9px] font-black text-white/40 uppercase tracking-widest cursor-pointer leading-relaxed italic text-white text-left">Authorize <span className="text-white border-b border-white/20">Security Cookies</span> and <span className="text-white border-b border-white/20">Privacy Protocol</span>.</label>
                  </div>
                  <button className="btn-strategic text-[11px] mt-8 shadow-2xl italic tracking-[0.2em]">{loading ? "AUTHENTICATING..." : "ESTABLISH SECURE LINK"}</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="w-full max-w-7xl mx-auto py-10 px-6">
            <h2 className="text-6xl font-black italic tracking-tighter uppercase drop-shadow-[0_0_20px_#fff]">LIVE INTEL</h2>
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-3xl backdrop-blur-3xl mt-20">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                 <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Signals</span>
                 <Activity size={18} className="text-[#25F4EE] animate-pulse" />
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {logs.map(l => (
                  <div key={l.id} className="p-10 border-b border-white/5 hover:bg-white/[0.04] transition-all group flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                    <div>
                      <div className="font-black text-3xl text-white group-hover:text-[#25F4EE] transition-colors uppercase italic tracking-tighter">{l.nome_cliente}</div>
                      <div className="text-[14px] text-[#25F4EE] font-black mt-1 uppercase tracking-[0.4em]">{l.telefone_cliente}</div>
                    </div>
                    <div className="text-white/60 italic text-right">
                      <div className="flex items-center gap-2 justify-end text-lg"><Globe size={20}/> {l.localizacao}</div>
                      <div className="text-[11px] mt-1 font-mono tracking-widest">{l.ip}</div>
                    </div>
                  </div>
                ))}
                {logs.length === 0 && <div className="p-20 text-center text-white/20 font-black uppercase text-xs tracking-widest italic">Awaiting connection signals...</div>}
              </div>
            </div>
          </div>
        )}

        {view === 'auth' && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="lighthouse-neon-wrapper w-full max-w-sm shadow-3xl">
              <div className="lighthouse-neon-content p-10 sm:p-14 relative">
                <h2 className="text-3xl font-black italic mt-8 mb-12 uppercase tracking-tighter leading-none text-white text-center">Command Access</h2>
                <div className="space-y-4 text-left">
                  <button onClick={handleSocialLogin} className="btn-strategic text-[10px]"><Globe size={18} /> Google Authentication</button>
                  <div className="h-px bg-white/10 w-full my-4" />
                  <input type="email" placeholder="EMAIL" value={email} onChange={e=>setEmail(e.target.value)} className="input-premium font-black text-xs uppercase w-full" />
                  <input type="password" placeholder="PASSWORD" value={password} onChange={e=>setPassword(e.target.value)} className="input-premium font-black text-xs uppercase w-full" />
                  <button onClick={() => handleAuth(true)} className="btn-strategic text-[11px] mt-4 shadow-xl">Authorize Terminal</button>
                  <button onClick={() => handleAuth(false)} className="w-full text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-10 text-center hover:text-white transition-all">Establish Terminal</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
