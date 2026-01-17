import React, { useState, useRef, useEffect } from 'react';
import { useCamera } from './hooks/useCamera';
import { captureFrame, compareImages } from './utils/faceLogic';
import { Stage, User, ScanResult, ScanStatus } from './types';

// Component Imports
import { Header } from './components/Header';
import { WelcomeStage } from './components/WelcomeStage';
import { TrainingStage } from './components/TrainingStage';
import { ProcessingStage } from './components/ProcessingStage';
import { ListStage } from './components/ListStage';
import { TestingStage } from './components/TestingStage';

const App: React.FC = () => {
  // State
  const [stage, setStage] = useState<Stage>('welcome');
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const initModels = async () => {
      try {
        await import('./utils/faceLogic').then(mod => mod.loadModels());
        setModelsLoaded(true);
      } catch (e) {
        console.error("Failed to load models", e);
      }
    };
    initModels();
  }, []);

  // Registration State
  const [currentName, setCurrentName] = useState('');
  const [currentData, setCurrentData] = useState<string | null>(null);

  // Testing State
  const [testData, setTestData] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [scanResult, setScanResult] = useState<ScanResult | 'mismatch' | null>(null);

  // Hook & Refs
  const { stream, error: cameraError, startCamera, stopCamera } = useCamera();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Actions
  const handleStartCamera = async () => {
    await startCamera();
    setStage('training');
  };

  const handleCaptureFace = () => {
    if (!videoRef.current) return;
    const captured = captureFrame(videoRef.current);
    if (captured) {
      setCurrentData(captured);
      setStage('processing');
    }
  };

  const handleSaveUser = () => {
    if (currentName && currentData) {
      const newUser: User = {
        id: Date.now(),
        name: currentName,
        data: currentData
      };
      setRegisteredUsers([...registeredUsers, newUser]);
      // Reset
      setCurrentName('');
      setCurrentData(null);
      setStage('list');
    }
  };

  const handleDeleteUser = (id: number) => {
    setRegisteredUsers(registeredUsers.filter(u => u.id !== id));
  };

  const handleScanFace = async () => {
    if (!videoRef.current || registeredUsers.length === 0) return;

    const captured = captureFrame(videoRef.current);
    if (captured) {
      setTestData(captured);
      setScanStatus('scanning');
      setScanResult(null);

      let bestMatch: ScanResult = { name: '', score: 0 };

      // Compare against all users
      for (const user of registeredUsers) {
        const score = await compareImages(user.data, captured);
        if (score > bestMatch.score) {
          bestMatch = { name: user.name, score: score };
        }
      }

      // Artificial delay for dramatic effect
      setTimeout(() => {
        if (bestMatch.score > 65) {
          setScanResult(bestMatch);
          setScanStatus('match');
        } else {
          setScanResult('mismatch');
          setScanStatus('mismatch');
        }
      }, 2000);
    }
  };

  const handleResetAll = () => {
    stopCamera();
    setRegisteredUsers([]);
    setStage('welcome');
    setCurrentName('');
    setScanResult(null);
    setTestData(null);
    setScanStatus('idle');
  };

  return (
    <div className="min-h-screen bg-[#050510] text-slate-100 font-sans p-4 md:p-8 flex flex-col items-center justify-center">
      <Header />

      <div className="w-full max-w-4xl bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative min-h-[600px] flex flex-col transition-all duration-500">

        {stage === 'welcome' && (
          modelsLoaded ? (
            <WelcomeStage onStart={handleStartCamera} error={cameraError} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[600px] text-cyan-400">
              <div className="animate-spin mb-4 text-4xl">⏳</div>
              <div>Initializing AI Models...</div>
            </div>
          )
        )}

        {stage === 'list' && (
          <ListStage
            users={registeredUsers}
            onAddUser={() => setStage('training')}
            onDeleteUser={handleDeleteUser}
            onTest={() => { setScanStatus('idle'); setTestData(null); setScanResult(null); setStage('testing'); }}
            onReset={handleResetAll}
          />
        )}

        {stage === 'training' && (
          <TrainingStage
            videoRef={videoRef}
            stream={stream}
            currentName={currentName}
            setName={setCurrentName}
            onCapture={handleCaptureFace}
            onCancel={() => { setCurrentName(''); setStage('list'); }}
          />
        )}

        {stage === 'processing' && (
          <ProcessingStage
            currentName={currentName}
            imageData={currentData}
            onComplete={handleSaveUser}
          />
        )}

        {stage === 'testing' && (
          <TestingStage
            videoRef={videoRef}
            stream={stream}
            capturedImage={testData}
            scanStatus={scanStatus}
            result={scanResult}
            onScan={handleScanFace}
            onNext={() => { setScanStatus('idle'); setTestData(null); setScanResult(null); }}
            onBack={() => { setStage('list'); setScanStatus('idle'); setTestData(null); }}
          />
        )}

      </div>

      <div className="mt-8 text-slate-600 text-xs font-mono">
        สถานะระบบ: ออนไลน์ | การเชื่อมต่อปลอดภัย
      </div>
    </div>
  );
};

export default App;