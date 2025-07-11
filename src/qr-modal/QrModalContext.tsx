import { createContext, useContext, useState } from 'react';
import QrModal from './QrModal';

type Mode = 'VIEW' | 'IMPORT_VET' | 'IMPORT_OWNER';

interface QrModalState {
  open: (mode: Mode) => void;
  close: () => void;
  mode: Mode | null;
}

const QrModalContext = createContext<QrModalState | null>(null);

export function QrModalProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode | null>(null);
  const open = (m: Mode) => setMode(m);
  const close = () => setMode(null);

  return (
    <QrModalContext.Provider value={{ open, close, mode }}>
      {children}
      {mode && <QrModal />}
    </QrModalContext.Provider>
  );
}

export function useQrModal() {
  const ctx = useContext(QrModalContext);
  if (!ctx) throw new Error('QrModalProvider missing');
  return ctx;
}
