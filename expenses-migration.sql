-- Minimal migration for Expenses
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    expense_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safer approach)
DROP POLICY IF EXISTS "Allow public read on expenses" ON expenses;
DROP POLICY IF EXISTS "Allow public insert on expenses" ON expenses;

CREATE POLICY "Allow public read on expenses" ON expenses
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on expenses" ON expenses
    FOR INSERT WITH CHECK (true);
