import { supabase } from '../lib/supabase';

export const databaseChecker = {
  async checkConnection() {
    console.log('🔍 Checking Supabase connection...');
    console.log('🔍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('🔍 Anon Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('workers')
        .select('count', { count: 'exact', head: true });
      
      console.log('🔍 Connection test result:', { data, error });
      
      if (error) {
        console.error('❌ Connection error:', error);
        return false;
      }
      
      console.log('✅ Database connection successful');
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  },

  async checkAllTables() {
    console.log('🔍 Checking database contents...');
    
    // First check connection
    const isConnected = await this.checkConnection();
    if (!isConnected) {
      console.error('❌ Cannot check tables - no database connection');
      return null;
    }
    
    try {
      // Check workers table
      const { data: workers, error: workersError } = await supabase
        .from('workers')
        .select('*');
      
      if (workersError) {
        console.error('❌ Error querying workers:', workersError);
      }
      
      console.log('👥 Workers table:', {
        count: workers?.length || 0,
        error: workersError,
        sample: workers?.slice(0, 3)
      });

      // Check organizational_roles table
      const { data: roles, error: rolesError } = await supabase
        .from('organizational_roles')
        .select('*');
      
      console.log('🏢 Organizational roles table:', {
        count: roles?.length || 0,
        error: rolesError,
        sample: roles?.slice(0, 3)
      });

      // Check divisions table
      const { data: divisions, error: divisionsError } = await supabase
        .from('divisions')
        .select('*');
      
      console.log('🏛️ Divisions table:', {
        count: divisions?.length || 0,
        error: divisionsError,
        sample: divisions?.slice(0, 3)
      });

      // Check departments table
      const { data: departments, error: departmentsError } = await supabase
        .from('departments')
        .select('*');
      
      console.log('🏢 Departments table:', {
        count: departments?.length || 0,
        error: departmentsError,
        sample: departments?.slice(0, 3)
      });

      // Check procurement_teams table
      const { data: teams, error: teamsError } = await supabase
        .from('procurement_teams')
        .select('*');
      
      console.log('👥 Procurement teams table:', {
        count: teams?.length || 0,
        error: teamsError,
        sample: teams?.slice(0, 3)
      });

      return {
        workers: { count: workers?.length || 0, data: workers },
        roles: { count: roles?.length || 0, data: roles },
        divisions: { count: divisions?.length || 0, data: divisions },
        departments: { count: departments?.length || 0, data: departments },
        teams: { count: teams?.length || 0, data: teams }
      };
    } catch (error) {
      console.error('❌ Error checking database:', error);
      return null;
    }
  },

  async populateBasicData() {
    console.log('🔧 Attempting to populate basic data...');
    
    try {
      // First, add organizational roles
      const rolesData = [
        { role_code: 0, description: 'מנהלן מערכת' },
        { role_code: 1, description: 'מנהל רכש' },
        { role_code: 2, description: 'ראש צוות' },
        { role_code: 3, description: 'קניין' },
        { role_code: 4, description: 'גורם דורש' },
        { role_code: 5, description: 'מנהל יחידה' },
        { role_code: 6, description: 'חברי הנהלה וגורם מטה ארגוני' },
        { role_code: 9, description: 'גורם טכני' }
      ];

      const { error: rolesError } = await supabase
        .from('organizational_roles')
        .upsert(rolesData, { onConflict: 'role_code' });

      if (rolesError) {
        console.error('❌ Error inserting roles:', rolesError);
        return false;
      }

      // Add divisions
      const divisionsData = [
        { name: 'לוגיסטיקה', is_internal: true },
        { name: 'טכנולוגיה', is_internal: true },
        { name: 'מחקר ופיתוח', is_internal: true },
        { name: 'משאבי אנוש', is_internal: true }
      ];

      const { data: insertedDivisions, error: divisionsError } = await supabase
        .from('divisions')
        .upsert(divisionsData, { onConflict: 'name' })
        .select();

      if (divisionsError) {
        console.error('❌ Error inserting divisions:', divisionsError);
        return false;
      }

      // Add procurement teams
      const teamsData = [
        { name: 'צוות טכנולוגי' },
        { name: 'צוות לוגיסטי' }
      ];

      const { data: insertedTeams, error: teamsError } = await supabase
        .from('procurement_teams')
        .upsert(teamsData, { onConflict: 'name' })
        .select();

      if (teamsError) {
        console.error('❌ Error inserting teams:', teamsError);
        return false;
      }

      // Add demo users
      const usersData = [
        {
          employee_id: '9999',
          full_name: 'מנהל מערכת',
          role_code: 0,
          role_description: 'מנהלן מערכת',
          password: '123456',
          email: 'admin@company.com'
        },
        {
          employee_id: '1001',
          full_name: 'דוד כהן',
          role_code: 1,
          role_description: 'מנהל רכש',
          password: '123456',
          email: 'david.cohen@company.com'
        },
        {
          employee_id: '2001',
          full_name: 'שרה לוי',
          role_code: 2,
          role_description: 'ראש צוות',
          password: '123456',
          email: 'sara.levi@company.com',
          procurement_team_id: insertedTeams?.find(t => t.name === 'צוות טכנולוגי')?.id
        },
        {
          employee_id: '3001',
          full_name: 'אבי כהן',
          role_code: 3,
          role_description: 'קניין',
          password: '123456',
          email: 'avi.cohen@company.com',
          procurement_team_id: insertedTeams?.find(t => t.name === 'צוות לוגיסטי')?.id
        },
        {
          employee_id: '4001',
          full_name: 'רחל אברהם',
          role_code: 4,
          role_description: 'גורם דורש',
          password: '123456',
          email: 'rachel.abraham@company.com',
          division_id: insertedDivisions?.find(d => d.name === 'לוגיסטיקה')?.id
        },
        {
          employee_id: '5001',
          full_name: 'יוסי לוי',
          role_code: 5,
          role_description: 'מנהל יחידה',
          password: '123456',
          email: 'yossi.levi@company.com',
          division_id: insertedDivisions?.find(d => d.name === 'טכנולוגיה')?.id
        }
      ];

      const { error: usersError } = await supabase
        .from('workers')
        .upsert(usersData, { onConflict: 'employee_id' });

      if (usersError) {
        console.error('❌ Error inserting users:', usersError);
        return false;
      }

      console.log('✅ Successfully populated basic data');
      return true;
    } catch (error) {
      console.error('❌ Error in populateBasicData:', error);
      return false;
    }
  }
};