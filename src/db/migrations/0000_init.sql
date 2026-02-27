-- Initial migration for explain-like-5-v2

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  model TEXT,
  messages TEXT,
  user_id TEXT REFERENCES users(id),
  visitor_id TEXT
);

CREATE INDEX IF NOT EXISTS chats_user_id_idx ON chats(user_id);
CREATE INDEX IF NOT EXISTS chats_visitor_id_idx ON chats(visitor_id);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  user_id TEXT NOT NULL REFERENCES users(id),
  PRIMARY KEY (id, created_at)
);

CREATE TABLE IF NOT EXISTS suggestions (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL,
  document_created_at TEXT NOT NULL,
  original_text TEXT NOT NULL,
  suggested_text TEXT NOT NULL,
  description TEXT,
  is_resolved INTEGER DEFAULT 0,
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  feedback TEXT NOT NULL,
  user_id TEXT REFERENCES users(id)
);
