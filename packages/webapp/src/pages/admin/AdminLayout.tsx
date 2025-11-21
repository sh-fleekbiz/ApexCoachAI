import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Admin</h1>
        </div>
        <nav>
          <ul>
            <li><NavLink to="/admin/people" className="block p-4 hover:bg-gray-200">People</NavLink></li>
            <li><NavLink to="/admin/programs" className="block p-4 hover:bg-gray-200">Programs</NavLink></li>
            <li><NavLink to="/admin/knowledge-base" className="block p-4 hover:bg-gray-200">Knowledge Base</NavLink></li>
            <li><NavLink to="/admin/meta-prompts" className="block p-4 hover:bg-gray-200">Meta Prompts</NavLink></li>
            <li><NavLink to="/admin/analytics" className="block p-4 hover:bg-gray-200">Analytics</NavLink></li>
          </ul>
        </nav>
      </div>
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
