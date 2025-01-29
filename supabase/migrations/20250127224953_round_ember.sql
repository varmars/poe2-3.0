/*
  # Craft of Exile Database Schema

  1. New Tables
    - `item_bases`
      - Basic item information like name, type, requirements
    - `item_mods`
      - Possible modifiers that can appear on items
    - `mod_pools`
      - Groups of mods (prefix, suffix, etc.)
    - `crafting_methods`
      - Available crafting methods and their effects

  2. Security
    - Enable RLS on all tables
    - Add policies for read access to authenticated users
*/

-- Item Bases
CREATE TABLE IF NOT EXISTS item_bases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ru text NOT NULL,
  name_en text NOT NULL,
  item_class text NOT NULL,
  required_level integer NOT NULL DEFAULT 0,
  base_armor integer,
  base_evasion integer,
  base_energy_shield integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Item Mods
CREATE TABLE IF NOT EXISTS item_mods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ru text NOT NULL,
  name_en text NOT NULL,
  mod_group text NOT NULL,
  mod_type text NOT NULL, -- prefix, suffix, implicit, etc.
  tier integer,
  weight integer NOT NULL DEFAULT 100,
  min_level integer NOT NULL DEFAULT 1,
  stat_text_ru text NOT NULL,
  stat_text_en text NOT NULL,
  min_value numeric,
  max_value numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Mod Pools (groups of mods that can appear together)
CREATE TABLE IF NOT EXISTS mod_pools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ru text NOT NULL,
  name_en text NOT NULL,
  item_class text NOT NULL,
  mod_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crafting Methods
CREATE TABLE IF NOT EXISTS crafting_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ru text NOT NULL,
  name_en text NOT NULL,
  description_ru text NOT NULL,
  description_en text NOT NULL,
  cost_type text,
  cost_amount numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE item_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_mods ENABLE ROW LEVEL SECURITY;
ALTER TABLE mod_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE crafting_methods ENABLE ROW LEVEL SECURITY;

-- Create policies for read access
CREATE POLICY "Allow read access for all users" ON item_bases
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access for all users" ON item_mods
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access for all users" ON mod_pools
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access for all users" ON crafting_methods
  FOR SELECT TO authenticated USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_item_bases_name ON item_bases(name_ru, name_en);
CREATE INDEX IF NOT EXISTS idx_item_mods_type ON item_mods(mod_type);
CREATE INDEX IF NOT EXISTS idx_mod_pools_item_class ON mod_pools(item_class);