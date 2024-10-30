// src/constants/seasonSystem.js

export const TIME_CONSTANTS = {
    DAYS_PER_SEASON: 30,    // 1季節は30日
    SEASONS_PER_YEAR: 4,    // 1年は4季節
    TICKS_PER_DAY: 24,      // 1日は24ティック（1ティックは1秒）
  };
  
  export const SEASONS = {
    SPRING: {
      id: 'SPRING',
      name: '春',
      icon: '🌸',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      description: '生命力溢れる季節。風属性の魔術書が人気',
      elementModifiers: {
        FIRE: 0.8,
        ICE: 0.7,
        WIND: 1.5,
        EARTH: 1.2,
        LIGHTNING: 1.0
      },
      eventChance: 0.3
    },
    SUMMER: {
      id: 'SUMMER',
      name: '夏',
      icon: '☀️',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      description: '暑い季節。火属性と氷属性の魔術書の需要が高まる',
      elementModifiers: {
        FIRE: 1.3,
        ICE: 1.4,
        WIND: 0.9,
        EARTH: 0.8,
        LIGHTNING: 1.2
      },
      eventChance: 0.4
    },
    AUTUMN: {
      id: 'AUTUMN',
      name: '秋',
      icon: '🍁',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      description: '実りの季節。土属性の魔術書が特に重宝される',
      elementModifiers: {
        FIRE: 1.1,
        ICE: 0.9,
        WIND: 1.1,
        EARTH: 1.4,
        LIGHTNING: 1.0
      },
      eventChance: 0.3
    },
    WINTER: {
      id: 'WINTER',
      name: '冬',
      icon: '❄️',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      description: '厳しい寒さの季節。氷属性が強く、火属性も需要が高い',
      elementModifiers: {
        FIRE: 1.4,
        ICE: 1.5,
        WIND: 0.7,
        EARTH: 0.8,
        LIGHTNING: 1.1
      },
      eventChance: 0.3
    }
  };
  
  export const SEASONAL_EVENTS = {
    SPRING: [
      {
        id: 'SPRING_FESTIVAL',
        name: '春祭り',
        description: '春祭りの開催により、風属性の魔術書の需要が急上昇',
        duration: 5,
        effects: {
          elementBonus: { WIND: 2.0 },
          priceModifier: 1.3
        }
      }
    ],
    SUMMER: [
      {
        id: 'HEAT_WAVE',
        name: '熱波',
        description: '記録的な暑さにより、氷属性の魔術書が飛ぶように売れる',
        duration: 3,
        effects: {
          elementBonus: { ICE: 2.5 },
          priceModifier: 1.5
        }
      }
    ],
    AUTUMN: [
      {
        id: 'HARVEST_FESTIVAL',
        name: '収穫祭',
        description: '収穫祭により、土属性の魔術書の需要が増加',
        duration: 4,
        effects: {
          elementBonus: { EARTH: 1.8 },
          priceModifier: 1.4
        }
      }
    ],
    WINTER: [
      {
        id: 'BLIZZARD',
        name: '大吹雪',
        description: '厳しい寒さにより、火属性の魔術書の需要が急上昇',
        duration: 3,
        effects: {
          elementBonus: { FIRE: 2.0 },
          priceModifier: 1.6
        }
      }
    ]
  };