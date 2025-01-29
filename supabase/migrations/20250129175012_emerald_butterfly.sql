/*
  # POE2 Items Database Schema Update

  1. New Tables
    - `item_types` - Categories of items (weapons, armor, etc.)
    - `item_subtypes` - Specific types within categories (swords, axes, etc.)
    - `item_affixes` - Prefixes and suffixes for items
    - `item_stats` - Base stats for items
    - `item_requirements` - Level and attribute requirements
    - `item_variants` - Different variations of the same base item

  2. Changes
    - Enhanced existing tables with new columns
    - Added relationships between tables
    - Added indexes for performance

  3. Security
    - Enabled RLS on all new tables
    - Added read-only policies for authenticated users
*/

-- Item Types
CREATE TABLE IF NOT EXISTS item_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ru text NOT NULL,
  name_en text NOT NULL,
  description_ru text,
  description_en text,
  icon_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Item Subtypes
CREATE TABLE IF NOT EXISTS item_subtypes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type_id uuid REFERENCES item_types(id),
  name_ru text NOT NULL,
  name_en text NOT NULL,
  description_ru text,
  description_en text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Item Affixes
CREATE TABLE IF NOT EXISTS item_affixes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ru text NOT NULL,
  name_en text NOT NULL,
  affix_type text NOT NULL, -- prefix, suffix
  tier integer NOT NULL,
  mod_group text NOT NULL,
  weight integer NOT NULL DEFAULT 100,
  min_level integer NOT NULL DEFAULT 1,
  stat_text_ru text NOT NULL,
  stat_text_en text NOT NULL,
  min_value numeric,
  max_value numeric,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Item Stats
CREATE TABLE IF NOT EXISTS item_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_base_id uuid REFERENCES item_bases(id),
  stat_type text NOT NULL, -- physical_damage, elemental_damage, armor, etc.
  min_value numeric NOT NULL,
  max_value numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Item Requirements
CREATE TABLE IF NOT EXISTS item_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_base_id uuid REFERENCES item_bases(id),
  level integer NOT NULL DEFAULT 1,
  strength integer DEFAULT 0,
  dexterity integer DEFAULT 0,
  intelligence integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Item Variants
CREATE TABLE IF NOT EXISTS item_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_base_id uuid REFERENCES item_bases(id),
  variant_name_ru text NOT NULL,
  variant_name_en text NOT NULL,
  quality_bonus text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE item_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_subtypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_affixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_variants ENABLE ROW LEVEL SECURITY;

-- Create read policies
CREATE POLICY "Allow read access for all users" ON item_types
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access for all users" ON item_subtypes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access for all users" ON item_affixes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access for all users" ON item_stats
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access for all users" ON item_requirements
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access for all users" ON item_variants
  FOR SELECT TO authenticated USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_item_types_name ON item_types(name_ru, name_en);
CREATE INDEX IF NOT EXISTS idx_item_subtypes_type ON item_subtypes(type_id);
CREATE INDEX IF NOT EXISTS idx_item_affixes_type ON item_affixes(affix_type);
CREATE INDEX IF NOT EXISTS idx_item_stats_base ON item_stats(item_base_id);
CREATE INDEX IF NOT EXISTS idx_item_requirements_base ON item_requirements(item_base_id);
CREATE INDEX IF NOT EXISTS idx_item_variants_base ON item_variants(item_base_id);