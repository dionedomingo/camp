export function cn(...inputs: (string | undefined | null | false | Record<string, boolean>)[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'object') {
      for (const [key, val] of Object.entries(input)) {
        if (val) classes.push(key);
      }
    }
  }
  return classes.join(' ');
}

/**
 * Format an ISO date string (YYYY-MM-DD) into readable format, e.g. "July 21, 2027"
 */
export function formatDateReadable(dateStr?: string | null): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format an ISO date string (YYYY-MM-DD) into short format, e.g. "Jul 21"
 */
export function formatDateShort(dateStr?: string | null): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format an event start and end date range, e.g. "July 21 – 24, 2027"
 */
export function formatEventDateRange(startDateStr?: string | null, endDateStr?: string | null): string {
  if (!startDateStr) return '';
  if (!endDateStr || startDateStr === endDateStr) return formatDateReadable(startDateStr);

  const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
  const [eYear, eMonth, eDay] = endDateStr.split('-').map(Number);

  if (!sYear || !sMonth || !sDay || !eYear || !eMonth || !eDay) {
    return `${startDateStr} to ${endDateStr}`;
  }

  const sDate = new Date(sYear, sMonth - 1, sDay);
  const eDate = new Date(eYear, eMonth - 1, eDay);

  const sMonthName = sDate.toLocaleDateString('en-US', { month: 'long' });
  const eMonthName = eDate.toLocaleDateString('en-US', { month: 'long' });

  if (sYear === eYear && sMonth === eMonth) {
    return `${sMonthName} ${sDay} – ${eDay}, ${sYear}`;
  }

  if (sYear === eYear) {
    return `${sMonthName} ${sDay} – ${eMonthName} ${eDay}, ${sYear}`;
  }

  return `${sMonthName} ${sDay}, ${sYear} – ${eMonthName} ${eDay}, ${eYear}`;
}

export interface RegistrationStatusInfo {
  status: 'open' | 'upcoming' | 'closed';
  isAllowed: boolean;
  label: string;
  badgeText: string;
  description: string;
  daysUntilOpen: number;
  daysUntilClose: number;
  daysBeforeEventCutoff: number;
}

/**
 * Determine registration allowed status, countdowns, and labels for an event
 */
export function getRegistrationStatus(
  event?: {
    status?: string;
    start_date?: string;
    end_date?: string;
    registration_start_date?: string | null;
    registration_end_date?: string | null;
  } | null,
  referenceDateStr?: string
): RegistrationStatusInfo {
  const todayStr = referenceDateStr || new Date().toISOString().split('T')[0];

  if (!event) {
    return {
      status: 'open',
      isAllowed: true,
      label: 'Registration Open',
      badgeText: 'Registration Open',
      description: 'Registration is currently open for delegates.',
      daysUntilOpen: 0,
      daysUntilClose: 0,
      daysBeforeEventCutoff: 0,
    };
  }

  if (event.status === 'completed' || event.status === 'archived') {
    return {
      status: 'closed',
      isAllowed: false,
      label: 'Registration Closed',
      badgeText: 'Event Concluded',
      description: 'This camp gathering has already taken place or has concluded.',
      daysUntilOpen: 0,
      daysUntilClose: 0,
      daysBeforeEventCutoff: 0,
    };
  }

  const startDate = event.registration_start_date;
  const endDate = event.registration_end_date;
  const eventStartDate = event.start_date;

  // Calculate days difference helper
  const getDaysDiff = (target: string, from: string): number => {
    const t = new Date(target).getTime();
    const f = new Date(from).getTime();
    return Math.ceil((t - f) / (1000 * 60 * 60 * 24));
  };

  const daysBeforeCutoff = eventStartDate && endDate ? getDaysDiff(eventStartDate, endDate) : 0;

  // Check if before registration starts
  if (startDate && todayStr < startDate) {
    const daysUntilOpen = Math.max(1, getDaysDiff(startDate, todayStr));
    return {
      status: 'upcoming',
      isAllowed: false,
      label: `Opens on ${formatDateReadable(startDate)}`,
      badgeText: `Opens in ${daysUntilOpen} day${daysUntilOpen === 1 ? '' : 's'}`,
      description: `Registration begins on ${formatDateReadable(startDate)}. Registrations will open leading up to the camp event.`,
      daysUntilOpen,
      daysUntilClose: 0,
      daysBeforeEventCutoff: daysBeforeCutoff,
    };
  }

  // Check if past registration cutoff date
  if (endDate && todayStr > endDate) {
    return {
      status: 'closed',
      isAllowed: false,
      label: 'Registration Closed',
      badgeText: 'Registration Closed',
      description: `Registration closed on ${formatDateReadable(endDate)}. The deadline leading up to the event has concluded.`,
      daysUntilOpen: 0,
      daysUntilClose: 0,
      daysBeforeEventCutoff: daysBeforeCutoff,
    };
  }

  // Currently open!
  if (endDate) {
    const daysUntilClose = Math.max(0, getDaysDiff(endDate, todayStr));
    const cutoffText = daysBeforeCutoff > 0 ? ` (${daysBeforeCutoff} days before camp)` : '';
    return {
      status: 'open',
      isAllowed: true,
      label: `Open until ${formatDateReadable(endDate)}`,
      badgeText: daysUntilClose === 0 ? 'Closes Today' : `Closes in ${daysUntilClose} day${daysUntilClose === 1 ? '' : 's'}`,
      description: `Registration is open until ${formatDateReadable(endDate)}${cutoffText}. Secure your delegation pass today!`,
      daysUntilOpen: 0,
      daysUntilClose,
      daysBeforeEventCutoff: daysBeforeCutoff,
    };
  }

  return {
    status: 'open',
    isAllowed: true,
    label: 'Registration Open',
    badgeText: 'Registration Open',
    description: 'Registration is currently open for delegates.',
    daysUntilOpen: 0,
    daysUntilClose: 0,
    daysBeforeEventCutoff: daysBeforeCutoff,
  };
}

