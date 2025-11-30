
import { NavLink } from 'react-router-dom';

const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Story Bible', path: '/project/:projectId/bible' }, // Placeholder path logic
    { name: 'Plot', path: '/project/:projectId/plot' },
    { name: 'Timeline', path: '/project/:projectId/timeline' },
    { name: 'AI Workshop', path: '/project/:projectId/workshop' },
    { name: 'Exports', path: '/project/:projectId/exports' },
];

export const SidebarNav: React.FC = () => {
    return (
        <nav className="flex flex-col w-64 bg-gray-900 text-gray-300 h-full border-r border-gray-800">
            <div className="p-4 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white tracking-tight">StoryForge</h2>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path.replace(':projectId', '1')} // Temporary hardcoded ID for demo
                                className={({ isActive }) =>
                                    `block px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? 'bg-indigo-600 text-white'
                                        : 'hover:bg-gray-800 hover:text-white'
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="p-4 border-t border-gray-800">
                <div className="text-xs text-gray-500">v0.1.0 Alpha</div>
            </div>
        </nav>
    );
};
