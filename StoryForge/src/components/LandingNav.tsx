import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const LandingNav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-sf-border bg-sf-surface/90 backdrop-blur-sm">
      <div className="sf-container flex flex-wrap items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-sf-text">StoryForge</span>
        </Link>

        <div className="flex md:order-2 items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-sf-text-muted hover:text-sf-text transition-colors"
          >
            Log in
          </Link>
          <Link to="/signup" className="btn-primary text-sm px-4 py-2">
            Get Started
          </Link>
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-sf-text-muted rounded-md md:hidden hover:bg-sf-bg focus:outline-none"
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen ? 'true' : 'false'}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? 'block' : 'hidden'}`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-sf-border rounded-lg bg-sf-bg md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-transparent">
            <li>
              <a
                href="#features"
                className="block py-2 px-3 text-sf-text-muted rounded hover:bg-sf-bg md:hover:bg-transparent md:hover:text-sf-text md:p-0 transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="block py-2 px-3 text-sf-text-muted rounded hover:bg-sf-bg md:hover:bg-transparent md:hover:text-sf-text md:p-0 transition-colors"
              >
                Workflow
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
