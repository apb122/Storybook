import React, { useState, useEffect, useRef } from 'react';
import { useStoryStore } from '@/state/store';
import { generateId } from '@/utils/ids';
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
import { Settings, Sparkles, FileText, User } from 'lucide-react';

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
        id: generateId(),
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
        id: generateId(),
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
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-sf-text-muted mt-20">
            <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">AI Writing Assistant</p>
            <p className="text-sm mt-2 max-w-md mx-auto">
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
              className={`max-w-[80%] rounded-sm p-4 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-sf-text text-sf-bg'
                  : msg.role === 'system'
                    ? 'bg-sf-danger/10 text-sf-danger border border-sf-danger/20'
                    : 'bg-sf-surface border border-sf-border text-sf-text'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-sf-surface border border-sf-border rounded-sm p-3 text-sf-text-muted text-sm flex items-center gap-2">
              <Sparkles size={14} className="animate-pulse" /> Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-sf-border">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {(['generic', 'brainstorm', 'continuity', 'character', 'scene'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                mode === m
                  ? 'bg-sf-text text-sf-bg'
                  : 'bg-sf-surface text-sf-text-muted hover:text-sf-text border border-sf-border'
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
            className="flex-1 bg-transparent border border-sf-border rounded-sm px-3 py-2 text-sf-text focus:border-sf-text outline-none resize-none h-20"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-2 bg-sf-text text-sf-bg rounded-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed self-end h-10 font-bold uppercase tracking-wider text-xs"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  const ContextPanel = (
    <div className="h-full border-l border-sf-border flex flex-col">
      <div className="flex border-b border-sf-border">
        <button
          onClick={() => setSidebarTab('context')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            sidebarTab === 'context'
              ? 'bg-sf-surface text-sf-text border-b-2 border-sf-text'
              : 'text-sf-text-muted hover:text-sf-text'
          }`}
        >
          Context
        </button>
        <button
          onClick={() => setSidebarTab('continuity')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            sidebarTab === 'continuity'
              ? 'bg-sf-surface text-sf-text border-b-2 border-sf-text'
              : 'text-sf-text-muted hover:text-sf-text'
          }`}
        >
          Continuity
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {sidebarTab === 'context' ? (
          <div className="space-y-8">
            <div>
              <h4 className="text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                <Settings size={12} /> Current Mode
              </h4>
              <p className="text-sm text-sf-text capitalize font-medium">{mode}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText size={12} /> Active Scene
              </h4>
              {currentPlotNodeId ? (
                <p className="text-sm text-sf-text">
                  {plotNodes.find((n) => n.id === currentPlotNodeId)?.title || 'Unknown Scene'}
                </p>
              ) : (
                <p className="text-sm text-sf-text-muted italic">No scene selected</p>
              )}
            </div>

            <div>
              <h4 className="text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                <User size={12} /> Key Characters
              </h4>
              <ul className="text-sm text-sf-text space-y-1">
                {characters
                  .filter((c) => c.projectId === projectId)
                  .slice(0, 5)
                  .map((c) => (
                    <li key={c.id} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-sf-text-muted"></span>
                      {c.name} <span className="text-sf-text-muted text-xs">({c.role})</span>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-sf-border">
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="text-xs text-sf-accent hover:underline"
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
        <div className="absolute inset-0 bg-sf-bg/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-sf-surface p-6 rounded-sm shadow-xl max-w-md w-full border border-sf-border">
            <h2 className="text-xl font-bold text-sf-text mb-4">Enter Gemini API Key</h2>
            <p className="text-sf-text-muted text-sm mb-4">
              To use the AI Workshop, you need a Google Gemini API key. Your key is stored locally
              in your browser and never sent to our servers.
            </p>
            <input
              type="password"
              value={inputApiKey}
              onChange={(e) => setInputApiKey(e.target.value)}
              placeholder="Paste your API key here"
              className="w-full bg-transparent border border-sf-border rounded-sm px-3 py-2 text-sf-text focus:border-sf-text outline-none mb-4"
            />
            <div className="flex justify-end gap-3">
              {apiKey && (
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-4 py-2 text-sf-text-muted hover:text-sf-text text-sm font-medium"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSaveApiKey}
                disabled={!inputApiKey.trim()}
                className="btn-primary"
              >
                Save Key
              </button>
            </div>
            <p className="text-xs text-sf-text-muted mt-4 text-center">
              Get a key at{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sf-accent hover:underline"
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
