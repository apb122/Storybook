/**
 * Main Application Layout Component
 *
 * Provides the three-column structure for the entire application:
 * - Header with app title and controls
 * - Left sidebar with navigation
 * - Center content area (main outlet)
 * - Right sidebar with inspector/AI panel
 */

import { Outlet } from 'react-router-dom'
import { SidebarNav } from './SidebarNav'

/**
 * AppLayout Component
 *
 * Wraps all page content with consistent header, navigation, and sidebar.
 * The center column uses <Outlet> from React Router to render matched route content.
 */
export function AppLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">StoryForge</h1>
          <p className="text-sm text-gray-500">Professional Story Planning & Creation</p>
        </div>
      </header>

      {/* Main Content Area - Three Columns */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
          <SidebarNav />
        </aside>

        {/* Center - Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Right Sidebar - Inspector/AI Panel */}
        <aside className="w-80 bg-white border-l border-gray-200 shadow-sm overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">AI Inspector</h2>
            <p className="text-sm text-gray-500">Real-time suggestions & analysis</p>
          </div>

          {/* Status Badges */}
          <div className="space-y-3 mb-6">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-900">✓ Ready</p>
              <p className="text-xs text-green-700 mt-1">System is online and ready</p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900">💡 Tip</p>
              <p className="text-xs text-blue-700 mt-1">
                Use the story structure tools to organize your narrative
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Quick Actions</p>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors text-left">
                🔄 Refresh Analysis
              </button>
              <button className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors text-left">
                ⚙️ Inspector Settings
              </button>
              <button className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors text-left">
                📖 View Docs
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
