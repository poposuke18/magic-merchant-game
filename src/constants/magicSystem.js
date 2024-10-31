// src/constants/magicSystem.js

const MAGIC_ELEMENTS = {
    FIRE: {
      id: 'FIRE',
      name: '火属性',
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-500',
      icon: '🔥',
      basePower: 1.2,
      description: '攻撃的な魔法。モンスター側で人気が高い',
      humanDemand: 0.6,
      monsterDemand: 1.2
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
    },
    WIND: {
      id: 'WIND',
      name: '風属性',
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-500',
      icon: '🌪️',
      basePower: 0.9,
      description: '機動性の高い魔法。人間側で重宝される',
      humanDemand: 1.3,
      monsterDemand: 0.7
    },
    EARTH: {
      id: 'EARTH',
      name: '土属性',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-700',
      icon: '🌍',
      basePower: 1.1,
      description: '堅実な魔法。両陣営で安定した需要がある',
      humanDemand: 1.1,
      monsterDemand: 1.1
    },
    LIGHTNING: {
      id: 'LIGHTNING',
      name: '雷属性',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-500',
      icon: '⚡',
      basePower: 1.4,
      description: '破壊力の高い魔法。価格は高いが需要も高い',
      humanDemand: 1.2,
      monsterDemand: 1.2
    }
  };
  
  // 素材の拡張
const MATERIALS = {
    // 基本素材
    MAGIC_INK: {
      id: 'MAGIC_INK',
      name: '魔法の墨',
      basePrice: 40,
      marketInfluence: 0.8,
      description: '全ての魔術書に必要な基本素材',
      icon: '🖋️'
    },
    ENCHANTED_PAPER: {
      id: 'ENCHANTED_PAPER',
      name: '魔法の紙',
      basePrice: 20,
      marketInfluence: 0.5,
      description: '全ての魔術書に必要な基本素材',
      icon: '📜'
    },
    // 火属性素材
    FLAME_ESSENCE: {
      id: 'FLAME_ESSENCE',
      name: '炎のエッセンス',
      basePrice: 80,
      marketInfluence: 1.2,
      element: 'FIRE',
      description: '火属性の魔術書に必要',
      icon: '🔮'
    },
    // 氷属性素材
    FROST_CRYSTAL: {
      id: 'FROST_CRYSTAL',
      name: '氷の結晶',
      basePrice: 60,
      marketInfluence: 1.0,
      element: 'ICE',
      description: '氷属性の魔術書に必要',
      icon: '💎'
    },
    // 風属性素材
    WIND_FEATHER: {
      id: 'WIND_FEATHER',
      name: '風切羽',
      basePrice: 80,
      marketInfluence: 0.9,
      element: 'WIND',
      description: '風属性の魔術書に必要',
      icon: '🪶'
    },
    // 土属性素材
    EARTH_CRYSTAL: {
      id: 'EARTH_CRYSTAL',
      name: '大地の結晶',
      basePrice: 95,
      marketInfluence: 1.1,
      element: 'EARTH',
      description: '土属性の魔術書に必要',
      icon: '💎'
    },
    // 雷属性素材
    THUNDER_SHARD: {
      id: 'THUNDER_SHARD',
      name: '雷の破片',
      basePrice: 120,
      marketInfluence: 1.3,
      element: 'LIGHTNING',
      description: '雷属性の魔術書に必要',
      icon: '⚡'
    }
  };
  
  // レシピの拡張
