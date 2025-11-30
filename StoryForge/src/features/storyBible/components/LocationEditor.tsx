import React, { useState, useEffect } from 'react';
import type { Location } from '@/types/story';
import { MapPin, AlignLeft, Calendar } from 'lucide-react';

interface LocationEditorProps {
  location: Location;
  onSave: (id: string, updates: Partial<Location>) => void;
}

export const LocationEditor: React.FC<LocationEditorProps> = ({ location, onSave }) => {
  const [formData, setFormData] = useState<Partial<Location>>(location);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      onSave(location.id, formData);
      setIsDirty(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData, isDirty, location.id, onSave]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleEventsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const events = e.target.value.split('\n');
    setFormData((prev) => ({ ...prev, importantEvents: events }));
    setIsDirty(true);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b border-sf-border">
        <div>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="text-3xl font-bold bg-transparent border-none p-0 focus:ring-0 text-sf-text placeholder-sf-text-muted w-full"
            placeholder="Location Name"
            aria-label="Location Name"
          />
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              name="type"
              value={formData.type || ''}
              onChange={handleChange}
              className="text-sm bg-transparent border-none p-0 text-sf-text-muted font-mono uppercase tracking-wider focus:ring-0 w-32"
              placeholder="TYPE"
              aria-label="Location Type"
            />
            <span className="text-sf-border">|</span>
            <span className="text-xs text-sf-text-muted">{isDirty ? 'Saving...' : 'Saved'}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPin size={12} /> Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-sf-text-muted mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="w-full"
                    aria-label="Name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-sf-text-muted mb-1">Type</label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type || ''}
                    onChange={handleChange}
                    className="w-full"
                    aria-label="Type"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Middle & Right Column */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlignLeft size={12} /> Description
              </h3>
              <textarea
                name="description"
                rows={8}
                value={formData.description || ''}
                onChange={handleChange}
                className="w-full"
                placeholder="Describe this location..."
                aria-label="Description"
              />
            </section>

            <section>
              <h3 className="text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calendar size={12} /> Important Events
              </h3>
              <textarea
                rows={6}
                value={formData.importantEvents?.join('\n') || ''}
                onChange={handleEventsChange}
                className="w-full"
                placeholder="One event per line..."
                aria-label="Important Events"
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
