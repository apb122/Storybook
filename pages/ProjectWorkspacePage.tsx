/**
 * Project Workspace Page
 *
 * Main workspace for editing a specific story project.
 * Contains tabs for Overview, Story Bible, Plot, Timeline, AI Workshop, and Exports.
 */

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useStoryStore } from '@/state'

type TabId = 'overview' | 'bible' | 'plot' | 'timeline' | 'workshop' | 'exports'

const TABS: Array<{ id: TabId; label: string; icon: string }> = [
  { id: 'overview', label: 'Overview', icon: '📋' },
  { id: 'bible', label: 'Story Bible', icon: '📚' },
  { id: 'plot', label: 'Plot', icon: '🎬' },
  { id: 'timeline', label: 'Timeline', icon: '⏱️' },
  { id: 'workshop', label: 'AI Workshop', icon: '🤖' },
  { id: 'exports', label: 'Exports', icon: '📤' },
]

export function ProjectWorkspacePage() {
  const { projectId } = useParams<{ projectId: string }>()
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  // Get project from store
  const projects = useStoryStore((state) => state.projects)
  const project = projects.find((p) => p.id === projectId)

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg text-gray-500 mb-4">Project not found</p>
        <p className="text-sm text-gray-400">ID: {projectId}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Workspace Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h2>
        {project.subtitle && (
          <p className="text-gray-600 mb-4">{project.subtitle}</p>
        )}
        <div className="flex gap-4 text-sm">
          {project.genre && (
            <div>
              <span className="text-gray-500">Genre: </span>
              <span className="font-semibold text-gray-900">{project.genre}</span>
            </div>
          )}
          {project.status && (
            <div>
              <span className="text-gray-500">Status: </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-semibold text-xs">
                {project.status}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-8">
        <div className="flex gap-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 font-semibold transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-8">
        {activeTab === 'overview' && <OverviewTab project={project} />}
        {activeTab === 'bible' && <StoryBibleTab />}
        {activeTab === 'plot' && <PlotTab />}
        {activeTab === 'timeline' && <TimelineTab />}
        {activeTab === 'workshop' && <WorkshopTab />}
        {activeTab === 'exports' && <ExportsTab />}
      </div>
    </div>
  )
}

function OverviewTab({ project }: any) {
  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Overview</h3>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Logline</h4>
          <p className="text-gray-600 italic">
            {project.logline || 'No logline provided'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Status</h4>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded font-semibold">
            {project.status}
          </span>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Story Details</h4>
        <dl className="space-y-4">
          {project.genre && (
            <div>
              <dt className="text-sm text-gray-500">Genre</dt>
              <dd className="text-gray-900 font-medium">{project.genre}</dd>
            </div>
          )}
          {project.themes && project.themes.length > 0 && (
            <div>
              <dt className="text-sm text-gray-500">Themes</dt>
              <dd className="flex gap-2">
                {project.themes.map((theme: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded"
                  >
                    {theme}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  )
}

function StoryBibleTab() {
  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Story Bible</h3>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500 mb-4">Manage characters, locations, items, and world rules</p>
        <p className="text-sm text-gray-400">
          This section will include views for:
        </p>
        <ul className="mt-4 text-sm text-gray-500 space-y-1">
          <li>• Characters and relationships</li>
          <li>• Locations and settings</li>
          <li>• Items and artifacts</li>
          <li>• Story variables and world rules</li>
        </ul>
      </div>
    </div>
  )
}

function PlotTab() {
  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Plot Structure</h3>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500 mb-4">Build and organize your story's narrative structure</p>
        <p className="text-sm text-gray-400">
          This section will include:
        </p>
        <ul className="mt-4 text-sm text-gray-500 space-y-1">
          <li>• Act/Arc hierarchy</li>
          <li>• Chapter and scene organization</li>
          <li>• Plot node editing and connections</li>
          <li>• Story progression tracking</li>
        </ul>
      </div>
    </div>
  )
}

function TimelineTab() {
  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Timeline & Beats</h3>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500 mb-4">Visualize and organize story beats chronologically</p>
        <p className="text-sm text-gray-400">
          This section will include:
        </p>
        <ul className="mt-4 text-sm text-gray-500 space-y-1">
          <li>• Timeline view of story events</li>
          <li>• Character arc tracking</li>
          <li>• Key plot beats visualization</li>
          <li>• Pacing analysis</li>
        </ul>
      </div>
    </div>
  )
}

function WorkshopTab() {
  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">AI Workshop</h3>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500 mb-4">Collaborate with AI to develop your story</p>
        <p className="text-sm text-gray-400">
          This section will include:
        </p>
        <ul className="mt-4 text-sm text-gray-500 space-y-1">
          <li>• Conversation with AI assistant</li>
          <li>• Story continuity checking</li>
          <li>• Character consistency verification</li>
          <li>• Plot hole detection</li>
        </ul>
      </div>
    </div>
  )
}

function ExportsTab() {
  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Exports</h3>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500 mb-4">Export your project in various formats</p>
        <p className="text-sm text-gray-400">
          This section will include export options for:
        </p>
        <ul className="mt-4 text-sm text-gray-500 space-y-1">
          <li>• PDF documents</li>
          <li>• Word documents</li>
          <li>• Markdown</li>
          <li>• JSON backup</li>
        </ul>
      </div>
    </div>
  )
}
