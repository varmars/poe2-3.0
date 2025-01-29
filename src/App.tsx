import React, { useState, useEffect } from 'react';
import { Sword, Shield, Heart, Zap, ArrowRight, Save, Share, BarChart3, Plus, Hammer, X, Filter } from 'lucide-react';
import { itemService } from './services/itemService';
import type { Tables, ItemClass } from './types/database';

type SelectedItem = {
  base: Tables['item_bases']['Row'];
  stats: Tables['item_stats']['Row'][];
  requirements: Tables['item_requirements']['Row'];
  variants: Tables['item_variants']['Row'][];
  mods: Tables['item_mods']['Row'][];
};

type EquipmentSlot = {
  id: number;
  name: string;
  type: ItemClass;
  icon: React.ElementType;
};

function App() {
  const [selectedTab, setSelectedTab] = useState('gear');
  const [itemTypes, setItemTypes] = useState<Tables['item_types']['Row'][]>([]);
  const [itemBases, setItemBases] = useState<Tables['item_bases']['Row'][]>([]);
  const [craftingMethods, setCraftingMethods] = useState<Tables['crafting_methods']['Row'][]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCraftingModal, setShowCraftingModal] = useState(false);

  const equipmentSlots: EquipmentSlot[] = [
    { id: 0, name: 'Шлем', type: 'helmet', icon: Shield },
    { id: 1, name: 'Амулет', type: 'amulet', icon: Shield },
    { id: 2, name: 'Оружие', type: 'weapon', icon: Sword },
    { id: 3, name: 'Нагрудник', type: 'body_armour', icon: Shield },
    { id: 4, name: 'Кольцо', type: 'ring', icon: Shield },
    { id: 5, name: 'Щит', type: 'shield', icon: Shield },
    { id: 6, name: 'Перчатки', type: 'gloves', icon: Shield },
    { id: 7, name: 'Кольцо', type: 'ring', icon: Shield },
    { id: 8, name: 'Ботинки', type: 'boots', icon: Shield },
    { id: 9, name: 'Пояс', type: 'belt', icon: Shield },
  ];
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [types, bases, methods] = await Promise.all([
          itemService.getItemTypes(),
          itemService.getItemBases(),
          itemService.getCraftingMethods()
        ]);
        setItemTypes(types);
        setItemBases(bases);
        setCraftingMethods(methods);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleItemClick = (slot: EquipmentSlot) => {
    setSelectedSlot(slot.id);
    setShowCraftingModal(true);
  };

  const CraftingModal = () => {
    const currentSlot = equipmentSlots.find(slot => slot.id === selectedSlot);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedBase, setSelectedBase] = useState<Tables['item_bases']['Row'] | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Tables['item_variants']['Row'] | null>(null);
    const [availableMods, setAvailableMods] = useState<Tables['item_mods']['Row'][]>([]);
    const [filteredBases, setFilteredBases] = useState<Tables['item_bases']['Row'][]>([]);

    useEffect(() => {
      if (currentSlot) {
        const filtered = itemBases.filter(base => base.item_class === currentSlot.type);
        setFilteredBases(filtered);
      }
    }, [currentSlot]);

    useEffect(() => {
      if (selectedBase) {
        itemService.getFullItemData(selectedBase.id)
          .then(data => {
            if (data.variants) {
              setSelectedVariant(data.variants[0]);
            }
          })
          .catch(console.error);

        if (selectedBase.item_class) {
          itemService.getAvailableMods(selectedBase.item_class as ItemClass)
            .then(mods => setAvailableMods(mods))
            .catch(console.error);
        }
      }
    }, [selectedBase]);

    const renderItemStats = () => {
      if (!selectedBase) return null;

      return (
        <div className="mt-4 p-4 bg-gray-700 rounded">
          <h3 className="text-lg font-medium mb-2">Характеристики предмета</h3>
          <div className="grid grid-cols-2 gap-4">
            {selectedBase.base_armor && (
              <div>
                <span className="text-gray-400">Броня:</span>
                <span className="ml-2">{selectedBase.base_armor}</span>
              </div>
            )}
            {selectedBase.base_evasion && (
              <div>
                <span className="text-gray-400">Уклонение:</span>
                <span className="ml-2">{selectedBase.base_evasion}</span>
              </div>
            )}
            {selectedBase.base_energy_shield && (
              <div>
                <span className="text-gray-400">Энергетический щит:</span>
                <span className="ml-2">{selectedBase.base_energy_shield}</span>
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Создание предмета - {currentSlot?.name || 'Слот'}
            </h2>
            <button
              onClick={() => setShowCraftingModal(false)}
              className="p-2 hover:bg-gray-700 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Item Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Тип предмета</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2"
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">Выберите тип</option>
                  {itemTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name_ru}
                    </option>
                  ))}
                </select>
              </div>

              {/* Base Item Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">База предмета</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2"
                  onChange={(e) => {
                    const base = itemBases.find(b => b.id === e.target.value);
                    setSelectedBase(base || null);
                  }}
                  disabled={!selectedType}
                >
                  <option value="">Выберите базу</option>
                  {filteredBases.map(base => (
                    <option key={base.id} value={base.id}>
                      {base.name_ru} (ур. {base.required_level})
                    </option>
                  ))}
                </select>
              </div>

              {/* Item Stats */}
              {renderItemStats()}

              {/* Variants */}
              {selectedVariant && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Вариант предмета</h3>
                  <div className="p-4 bg-gray-700 rounded">
                    <div className="font-medium">{selectedVariant.variant_name_ru}</div>
                    {selectedVariant.quality_bonus && (
                      <div className="text-sm text-gray-400 mt-1">
                        Бонус качества: {selectedVariant.quality_bonus}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Crafting Methods */}
              {selectedBase && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Методы крафта</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {craftingMethods.map(method => (
                      <button
                        key={method.id}
                        className="p-3 bg-gray-700 rounded hover:bg-gray-600 text-left"
                      >
                        <div className="font-medium">{method.name_ru}</div>
                        <div className="text-sm text-gray-400">{method.description_ru}</div>
                        {method.cost_amount && (
                          <div className="text-sm text-yellow-400 mt-1">
                            Стоимость: {method.cost_amount} {method.cost_type}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Mods */}
              {selectedBase && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Доступные модификаторы</h3>
                    <button className="p-2 hover:bg-gray-700 rounded">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availableMods.map(mod => (
                      <div
                        key={mod.id}
                        className="p-3 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
                      >
                        <div className="font-medium">{mod.name_ru}</div>
                        <div className="text-sm text-gray-400">
                          {mod.stat_text_ru} ({mod.min_value} - {mod.max_value})
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Тир {mod.tier} • Вес {mod.weight}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={() => setShowCraftingModal(false)}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              Отмена
            </button>
            <button
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 flex items-center"
              disabled={!selectedBase}
            >
              <Hammer className="w-4 h-4 mr-2" />
              Создать предмет
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sword className="w-6 h-6 text-red-500" />
              <h1 className="text-xl font-bold">PoE2 Райдбот</h1>
            </div>
            <div className="flex space-x-4">
              <button className="flex items-center px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Сохранить билд
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 rounded hover:bg-green-700">
                <Share className="w-4 h-4 mr-2" />
                Поделиться
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Character Stats */}
          <div className="col-span-3">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Характеристики персонажа</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-red-500 mr-2" />
                    <span>Здоровье</span>
                  </div>
                  <span className="text-red-400">3,450</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-blue-500 mr-2" />
                    <span>Энергетический щит</span>
                  </div>
                  <span className="text-blue-400">1,200</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 text-yellow-500 mr-2" />
                    <span>УВС</span>
                  </div>
                  <span className="text-yellow-400">245,670</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Equipment Grid */}
          <div className="col-span-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex space-x-4 mb-6">
                <button
                  className={`px-4 py-2 rounded ${
                    selectedTab === 'gear' ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                  onClick={() => setSelectedTab('gear')}
                >
                  Снаряжение
                </button>
                <button
                  className={`px-4 py-2 rounded ${
                    selectedTab === 'skills' ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                  onClick={() => setSelectedTab('skills')}
                >
                  Умения
                </button>
                <button
                  className={`px-4 py-2 rounded ${
                    selectedTab === 'talents' ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                  onClick={() => setSelectedTab('talents')}
                >
                  Таланты
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-400">Загрузка данных...</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {/* Top Row */}
                  <div className="col-start-2 col-span-2">
                    <EquipmentSlot slot={equipmentSlots[0]} /> {/* Helmet */}
                  </div>

                  {/* Second Row */}
                  <div className="col-span-1">
                    <EquipmentSlot slot={equipmentSlots[1]} /> {/* Amulet */}
                  </div>
                  <div className="col-span-1">
                    <EquipmentSlot slot={equipmentSlots[2]} /> {/* Weapon */}
                  </div>
                  <div className="col-span-1">
                    <EquipmentSlot slot={equipmentSlots[3]} /> {/* Body Armour */}
                  </div>
                  <div className="col-span-1">
                    <EquipmentSlot slot={equipmentSlots[5]} /> {/* Shield/Weapon */}
                  </div>

                  {/* Third Row */}
                  <div className="col-span-1">
                    <EquipmentSlot slot={equipmentSlots[4]} /> {/* Left Ring */}
                  </div>
                  <div className="col-span-2">
                    <EquipmentSlot slot={equipmentSlots[6]} /> {/* Gloves */}
                  </div>
                  <div className="col-span-1">
                    <EquipmentSlot slot={equipmentSlots[7]} /> {/* Right Ring */}
                  </div>

                  {/* Bottom Row */}
                  <div className="col-start-2 col-span-1">
                    <EquipmentSlot slot={equipmentSlots[8]} /> {/* Boots */}
                  </div>
                  <div className="col-span-1">
                    <EquipmentSlot slot={equipmentSlots[9]} /> {/* Belt */}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - DPS Breakdown */}
          <div className="col-span-3">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-bold">Распределение УВС</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Физический</span>
                    <span className="text-gray-400">125,340</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Огненный</span>
                    <span className="text-gray-400">75,230</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Молния</span>
                    <span className="text-gray-400">45,100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Crafting Modal */}
      {showCraftingModal && <CraftingModal />}
    </div>
  );
}

function EquipmentSlot({ slot }: { slot: EquipmentSlot }) {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  return (
    <div
      className="aspect-square bg-gray-700 rounded-lg p-2 flex flex-col items-center justify-center border-2 border-gray-600 hover:border-blue-500 cursor-pointer relative"
      onClick={() => handleItemClick(slot)}
    >
      {selectedItem ? (
        <>
          <div className="text-sm font-medium">{selectedItem.base.name_ru}</div>
          <div className="text-xs text-gray-400 mt-1">
            {selectedItem.mods.length} модификаторов
          </div>
        </>
      ) : (
        <>
          <slot.icon className="w-6 h-6 text-gray-400 mb-2" />
          <span className="text-gray-400">{slot.name}</span>
        </>
      )}
    </div>
  );
}

export default App;