/*
  # מילוי טבלאות המערכת בנתונים בסיסיים

  1. נתונים בסיסיים
    - תפקידים ארגוניים (organizational_roles)
    - אגפים (divisions)
    - מחלקות (departments)
    - צוותי רכש (procurement_teams)
    - תחומי רכש (domains)
    - פעילויות רכש (activity_pool)
    - סוגי התקשרויות (engagement_types)
    - תהליכי סוגי התקשרויות (engagement_type_processes)
    - הגדרות מערכת (status_values, structure_values, permissions, complexity_estimates)

  2. משתמשי מערכת
    - מנהל מערכת (9999)
    - מנהל רכש (1001)
    - ראש צוות (2001)
    - קניין (3001)
    - גורם דורש (4001)
    - מנהל יחידה (5001)
    - חבר הנהלה (6001)
    - גורם טכני (9001)

  3. הגדרות מערכת
    - ערכי סטטוס עבריים
    - כינויי מבנה ארגוני
    - הרשאות מערכת
    - הערכות מורכבות
*/

-- תפקידים ארגוניים
INSERT INTO organizational_roles (role_code, description, permissions) VALUES
(0, 'מנהלן מערכת', 'הרשאות מלאות למערכת'),
(1, 'מנהל רכש', 'ניהול תהליכי רכש וצוותים'),
(2, 'ראש צוות', 'ניהול צוות רכש'),
(3, 'קניין', 'ביצוע פעילויות רכש'),
(4, 'גורם דורש', 'הגשת דרישות רכש'),
(5, 'מנהל יחידה', 'ניהול יחידה ארגונית'),
(6, 'חברי הנהלה וגורם מטה ארגוני', 'צפייה ומעקב'),
(9, 'גורם טכני', 'תחזוקה טכנית של המערכת')
ON CONFLICT (role_code) DO UPDATE SET
description = EXCLUDED.description,
permissions = EXCLUDED.permissions;

-- אגפים
INSERT INTO divisions (name, is_internal) VALUES
('לוגיסטיקה', true),
('טכנולוגיה', true),
('מחקר ופיתוח', true),
('משאבי אנוש', true),
('מכירות', true),
('תפעול', true),
('אבטחה', true),
('משפטי', true)
ON CONFLICT DO NOTHING;

-- מחלקות
INSERT INTO departments (name, division_id) VALUES
('רכש וחוזים', 1),
('תפעול ותחזוקה', 1),
('מערכות מידע', 2),
('פיתוח תוכנה', 2),
('מחקר', 3),
('פיתוח', 3),
('גיוס', 4),
('שכר', 4),
('שיווק', 5),
('מכירות', 5),
('מתקנים', 6),
('צי רכב', 6),
('אבטחה פיזית', 7),
('ייעוץ משפטי', 8),
('תשתיות', 2)
ON CONFLICT DO NOTHING;

-- צוותי רכש
INSERT INTO procurement_teams (name) VALUES
('צוות טכנולוגי'),
('צוות לוגיסטי'),
('צוות ביטחוני'),
('צוות מחשוב'),
('צוות שירותים'),
('צוות רכש כללי')
ON CONFLICT DO NOTHING;

-- תחומי רכש
INSERT INTO domains (description) VALUES
('רכש לוגיסטי'),
('רכש טכנולוגי'),
('שירותים מקצועיים'),
('תחזוקה ותפעול'),
('ציוד משרדי'),
('תוכנה ומערכות'),
('ציוד מחשוב'),
('תקשורת'),
('ריהוט'),
('מערכות אבטחה'),
('רכבים')
ON CONFLICT DO NOTHING;

-- פעילויות רכש
INSERT INTO activity_pool (name, tools_and_resources) VALUES
('בדיקת הצעות מחיר', 'מערכת השוואת מחירים'),
('הכנת מפרט טכני', 'תבניות מפרט'),
('פרסום מכרז', 'מערכת פרסום'),
('הערכת הצעות', 'מטריצת הערכה'),
('בחירת זוכה', 'ועדת הערכה'),
('חתימה על הסכם', 'מערכת ניהול חוזים'),
('בקרת איכות', 'רשימת בדיקות'),
('אישור תשלום', 'מערכת כספים'),
('מעקב ביצוע', 'מערכת מעקב'),
('סגירת פרויקט', 'דוח סיכום'),
('דו"ח סיכום', 'תבנית דוח')
ON CONFLICT DO NOTHING;

