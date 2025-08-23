
import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AssignPermissions, ClosePermissions } from '../../types';
import { dataService } from '../../services/dataService';
import { useEffect } from 'react';

const Permissions: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const [permissions, setPermissions] = useState({
    assignPermissions: '' as AssignPermissions,
    closePermissions: '' as ClosePermissions
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await dataService.getPermissions();
      
      setPermissions({
        assignPermissions: (data.assign_permissions as AssignPermissions) || 'Manager only',
        closePermissions: (data.close_permissions as ClosePermissions) || 'Automatic'
      });
    } catch (error) {
      console.error('Error loading permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignOptions = [
    { value: 'Manager only', label: 'Manager only - מנהל רכש בלבד' },
    { value: 'Team leader', label: 'Team leader - ראש צוות' }
  ];

  const closeOptions = [
    { value: 'Automatic', label: 'Automatic - סגירה אוטומטית' },
    { value: 'Manager only', label: 'Manager only - מנהל רכש בלבד' },
    { value: 'Team leader', label: 'Team leader - ראש צוות' }
  ];

  const handleSave = () => {
    const saveData = async () => {
      try {
        const dbData = {
          assign_permissions: permissions.assignPermissions,
          close_permissions: permissions.closePermissions
        };
        
        await dataService.updatePermissions(dbData);
        
        toast({
          title: "הצלחה",
          description: "הגדרות ההרשאות נשמרו בהצלחה"
        });
      } catch (error) {
        console.error('Error saving permissions:', error);
        toast({
          title: "שגיאה",
          description: error instanceof Error ? error.message : "שגיאה בשמירת הנתונים",
          variant: "destructive"
        });
      }
    };
    
    saveData();
  };

  if (loading) {
    return (
      <AppLayout currentRoute="/infrastructure-maintenance">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">טוען נתונים...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout currentRoute="/infrastructure-maintenance">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/infrastructure-maintenance')}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              חזרה לתחזוקת תשתיות
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 text-right">
              הרשאות מערכת
            </h1>
          </div>
          
          <Card>
            <CardHeader className="text-right">
              <CardTitle className="text-xl">הגדרת הרשאות לטיפול במשימות</CardTitle>
              <p className="text-gray-600 mt-1">Permissions - סמכויות ראשי צוותים לטיפול במשימות</p>
            </CardHeader>
            <CardContent className="space-y-8" dir="rtl">
              <div className="space-y-4">
                <Label className="text-right font-medium text-lg">
                  הרשאות שיבוץ קניינים (Assign Permissions)
                </Label>
                <Select 
                  value={permissions.assignPermissions} 
                  onValueChange={(value: AssignPermissions) => 
                    setPermissions(prev => ({ ...prev, assignPermissions: value }))
                  }
                >
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="בחר הרשאת שיבוץ" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <p className="font-medium mb-2">הסבר על ערכי הרשאות השיבוץ:</p>
                  <p><strong>Manager only:</strong> שיבוץ קניינים מבוצע אך ורק על ידי מנהל הרכש</p>
                  <p><strong>Team leader:</strong> ראש צוות יכול לשבץ ולשנות קניינים במשימות</p>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-right font-medium text-lg">
                  הרשאות סגירת משימות (Close Permissions)
                </Label>
                <Select 
                  value={permissions.closePermissions} 
                  onValueChange={(value: ClosePermissions) => 
                    setPermissions(prev => ({ ...prev, closePermissions: value }))
                  }
                >
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="בחר הרשאת סגירה" />
                  </SelectTrigger>
                  <SelectContent>
                    {closeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <p className="font-medium mb-2">הסבר על ערכי הרשאות הסגירה:</p>
                  <p><strong>Automatic:</strong> סגירה אוטומטית לאחר השלמת התחנה האחרונה</p>
                  <p><strong>Manager only:</strong> רק מנהל הרכש יכול לסגור סופית משימות</p>
                  <p><strong>Team leader:</strong> גם ראש צוות יכול לסגור משימות של הצוות שלו</p>
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button onClick={handleSave} className="px-8">
                  שמירת הגדרות
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Permissions;
