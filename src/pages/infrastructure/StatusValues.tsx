
import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { dataService } from '../../services/dataService';
import { useEffect } from 'react';

const StatusValues: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const [statusValues, setStatusValues] = useState({
    open: '',
    plan: '',
    inProgress: '',
    complete: '',
    done: '',
    freeze: '',
    cancel: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await dataService.getStatusValues();
      
      setStatusValues({
        open: data.open_label || 'פתוח',
        plan: data.plan_label || 'תכנון',
        inProgress: data.in_progress_label || 'בביצוע',
        complete: data.complete_label || 'הושלם',
        done: data.done_label || 'סגור',
        freeze: data.freeze_label || 'הקפאה',
        cancel: data.cancel_label || 'ביטול'
      });
    } catch (error) {
      console.error('Error loading status values:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusFields = [
    { key: 'open', label: 'Open - סטטוס פתיחה', placeholder: 'דוגמאות: דרישה / הקמה / פתיחה' },
    { key: 'plan', label: 'Plan - סטטוס תכנון', placeholder: 'דוגמאות: מתוכנן / משובץ / לביצוע' },
    { key: 'inProgress', label: 'In Progress - סטטוס בביצוע', placeholder: 'דוגמאות: בטיפול / בביצוע / בתהליך' },
    { key: 'complete', label: 'Complete - סטטוס הושלם', placeholder: 'דוגמאות: סגור / בוצע / הסתיים' },
    { key: 'done', label: 'Done - סטטוס סגור', placeholder: 'דוגמאות: סגור / בוצע / סופק' },
    { key: 'freeze', label: 'Freeze - סטטוס הקפאה', placeholder: 'דוגמאות: מוקפא / בהמתנה / זמנית' },
    { key: 'cancel', label: 'Cancel - סטטוס ביטול', placeholder: 'דוגמאות: בוטל / מבוטל' }
  ];

  const handleInputChange = (key: string, value: string) => {
    setStatusValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const saveData = async () => {
      try {
        const dbData = {
          open_label: statusValues.open,
          plan_label: statusValues.plan,
          in_progress_label: statusValues.inProgress,
          complete_label: statusValues.complete,
          done_label: statusValues.done,
          freeze_label: statusValues.freeze,
          cancel_label: statusValues.cancel
        };
        
        await dataService.updateStatusValues(dbData);
        
        toast({
          title: "הצלחה",
          description: "כינויי הסטטוס נשמרו בהצלחה"
        });
      } catch (error) {
        console.error('Error saving status values:', error);
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
              כינויי סטטוס
            </h1>
          </div>
          
          <Card>
            <CardHeader className="text-right">
              <CardTitle className="text-xl">הגדרת כינויים עבריים לסטטוסי משימות</CardTitle>
              <p className="text-gray-600 mt-1">Status Value - קביעת הכינויים העבריים לסטטוסים</p>
            </CardHeader>
            <CardContent className="space-y-6" dir="rtl">
              {statusFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key} className="text-right font-medium">
                    {field.label}
                  </Label>
                  <Input
                    id={field.key}
                    value={statusValues[field.key as keyof typeof statusValues]}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="text-right"
                  />
                </div>
              ))}
              
              <div className="flex justify-center pt-4">
                <Button onClick={handleSave} className="px-8">
                  שמירת שינויים
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default StatusValues;
