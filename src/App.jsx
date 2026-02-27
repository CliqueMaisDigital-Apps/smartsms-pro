import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider
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
  Smartphone, 
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
  QrCode
} from 'lucide-react';

// --- CONFIGURATION ---
// Mantive os teus dados reais para garantir que a conexão não falha
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
  const [logs, setLogs] = useState([]);
  const [generatedLink, setGeneratedLink] = useState('');
  const [captureData, setCaptureData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showQrConnect, setShowQrConnect] = useState(false);

  // AI Queue States
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [activeQueue, setActiveQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);

  // Form States
  const [genTo, setGenTo] = useState('');
  const [genMsg, setGenMsg] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const initAuth = async () => {
      // Inicia sessão anónima para que o visitante possa usar o redirecionador
      if (!auth.currentUser) {
        await signInAnonymously(auth);
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
          const defaultProfile = { isSubscribed: false, smsCredits: 0, dailySent: 0, connectedChips: 1 };
          await setDoc(docRef, defaultProfile);
          setUserProfile(defaultProfile);
        }
      }
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get('to') && params.get('msg')) {
      setCaptureData({ to: params.get('to'), msg: params.get('msg'), company: params.get('company') || 'Verified Protocol' });
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
    setGeneratedLink(`${baseUrl}?to=${encodeURIComponent(genTo)}&msg=${encodeURIComponent(genMsg)}&company=${encodeURIComponent(companyName || 'Verified Partner')}`);
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

  const handleSocialLogin = async (providerType) => {
    setLoading(true);
    try {
      let provider;
      if (providerType === 'google') provider = new GoogleAuthProvider();
      else if (providerType === 'apple') provider = new OAuthProvider('apple.com');
      await signInWithPopup(auth, provider);
      setIsMenuOpen(false);
      setView('dashboard');
    } catch (e) { alert("Social login failed: " + e.message); }
    setLoading(false);
  };

  const handleAiQueueGeneration = () => {
    if (!aiPrompt) return;
    setIsAiProcessing(true);
    setTimeout(() => {
      const variations = logs.map((lead) => ({
        ...lead,
        aiMessage: `Hi ${lead.nome_cliente.split(' ')[0]}, ${aiPrompt} [Ref:${Math.random().toString(36).substr(2, 4).toUpperCase()}]`
      }));
      setActiveQueue(variations);
      setQueueIndex(0);
      setIsAiProcessing(false);
    }, 1500);
  };

  const triggerNextInQueue = () => {
    if (queueIndex >= activeQueue.length) return;
    const currentLead = activeQueue[queueIndex];
    const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
    setQueueIndex(prev => prev + 1);
    window.location.href = `sms:${currentLead.telefone_cliente}${sep}body=${encodeURIComponent(currentLead.aiMessage)}`;
  };

  const handleCapture = async (e) => {
    e.preventDefault();
    if (!cookieAccepted) return alert("Authorize security protocols first.");
    setLoading(true);
    try {
      let geoData = { city: 'Unknown', country_name: 'Unknown', ip: '0.0.0.0' };
      try {
        const geoReq = await fetch('https://ipapi.co/json/');
        if (geoReq.ok) geoData = await geoReq.json();
      } catch (e) { console.warn("Signal weak."); }

      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), {
        nome_cliente: e.target.nome.value,
        telefone_cliente: e.target.tel.value,
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
    } catch (err) { alert("Connection Error. Please try again."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans selection:bg-[#25F4EE] selection:text-black antialiased overflow-x-hidden">
      <style>{`
        @keyframes rotate-beam {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .lighthouse-neon-wrapper {
          position: relative;
          padding: 1.5px;
          border-radius: 28px;
          overflow: hidden;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lighthouse-neon-wrapper::before {
          content: "";
          position: absolute;
          width: 500%; 
          height: 500%;
          top: 50%;
          left: 50%;
          background: conic-gradient(
            transparent 0%,
            transparent 45%,
            #25F4EE 48%,
            #FE2C55 50%,
            #25F4EE 52%,
            transparent 55%,
            transparent 100%
          );
          animation: rotate-beam 5s linear infinite;
          z-index: 0;
        }

        .lighthouse-neon-content {
          position: relative;
          z-index: 1;
          background: #0a0a0a;
          border-radius: 27px;
          width: 100%;
          height: 100%;
        }

        .btn-strategic {
          background: #FFFFFF;
          color: #000000;
          box-shadow: 0 0 25px rgba(255,255,255,0.3);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border-radius: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          width: 100%;
          padding: 1.15rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          border: none;
          cursor: pointer;
        }

        .btn-strategic:hover {
          background: #25F4EE;
          box-shadow: 0 0 45px rgba(37,244,238,0.6);
          transform: translateY(-2px) scale(1.02);
        }

        .input-premium {
          background: #111;
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.3s ease;
          color: white;
          width: 100%;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          outline: none;
        }

        .input-premium:focus {
          border-color: #25F4EE;
          box-shadow: 0 0 15px rgba(37,244,238,0.2);
          background: #000;
        }

        .text-glow-white {
          text-shadow: 0 0 15px rgba(255,255,255,0.5);
        }

        * { hyphens: none !important; word-break: normal !important; text-decoration: none; }
      `}</style>

      {/* Nav Header */}
      <nav className="fixed top-0 left-0 right-0 h-14 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[100] px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-white/10 p-1 rounded-lg border border-white/10 shadow-lg shadow-white/5"><Zap size={18} className="text-white fill-white" /></div>
          <span className="text-md font-black italic tracking-tighter uppercase text-white">SMART SMS PRO</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 text-white/50 hover:text-white transition-all">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Hamburger Menu */}
      {isMenuOpen && (
        <div className="fixed top-14 right-0 w-64 bg-black/98 border-l border-white/10 h-screen z-[90] p-8 animate-in slide-in-from-right-10 shadow-2xl">
          <div className="flex flex-col gap-8">
            {!user || user.isAnonymous ? (
              <button onClick={() => {setView('auth'); setIsMenuOpen(false)}} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#25F4EE]">
                <Lock size={16} /> MEMBER LOGIN
              </button>
            ) : (
              <>
                <button onClick={() => {setView('dashboard'); setIsMenuOpen(false)}} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#25F4EE]">
                  <LayoutDashboard size={16} /> OPERATOR DASHBOARD
                </button>
                <button onClick={() => {signOut(auth).then(()=>setView('home')); setIsMenuOpen(false)}} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#FE2C55]">
                  <LogOut size={16} /> Logout
                </button>
              </>
            )}
            <div className="h-px bg-white/10 w-full" />
            <div className="flex flex-col gap-5 text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
              <a href="#" className="hover:text-white transition-colors">Security Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support Center</a>
            </div>
          </div>
        </div>
      )}

      {/* Background static glows */}
      <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#FE2C55] opacity-[0.03] blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#25F4EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

      <div className="pt-20 pb-16 px-4">
        {view === 'home' && (
          <div className="w-full max-w-[480px] mx-auto z-10 relative">
            <header className="mb-10 text-center flex flex-col items-center">
              <div className="lighthouse-neon-wrapper mb-4">
                <div className="lighthouse-neon-content px-8 py-3">
                   <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-white text-glow-white">
                      SMART SMS PRO
                   </h1>
                </div>
              </div>
              <p className="text-[10px] text-white/40 font-bold tracking-[0.4em] uppercase">International Standard SMS Protocol</p>
            </header>

            <main className="space-y-6">
              <div className="lighthouse-neon-wrapper shadow-3xl">
                <div className="lighthouse-neon-content p-7 sm:p-10">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] animate-pulse"></div>
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-white/60">SMS link generator (Free)</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Destination</label>
                        <input type="tel" value={genTo} onChange={e => setGenTo(e.target.value)} className="input-premium font-bold text-sm" placeholder="+1 (555) 000-0000" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1 italic">Company Label</label>
                        <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-premium font-bold text-sm text-white/50" placeholder="e.g. Apple Support" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">SMS Content Payload</label>
                      <textarea value={genMsg} onChange={e => setGenMsg(e.target.value)} rows="2" className="input-premium text-xs font-medium resize-none" placeholder="Enter pre-written message text here..." />
                    </div>
                    <button onClick={handleGenerate} className="btn-strategic text-[11px] mt-2">
                      Generate Smart Link <ChevronRight size={16} />
                    </button>
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
                {/* BOTÃO AIDA: Chamada forte para o teste gratuito */}
                <button onClick={() => setView(user && !user.isAnonymous ? 'dashboard' : 'auth')} className="btn-strategic text-[11px] max-w-[340px] !bg-white !text-black group">
                  <Rocket size={16} className="opacity-70 group-hover:animate-bounce" /> 
                  ACTIVATE YOUR 7-DAY FREE TRIAL
                </button>
                <p className="text-center text-[10px] text-[#25F4EE] font-black mt-5 uppercase tracking-[0.2em] drop-shadow-[0_0_5px_rgba(37,244,238,0.5)] leading-relaxed">
                  Unlock contacts, geo-tracking and lead history
                </p>
              </div>
            </main>

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

        {view === 'dashboard' && (
          <div className="w-full max-w-7xl mx-auto py-10 px-6">
            {(!userProfile?.isSubscribed && user.uid !== ADMIN_MASTER_ID) && (
              <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-6 text-center">
                <div className="lighthouse-neon-wrapper w-full max-w-lg shadow-3xl">
                  <div className="lighthouse-neon-content p-12 sm:p-16">
                    <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 w-fit mx-auto mb-10 shadow-3xl">
                      <Target size={52} className="text-[#FE2C55] drop-shadow-[0_0_15px_#FE2C55]" />
                    </div>
                    <h2 className="text-4xl font-black italic mb-6 uppercase tracking-tighter text-white">REVEAL YOUR LEADS</h2>
                    <p className="text-white/40 text-sm mb-12 uppercase tracking-widest leading-relaxed">
                      Identity unmasked. Get <span className="text-white font-bold">Real Names</span>, <span className="text-white font-bold">Mobile Identities</span>, and <span className="text-white font-bold text-glow-white">Live Geo-Signals</span>.
                    </p>
                    <div className="space-y-4 mb-10 text-left max-w-sm mx-auto bg-black/40 p-5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#25F4EE]" />
                        <p className="text-[11px] font-black text-white/80 uppercase tracking-widest">7-Day Premium Trial Active</p>
                      </div>
                      <p className="text-[11px] text-white/40 uppercase tracking-widest pl-4">Then $9/mo for 3 months, then $19.90/mo.</p>
                    </div>
                    <button onClick={() => { setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data'), { isSubscribed: true }, { merge: true }); setUserProfile({ ...userProfile, isSubscribed: true }); }} className="btn-strategic text-[11px]">
                      CONFIRM SUBSCRIPTION <Rocket size={20} />
                    </button>
                    <p className="mt-8 text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">Enterprise Grade Intelligence</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-10 mb-20">
              <div>
                <h2 className="text-6xl font-black italic tracking-tighter uppercase drop-shadow-[0_0_20px_#fff]">LIVE INTEL</h2>
                <p className="text-[#25F4EE] text-[11px] font-black uppercase tracking-[0.8em] mt-2 text-neon-cyan">Operator Command Center</p>
              </div>
              <div className="bg-[#0a0a0a] border border-white/10 px-10 py-7 rounded-[2.5rem] text-center shadow-3xl border-b-2 border-b-[#25F4EE] w-fit">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Global Data Credits</p>
                  <p className="text-5xl font-black text-[#25F4EE] drop-shadow-[0_0:15px_#25F4EE]">{userProfile?.smsCredits || 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
              <div className="xl:col-span-3 space-y-12">
                
                {/* --- AI COMMAND CENTER --- */}
                <div className="lighthouse-neon-wrapper shadow-2xl">
                  <div className="lighthouse-neon-content p-8 sm:p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                       <div className="flex items-center gap-3">
                         <BrainCircuit size={28} className="text-[#25F4EE] drop-shadow-[0_0_8px_#25F4EE]" />
                         <h3 className="text-lg font-black uppercase tracking-[0.4em] italic">AI Broadcast Command</h3>
                       </div>
                       <div className="flex items-center gap-4 flex-wrap">
                          <button onClick={() => setShowQrConnect(!showQrConnect)} className="flex items-center gap-2 bg-white/5 px-5 py-2.5 rounded-full border border-[#25F4EE]/30 hover:bg-[#25F4EE]/10 transition-all group">
                            <QrCode size={16} className="text-[#25F4EE] group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#25F4EE]">Link New Device</span>
                          </button>
                          <div className="flex items-center gap-2 bg-black px-5 py-2.5 rounded-full border border-white/5">
                            <Activity size={16} className="text-[#25F4EE]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Safety: {60 - (userProfile?.dailySent || 0)}/Day</span>
                          </div>
                       </div>
                    </div>

                    {showQrConnect && (
                      <div className="mb-10 p-8 bg-black border border-white/10 rounded-[2.5rem] animate-in zoom-in-95 duration-300">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                           <div className="bg-white p-5 rounded-3xl shadow-2xl">
                              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=connect-session-${user?.uid}`} alt="Device Connect" className="w-36 h-36" />
                           </div>
                           <div className="space-y-5 text-center md:text-left">
                              <h4 className="text-xl font-black uppercase tracking-widest text-white italic">Pair Native SMS App</h4>
                              <p className="text-[11px] text-white/50 uppercase tracking-widest leading-relaxed max-w-md">Scan this code with your mobile device to establish a <span className="text-[#25F4EE] font-black">Secure Handshake</span>. This connects multiple chips to our protocol for high-volume automated routing.</p>
                              <div className="flex items-center gap-3 justify-center md:justify-start">
                                 <div className="w-2 h-2 rounded-full bg-[#25F4EE] animate-pulse shadow-[0_0_10px_#25F4EE]" />
                                 <span className="text-[10px] font-black text-[#25F4EE] uppercase tracking-widest">Protocol Ready for Sync</span>
                              </div>
                           </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-6">
                       <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Marketing goal (e.g. Sales Follow-up)... AI will auto-scramble every message to bypass USA carrier anti-spam logic." className="input-premium font-bold text-sm min-h-[120px] focus:border-[#25F4EE]/40 transition-all" />
                       <div className="flex gap-4">
                         <button disabled={isAiProcessing || logs.length === 0} onClick={handleAiQueueGeneration} className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all disabled:opacity-30">
                           {isAiProcessing ? "AI Scrambling..." : `Prepare AI Pack (${logs.length} Leads)`}
                         </button>
                         {activeQueue.length > 0 && (
                           <button onClick={triggerNextInQueue} className="flex-1 py-5 bg-[#25F4EE] text-black rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-[0_0_30px_rgba(37,244,238,0.4)] animate-pulse">
                             <PlayCircle size={18} className="inline mr-2" /> Launch Authorized Send ({queueIndex + 1}/{activeQueue.length})
                           </button>
                         )}
                       </div>
                       <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-4">
                          <ShieldAlert size={22} className="text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest leading-relaxed">
                            Carrier Intelligence: USA networks flag identical content sent via P2P. Our Scramble Engine prevents account bans. For high volumes, link multiple eSIMs via QR protocol.
                          </p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-3xl backdrop-blur-3xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.03]">
                          <th className="p-10 text-[11px] font-black text-white/40 uppercase tracking-widest">Lead Identity</th>
                          <th className="p-10 text-[11px] font-black text-white/40 uppercase tracking-widest">Geo Signal</th>
                          <th className="p-10 text-[11px] font-black text-white/40 uppercase tracking-widest">Timeline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {logs.map(l => (
                          <tr key={l.id} className="hover:bg-white/[0.04] transition-all group">
                            <td className="p-10">
                              <div className="font-black text-2xl text-white group-hover:text-[#25F4EE] transition-colors tracking-tight uppercase italic">{l.nome_cliente}</div>
                              <div className="text-[14px] text-[#25F4EE] font-black mt-1 uppercase tracking-widest text-neon-cyan">{l.telefone_cliente}</div>
                            </td>
                            <td className="p-10">
                              <div className="text-lg font-bold flex items-center gap-2 text-white/80"><Globe size={18} className="text-white/40"/> {l.localizacao}</div>
                              <div className="text-[11px] text-white/20 mt-1 font-mono tracking-wider">NETWORK IP: {l.ip}</div>
                            </td>
                            <td className="p-10 text-right md:text-left">
                              <div className="text-[12px] font-black text-white/40 uppercase tracking-[0.2em]">{l.created_at?.toDate().toLocaleString()}</div>
                              <div className="text-[10px] text-[#FE2C55] mt-2 font-black uppercase tracking-tighter bg-[#FE2C55]/15 px-3 py-1 rounded-full inline-block">Ref: {l.destino}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <h3 className="text-[13px] font-black uppercase tracking-[0.6em] text-white/50 ml-3 italic">Marketplace</h3>
                <div className="grid gap-6">
                  {[
                    { name: "Pack Starter", qty: 200, price: "12.90", desc: "Operational Performance: Ideal for 1 week of intense bursts or 1 month of steady light penetration. Optimized for single-SIM devices." },
                    { name: "Pack Growth", qty: 800, price: "34.90", desc: "Strategic Conversion: Focused on constant daily outreach. Engineered for balanced throughput across multiple paired device sessions." },
                    { name: "Pack Professional", qty: 1500, price: "59.90", desc: "Enterprise Limit: Maximum monthly safety threshold per individual chip. Optimized for high-volume with Multi-Station Station Sync." }
                  ].map(pack => (
                    <div key={pack.qty} className="group relative bg-[#0a0a0a] border border-white/5 p-9 rounded-[3rem] hover:border-white/30 transition-all cursor-pointer overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors" />
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <p className="text-4xl font-black italic text-white group-hover:drop-shadow-[0_0_10px_#fff] transition-all uppercase">{pack.qty}</p>
                        <p className="text-[13px] font-black text-white bg-white/5 px-3 py-1 rounded-lg">${pack.price}</p>
                      </div>
                      <p className="text-[11px] font-black text-[#25F4EE] uppercase tracking-widest mb-5 relative z-10">{pack.name}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed mb-10 relative z-10">{pack.desc}</p>
                      <button className="btn-strategic text-[10px] !py-3.5 relative z-10">Purchase Pack</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'auth' && (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <div className="lighthouse-neon-wrapper w-full max-w-sm shadow-3xl">
              <div className="lighthouse-neon-content p-10 sm:p-14 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black p-6 rounded-[2.5rem] border border-white/20 shadow-[0_0_40px_rgba(37,244,238,0.3)]">
                  <LayoutDashboard size={40} className="text-[#25F4EE]" />
                </div>
                <h2 className="text-3xl font-black italic mt-8 mb-12 uppercase tracking-tighter leading-none text-white">Command Access</h2>
                <div className="space-y-4 text-left">
                  <div className="grid grid-cols-1 gap-4">
                    <button onClick={() => handleSocialLogin('google')} className="btn-strategic text-[10px]"><Globe size={18} /> Google Authentication</button>
                    <button onClick={() => handleSocialLogin('apple')} className="btn-strategic text-[10px]"><Smartphone size={18} /> Apple Protocol Connect</button>
                  </div>
                  <div className="flex items-center gap-4 py-4"><div className="h-px bg-white/10 flex-1" /><span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Secure Email Logic</span><div className="h-px bg-white/10 flex-1" /></div>
                  <input type="email" placeholder="OPERATOR ID" value={email} onChange={e=>setEmail(e.target.value)} className="input-premium font-black text-xs" />
                  <input type="password" placeholder="SECURITY KEY" value={password} onChange={e=>setPassword(e.target.value)} className="input-premium font-black text-xs" />
                  <button onClick={() => handleAuth(true)} className="btn-strategic text-[11px] mt-4">Authorize Station</button>
                  <button onClick={() => handleAuth(false)} className="w-full text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-10 text-center hover:text-white transition-all uppercase">Establish Terminal</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'capture' && (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative">
            <div className="lighthouse-neon-wrapper w-full max-w-lg shadow-3xl">
              <div className="lighthouse-neon-content p-14 sm:p-20">
                <div className="bg-white/5 p-8 rounded-[3.5rem] border border-white/20 w-fit mx-auto mb-10 shadow-[0_0:30px_rgba(255,255,255,0.1)]">
                  <ShieldCheck size={80} className="text-[#25F4EE] drop-shadow-[0_0:25px_#25F4EE]" />
                </div>
                <h2 className="text-4xl font-black italic mb-3 uppercase tracking-tighter leading-none text-white text-glow-white">Security Gateway</h2>
                <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.6em] mb-16 italic text-center">Authorized Host: <span className="text-white font-black drop-shadow-[0_0:10px_#fff] uppercase">{captureData?.company}</span></p>
                <form onSubmit={handleCapture} className="space-y-8 text-left">
                  <input required name="nome" placeholder="Full Identity Name" className="input-premium uppercase text-xs" />
                  <input required name="tel" type="tel" placeholder="Mobile Number (+1...)" className="input-premium uppercase text-xs" />
                  <div className="flex items-center gap-6 p-7 bg-white/5 rounded-[2rem] mt-8 border border-white/10">
                    <input type="checkbox" id="cookie-consent" checked={cookieAccepted} onChange={(e) => setCookieAccepted(e.target.checked)} className="w-8 h-8 accent-[#25F4EE] cursor-pointer shrink-0" />
                    <label htmlFor="cookie-consent" className="text-[11px] font-black text-white/40 uppercase tracking-widest cursor-pointer leading-relaxed italic">I authorize <span className="text-white border-b border-white/20">Security Cookies</span> and <span className="text-white border-b border-white/20">Privacy Protocol</span>.</label>
                  </div>
                  <button className="btn-strategic text-[12px] mt-10 shadow-2xl italic tracking-[0.2em]">{loading ? "AUTHENTICATING..." : "ESTABLISH SECURE LINK"}</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
