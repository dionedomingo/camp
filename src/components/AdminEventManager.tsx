import { useState, useEffect, type FC } from 'react';
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
  Save
} from 'lucide-react';
import type { CampEvent, EventScheduleItem } from '../types';
import { apiService } from '../services/api';
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

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Card: Event Entity Summary */}
      <Card className="border border-blue-100 bg-gradient-to-r from-blue-900 via-indigo-900 to-zinc-900 text-white shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500 text-white font-mono text-[10px] tracking-wider uppercase">
                  Event Entity: vlc-2027
                </Badge>
                <Badge variant="outline" className="text-zinc-200 border-zinc-600 text-[10px]">
                  {event?.status?.toUpperCase() || 'ACTIVE'}
                </Badge>
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

            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-xs space-y-2 shrink-0 md:min-w-[240px]">
              <div className="flex items-center gap-2 text-zinc-200">
                <Calendar className="w-3.5 h-3.5 text-blue-300" />
                <span>{event?.start_date || '2027-07-21'} &rarr; {event?.end_date || '2027-07-24'}</span>
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
                Configure the primary event dates, venue location, and capacity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveEvent} className="space-y-3.5 text-xs">
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
