import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout() {
  useEffect(() => {
    // Set initial body class for theme
    document.body.classList.add('mocha');
  }, []);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default Layout; 