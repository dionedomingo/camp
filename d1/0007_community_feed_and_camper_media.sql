-- Migration 0007: Community Feed and Camper Profile Media (Posts, Stories, Comments, Reactions)
-- Supports vertical Stories/Highlights (permanent, ordered by creation date) and standard Posts
-- with polymorphic reactions and post comments.

-- 1. Posts table: Permanent camper feed posts
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    camper_id TEXT NOT NULL,
    media_url TEXT NOT NULL,
    caption TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (camper_id) REFERENCES campers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_posts_camper_id ON posts(camper_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_camper_created ON posts(camper_id, created_at DESC);

-- 2. Stories table: Permanent vertical highlight media (no expiration, chronological order)
CREATE TABLE IF NOT EXISTS stories (
    id TEXT PRIMARY KEY,
    camper_id TEXT NOT NULL,
    media_url TEXT NOT NULL,
    caption TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (camper_id) REFERENCES campers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_stories_camper_id ON stories(camper_id);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_stories_camper_created ON stories(camper_id, created_at ASC);

-- 3. Post Comments table: Discussion comments on posts
CREATE TABLE IF NOT EXISTS post_comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    camper_id TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (camper_id) REFERENCES campers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_camper_id ON post_comments(camper_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_created ON post_comments(post_id, created_at ASC);

-- 4. Reactions table: Polymorphic reactions for posts, stories, comments
CREATE TABLE IF NOT EXISTS reactions (
    id TEXT PRIMARY KEY,
    camper_id TEXT NOT NULL,
    reactable_type TEXT NOT NULL CHECK(reactable_type IN ('post', 'story', 'comment')),
    reactable_id TEXT NOT NULL,
    reaction_type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (camper_id) REFERENCES campers(id) ON DELETE CASCADE
);

-- Enforce one active reaction per camper per entity
CREATE UNIQUE INDEX IF NOT EXISTS idx_reactions_unique ON reactions(camper_id, reactable_type, reactable_id);
CREATE INDEX IF NOT EXISTS idx_reactions_lookup ON reactions(reactable_type, reactable_id);
CREATE INDEX IF NOT EXISTS idx_reactions_camper ON reactions(camper_id);
CREATE INDEX IF NOT EXISTS idx_reactions_aggregate ON reactions(reactable_type, reactable_id, reaction_type);
