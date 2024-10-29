import React, { useEffect, useState, useCallback } from 'react';
import EVENT_TYPES from './EventTypes';

const EventManager = ({ gameState, setGameState }) => {
  const [activePrecursor, setActivePrecursor] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);

  // イベント処理を関数として分離
  const handleEvent = useCallback((selectedEvent) => {
    setActiveEvent(selectedEvent);
    setGameState(prev => selectedEvent.effect(prev));
  }, [setGameState]);

  useEffect(() => {
    if (!gameState.gameStarted || activePrecursor || activeEvent) return;

    let mounted = true;
    let precursorTimer = null;
    let eventDisplayTimer = null;

    const eventTimer = setTimeout(() => {
      if (!mounted) return;

      const possibleEvents = Object.values(EVENT_TYPES);
      const selectedEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];

      if (Math.random() < selectedEvent.precursorChance) {
        const precursorMessage = selectedEvent.precursorMessages[
          Math.floor(Math.random() * selectedEvent.precursorMessages.length)
        ];

        setActivePrecursor({
          eventType: selectedEvent,
          message: precursorMessage
        });

        // 予兆の処理
        precursorTimer = setTimeout(() => {
          if (!mounted) return;
          
          setActivePrecursor(null);
          if (Math.random() < selectedEvent.eventChance) {
            handleEvent(selectedEvent);
            
            // イベント表示の処理
            eventDisplayTimer = setTimeout(() => {
              if (mounted) {
                setActiveEvent(null);
              }
            }, 5000);
          }
        }, 30000);
      }
    }, 60000);

    // クリーンアップ関数
    return () => {
      mounted = false;
      clearTimeout(eventTimer);
      if (precursorTimer) clearTimeout(precursorTimer);
      if (eventDisplayTimer) clearTimeout(eventDisplayTimer);
    };
  }, [gameState.gameStarted, activePrecursor, activeEvent, handleEvent]);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      {activePrecursor && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4 rounded shadow-lg">
          <p className="text-yellow-700">{activePrecursor.message}</p>
        </div>
      )}
      {activeEvent && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded shadow-lg">
          <h4 className="text-red-700 font-bold">{activeEvent.name}</h4>
          <p className="text-red-600">{activeEvent.description}</p>
        </div>
      )}
    </div>
  );
};

export default EventManager;