const RECIPES = {
    // 火属性のレシピ
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
    // 氷属性のレシピ
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
    },
    // 風属性のレシピ
    WIND_BASIC: {
      id: 'WIND_BASIC',
      name: '初級風刃魔術書',
      element: 'WIND',
      rank: 'BASIC',
      materials: {
        MAGIC_INK: 1,
        ENCHANTED_PAPER: 2,
        WIND_FEATHER: 1
      },
      craftingTime: 4500, // やや短い作成時間
      basePower: 4,
      levelRequired: 5, // レベル5で解放
      description: '基本的な風属性魔法を記した魔術書'
    },
    WIND_IMPROVED: {
      id: 'WIND_IMPROVED',
      name: '中級竜巻魔術書',
      element: 'WIND',
      rank: 'IMPROVED',
      materials: {
        MAGIC_INK: 2,
        ENCHANTED_PAPER: 3,
        WIND_FEATHER: 2
      },
      craftingTime: 9000,
      basePower: 12,
      levelRequired: 5,
      description: '強力な風の力を操る魔術書'
    },
    // 土属性のレシピ
    EARTH_BASIC: {
      id: 'EARTH_BASIC',
      name: '初級大地魔術書',
      element: 'EARTH',
      rank: 'BASIC',
      materials: {
        MAGIC_INK: 1,
        ENCHANTED_PAPER: 2,
        EARTH_CRYSTAL: 1
      },
      craftingTime: 5500,
      basePower: 6,
      levelRequired: 5,
      description: '大地の力を操る基本的な魔術書'
    },
    EARTH_IMPROVED: {
      id: 'EARTH_IMPROVED',
      name: '中級地震魔術書',
      element: 'EARTH',
      rank: 'IMPROVED',
      materials: {
        MAGIC_INK: 2,
        ENCHANTED_PAPER: 3,
        EARTH_CRYSTAL: 2
      },
      craftingTime: 11000,
      basePower: 18,
      levelRequired: 5,
      description: '強力な地震を起こす魔術書'
    },
    // 雷属性のレシピ
    LIGHTNING_BASIC: {
      id: 'LIGHTNING_BASIC',
      name: '初級雷撃魔術書',
      element: 'LIGHTNING',
      rank: 'BASIC',
      materials: {
        MAGIC_INK: 1,
        ENCHANTED_PAPER: 2,
        THUNDER_SHARD: 1
      },
      craftingTime: 6000,
      basePower: 7,
      levelRequired: 10,
      description: '破壊力の高い雷魔法の基本書'
    },
    LIGHTNING_IMPROVED: {
      id: 'LIGHTNING_IMPROVED',
      name: '中級落雷魔術書',
      element: 'LIGHTNING',
      rank: 'IMPROVED',
      materials: {
        MAGIC_INK: 2,
        ENCHANTED_PAPER: 3,
        THUNDER_SHARD: 2
      },
      craftingTime: 12000,
      basePower: 21,
      levelRequired: 10,
      description: '強大な雷を操る上級魔術書'
    }
  };
  
  // 属性ごとの特徴
  const ELEMENT_CHARACTERISTICS = {
    FIRE: {
      strengths: ['モンスター側での高い需要', '安定した攻撃力'],
      weaknesses: ['人間側での低い需要', '季節による需要変動']
    },
    ICE: {
      strengths: ['バランスの取れた需要', '安定した価格'],
      weaknesses: ['特に突出した特徴がない']
    },
    WIND: {
      strengths: ['人間側での高い需要', '短い製作時間'],
      weaknesses: ['やや低い基本威力', 'モンスター側での低い需要']
    },
    EARTH: {
      strengths: ['両陣営での安定した需要', '高い基本威力'],
      weaknesses: ['長い製作時間', '高い素材コスト']
    },
    LIGHTNING: {
      strengths: ['非常に高い威力', '両陣営での高い需要'],
      weaknesses: ['最も高い素材コスト', '最も長い製作時間']
    }
  };

  const LEVEL_REQUIREMENTS = {
    MAGIC_TIERS: {
      BEGINNER: { 
        level: 0, 
        elements: ['FIRE', 'ICE'],
        description: '基本的な魔法を扱えるようになる'
      },
      INTERMEDIATE: { 
        level: 5, 
        elements: ['WIND', 'EARTH'],
        description: '風と土の魔法を扱えるようになる'
      },
      ADVANCED: { 
        level: 10, 
        elements: ['LIGHTNING'],
        description: '雷の魔法を扱えるようになる'
      }
    },
    BOOK_RANKS: {
      BASIC: { 
        level: 0, 
        description: '初級魔術書',
        powerModifier: 1.0
      },
      IMPROVED: { 
        level: 3, 
        description: '中級魔術書',
        powerModifier: 1.5
      },
      ADVANCED: { 
        level: 7, 
        description: '上級魔術書',
        powerModifier: 2.0
      },
      MASTER: { 
        level: 12, 
        description: '極級魔術書',
        powerModifier: 3.0
      }
    }
  };
  
  export {
    MAGIC_ELEMENTS,
    MATERIALS,
    RECIPES,
    LEVEL_REQUIREMENTS
  };