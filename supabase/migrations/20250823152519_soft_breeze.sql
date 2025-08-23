/*
  # הוספת משתמשי מערכת

  1. New Records
    - הוספת מנהל מערכת (9999) עם תפקיד 0
    - הוספת מנהל רכש (1001) עם תפקיד 1
  
  2. Security
    - הרשומות נוספות לטבלת workers עם כל השדות הנדרשים
    - סיסמאות ברירת מחדל: 123456
*/

-- הוספת מנהל המערכת (קוד עובד 9999, תפקיד 0)
INSERT INTO workers (
  employee_id,
  full_name,
  role_code,
  role_description,
  password,
  email
) VALUES (
  '9999',
  'מנהל מערכת',
  0,
  'מנהלן מערכת',
  '123456',
  'admin@company.com'
) ON CONFLICT (employee_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role_code = EXCLUDED.role_code,
  role_description = EXCLUDED.role_description,
  password = EXCLUDED.password,
  email = EXCLUDED.email;

-- הוספת מנהל רכש (קוד עובד 1001, תפקיד 1)
INSERT INTO workers (
  employee_id,
  full_name,
  role_code,
  role_description,
  password,
  email
) VALUES (
  '1001',
  'דוד כהן',
  1,
  'מנהל רכש',
  '123456',
  'david.cohen@company.com'
) ON CONFLICT (employee_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role_code = EXCLUDED.role_code,
  role_description = EXCLUDED.role_description,
  password = EXCLUDED.password,
  email = EXCLUDED.email;