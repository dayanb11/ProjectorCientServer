/*
  # הוספת משתמשים חסרים לטבלת העובדים

  1. משתמשים חדשים
    - מנהל מערכת (9999)
    - דוד כהן - מנהל רכש (1001)
    - שרה לוי - ראש צוות (2001)
    - אבי כהן - קניין (3001)
    - רחל אברהם - גורם דורש (4001)
    - יוסי לוי - מנהל יחידה (5001)
    - מירי דוד - חברת הנהלה (6001)
    - טכני מערכת (9001)

  2. אבטחה
    - כל המשתמשים עם סיסמה 123456
    - קודי עובד ייחודיים בני 4 ספרות
*/

-- הוספת משתמשי מערכת
INSERT INTO workers (employee_id, full_name, role_code, role_description, division_id, department_id, procurement_team_id, password, available_work_days, email) VALUES
('9999', 'מנהל מערכת', 9, 'מנהל מערכת', 1, 1, NULL, '123456', 250, 'admin@system.local'),
('1001', 'דוד כהן', 1, 'מנהל רכש', 2, 3, 1, '123456', 250, 'david.cohen@company.local'),
('2001', 'שרה לוי', 2, 'ראש צוות', 1, 2, 2, '123456', 250, 'sarah.levi@company.local'),
('3001', 'אבי כהן', 3, 'קניין', 2, 3, 3, '123456', 250, 'avi.cohen@company.local'),
('4001', 'רחל אברהם', 4, 'גורם דורש', 2, 4, NULL, '123456', 250, 'rachel.abraham@company.local'),
('5001', 'יוסי לוי', 5, 'מנהל יחידה', 1, 2, NULL, '123456', 250, 'yossi.levi@company.local'),
('6001', 'מירי דוד', 6, 'חברת הנהלה', 1, 1, NULL, '123456', 250, 'miri.david@company.local'),
('9001', 'טכני מערכת', 9, 'טכני מערכת', 1, 1, 4, '123456', 250, 'tech@system.local')
ON CONFLICT (employee_id) DO NOTHING;