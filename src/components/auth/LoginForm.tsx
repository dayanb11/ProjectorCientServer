import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { authService } from '../../services/authService';
import { useMode } from '../../contexts/ModeContext';

interface LoginFormProps {
  onLogin: (user: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const { isDemo } = useMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Capture the current mode at the start of login to prevent race conditions
    const currentMode = isDemo;
    console.log('🔍 Current mode in LoginForm:', currentMode ? 'demo' : 'real');

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
      // Authenticate based on current mode
      const user = await authService.login(employeeId, password, currentMode);
      
      if (!user) {
        setError('קוד משתמש או סיסמה שגויים');
        setIsLoading(false);
        return;
      }

      // Store mock token
      localStorage.setItem('authToken', 'mock-token-' + user.id);
      
      // Transform the user data to match our frontend format
      const transformedUser = {
        id: user.id,
        employeeId: user.employeeId,
        fullName: user.fullName,
        roleCode: user.roleCode,
        roleDescription: user.roleDescription,
        procurementTeam: user.procurementTeam,
        email: user.email
      };

      toast({
        title: "התחברות הצליחה",
        description: `ברוך הבא ${user.fullName}`,
      });
      
      onLogin(transformedUser);
    } catch (error) {
      console.error('Login error:', error);
      setError('שגיאה בהתחברות. אנא נסה שוב.');
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
                קוד משתמש (4 ספרות)
              </Label>
              <Input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="text-right text-lg"
                placeholder="0000"
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
              <p className="font-medium mb-2">
                {isDemo ? 'התחברות עם נתוני הדגמה' : 'התחברות עם מסד הנתונים'}
              </p>
              <p className="text-xs text-gray-500">
                {isDemo 
                  ? 'השתמש בקודי עובד מנתוני הדמה (1001-9001) עם סיסמה 123456'
                  : 'השתמש בקוד עובד וסיסמה שהוגדרו במסד הנתונים האמיתי'
                }
              </p>
              {!isDemo && (
                <p className="text-xs text-orange-600 mt-2">
                  שים לב: במצב אמת, עליך להשתמש בקודי עובד וסיסמאות שקיימים במסד הנתונים
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;