import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden md:ml-64">
        <Header onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
