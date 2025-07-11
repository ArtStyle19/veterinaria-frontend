import { useState } from 'react';
import clsx from 'clsx';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { importPet } from '../api/pets';
import { useQrModal } from './QrModalContext';
import { useAuth } from '../auth/AuthContext';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export default function QrModal() {
  const { mode, close } = useQrModal();
  const { user } = useAuth();
  const navigate = useNavigate();

  /* steps: scan → info → edit → done */
  const [step, setStep] = useState<'SCAN' | 'INFO' | 'EDIT' | 'DONE'>('SCAN');
  const [pet, setPet] = useState<any>(null);
  const [editCode, setEditCode] = useState('');
  const [importing, setImporting] = useState(false);

      const [QrToken, setQrToken] = useState('');


  /* ---- escáner ---- */
  const [scannerReady, setScannerReady] = useState(false);
  const initScanner = () => {
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { 
            fps: 10,
            qrbox: 250,
            rememberLastUsedCamera: false,
        // aspectRatio: 100.0,
        // showTorchButtonIfSupported: true,
            showTorchButtonIfSupported: true,
            // showZoomSliderIfSupported: true,
            // defaultZoomValueIfSupported: 1,
            // aspectRatio: 1.0,
            // disableFlip: false,

        },
        false
      );

      //lines animation

        const observer = new MutationObserver(() => {
        const shadedRegion = document.querySelector('#qr-shaded-region') as HTMLElement;
        if (shadedRegion && !shadedRegion.querySelector('.qr-scan-line')) {
            const line = document.createElement('div');
            line.className = 'qr-scan-line';
            shadedRegion.appendChild(line);
            observer.disconnect(); // ya no se necesita observar más
        }
        });

        observer.observe(document.getElementById('qr-reader')!, {
            childList: true,
            subtree: true
        });
//

      scanner.render(
        (decoded) => {
          scanner.clear();
          handleToken(decoded);
        },
        () => {}
      );
      setScannerReady(true);
    }, 100);

    
  };
//   let token = '';

  function handleToken(raw: string) {
    const match = raw.match(
      /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
    );
    if (!match) {
      toast.error('QR inválido');
      return;
    }

    const token = match[1];
    setQrToken(token);
    console.log(token);
    if (mode==='VIEW') {
      navigate(`/qr/${token}`)
      close();
      return;
    }
    api
      .get(`/api/public/pets/qr/${token}`)
      .then((res) => {
        setPet(res.data);
        setStep('INFO');
      })
      .catch(() => toast.error('Mascota no encontrada'));
  }

  /* ---- importación ---- */
  async function handleImport() {
    // if (!pet?.qrCodeToken) return; // fix api
    if (!QrToken) return;
    console.log(QrToken);
    if (!editCode.trim()) {
      toast.error('Ingresa el código de edición');
      return;
    }
    try {
      setImporting(true);
      await importPet({ qrCodeToken: QrToken, editCode });
      toast.success('Importación exitosa');
      setStep('DONE');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Error al importar');
    } finally {
      setImporting(false);
    }
  }

  /* ---- UI helpers ---- */
  const canImport =
    (mode === 'IMPORT_VET' || mode === 'IMPORT_OWNER' && pet?.canBeImported) ;// fix api first
    // (mode === 'IMPORT_VET' || mode === 'IMPORT_OWNER') && true;

  return (
    <div
      className="fixed inset-0 bg-black/10  flex items-center justify-center z-50"
      onClick={close}
    >
      <div
        className="bg-white/3 backdrop-blur-md border border-white/10 shadow-glass rounded-2xl p-6 w-[90%] max-w-lg text-slate-100 space-y-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <h2 className="text-xl font-semibold text-center">
          {step === 'SCAN' && 'Escanea código QR'}
          {step === 'INFO' && 'Mascota encontrada'}
          {step === 'EDIT' && 'Confirmar importación'}
          {step === 'DONE' && 'Éxito'}
        </h2>

        {/* BODY */}
        {step === 'SCAN' && (
          <>
            <div id="qr-reader" className="rounded-lg overflow-hidden" />
            {!scannerReady && initScanner()}
            {/* {showScanner ? (
                    <QRScanner onResult={goToPet} />
                  )  */}
            <p className="text-center text-xs">
              Apunta la cámara o sube una imagen. El QR debe contener un token
              UUID o una URL <code>/qr/&lt;token&gt;</code>.
            </p>
          </>
        )}

        {step === 'INFO' && pet && (
          <>
            <p className="text-lg font-medium">
              {pet.name} — {pet.species}
            </p>
            <p className="text-sm opacity-90">{pet.breed}</p>

            <table className="text-sm mt-2">
              <tbody>
                <Row label="Sexo" value={pet.sex} />
                <Row
                  label="Nacimiento"
                  value={pet.birthdate ? dayjs(pet.birthdate).format('DD/MM/YYYY') : '—'}
                />
                <Row label="Estado" value={pet.status} />
              </tbody>
            </table>

            {pet.status === 'LOST' && (
              <div className="mt-3 text-amber-200 text-sm">
                <p>Dueño: {pet.ownerName || '—'}</p>
                <p>Contacto: {pet.ownerContact || '—'}</p>
                {pet.ownerEmail && <p>Email: {pet.ownerEmail}</p>}
              </div>
            )}

            {canImport && (
              <button
                className="btn btn-primary w-full mt-4"
                onClick={() => setStep('EDIT')}
              >
                Importar
              </button>
            )}
          </>
        )}

        {step === 'EDIT' && (
          <>
            <input
              className="input w-full"
              placeholder="Código de edición"
              value={editCode}
              onChange={(e) => setEditCode(e.target.value)}
            />
            <button
              className="btn btn-primary w-full mt-4"
              onClick={handleImport}
              disabled={importing}
            >
              {importing ? 'Importando…' : 'Confirmar'}
            </button>
          </>
        )}

        {step === 'DONE' && (
          <p className="text-center text-lg font-semibold">
            ¡Importación completada!
          </p>
        )}

        {/* FOOTER BUTTONS */}
        <div className="flex justify-end gap-3 pt-2">
          {step !== 'SCAN' && step !== 'DONE' && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setPet(null);
                setStep('SCAN');
                setEditCode('');
                initScanner();
              }}
            >
              Escanear otro
            </button>
          )}
          <button className="btn btn-secondary" onClick={close}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <tr>
      <td className="pr-2">{label}</td>
      <td className="opacity-90">{value || '—'}</td>
    </tr>
  );
}
