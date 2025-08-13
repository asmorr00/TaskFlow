-- Add due_date column to tasks table
ALTER TABLE tasks 
ADD COLUMN due_date TIMESTAMP WITH TIME ZONE;

-- Create index for performance when querying by due date
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Create index for compound queries (user_id + due_date)
CREATE INDEX idx_tasks_user_due_date ON tasks(user_id, due_date);