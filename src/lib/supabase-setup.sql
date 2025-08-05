-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for better data validation
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE activity_type AS ENUM ('quiz', 'game', 'story', 'learning');
CREATE TYPE prize_type AS ENUM ('digital', 'physical', 'draw_entry');

-- Characters table (Māori cultural figures and animals)
CREATE TABLE characters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    cultural_significance TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default Māori characters
INSERT INTO characters (name, description, image_url, cultural_significance) VALUES
('Tangaroa', 'Guardian of the Ocean', 'https://example.com/tangaroa.jpg', 'Tangaroa is the atua (god) of the sea in Māori mythology, representing the vast ocean and all life within it.'),
('Tāne Mahuta', 'Guardian of the Forest', 'https://example.com/tane.jpg', 'Tāne Mahuta is the atua of forests and birds, creator of the first human, representing growth and life.'),
('Wheke (Octopus)', 'Ocean Wisdom Keeper', 'https://example.com/wheke.jpg', 'The wheke represents intelligence, adaptability, and the deep wisdom of the ocean.'),
('Kāhu (Hawk)', 'Sky Navigator', 'https://example.com/kahu.jpg', 'The kāhu represents keen vision, freedom, and the ability to see the bigger picture.'),
('Kererū (Wood Pigeon)', 'Forest Messenger', 'https://example.com/kereru.jpg', 'The kererū is a taonga (treasure) bird, representing communication and connection to the forest.');

-- Activities table (30 days of cultural activities)
CREATE TABLE activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    day INTEGER NOT NULL CHECK (day >= 1 AND day <= 30),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    type activity_type NOT NULL,
    difficulty difficulty_level NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    points INTEGER NOT NULL DEFAULT 10,
    unlock_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(day, difficulty)
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    character_id UUID REFERENCES characters(id),
    difficulty_level difficulty_level DEFAULT 'beginner',
    current_day INTEGER DEFAULT 1 CHECK (current_day >= 1 AND current_day <= 30),
    total_points INTEGER DEFAULT 0,
    achievements TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    score INTEGER NOT NULL DEFAULT 0,
    time_taken INTEGER NOT NULL DEFAULT 0, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, activity_id)
);

-- Prizes table
CREATE TABLE prizes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    type prize_type NOT NULL,
    requirements JSONB NOT NULL DEFAULT '{}',
    available_quantity INTEGER, -- NULL means unlimited
    claimed_count INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User prize claims
CREATE TABLE user_prize_claims (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    prize_id UUID REFERENCES prizes(id) ON DELETE CASCADE NOT NULL,
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'shipped', 'delivered')),
    shipping_details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_activities_day ON activities(day);
