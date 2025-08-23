import React from 'react';
import { useMode } from '../../contexts/ModeContext';
import { Button } from '../ui/button';
import { Database, TestTube } from 'lucide-react';

const ModeToggle: React.FC = () => {
  const { mode, toggleMode, tenantName, isDemo, isReal } = useMode();

  return (
    <div className="flex items-center gap-3">
      {/* Tenant Info */}
      {isReal && tenantName && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">DB:</span> {tenantName}
        </div>
      )}
      
      {/* Mode Toggle Button */}
      <Button
        onClick={toggleMode}
        variant="outline"
        size="sm"
        className={`flex items-center gap-2 border-2 font-medium transition-all ${
          isDemo 
            ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100' 
            : 'border-red-500 bg-red-50 text-red-700 hover:bg-red-100'
        }`}
      >
        {isDemo ? (
          <>
            <TestTube className="w-4 h-4" />
            <span>מצב הדגמה</span>
          </>
        ) : (
          <>
            <Database className="w-4 h-4" />
            <span>מצב אמת</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default ModeToggle;