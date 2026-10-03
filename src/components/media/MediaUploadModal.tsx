import { useState, useRef, useEffect, type FC } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Camera
} from 'lucide-react';
import type { CamperRegistration, CommunityPost, CommunityStory } from '../../types';
import { apiService } from '../../services/api';
import { FullScreenCamera } from './FullScreenCamera';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCamper: CamperRegistration | null;
  defaultType?: 'post' | 'story';
  initialLaunchCamera?: boolean;
  onPostCreated?: (post: CommunityPost) => void;
  onStoryCreated?: (story: CommunityStory) => void;
}

export const MediaUploadModal: FC<MediaUploadModalProps> = ({
  isOpen,
  onClose,
  currentCamper,
  defaultType = 'post',
  initialLaunchCamera = false,
  onPostCreated,
  onStoryCreated,
}) => {
  const [mediaType, setMediaType] = useState<'post' | 'story'>(defaultType);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploadStep, setUploadStep] = useState<'idle' | 'presigning' | 'uploading' | 'confirming' | 'done'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFullScreenCameraOpen, setIsFullScreenCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && initialLaunchCamera && !selectedFile) {
      setIsFullScreenCameraOpen(true);
    }
  }, [isOpen, initialLaunchCamera]);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    setErrorMessage(null);

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('Image size exceeds the 10MB limit. Please select a smaller photo.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCaption('');
    setUploadStep('idle');
    setErrorMessage(null);
    setIsFullScreenCameraOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    if (uploadStep === 'presigning' || uploadStep === 'uploading' || uploadStep === 'confirming') {
      if (!confirm('Upload is in progress. Are you sure you want to cancel?')) return;
    }
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCamper?.id) {
      setErrorMessage('You must be signed in with your Camp Pass to upload media.');
      return;
    }

    if (!selectedFile) {
      setErrorMessage('Please select an image to upload.');
      return;
    }

    setErrorMessage(null);

    try {
      // 1. Step 1: Request pre-signed R2 PUT URL from backend
      setUploadStep('presigning');
      const presignRes = await apiService.presignMediaUpload({
        camper_id: currentCamper.id,
        file_name: selectedFile.name,
        file_type: selectedFile.type,
        file_size: selectedFile.size,
        type: mediaType,
      });

      if (!presignRes.success || !presignRes.upload_url) {
        throw new Error(presignRes.error || 'Failed to generate pre-signed upload URL');
      }

      // 2. Step 2: Client uploads raw image binary directly to Cloudflare R2
      setUploadStep('uploading');
      const uploadRes = await apiService.uploadDirectToPresignedUrl(
        presignRes.upload_url,
        selectedFile,
        selectedFile.type
      );

      if (!uploadRes.success) {
        throw new Error(uploadRes.error || 'Direct upload to Cloudflare R2 failed');
      }

      // 3. Step 3: Call backend confirmation endpoint to commit the database record
      setUploadStep('confirming');
      if (mediaType === 'post') {
        const postRes = await apiService.createPost({
          camper_id: currentCamper.id,
          media_url: presignRes.media_url,
          caption: caption.trim() || undefined,
        });

        if (!postRes.success || !postRes.post) {
          throw new Error(postRes.error || 'Failed to save post in database');
        }

        setUploadStep('done');
        if (onPostCreated) onPostCreated(postRes.post);
      } else {
        const storyRes = await apiService.createStory({
          camper_id: currentCamper.id,
          media_url: presignRes.media_url,
          caption: caption.trim() || undefined,
        });

        if (!storyRes.success || !storyRes.story) {
          throw new Error(storyRes.error || 'Failed to save highlight story in database');
        }

        setUploadStep('done');
        if (onStoryCreated) onStoryCreated(storyRes.story);
      }

      setTimeout(() => {
        resetForm();
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('[Upload Error]', err);
      setErrorMessage(err.message || 'Media upload failed');
      setUploadStep('idle');
    }
  };

  const isSubmitting = uploadStep !== 'idle' && uploadStep !== 'done';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="absolute inset-0 -z-10" onClick={handleClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200 text-left">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0b57d0] flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 leading-tight">
                {mediaType === 'post' ? 'Create New Post' : 'Post Vertical Story Highlight'}
              </h3>
              <p className="text-[11px] text-zinc-500">
                Direct Cloudflare R2 Upload Flow
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Format Selector: Post vs Story */}
          <div className="grid grid-cols-2 gap-2 bg-zinc-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setMediaType('post')}
              disabled={isSubmitting}
              className={`tap-pill py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mediaType === 'post'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Standard Post</span>
            </button>

            <button
              type="button"
              onClick={() => setMediaType('story')}
              disabled={isSubmitting}
              className={`tap-pill py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mediaType === 'story'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Vertical Story Highlight</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Media Dropzone / Preview */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={isSubmitting}
            className="hidden"
          />

          {previewUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-950 flex items-center justify-center group max-h-[300px]">
              <img
                src={previewUrl}
                alt="Upload preview"
                className={`w-full object-contain ${mediaType === 'story' ? 'max-h-[300px]' : 'max-h-[260px]'}`}
              />
              {!isSubmitting && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 sm:gap-3 p-2">
                  <button
                    type="button"
                    onClick={() => setIsFullScreenCameraOpen(true)}
                    className="tap-pill px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Snap Again</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="tap-pill px-3 py-1.5 bg-white/90 hover:bg-white text-zinc-900 text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change File</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="tap-pill px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* PRIMARY OPTION: Full-Screen Camera Snap */}
              <button
                type="button"
                onClick={() => setIsFullScreenCameraOpen(true)}
                className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 flex items-center justify-between transition-all cursor-pointer group hover:scale-[1.01] active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-transform shrink-0">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-sm block leading-tight">
                      Take Photo with Camera
                    </span>
                    <span className="text-xs text-blue-100 font-normal mt-0.5 block">
                      Launch full-screen camera to capture camp right now
                    </span>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-white/20 text-xs font-bold shrink-0 hidden xs:inline-flex items-center gap-1">
                  <span>Open Camera</span>
                  <span className="text-sm">→</span>
                </div>
              </button>

              {/* SECONDARY OPTION: Device File Upload */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-200 hover:border-zinc-300 bg-zinc-50/70 hover:bg-zinc-100/70 rounded-2xl p-3.5 sm:p-4 flex items-center justify-center gap-3 text-center cursor-pointer transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 text-zinc-500 flex items-center justify-center shrink-0 shadow-2xs">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-left min-w-0">
                  <p className="font-semibold text-xs text-zinc-700 leading-tight">
                    Or upload from device / gallery
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                    Click to browse files or drag &amp; drop (JPEG, PNG, WebP up to 10MB)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Caption Input */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Caption {mediaType === 'story' ? '(Optional)' : ''}
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={isSubmitting}
              rows={2}
              maxLength={500}
              placeholder={
                mediaType === 'story'
                  ? 'Add a quick highlight caption or verse...'
                  : 'Share what happened at camp, prayer request, or encouragement...'
              }
              className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-zinc-900 placeholder-zinc-400 transition-all resize-none"
            />
            <div className="flex justify-end text-[10px] text-zinc-400 mt-0.5">
              <span>{caption.length}/500</span>
            </div>
          </div>

          {/* Step Progress Display during upload */}
          {isSubmitting && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-xs flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-blue-900">
                  {uploadStep === 'presigning' && 'Generating secure pre-signed R2 upload key...'}
                  {uploadStep === 'uploading' && 'Streaming directly to Cloudflare R2...'}
                  {uploadStep === 'confirming' && 'Confirming media database record...'}
                </p>
                <p className="text-[11px] text-blue-700">
                  Bypassing backend server binaries for ultra-fast storage
                </p>
              </div>
            </div>
          )}

          {uploadStep === 'done' && (
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs flex items-center gap-3 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-bold">
                {mediaType === 'post' ? 'Post published to feed!' : 'Highlight story published!'}
              </span>
            </div>
          )}

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="tap-pill px-4 py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isSubmitting || uploadStep === 'done'}
              className="tap-pill px-5 py-2.5 rounded-xl bg-[#0b57d0] hover:bg-[#0842a0] disabled:bg-zinc-200 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Publish {mediaType === 'post' ? 'Post' : 'Story'}</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Full-Screen Camera Snap Overlay */}
      <FullScreenCamera
        isOpen={isFullScreenCameraOpen}
        onClose={() => setIsFullScreenCameraOpen(false)}
        onCapture={(file) => {
          handleFileSelect(file);
          setIsFullScreenCameraOpen(false);
        }}
        onUploadSelect={(file) => {
          handleFileSelect(file);
          setIsFullScreenCameraOpen(false);
        }}
      />
    </div>
  );
};
