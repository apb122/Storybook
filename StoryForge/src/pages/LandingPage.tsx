import React from 'react';
import { Link } from 'react-router-dom';
import { LandingNav } from '@/components/LandingNav';
import { Book, GitBranch, Clock, Sparkles, RefreshCw, FileText } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-sf-bg text-sf-text font-sans selection:bg-sf-text selection:text-sf-bg">
      <LandingNav />

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="sf-container text-center">
          <div className="inline-block mb-6 px-3 py-1 rounded-full border border-sf-border text-xs font-mono text-sf-text-muted uppercase tracking-wider">
            v1.0 Early Access
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-sf-text text-balance">
            Build Worlds.
            <br />
            Write Better Stories.
          </h1>
          <p className="text-xl md:text-2xl text-sf-text-muted max-w-2xl mx-auto mb-12 leading-relaxed text-balance">
            The distraction-free workspace for novelists and screenwriters. Organize lore, visualize
            plots, and maintain continuity without the clutter.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/app/dashboard" className="btn-primary text-lg px-8 py-3 h-auto">
              Start Writing
            </Link>
            <a href="#features" className="btn-secondary text-lg px-8 py-3 h-auto">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-sf-border">
        <div className="sf-container">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need. Nothing you don't.</h2>
            <p className="text-sf-text-muted text-lg max-w-2xl">
              A complete suite of tools designed to get out of your way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            <FeatureItem
              icon={<Book className="w-6 h-6" />}
              title="Story Bible"
              description="Keep track of every character, location, and item. A single source of truth for your world."
            />
            <FeatureItem
              icon={<GitBranch className="w-6 h-6" />}
              title="Plot & Structure"
              description="Visualize your narrative arc. Drag and drop scenes to restructure your story instantly."
            />
            <FeatureItem
              icon={<Clock className="w-6 h-6" />}
              title="Timeline"
              description="Manage complex chronologies. Ensure events happen in the right order across storylines."
            />
            <FeatureItem
              icon={<Sparkles className="w-6 h-6" />}
              title="AI Workshop"
              description="Brainstorm ideas and overcome writer's block with intelligent, context-aware suggestions."
            />
            <FeatureItem
              icon={<RefreshCw className="w-6 h-6" />}
              title="Continuity Engine"
              description="Automatically detect inconsistencies in your lore and plot before they become plot holes."
            />
            <FeatureItem
              icon={<FileText className="w-6 h-6" />}
              title="Export"
              description="Export your outline, bible, or draft to standard formats like PDF, Docx, and Markdown."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 border-t border-sf-border bg-sf-surface">
        <div className="sf-container">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Workflow</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StepItem
              number="01"
              title="Create"
              description="Start a new project. Import existing notes or start fresh with a clean slate."
            />
            <StepItem
              number="02"
              title="Build"
              description="Flesh out your world in the Story Bible and outline your scenes in the Plot view."
            />
            <StepItem
              number="03"
              title="Refine"
              description="Use AI tools to polish your prose and check for continuity errors across your timeline."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-sf-border">
        <div className="sf-container flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight">StoryForge</span>
          </div>
          <div className="flex gap-8 text-sm text-sf-text-muted">
            <a href="#" className="hover:text-sf-text transition-colors">
              About
            </a>
            <a href="#" className="hover:text-sf-text transition-colors">
              Docs
            </a>
            <a href="#" className="hover:text-sf-text transition-colors">
              GitHub
            </a>
          </div>
          <div className="text-xs text-sf-text-muted">
            &copy; {new Date().getFullYear()} StoryForge.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper Components
const FeatureItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <div className="group">
    <div className="mb-4 text-sf-text-muted group-hover:text-sf-text transition-colors">{icon}</div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-sf-text-muted leading-relaxed">{description}</p>
  </div>
);

const StepItem: React.FC<{ number: string; title: string; description: string }> = ({
  number,
  title,
  description,
}) => (
  <div>
    <div className="text-4xl font-bold text-sf-border mb-6 font-mono">{number}</div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-sf-text-muted">{description}</p>
  </div>
);
