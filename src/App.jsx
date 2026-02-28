import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, PermissionsAndroid, Alert, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import SendDirectSms from 'react-native-send-direct-sms';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, query, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// --- MESMA CONFIGURAÇÃO FIREBASE DO SEU APP WEB ---
const firebaseConfig = {
  apiKey: "AIzaSyBI-JSC-FtVOz_r6p-XjN6fUrapMn_ad24",
  authDomain: "smartsmspro-4ee81.firebaseapp.com",
  projectId: "smartsmspro-4ee81",
  storageBucket: "smartsmspro-4ee81.firebasestorage.app",
  messagingSenderId: "269226709034",
  appId: "1:269226709034:web:00af3a340b1e1ba928f353"
};

const appId = "smartsms-pro-elite-terminal-vfinal";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [syncedUid, setSyncedUid] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isTransmitting, setIsTransmitting] = useState(false);

  // 1. SOLICITA PERMISSÕES (CÂMERA E ENVIO DE SMS OCULTO)
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        {
          title: 'SMART SMS PRO Terminal',
          message: 'This app needs SMS permission to automate dispatch.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Permission required to run the Node.");
      }
      
      // Login anônimo para o App poder ler o banco
      await signInAnonymously(auth);
    })();
  }, []);

  // 2. LEITURA DO QR CODE (Node Sync)
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // O Web App gera um QR Code com: SMART_SMS_PRO_SYNC_UID
    if (data.startsWith('SMART_SMS_PRO_SYNC_')) {
      const uid = data.replace('SMART_SMS_PRO_SYNC_', '');
      setSyncedUid(uid);
      Alert.alert('NODE SYNCED', 'Secure P2P Tunnel Established!');
    } else {
      Alert.alert('Invalid Code', 'Please scan the official Smart SMS Pro QR.');
    }
  };

  // 3. ESCUTA A FILA DA DASHBOARD (Firebase Listener)
  useEffect(() => {
    if (!syncedUid) return;

    // Fica escutando a coleção de "Fila de Envio" do usuário
    const q = query(collection(db, 'artifacts', appId, 'users', syncedUid, 'sms_queue'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(newTasks);
      
      // Se houver tarefas e não estiver transmitindo, aciona o motor
      if (newTasks.length > 0 && !isTransmitting) {
        processQueue(newTasks);
      }
    });

    return () => unsubscribe();
  }, [syncedUid, isTransmitting]);

  // 4. MOTOR DE DISPARO SILENCIOSO (Direct SMS)
  const processQueue = async (tasks) => {
    setIsTransmitting(true);
    
    for (let task of tasks) {
      try {
        // Envia o SMS silenciosamente pelo chip do aparelho
        SendDirectSms(task.telefone_cliente, task.optimizedMsg)
          .then((res) => console.log('SMS Sent', res))
          .catch((err) => console.log('SMS Error', err));

        // Deleta a tarefa do banco para não enviar duplicado
        await deleteDoc(doc(db, 'artifacts', appId, 'users', syncedUid, 'sms_queue', task.id));
        
        // Aplica um pequeno delay local de segurança para não travar a antena
        await new Promise(r => setTimeout(r, 2000)); 
      } catch (e) {
        console.error("Error processing node task", e);
      }
    }
    
    setIsTransmitting(false);
  };

  if (hasPermission === null) return <Text>Requesting permissions...</Text>;
  if (hasPermission === false) return <Text>No access to camera or SMS.</Text>;

  return (
    <View style={styles.container}>
      {!syncedUid ? (
        <>
          <Text style={styles.title}>SCAN NODE QR</Text>
          <View style={styles.cameraContainer}>
            <Camera 
              style={StyleSheet.absoluteFillObject} 
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} 
            />
          </View>
          {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} color="#25F4EE" />}
        </>
      ) : (
        <View style={styles.dashboard}>
          <Text style={styles.title}>SMART SMS PRO</Text>
          <Text style={styles.subtitle}>SECURE NODE ACTIVE</Text>
          
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>
              {isTransmitting ? "TRANSMITTING PROTOCOL..." : "SYSTEM STANDBY"}
            </Text>
          </View>

          <Text style={styles.stats}>Pending Tasks: {logs.length}</Text>

          <TouchableOpacity style={styles.btnDisconnect} onPress={() => setSyncedUid(null)}>
            <Text style={styles.btnText}>DISCONNECT NODE</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#010101', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 10, fontStyle: 'italic' },
  subtitle: { fontSize: 12, color: '#25F4EE', letterSpacing: 3, marginBottom: 40 },
  cameraContainer: { width: 300, height: 300, borderRadius: 30, overflow: 'hidden', borderWidth: 2, borderColor: '#25F4EE', marginBottom: 20 },
  dashboard: { width: '100%', alignItems: 'center' },
  statusBox: { width: '100%', padding: 30, backgroundColor: '#111', borderRadius: 20, borderWidth: 1, borderColor: '#25F4EE', alignItems: 'center', marginBottom: 30 },
  statusText: { color: '#25F4EE', fontWeight: 'bold', fontSize: 16, letterSpacing: 2 },
  stats: { color: '#fff', fontSize: 18, marginBottom: 40 },
  btnDisconnect: { backgroundColor: '#FE2C55', padding: 15, borderRadius: 12, width: '100%', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 }
});
