import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message = 'אירעה שגיאה בטעינת הנתונים',
  onRetry,
  showRetry = true
}) => {
  return (
    <Alert variant="destructive" className="max-w-md mx-auto">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="text-right">
        <div className="space-y-3">
          <p>{message}</p>
          {showRetry && onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              נסה שוב
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorMessage;