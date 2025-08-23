/*
  # Populate workers table with demo users

  1. New Data
    - Add demo users to workers table with proper organizational structure
    - Include all role types: System Admin, Procurement Manager, Team Leader, Procurement Officer, Requester
    - Set up proper relationships with divisions, departments, and procurement teams

  2. Prerequisites
    - Ensures required organizational data exists (divisions, departments, procurement teams, organizational roles)
    - Creates missing organizational structure if needed

  3. Security
    - All users have simple password '123456' for demo purposes
    - Proper role assignments for testing different permission levels
*/

-- First, ensure we have the required organizational roles
INSERT INTO organizational_roles (role_code, description, permissions) VALUES
  (0, 'מנהלן מערכת', 'full_system_access'),
  (1, 'מנהל רכש', 'procurement_management'),
  (2, 'ראש צוות', 'team_leadership'),
  (3, 'קניין', 'procurement_officer'),
  (4, 'גורם דורש', 'requester'),
  (5, 'מנהל יחידה', 'unit_management'),
  (6, 'חבר הנהלה', 'executive'),
  (9, 'גורם טכני', 'technical_support')
ON CONFLICT (role_code) DO NOTHING;

-- Ensure we have basic divisions
INSERT INTO divisions (id, name, is_internal) VALUES
  (1, 'אגף טכנולוגיות', true),
  (2, 'אגף משאבי אנוש', true),
  (3, 'אגף כספים', true),
  (4, 'אגף תפעול', true)
ON CONFLICT (id) DO NOTHING;

-- Ensure we have basic departments
INSERT INTO departments (id, name, division_id) VALUES
  (1, 'מחלקת פיתוח', 1),
  (2, 'מחלקת גיוס', 2),
  (3, 'מחלקת חשבונות', 3),
  (4, 'מחלקת לוגיסטיקה', 4)
ON CONFLICT (id) DO NOTHING;

-- Ensure we have procurement teams
INSERT INTO procurement_teams (id, name) VALUES
  (1, 'צוות רכש טכנולוגיות'),
  (2, 'צוות רכש כללי'),
  (3, 'צוות רכש תשתיות')
ON CONFLICT (id) DO NOTHING;

-- Now add the demo users
INSERT INTO workers (id, employee_id, full_name, role_code, role_description, division_id, department_id, procurement_team_id, password, available_work_days, email) VALUES
  (1, '1001', 'מנהל רכש ראשי', 1, 'מנהל רכש', 1, 1, 1, '123456', 250, 'manager@company.com'),
  (2, '2001', 'ראש צוות רכש', 2, 'ראש צוות', 1, 1, 1, '123456', 250, 'teamlead@company.com'),
  (3, '3001', 'קניין בכיר', 3, 'קניין', 1, 1, 1, '123456', 250, 'officer@company.com'),
  (4, '4001', 'גורם דורש', 4, 'גורם דורש', 2, 2, NULL, '123456', 250, 'requester@company.com'),
  (5, '5001', 'מנהל יחידה', 5, 'מנהל יחידה', 3, 3, NULL, '123456', 250, 'unit@company.com'),
  (6, '6001', 'חבר הנהלה', 6, 'חבר הנהלה', 4, 4, NULL, '123456', 250, 'executive@company.com'),
  (7, '9001', 'גורם טכני', 9, 'גורם טכני', 1, 1, NULL, '123456', 250, 'tech@company.com'),
  (8, '9999', 'מנהלן מערכת', 0, 'מנהלן מערכת', 1, 1, NULL, '123456', 250, 'admin@company.com')
ON CONFLICT (employee_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role_code = EXCLUDED.role_code,
  role_description = EXCLUDED.role_description,
  division_id = EXCLUDED.division_id,
  department_id = EXCLUDED.department_id,
  procurement_team_id = EXCLUDED.procurement_team_id,
  password = EXCLUDED.password,
  available_work_days = EXCLUDED.available_work_days,
  email = EXCLUDED.email;