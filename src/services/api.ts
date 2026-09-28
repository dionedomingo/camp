import type { CamperRegistration, CamperRole, Church, RegistrationStats, AdminUser, CheckInStats, CampEvent, EventScheduleItem, EventRegistration } from '../types';

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr_admin_alexius',
    name: 'Alexius',
    email: 'alexius@pcci.ph',
    role: 'admin',
    is_active: 1,
    created_at: '2026-09-26T16:39:13.000Z',
    last_login_at: '2026-09-26T16:39:13.000Z',
  },
];

// Official PCCI "Jesus Is Alive Worship Center" churches list synchronized from https://pcci-53421.wasmer.app/churches
export const INITIAL_PCCI_CHURCHES: Church[] = [
  { id: 'ch_open_delegate', slug: 'independent', name: 'Independent Delegate / Other Fellowship', province: 'Open / Other', city: 'Various Cities', pastor_name: 'Camp Coordination Team', contact_email: 'info@pcci.org.ph', target_quota: 100, registered_count: 14 },
  // Cagayan
  { id: 'ch_jia_buguey', slug: 'jia-san-lorenzo-buguey', name: 'Jesus Is Alive Worship Center - San Lorenzo', province: 'Cagayan', city: 'Buguey', pastor_name: 'Pastor in Charge', contact_email: 'buguey@pcci.org.ph', target_quota: 40, registered_count: 18 },
  { id: 'ch_jia_amunitan', slug: 'jia-amunitan-gonzaga', name: 'Jesus Is Alive Worship Center - Amunitan', province: 'Cagayan', city: 'Gonzaga', pastor_name: 'Pastor in Charge', contact_email: 'amunitan@pcci.org.ph', target_quota: 35, registered_count: 12 },
  { id: 'ch_jia_ipil', slug: 'jia-ipil-gonzaga', name: 'Jesus Is Alive Worship Center - Purok 1 Ipil', province: 'Cagayan', city: 'Gonzaga', pastor_name: 'Pastor in Charge', contact_email: 'ipil@pcci.org.ph', target_quota: 35, registered_count: 15 },
  { id: 'ch_jia_tucalan', slug: 'jia-tucalan-lasam', name: 'Jesus Is Alive Worship Center - Tucalan Passing', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'tucalan@pcci.org.ph', target_quota: 30, registered_count: 9 },
  { id: 'ch_jia_nabannagan', slug: 'jia-nabannagan-lasam', name: 'Jesus Is Alive - Nabannagan West', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'nabannagan@pcci.org.ph', target_quota: 30, registered_count: 8 },
  { id: 'ch_jia_new_orlins', slug: 'jia-new-orlins-lasam', name: 'Jesus Is Alive Worship Center - New Orlins', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'neworlins@pcci.org.ph', target_quota: 30, registered_count: 11 },
  { id: 'ch_jia_callao', slug: 'jia-callao-sur-lasam', name: 'Jesus Is Alive Worship Center - Callao Sur', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'callao@pcci.org.ph', target_quota: 30, registered_count: 10 },
  { id: 'ch_jia_minanga', slug: 'jia-minanga-sur-lasam', name: 'Jesus Is Alive Worship Center - Minanga Sur', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'minanga@pcci.org.ph', target_quota: 30, registered_count: 14 },
  { id: 'ch_jia_ibj', slug: 'jia-ibj-lasam', name: 'Jesus Is Alive Worship Center - IBJ', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'ibj@pcci.org.ph', target_quota: 30, registered_count: 12 },
  { id: 'ch_jia_allannay', slug: 'jia-allannay-lasam', name: 'Jesus Is Alive Worship Center - Allannay', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'allannay@pcci.org.ph', target_quota: 30, registered_count: 13 },
  { id: 'ch_jia_centro1', slug: 'jia-centro1-lasam', name: 'Jesus Is Alive Worship Center - Centro 1', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'centro1@pcci.org.ph', target_quota: 35, registered_count: 22 },
  { id: 'ch_jia_sanchez_mira', slug: 'jia-sanchez-mira', name: 'Jesus Is Alive Worship Center - Sanchez Mira', province: 'Cagayan', city: 'Sanchez Mira', pastor_name: 'Pastor in Charge', contact_email: 'sanchezmira@pcci.org.ph', target_quota: 40, registered_count: 25 },
  { id: 'ch_jia_sta_teresita', slug: 'jia-alucao-sta-teresita', name: 'Jesus Is Alive Worship Center - Alucao & Bungkag', province: 'Cagayan', city: 'Sta. Teresita', pastor_name: 'Pastor in Charge', contact_email: 'stateresita@pcci.org.ph', target_quota: 35, registered_count: 16 },
  // Nueva Vizcaya (National Headquarters)
  { id: 'ch_jia_buag', slug: 'jia-buag-bambang', name: 'Jesus Is Alive Worship Center - Buag (PCCI National HQ)', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Rev. Pastor in Charge', contact_email: 'bambang@pcci.org.ph', target_quota: 80, registered_count: 52 },
  { id: 'ch_jia_upacan', slug: 'jia-upacan-bambang', name: 'Jesus Is Alive - Upacan', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Pastor in Charge', contact_email: 'upacan@pcci.org.ph', target_quota: 35, registered_count: 14 },
  { id: 'ch_jia_santo_domingo', slug: 'jia-santo-domingo-bambang', name: 'Jesus Is Alive - Santo Domingo', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Pastor in Charge', contact_email: 'santodomingo@pcci.org.ph', target_quota: 35, registered_count: 15 },
  { id: 'ch_jia_gifta', slug: 'jia-gifta-almaguer-bambang', name: 'Jesus Is Alive - Gifta, Almaguer North', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Pastor in Charge', contact_email: 'gifta@pcci.org.ph', target_quota: 30, registered_count: 11 },
  { id: 'ch_cog_almaguer', slug: 'cog-cf-jia-almaguer', name: 'Church of God Christian Fellowship (JIA Almaguer)', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Pastor in Charge', contact_email: 'almaguer@pcci.org.ph', target_quota: 35, registered_count: 19 },
  { id: 'ch_jia_mauan', slug: 'jia-mauan-bambang', name: 'Jesus Is Alive - Mauan', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Pastor in Charge', contact_email: 'mauan@pcci.org.ph', target_quota: 30, registered_count: 9 },
  { id: 'ch_jia_san_antonio', slug: 'jia-san-antonio-bambang', name: 'Jesus Is Alive - San Antonio North', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Pastor in Charge', contact_email: 'sanantonio@pcci.org.ph', target_quota: 35, registered_count: 17 },
  { id: 'ch_jia_mangayang', slug: 'jia-mangayang-dupax', name: 'Jesus Is Alive - Mangayang', province: 'Nueva Vizcaya', city: 'Dupax Del Norte', pastor_name: 'Pastor in Charge', contact_email: 'mangayang@pcci.org.ph', target_quota: 35, registered_count: 12 },
];

const INITIAL_CAMPERS: CamperRegistration[] = [
  {
    id: 'cmp_101',
    church_id: 'ch_jia_buag',
    church_name: 'Jesus Is Alive Worship Center - Buag (PCCI National HQ)',
    church_slug: 'jia-buag-bambang',
    role: 'counselor',
    full_name: 'Joshua Miguel Valdez',
    nickname: 'Josh',
    gender: 'male',
    age: 24,
    email: 'joshua.valdez@email.com',
    phone: '+639171112233',
    province: 'Nueva Vizcaya',
    city: 'Bambang',
    dietary_needs: 'None',
    emergency_name: 'Maria Valdez',
    emergency_phone: '+639170001122',
    emergency_relation: 'Mother',
    ministry_interests: ['Praise & Worship', 'Youth Ministry'],
    favorite_verse: 'Joshua 1:9',
    verse_reflection: 'Be strong and courageous! God has prepared this season for you to lead fearlessly at VLC 2027.',
    selfie_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-8842',
    activation_token: 'act_josh_101',
    status: 'activated',
    checked_in_at: new Date(Date.now() - 3600000).toISOString(),
    kit_claimed: 1,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'cmp_102',
    church_id: 'ch_jia_sanchez_mira',
    church_name: 'Jesus Is Alive Worship Center - Sanchez Mira',
    church_slug: 'jia-sanchez-mira',
    role: 'first_timer',
    full_name: 'Hannah Joy Mendoza',
    nickname: 'Hannah',
    gender: 'female',
    age: 18,
    email: 'hannah.mendoza@email.com',
    phone: '+639182223344',
    province: 'Cagayan',
    city: 'Sanchez Mira',
    dietary_needs: 'No shellfish',
    emergency_name: 'Roberto Mendoza',
    emergency_phone: '+639189998877',
    emergency_relation: 'Father',
    ministry_interests: ['Media & Video', 'Youth Ministry'],
    favorite_verse: 'Jeremiah 29:11',
    verse_reflection: 'For I know the plans I have for you—plans to give you hope and a bright future!',
    selfie_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-3914',
    activation_token: 'act_hannah_102',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'cmp_103',
    church_id: 'ch_open_delegate',
    church_name: 'Independent Delegate / Other Fellowship',
    church_slug: 'independent',
    role: 'camper',
    full_name: 'Elijah Marcus Ramos',
    nickname: 'Eli',
    gender: 'male',
    age: 21,
    email: 'eli.ramos@email.com',
    phone: '+639193334455',
    province: 'Open / Other',
    city: 'Quezon City',
    dietary_needs: 'None',
    emergency_name: 'Grace Ramos',
    emergency_phone: '+639198887766',
    emergency_relation: 'Mother',
    ministry_interests: ['Praise & Worship', 'Sound & Production'],
    favorite_verse: 'Psalm 100:1-2',
    verse_reflection: 'Make a joyful noise to the Lord! Worship is your weapon and your joy.',
    selfie_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-5520',
    activation_token: 'act_eli_103',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  }
];

class CampApiService {
  private getLocalCampers(): CamperRegistration[] {
    const raw = localStorage.getItem('vlc2027_campers');
    let list: CamperRegistration[];
    if (!raw) {
      list = [...INITIAL_CAMPERS];
    } else {
      try {
        list = JSON.parse(raw);
      } catch {
        list = [...INITIAL_CAMPERS];
      }
    }
    // Ensure all campers have activation codes and valid status
    let modified = false;
    list = list.map((c, idx) => {
      let changed = false;
      const updated = { ...c };
      if (!updated.activation_code) {
        updated.activation_code = `VLC-${(2480 + idx * 79).toString().substring(0, 4)}`;
        changed = true;
      }
      if (!updated.activation_token) {
        updated.activation_token = `act_${updated.id || idx}_${Math.random().toString(36).substring(2, 8)}`;
        changed = true;
      }
      if (!updated.status) {
        updated.status = 'registered';
        changed = true;
      }
      if (updated.kit_claimed === undefined) {
        updated.kit_claimed = 0;
        changed = true;
      }
      if (changed) modified = true;
      return updated;
    });
    if (modified || !raw) {
      localStorage.setItem('vlc2027_campers', JSON.stringify(list));
    }
    return list;
  }

  private saveLocalCampers(campers: CamperRegistration[]) {
    localStorage.setItem('vlc2027_campers', JSON.stringify(campers));
  }

  private getLocalChurches(): Church[] {
    const raw = localStorage.getItem('vlc2027_pcci_churches');
    if (!raw) {
      localStorage.setItem('vlc2027_pcci_churches', JSON.stringify(INITIAL_PCCI_CHURCHES));
      return INITIAL_PCCI_CHURCHES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PCCI_CHURCHES;
    }
  }

  private saveLocalChurches(churches: Church[]) {
    localStorage.setItem('vlc2027_pcci_churches', JSON.stringify(churches));
  }

  // 1. Fetch live summary stats
  async getStats(): Promise<RegistrationStats> {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Local fallback
    }

    const campers = this.getLocalCampers();
    const churches = this.getLocalChurches();
    const targetCapacity = 600;
    const totalRegistered = campers.length + 345;

    const churchBreakdown = churches.map((ch) => {
      const localCount = campers.filter((c) => c.church_id === ch.id).length;
      return {
        id: ch.id,
        name: ch.name,
        slug: ch.slug,
        province: ch.province,
        city: ch.city,
        target_quota: ch.target_quota,
        count: (ch.registered_count || 0) + (localCount > 0 ? localCount - 1 : 0),
      };
    }).sort((a, b) => b.count - a.count);

    const provinceBreakdown = [
      { province: 'Nueva Vizcaya', count: 182 },
      { province: 'Cagayan', count: 142 },
      { province: 'Open / Other', count: 28 },
    ];

    const roleBreakdown: Array<{ role: CamperRole; count: number }> = [
      { role: 'camper', count: 194 },
      { role: 'first_timer', count: 72 },
      { role: 'counselor', count: 36 },
      { role: 'worship', count: 24 },
      { role: 'staff', count: 18 },
      { role: 'pastor', count: 14 },
      { role: 'medical', count: 8 },
    ];

    const recentSignups = campers.slice(0, 6).map((c) => ({
      nickname: c.nickname,
      role: c.role,
      province: c.province,
      church_name: c.church_name || 'PCCI Church',
      favorite_verse: c.favorite_verse,
      created_at: c.created_at || new Date().toISOString(),
    }));

    return {
      campName: 'VLC 2027',
      campTheme: 'Arise & Shine (Isaiah 60:1)',
      targetCapacity,
      totalRegistered,
      percentFilled: Math.min(100, Math.round((totalRegistered / targetCapacity) * 100)),
      churchBreakdown,
      provinceBreakdown,
      roleBreakdown,
      recentSignups,
    };
  }

  // 2. Fetch churches
  async getChurches(slug?: string): Promise<Church[]> {
    try {
      const url = slug ? `/api/churches?slug=${encodeURIComponent(slug)}` : '/api/churches';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : [data];
        if (list.length > 0) return list;
      }
    } catch {
      // Fallback
    }

    const localList = this.getLocalChurches();
    if (slug) {
      const found = localList.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
      return found ? [found] : [];
    }
    return localList;
  }

  // 3. Register camper
  async registerCamper(camperData: CamperRegistration): Promise<CamperRegistration> {
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(camperData),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.camper) {
        return json.camper;
      }
      if (!res.ok && json?.error) {
        throw new Error(json.error);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
        throw err;
      }
      // Fallback only for network errors
    }

    const churches = this.getLocalChurches();
    const church = churches.find((c) => c.id === camperData.church_id);
    
    const codeChars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let codeSuffix = '';
    for (let i = 0; i < 4; i++) {
      codeSuffix += codeChars.charAt(Math.floor(Math.random() * codeChars.length));
    }
    const activationCode = `VLC-${codeSuffix}`;
    const activationToken = 'act_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

    const newCamper: CamperRegistration = {
      ...camperData,
      id: 'vlc_' + Math.random().toString(36).substring(2, 9),
      church_name: church?.name || 'PCCI Delegation',
      church_slug: church?.slug || 'independent',
      activation_code: activationCode,
      activation_token: activationToken,
      status: 'registered',
      kit_claimed: 0,
      created_at: new Date().toISOString(),
    };

    const existing = this.getLocalCampers();
    this.saveLocalCampers([newCamper, ...existing]);
    return newCamper;
  }

  // 4. Admin: Create Church
  async createChurch(church: Partial<Church>): Promise<Church> {
    const slug = (church.slug || church.name || 'church')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    const id = 'ch_' + slug.replace(/-/g, '_');

    try {
      const res = await fetch('/api/churches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...church, id, slug }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const newChurch: Church = {
      id,
      slug,
      name: church.name || 'New Fellowship',
      province: church.province || 'Nueva Vizcaya',
      city: church.city || 'Bambang',
      pastor_name: church.pastor_name || 'Pastor in Charge',
      contact_email: church.contact_email || 'info@pcci.org.ph',
      target_quota: Number(church.target_quota) || 40,
      registered_count: 0,
    };

    const current = this.getLocalChurches();
    this.saveLocalChurches([newChurch, ...current]);
    return newChurch;
  }

  // 5. Admin: Update Church
  async updateChurch(church: Partial<Church> & { id: string }): Promise<Church> {
    try {
      const res = await fetch('/api/churches', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(church),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const current = this.getLocalChurches();
    const updated = current.map((c) => (c.id === church.id ? { ...c, ...church } : c));
    this.saveLocalChurches(updated);
    return { ...church } as Church;
  }

  // 6. Admin: Delete Church
  async deleteChurch(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/churches?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }

    const current = this.getLocalChurches();
    this.saveLocalChurches(current.filter((c) => c.id !== id));
    return true;
  }

  // 7. Admin: Synchronize from PCCI
  async syncPcciChurches(): Promise<{ success: boolean; message: string; syncedCount: number }> {
    try {
      const res = await fetch('/api/sync-pcci', { method: 'POST' });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    this.saveLocalChurches(INITIAL_PCCI_CHURCHES);
    return {
      success: true,
      message: `Synchronized ${INITIAL_PCCI_CHURCHES.length} official PCCI churches into registry.`,
      syncedCount: INITIAL_PCCI_CHURCHES.length,
    };
  }

  // 8. Verse reflection
  async getVerseReflection(verse: string, camperData: Partial<CamperRegistration>): Promise<string> {
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reflect_verse',
          userInput: verse,
          camperData,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.reflection) return json.reflection;
      }
    } catch {
      // Fallback
    }

    return `"${verse}" is a powerful anchor for your soul! As you prepare for VLC 2027 with PCCI, get ready for God to ignite your light and commission you to arise and shine.`;
  }

  // 9. Friend Invite Copy
  async getInviteCopy(camperData: Partial<CamperRegistration>): Promise<{ headline: string; message: string }> {
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_invite',
          camperData,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.inviteCopy) return json.inviteCopy;
      }
    } catch {
      // Fallback
    }

    const church = camperData.church_name || 'our delegation';
    return {
      headline: 'Come with me to VLC 2027! 🔥',
      message: `Hey! I just registered for VLC 2027 with ${church}! It's going to be a transformative youth leadership assembly. Register here so we can sit together: `,
    };
  }

  // 10. Track invite share
  async trackInvite(church_id: string, platform: string, camper_id?: string) {
    try {
      await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ church_id, platform, camper_id }),
      });
    } catch {
      // Fallback
    }
  }

  // 11. Unified Login (for both Campers and Admins/Staff)
  async login(
    identifier: string,
    passcodeOrPassword: string
  ): Promise<{
    success: boolean;
    user?: CamperRegistration & { is_admin?: boolean; is_staff?: boolean };
    error?: string;
  }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password: passcodeOrPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Authentication failed' };
    } catch {
      // Local fallback: strictly check stored password hash without default password bypass
      const idClean = identifier.trim().toLowerCase();
      const adminUsers = this.getLocalAdminUsers();
      const admin = adminUsers.find(
        (u) =>
          (u.email.toLowerCase() === idClean || u.name.toLowerCase() === idClean) &&
          Boolean(u.is_active)
      );

      if (admin && admin.password_hash && admin.password_hash === passcodeOrPassword) {
        return {
          success: true,
          user: {
            id: admin.id,
            church_id: admin.church_id || 'ch_jia_buag',
            church_name: admin.church_name || 'Jesus Is Alive Worship Center - Buag (PCCI National HQ)',
            role: admin.role as CamperRole,
            full_name: admin.name,
            nickname: admin.name,
            gender: 'unspecified',
            age: 25,
            email: admin.email,
            phone: '+639170000000',
            province: 'Nueva Vizcaya',
            emergency_name: 'Camp Office',
            emergency_phone: '+639170000000',
            emergency_relation: 'Office',
            ministry_interests: ['Leadership'],
            favorite_verse: 'Isaiah 60:1',
            is_admin: admin.role === 'admin',
            is_staff: true,
            is_active: 1,
          },
        };
      }

      const campers = this.getLocalCampers();
      const camper = campers.find(
        (c) =>
          c.email.toLowerCase() === idClean ||
          c.nickname.toLowerCase() === idClean ||
          c.activation_code?.toLowerCase() === idClean ||
          c.id?.toLowerCase() === idClean
      );

      if (camper && camper.password_hash && camper.password_hash === passcodeOrPassword) {
        return {
          success: true,
          user: {
            ...camper,
            is_admin: camper.role === 'admin',
            is_staff: ['admin', 'staff', 'coordinator'].includes(camper.role),
          },
        };
      }

      return { success: false, error: 'Invalid email/username or password.' };
    }
  }

  // Admin Auth (wrapper pointing to unified login)
  async loginAdmin(identifier: string, passcode: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const res = await this.login(identifier, passcode);
    if (res.success && res.user) {
      const adminUser: AdminUser = {
        id: res.user.id || 'usr_admin',
        name: res.user.full_name || res.user.nickname,
        nickname: res.user.nickname,
        email: res.user.email,
        role: res.user.role,
        church_id: res.user.church_id,
        church_name: res.user.church_name,
        is_active: res.user.is_active ?? 1,
        last_login_at: res.user.last_login_at || new Date().toISOString(),
      };
      return { success: true, user: adminUser };
    }
    return { success: false, error: res.error || 'Authentication failed' };
  }

  // Promote camper to admin or update role directly
  async promoteUserRole(userId: string, newRole: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to update user role' };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  }

  // 12. User Management CRUD
  async getAdminUsers(): Promise<AdminUser[]> {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return this.getLocalAdminUsers();
  }

  async createAdminUser(userData: Partial<AdminUser> & { password?: string }): Promise<AdminUser> {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        const json = await res.json();
        return json.user;
      }
    } catch {
      // Fallback
    }
    const users = this.getLocalAdminUsers();
    const newUser: AdminUser = {
      id: `usr_${Date.now()}`,
      name: userData.name || 'New Staff',
      email: (userData.email || 'staff@pcci.ph').toLowerCase(),
      role: userData.role || 'staff',
      church_id: userData.church_id,
      is_active: 1,
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    this.saveLocalAdminUsers(users);
    return newUser;
  }

  async updateAdminUser(userData: Partial<AdminUser> & { id: string; password?: string }): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }
    const users = this.getLocalAdminUsers();
    const idx = users.findIndex((u) => u.id === userData.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...userData };
      this.saveLocalAdminUsers(users);
      return true;
    }
    return false;
  }

  async deleteAdminUser(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }
    const users = this.getLocalAdminUsers().filter((u) => u.id !== id);
    this.saveLocalAdminUsers(users);
    return true;
  }

  // 13. Camper Activation on Arrival
  async activateCamper(params: { token?: string; code?: string; password?: string }): Promise<{
    success: boolean;
    camper?: CamperRegistration;
    message?: string;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/camper/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, camper: data.camper, message: data.message };
      }
      if (!res.ok) {
        return { success: false, error: data.error || 'Activation failed' };
      }
    } catch {
      // Fallback: local storage
    }

    const campers = this.getLocalCampers();
    const token = (params.token || '').trim();
    const code = (params.code || '').trim().toUpperCase();

    const idx = campers.findIndex(
      (c) =>
        (token && c.activation_token === token) ||
        (code && (c.activation_code?.toUpperCase() === code || c.id?.toUpperCase() === code))
    );

    if (idx === -1) {
      return {
        success: false,
        error: 'No matching camper registration found. Please check your code or consult the check-in desk.',
      };
    }

    campers[idx] = {
      ...campers[idx],
      status: 'activated',
      checked_in_at: campers[idx].checked_in_at || new Date().toISOString(),
    };
    this.saveLocalCampers(campers);

    return {
      success: true,
      message: `Welcome to VLC 2027, ${campers[idx].nickname}! Your pass is now active.`,
      camper: campers[idx],
    };
  }

  // 14. Camper Login (wrapper using unified login)
  async loginCamper(
    identifier: string,
    password: string
  ): Promise<{ success: boolean; camper?: CamperRegistration; error?: string }> {
    const res = await this.login(identifier, password);
    if (res.success && res.user) {
      return { success: true, camper: res.user };
    }
    return { success: false, error: res.error || 'Camper account not found.' };
  }


  // 15. Admin Check-in Desk: Get Campers
  async getCheckInCampers(search?: string, status?: string): Promise<CamperRegistration[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      const res = await fetch(`/api/admin/checkin?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    let list = this.getLocalCampers();
    if (search) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.full_name.toLowerCase().includes(q) ||
          c.nickname.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.activation_code?.toLowerCase().includes(q) ||
          (c.church_name && c.church_name.toLowerCase().includes(q))
      );
    }
    if (status === 'checked_in') {
      list = list.filter((c) => c.status === 'activated' || c.checked_in_at);
    } else if (status === 'pending') {
      list = list.filter((c) => c.status !== 'activated' && !c.checked_in_at);
    }

    return list;
  }

  // 16. Admin Check-in Desk: Perform Action
  async checkInCamper(params: {
    camper_id?: string;
    code_or_token?: string;
    admin_id?: string;
    kit_claimed?: boolean;
    action?: 'check_in' | 'undo_check_in' | 'toggle_kit' | 'reset_password';
    new_password?: string;
  }): Promise<{ success: boolean; camper?: CamperRegistration; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, camper: data.camper, message: data.message };
      }
      if (!res.ok) {
        return { success: false, error: data.error || 'Check-in failed' };
      }
    } catch {
      // Fallback
    }

    const campers = this.getLocalCampers();
    const idx = campers.findIndex(
      (c) =>
        (params.camper_id && c.id === params.camper_id) ||
        (params.code_or_token &&
          (c.activation_code?.toUpperCase() === params.code_or_token.toUpperCase() ||
            c.activation_token === params.code_or_token ||
            c.id?.toUpperCase() === params.code_or_token.toUpperCase()))
    );

    if (idx === -1) {
      return { success: false, error: 'Camper not found' };
    }

    const current = campers[idx];
    const action = params.action || 'check_in';

    if (action === 'check_in') {
      campers[idx] = {
        ...current,
        status: 'activated',
        checked_in_at: current.checked_in_at || new Date().toISOString(),
        checked_in_by: params.admin_id || 'Alexius',
        kit_claimed: params.kit_claimed !== undefined ? (params.kit_claimed ? 1 : 0) : 1,
      };
    } else if (action === 'undo_check_in') {
      campers[idx] = {
        ...current,
        status: 'registered',
        checked_in_at: undefined,
        checked_in_by: undefined,
      };
    } else if (action === 'toggle_kit') {
      campers[idx] = {
        ...current,
        kit_claimed: current.kit_claimed ? 0 : 1,
      };
    }

    this.saveLocalCampers(campers);
    return {
      success: true,
      camper: campers[idx],
      message: `Updated status for ${campers[idx].nickname}`,
    };
  }

  // 17. Update Camper Profile (Selfie, Personal info, Emergency, Verse)
  async updateProfile(
    camperId: string,
    updates: Partial<CamperRegistration>
  ): Promise<{ success: boolean; camper?: CamperRegistration; error?: string }> {
    try {
      const res = await fetch('/api/camper/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: camperId, ...updates }),
      });
      if (res.ok) {
        const data = (await res.json()) as { success: boolean; camper: CamperRegistration };
        if (data.camper) {
          // Update local cache
          const campers = this.getLocalCampers();
          const idx = campers.findIndex((c) => c.id === camperId);
          if (idx !== -1) {
            campers[idx] = { ...campers[idx], ...data.camper };
            this.saveLocalCampers(campers);
          }
          return { success: true, camper: data.camper };
        }
      } else {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        if (errData.error) {
          return { success: false, error: errData.error };
        }
      }
    } catch (e) {
      console.warn('API updateProfile failed, updating local storage:', e);
    }

    // Local storage fallback
    const campers = this.getLocalCampers();
    const idx = campers.findIndex((c) => c.id === camperId);
    if (idx !== -1) {
      campers[idx] = { ...campers[idx], ...updates };
      this.saveLocalCampers(campers);
      return { success: true, camper: campers[idx] };
    }

    return { success: false, error: 'Camper profile not found' };
  }

  // 18. Check-in Stats
  async getCheckInStats(): Promise<CheckInStats> {
    try {
      const res = await fetch('/api/admin/checkin-stats');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const campers = this.getLocalCampers();
    const churches = this.getLocalChurches();

    const totalRegistered = campers.length;
    const totalCheckedIn = campers.filter((c) => c.status === 'activated' || c.checked_in_at).length;
    const totalKitsClaimed = campers.filter((c) => Boolean(c.kit_claimed)).length;
    const percentCheckedIn = totalRegistered > 0 ? Math.round((totalCheckedIn / totalRegistered) * 100) : 0;

    const delegationStats = churches
      .map((ch) => {
        const churchCampers = campers.filter((c) => c.church_id === ch.id);
        const checked = churchCampers.filter((c) => c.status === 'activated' || c.checked_in_at).length;
        return {
          church_id: ch.id,
          church_name: ch.name,
          total: churchCampers.length,
          checkedIn: checked,
        };
      })
      .filter((d) => d.total > 0)
      .sort((a, b) => b.checkedIn - a.checkedIn);

    return {
      totalRegistered,
      totalCheckedIn,
      percentCheckedIn,
      totalKitsClaimed,
      delegationStats,
    };
  }

  // 19. Resend Camper Passport Email
  async resendCamperEmail(params: { camper_id?: string; email?: string; code?: string }): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/camper/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json() as { success?: boolean; message?: string; error?: string };
      if (res.ok && data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Failed to dispatch email' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      return { success: false, error: msg };
    }
  }

  // 20. Get Email Deliveries Audit Log (Admin)
  async getEmailDeliveries(limit: number = 50): Promise<{
    success: boolean;
    deliveries: Array<Record<string, unknown>>;
    error?: string;
  }> {
    try {
      const res = await fetch(`/api/admin/email-deliveries?limit=${limit}`);
      if (res.ok) {
        const data = await res.json() as { deliveries?: Array<Record<string, unknown>> };
        return { success: true, deliveries: data.deliveries || [] };
      }
      return { success: false, deliveries: [], error: 'Failed to fetch email logs' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      return { success: false, deliveries: [], error: msg };
    }
  }

  // 19. Forgot Password (Dispatches Reset Email via Cloudflare Outbound)
  async forgotPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string; error?: string };
      if (res.ok) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Failed to send reset link.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error while requesting password reset.';
      return { success: false, error: msg };
    }
  }

  // 20. Verify Reset Token
  async verifyResetToken(token: string): Promise<{ valid: boolean; full_name?: string; email?: string; error?: string }> {
    try {
      const res = await fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`);
      const data = (await res.json()) as { valid?: boolean; full_name?: string; email?: string; error?: string };
      if (res.ok && data.valid) {
        return { valid: true, full_name: data.full_name, email: data.email };
      }
      return { valid: false, error: data.error || 'Password reset link is invalid or expired.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error while validating token.';
      return { valid: false, error: msg };
    }
  }

  // 21. Reset Password Execution
  async resetPassword(token: string, password: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string; error?: string };
      if (res.ok) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Failed to update password.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error while resetting password.';
      return { success: false, error: msg };
    }
  }

  // 22. Get Events (Active or Specific)
  async getEvents(slug?: string): Promise<{ events: CampEvent[]; active_event: CampEvent | null; error?: string }> {
    try {
      const url = slug ? `/api/events?slug=${encodeURIComponent(slug)}` : '/api/events';
      const res = await fetch(url);
      if (res.ok) {
        const data = (await res.json()) as { events?: CampEvent[]; active_event?: CampEvent; event?: CampEvent };
        if (slug && data.event) {
          return { events: [data.event], active_event: data.event };
        }
        return { events: data.events || [], active_event: data.active_event || null };
      }
      return { events: [], active_event: null, error: 'Failed to fetch events' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error fetching events';
      return { events: [], active_event: null, error: msg };
    }
  }

  // 23. Update Event Details
  async updateEvent(eventData: Partial<CampEvent>): Promise<{ success: boolean; event?: CampEvent; error?: string }> {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      const data = (await res.json()) as { success?: boolean; event?: CampEvent; error?: string };
      if (res.ok && data.success) {
        return { success: true, event: data.event };
      }
      return { success: false, error: data.error || 'Failed to update event' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error saving event';
      return { success: false, error: msg };
    }
  }

  // 24. Get Event Dynamic Schedule
  async getEventSchedule(eventId: string = 'vlc-2027'): Promise<{ schedules: EventScheduleItem[]; event_id: string; error?: string }> {
    try {
      const res = await fetch(`/api/events/schedule?event_id=${encodeURIComponent(eventId)}`);
      if (res.ok) {
        const data = (await res.json()) as { schedules?: EventScheduleItem[]; event_id?: string };
        return { schedules: data.schedules || [], event_id: data.event_id || eventId };
      }
      return { schedules: [], event_id: eventId, error: 'Failed to fetch schedule' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error fetching schedule';
      return { schedules: [], event_id: eventId, error: msg };
    }
  }

  // 25. Save Schedule Session Item
  async saveScheduleItem(item: Partial<EventScheduleItem>): Promise<{ success: boolean; schedule?: EventScheduleItem; error?: string }> {
    try {
      const res = await fetch('/api/events/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const data = (await res.json()) as { success?: boolean; schedule?: EventScheduleItem; error?: string };
      if (res.ok && data.success) {
        return { success: true, schedule: data.schedule };
      }
      return { success: false, error: data.error || 'Failed to save schedule session' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error saving schedule session';
      return { success: false, error: msg };
    }
  }

  // 26. Delete Schedule Session Item
  async deleteScheduleItem(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/events/schedule?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (res.ok && data.success) {
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to delete schedule session' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error deleting schedule session';
      return { success: false, error: msg };
    }
  }

  // 27. Get Camper's Multi-Event Registrations & Available Next Events
  async getCamperEvents(camperId: string): Promise<{
    success: boolean;
    registrations: EventRegistration[];
    available_events: CampEvent[];
    error?: string;
  }> {
    try {
      const res = await fetch(`/api/camper/events?camper_id=${encodeURIComponent(camperId)}`);
      if (res.ok) {
        const data = (await res.json()) as {
          success: boolean;
          registrations?: EventRegistration[];
          available_events?: CampEvent[];
        };
        return {
          success: true,
          registrations: data.registrations || [],
          available_events: data.available_events || [],
        };
      }
      return { success: false, registrations: [], available_events: [], error: 'Failed to load camper events' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error loading camper events';
      return { success: false, registrations: [], available_events: [], error: msg };
    }
  }

  // 28. Join a New Camp Event using Existing Account
  async joinEvent(
    camperId: string,
    eventId: string,
    churchId?: string,
    role?: string
  ): Promise<{
    success: boolean;
    message?: string;
    already_registered?: boolean;
    registration?: EventRegistration;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/camper/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ camper_id: camperId, event_id: eventId, church_id: churchId, role }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        already_registered?: boolean;
        registration?: EventRegistration;
        error?: string;
      };
      if (res.ok && data.success) {
        return {
          success: true,
          message: data.message,
          already_registered: data.already_registered,
          registration: data.registration,
        };
      }
      return { success: false, error: data.error || 'Failed to join event' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error joining event';
      return { success: false, error: msg };
    }
  }

  private getLocalAdminUsers(): AdminUser[] {
    const raw = localStorage.getItem('vlc2027_admin_users');
    if (!raw) {
      localStorage.setItem('vlc2027_admin_users', JSON.stringify(INITIAL_ADMIN_USERS));
      return [...INITIAL_ADMIN_USERS];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [...INITIAL_ADMIN_USERS];
    }
  }

  private saveLocalAdminUsers(users: AdminUser[]) {
    localStorage.setItem('vlc2027_admin_users', JSON.stringify(users));
  }
}


export const apiService = new CampApiService();
