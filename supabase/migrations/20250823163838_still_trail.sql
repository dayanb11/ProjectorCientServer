/*
  # Populate workers table with demo users

  1. New Records
    - Add demo users to workers table
    - Users: 1001 (מנהל רכש), 2001 (ראש צוות), 3001 (קניין), 4001 (גורם דורש), etc.
    - All users have password '123456'
  
  2. Security
    - Uses existing RLS policies on workers table
*/

-- Insert demo users into workers table
INSERT INTO workers (employee_id, full_name, role_code, role_description, password, email, available_work_days, procurement_team_id) VALUES
('9999', 'מנהל מערכת', 0, 'מנהלן מערכת', '123456', 'admin@company.com', NULL, NULL),
('1001', 'דוד כהן', 1, 'מנהל רכש', '123456', 'david.cohen@company.com', NULL, NULL),
('2001', 'שרה לוי', 2, 'ראש צוות', '123456', 'sara.levi@company.com', 200, 1),
('3001', 'אבי כהן', 3, 'קניין', '123456', 'avi.cohen@company.com', 200, 2),
('4001', 'רחל אברהם', 4, 'גורם דורש', '123456', 'rachel.abraham@company.com', NULL, NULL),
('5001', 'יוסי לוי', 5, 'מנהל יחידה', '123456', 'yossi.levi@company.com', NULL, NULL),
('6001', 'מירי דוד', 6, 'חברי הנהלה וגורם מטה ארגוני', '123456', 'miri.david@company.com', NULL, NULL),
('9001', 'טכני מערכת', 9, 'גורם טכני', '123456', 'tech@company.com', NULL, NULL)
ON CONFLICT (employee_id) DO NOTHING;