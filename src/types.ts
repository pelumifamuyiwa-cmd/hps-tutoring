export type UserRole = 'admin' | 'parent' | 'tutor';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
}

export interface TutorProfile {
  uid: string;
  subjects: string[];
  location: string;
  availability: Record<string, string[]>;
  experience: string;
  gender: 'male' | 'female';
  pricing: number;
  status: 'pending' | 'approved' | 'rejected';
  bio: string;
}

export interface ParentProfile {
  uid: string;
  phone: string;
  address: string;
}

export interface TutorRequest {
  id: string;
  parentId: string;
  studentName: string;
  subjects: string[];
  location: string;
  availability: Record<string, string[]>;
  genderPreference: string;
  budget: number;
  status: 'pending' | 'matching' | 'assigned' | 'completed';
  matchedTutorId?: string;
  suggestedTutorIds?: string[];
  createdAt: string;
}

export interface Session {
  id: string;
  requestId: string;
  tutorId: string;
  parentId: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Payment {
  id: string;
  parentId: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
  type: 'tuition' | 'registration';
  requestId?: string;
}
