/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AUTH API SERVICE — Real HTTP Implementation
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Concrete implementation of IAuthService using real HTTP calls.
 * Extends ApiService for fetch wrapping, timeout, and error handling.
 *
 * TO ACTIVATE: In ServiceProvider.tsx replace the mock authService with:
 *   const authService = new AuthApiService();
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ApiService } from '../ApiService';
import type { IAuthService } from '../contracts';
import type { AuthUser, Organization, UserRole, ServiceResponse } from '../types';
import { ENDPOINTS } from '../config';
import { clearAuth, setAuthToken } from '../AuthSession';

export class AuthApiService extends ApiService implements IAuthService {
  async getCurrentUser(): Promise<AuthUser> {
    return this.get<AuthUser>(ENDPOINTS.AUTH_ME);
  }

  async register(
    name: string,
    email: string,
    password: string,
    organizationName: string,
  ): Promise<ServiceResponse<AuthUser>> {
    try {
      const data = await this.post<AuthUser>(ENDPOINTS.AUTH_REGISTER, {
        name,
        email,
        password,
        organizationName,
      });
      if ((data as any).token) {
        setAuthToken((data as any).token);
      }
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  }

  async login(
    email: string,
    password: string,
    role: UserRole,
  ): Promise<ServiceResponse<AuthUser>> {
    try {
      const data = await this.post<AuthUser>(ENDPOINTS.AUTH_LOGIN, {
        email,
        password,
        role,
      });
      if ((data as any).token) {
        setAuthToken((data as any).token);
      }
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.post<void>(ENDPOINTS.AUTH_LOGOUT);
    } finally {
      clearAuth();
    }
  }

  async switchOrganization(orgId: string): Promise<ServiceResponse<Organization>> {
    try {
      const data = await this.post<Organization>(ENDPOINTS.AUTH_SWITCH_ORG, { orgId });
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message || 'Switch failed' };
    }
  }

  async getOrganizations(): Promise<Organization[]> {
    return this.get<Organization[]>('/auth/organizations');
  }

  async getCurrentOrganization(): Promise<Organization> {
    return this.get<Organization>('/auth/organizations/current');
  }
}
