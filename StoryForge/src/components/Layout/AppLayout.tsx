
import { Outlet } from 'react-router-dom';
import { SidebarNav } from './SidebarNav';

export const AppLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
            {/* Left Sidebar */}
            <SidebarNav />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header (Optional, can be part of pages or global) */}
                <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-6 justify-between shrink-0">
                    <div className="text-sm font-medium text-gray-400">Current Project: <span className="text-white ml-1">The Lost Star</span></div>
                    <div className="flex items-center space-x-4">
                        {/* Placeholder for user/settings */}
                        <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto p-6">
                    <Outlet />
                </div>
            </main>

            {/* Right Inspector Panel (Placeholder) */}
            <aside className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col shrink-0">
                <div className="p-4 border-b border-gray-800">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Inspector</h3>
                </div>
                <div className="flex-1 p-4 text-sm text-gray-500">
                    <p>Select an element to view details or use AI tools here.</p>
                </div>
            </aside>
        </div>
    );
};
