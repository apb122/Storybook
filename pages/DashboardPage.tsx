/**
 * Dashboard Page
 *
 * Landing page showing projects, recent activity, and quick actions.
 */

import { useNavigate } from 'react-router-dom'
import { useProjects, useProjectCount } from '@/state'

export function DashboardPage() {
  const navigate = useNavigate()
  const projects = useProjects()
  const projectCount = useProjectCount()

  const handleOpenProject = (projectId: string) => {
    navigate(`/project/${projectId}`)
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      {/* Page Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h2>
        <p className="text-xl text-gray-600">
          {projectCount === 0
            ? 'Create your first story project to get started'
            : `You have ${projectCount} ${projectCount === 1 ? 'project' : 'projects'}`}
        </p>
      </div>

      {/* Projects Section */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                  {project.subtitle && (
                    <p className="text-sm text-gray-500 mt-1">{project.subtitle}</p>
                  )}
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  {project.status}
                </span>
              </div>

              {project.genre && (
                <div className="mb-3">
                  <span className="text-xs text-gray-500">Genre: </span>
                  <span className="text-sm font-medium text-gray-700">{project.genre}</span>
                </div>
              )}

              {project.logline && (
                <p className="text-sm text-gray-600 mb-4 italic">"{project.logline}"</p>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleOpenProject(project.id)}
                  className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
                >
                  Open
                </button>
                <button className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-lg border-2 border-dashed border-gray-200 mb-12">
          <p className="text-lg text-gray-500 mb-4">No projects yet</p>
          <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            Create First Project
          </button>
        </div>
      )}

      {/* Getting Started Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl mb-2">1️⃣</div>
            <h4 className="font-semibold text-gray-900 mb-2">Create a Project</h4>
            <p className="text-sm text-gray-600">
              Start by creating a new story project and defining your genre, themes, and logline
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">2️⃣</div>
            <h4 className="font-semibold text-gray-900 mb-2">Build Your Bible</h4>
            <p className="text-sm text-gray-600">
              Create characters, locations, and items that define your story world
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">3️⃣</div>
            <h4 className="font-semibold text-gray-900 mb-2">Plan Your Plot</h4>
            <p className="text-sm text-gray-600">
              Organize your narrative into acts, chapters, and scenes using plot planning tools
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
