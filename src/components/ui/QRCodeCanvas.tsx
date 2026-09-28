import { useEffect, useRef, useState, type FC } from 'react';
import QRCode from 'qrcode';

interface QRCodeCanvasProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeCanvas: FC<QRCodeCanvasProps> = ({ value, size = 120, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    QRCode.toCanvas(
      canvasRef.current,
      value,
      {
        width: size,
        margin: 1,
        color: {
          dark: '#1f1f1f',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      },
      (err) => {
        if (err) {
          console.error('Failed to render QR code:', err);
          setError(true);
        } else {
          setError(false);
        }
      }
    );
  }, [value, size]);

  if (error) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center bg-zinc-100 rounded-xl text-zinc-400 text-[10px] ${className}`}
      >
        QR Error
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className={`rounded-xl block shadow-2xs ${className}`}
    />
  );
};
