CREATE TABLE quiz_completions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at TEXT NOT NULL,
  completed_at TEXT NOT NULL DEFAULT (datetime('now')),
  actual_role TEXT NOT NULL,
  achieved_role_id TEXT NOT NULL,
  correct_answers INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  failed_on_question TEXT,
  session_id TEXT NOT NULL UNIQUE
);

CREATE INDEX idx_actual_role ON quiz_completions(actual_role);
CREATE INDEX idx_achieved_role ON quiz_completions(achieved_role_id);
