/*
  # מילוי טבלת העובדים בנתוני הדמה

  1. נתונים חדשים
    - הוספת כל 8 המשתמשים מנתוני הדמה
    - כולל קודי עובד, שמות, תפקידים וסיסמאות
    - שיוך לאגפים, מחלקות וצוותי רכש לפי התפקיד

  2. פרטי התחברות
    - כל הסיסמאות: 123456
    - קודי עובד: 9999, 1001, 2001, 3001, 4001, 5001, 6001, 9001
*/

-- מחיקת נתונים קיימים (אם יש)
DELETE FROM workers;

-- הוספת כל המשתמשים מנתוני הדמה
INSERT INTO workers (
  employee_id, 
  full_name, 
  role_code, 
  role_description, 
  division_id, 
  department_id, 
  procurement_team_id, 
  password, 
  available_work_days, 
  email
) VALUES
-- מנהל מערכת
('9999', 'מנהל מערכת', 0, 'מנהלן מערכת', NULL, NULL, NULL, '123456', NULL, 'admin@company.com'),

-- מנהל רכש
('1001', 'דוד כהן', 1, 'מנהל רכש', NULL, NULL, NULL, '123456', NULL, 'david.cohen@company.com'),

-- ראש צוות
('2001', 'שרה לוי', 2, 'ראש צוות', NULL, NULL, 1, '123456', 200, 'sara.levi@company.com'),

-- קניין
('3001', 'אבי כהן', 3, 'קניין', NULL, NULL, 2, '123456', 200, 'avi.cohen@company.com'),

-- גורם דורש
('4001', 'רחל אברהם', 4, 'גורם דורש', 1, 1, NULL, '123456', NULL, 'rachel.abraham@company.com'),

-- מנהל יחידה
('5001', 'יוסי לוי', 5, 'מנהל יחידה', 2, 3, NULL, '123456', NULL, 'yossi.levi@company.com'),

-- חבר הנהלה
('6001', 'מירי דוד', 6, 'חברי הנהלה וגורם מטה ארגוני', NULL, NULL, NULL, '123456', NULL, 'miri.david@company.com'),

-- גורם טכני
('9001', 'טכני מערכת', 9, 'גורם טכני', NULL, NULL, NULL, '123456', NULL, 'tech@company.com');