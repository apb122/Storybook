-- 003_story_schema.sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Series Table
CREATE TABLE series (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tags TEXT[], -- Array of strings
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    series_id UUID REFERENCES series(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'drafting', 'revising', 'completed', 'on_hold'
    genre TEXT[],
    subgenres TEXT[],
    themes TEXT[],
    tone VARCHAR(100),
    logline TEXT,
    manuscript_mode VARCHAR(50) DEFAULT 'perScene', -- 'perScene', 'singleDocument'
    manuscript_target_words INT,
    manuscript_deadline TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Characters Table
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'supporting', -- 'protagonist', 'antagonist', 'supporting', 'other'
    age VARCHAR(50),
    traits TEXT[],
    goals TEXT,
    flaws TEXT,
    backstory TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Locations Table
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    description TEXT,
    important_events TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Items Table (Renamed from StoryItem to avoid confusion with user_items)
CREATE TABLE story_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    description TEXT,
    importance VARCHAR(50) DEFAULT 'minor', -- 'minor', 'major', 'mcguffin'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Plot Nodes (Scenes, Chapters, Acts)
CREATE TABLE plot_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES plot_nodes(id) ON DELETE CASCADE, -- Hierarchical structure
    type VARCHAR(50) NOT NULL, -- 'act', 'arc', 'chapter', 'scene'
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    "order" INT NOT NULL, -- Order within the parent
    
    -- Scene specific fields
    pov_character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    timeline_position VARCHAR(100),
    keywords TEXT[],
    goals TEXT,
    conflict TEXT,
    outcome TEXT,
    notes TEXT,
    
    -- Manuscript Content (stored as JSON for ProseMirror/TipTap)
    manuscript_content JSONB,
    manuscript_text TEXT, -- Plain text for search/word count
    word_count INT DEFAULT 0,
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Character Relationships (Self-referencing Many-to-Many)
CREATE TABLE character_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_a_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    character_b_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'ally', 'enemy', 'family', 'mentor', 'romantic', 'other'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(character_a_id, character_b_id) -- Prevent duplicate relationships
);

-- 8. Junction Tables for Many-to-Many Relationships

-- Scene <-> Characters (Involved Characters)
CREATE TABLE scene_characters (
    scene_id UUID NOT NULL REFERENCES plot_nodes(id) ON DELETE CASCADE,
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    PRIMARY KEY (scene_id, character_id)
);

-- Scene <-> Locations (Involved Locations - though main location is 1:1, this allows multiple)
CREATE TABLE scene_locations (
    scene_id UUID NOT NULL REFERENCES plot_nodes(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    PRIMARY KEY (scene_id, location_id)
);

-- Series <-> Characters (Shared Characters)
CREATE TABLE series_characters (
    series_id UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    PRIMARY KEY (series_id, character_id)
);

-- Series <-> Locations (Shared Locations)
CREATE TABLE series_locations (
    series_id UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    PRIMARY KEY (series_id, location_id)
);

-- 9. Story Variables
CREATE TABLE story_variables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    label VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'string', 'number', 'boolean', 'enum', 'rule'
    value TEXT,
    status VARCHAR(50) DEFAULT 'tentative', -- 'tentative', 'confirmed', 'locked'
    tags TEXT[],
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, key)
);

-- 10. Continuity Issues
CREATE TABLE continuity_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'character', 'timeline', 'world_rule', 'logic', 'other'
    description TEXT NOT NULL,
    severity VARCHAR(50) DEFAULT 'minor', -- 'minor', 'moderate', 'major'
    suggested_fix TEXT,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_characters_project_id ON characters(project_id);
CREATE INDEX idx_plot_nodes_project_id ON plot_nodes(project_id);
CREATE INDEX idx_plot_nodes_parent_id ON plot_nodes(parent_id);
CREATE INDEX idx_plot_nodes_order ON plot_nodes("order");
