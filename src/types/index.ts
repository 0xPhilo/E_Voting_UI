// =========================================
// e-Voting TypeScript Type Definitions
// =========================================

// User Types
export interface Mahasiswa {
  id: number;
  nim: string;
  name: string;
  fakultas?: string;
  jurusan?: string;
  program_studi?: string;
  has_voted: boolean;
  voting_token?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Admin {
  id: number;
  name: string;
  username?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
}

export type User = Mahasiswa | Admin;

// Kandidat Types
export interface Kandidat {
  id: number;
  nomor_urut: number;
  ketua_nama: string;
  wakil_nama: string;
  ketua_foto?: string;
  wakil_foto?: string;
  visi: string;
  misi: string;
  program_kerja?: string;
  is_active?: boolean;
  total_votes?: number;
  votings_count?: number;
  created_at?: string;
  updated_at?: string;
  // Aliases for backward compatibility
  nama_ketua?: string;
  nama_wakil?: string;
  foto_ketua?: string;
  foto_wakil?: string;
}

// Vote Types
export interface Vote {
  id: number;
  mahasiswa_id: number;
  kandidat_id: number;
  voted_at: string;
  created_at?: string;
  kandidat?: Kandidat;
}

export interface VoteStatus {
  has_voted: boolean;
  voted_at?: string;
  kandidat?: Kandidat;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Auth Types
export interface LoginCredentials {
  nim?: string;
  voting_token?: string;
  email?: string;
  password?: string;
}

export interface AuthResponse {
  user: Mahasiswa | Admin;
  token: string;
  token_type: string;
  expires_in?: number;
}

// Backend-specific response types
export interface MahasiswaLoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  mahasiswa: {
    id: number;
    nim: string;
    name: string;
    fakultas: string;
    jurusan: string;
    has_voted: boolean;
  };
}

export interface AdminLoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  admin: {
    id: number;
    username: string;
    name: string;
    role: string;
  };
}

// Dashboard Statistics
export interface DashboardStats {
  total_mahasiswa: number;
  total_voted: number;
  total_not_voted: number;
  total_kandidat: number;
  voting_percentage: number;
}

// Results Types
export interface VotingResult {
  kandidat: Kandidat;
  total_votes: number;
  percentage: number;
}

export interface VotingTimeline {
  hour: string;
  votes: number;
}

// Form Types
export interface KandidatFormData {
  nomor_urut: number;
  ketua_nama: string;
  wakil_nama: string;
  visi: string;
  misi: string;
  ketua_foto?: File;
  wakil_foto?: File;
}

export interface MahasiswaFormData {
  nim: string;
  name: string;
  program_studi: string;
}

// UI State Types
export interface ModalState {
  isOpen: boolean;
  type?: 'detail' | 'confirm' | 'add' | 'edit' | 'delete' | 'import';
  data?: unknown;
}

export interface ToastState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ThemeState {
  mode: 'light' | 'dark' | 'system';
}

// Table Types
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface TablePagination {
  page: number;
  perPage: number;
  total: number;
}

export interface TableSort {
  key: string;
  direction: 'asc' | 'desc';
}

// Search & Filter
export interface SearchParams {
  search?: string;
  status?: 'all' | 'voted' | 'not_voted';
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

// Export Types
export type ExportFormat = 'csv' | 'xlsx';
