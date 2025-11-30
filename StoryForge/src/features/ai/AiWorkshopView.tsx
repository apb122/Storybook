import React, { useState, useEffect, useRef } from 'react';
import { useStoryStore } from '@/state/store';
import { useShallow } from 'zustand/react/shallow';
import {
  getApiKey,
  setApiKey,
  generateAiResponse,
  type AiRequestPayload,
} from '@/services/aiService';
import { buildStoryContextSnapshot } from '../../utils/buildStoryContextSnapshot';
import { SplitView } from '../../components/ui/SplitView';
import { ContinuityIssuesPanel } from '../continuity/ContinuityIssuesPanel';
import type { AiMessage } from '../../types';

interface AiWorkshopViewProps {
  projectId: string;
}

export const AiWorkshopView: React.FC<AiWorkshopViewProps> = ({ projectId }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(getApiKey());
  const [inputApiKey, setInputApiKey] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'context' | 'continuity'>('context');

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AiRequestPayload['mode']>('generic');

  const messages = useStoryStore(
    useShallow((state) => state.aiMessages.filter((m) => m.projectId === projectId))
  );
  const addAiMessage = useStoryStore((state) => state.addAiMessage);
  const setSuggestedVariables = useStoryStore((state) => state.setSuggestedVariables);

  // Store data for context
  const projects = useStoryStore((state) => state.projects);
  const characters = useStoryStore((state) => state.characters);
  const plotNodes = useStoryStore((state) => state.plotNodes);
  const variables = useStoryStore((state) => state.variables);
  const currentPlotNodeId = useStoryStore((state) => state.ui.selectedPlotNodeId);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!apiKey) {
      setShowApiKeyModal(true);
    }
  }, [apiKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSaveApiKey = () => {
    if (inputApiKey.trim()) {
      setApiKey(inputApiKey.trim());
      setApiKeyState(inputApiKey.trim());
      setShowApiKeyModal(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !apiKey) return;

    const userMsg: AiMessage = {
      id: crypto.randomUUID(),
      projectId,
      role: 'user',
      content: inputMessage,
      createdAt: new Date().toISOString(),
    };

    addAiMessage(userMsg);
    setInputMessage('');
    setIsLoading(true);

    try {
      const contextSnapshot = buildStoryContextSnapshot(
        projectId,
        projects,
        characters,
        plotNodes,
        variables,
        currentPlotNodeId
      );

      const payload: AiRequestPayload = {
        projectId,
        userMessage: userMsg.content,
        mode,
        contextSnapshot,
        apiKey,
      };

      const response = await generateAiResponse(payload);

      const assistantMsg: AiMessage = {
        id: crypto.randomUUID(),
        projectId,
        role: 'assistant',
        content: response.message,
        createdAt: new Date().toISOString(),
        contextSnapshot, // Optional: save context used for this message
      };

      addAiMessage(assistantMsg);

      if (response.suggestedVariables) {
        setSuggestedVariables(response.suggestedVariables);
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMsg: AiMessage = {
        id: crypto.randomUUID(),
        projectId,
        role: 'system',
        content:
          'Error: Failed to communicate with the AI. Please check your API key and internet connection.',
        createdAt: new Date().toISOString(),
      };
      addAiMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const ChatArea = (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <p>Start a conversation with your AI writing assistant.</p>
            <p className="text-sm mt-2">
              Select a mode and ask for help with brainstorming, continuity, or drafting.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : msg.role === 'system'
                    ? 'bg-red-900/50 text-red-200 border border-red-800'
                    : 'bg-gray-800 text-gray-200'
                }`}
            >
              <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
              <div className="text-[10px] opacity-50 mt-1 text-right">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg p-3 text-gray-400 text-sm">Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex gap-2 mb-2">
          {(['generic', 'brainstorm', 'continuity', 'character', 'scene'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${mode === m
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 resize-none h-20"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed self-end h-10"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  const ContextPanel = (
    <div className="h-full bg-gray-900 border-l border-gray-700 flex flex-col">
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setSidebarTab('context')}
          className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider ${sidebarTab === 'context'
              ? 'text-white border-b-2 border-indigo-500 bg-gray-800'
              : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            }`}
        >
          Context
        </button>
        <button
          onClick={() => setSidebarTab('continuity')}
          className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider ${sidebarTab === 'continuity'
              ? 'text-white border-b-2 border-indigo-500 bg-gray-800'
              : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            }`}
        >
          Continuity
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {sidebarTab === 'context' ? (
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-medium text-indigo-400 mb-1">Current Mode</h4>
              <p className="text-sm text-white capitalize">{mode}</p>
            </div>

            <div>
              <h4 className="text-xs font-medium text-indigo-400 mb-1">Active Scene</h4>
              {currentPlotNodeId ? (
                <p className="text-sm text-white">
                  {plotNodes.find((n) => n.id === currentPlotNodeId)?.title || 'Unknown Scene'}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">No scene selected</p>
              )}
            </div>

            <div>
              <h4 className="text-xs font-medium text-indigo-400 mb-1">Key Characters</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                {characters
                  .filter((c) => c.projectId === projectId)
                  .slice(0, 5)
                  .map((c) => (
                    <li key={c.id}>
                      • {c.name} ({c.role})
                    </li>
                  ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="text-xs text-gray-500 hover:text-gray-300 underline"
              >
                Update API Key
              </button>
            </div>
          </div>
        ) : (
          <ContinuityIssuesPanel projectId={projectId} />
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full relative">
      <SplitView sidebar={ContextPanel} content={ChatArea} sidebarPosition="right" />

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Enter Gemini API Key</h2>
            <p className="text-gray-300 text-sm mb-4">
              To use the AI Workshop, you need a Google Gemini API key. Your key is stored locally
              in your browser and never sent to our servers.
            </p>
            <input
              type="password"
              value={inputApiKey}
              onChange={(e) => setInputApiKey(e.target.value)}
              placeholder="Paste your API key here"
              className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 mb-4"
            />
            <div className="flex justify-end gap-3">
              {apiKey && (
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSaveApiKey}
                disabled={!inputApiKey.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                Save Key
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Get a key at{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
