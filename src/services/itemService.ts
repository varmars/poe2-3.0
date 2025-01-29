import { supabase } from '../lib/supabase'
import type { Tables, ItemClass, ModType, StatType } from '../types/database'

export const itemService = {
  // Base Items
  async getItemBases() {
    const { data, error } = await supabase
      .from('item_bases')
      .select(`
        *,
        item_stats (*),
        item_requirements (*),
        item_variants (*)
      `)
      .order('name_ru')
    
    if (error) throw error
    return data
  },

  // Item Types and Subtypes
  async getItemTypes() {
    const { data, error } = await supabase
      .from('item_types')
      .select(`
        *,
        item_subtypes (*)
      `)
      .order('name_ru')
    
    if (error) throw error
    return data
  },

  async getItemSubtypes(typeId: string) {
    const { data, error } = await supabase
      .from('item_subtypes')
      .select('*')
      .eq('type_id', typeId)
      .order('name_ru')
    
    if (error) throw error
    return data
  },

  // Affixes and Mods
  async getItemAffixes(itemClass: ItemClass) {
    const { data, error } = await supabase
      .from('item_affixes')
      .select('*')
      .order('tier', { ascending: true })
      .order('name_ru')
    
    if (error) throw error
    return data
  },

  async getItemMods() {
    const { data, error } = await supabase
      .from('item_mods')
      .select('*')
      .order('mod_group', { ascending: true })
      .order('tier', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Stats and Requirements
  async getItemStats(itemBaseId: string) {
    const { data, error } = await supabase
      .from('item_stats')
      .select('*')
      .eq('item_base_id', itemBaseId)
    
    if (error) throw error
    return data
  },

  async getItemRequirements(itemBaseId: string) {
    const { data, error } = await supabase
      .from('item_requirements')
      .select('*')
      .eq('item_base_id', itemBaseId)
      .single()
    
    if (error) throw error
    return data
  },

  // Variants
  async getItemVariants(itemBaseId: string) {
    const { data, error } = await supabase
      .from('item_variants')
      .select('*')
      .eq('item_base_id', itemBaseId)
    
    if (error) throw error
    return data
  },

  // Mod Pools and Crafting
  async getModPools(itemClass: ItemClass) {
    const { data, error } = await supabase
      .from('mod_pools')
      .select('*')
      .eq('item_class', itemClass)
      .order('name_ru')
    
    if (error) throw error
    return data
  },

  async getCraftingMethods() {
    const { data, error } = await supabase
      .from('crafting_methods')
      .select('*')
      .order('name_ru')
    
    if (error) throw error
    return data
  },

  async getModsByType(itemClass: ItemClass, modType: ModType) {
    const { data, error } = await supabase
      .from('item_mods')
      .select('*')
      .eq('mod_type', modType)
      .order('tier', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getAvailableMods(itemClass: ItemClass) {
    const { data, error } = await supabase
      .from('mod_pools')
      .select(`
        *,
        item_mods (*)
      `)
      .eq('item_class', itemClass)
    
    if (error) throw error
    return data
  },

  // Detailed item data
  async getFullItemData(itemBaseId: string) {
    const { data, error } = await supabase
      .from('item_bases')
      .select(`
        *,
        item_stats (*),
        item_requirements (*),
        item_variants (*),
        item_mods (*)
      `)
      .eq('id', itemBaseId)
      .single()
    
    if (error) throw error
    return data
  }
}