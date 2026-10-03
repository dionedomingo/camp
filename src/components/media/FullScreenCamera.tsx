import { useState, useRef, useEffect, useCallback, type FC, type ChangeEvent } from 'react';
import { 
  X, 
  RotateCcw, 
  Check, 
  SwitchCamera, 
  Upload, 
  Camera, 
  AlertCircle,
  Loader2
} from 'lucide-react';

interface FullScreenCameraProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  onUploadSelect?: (file: File) => void;
}

export const FullScreenCamera: FC<FullScreenCameraProps> = ({
  isOpen,
  onClose,
  onCapture,
  onUploadSelect,
}) => {
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<{ file: File; previewUrl: string } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  // Start camera stream
  const startCamera = useCallback(async (desiredFacing: 'environment' | 'user') => {
    setCameraError(null);
    setIsLoadingCamera(true);
    stopCamera();

    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera is not supported on this browser. Please use the upload option instead.');
      setIsLoadingCamera(false);
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: desiredFacing },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
      } catch (errConstraint) {
        console.warn('Initial camera constraints failed, attempting fallback:', errConstraint);
        // Fallback with minimal constraints (vital for laptop webcams)
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('autoplay', 'true');
        videoRef.current.muted = true;

        await videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      let message = 'Unable to access camera. Please check permissions or upload a photo.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Camera permission was denied. Please allow camera access in your browser settings or upload from files.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = 'No camera found on this device. You can upload an existing photo instead.';
      }
      setCameraError(message);
    } finally {
      setIsLoadingCamera(false);
    }
  }, [stopCamera]);

  // Handle open / close lifecycle
  useEffect(() => {
    if (isOpen && !capturedPhoto) {
      startCamera(facingMode);
    } else if (!isOpen) {
      stopCamera();
      if (capturedPhoto?.previewUrl) {
        URL.revokeObjectURL(capturedPhoto.previewUrl);
      }
      setCapturedPhoto(null);
      setCameraError(null);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, startCamera, stopCamera]);

  // Flip between front and rear cameras
  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture frame to canvas
  const handleSnapPhoto = () => {
    const video = videoRef.current;
    if (!video || !isStreaming) return;

    // Trigger visual shutter flash
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 120);

    const videoWidth = video.videoWidth || 1280;
    const videoHeight = video.videoHeight || 720;

    const canvas = document.createElement('canvas');
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Mirror user/front selfie camera horizontally
    if (facingMode === 'user') {
      ctx.translate(videoWidth, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `camp_photo_${Date.now()}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        const previewUrl = URL.createObjectURL(blob);
        setCapturedPhoto({ file, previewUrl });
        stopCamera();
      },
      'image/jpeg',
      0.92
    );
  };

  // Retake photo
  const handleRetake = () => {
    if (capturedPhoto?.previewUrl) {
      URL.revokeObjectURL(capturedPhoto.previewUrl);
    }
    setCapturedPhoto(null);
    startCamera(facingMode);
  };

  // Accept and use photo
  const handleUsePhoto = () => {
    if (!capturedPhoto) return;
    onCapture(capturedPhoto.file);
    stopCamera();
    onClose();
  };

  // Handle secondary file upload from inside camera
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      if (onUploadSelect) {
        onUploadSelect(file);
      } else {
        onCapture(file);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col justify-between select-none overflow-hidden animate-in fade-in duration-200">
      {/* Hidden file input for secondary upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Shutter Flash Animation Overlay */}
      {isFlashing && (
        <div className="absolute inset-0 z-50 bg-white pointer-events-none animate-out fade-out duration-150" />
      )}

      {/* Top Header Bar */}
      <div className="relative z-30 p-4 sm:p-6 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <button
          type="button"
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer shadow-lg"
          title="Close Camera"
          aria-label="Close Camera"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs font-semibold tracking-wide">
          <Camera className="w-3.5 h-3.5 text-blue-400" />
          <span>{capturedPhoto ? 'Review Photo' : 'Snap Moment'}</span>
        </div>

        {!capturedPhoto && isStreaming ? (
          <button
            type="button"
            onClick={handleToggleFacingMode}
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer shadow-lg"
            title="Switch Camera (Front / Rear)"
            aria-label="Switch Camera"
          >
            <SwitchCamera className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Viewfinder Center Body */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-zinc-950">
        {capturedPhoto ? (
          /* Captured Photo Review Preview */
          <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-6">
            <img
              src={capturedPhoto.previewUrl}
              alt="Snapped photo preview"
              className="max-h-full max-w-full object-contain rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10"
            />
          </div>
        ) : cameraError ? (
          /* Camera Error State */
          <div className="max-w-sm mx-auto p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">Camera Unavailable</h4>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                {cameraError}
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Photo from Files Instead</span>
              </button>
              <button
                type="button"
                onClick={() => startCamera(facingMode)}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          /* Live Camera Viewfinder */
          <div className="relative w-full h-full flex items-center justify-center">
            {isLoadingCamera && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-2 bg-black/60">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="text-xs font-semibold text-zinc-300">Initializing camera...</span>
              </div>
            )}

            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isStreaming ? 'opacity-100' : 'opacity-0'
              } ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />

            {/* Subtle Framing Guides */}
            {isStreaming && (
              <div className="absolute inset-8 sm:inset-16 pointer-events-none border border-white/20 rounded-3xl flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-white/60 rounded-tl-lg" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-white/60 rounded-tr-lg" />
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-white/60 rounded-bl-lg" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-white/60 rounded-br-lg" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Shutter & Controls Bar */}
      <div className="relative z-30 p-5 sm:p-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        {capturedPhoto ? (
          /* Controls after photo is snapped: Retake vs Use Photo */
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleRetake}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/15 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake</span>
            </button>

            <button
              type="button"
              onClick={handleUsePhoto}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Use Photo</span>
            </button>
          </div>
        ) : (
          /* Live Camera Shutter Controls */
          <div className="max-w-md mx-auto flex items-center justify-between px-4 sm:px-8">
            {/* Secondary Option: Upload from files / gallery */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-1 text-zinc-300 hover:text-white transition-colors cursor-pointer group"
              title="Upload photo from device files instead"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5 text-zinc-200 group-hover:text-white" />
              </div>
              <span className="text-[10px] font-medium text-zinc-400 group-hover:text-zinc-200">Upload</span>
            </button>

            {/* Primary Action: Big Shutter Button */}
            <button
              type="button"
              onClick={handleSnapPhoto}
              disabled={!isStreaming}
              aria-label="Take Photo"
              title="Snap Photo"
              className="w-20 h-20 rounded-full border-4 border-white/80 p-1 flex items-center justify-center bg-white/10 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-2xl"
            >
              <div className="w-full h-full rounded-full bg-white group-hover:scale-95 group-active:scale-90 transition-transform shadow-inner" />
            </button>

            {/* Flip Camera Control */}
            <button
              type="button"
              onClick={handleToggleFacingMode}
              disabled={!isStreaming}
              className="flex flex-col items-center gap-1 text-zinc-300 hover:text-white transition-colors cursor-pointer group disabled:opacity-40 disabled:cursor-not-allowed"
              title="Flip Camera (Front / Rear)"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center group-hover:scale-105 transition-transform">
                <SwitchCamera className="w-5 h-5 text-zinc-200 group-hover:text-white" />
              </div>
              <span className="text-[10px] font-medium text-zinc-400 group-hover:text-zinc-200">Flip</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
