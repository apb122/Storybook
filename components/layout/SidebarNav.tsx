/**
 * Navigation Sidebar Component
 *
 * Displays the main navigation menu with links to different sections
 * of the StoryForge application.
 */

import { NavLink } from "react-router-dom";

/**
 * Navigation item configuration
 */
interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/", icon: "📊" },
  { label: "Story Bible", path: "#story-bible", icon: "📚" },
  { label: "Plot", path: "#plot", icon: "🎬" },
  { label: "Timeline", path: "#timeline", icon: "📅" },
  { label: "AI Workshop", path: "#ai-workshop", icon: "🤖" },
  { label: "Exports", path: "#exports", icon: "📤" },
];

/**
 * SidebarNav Component
 *
 * Renders a vertical navigation sidebar with active link highlighting
 * using Tailwind CSS. Links use React Router's NavLink component
 * for client-side routing without full page reloads.
 */
export function SidebarNav() {
  return (
    <nav className="w-56 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo/Branding */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">StoryForge</h1>
        <p className="text-xs text-gray-500 mt-1">Story Planning</p>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm">
          + New Project
        </button>
      </div>
    </nav>
  );
}
