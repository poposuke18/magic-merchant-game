// EventTypes.js
const EVENT_TYPES = {
    HERO_ARRIVAL: {
      id: 'HERO_ARRIVAL',
      name: '勇者の出現',
      description: '勇者が現れ、人間勢力が一時的に強化される',
      precursorChance: 0.7,
      eventChance: 0.6,
      precursorMessages: [
        '街で勇者の噂が広がっている...',
        '遠方で不思議な剣の輝きが目撃された...'
      ],
      effect: (gameState) => ({
        ...gameState,
        humanPower: Math.min(100, gameState.humanPower + 15),
        monsterPower: Math.max(0, gameState.monsterPower - 15)
      })
    },
    DRAGON_ATTACK: {
      id: 'DRAGON_ATTACK',
      name: 'ドラゴンの襲来',
      description: 'ドラゴンが現れ、魔物勢力が一時的に強化される',
      precursorChance: 0.6,
      eventChance: 0.5,
      precursorMessages: [
        '空から不気味な咆哮が聞こえる...',
        '近隣の村々で家畜が消失している...'
      ],
      effect: (gameState) => ({
        ...gameState,
        monsterPower: Math.min(100, gameState.monsterPower + 15),
        humanPower: Math.max(0, gameState.humanPower - 15)
      })
    },
    MARKET_BOOM: {
      id: 'MARKET_BOOM',
      name: '市場高騰',
      description: '魔術書の価格が一時的に上昇する',
      precursorChance: 0.5,
      eventChance: 0.4,
      precursorMessages: [
        '魔術書の需要が急激に高まっている...',
        '近隣諸国から商人たちが集まってきている...'
      ],
      effect: (gameState) => ({
        ...gameState,
        marketTrend: Math.min(0.5, gameState.marketTrend + 0.3),
        volatility: Math.min(0.4, gameState.volatility * 1.5)
      })
    }
  };
  
  export default EVENT_TYPES;