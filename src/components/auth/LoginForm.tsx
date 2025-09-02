import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { LoginRequest } from '../../lib/api-client';

interface LoginFormProps {
  onLogin: (credentials: LoginRequest) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate input
    if (!employeeId || employeeId.length !== 4) {
      setError('קוד משתמש חייב להיות בן 4 ספרות');
      setIsLoading(false);
      return;
    }

    if (!password || password.length !== 6) {
      setError('סיסמה חייבת להיות בת 6 תווים');
      setIsLoading(false);
      return;
    }

    try {
      await onLogin({ employeeId, password });
    } catch (error) {
      setError('שגיאה בהתחברות. אנא בדוק את הפרטים ונסה שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/image.png" 
              alt="PROJECTOR Logo" 
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            כניסה למערכת
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="text-right">
                קוד עובד (4 ספרות)
              </Label>
              <Input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="text-right text-lg"
                placeholder="1001"
                maxLength={4}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-right">
                סיסמה (6 תווים)
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value.slice(0, 6))}
                className="text-right text-lg"
                placeholder="••••••"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription className="text-right">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full text-lg py-3"
              disabled={isLoading}
            >
              {isLoading ? 'מתחבר...' : 'כניסה למערכת'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <div className="border-t pt-4">
              <p className="text-xs text-gray-500">
                הזן את קוד העובד והסיסמה שלך כפי שהוגדרו בטבלת העובדים
              </p>
              <div className="mt-2 text-xs text-gray-400">
                <p>עובדי דמו: 1001-1008 | סיסמה: 123456</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;