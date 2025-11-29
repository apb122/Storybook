/**
 * Three-column layout component for StoryForge
 * - Left sidebar: Navigation placeholder
 * - Main content: Primary content area
 * - Right sidebar: AI/Inspector placeholder
 */

import { useProjectCount } from '@/state'

export function Layout() {
  // Get project count from Zustand store
  const projectCount = useProjectCount()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">StoryForge</h1>
          <p className="text-sm text-gray-500 mt-1">Story Creation Tool</p>
          <div className="mt-3 px-3 py-2 bg-blue-50 rounded-lg">
            <p className="text-xs font-semibold text-blue-900">
              {projectCount} {projectCount === 1 ? 'Project' : 'Projects'}
            </p>
          </div>
        </div>

        <nav className="px-4 py-6 space-y-2">
          <a
            href="#"
            className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            📝 New Story
          </a>
          <a
            href="#"
            className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            📚 My Stories
          </a>
          <a
            href="#"
            className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            🔖 Drafts
          </a>
          <a
            href="#"
            className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            ⭐ Favorites
          </a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <header className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to StoryForge
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Craft compelling narratives with the power of AI-assisted writing
            </p>
          </header>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI-Powered Writing
              </h3>
              <p className="text-gray-600">
                Get intelligent suggestions and insights to enhance your storytelling.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Creative Tools
              </h3>
              <p className="text-gray-600">
                Access a comprehensive suite of writing and editing tools.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analytics
              </h3>
              <p className="text-gray-600">
                Track your writing progress and get detailed insights.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Publish & Share
              </h3>
              <p className="text-gray-600">
                Share your stories with readers around the world.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Start Writing Now
            </button>
          </div>
        </div>
      </main>

      {/* Right Sidebar - AI Inspector / Tools */}
      <aside className="w-64 bg-white border-l border-gray-200 shadow-sm overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">AI Inspector</h3>
          <p className="text-xs text-gray-500 mt-1">Real-time suggestions</p>
        </div>

        <div className="p-4 space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">💡 Tip</p>
            <p className="text-xs text-blue-700 mt-1">
              Focus on character development to create more engaging stories.
            </p>
          </div>

          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-900">✓ Ready</p>
            <p className="text-xs text-green-700 mt-1">
              Your workspace is synchronized and ready to use.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs font-semibold text-gray-600 uppercase">
              Quick Actions
            </p>
            <button className="w-full mt-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors text-left">
              🔄 Refresh
            </button>
            <button className="w-full mt-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors text-left">
              ⚙️ Settings
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
