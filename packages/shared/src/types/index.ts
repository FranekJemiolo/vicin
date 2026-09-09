export type AuthProvider = 'email' | 'google' | 'apple' | 'facebook';

export type MemberRole = 'owner' | 'admin' | 'member';

export type InviteStatus = 'pending' | 'accepted' | 'expired';

export type BroadcastStatus = 'active' | 'expired' | 'cancelled';

export interface User {
  id: string;
  email: string;
  auth_provider: AuthProvider;
  name: string;
  avatar_url?: string | null;
  expo_push_token?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string | null;
  created_by: string;
  created_at: string;
}

export interface GroupMember {
  group_id: string;
  user_id: string;
  role: MemberRole;
  push_enabled: boolean;
  joined_at: string;
  user?: User;
}

export interface GroupInvite {
  id: string;
  group_id: string;
  token: string;
  status: InviteStatus;
  expires_at: string;
  created_by: string;
  created_at: string;
}

export interface Activity {
  id: string;
  group_id: string;
  name: string;
  emoji: string;
  default_duration_mins: number;
  created_at: string;
}

export interface Broadcast {
  id: string;
  user_id: string;
  group_id: string;
  activity_id: string;
  message?: string | null;
  expires_at: string;
  status: BroadcastStatus;
  created_at: string;
}

export interface Acknowledgment {
  id: string;
  broadcast_id: string;
  user_id: string;
  created_at: string;
  user?: User;
}

export interface BroadcastWithDetails extends Broadcast {
  user: User;
  activity: Activity;
  group: Group;
  acknowledgments: Acknowledgment[];
  acknowledgment_count: number;
  user_has_acknowledged?: boolean;
}

export interface CreateBroadcastPayload {
  group_id: string;
  activity_id: string;
  duration_mins: number;
  message?: string;
}

export interface CreateGroupPayload {
  name: string;
  description?: string;
}

export interface CreateActivityPayload {
  group_id: string;
  name: string;
  emoji: string;
  default_duration_mins: number;
}