CREATE INDEX idx_activities_difficulty ON activities(difficulty);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_activity_id ON user_progress(activity_id);
CREATE INDEX idx_users_difficulty ON users(difficulty_level);
CREATE INDEX idx_users_current_day ON users(current_day);
CREATE INDEX idx_prize_claims_user_id ON user_prize_claims(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_prize_claims ENABLE ROW LEVEL SECURITY;

-- Users can only see/update their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can only see/update their own progress
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see/update their own prize claims
CREATE POLICY "Users can view own claims" ON user_prize_claims FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own claims" ON user_prize_claims FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for characters, activities, and prizes
CREATE POLICY "Anyone can view characters" ON characters FOR SELECT USING (true);
CREATE POLICY "Anyone can view activities" ON activities FOR SELECT USING (true);
CREATE POLICY "Anyone can view prizes" ON prizes FOR SELECT USING (true);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Cultural Explorer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update user points when progress is added
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET
        total_points = total_points + (
            SELECT points FROM activities WHERE id = NEW.activity_id
        ),
        current_day = GREATEST(current_day, (
            SELECT day FROM activities WHERE id = NEW.activity_id
        )),
        updated_at = NOW()
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update points when progress is completed
CREATE TRIGGER on_progress_completed
    AFTER INSERT ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_user_points();

-- Insert sample prizes
INSERT INTO prizes (name, description, type, requirements, available_quantity, image_url) VALUES
('Digital Māori Dictionary', 'Comprehensive Te Reo Māori digital dictionary with audio pronunciations', 'digital', '{"points_required": 50}', NULL, 'https://example.com/dictionary.jpg'),
('Pounamu Pendant', 'Authentic New Zealand greenstone pendant', 'physical', '{"points_required": 200, "days_completed": 10}', 50, 'https://example.com/pounamu.jpg'),
('Cultural Workshop Entry', 'Entry into monthly Māori cultural workshop', 'draw_entry', '{"points_required": 100, "activities_completed": 5}', 20, 'https://example.com/workshop.jpg'),
('Māori Art Print', 'Limited edition print by Māori artist', 'physical', '{"points_required": 150}', 30, 'https://example.com/art-print.jpg'),
('Grand Prize Draw', 'Trip to significant Māori cultural sites', 'draw_entry', '{"days_completed": 30}', 1, 'https://example.com/grand-prize.jpg');

-- Insert sample activities for the first few days
INSERT INTO activities (day, title, description, type, difficulty, content, points, unlock_date) VALUES
(1, 'Kia Ora - First Greetings', 'Learn basic Māori greetings and their cultural significance', 'learning', 'beginner', '{"lessons": [{"title": "Kia Ora", "content": "The most common Māori greeting"}]}', 10, CURRENT_DATE),
(1, 'Te Reo Foundations', 'Deep dive into the pronunciation and meaning of Māori greetings', 'learning', 'intermediate', '{"lessons": [{"title": "Pronunciation Guide", "content": "Detailed phonetic breakdown"}]}', 15, CURRENT_DATE),
(1, 'Advanced Māori Protocols', 'Understanding the cultural protocols behind traditional greetings', 'learning', 'advanced', '{"lessons": [{"title": "Cultural Context", "content": "When and how to use different greetings"}]}', 20, CURRENT_DATE),

(2, 'Māori Numbers Quiz', 'Test your knowledge of Māori numbers 1-10', 'quiz', 'beginner', '{"questions": [{"question": "What is the Māori word for one?", "options": ["tahi", "rua", "toru"], "correct": 0}]}', 10, CURRENT_DATE + INTERVAL '1 day'),
(2, 'Advanced Numbers Challenge', 'Master Māori numbers and counting systems', 'quiz', 'intermediate', '{"questions": [{"question": "What is twenty in Māori?", "options": ["rua tekau", "toru tekau", "wha tekau"], "correct": 0}]}', 15, CURRENT_DATE + INTERVAL '1 day'),
(2, 'Traditional Counting Systems', 'Explore traditional Māori mathematical concepts', 'learning', 'advanced', '{"lessons": [{"title": "Ancient Systems", "content": "How Māori traditionally counted and measured"}]}', 20, CURRENT_DATE + INTERVAL '1 day');

-- Insert more days (3-30) with placeholder content
DO $$
DECLARE
    day_num INTEGER;
    difficulties difficulty_level[] := ARRAY['beginner', 'intermediate', 'advanced'];
    diff difficulty_level;
    activity_types activity_type[] := ARRAY['quiz', 'game', 'story', 'learning'];
    act_type activity_type;
    points_map INTEGER[] := ARRAY[10, 15, 20]; -- points for beginner, intermediate, advanced
BEGIN
    FOR day_num IN 3..30 LOOP
        FOR i IN 1..3 LOOP
            diff := difficulties[i];
            act_type := activity_types[(day_num + i) % 4 + 1];

            INSERT INTO activities (day, title, description, type, difficulty, content, points, unlock_date) VALUES
            (
                day_num,
                'Day ' || day_num || ' - Cultural Journey (' || UPPER(LEFT(diff::TEXT, 1)) || SUBSTR(diff::TEXT, 2) || ')',
                'Explore Māori culture through ' || act_type || ' activities on day ' || day_num,
                act_type,
                diff,
                '{"placeholder": true, "day": ' || day_num || '}',
                points_map[i],
                CURRENT_DATE + INTERVAL '1 day' * (day_num - 1)
            );
        END LOOP;
    END LOOP;
END $$;
