import { useState, useRef, useEffect, useCallback, type ChangeEvent, type FC } from 'react';
import { Camera, RefreshCw, Upload, Check, AlertCircle, Sparkles } from 'lucide-react';

interface SelfieCaptureProps {
  currentPhoto?: string;
  onPhotoSelected: (photoUrl: string) => void;
}

export const SelfieCapture: FC<SelfieCaptureProps> = ({
  currentPhoto,
  onPhotoSelected,
}) => {
  const [prevCurrentPhoto, setPrevCurrentPhoto] = useState(currentPhoto);
  const [photo, setPhoto] = useState<string | null>(currentPhoto || null);

  if (currentPhoto !== prevCurrentPhoto) {
    setPrevCurrentPhoto(currentPhoto);
    setPhoto(currentPhoto || null);
  }

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Safely stop all media tracks
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // Ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsVideoReady(false);
  }, []);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Attach stream to video element whenever camera becomes active or video mounts
  const attachStreamToVideo = useCallback(() => {
    if (videoRef.current && streamRef.current) {
      const video = videoRef.current;
      if (video.srcObject !== streamRef.current) {
        video.srcObject = streamRef.current;
      }
      video
        .play()
        .then(() => setIsVideoReady(true))
        .catch((err) => {
          console.warn('Video play interrupted or waiting for user gesture:', err);
        });
    }
  }, []);

  useEffect(() => {
    if (isCameraActive) {
      attachStreamToVideo();
    }
  }, [isCameraActive, attachStreamToVideo]);

  const startCamera = async () => {
    setCameraError(null);
    setIsVideoReady(false);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera is not supported on this browser. Please upload a picture instead.');
      return;
    }

    // Stop any existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 640 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;
      setIsCameraActive(true);

      // Attempt immediate attachment if video element is already present
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current
          .play()
          .then(() => setIsVideoReady(true))
          .catch((err) => {
            console.warn('Video auto-play delayed:', err);
          });
      }
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      let message = 'Unable to access camera. Please allow camera permissions or upload a photo.';
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          message = 'Camera permission was denied. Please allow camera access in your browser settings, or upload a photo.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          message = 'No camera found on your device. You can upload a photo instead.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          message = 'Camera is currently being used by another application.';
        }
      }
      setCameraError(message);
      setIsCameraActive(false);
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const videoW = video.videoWidth || 640;
    const videoH = video.videoHeight || 640;
    const size = Math.min(videoW, videoH);

    canvas.width = 400;
    canvas.height = 400;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Center crop & mirror horizontally to match selfie view
    const startX = (videoW - size) / 2;
    const startY = (videoH - size) / 2;

    ctx.save();
    ctx.translate(400, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, startX, startY, size, size, 0, 0, 400, 400);
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setPhoto(dataUrl);
    onPhotoSelected(dataUrl);
    stopCamera();
  };

  const takeSnapshot = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          captureFrame();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Process and compress uploaded photos into a neat 400x400 square avatar
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 400, 400);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setPhoto(compressed);
          onPhotoSelected(compressed);
        } else {
          setPhoto(rawUrl);
          onPhotoSelected(rawUrl);
        }
        stopCamera();
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setPhoto(null);
    setCameraError(null);
    startCamera();
  };

  return (
    <div className="space-y-4 text-center">
      <canvas ref={canvasRef} className="hidden" />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Profile Circular Frame */}
      <div className="relative mx-auto w-40 h-40 rounded-full overflow-hidden bg-zinc-100 border-2 border-dashed border-[#0b57d0] flex items-center justify-center shadow-inner group">
        {photo ? (
          <div className="relative w-full h-full">
            <img
              src={photo}
              alt="Camper Selfie Badge"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 right-1 p-1.5 bg-[#188038] rounded-full text-white shadow-sm ring-2 ring-white">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
        ) : isCameraActive ? (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <video
              ref={(el) => {
                videoRef.current = el;
                if (el && streamRef.current && el.srcObject !== streamRef.current) {
                  el.srcObject = streamRef.current;
                  el.play().then(() => setIsVideoReady(true)).catch(() => {});
                }
              }}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={() => {
                videoRef.current?.play().then(() => setIsVideoReady(true)).catch(() => {});
              }}
              className="w-full h-full object-cover -scale-x-100"
            />

            {!isVideoReady && (
              <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center text-white text-xs gap-1.5">
                <Sparkles className="w-5 h-5 animate-spin text-[#0b57d0]" />
                <span className="text-[11px] text-zinc-300">Starting camera...</span>
              </div>
            )}

            {countdown !== null && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                <span className="text-5xl font-black text-white drop-shadow-md animate-ping">
                  {countdown}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 text-center space-y-1">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0b57d0] flex items-center justify-center mx-auto shadow-2xs">
              <Camera className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-semibold text-zinc-700">Official Pass Photo</p>
            <p className="text-[10px] text-zinc-500">Live preview or upload</p>
          </div>
        )}
      </div>

      {cameraError && (
        <div className="inline-flex items-center gap-1.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left max-w-sm mx-auto">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span className="leading-snug">{cameraError}</span>
        </div>
      )}

      {/* Pill Action Controls */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {!photo && !isCameraActive && (
          <>
            <button
              type="button"
              onClick={startCamera}
              className="tap-pill inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold shadow-xs cursor-pointer transition-all"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
              <span>Use Camera</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="tap-pill inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold cursor-pointer border border-zinc-200 transition-all"
            >
              <Upload className="w-3.5 h-3.5 text-zinc-600" />
              <span>Upload Picture</span>
            </button>
          </>
        )}

        {isCameraActive && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={takeSnapshot}
              disabled={countdown !== null}
              className="tap-pill inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{countdown !== null ? `Capturing in ${countdown}...` : 'Snap Photo (3s timer)'}</span>
            </button>
            <button
              type="button"
              onClick={captureFrame}
              disabled={countdown !== null}
              className="tap-pill px-3 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold cursor-pointer"
              title="Instant capture without countdown"
            >
              Snap Now
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="px-3 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs cursor-pointer border border-zinc-200"
            >
              Cancel
            </button>
          </div>
        )}

        {photo && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRetake}
              className="tap-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium border border-zinc-200 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-zinc-600" />
              <span>Retake with Camera</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="tap-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium border border-zinc-200 cursor-pointer"
            >
              <Upload className="w-3 h-3 text-zinc-600" />
              <span>Upload Different Photo</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
