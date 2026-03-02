// src/App.jsx
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
  LayoutDashboard, LogOut, Rocket, Bot, HelpCircle, ShieldCheck, UploadCloud,
  RefreshCw, Users, Crown, UserCheck, Trash, Edit, Send, Plus, Calendar, BellRing,
  DownloadCloud, ShieldAlert, Wifi, WifiOff
} from 'lucide-react';

// ---------------------------
// Minimal safe firebase config
// ---------------------------
// NOTE: keep only public config here. Secrets must be in server env.
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_PUBLIC_APIKEY",
  authDomain: "REPLACE_WITH_YOUR_AUTHDOMAIN",
  projectId: "REPLACE_WITH_YOUR_PROJECTID",
  storageBucket: "REPLACE_WITH_YOUR_STORAGEBUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGINGSENDERID",
  appId: "REPLACE_WITH_YOUR_APPID"
};

const appId = "smartsms-pro-safe-client";
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// ---------------------------
// Utility helpers
// ---------------------------
const sanitizePhoneToE164 = (raw) => {
  if (!raw) return null;
  const digits = String(raw).replace(/\D/g, '');
  // Basic E.164 normalization: require country code (at least 8 digits total)
  if (digits.length < 8) return null;
  return `+${digits}`;
};

const toast = (msg) => {
  // Minimal toast replacement for alert()
  // Replace with your preferred toast library (react-toastify, etc.)
  console.log('[TOAST]', msg);
  // For quick visual feedback in dev, you can use alert as fallback:
  // alert(msg);
};

// ---------------------------
// Zero-tolerance content check
// ---------------------------
const checkForbiddenWords = (text) => {
  if (!text) return false;
  const normalized = text.normalize?.("NFD")?.replace(/[\u0300-\u036f]/g, "")?.toLowerCase() || String(text).toLowerCase();
  const regex = /(scam|fraud|phishing|malware|ransomware|ddos|exploit|illegal|porn|hate|murder|extortion|virus|spam|golpe|odio|puta|caralho|merda|porra|foda|bitch|fuck|shit|asshole)/i;
  return regex.test(normalized);
};

