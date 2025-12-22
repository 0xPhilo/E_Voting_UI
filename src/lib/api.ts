// =========================================
// API Client Layer
// =========================================

import {
    ApiResponse,
    PaginatedResponse,
    MahasiswaLoginResponse,
    AdminLoginResponse,
    Kandidat,
    Mahasiswa,
    VoteStatus,
    DashboardStats,
    VotingResult,
    VotingTimeline,
    LoginCredentials,
    SearchParams,
    ExportFormat
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// =========================================
// API Client Class
// =========================================

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('auth_token');
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = this.getToken();

        const headers: HeadersInit = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Something went wrong');
        }

        return response.json();
    }

    private async requestFormData<T>(
        endpoint: string,
        formData: FormData,
        method: 'POST' | 'PUT' = 'POST'
    ): Promise<T> {
        const token = this.getToken();

        const headers: HeadersInit = {
            'Accept': 'application/json',
        };

        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method,
            headers,
            body: formData,
        });

        if (!response.ok) {
            // Try to parse as JSON, fallback to text if not valid JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                throw new Error(error.message || 'Something went wrong');
            } else {
                const text = await response.text();
                // Try to extract a meaningful message from HTML error pages
                const match = text.match(/<title>([^<]+)<\/title>/i);
                throw new Error(match ? match[1] : `Server error: ${response.status}`);
            }
        }

        return response.json();
    }

    // =========================================
    // Auth Endpoints
    // =========================================

    async mahasiswaLogin(credentials: LoginCredentials): Promise<ApiResponse<MahasiswaLoginResponse>> {
        return this.request('/auth/mahasiswa/login', {
            method: 'POST',
            body: JSON.stringify({
                nim: credentials.nim,
                token: credentials.voting_token,
            }),
        });
    }

    async adminLogin(credentials: LoginCredentials): Promise<ApiResponse<AdminLoginResponse>> {
        return this.request('/auth/admin/login', {
            method: 'POST',
            body: JSON.stringify({
                username: credentials.email, // email field is used for username in the form
                password: credentials.password,
            }),
        });
    }

    async logout(): Promise<ApiResponse<null>> {
        return this.request('/auth/logout', { method: 'POST' });
    }

    async getMe(): Promise<ApiResponse<Mahasiswa>> {
        return this.request('/auth/me');
    }

    // =========================================
    // Kandidat Endpoints
    // =========================================

    async getKandidats(): Promise<ApiResponse<Kandidat[]>> {
        return this.request('/kandidat');
    }

    async getKandidat(id: number): Promise<ApiResponse<Kandidat>> {
        return this.request(`/kandidat/${id}`);
    }

    async createKandidat(formData: FormData): Promise<ApiResponse<Kandidat>> {
        return this.requestFormData('/kandidat', formData);
    }

    async updateKandidat(id: number, formData: FormData): Promise<ApiResponse<Kandidat>> {
        formData.append('_method', 'PUT');
        return this.requestFormData(`/kandidat/${id}`, formData);
    }

    async deleteKandidat(id: number): Promise<ApiResponse<null>> {
        return this.request(`/kandidat/${id}`, { method: 'DELETE' });
    }

    async getKandidatsWithVotes(): Promise<ApiResponse<Kandidat[]>> {
        return this.request('/kandidat-with-votes');
    }

    // =========================================
    // Vote Endpoints
    // =========================================

    async submitVote(kandidatId: number): Promise<ApiResponse<VoteStatus>> {
        return this.request('/vote', {
            method: 'POST',
            body: JSON.stringify({
                kandidat_id: kandidatId,
                confirmation: true
            }),
        });
    }

    async getVoteStatus(): Promise<ApiResponse<VoteStatus>> {
        return this.request('/vote/status');
    }

    // =========================================
    // Mahasiswa Endpoints (Admin)
    // =========================================

    async getMahasiswas(params?: SearchParams): Promise<PaginatedResponse<Mahasiswa>> {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.append('search', params.search);
        // Backend expects 'has_voted' boolean, not 'status' string
        if (params?.status && params.status !== 'all') {
            searchParams.append('has_voted', params.status === 'voted' ? 'true' : 'false');
        }
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
        if (params?.sort_by) searchParams.append('sort_by', params.sort_by);
        if (params?.sort_dir) searchParams.append('sort_dir', params.sort_dir);

        const queryString = searchParams.toString();
        return this.request(`/mahasiswa${queryString ? `?${queryString}` : ''}`);
    }

    async getMahasiswa(id: number): Promise<ApiResponse<Mahasiswa>> {
        return this.request(`/mahasiswa/${id}`);
    }

    async createMahasiswa(data: Partial<Mahasiswa>): Promise<ApiResponse<Mahasiswa>> {
        return this.request('/mahasiswa', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateMahasiswa(id: number, data: Partial<Mahasiswa>): Promise<ApiResponse<Mahasiswa>> {
        return this.request(`/mahasiswa/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteMahasiswa(id: number): Promise<ApiResponse<null>> {
        return this.request(`/mahasiswa/${id}`, { method: 'DELETE' });
    }

    async regenerateToken(id: number): Promise<ApiResponse<{ voting_token: string }>> {
        return this.request(`/mahasiswa/${id}/regenerate-token`, { method: 'POST' });
    }

    async importMahasiswa(file: File): Promise<ApiResponse<{ imported: number; failed: number }>> {
        const formData = new FormData();
        formData.append('file', file);
        return this.requestFormData('/mahasiswa/import', formData);
    }

    async getMahasiswaStatistics(): Promise<ApiResponse<{ total: number; voted: number; not_voted: number }>> {
        return this.request('/mahasiswa/statistics');
    }

    // =========================================
    // Results Endpoints (Admin)
    // =========================================

    async getResults(): Promise<ApiResponse<VotingResult[]>> {
        return this.request('/results');
    }

    async getResultsTimeline(): Promise<ApiResponse<VotingTimeline[]>> {
        return this.request('/results/timeline');
    }

    async exportResults(format: ExportFormat): Promise<Blob> {
        const token = this.getToken();
        const response = await fetch(`${this.baseUrl}/results/export?format=${format}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.blob();
    }

    // =========================================
    // Dashboard Endpoints (Admin)
    // =========================================

    async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
        return this.request('/dashboard/statistics');
    }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);

// Export class for testing
export { ApiClient };
