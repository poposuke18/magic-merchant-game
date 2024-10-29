// src/constants/magicSystem.js
export const MAGIC_ELEMENTS = {
    FIRE: {
      id: 'FIRE',
      name: '火属性',
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-500',
      icon: '🔥',
      basePower: 1.2,
      description: '攻撃的な魔法。人間側で人気が高い',
      humanDemand: 1.3,
      monsterDemand: 0.7
    },
    ICE: {
      id: 'ICE',
      name: '氷属性',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-500',
      icon: '❄️',
      basePower: 1.0,
      description: '防御的な魔法。安定した需要がある',
      humanDemand: 1.0,
      monsterDemand: 1.0
    }
    // 他の属性は後で追加
  };
  
  export const MATERIALS = {
    MAGIC_INK: {
      id: 'MAGIC_INK',
      name: '魔法の墨',
      basePrice: 50,
      marketInfluence: 0.8,
      description: '全ての魔術書に必要な基本素材',
      icon: '🖋️'
    },
    ENCHANTED_PAPER: {
      id: 'ENCHANTED_PAPER',
      name: '魔法の紙',
      basePrice: 30,
      marketInfluence: 0.5,
      description: '全ての魔術書に必要な基本素材',
      icon: '📜'
    },
    FLAME_ESSENCE: {
      id: 'FLAME_ESSENCE',
      name: '炎のエッセンス',
      basePrice: 100,
      marketInfluence: 1.2,
      element: 'FIRE',
      description: '火属性の魔術書に必要',
      icon: '🔮'
    },
    FROST_CRYSTAL: {
      id: 'FROST_CRYSTAL',
      name: '氷の結晶',
      basePrice: 90,
      marketInfluence: 1.0,
      element: 'ICE',
      description: '氷属性の魔術書に必要',
      icon: '💎'
    }
  };
  
  export const RECIPES = {
    FIRE_BASIC: {
      id: 'FIRE_BASIC',
      name: '初級火炎魔術書',
      element: 'FIRE',
      rank: 'BASIC',
      materials: {
        MAGIC_INK: 1,
        ENCHANTED_PAPER: 2,
        FLAME_ESSENCE: 1
      },
      craftingTime: 5000,
      basePower: 5,
      levelRequired: 0,
      description: '基本的な火炎魔法を記した魔術書'
    },
    ICE_BASIC: {
      id: 'ICE_BASIC',
      name: '初級氷結魔術書',
      element: 'ICE',
      rank: 'BASIC',
      materials: {
        MAGIC_INK: 1,
        ENCHANTED_PAPER: 2,
        FROST_CRYSTAL: 1
      },
      craftingTime: 5000,
      basePower: 5,
      levelRequired: 0,
      description: '基本的な氷結魔法を記した魔術書'
    }
    // 他のレシピは後で追加
  };
  
  export const LEVEL_REQUIREMENTS = {
    MAGIC_TIERS: {
      BEGINNER: { level: 0, elements: ['FIRE', 'ICE'] },
      INTERMEDIATE: { level: 5, elements: ['WIND', 'EARTH'] },
      ADVANCED: { level: 10, elements: ['LIGHTNING'] }
    },
    BOOK_RANKS: {
      BASIC: { level: 0, description: '初級魔術書' },
      IMPROVED: { level: 3, description: '中級魔術書' },
      ADVANCED: { level: 7, description: '上級魔術書' },
      MASTER: { level: 12, description: '極級魔術書' }
    }
  };