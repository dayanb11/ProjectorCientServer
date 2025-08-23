import React from 'react';
import { Home, ShoppingCart, TrendingUp, Scale, Users, BarChart3, FileText, Search, UserCheck, Network, Wrench, Settings, PenTool as Tool, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useMode } from '../../contexts/ModeContext';
import { Button } from '../ui/button';
import ModeToggle from '../common/ModeToggle';

const iconMap = {
  Home,
  ShoppingCart,
  TrendingUp,
  Scale,
  Users,
  BarChart3,
  FileText,
  Search,
  UserCheck,
  Network,
  Wrench,
  Settings,
  Tool
};

interface NavItem {
  id: string;
  label: string;
  icon: string;
  roles: number[];
  route: string;
  isPlaceholder?: boolean;
}

interface AppLayoutProps {
  children: React.ReactNode;
  currentRoute?: string;
  pageTitle?: string;
}

const getPageTitle = (route: string) => {
  const routeMap: { [key: string]: string } = {
    '/': 'שולחן עבודה',
    '/new-task': 'דרישה חדשה',
    '/progress-tracking': 'מעקב התקדמות',
    '/planning-convergence': 'התכנסות תכנון',
    '/procurement-load': 'העמסת קניינים',
    '/work-plan': 'תוכנית עבודה',
    '/overall-tracking': 'מעקב כולל',
    '/detailed-tracking': 'מעקב מפורט',
    '/procurement-staff': 'עובדי הרכש',
    '/engagement-types': 'סוגי התקשרויות',
    '/planning-helpers': 'עזרי תכנון',
    '/system-settings': 'הגדרות המערכת',
    '/infrastructure-maintenance': 'תחזוקת תשתיות'
  };
  
  return routeMap[route] || 'שולחן עבודה';
};

// Navigation items with role-based access according to the new specification
const navigationItems: NavItem[] = [
  {
    id: '1',
    label: 'שולחן עבודה',
    icon: 'Home',
    roles: [1, 2, 3, 4], // מנהל רכש, ראש צוות, קניין, גורם דורש
    route: '/'
  },
  {
    id: '2',
    label: 'דרישה חדשה',
    icon: 'ShoppingCart',
    roles: [1, 4], // מנהל רכש, גורם דורש
    route: '/new-task'
  },
  {
    id: '3',
    label: 'מעקב התקדמות',
    icon: 'TrendingUp',
    roles: [1], // מנהל רכש בלבד
    route: '/progress-tracking'
  },
  {
    id: '4',
    label: 'התכנסות תכנון',
    icon: 'Scale',
    roles: [1], // מנהל רכש בלבד
    route: '/planning-convergence'
  },
  {
    id: '5',
    label: 'העמסת קניינים',
    icon: 'Users',
    roles: [1, 2], // מנהל רכש, ראש צוות
    route: '/procurement-load'
  },
  {
    id: '6',
    label: 'תוכנית עבודה',
    icon: 'BarChart3',
    roles: [1, 4, 5, 6], // מנהל רכש, גורם דורש, מנהל יחידה, חברי הנהלה וגורם מטה ארגוני
    route: '/work-plan',
    isPlaceholder: true
  },
  {
    id: '7',
    label: 'מעקב כולל',
    icon: 'FileText',
    roles: [1, 4, 5, 6], // מנהל רכש, גורם דורש, מנהל יחידה, חברי הנהלה וגורם מטה ארגוני
    route: '/overall-tracking',
    isPlaceholder: true
  },
  {
    id: '8',
    label: 'מעקב מפורט',
    icon: 'Search',
    roles: [1, 4, 5, 6], // מנהל רכש, גורם דורש, מנהל יחידה, חברי הנהלה וגורם מטה ארגוני
    route: '/detailed-tracking',
    isPlaceholder: true
  },
  {
    id: '9',
    label: 'עובדי הרכש',
    icon: 'UserCheck',
    roles: [0, 1], // מנהלן מערכת, מנהל רכש
    route: '/procurement-staff'
  },
  {
    id: '10',
    label: 'סוגי התקשרויות',
    icon: 'Network',
    roles: [0, 1, 9], // מנהלן מערכת, מנהל רכש, גורם טכני
    route: '/engagement-types'
  },
  {
    id: '11',
    label: 'עזרי תכנון',
    icon: 'Wrench',
    roles: [0, 1, 9], // מנהלן מערכת, מנהל רכש, גורם טכני
    route: '/planning-helpers'
  },
  {
    id: '12',
    label: 'הגדרות המערכת',
    icon: 'Settings',
    roles: [0, 9], // מנהלן מערכת, גורם טכני
    route: '/system-settings'
  },
  {
    id: '13',
    label: 'תחזוקת תשתיות',
    icon: 'Tool',
    roles: [9], // גורם טכני בלבד
    route: '/infrastructure-maintenance'
  }
];

const AppLayout: React.FC<AppLayoutProps> = ({ children, currentRoute = '/', pageTitle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDemo } = useMode();
  
  if (!user) {
    return null; // This should not happen as the app should redirect to login
  }

  // Filter navigation items based on user role
  const getFilteredNavItems = () => {
    return navigationItems.filter(item => {
      return item.roles.includes(user.roleCode);
    });
  };

  const userNavItems = getFilteredNavItems();

  const handleNavigation = (route: string, isPlaceholder?: boolean) => {
    if (isPlaceholder) {
      // For placeholder items, show a message instead of navigating
      alert('מסך זה עדיין לא מוכן. יהיה זמין בגרסה הבאה של המערכת.');
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayPageTitle = pageTitle || getPageTitle(currentRoute);

  return (
    <div className="min-h-screen bg-gray-50 flex w-full" dir="rtl">
      {/* Right Sidebar - Navigation */}
      <div className="w-64 bg-white shadow-lg border-l border-gray-200">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-center">
            <img 
              src="/image.png" 
              alt="PROJECTOR Logo" 
              className="h-10 w-auto"
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {userNavItems.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              const isActive = item.route === currentRoute;
              
              // Add safety check for undefined icons
              if (!Icon) {
                console.warn(`Icon "${item.icon}" not found in iconMap`);
                return null;
              }
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.route, item.isPlaceholder)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-right text-sm ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                        : item.isPlaceholder
                          ? 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                          : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    disabled={item.isPlaceholder}
                  >
                    <Icon className={`w-5 h-5 ${item.isPlaceholder ? 'text-gray-400' : ''}`} />
                    <span className={`font-medium ${item.isPlaceholder ? 'text-gray-500' : ''}`}>
                      {item.label}
                      {item.isPlaceholder && <span className="text-xs mr-2">(בפיתוח)</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info and Logout */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
          <div className="text-sm text-gray-600 mb-3 text-right">
            <div className="font-medium">{user.fullName}</div>
            <div className="text-xs">{user.roleDescription}</div>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            size="sm" 
            className="w-full flex items-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" />
            יציאה
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-gray-800">
                {displayPageTitle}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <ModeToggle />
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
              <span className="font-medium text-gray-800">{user.fullName}</span>
            </div>
          </div>
          
          {/* Demo Mode Indicator */}
          {isDemo && (
            <div className="bg-green-100 border-t border-green-200 px-6 py-2">
              <div className="flex items-center justify-center">
                <span className="text-green-800 text-sm font-medium">
                  🧪 מצב הדגמה פעיל - עובד עם נתוני דמה בלבד
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;