-- סוגי התקשרויות
INSERT INTO engagement_types (name) VALUES
('מכרז פומבי'),
('מכרז מוגבל'),
('מכרז פתוח מוגבל'),
('רכש השוואתי')
ON CONFLICT DO NOTHING;

-- תהליכי סוגי התקשרויות
INSERT INTO engagement_type_processes (engagement_type_id, station_id, activity_id) VALUES
-- מכרז פומבי (כל 10 התחנות)
(1, 1, 1), (1, 2, 2), (1, 3, 3), (1, 4, 4), (1, 5, 5),
(1, 6, 6), (1, 7, 7), (1, 8, 8), (1, 9, 9), (1, 10, 10),
-- מכרז מוגבל (5 תחנות)
(2, 1, 1), (2, 2, 2), (2, 3, 4), (2, 4, 5), (2, 5, 6),
-- מכרז פתוח מוגבל (4 תחנות)
(3, 1, 1), (3, 2, 2), (3, 3, 3), (3, 4, 5),
-- רכש השוואתי (3 תחנות)
(4, 1, 1), (4, 2, 5), (4, 3, 6)
ON CONFLICT DO NOTHING;

-- משתמשי מערכת
INSERT INTO workers (employee_id, full_name, role_code, role_description, password, email, procurement_team_id) VALUES
('9999', 'מנהל מערכת', 0, 'מנהלן מערכת', '123456', 'admin@company.com', NULL),
('1001', 'דוד כהן', 1, 'מנהל רכש', '123456', 'david.cohen@company.com', NULL),
('2001', 'שרה לוי', 2, 'ראש צוות', '123456', 'sara.levi@company.com', 1),
('3001', 'אבי כהן', 3, 'קניין', '123456', 'avi.cohen@company.com', 2),
('4001', 'רחל אברהם', 4, 'גורם דורש', '123456', 'rachel.abraham@company.com', NULL),
('5001', 'יוסי לוי', 5, 'מנהל יחידה', '123456', 'yossi.levi@company.com', NULL),
('6001', 'מירי דוד', 6, 'חברי הנהלה וגורם מטה ארגוני', '123456', 'miri.david@company.com', NULL),
('9001', 'טכני מערכת', 9, 'גורם טכני', '123456', 'tech@company.com', NULL)
ON CONFLICT (employee_id) DO UPDATE SET
full_name = EXCLUDED.full_name,
role_code = EXCLUDED.role_code,
role_description = EXCLUDED.role_description,
email = EXCLUDED.email,
procurement_team_id = EXCLUDED.procurement_team_id;

-- הגדרות ערכי סטטוס
INSERT INTO status_values (id, open_label, plan_label, in_progress_label, complete_label, done_label, freeze_label, cancel_label) VALUES
(1, 'פתוח', 'תכנון', 'בביצוע', 'הושלם', 'סגור', 'הקפאה', 'ביטול')
ON CONFLICT (id) DO UPDATE SET
open_label = EXCLUDED.open_label,
plan_label = EXCLUDED.plan_label,
in_progress_label = EXCLUDED.in_progress_label,
complete_label = EXCLUDED.complete_label,
done_label = EXCLUDED.done_label,
freeze_label = EXCLUDED.freeze_label,
cancel_label = EXCLUDED.cancel_label;

-- הגדרות כינויי מבנה ארגוני
INSERT INTO structure_values (id, division_label, department_label, team_label) VALUES
(1, 'אגף', 'מחלקה', 'צוות')
ON CONFLICT (id) DO UPDATE SET
division_label = EXCLUDED.division_label,
department_label = EXCLUDED.department_label,
team_label = EXCLUDED.team_label;

-- הגדרות הרשאות מערכת
INSERT INTO permissions (id, assign_permissions, close_permissions) VALUES
(1, 'Manager only', 'Automatic')
ON CONFLICT (id) DO UPDATE SET
assign_permissions = EXCLUDED.assign_permissions,
close_permissions = EXCLUDED.close_permissions;

-- הערכות מורכבות
INSERT INTO complexity_estimates (id, estimate_level_1, estimate_level_2, estimate_level_3) VALUES
(1, 5, 10, 20)
ON CONFLICT (id) DO UPDATE SET
estimate_level_1 = EXCLUDED.estimate_level_1,
estimate_level_2 = EXCLUDED.estimate_level_2,
estimate_level_3 = EXCLUDED.estimate_level_3;