/*
  # Populate demo users in real database

  1. New Data
    - Add all demo users from mockUsers.ts to the workers table
    - Include all role codes (0-6, 9) with proper Hebrew descriptions
    - Set up procurement team associations
    - Use same passwords as demo (123456)

  2. Security
    - Users can read their own worker data
    - Service role can manage all worker data
*/

-- Insert demo users into workers table
INSERT INTO workers (
  employee_id,
  full_name,
  role_code,
  role_description,
  procurement_team_id,
  password,
  available_work_days,
  email,
  division_id,
  department_id
) VALUES
  ('9999', 'מנהל מערכת', 0, 'מנהלן מערכת', NULL, '123456', NULL, 'admin@company.com', NULL, NULL),
  ('1001', 'דוד כהן', 1, 'מנהל רכש', NULL, '123456', NULL, 'david.cohen@company.com', NULL, NULL),
  ('2001', 'שרה לוי', 2, 'ראש צוות', 2, '123456', 200, 'sara.levi@company.com', NULL, NULL),
  ('3001', 'אבי כהן', 3, 'קניין', 3, '123456', 200, 'avi.cohen@company.com', NULL, NULL),
  ('4001', 'רחל אברהם', 4, 'גורם דורש', NULL, '123456', NULL, 'rachel.abraham@company.com', 1, 1),
  ('5001', 'יוסי לוי', 5, 'מנהל יחידה', NULL, '123456', NULL, 'yossi.levi@company.com', 2, 3),
  ('6001', 'מירי דוד', 6, 'חברי הנהלה וגורם מטה ארגוני', NULL, '123456', NULL, 'miri.david@company.com', NULL, NULL),
  ('9001', 'טכני מערכת', 9, 'גורם טכני', NULL, '123456', NULL, 'tech@company.com', NULL, NULL)
ON CONFLICT (employee_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role_code = EXCLUDED.role_code,
  role_description = EXCLUDED.role_description,
  procurement_team_id = EXCLUDED.procurement_team_id,
  password = EXCLUDED.password,
  available_work_days = EXCLUDED.available_work_days,
  email = EXCLUDED.email,
  division_id = EXCLUDED.division_id,
  department_id = EXCLUDED.department_id,
  updated_at = now();