import { supabase } from '../lib/supabase';

export interface AuthUser {
  id: number;
  employeeId: string;
  fullName: string;
  roleCode: number;
  roleDescription: string;
  procurementTeam?: string;
  email?: string;
}

export const authService = {
  async login(employeeId: string, password: string): Promise<AuthUser | null> {
    try {
      // Find user by employee_id
      const { data: worker, error } = await supabase
        .from('workers')
        .select(`
          id,
          employee_id,
          full_name,
          role_code,
          role_description,
          email,
          password,
          procurement_teams!procurement_team_id (
            name
          )
        `)
        .eq('employee_id', employeeId)
        .single();

      if (error || !worker) {
        console.error('User not found:', error);
        return null;
      }

      // Validate password
      if (worker.password !== password) {
        console.error('Invalid password');
        return null;
      }

      // Transform to AuthUser format
      return {
        id: worker.id,
        employeeId: worker.employee_id,
        fullName: worker.full_name,
        roleCode: worker.role_code,
        roleDescription: worker.role_description || '',
        procurementTeam: worker.procurement_teams?.name,
        email: worker.email || undefined
      };
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },

  async verifyToken(): Promise<boolean> {
    // For now, just check if token exists in localStorage
    const token = localStorage.getItem('authToken');
    return !!token;
  }
};