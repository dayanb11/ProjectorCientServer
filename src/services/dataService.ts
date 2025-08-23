import { supabase } from '../lib/supabase';
import { Program, ProgramTask, ActivityPool } from '../types';

export const dataService = {
  // Workers
  async getWorkers() {
    const { data, error } = await supabase
      .from('workers')
      .select(`
        *,
        divisions!division_id (name),
        departments!department_id (name),
        procurement_teams!procurement_team_id (name)
      `)
      .order('employee_id');

    if (error) throw error;
    return data;
  },

  async createWorker(worker: any) {
    const { data, error } = await supabase
      .from('workers')
      .insert(worker)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateWorker(id: number, updates: any) {
    const { data, error } = await supabase
      .from('workers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteWorker(id: number) {
    const { error } = await supabase
      .from('workers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Organizational Roles
  async getOrganizationalRoles() {
    const { data, error } = await supabase
      .from('organizational_roles')
      .select('*')
      .order('role_code');

    if (error) throw error;
    return data;
  },

  async createOrganizationalRole(role: any) {
    const { data, error } = await supabase
      .from('organizational_roles')
      .insert(role)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateOrganizationalRole(id: number, updates: any) {
    const { data, error } = await supabase
      .from('organizational_roles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteOrganizationalRole(id: number) {
    const { error } = await supabase
      .from('organizational_roles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Divisions
  async getDivisions() {
    const { data, error } = await supabase
      .from('divisions')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  async createDivision(division: any) {
    const { data, error } = await supabase
      .from('divisions')
      .insert(division)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDivision(id: number, updates: any) {
    const { data, error } = await supabase
      .from('divisions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteDivision(id: number) {
    const { error } = await supabase
      .from('divisions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Departments
  async getDepartments() {
    const { data, error } = await supabase
      .from('departments')
      .select(`
        *,
        divisions!division_id (name)
      `)
      .order('name');

    if (error) throw error;
    return data;
  },

  async createDepartment(department: any) {
    const { data, error } = await supabase
      .from('departments')
      .insert(department)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDepartment(id: number, updates: any) {
    const { data, error } = await supabase
      .from('departments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteDepartment(id: number) {
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Procurement Teams
  async getProcurementTeams() {
    const { data, error } = await supabase
      .from('procurement_teams')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  async createProcurementTeam(team: any) {
    const { data, error } = await supabase
      .from('procurement_teams')
      .insert(team)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProcurementTeam(id: number, updates: any) {
    const { data, error } = await supabase
      .from('procurement_teams')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProcurementTeam(id: number) {
    const { error } = await supabase
      .from('procurement_teams')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Domains
  async getDomains() {
    const { data, error } = await supabase
      .from('domains')
      .select('*')
      .order('description');

    if (error) throw error;
    return data;
  },

  async createDomain(domain: any) {
    const { data, error } = await supabase
      .from('domains')
      .insert(domain)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDomain(id: number, updates: any) {
    const { data, error } = await supabase
      .from('domains')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteDomain(id: number) {
    const { error } = await supabase
      .from('domains')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Activity Pool
  async getActivityPool() {
    const { data, error } = await supabase
      .from('activity_pool')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  async createActivity(activity: any) {
    const { data, error } = await supabase
      .from('activity_pool')
      .insert(activity)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateActivity(id: number, updates: any) {
    const { data, error } = await supabase
      .from('activity_pool')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteActivity(id: number) {
    const { error } = await supabase
      .from('activity_pool')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Engagement Types
  async getEngagementTypes() {
    const { data, error } = await supabase
      .from('engagement_types')
      .select(`
        *,
        engagement_type_processes (
          station_id,
          activity_id
        )
      `)
      .order('name');

    if (error) throw error;
    return data;
  },

  async createEngagementType(engagementType: any) {
    const { data, error } = await supabase
      .from('engagement_types')
      .insert(engagementType)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateEngagementType(id: number, updates: any) {
    const { data, error } = await supabase
      .from('engagement_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteEngagementType(id: number) {
    const { error } = await supabase
      .from('engagement_types')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Engagement Type Processes
  async updateEngagementTypeProcesses(engagementTypeId: number, processes: any[]) {
    // Delete existing processes
    await supabase
      .from('engagement_type_processes')
      .delete()
      .eq('engagement_type_id', engagementTypeId);

    // Insert new processes
    if (processes.length > 0) {
      const { error } = await supabase
        .from('engagement_type_processes')
        .insert(processes);

      if (error) throw error;
    }
  },

  // Programs
  async getPrograms() {
    const { data, error } = await supabase
      .from('programs')
      .select(`
        *,
        workers!requester_id (full_name),
        workers!assigned_officer_id (full_name),
        divisions!division_id (name),
        departments!department_id (name),
        domains!domain_id (description),
        engagement_types!engagement_type_id (name),
        program_tasks (
          station_id,
          activity_id,
          completion_date,
          reference,
          station_notes,
          reporting_user_id,
          is_last_station,
          last_update,
          activity_pool!activity_id (name)
        )
      `)
      .order('task_id', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createProgram(program: any) {
    const { data, error } = await supabase
      .from('programs')
      .insert(program)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProgram(taskId: number, updates: any) {
    const { data, error } = await supabase
      .from('programs')
      .update(updates)
      .eq('task_id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProgram(taskId: number) {
    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('task_id', taskId);

    if (error) throw error;
  },

  // Program Tasks
  async updateProgramTasks(programId: number, tasks: any[]) {
    // Delete existing tasks
    await supabase
      .from('program_tasks')
      .delete()
      .eq('program_id', programId);

    // Insert new tasks
    if (tasks.length > 0) {
      const { error } = await supabase
        .from('program_tasks')
        .insert(tasks);

      if (error) throw error;
    }
  },

  // Complexity Estimates
  async getComplexityEstimates() {
    const { data, error } = await supabase
      .from('complexity_estimates')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || { estimate_level_1: 5, estimate_level_2: 10, estimate_level_3: 20 };
  },

  async updateComplexityEstimates(estimates: any) {
    // Try to update existing record first
    const { data: existing } = await supabase
      .from('complexity_estimates')
      .select('id')
      .limit(1)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('complexity_estimates')
        .update(estimates)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('complexity_estimates')
        .insert(estimates)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  // Acceptance Options
  async getAcceptanceOptions() {
    const { data, error } = await supabase
      .from('acceptance_options')
      .select('*')
      .order('year_id', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createAcceptanceOption(option: any) {
    const { data, error } = await supabase
      .from('acceptance_options')
      .insert(option)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAcceptanceOption(id: number, updates: any) {
    const { data, error } = await supabase
      .from('acceptance_options')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAcceptanceOption(id: number) {
    const { error } = await supabase
      .from('acceptance_options')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Status Values
  async getStatusValues() {
    const { data, error } = await supabase
      .from('status_values')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || {
      open_label: 'פתוח',
      plan_label: 'תכנון',
      in_progress_label: 'בביצוע',
      complete_label: 'הושלם',
      done_label: 'סגור',
      freeze_label: 'הקפאה',
      cancel_label: 'ביטול'
    };
  },

  async updateStatusValues(values: any) {
    // Try to update existing record first
    const { data: existing } = await supabase
      .from('status_values')
      .select('id')
      .limit(1)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('status_values')
        .update(values)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('status_values')
        .insert(values)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  // Structure Values
  async getStructureValues() {
    const { data, error } = await supabase
      .from('structure_values')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || {
      division_label: 'אגף',
      department_label: 'מחלקה',
      team_label: 'צוות'
    };
  },

  async updateStructureValues(values: any) {
    // Try to update existing record first
    const { data: existing } = await supabase
      .from('structure_values')
      .select('id')
      .limit(1)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('structure_values')
        .update(values)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('structure_values')
        .insert(values)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  // Permissions
  async getPermissions() {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || {
      assign_permissions: 'Manager only',
      close_permissions: 'Automatic'
    };
  },

  async updatePermissions(permissions: any) {
    // Try to update existing record first
    const { data: existing } = await supabase
      .from('permissions')
      .select('id')
      .limit(1)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('permissions')
        .update(permissions)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('permissions')
        .insert(permissions)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }
};