import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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

// --- CONFIGURAÇÃO REAL DO SEU FIREBASE (VINCULADA) ---
const firebaseConfig = {
  apiKey: "AIzaSyBI-JSC-FtVOz_r6p-XjN6fUrapMn_ad24",
  authDomain: "smartsmspro-4ee81.firebaseapp.com",
  projectId: "smartsmspro-4ee81",
  storageBucket: "smartsmspro-4ee81.firebasestorage.app",
  messagingSenderId: "269226709034",
  appId: "1:269226709034:web:00af3a340b1e1ba928f353",
  measurementId: "G-RRW67CXZJC"
};

const appId = 'smartsms-pro-production-final-v1';
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

  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [activeQueue, setActiveQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);

  const [genTo, setGenTo] = useState('');
  const [genMsg, setGenMsg] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
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
    if (!user || view !== 'dashboard' || (!userProfile?.isSubscribed && user.uid !== ADMIN_MASTER_ID)) return;
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
    } catch (e) { alert("Autenticação: " + e.message); }
    setLoading(false);
  };

  const handleSocialLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setIsMenuOpen(false);
      setView('dashboard');
    } catch (e) { alert("Erro de login social."); }
    setLoading(false);
  };

  const handleAiQueueGeneration = () => {
    if (!aiPrompt) return;
    setIsAiProcessing(true);
    setTimeout(() => {
      const variations = logs.map((lead) => ({
        ...lead,
        aiMessage: `Olá ${lead.nome_cliente.split(' ')[0]}, ${aiPrompt} [Ref:${Math.random().toString(36).substr(2, 4).toUpperCase()}]`
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
    if (!cookieAccepted) return alert("Aceite os protocolos primeiro.");
    setLoading(true);
    try {
      const geoReq = await fetch('https://ipapi.co/json/');
      const geo = await geoReq.json();
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), {
        nome_cliente: e.target.nome.value,
        telefone_cliente: e.target.tel.value,
        destino: captureData.to,
        mensagem: captureData.msg,
        localizacao: `${geo.city}, ${geo.country_name}`,
        ip: geo.ip,
        dispositivo: navigator.userAgent,
        created_at: serverTimestamp(),
        ownerId: "PUBLIC_GEN"
      });
      const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? ';' : '?';
      window.location.href = `sms:${captureData.to}${sep}body=${encodeURIComponent(captureData.msg)}`;
    } catch (err) { alert("Conexão falhou."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans selection:bg-[#25F4EE] selection:text-black antialiased overflow-x-hidden">
      <style>{`
        @keyframes rotate-beam { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        .lighthouse-neon-wrapper { position: relative; padding: 1.5px; border-radius: 28px; overflow: hidden; background: transparent; display: flex; align-items: center; justify-content: center; }
        .lighthouse-neon-wrapper::before { content: ""; position: absolute; width: 600%; height: 600%; top: 50%; left: 50%; background: conic-gradient(transparent 0%, transparent 45%, #25F4EE 48%, #FE2C55 50%, #25F4EE 52%, transparent 55%, transparent 100%); animation: rotate-beam 5s linear infinite; z-index: 0; }
        .lighthouse-neon-content { position: relative; z-index: 1; background: #0a0a0a; border-radius: 27px; width: 100%; height: 100%; }
        .btn-strategic { background: #FFFFFF; color: #000000; box-shadow: 0 0 25px rgba(255,255,255,0.3); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-radius: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; width: 100%; padding: 1.15rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; border: none; cursor: pointer; }
        .btn-strategic:hover { background: #25F4EE; box-shadow: 0 0 45px rgba(37,244,238,0.6); transform: translateY(-2px) scale(1.02); }
        .input-premium { background: #111; border: 1px solid rgba(255,255,255,0.05); transition: all 0.3s ease; color: white; width: 100%; padding: 1rem 1.25rem; border-radius: 12px; outline: none; }
        .input-premium:focus { border-color: #25F4EE; box-shadow: 0 0 15px rgba(37,244,238,0.2); background: #000; }
      `}</style>

      {/* Navegação */}
      <nav className="fixed top-0 left-0 right-0 h-14 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[100] px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-white/10 p-1 rounded-lg border border-white/10 shadow-lg shadow-white/5"><Zap size={18} className="text-white fill-white" /></div>
          <span className="text-md font-black italic tracking-tighter uppercase">SMART SMS PRO</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 text-white/50 hover:text-white transition-all">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Menu Lateral */}
      {isMenuOpen && (
        <div className="fixed top-14 right-0 w-64 bg-black/98 border-l border-white/10 h-screen z-[90] p-8 animate-in slide-in-from-right-10 shadow-2xl">
          <div className="flex flex-col gap-8">
            {!user ? (
              <button onClick={() => {setView('auth'); setIsMenuOpen(false)}} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#25F4EE]"><Lock size={16} /> LOGIN</button>
            ) : (
              <>
                <button onClick={() => {setView('dashboard'); setIsMenuOpen(false)}} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#25F4EE]"><LayoutDashboard size={16} /> DASHBOARD</button>
                <button onClick={() => {signOut(auth).then(()=>setView('home')); setIsMenuOpen(false)}} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#FE2C55]"><LogOut size={16} /> Logout</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Ambient backgrounds */}
      <div className="fixed top-0 left-0 w-[50vw] h-[50vh] bg-[#FE2C55] opacity-[0.03] blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#25F4EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

      <div className="pt-24 pb-16 px-4">
        {view === 'home' && (
          <div className="w-full max-w-[480px] mx-auto z-10 relative text-center">
            <div className="lighthouse-neon-wrapper mb-8">
              <div className="lighthouse-neon-content px-10 py-3">
                <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-white">SMART SMS PRO</h1>
              </div>
            </div>
            <main className="space-y-6">
              <div className="lighthouse-neon-wrapper shadow-3xl">
                <div className="lighthouse-neon-content p-8 text-left">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-white/60 mb-6">Gerador de Links</h3>
                  <div className="space-y-6">
                    <input type="tel" value={genTo} onChange={e => setGenTo(e.target.value)} className="input-premium font-bold text-sm" placeholder="Destino (+...)" />
                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-premium font-bold text-sm" placeholder="Empresa" />
                    <textarea value={genMsg} onChange={e => setGenMsg(e.target.value)} rows="2" className="input-premium text-xs" placeholder="Mensagem..." />
                    <button onClick={handleGenerate} className="btn-strategic text-[11px]">Gerar Link <ChevronRight size={16} /></button>
                  </div>
                </div>
              </div>
              
              {generatedLink && (
                <div className="bg-[#0a0a0a] border border-[#25F4EE]/20 rounded-[32px] p-8 text-center animate-in zoom-in-95">
                  <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-xl">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(generatedLink)}&color=000000`} alt="QR" className="w-32 h-32"/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => {navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="flex flex-col items-center py-3 bg-white/5 rounded-xl border border-white/5">
                      {copied ? <Check size={20} className="text-[#25F4EE]" /> : <Copy size={20} className="text-white/40" />}
                      <span className="text-[9px] font-black uppercase mt-1 text-white/50">Copiar</span>
                    </button>
                    <button onClick={() => window.open(generatedLink, '_blank')} className="flex flex-col items-center py-3 bg-white/5 rounded-xl border border-white/5">
                      <ExternalLink size={20} className="text-white/40" />
                      <span className="text-[9px] font-black uppercase mt-1 text-white/50">Testar</span>
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="w-full max-w-7xl mx-auto py-10 px-6">
            <h2 className="text-6xl font-black italic tracking-tighter uppercase mb-20">SINAL VIVO</h2>
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 mt-10">
              <div className="xl:col-span-3 space-y-12">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-3xl">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.03]">
                        <th className="p-10 text-[11px] font-black text-white/40 uppercase">Identidade</th>
                        <th className="p-10 text-[11px] font-black text-white/40 uppercase">Sinal Geo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {logs.map(l => (
                        <tr key={l.id} className="hover:bg-white/[0.04] transition-all">
                          <td className="p-10">
                            <div className="font-black text-2xl text-white italic">{l.nome_cliente}</div>
                            <div className="text-[14px] text-[#25F4EE] font-black uppercase tracking-widest">{l.telefone_cliente}</div>
                          </td>
                          <td className="p-10">
                            <div className="text-lg font-bold flex items-center gap-2"><Globe size={18}/> {l.localizacao}</div>
                            <div className="text-[11px] text-white/20 mt-1 font-mono tracking-wider italic">IP: {l.ip}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'auth' && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="lighthouse-neon-wrapper w-full max-w-sm">
              <div className="lighthouse-neon-content p-10">
                <h2 className="text-3xl font-black italic mb-12 uppercase text-white">Acesso</h2>
                <div className="space-y-4">
                  <input type="email" placeholder="EMAIL" value={email} onChange={e=>setEmail(e.target.value)} className="input-premium font-black text-xs" />
                  <input type="password" placeholder="SENHA" value={password} onChange={e=>setPassword(e.target.value)} className="input-premium font-black text-xs" />
                  <button onClick={() => handleAuth(true)} className="btn-strategic text-[11px] mt-4">AUTORIZAR</button>
                  <button onClick={() => handleAuth(false)} className="w-full text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-10 hover:text-white transition-all uppercase">Registar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'capture' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="lighthouse-neon-wrapper w-full max-w-lg shadow-3xl">
              <div className="lighthouse-neon-content p-14 sm:p-20">
                <ShieldCheck size={80} className="text-[#25F4EE] mx-auto mb-10" />
                <h2 className="text-4xl font-black italic mb-3 uppercase leading-none text-white">Security Gateway</h2>
                <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.6em] mb-16 italic text-center">Host: <span className="text-white font-black">{captureData?.company}</span></p>
                <form onSubmit={handleCapture} className="space-y-8 text-left">
                  <input required name="nome" placeholder="Nome Completo" className="input-premium uppercase text-xs" />
                  <input required name="tel" type="tel" placeholder="Telemóvel" className="input-premium uppercase text-xs" />
                  <div className="flex items-center gap-6 p-7 bg-white/5 rounded-[2rem] border border-white/10">
                    <input type="checkbox" id="cookie-consent" checked={cookieAccepted} onChange={(e) => setCookieAccepted(e.target.checked)} className="w-8 h-8 accent-[#25F4EE] cursor-pointer shrink-0" />
                    <label htmlFor="cookie-consent" className="text-[11px] font-black text-white/40 uppercase tracking-widest cursor-pointer leading-tight italic">Autorizo os protocolos de segurança.</label>
                  </div>
                  <button className="btn-strategic text-[12px] mt-10 italic shadow-2xl">ESTABELECER LINK SEGURO</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
