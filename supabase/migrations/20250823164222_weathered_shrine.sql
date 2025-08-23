/*
  # Add demo users to workers table

  1. New Tables
    - Populates `workers` table with demo users
    - Adds organizational roles, divisions, departments, and procurement teams
  
  2. Security
    - Uses existing RLS policies
    - Inserts data that matches demo user credentials
  
  3. Users Added
    - 1001: דוד כהן (מנהל רכש)
    - 2001: שרה לוי (ראש צוות)
    - 3001: אבי כהן (קניין)
    - 4001: רחל אברהם (גורם דורש)
    - 5001: יוסי לוי (מנהל יחידה)
    - 6001: מירי דוד (חברי הנהלה)
    - 9001: טכני מערכת (גורם טכני)
    - 9999: מנהל מערכת (מנהלן מערכת)
*/

-- Insert organizational roles
INSERT INTO organizational_roles (role_code, description, permissions) VALUES
(0, 'מנהלן מערכת', 'מלא'),
(1, 'מנהל רכש', 'ניהול רכש'),
(2, 'ראש צוות', 'ניהול צוות'),
(3, 'קניין', 'ביצוע רכש'),
(4, 'גורם דורש', 'הגשת דרישות'),
(5, 'מנהל יחידה', 'ניהול יחידה'),
(6, 'חברי הנהלה וגורם מטה ארגוני', 'צפייה'),
(9, 'גורם טכני', 'תחזוקה טכנית')
ON CONFLICT (role_code) DO NOTHING;

-- Insert divisions
INSERT INTO divisions (name, is_internal) VALUES
('לוגיסטיקה', true),
('טכנולוגיה', true),
('מחקר ופיתוח', true),
('משאבי אנוש', true),
('מכירות', true),
('תפעול', true)
ON CONFLICT DO NOTHING;

-- Insert departments
INSERT INTO departments (name, division_id) VALUES
('רכש וחוזים', (SELECT id FROM divisions WHERE name = 'לוגיסטיקה' LIMIT 1)),
('תפעול ותחזוקה', (SELECT id FROM divisions WHERE name = 'לוגיסטיקה' LIMIT 1)),
('מערכות מידע', (SELECT id FROM divisions WHERE name = 'טכנולוגיה' LIMIT 1)),
('פיתוח תוכנה', (SELECT id FROM divisions WHERE name = 'טכנולוגיה' LIMIT 1)),
('מחקר', (SELECT id FROM divisions WHERE name = 'מחקר ופיתוח' LIMIT 1)),
('פיתוח', (SELECT id FROM divisions WHERE name = 'מחקר ופיתוח' LIMIT 1)),
('גיוס', (SELECT id FROM divisions WHERE name = 'משאבי אנוש' LIMIT 1)),
('שכר', (SELECT id FROM divisions WHERE name = 'משאבי אנוש' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Insert procurement teams
INSERT INTO procurement_teams (name) VALUES
('צוות טכנולוגי'),
('צוות לוגיסטי'),
('צוות ביטחוני'),
('צוות מחשוב')
ON CONFLICT DO NOTHING;

-- Insert demo users
INSERT INTO workers (employee_id, full_name, role_code, role_description, password, email, procurement_team_id, division_id, department_id, available_work_days) VALUES
('9999', 'מנהל מערכת', 0, 'מנהלן מערכת', '123456', 'admin@company.com', NULL, NULL, NULL, NULL),
('1001', 'דוד כהן', 1, 'מנהל רכש', '123456', 'david.cohen@company.com', NULL, NULL, NULL, NULL),
('2001', 'שרה לוי', 2, 'ראש צוות', '123456', 'sara.levi@company.com', (SELECT id FROM procurement_teams WHERE name = 'צוות טכנולוגי' LIMIT 1), NULL, NULL, 200),
('3001', 'אבי כהן', 3, 'קניין', '123456', 'avi.cohen@company.com', (SELECT id FROM procurement_teams WHERE name = 'צוות לוגיסטי' LIMIT 1), NULL, NULL, 200),
('4001', 'רחל אברהם', 4, 'גורם דורש', '123456', 'rachel.abraham@company.com', NULL, (SELECT id FROM divisions WHERE name = 'לוגיסטיקה' LIMIT 1), (SELECT id FROM departments WHERE name = 'רכש וחוזים' LIMIT 1), NULL),
('5001', 'יוסי לוי', 5, 'מנהל יחידה', '123456', 'yossi.levi@company.com', NULL, (SELECT id FROM divisions WHERE name = 'טכנולוגיה' LIMIT 1), (SELECT id FROM departments WHERE name = 'מערכות מידע' LIMIT 1), NULL),
('6001', 'מירי דוד', 6, 'חברי הנהלה וגורם מטה ארגוני', '123456', 'miri.david@company.com', NULL, NULL, NULL, NULL),
('9001', 'טכני מערכת', 9, 'גורם טכני', '123456', 'tech@company.com', NULL, NULL, NULL, NULL)
ON CONFLICT (employee_id) DO NOTHING;