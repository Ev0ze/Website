import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout() {
  useEffect(() => {
    // Set initial body class for theme
    // Remove any existing theme classes
    document.body.classList.remove('latte', 'frappe', 'macchiato', 'mocha');
    // Add default theme class
    document.body.classList.add('macchiato');
    
    // Apply theme to html element as well for complete coverage
    document.documentElement.className = 'macchiato';
    
    // Listen for theme changes on body and sync with html
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const bodyClasses = document.body.classList;
          const theme = Array.from(bodyClasses).find(cls => 
            ['latte', 'frappe', 'macchiato', 'mocha'].includes(cls)
          );
          
          if (theme) {
            document.documentElement.className = theme;
          }
        }
      });
    });
    
    observer.observe(document.body, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="app-container">
      <Header />
      <Outlet />
    </div>
  );
}

export default Layout; 