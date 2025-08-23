import { supabase } from '../lib/supabase';
import { mockUsers, findUserByEmployeeId, validateUserPassword } from '../data/mockUsers';

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
  async login(employeeId: string, password: string, useDemo: boolean = false): Promise<AuthUser | null> {
    console.log('🔍 Login attempt with mode:', { employeeId, password, useDemo });
    
    if (useDemo) {
      console.log('🔍 Using demo authentication');
      return this.loginDemo(employeeId, password);
    }
    
    console.log('🔍 Attempting real DB login with:', { employeeId, password });
    
    try {
      // First, let's check if there are any workers in the database at all
      const { data: allWorkers, error: countError } = await supabase
        .from('workers')
        .select('id, employee_id, full_name')
        .limit(10);
      
      console.log('🔍 Total workers in database:', allWorkers?.length || 0);
      console.log('🔍 Sample workers:', allWorkers);
      
      if (countError) {
        console.error('❌ Error querying workers table:', countError);
      }
      
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
          procurement_teams (
            name
          )
        `)
        .eq('employee_id', employeeId)
        .maybeSingle();

      console.log('🔍 Supabase query result:', { worker, error });

      if (error || !worker) {
        console.error('❌ User not found:', { employeeId, error });
        return null;
      }

      console.log('🔍 Found worker:', worker);
      console.log('🔍 Password comparison:', { 
        provided: password, 
        stored: worker.password, 
        match: worker.password === password 
      });

      // Validate password
      if (worker.password !== password) {
        console.error('❌ Invalid password for user:', employeeId);
        return null;
      }

      console.log('✅ Authentication successful for:', worker.full_name);

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

  async loginDemo(employeeId: string, password: string): Promise<AuthUser | null> {
    try {
      const user = findUserByEmployeeId(employeeId);
      if (!user) {
        return null;
      }

      if (!validateUserPassword(user, password)) {
        return null;
      }

      return {
        id: user.id,
        employeeId: user.employeeId,
        fullName: user.fullName,
        roleCode: user.roleCode,
        roleDescription: user.roleDescription,
        procurementTeam: user.procurementTeam,
        email: user.email
      };
    } catch (error) {
      console.error('Demo login error:', error);
      return null;
    }
  },

  async verifyToken(): Promise<boolean> {
    // For now, just check if token exists in localStorage
    const token = localStorage.getItem('authToken');
    return !!token;
  }
};