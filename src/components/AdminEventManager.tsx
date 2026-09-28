import { useState, useEffect, useRef, type FC, type ChangeEvent } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  UserCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Loader2, 
  Sparkles,
  Building,
  Save,
  Upload,
  Image as ImageIcon,
  HardDrive,
  Star,
  AlertCircle,
  CalendarCheck
} from 'lucide-react';
import type { CampEvent, EventScheduleItem } from '../types';
import { apiService } from '../services/api';
import { getRegistrationStatus, formatDateShort } from '../lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

export const AdminEventManager: FC = () => {
  const [event, setEvent] = useState<CampEvent | null>(null);
  const [schedules, setSchedules] = useState<EventScheduleItem[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [eventSaveMsg, setEventSaveMsg] = useState<string | null>(null);

  // Event Primary Image upload state (Cloudflare R2)
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const primaryImageInputRef = useRef<HTMLInputElement | null>(null);

  // Edit / Add Schedule Session Dialog state
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [sessionFormError, setSessionFormError] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);

  const [sessionForm, setSessionForm] = useState<Partial<EventScheduleItem>>({
    event_id: 'vlc-2027',
    day_number: 1,
    day_title: 'Arrival & Opening Rally',
    date: '2027-07-21',
    time_start: '14:00',
    time_end: '16:00',
    time_display: '2:00 PM – 4:00 PM',
    title: '',
    description: '',
    location: 'Main Auditorium',
    speaker: '',
    session_type: 'rally',
    sort_order: 1,
  });

  // Event Edit state
  const [eventForm, setEventForm] = useState<Partial<CampEvent>>({});

  const reloadData = async () => {
    try {
      const [eventRes, scheduleRes] = await Promise.all([
        apiService.getEvents('vlc-2027'),
        apiService.getEventSchedule('vlc-2027'),
      ]);

      if (eventRes.active_event) {
        setEvent(eventRes.active_event);
        setEventForm(eventRes.active_event);
      }
      if (scheduleRes.schedules) {
        setSchedules(scheduleRes.schedules);
      }
    } catch (err) {
      console.error('[AdminEventManager] Failed to reload data:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      apiService.getEvents('vlc-2027'),
      apiService.getEventSchedule('vlc-2027'),
    ])
      .then(([eventRes, scheduleRes]) => {
        if (!isMounted) return;
        if (eventRes.active_event) {
          setEvent(eventRes.active_event);
          setEventForm(eventRes.active_event);
        }
        if (scheduleRes.schedules) {
          setSchedules(scheduleRes.schedules);
        }
      })
      .catch((err) => {
        console.error('[AdminEventManager] Failed to load data:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const applyLeadUpPreset = (daysBefore: number) => {
    const eventStart = eventForm.start_date || '2027-07-21';
    const startDateObj = new Date(eventStart);
    if (isNaN(startDateObj.getTime())) return;

    const cutoffDate = new Date(startDateObj.getTime() - daysBefore * 24 * 60 * 60 * 1000);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    const todayStr = new Date().toISOString().split('T')[0];
    let regStart = eventForm.registration_start_date;
    if (!regStart || regStart > cutoffStr) {
      regStart = todayStr < cutoffStr ? todayStr : new Date(cutoffDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }

    setEventForm((prev) => ({
      ...prev,
      registration_start_date: regStart,
      registration_end_date: cutoffStr,
    }));
  };

  const handleOpenRegistrationToday = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const eventStart = eventForm.start_date || '2027-07-21';
    const startDateObj = new Date(eventStart);
    const cutoffDate = new Date(startDateObj.getTime() - 7 * 24 * 60 * 60 * 1000);
    const defaultCutoff = cutoffDate.toISOString().split('T')[0];

    setEventForm((prev) => ({
      ...prev,
      registration_start_date: todayStr,
      registration_end_date: prev.registration_end_date && prev.registration_end_date >= todayStr ? prev.registration_end_date : defaultCutoff,
    }));
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      eventForm.registration_start_date &&
      eventForm.registration_end_date &&
      eventForm.registration_start_date > eventForm.registration_end_date
    ) {
      setEventSaveMsg('Error: Registration open date cannot be later than registration cutoff date.');
      return;
    }

    setIsSavingEvent(true);
    setEventSaveMsg(null);
    try {
      const res = await apiService.updateEvent({
        id: 'vlc-2027',
        ...eventForm,
      });
      if (res.success && res.event) {
        setEvent(res.event);
        setEventForm(res.event);
        setEventSaveMsg('Event details saved successfully!');
        setTimeout(() => setEventSaveMsg(null), 3000);
      } else {
        setEventSaveMsg(res.error || 'Failed to update event.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving event.';
      setEventSaveMsg(msg);
    } finally {
      setIsSavingEvent(false);
    }
  };

  const handlePrimaryImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsUploadingImage(true);
    setImageUploadError(null);
    try {
      const res = await apiService.uploadMedia(file, {
        folder: 'events',
        eventId: event?.id || 'vlc-2027',
        isPrimary: true,
        title: `${eventForm.name || 'VLC 2027'} Primary Banner`,
      });
      if (res.success && res.url) {
        setEventForm((prev) => ({
          ...prev,
          primary_image_url: res.url,
          banner_url: res.url,
        }));
        setEvent((prev) => (prev ? { ...prev, primary_image_url: res.url, banner_url: res.url } : null));
        setEventSaveMsg('Primary event image uploaded to Cloudflare R2 and saved!');
        setTimeout(() => setEventSaveMsg(null), 3500);
      } else {
        setImageUploadError(res.error || 'Failed to upload primary image to Cloudflare R2');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error uploading image to R2';
      setImageUploadError(msg);
    } finally {
      setIsUploadingImage(false);
      if (primaryImageInputRef.current) primaryImageInputRef.current.value = '';
    }
  };

  const handleRemovePrimaryImage = async () => {
    if (!window.confirm('Remove primary image from this event?')) return;
    setEventForm((prev) => ({
      ...prev,
      primary_image_url: '',
      banner_url: '',
    }));
    try {
      await apiService.updateEvent({
        id: event?.id || 'vlc-2027',
        primary_image_url: '',
        banner_url: '',
      });
      setEvent((prev) => (prev ? { ...prev, primary_image_url: '', banner_url: '' } : null));
      setEventSaveMsg('Primary image removed.');
      setTimeout(() => setEventSaveMsg(null), 3000);
    } catch {
      // Ignore
    }
  };

  const handleOpenAddSession = () => {
    const dates = ['2027-07-21', '2027-07-22', '2027-07-23', '2027-07-24'];
    const titles = [
      'Arrival & Opening Rally',
      'Leadership Workshops & Ministry Night',
      'Delegation Challenges & Commissioning',
      'Departure & Send-off'
    ];

    setEditingSessionId(null);
    setSessionForm({
      event_id: 'vlc-2027',
      day_number: selectedDay,
      day_title: titles[selectedDay - 1] || `Day ${selectedDay}`,
      date: dates[selectedDay - 1] || '2027-07-21',
      time_start: '09:00',
      time_end: '10:30',
      time_display: '9:00 AM – 10:30 AM',
      title: '',
      description: '',
      location: 'Main Auditorium',
      speaker: '',
      session_type: 'plenary',
      sort_order: (schedules.filter(s => s.day_number === selectedDay).length + 1) * 10,
    });
    setSessionFormError(null);
    setIsSessionDialogOpen(true);
  };

  const handleOpenEditSession = (session: EventScheduleItem) => {
    setEditingSessionId(session.id);
    setSessionForm({ ...session });
    setSessionFormError(null);
    setIsSessionDialogOpen(true);
  };

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionForm.title?.trim()) {
      setSessionFormError('Session title is required.');
      return;
    }

    setIsSavingSession(true);
    setSessionFormError(null);
    try {
      const payload: Partial<EventScheduleItem> = {
        ...sessionForm,
        id: editingSessionId || undefined,
        event_id: 'vlc-2027',
      };

      const res = await apiService.saveScheduleItem(payload);
      if (res.success && res.schedule) {
        setIsSessionDialogOpen(false);
        await reloadData();
      } else {
        setSessionFormError(res.error || 'Failed to save schedule session.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving session.';
      setSessionFormError(msg);
    } finally {
      setIsSavingSession(false);
    }
  };

  const handleDeleteSession = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete session "${title}"?`)) return;
    try {
      const res = await apiService.deleteScheduleItem(id);
      if (res.success) {
        setSchedules(prev => prev.filter(s => s.id !== id));
      } else {
        alert(res.error || 'Failed to delete session');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete session';
      alert(msg);
    }
  };

  const filteredSessions = schedules
    .filter((s) => s.day_number === selectedDay)
    .sort((a, b) => (a.sort_order - b.sort_order) || a.time_start.localeCompare(b.time_start));

  const regStatus = getRegistrationStatus(eventForm);
  const regDateError =
    eventForm.registration_start_date &&
    eventForm.registration_end_date &&
    eventForm.registration_start_date > eventForm.registration_end_date
      ? 'Registration open date cannot be later than cutoff date.'
      : null;
  const regDateWarning =
    eventForm.start_date &&
    eventForm.registration_end_date &&
    eventForm.registration_end_date > eventForm.start_date
      ? 'Note: Registration cutoff extends past the event opening date. Registration typically closes leading up to the event.'
      : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Card: Event Entity Summary */}
      <Card className="relative overflow-hidden border border-blue-100 bg-gradient-to-r from-blue-900 via-indigo-900 to-zinc-900 text-white shadow-md">
        {/* Background Event Primary Image if available */}
        {(eventForm.primary_image_url || eventForm.banner_url) && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay transition-all"
              style={{ backgroundImage: `url('${eventForm.primary_image_url || eventForm.banner_url}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-indigo-950/90 to-zinc-950/85" />
          </>
        )}
        <CardContent className="relative z-10 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-blue-500 text-white font-mono text-[10px] tracking-wider uppercase">
                  Event Entity: vlc-2027
                </Badge>
                <Badge variant="outline" className="text-zinc-200 border-zinc-600 text-[10px]">
                  {event?.status?.toUpperCase() || 'ACTIVE'}
                </Badge>
                <Badge 
                  className={`text-[10px] gap-1 font-semibold ${
                    regStatus.status === 'open' 
                      ? 'bg-emerald-500/90 text-white border-0' 
                      : regStatus.status === 'upcoming' 
                      ? 'bg-amber-500/90 text-white border-0' 
                      : 'bg-red-500/90 text-white border-0'
                  }`}
                >
                  <Clock className="w-2.5 h-2.5" />
                  {regStatus.badgeText}
                </Badge>
                {(eventForm.primary_image_url || eventForm.banner_url) && (
                  <Badge className="bg-orange-500/80 text-white border-0 text-[10px] gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" /> Primary Image Set
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                {event?.name || 'Vision & Leadership Camp 2027'}
              </h2>
              <p className="text-blue-200 font-medium text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                Theme: {event?.theme || 'Arise & Shine (Isaiah 60:1)'}
              </p>
              <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                {event?.description || 'Biennial National Gathering of Young Leaders & Believers across the Philippines'}
              </p>
            </div>

            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-xs space-y-2 shrink-0 md:min-w-[250px]">
              <div className="flex items-center gap-2 text-zinc-200">
                <Calendar className="w-3.5 h-3.5 text-blue-300" />
                <span>Camp: {event?.start_date || '2027-07-21'} &rarr; {event?.end_date || '2027-07-24'}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200">
                <Clock className="w-3.5 h-3.5 text-blue-300" />
                <span>
                  Registration: {eventForm.registration_start_date ? `${formatDateShort(eventForm.registration_start_date)} &rarr; ${formatDateShort(eventForm.registration_end_date)}` : 'Lead-up window not set'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200">
                <MapPin className="w-3.5 h-3.5 text-blue-300" />
                <span>{event?.venue_name || 'Campgrounds'}, {event?.city || 'Bambang'}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200">
                <Building className="w-3.5 h-3.5 text-blue-300" />
                <span>Target: {event?.target_capacity || 600} Registered Campers</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Left Column Event Metadata Edit | Right Column Dynamic Schedule Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Event Entity Configuration (4 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                Event Metadata
              </CardTitle>
              <CardDescription>
                Configure the primary event dates, venue location, capacity, and primary media.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveEvent} className="space-y-3.5 text-xs">
                {/* Event Primary Image & Banner (Cloudflare R2) */}
                <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-zinc-800 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                      Event Primary Image &amp; Banner
                    </label>
                    {(eventForm.primary_image_url || eventForm.banner_url) && (
                      <Badge className="bg-orange-100 text-orange-700 border border-orange-200 text-[10px] gap-1 py-0">
                        <HardDrive className="w-2.5 h-2.5 text-orange-600" />
                        {(eventForm.primary_image_url || '').includes('/api/media/') ? 'Cloudflare R2' : 'Custom'}
                      </Badge>
                    )}
                  </div>

                  {/* Image Preview & Upload Container */}
                  {(eventForm.primary_image_url || eventForm.banner_url) ? (
                    <div className="space-y-2">
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-200 bg-zinc-900 group">
                        <img 
                          src={eventForm.primary_image_url || eventForm.banner_url} 
                          alt="Event primary preview"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => primaryImageInputRef.current?.click()}
                            className="bg-white/90 hover:bg-white text-zinc-900 text-xs h-7 px-2.5 gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            Replace
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={handleRemovePrimaryImage}
                            className="text-xs h-7 px-2.5 gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-500">
                        <span className="truncate max-w-[200px]" title={eventForm.primary_image_url || eventForm.banner_url}>
                          {eventForm.primary_image_url || eventForm.banner_url}
                        </span>
                        <button
                          type="button"
                          onClick={() => primaryImageInputRef.current?.click()}
                          className="text-blue-600 hover:underline font-medium cursor-pointer"
                        >
                          Change Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => primaryImageInputRef.current?.click()}
                      className="border border-dashed border-zinc-300 hover:border-blue-400 hover:bg-blue-50/40 rounded-xl p-4 text-center cursor-pointer transition-colors space-y-1.5"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                        {isUploadingImage ? (
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-zinc-800">
                        {isUploadingImage ? 'Uploading to Cloudflare R2...' : 'Upload Primary Image to R2'}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        High-res hero image stored in <code className="bg-zinc-200/60 px-1 py-0.2 rounded font-mono">vlc2027-media</code>
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={primaryImageInputRef}
                    onChange={handlePrimaryImageUpload}
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingImage}
                  />

                  {/* Manual URL Input */}
                  <div className="pt-1">
                    <Input
                      type="text"
                      placeholder="Or paste direct image URL (https://...)"
                      value={eventForm.primary_image_url || eventForm.banner_url || ''}
                      onChange={(e) => setEventForm({
                        ...eventForm,
                        primary_image_url: e.target.value,
                        banner_url: e.target.value,
                      })}
                      className="h-8 text-[11px] bg-white"
                    />
                  </div>

                  {imageUploadError && (
                    <p className="text-red-600 text-[11px]">{imageUploadError}</p>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Event Name</label>
                  <Input 
                    type="text" 
                    value={eventForm.name || ''} 
                    onChange={e => setEventForm({ ...eventForm, name: e.target.value })} 
                    className="h-9 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Theme &amp; Scripture</label>
                  <Input 
                    type="text" 
                    value={eventForm.theme || ''} 
                    onChange={e => setEventForm({ ...eventForm, theme: e.target.value })} 
                    className="h-9 text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Start Date</label>
                    <Input 
                      type="date" 
                      value={eventForm.start_date || '2027-07-21'} 
                      onChange={e => setEventForm({ ...eventForm, start_date: e.target.value })} 
                      className="h-9 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">End Date</label>
                    <Input 
                      type="date" 
                      value={eventForm.end_date || '2027-07-24'} 
                      onChange={e => setEventForm({ ...eventForm, end_date: e.target.value })} 
                      className="h-9 text-xs"
                      required
                    />
                  </div>
                </div>

                {/* Registration Allowed Dates leading up to actual event */}
                <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-zinc-900 flex items-center gap-1.5 text-xs">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      Registration Allowed Dates (Lead-up Window)
                    </label>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      regStatus.status === 'open'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : regStatus.status === 'upcoming'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        regStatus.status === 'open' ? 'bg-emerald-500' : regStatus.status === 'upcoming' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      {regStatus.badgeText}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-600 leading-tight">
                    Set the dates when delegate registrations are permitted leading up to camp opening day ({formatDateShort(eventForm.start_date)}).
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">
                        Allowed From (Open Date)
                      </label>
                      <Input
                        type="date"
                        value={eventForm.registration_start_date || ''}
                        onChange={(e) => setEventForm({ ...eventForm, registration_start_date: e.target.value })}
                        className="h-8 text-xs bg-white"
                      />
                      <span className="text-[10px] text-zinc-500">When signups begin</span>
                    </div>
                    <div>
                      <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">
                        Allowed Until (Cutoff Deadline)
                      </label>
                      <Input
                        type="date"
                        value={eventForm.registration_end_date || ''}
                        onChange={(e) => setEventForm({ ...eventForm, registration_end_date: e.target.value })}
                        className="h-8 text-xs bg-white"
                      />
                      <span className="text-[10px] text-zinc-500">Cutoff leading up to camp</span>
                    </div>
                  </div>

                  {/* Lead-up Presets */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                      Lead-Up Presets (Relative to Event Start):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => applyLeadUpPreset(7)}
                        className="text-[10px] px-2 py-1 bg-white hover:bg-blue-100 border border-blue-200 rounded-md text-blue-700 font-medium transition-colors cursor-pointer"
                        title="Registration closes 7 days before camp begins"
                      >
                        Close 7 Days Before
                      </button>
                      <button
                        type="button"
                        onClick={() => applyLeadUpPreset(3)}
                        className="text-[10px] px-2 py-1 bg-white hover:bg-blue-100 border border-blue-200 rounded-md text-blue-700 font-medium transition-colors cursor-pointer"
                        title="Registration closes 3 days before camp begins"
                      >
                        Close 3 Days Before
                      </button>
                      <button
                        type="button"
                        onClick={() => applyLeadUpPreset(1)}
                        className="text-[10px] px-2 py-1 bg-white hover:bg-blue-100 border border-blue-200 rounded-md text-blue-700 font-medium transition-colors cursor-pointer"
                        title="Registration closes 1 day before camp begins"
                      >
                        Close 1 Day Before
                      </button>
                      <button
                        type="button"
                        onClick={() => applyLeadUpPreset(0)}
                        className="text-[10px] px-2 py-1 bg-white hover:bg-blue-100 border border-blue-200 rounded-md text-blue-700 font-medium transition-colors cursor-pointer"
                        title="Registration allowed until day of camp opening"
                      >
                        Close on Camp Day
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenRegistrationToday}
                        className="text-[10px] px-2 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md text-emerald-800 font-medium transition-colors cursor-pointer"
                        title="Set registration start date to today"
                      >
                        Open Today
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Alert Messages */}
                  {regDateError && (
                    <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{regDateError}</span>
                    </div>
                  )}
                  {regDateWarning && !regDateError && (
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{regDateWarning}</span>
                    </div>
                  )}
                  {!regDateError && !regDateWarning && (
                    <div className="text-[11px] text-zinc-600 bg-white/70 p-2 rounded-lg border border-blue-100 flex items-center gap-1.5">
                      <CalendarCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{regStatus.description}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Venue / Grounds</label>
                  <Input 
                    type="text" 
                    value={eventForm.venue_name || ''} 
                    onChange={e => setEventForm({ ...eventForm, venue_name: e.target.value })} 
                    className="h-9 text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">City / Municipality</label>
                    <Input 
                      type="text" 
                      value={eventForm.city || ''} 
                      onChange={e => setEventForm({ ...eventForm, city: e.target.value })} 
                      className="h-9 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Province</label>
                    <Input 
                      type="text" 
                      value={eventForm.province || ''} 
                      onChange={e => setEventForm({ ...eventForm, province: e.target.value })} 
                      className="h-9 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Target Capacity</label>
                    <Input 
                      type="number" 
                      value={eventForm.target_capacity || 600} 
                      onChange={e => setEventForm({ ...eventForm, target_capacity: Number(e.target.value) })} 
                      className="h-9 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Event Status</label>
                    <select
                      value={eventForm.status || 'active'}
                      onChange={e => setEventForm({ ...eventForm, status: e.target.value as CampEvent['status'] })}
                      className="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs"
                    >
                      <option value="active">Active (Registration Open)</option>
                      <option value="upcoming">Upcoming (Planning)</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Description / Brief</label>
                  <textarea
                    rows={2}
                    value={eventForm.description || ''}
                    onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full rounded-md border border-zinc-200 p-2 text-xs"
                  />
                </div>

                {eventSaveMsg && (
                  <div className={`p-2.5 rounded-lg text-xs font-medium ${eventSaveMsg.includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {eventSaveMsg}
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isSavingEvent}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 gap-1.5"
                >
                  {isSavingEvent ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Event Details
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Dynamic Event Schedule Manager (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Camp Schedule Sessions
                </CardTitle>
                <CardDescription>
                  Sessions tied to VLC 2027 and displayed dynamically to registered campers.
                </CardDescription>
              </div>

              <Button
                size="sm"
                onClick={handleOpenAddSession}
                className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs h-8 gap-1 rounded-xl px-3"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Session
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Day Selector Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[1, 2, 3, 4].map((dayNum) => {
                  const dates = ['July 21', 'July 22', 'July 23', 'July 24'];
                  const isSelected = selectedDay === dayNum;
                  const count = schedules.filter(s => s.day_number === dayNum).length;

                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => setSelectedDay(dayNum)}
                      className={`px-3 py-1.5 rounded-xl font-medium text-xs transition-colors shrink-0 flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
                      }`}
                    >
                      <span>Day {dayNum} ({dates[dayNum - 1]})</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-blue-500 text-white' : 'bg-zinc-200 text-zinc-700'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sessions List */}
              <div className="space-y-2.5">
                {isLoading ? (
                  <div className="py-12 text-center text-zinc-500 text-xs flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span>Loading schedule sessions...</span>
                  </div>
                ) : filteredSessions.length > 0 ? (
                  filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-3.5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-zinc-900 text-xs sm:text-sm">
                            {session.title}
                          </span>
                          <Badge variant="outline" className="text-[10px] capitalize font-medium py-0 px-2 bg-zinc-50 text-zinc-700">
                            {session.session_type || 'General'}
                          </Badge>
                        </div>

                        {session.description && (
                          <p className="text-[11px] text-zinc-500 line-clamp-2 max-w-xl">
                            {session.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500 pt-1">
                          <span className="flex items-center gap-1 font-mono font-medium text-zinc-800">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            {session.time_display || `${session.time_start} - ${session.time_end}`}
                          </span>
                          {session.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                              {session.location}
                            </span>
                          )}
                          {session.speaker && (
                            <span className="flex items-center gap-1 text-blue-700 font-medium">
                              <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                              {session.speaker}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditSession(session)}
                          className="h-8 px-2.5 text-xs text-zinc-600 hover:text-zinc-900"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSession(session.id, session.title)}
                          className="h-8 px-2.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center rounded-xl border border-dashed border-zinc-200 p-6 space-y-2">
                    <p className="text-zinc-600 text-xs font-medium">No sessions scheduled for Day {selectedDay} yet.</p>
                    <Button 
                      size="sm" 
                      onClick={handleOpenAddSession}
                      variant="outline" 
                      className="text-xs gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add first session
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Modal: Add / Edit Session Dialog */}
      <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingSessionId ? 'Edit Schedule Session' : 'Add New Schedule Session'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure session timings, speaker, and location for VLC 2027.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveSession} className="space-y-3.5 pt-2 text-xs">
            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Session Title</label>
              <Input
                type="text"
                placeholder="e.g. Evening Worship & Opening Keynote"
                value={sessionForm.title || ''}
                onChange={e => setSessionForm({ ...sessionForm, title: e.target.value })}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Camp Day</label>
                <select
                  value={sessionForm.day_number || 1}
                  onChange={e => {
                    const day = Number(e.target.value);
                    const dates = ['2027-07-21', '2027-07-22', '2027-07-23', '2027-07-24'];
                    setSessionForm({
                      ...sessionForm,
                      day_number: day,
                      date: dates[day - 1] || '2027-07-21',
                    });
                  }}
                  className="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs"
                >
                  <option value={1}>Day 1 (July 21)</option>
                  <option value={2}>Day 2 (July 22)</option>
                  <option value={3}>Day 3 (July 23)</option>
                  <option value={4}>Day 4 (July 24)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Session Type</label>
                <select
                  value={sessionForm.session_type || 'general'}
                  onChange={e => setSessionForm({ ...sessionForm, session_type: e.target.value as EventScheduleItem['session_type'] })}
                  className="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs"
                >
                  <option value="rally">Rally / Revival</option>
                  <option value="plenary">Plenary / Keynote</option>
                  <option value="workshop">Ministry Workshop</option>
                  <option value="fellowship">Fellowship / Team Building</option>
                  <option value="sports">Sports & Recreation</option>
                  <option value="meal">Meal / Break</option>
                  <option value="general">General Session</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Time Display</label>
                <Input
                  type="text"
                  placeholder="e.g. 7:00 PM – 9:30 PM"
                  value={sessionForm.time_display || ''}
                  onChange={e => setSessionForm({ ...sessionForm, time_display: e.target.value })}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Speaker / Facilitator</label>
                <Input
                  type="text"
                  placeholder="e.g. Pastor Alexius"
                  value={sessionForm.speaker || ''}
                  onChange={e => setSessionForm({ ...sessionForm, speaker: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Location / Venue</label>
              <Input
                type="text"
                placeholder="e.g. Main Auditorium / Campgrounds"
                value={sessionForm.location || ''}
                onChange={e => setSessionForm({ ...sessionForm, location: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Session Description / Notes</label>
              <textarea
                rows={2}
                placeholder="Brief summary or instructions for delegates..."
                value={sessionForm.description || ''}
                onChange={e => setSessionForm({ ...sessionForm, description: e.target.value })}
                className="w-full rounded-md border border-zinc-200 p-2 text-xs"
              />
            </div>

            {sessionFormError && (
              <p className="text-red-600 text-xs font-medium">{sessionFormError}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSessionDialogOpen(false)}
                className="text-xs h-9 px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSavingSession}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 px-4 gap-1.5"
              >
                {isSavingSession ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                {editingSessionId ? 'Update Session' : 'Save Session'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