// ---------------------------
// Main App
// ---------------------------
export default function App() {
  // UI & auth
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // generator
  const [genTo, setGenTo] = useState('');
  const [genMsg, setGenMsg] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [loading, setLoading] = useState(false);

  // capture
  const [captureForm, setCaptureForm] = useState({ name: '', phone: '' });
  const [captureData, setCaptureData] = useState(null);

  // logs & links
  const [logs, setLogs] = useState([]);
  const [linksHistory, setLinksHistory] = useState([]);

  // chat (non-harmful heuristic)
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // derived
  const isGenMsgForbidden = checkForbiddenWords(genMsg);
  const isChatForbidden = checkForbiddenWords(chatInput);

  // ---------------------------
  // Auth bootstrap
  // ---------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        try {
          const docRef = doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'data');
          const snap = await getDoc(docRef);
          if (snap.exists()) setUserProfile(snap.data());
          else {
            const p = { fullName: u.email?.split('@')[0] || 'Operator', email: u.email, tier: 'FREE_TRIAL', smsCredits: 0, created_at: serverTimestamp() };
            await setDoc(docRef, p);
            setUserProfile(p);
          }
        } catch (e) {
          console.error('Profile load error', e);
          setUserProfile({ fullName: 'Operator', tier: 'FREE_TRIAL', smsCredits: 0 });
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setAuthResolved(true);
    });
    return () => unsub();
  }, []);

  // ---------------------------
  // Real-time listeners (read-only)
  // ---------------------------
  useEffect(() => {
    if (!user || view !== 'dashboard') return;
    const unsubLogs = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), (snap) => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Only show leads owned by this user (server rules must enforce this)
      setLogs(all.filter(l => l.ownerId === user.uid));
    });
    const unsubLinks = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'links'), (snap) => {
      setLinksHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubLogs(); unsubLinks(); };
  }, [user, view]);

  // ---------------------------
  // Link generation (safe)
  // ---------------------------
  const handleGenerate = async () => {
    if (!user) {
      toast('Please sign in to generate secure links.');
      setView('auth');
      return;
    }
    if (!genTo || !genMsg) {
      toast('Recipient and message are required.');
      return;
    }
    if (isGenMsgForbidden) {
      toast('Message contains prohibited content. Please edit.');
      return;
    }

    setLoading(true);
    try {
      // Normalize phone on client; server must validate again
      const normalized = sanitizePhoneToE164(genTo);
      if (!normalized) { toast('Invalid phone format. Use +CountryCode number.'); setLoading(false); return; }

      // Create a link payload and store it in Firestore under user's links
      // IMPORTANT: actual dispatch must be performed by a server-side process that enforces consent and rate limits
      const lid = crypto?.randomUUID?.() || `${Date.now()}`;
      const link = `${window.location.origin}?t=${encodeURIComponent(normalized)}&m=${encodeURIComponent(genMsg)}&o=${user.uid}&c=${encodeURIComponent(companyName || 'Host')}`;

      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', lid), {
        url: link,
        to: normalized,
        msg: genMsg,
        company: companyName || 'Host',
        created_at: serverTimestamp(),
        status: 'active'
      }, { merge: true });

      setGeneratedLink(link);
      setGenTo(''); setGenMsg(''); setCompanyName('');
      toast('Secure link generated. Stored in your inventory.');
    } catch (e) {
      console.error(e);
      toast('Failed to generate link.');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Capture handshake (consent-first)
  // ---------------------------
  const handleProtocolHandshake = async () => {
    // This flow **must** call a server endpoint that:
    //  - verifies ownerId
    //  - records explicit consent (timestamp, IP, user-agent)
    //  - enforces opt-in/opt-out and legal retention
    if (!captureForm.name || !captureForm.phone || !captureData) {
      toast('Name and phone are required.');
      return;
    }
    const normalized = sanitizePhoneToE164(captureForm.phone);
    if (!normalized) { toast('Invalid phone format. Use +CountryCode number.'); return; }

    setLoading(true);
    try {
      // Call a secure server endpoint (Cloud Function) to register lead with consent
      // Example: POST /api/registerLead { ownerId, name, phone, source, consent: true }
      // The server will:
      //  - validate ownerId and quota
      //  - store lead in Firestore under public/data/leads with ownerId
      //  - decrement host quota server-side if applicable
      // Here we do a minimal client-side write that should be validated by server rules.
      const ownerId = captureData.ownerId;
      const leadDocId = `${ownerId}_${normalized.replace(/\D/g, '')}`;
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'leads', leadDocId), {
        ownerId,
        nome_cliente: captureForm.name,
        telefone_cliente: normalized,
        timestamp: serverTimestamp(),
        device: navigator.userAgent,
        folderId: 'MANUAL',
        source: 'SECURE_LINK_GATEWAY',
        consent: true // client-side flag; server must verify and log consent
      }, { merge: true });

      // Store a local marker to avoid duplicate prompts
      localStorage.setItem(`smartsms_registered_for_${ownerId}_${normalized.replace(/\D/g,'')}`, 'true');

      // Redirect to native SMS app is optional; keep it explicit and user-driven
      toast('Lead registered with consent. You may now open your SMS app.');
      setView('bridge');
      setTimeout(() => {
        const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? '&' : '?';
        window.location.href = `sms:${captureData.to}${sep}body=${encodeURIComponent(captureData.msg)}`;
      }, 200);
    } catch (e) {
      console.error(e);
      toast('Failed to register lead. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Chat handler (non-harmful)
  // ---------------------------
  const handleSendChat = async (e) => {
    if (e) e.preventDefault();
    const text = chatInput?.trim();
    if (!text) return;
    if (isChatForbidden) {
      setChatMessages(prev => [...prev, { role: 'user', text }, { role: 'model', text: 'Prohibited content detected. Please rephrase.' }]);
      setChatInput('');
      return;
    }
    setChatMessages(prev => [...prev, { role: 'user', text }]);
    setChatInput('');
    setIsChatLoading(true);

    // Simple local heuristic response (no external LLM calls here)
    await new Promise(r => setTimeout(r, 600));
    const reply = `Obrigado — recebi sua mensagem: "${text.slice(0,120)}". Para ações que envolvem envios ou dados pessoais, o sistema exige consentimento e validação legal.`;
    setChatMessages(prev => [...prev, { role: 'model', text: reply }]);
    setIsChatLoading(false);
  };

  // ---------------------------
  // Auth forms (minimal)
  // ---------------------------
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [fullNameInput, setFullNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');

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
        const p = { fullName: fullNameInput, email: emailLower, phone: phoneInput, tier: 'FREE_TRIAL', smsCredits: 0, created_at: serverTimestamp() };
        await setDoc(doc(db, 'artifacts', appId, 'users', authUser.uid, 'profile', 'data'), p);
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'subscribers', authUser.uid), { id: authUser.uid, ...p });
        setUserProfile(p);
      }
      setView('dashboard');
    } catch (e) {
      console.error(e);
      toast('Authentication failed: ' + (e.message || ''));
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Simple UI render (kept minimal)
  // ---------------------------
  if (!authResolved) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div>Initializing...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010101] text-white p-4">
      <nav className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-[#25F4EE]/10 p-2 rounded"><Zap size={20} className="text-[#25F4EE]" /></div>
          <span className="font-black">SMART SMS PRO (SAFE)</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm">{userProfile?.fullName || user.email}</span>
              <button onClick={() => { signOut(auth); setView('home'); }} className="text-red-400">Logout</button>
            </>
          ) : (
            <button onClick={() => setView('auth')} className="bg-[#25F4EE] text-black px-3 py-2 rounded">Sign In</button>
          )}
        </div>
      </nav>

      {view === 'home' && (
        <main className="max-w-2xl mx-auto space-y-6">
          <section className="bg-[#0a0a0a] p-6 rounded">
            <h2 className="text-xl font-black mb-3">Generate Secure Link</h2>
            <label className="block text-xs mb-1">Recipient (+CountryNumber)</label>
            <input value={genTo} onChange={e => setGenTo(e.target.value)} className="w-full p-2 mb-3 bg-black/50 rounded" placeholder="+1 555 555 5555" />
            <label className="block text-xs mb-1">Message</label>
            <textarea value={genMsg} onChange={e => setGenMsg(e.target.value)} rows={3} className="w-full p-2 mb-3 bg-black/50 rounded" placeholder="Your message here" />
            <label className="block text-xs mb-1">Host / Company</label>
            <input value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full p-2 mb-3 bg-black/50 rounded" placeholder="Your organization" />
            <div className="flex gap-2">
              <button onClick={handleGenerate} disabled={loading || isGenMsgForbidden} className="px-4 py-2 bg-[#25F4EE] text-black rounded">
                {isGenMsgForbidden ? 'Prohibited content' : 'Generate Link'}
              </button>
              {generatedLink && <button onClick={() => { navigator.clipboard.writeText(generatedLink); toast('Link copied'); }} className="px-4 py-2 bg-white/5 rounded">Copy</button>}
            </div>
            {isGenMsgForbidden && <p className="text-red-400 mt-2 text-sm">Message contains prohibited words.</p>}
          </section>

          <section className="bg-[#0a0a0a] p-6 rounded">
            <h3 className="font-black mb-2">Chat Support</h3>
            <div className="space-y-2 mb-3">
              {chatMessages.map((m, i) => (
                <div key={i} className={`p-2 rounded ${m.role === 'user' ? 'bg-[#25F4EE] text-black' : 'bg-white/5'}`}>{m.text}</div>
              ))}
            </div>
            <form onSubmit={handleSendChat} className="flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} className="flex-1 p-2 bg-black/50 rounded" placeholder="Type your message..." />
              <button type="submit" disabled={isChatLoading || isChatForbidden} className="px-3 py-2 bg-[#25F4EE] text-black rounded">Send</button>
            </form>
            {isChatForbidden && <p className="text-red-400 mt-2">Message contains prohibited words.</p>}
          </section>
        </main>
      )}

      {view === 'auth' && (
        <div className="max-w-md mx-auto bg-[#0a0a0a] p-6 rounded">
          <h3 className="font-black mb-4">{isLoginMode ? 'Sign In' : 'Create Account'}</h3>
          <form onSubmit={handleAuthSubmit} className="space-y-3">
            {!isLoginMode && (
              <>
                <input value={fullNameInput} onChange={e => setFullNameInput(e.target.value)} placeholder="Full name" className="w-full p-2 bg-black/50 rounded" />
                <input value={phoneInput} onChange={e => setPhoneInput(e.target.value)} placeholder="+CountryNumber" className="w-full p-2 bg-black/50 rounded" />
              </>
            )}
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 bg-black/50 rounded" />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-2 bg-black/50 rounded" />
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-[#25F4EE] text-black rounded">{isLoginMode ? 'Sign In' : 'Create'}</button>
              <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} className="px-4 py-2 bg-white/5 rounded">Switch</button>
            </div>
          </form>
        </div>
      )}

      {view === 'dashboard' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-[#0a0a0a] p-6 rounded">
            <h3 className="font-black">Dashboard</h3>
            <p className="text-sm text-white/60">Leads captured: {logs.length}</p>
            <p className="text-sm text-white/60">Links in inventory: {linksHistory.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
// functions/index.js (Node 18+)
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp();

exports.signSyncToken = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Auth required');
  const uid = context.auth.uid;
  // server-side secret stored in functions config or env
  const secret = functions.config().nexus?.salt || process.env.NEXUS_SALT;
  if (!secret) throw new functions.https.HttpsError('failed-precondition', 'Server not configured');

  const window5min = Math.floor(Date.now() / 300000);
  const raw = `${uid}:${window5min}:SMARTSMS_SECURE`;
  const hmac = crypto.createHmac('sha256', secret).update(raw).digest('hex').slice(0, 32);
  const token = `NEXUS_SYNC|uid:${uid}|tok:${hmac}|exp:${window5min}`;
  return { token };
});

// Example admin action endpoint (must check custom claims)
exports.grantTier = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Auth required');
  const caller = context.auth.token || {};
  if (!caller.admin) throw new functions.https.HttpsError('permission-denied', 'Admin only');
  const { targetUid, tier } = data;
  if (!targetUid || !tier) throw new functions.https.HttpsError('invalid-argument', 'Missing params');
  const profileRef = admin.firestore().doc(`artifacts/${process.env.APP_ID}/users/${targetUid}/profile/data`);
  await profileRef.set({ tier, updated_at: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  return { success: true };
});
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/users/{userId}/profile/data {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && (request.auth.uid == userId || request.auth.token.admin == true);
      allow delete: if request.auth != null && request.auth.token.admin == true;
    }

    match /artifacts/{appId}/public/data/leads/{leadId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && (resource.data.ownerId == request.auth.uid || request.auth.token.admin == true);
      allow update, delete: if request.auth != null && (resource.data.ownerId == request.auth.uid || request.auth.token.admin == true);
    }

    match /artifacts/{appId}/users/{userId}/links/{linkId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Deny any other writes by default
    match /{document=**} {
      allow read: if false;
      allow write: if false;
    }
  }
}
