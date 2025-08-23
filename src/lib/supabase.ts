import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on the schema
export interface Database {
  public: {
    Tables: {
      workers: {
        Row: {
          id: number;
          employee_id: string;
          full_name: string;
          role_code: number;
          role_description?: string;
          division_id?: number;
          department_id?: number;
          procurement_team_id?: number;
          password: string;
          available_work_days?: number;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          employee_id: string;
          full_name: string;
          role_code: number;
          role_description?: string;
          division_id?: number;
          department_id?: number;
          procurement_team_id?: number;
          password: string;
          available_work_days?: number;
          email?: string;
        };
        Update: {
          employee_id?: string;
          full_name?: string;
          role_code?: number;
          role_description?: string;
          division_id?: number;
          department_id?: number;
          procurement_team_id?: number;
          password?: string;
          available_work_days?: number;
          email?: string;
        };
      };
      organizational_roles: {
        Row: {
          id: number;
          role_code: number;
          description: string;
          permissions?: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          role_code: number;
          description: string;
          permissions?: string;
        };
        Update: {
          role_code?: number;
          description?: string;
          permissions?: string;
        };
      };
      divisions: {
        Row: {
          id: number;
          name: string;
          is_internal?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          name: string;
          is_internal?: boolean;
        };
        Update: {
          name?: string;
          is_internal?: boolean;
        };
      };
      departments: {
        Row: {
          id: number;
          name: string;
          division_id?: number;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          name: string;
          division_id?: number;
        };
        Update: {
          name?: string;
          division_id?: number;
        };
      };
      procurement_teams: {
        Row: {
          id: number;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          name: string;
        };
        Update: {
          name?: string;
        };
      };
      domains: {
        Row: {
          id: number;
          description: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          description: string;
        };
        Update: {
          description?: string;
        };
      };
      activity_pool: {
        Row: {
          id: number;
          name: string;
          tools_and_resources?: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          name: string;
          tools_and_resources?: string;
        };
        Update: {
          name?: string;
          tools_and_resources?: string;
        };
      };
      engagement_types: {
        Row: {
          id: number;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          name: string;
        };
        Update: {
          name?: string;
        };
      };
      engagement_type_processes: {
        Row: {
          engagement_type_id: number;
          station_id: number;
          activity_id: number;
          created_at?: string;
        };
        Insert: {
          engagement_type_id: number;
          station_id: number;
          activity_id: number;
        };
        Update: {
          engagement_type_id?: number;
          station_id?: number;
          activity_id?: number;
        };
      };
      programs: {
        Row: {
          task_id: number;
          work_year: number;
          required_quarter?: string;
          title: string;
          description?: string;
          requester_id: number;
          division_id: number;
          department_id?: number;
          domain_id?: number;
          estimated_amount?: number;
          currency?: string;
          supplier_list?: string;
          justification?: string;
          planning_source: string;
          complexity?: number;
          engagement_type_id?: number;
          status: string;
          assigned_officer_id?: number;
          required_start_date?: string;
          planning_notes?: string;
          officer_notes?: string;
          last_update?: string;
          created_at?: string;
        };
        Insert: {
          work_year: number;
          required_quarter?: string;
          title: string;
          description?: string;
          requester_id: number;
          division_id: number;
          department_id?: number;
          domain_id?: number;
          estimated_amount?: number;
          currency?: string;
          supplier_list?: string;
          justification?: string;
          planning_source: string;
          complexity?: number;
          engagement_type_id?: number;
          status?: string;
          assigned_officer_id?: number;
          required_start_date?: string;
          planning_notes?: string;
          officer_notes?: string;
        };
        Update: {
          work_year?: number;
          required_quarter?: string;
          title?: string;
          description?: string;
          requester_id?: number;
          division_id?: number;
          department_id?: number;
          domain_id?: number;
          estimated_amount?: number;
          currency?: string;
          supplier_list?: string;
          justification?: string;
          planning_source?: string;
          complexity?: number;
          engagement_type_id?: number;
          status?: string;
          assigned_officer_id?: number;
          required_start_date?: string;
          planning_notes?: string;
          officer_notes?: string;
        };
      };
      program_tasks: {
        Row: {
          program_id: number;
          station_id: number;
          activity_id?: number;
          is_last_station?: boolean;
          completion_date?: string;
          reference?: string;
          station_notes?: string;
          reporting_user_id?: number;
          last_update?: string;
        };
        Insert: {
          program_id: number;
          station_id: number;
          activity_id?: number;
          is_last_station?: boolean;
          completion_date?: string;
          reference?: string;
          station_notes?: string;
          reporting_user_id?: number;
        };
        Update: {
          program_id?: number;
          station_id?: number;
          activity_id?: number;
          is_last_station?: boolean;
          completion_date?: string;
          reference?: string;
          station_notes?: string;
          reporting_user_id?: number;
        };
      };
      complexity_estimates: {
        Row: {
          id: number;
          estimate_level_1?: number;
          estimate_level_2?: number;
          estimate_level_3?: number;
          updated_at?: string;
        };
        Insert: {
          estimate_level_1?: number;
          estimate_level_2?: number;
          estimate_level_3?: number;
        };
        Update: {
          estimate_level_1?: number;
          estimate_level_2?: number;
          estimate_level_3?: number;
        };
      };
      acceptance_options: {
        Row: {
          id: number;
          year_id: number;
          upload_code: string;
          upload_code_description: string;
          broad_meaning?: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          year_id: number;
          upload_code: string;
          upload_code_description: string;
          broad_meaning?: string;
        };
        Update: {
          year_id?: number;
          upload_code?: string;
          upload_code_description?: string;
          broad_meaning?: string;
        };
      };
      status_values: {
        Row: {
          id: number;
          open_label?: string;
          plan_label?: string;
          in_progress_label?: string;
          complete_label?: string;
          done_label?: string;
          freeze_label?: string;
          cancel_label?: string;
          updated_at?: string;
        };
        Insert: {
          open_label?: string;
          plan_label?: string;
          in_progress_label?: string;
          complete_label?: string;
          done_label?: string;
          freeze_label?: string;
          cancel_label?: string;
        };
        Update: {
          open_label?: string;
          plan_label?: string;
          in_progress_label?: string;
          complete_label?: string;
          done_label?: string;
          freeze_label?: string;
          cancel_label?: string;
        };
      };
      structure_values: {
        Row: {
          id: number;
          division_label?: string;
          department_label?: string;
          team_label?: string;
          updated_at?: string;
        };
        Insert: {
          division_label?: string;
          department_label?: string;
          team_label?: string;
        };
        Update: {
          division_label?: string;
          department_label?: string;
          team_label?: string;
        };
      };
      permissions: {
        Row: {
          id: number;
          assign_permissions?: string;
          close_permissions?: string;
          updated_at?: string;
        };
        Insert: {
          assign_permissions?: string;
          close_permissions?: string;
        };
        Update: {
          assign_permissions?: string;
          close_permissions?: string;
        };
      };
    };
  };
}