/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API SERVICE BASE — Ready for Real API Integration
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This base class provides the fetch wrapper for real API calls.
 * When you switch from mock → real, extend this class.
 *
 * Example usage (Phase 6 swap):
 *
 *   class RealPeopleService extends ApiService implements IPeopleService {
 *     async getEmployees(params?: QueryParams) {
 *       return this.get<PaginatedResponse<Employee>>(ENDPOINTS.EMPLOYEES, params);
 *     }
 *   }
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { API_BASE_URL, REQUEST_TIMEOUT, getAuthHeaders } from './config';

export class ApiService {
  protected baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic GET request
   */
  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generic POST request
   */
  protected async post<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generic PUT request
   */
  protected async put<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generic PATCH request
   */
  protected async patch<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generic DELETE request
   */
  protected async delete(endpoint: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
  }
}
