import { useState, useEffect, useRef, type FC, type ChangeEvent } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Trash2, 
  Check, 
  Loader2, 
  Copy, 
  Play, 
  Film, 
  HardDrive, 
  Star,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import type { MediaItem, CampEvent } from '../types';
import { apiService } from '../services/api';
import { getBaseUrl } from '../lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface AdminMediaManagerProps {
  currentEvent?: CampEvent | null;
  onPrimaryImageUpdated?: (newUrl: string) => void;
}

export const AdminMediaManager: FC<AdminMediaManagerProps> = ({
  currentEvent,
  onPrimaryImageUpdated,
}) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Upload options
  const [setAsPrimaryOnUpload, setSetAsPrimaryOnUpload] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Preview modal
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);

  const loadMedia = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.getMedia({
        type: filterType === 'all' ? undefined : filterType,
        eventId: currentEvent?.id || 'vlc-2027',
      });
      if (res.success) {
        setMediaList(res.items);
      }
    } catch (err) {
      console.error('[AdminMediaManager] Failed to load media:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isCurrent = true;
    apiService.getMedia({
      type: filterType === 'all' ? undefined : filterType,
      eventId: currentEvent?.id || 'vlc-2027',
    })
      .then((res) => {
        if (!isCurrent) return;
        if (res.success) {
          setMediaList(res.items);
        }
      })
      .catch((err) => {
        console.error('[AdminMediaManager] Failed to load media:', err);
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [filterType, currentEvent?.id]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const res = await apiService.uploadMedia(file, {
        folder: file.type.startsWith('video/') ? 'videos' : 'events',
        eventId: currentEvent?.id || 'vlc-2027',
        title: customTitle.trim() || file.name,
        isPrimary: setAsPrimaryOnUpload,
      });

      if (res.success && res.media) {
        setUploadSuccess(`Uploaded "${file.name}" to Cloudflare R2 successfully!`);
        if (setAsPrimaryOnUpload && res.url && onPrimaryImageUpdated) {
          onPrimaryImageUpdated(res.url);
        }
        setCustomTitle('');
        setSetAsPrimaryOnUpload(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        await loadMedia();
        setTimeout(() => setUploadSuccess(null), 4000);
      } else {
        setUploadError(res.error || 'Failed to upload file to Cloudflare R2');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error uploading media';
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetPrimary = async (item: MediaItem) => {
    try {
      const res = await apiService.setEventPrimaryImage(
        currentEvent?.id || 'vlc-2027',
        item.url,
        item.id
      );
      if (res.success) {
        if (onPrimaryImageUpdated) {
          onPrimaryImageUpdated(item.url);
        }
        await loadMedia();
      } else {
        alert(res.error || 'Failed to set primary image');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update primary image';
      alert(msg);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!window.confirm(`Are you sure you want to delete "${item.file_name}" from Cloudflare R2?`)) return;
    try {
      const res = await apiService.deleteMedia(item.id || item.r2_key);
      if (res.success) {
        setMediaList((prev) => prev.filter((m) => m.id !== item.id && m.r2_key !== item.r2_key));
      } else {
        alert(res.error || 'Failed to delete file');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete file';
      alert(msg);
    }
  };

  const handleCopyUrl = (url: string, key: string) => {
    const fullUrl = url.startsWith('http') ? url : `${getBaseUrl()}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const activePrimaryUrl = currentEvent?.primary_image_url || currentEvent?.banner_url;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Cloudflare R2 Header Card */}
      <Card className="border border-orange-200/60 bg-gradient-to-r from-orange-950/90 via-zinc-900 to-zinc-950 text-white shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-500 text-white font-mono text-[10px] tracking-wider uppercase">
                  Cloudflare R2 Storage
                </Badge>
                <Badge variant="outline" className="text-orange-200 border-orange-400/40 text-[10px]">
                  Bucket: vlc2027-media
                </Badge>
                <Badge variant="outline" className="text-zinc-300 border-zinc-700 text-[10px]">
                  Standard Storage
                </Badge>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-orange-400" />
                Media &amp; Asset Vault
              </h2>
              <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                High-performance object storage powered by Cloudflare R2 with zero egress fees. Upload camp keynote videos, highlight clips, atmospheric photography, and primary event banners.
              </p>
            </div>

            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-xs space-y-2 shrink-0 md:min-w-[240px]">
              <div className="flex items-center justify-between text-zinc-200">
                <span className="text-zinc-400">Total Uploads:</span>
                <span className="font-bold text-white">{mediaList.length} files</span>
              </div>
              <div className="flex items-center justify-between text-zinc-200">
                <span className="text-zinc-400">Target Event:</span>
                <span className="font-mono text-orange-300">{currentEvent?.slug || 'vlc-2027'}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-200">
                <span className="text-zinc-400">Video Streaming:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> HTTP Range Ready
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Zone Card */}
      <Card className="border border-zinc-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-600" />
            Upload Images &amp; Videos to Cloudflare R2
          </CardTitle>
          <CardDescription className="text-xs">
            Directly upload media to the <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">vlc2027-media</code> R2 bucket. Supported formats include JPEG, PNG, WebP, GIF, SVG, MP4, WebM, and MOV.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Custom title input */}
            <div className="md:col-span-6">
              <label className="text-xs font-semibold text-zinc-700 block mb-1">
                Asset Title / Description (Optional)
              </label>
              <Input
                type="text"
                placeholder="e.g. VLC 2027 Main Stage Banner"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="h-9 text-xs"
                disabled={isUploading}
              />
            </div>

            {/* Checkbox: set as primary image */}
            <div className="md:col-span-6 flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="setPrimary"
                checked={setAsPrimaryOnUpload}
                onChange={(e) => setSetAsPrimaryOnUpload(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                disabled={isUploading}
              />
              <label htmlFor="setPrimary" className="text-xs text-zinc-700 font-medium cursor-pointer flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Set as Event Primary Image immediately upon upload
              </label>
            </div>
          </div>

          {/* Drag & Drop File Input Box */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all rounded-2xl p-6 text-center cursor-pointer space-y-2 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,video/*"
              className="hidden"
              disabled={isUploading}
            />
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-800">
                {isUploading ? 'Streaming file to Cloudflare R2 bucket...' : 'Click to select or drag & drop files here'}
              </p>
              <p className="text-[11px] text-zinc-500">
                Images (PNG, JPG, WebP) or Videos (MP4, WebM, MOV) up to 100MB
              </p>
            </div>
          </div>

          {/* Feedback messages */}
          {uploadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {uploadError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media Catalog & Filter Toolbar */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Film className="w-4 h-4 text-orange-600" />
              Stored Assets in R2
            </CardTitle>
            <CardDescription className="text-xs">
              Manage all images and video clips stored in Cloudflare R2 for VLC 2027.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Pills */}
            <div className="bg-zinc-100 p-0.5 rounded-xl flex items-center text-xs">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  filterType === 'all' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                All ({mediaList.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('image')}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  filterType === 'image' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <ImageIcon className="w-3 h-3 text-blue-500" />
                Images
              </button>
              <button
                type="button"
                onClick={() => setFilterType('video')}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  filterType === 'video' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <VideoIcon className="w-3 h-3 text-rose-500" />
                Videos
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={loadMedia}
              className="h-8 px-2.5 text-xs text-zinc-600"
              title="Refresh list"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="py-16 text-center text-xs text-zinc-500 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
              <span>Querying Cloudflare R2 bucket...</span>
            </div>
          ) : mediaList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaList.map((item) => {
                const isPrimary = activePrimaryUrl && (activePrimaryUrl === item.url || activePrimaryUrl.includes(item.r2_key));
                const isCopied = copiedKey === item.r2_key;

                return (
                  <div
                    key={item.id || item.r2_key}
                    className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between bg-white shadow-xs hover:shadow-md ${
                      isPrimary ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-zinc-200'
                    }`}
                  >
                    {/* Media Preview Box */}
                    <div 
                      className="relative bg-zinc-900 aspect-video flex items-center justify-center overflow-hidden cursor-pointer group"
                      onClick={() => setPreviewMedia(item)}
                    >
                      {item.media_type === 'video' ? (
                        <>
                          <video
                            src={item.url}
                            preload="metadata"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-80"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-white/90 text-zinc-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            </div>
                          </div>
                          <Badge className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] gap-1 px-1.5 py-0.5">
                            <VideoIcon className="w-3 h-3" /> Video
                          </Badge>
                        </>
                      ) : (
                        <>
                          <img
                            src={item.url}
                            alt={item.title || item.file_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                          <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] gap-1 px-1.5 py-0.5">
                            <ImageIcon className="w-3 h-3" /> Image
                          </Badge>
                        </>
                      )}

                      {isPrimary && (
                        <Badge className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] gap-1 px-2 py-0.5 shadow-sm font-semibold">
                          <Star className="w-3 h-3 fill-current" /> Primary Image
                        </Badge>
                      )}

                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                        {formatFileSize(item.file_size)}
                      </div>
                    </div>

                    {/* Meta & Actions */}
                    <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-zinc-900 truncate" title={item.title || item.file_name}>
                          {item.title || item.file_name}
                        </h4>
                        <p className="text-[10px] font-mono text-zinc-400 truncate mt-0.5" title={item.r2_key}>
                          r2://{item.r2_key}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1">
                          {/* Copy URL */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyUrl(item.url, item.r2_key)}
                            className="h-7 px-2 text-[11px] text-zinc-600 hover:text-zinc-900 gap-1"
                            title="Copy served URL"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{isCopied ? 'Copied' : 'Copy'}</span>
                          </Button>

                          {/* Set as Primary Image (if Image) */}
                          {item.media_type === 'image' && !isPrimary && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetPrimary(item)}
                              className="h-7 px-2 text-[11px] text-amber-700 border-amber-300 hover:bg-amber-50 gap-1"
                            >
                              <Star className="w-3 h-3" />
                              <span>Set Primary</span>
                            </Button>
                          )}
                        </div>

                        {/* Delete from R2 */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item)}
                          className="h-7 px-2 text-[11px] text-red-600 hover:bg-red-50 hover:text-red-700"
                          title="Delete from R2"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center rounded-2xl border border-dashed border-zinc-200 p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                <HardDrive className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-zinc-800 text-sm font-semibold">No media stored yet in Cloudflare R2</p>
                <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                  Upload the official VLC 2027 primary banner, keynote videos, or delegate photo assets above.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs gap-1.5 mt-2"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload First Asset
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={Boolean(previewMedia)} onOpenChange={(open) => !open && setPreviewMedia(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              {previewMedia?.media_type === 'video' ? (
                <VideoIcon className="w-4 h-4 text-rose-600" />
              ) : (
                <ImageIcon className="w-4 h-4 text-blue-600" />
              )}
              {previewMedia?.title || previewMedia?.file_name}
            </DialogTitle>
            <DialogDescription className="text-xs font-mono text-zinc-500">
              r2://{previewMedia?.r2_key} &bull; {formatFileSize(previewMedia?.file_size || 0)}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-4">
            <div className="rounded-xl overflow-hidden bg-black flex items-center justify-center max-h-[460px]">
              {previewMedia?.media_type === 'video' ? (
                <video
                  src={previewMedia.url}
                  controls
                  autoPlay
                  className="w-full max-h-[460px] object-contain"
                />
              ) : (
                <img
                  src={previewMedia?.url}
                  alt={previewMedia?.title || ''}
                  className="w-full max-h-[460px] object-contain"
                />
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs">
              <span className="text-zinc-500">
                Uploaded: {previewMedia?.created_at ? new Date(previewMedia.created_at).toLocaleDateString() : 'Recent'}
              </span>

              <div className="flex items-center gap-2">
                {previewMedia?.media_type === 'image' && (
                  <Button
                    size="sm"
                    onClick={() => {
                      if (previewMedia) handleSetPrimary(previewMedia);
                      setPreviewMedia(null);
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-8 gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    Set as Event Primary Image
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMedia(null)}
                  className="text-xs h-8"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
