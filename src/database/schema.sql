
-- SoulSync Database Schema

-- Users table to store user information
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  role VARCHAR(20) DEFAULT 'user' -- Can be 'user', 'professional', 'admin'
);

-- Moods table to store user mood entries
CREATE TABLE moods (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  value VARCHAR(20) NOT NULL, -- 'amazing', 'good', 'okay', etc.
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Journal entries table
CREATE TABLE journals (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  mood VARCHAR(20),
  is_favorite BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Journal tags
CREATE TABLE journal_tags (
  id VARCHAR(36) PRIMARY KEY,
  journal_id VARCHAR(36) NOT NULL,
  tag VARCHAR(50) NOT NULL,
  FOREIGN KEY (journal_id) REFERENCES journals(id) ON DELETE CASCADE
);

-- Habits table
CREATE TABLE habits (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(20),
  target_days INT DEFAULT 7,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Habit entries to track daily completions
CREATE TABLE habit_entries (
  id VARCHAR(36) PRIMARY KEY,
  habit_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  entry_date DATE NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completion_time TIME,
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(habit_id, entry_date) -- Ensure only one entry per habit per day
);

-- Mindfulness sessions
CREATE TABLE mindfulness_sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  exercise_id VARCHAR(36) NOT NULL,
  exercise_type VARCHAR(20) NOT NULL, -- 'breathing' or 'mindfulness'
  duration_minutes INT NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Quiz results
CREATE TABLE quiz_results (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  result_data JSON NOT NULL, -- Stores the entire result including category scores and recommendations
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User settings
CREATE TABLE user_settings (
  user_id VARCHAR(36) PRIMARY KEY,
  theme VARCHAR(20) DEFAULT 'light',
  notification_preferences JSON,
  privacy_settings JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Example queries to fetch data for insights

-- Get a user's mood entries for the last 30 days
SELECT * FROM moods 
WHERE user_id = ? AND created_at >= CURDATE() - INTERVAL 30 DAY
ORDER BY created_at DESC;

-- Get habit completion rate for the current week
SELECT 
  h.name,
  COUNT(he.id) AS total_entries,
  SUM(CASE WHEN he.is_completed = TRUE THEN 1 ELSE 0 END) AS completed_count,
  (SUM(CASE WHEN he.is_completed = TRUE THEN 1 ELSE 0 END) / COUNT(he.id)) * 100 AS completion_rate
FROM habits h
JOIN habit_entries he ON h.id = he.habit_id
WHERE h.user_id = ? 
  AND he.entry_date BETWEEN DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) 
  AND DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 6 DAY)
GROUP BY h.id, h.name;

-- Get journal consistency (days with entries per week)
SELECT 
  COUNT(DISTINCT DATE(created_at)) AS days_with_journals,
  (COUNT(DISTINCT DATE(created_at)) / 7) * 100 AS journal_consistency
FROM journals
WHERE user_id = ?
  AND created_at >= CURDATE() - INTERVAL 7 DAY;

-- Get mindfulness minutes for the week
SELECT 
  SUM(duration_minutes) AS total_mindfulness_minutes
FROM mindfulness_sessions
WHERE user_id = ?
  AND completed_at >= CURDATE() - INTERVAL 7 DAY;

-- Get mood distribution for a month
SELECT 
  value,
  COUNT(*) as count
FROM moods
WHERE user_id = ?
  AND MONTH(created_at) = MONTH(CURRENT_DATE())
  AND YEAR(created_at) = YEAR(CURRENT_DATE())
GROUP BY value;

-- Get mood trend (compare current week vs previous week)
SELECT 
  CASE 
    WHEN DATEDIFF(CURDATE(), created_at) < 7 THEN 'current_week'
    ELSE 'previous_week'
  END AS week_period,
  AVG(
    CASE 
      WHEN value = 'amazing' THEN 5
      WHEN value = 'good' THEN 4
      WHEN value = 'okay' THEN 3
      WHEN value = 'sad' THEN 2
      ELSE 1
    END
  ) AS average_mood_score
FROM moods
WHERE user_id = ?
  AND created_at >= CURDATE() - INTERVAL 14 DAY
GROUP BY week_period;
