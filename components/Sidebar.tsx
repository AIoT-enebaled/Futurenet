
import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { NAV_ITEMS, AUTH_NAV_ITEMS, UNAUTH_NAV_ITEMS, ADMIN_NAV_ITEMS } from '../constants';
import { NavItem, User } from '../types';
import { MessageSquareIcon, LogOutIcon, MenuIcon, XIcon } from './icons';

interface SidebarProps {
  currentUser: User | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeClassName = "bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-lg shadow-brand-purple/40";
  const inactiveClassName = "text-brand-text-muted hover:bg-brand-surface-alt hover:text-brand-text";
  const iconActiveClassName = "text-white";
  const iconInactiveClassName = "text-brand-text-darker group-hover:text-brand-cyan";


  const handleLogoutClick = () => {
    onLogout();
    navigate('/login'); 
    setIsMobileMenuOpen(false);
  };

  const renderNavLinks = (items: NavItem[], filterRole?: 'instructor') => items
    .filter(item => {
        if (filterRole === 'instructor') {
            return item.isInstructor === true;
        }
        if (item.isInstructor) { // Exclude instructor-specific items from general rendering
            return false;
        }
        return true;
    })
    .map((item: NavItem) => (
    <NavLink
      key={item.name}
      to={item.path}
      onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on link click
      className={({ isActive }) =>
        `flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ease-in-out group text-sm font-medium ${isActive ? activeClassName : inactiveClassName}`
      }
    >
      {({isActive}) => (
         <>
           <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors duration-200 ease-in-out ${isActive ? iconActiveClassName : iconInactiveClassName }`} />
           {item.name}
         </>
      )}
    </NavLink>
  ));

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-brand-surface rounded-lg text-brand-text shadow-lg border border-brand-border/50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`w-60 flex-shrink-0 bg-brand-surface border-r border-brand-border/30 flex flex-col
                   transform ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} md:translate-x-0 
                   transition-transform duration-300 ease-in-out fixed md:static h-full z-40 md:z-auto`}
      >
        <div className="h-16 flex items-center justify-center border-b border-brand-border/30 px-4 shrink-0">
          <MessageSquareIcon className="h-7 w-7 text-brand-purple flex-shrink-0" />
          <span className="ml-2.5 text-lg font-bold text-brand-text truncate">GiiT Chat</span>
        </div>
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
          {renderNavLinks(NAV_ITEMS)}
          
          <hr className="my-3 border-brand-border/20" />

          {currentUser?.role === 'admin' && (
            <>
              {renderNavLinks(ADMIN_NAV_ITEMS)}
              <hr className="my-3 border-brand-border/20" />
            </>
          )}

          {currentUser ? (
            <>
              {renderNavLinks(AUTH_NAV_ITEMS)} {/* General authenticated items */}
              {currentUser.role === 'instructor' && renderNavLinks(AUTH_NAV_ITEMS, 'instructor')} {/* Instructor-specific items */}
              <button
                onClick={handleLogoutClick}
                className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ease-in-out group text-sm font-medium ${inactiveClassName}`}
              >
                <LogOutIcon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors duration-200 ease-in-out ${iconInactiveClassName} group-hover:text-brand-pink`} />
                Logout
              </button>
            </>
          ) : (
            renderNavLinks(UNAUTH_NAV_ITEMS)
          )}
        </nav>
        <div className="p-4 border-t border-brand-border/30 shrink-0">
          <p className="text-xs text-brand-text-darker text-center">&copy; {new Date().getFullYear()} GiiT. Futuristic & Connected.</p>
        </div>
      </aside>
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-brand-bg/70 backdrop-blur-sm z-30 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
