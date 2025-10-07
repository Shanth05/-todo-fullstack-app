-- Create the task table
CREATE TABLE IF NOT EXISTS task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on created_at for efficient ordering
CREATE INDEX IF NOT EXISTS idx_task_created_at ON task(created_at DESC);

-- Create an index on completed for efficient filtering
CREATE INDEX IF NOT EXISTS idx_task_completed ON task(completed);

-- Insert some sample data for testing
INSERT INTO task (title, description, completed) VALUES
('Sample Task 1', 'This is a sample task description', false),
('Sample Task 2', 'Another sample task for testing', false),
('Sample Task 3', 'Third sample task', true),
('Sample Task 4', 'Fourth sample task', false),
('Sample Task 5', 'Fifth sample task', false),
('Sample Task 6', 'Sixth sample task', false);
