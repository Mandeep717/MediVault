import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useMember } from '@/integrations';

export default function Header() {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const navigate = useNavigate();

  const handleLogout = () => {
    actions.logout();
    navigate('/');
  };

  return (
    <header className="w-full bg-background border-b-2 border-secondary">
      <div className="max-w-[100rem] mx-auto px-8 md:px-16">
        <div className="flex items-center justify-between py-6">
          <Link to="/" className="font-heading text-2xl md:text-3xl text-secondary">
            HealthCare Records
          </Link>

          <nav className="flex items-center gap-6">
            {isLoading && (
              <div className="font-paragraph text-sm text-secondary">Loading...</div>
            )}
            
            {!isAuthenticated && !isLoading && (
              <>
                <Link 
                  to="/login" 
                  className="font-paragraph text-base text-secondary hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/lab-login" 
                  className="font-paragraph text-base text-secondary hover:text-primary transition-colors"
                >
                  Lab Login
                </Link>
                <Link to="/patient-portal">
                  <button className="bg-primary text-primary-foreground font-paragraph text-sm px-6 py-3 hover:bg-accentbluelight transition-colors">
                    Patient Portal
                  </button>
                </Link>
              </>
            )}

            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className="font-paragraph text-base text-secondary hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 font-paragraph text-base text-secondary hover:text-primary transition-colors"
                >
                  <User size={18} />
                  <span>{member?.profile?.nickname || 'Profile'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-secondary text-secondary-foreground font-paragraph text-sm px-6 py-3 hover:bg-primary transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
