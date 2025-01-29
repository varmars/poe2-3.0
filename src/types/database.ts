export interface Database {
  public: {
    Tables: {
      item_bases: {
        Row: {
          id: string
          name_ru: string
          name_en: string
          item_class: string
          required_level: number
          base_armor: number | null
          base_evasion: number | null
          base_energy_shield: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['item_bases']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['item_bases']['Insert']>
      }
      item_types: {
        Row: {
          id: string
          name_ru: string
          name_en: string
          description_ru: string | null
          description_en: string | null
          icon_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['item_types']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['item_types']['Insert']>
      }
      item_subtypes: {
        Row: {
          id: string
          type_id: string
          name_ru: string
          name_en: string
          description_ru: string | null
          description_en: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['item_subtypes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['item_subtypes']['Insert']>
      }
      item_affixes: {
        Row: {
          id: string
          name_ru: string
          name_en: string
          affix_type: string
          tier: number
          mod_group: string
          weight: number
          min_level: number
          stat_text_ru: string
          stat_text_en: string
          min_value: number | null
          max_value: number | null
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['item_affixes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['item_affixes']['Insert']>
      }
      item_stats: {
        Row: {
          id: string
          item_base_id: string
          stat_type: string
          min_value: number
          max_value: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['item_stats']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['item_stats']['Insert']>
      }
      item_requirements: {
        Row: {
          id: string
          item_base_id: string
          level: number
          strength: number
          dexterity: number
          intelligence: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['item_requirements']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['item_requirements']['Insert']>
      }
      item_variants: {
        Row: {
          id: string
          item_base_id: string
          variant_name_ru: string
          variant_name_en: string
          quality_bonus: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['item_variants']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['item_variants']['Insert']>
      }
      item_mods: {
        Row: {
          id: string
          name_ru: string
          name_en: string
          mod_group: string
          mod_type: string
          tier: number | null
          weight: number
          min_level: number
          stat_text_ru: string
          stat_text_en: string
          min_value: number | null
          max_value: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['item_mods']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['item_mods']['Insert']>
      }
      mod_pools: {
        Row: {
          id: string
          name_ru: string
          name_en: string
          item_class: string
          mod_type: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['mod_pools']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['mod_pools']['Insert']>
      }
      crafting_methods: {
        Row: {
          id: string
          name_ru: string
          name_en: string
          description_ru: string
          description_en: string
          cost_type: string | null
          cost_amount: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['crafting_methods']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['crafting_methods']['Insert']>
      }
    }
  }
}

// Helper type to access table types
export type Tables = Database['public']['Tables']

// Enums and constants
export const MOD_TYPES = ['prefix', 'suffix', 'implicit'] as const
export type ModType = typeof MOD_TYPES[number]

export const ITEM_CLASSES = [
  'body_armour',
  'helmet',
  'gloves',
  'boots',
  'weapon',
  'shield',
  'amulet',
  'ring',
  'belt'
] as const
export type ItemClass = typeof ITEM_CLASSES[number]

export const STAT_TYPES = [
  'physical_damage',
  'elemental_damage',
  'armor',
  'evasion',
  'energy_shield',
  'block',
  'critical_strike',
  'attack_speed'
] as const
export type StatType = typeof STAT_TYPES[number]