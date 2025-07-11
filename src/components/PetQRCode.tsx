import { QRCodeSVG } from 'qrcode.react';

interface Props {
  token: string;
  size?: number;
}

export default function PetQRCode({ token, size = 160 }: Props) {
  const url = `${import.meta.env.VITE_PUBLIC_BASE_URL}/qr/${token}`;
  return (
    <div className="flex flex-col items-center gap-2">
      <QRCodeSVG value={url} size={size} level="M" />
      <p className="text-xs text-slate-500 break-all text-center">{url}</p>
    </div>
  );
}
