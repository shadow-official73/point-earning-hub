import { useState, useEffect, useCallback } from 'react';

interface EarnifyData {
  points: number;
  secondsDone: number;
  lastDate: string;
  userName: string;
  userAvatar: string | null;
}

const STORAGE_KEY = 'earnify_data';
const GOAL_SECONDS = 18000; // 5 hours = 18,000 seconds

const getInitialData = (): EarnifyData => {
  const today = new Date().toISOString().split('T')[0];
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (stored) {
    const data = JSON.parse(stored) as EarnifyData;
    // Reset daily progress if it's a new day
    if (data.lastDate !== today) {
      return { ...data, secondsDone: 0, lastDate: today };
    }
    return data;
  }
  
  return {
    points: 0,
    secondsDone: 0,
    lastDate: today,
    userName: 'User',
    userAvatar: null
  };
};

export const useEarnifyData = () => {
  const [data, setData] = useState<EarnifyData>(getInitialData);
  const [isMining, setIsMining] = useState(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Mining timer
  useEffect(() => {
    if (!isMining) return;

    const interval = setInterval(() => {
      setData(prev => {
        if (prev.secondsDone >= GOAL_SECONDS - 1) {
          // Goal reached - award point and reset
          setIsMining(false);
          return {
            ...prev,
            points: prev.points + 1,
            secondsDone: 0
          };
        }
        return {
          ...prev,
          secondsDone: prev.secondsDone + 1
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isMining]);

  const toggleMining = useCallback(() => {
    setIsMining(prev => !prev);
  }, []);

  const spendPoints = useCallback((amount: number): boolean => {
    if (data.points >= amount) {
      setData(prev => ({ ...prev, points: prev.points - amount }));
      return true;
    }
    return false;
  }, [data.points]);

  const progress = (data.secondsDone / GOAL_SECONDS) * 100;
  
  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const updateUserName = useCallback((name: string) => {
    setData(prev => ({ ...prev, userName: name }));
  }, []);

  const updateUserAvatar = useCallback((avatar: string | null) => {
    setData(prev => ({ ...prev, userAvatar: avatar }));
  }, []);

  return {
    points: data.points,
    secondsDone: data.secondsDone,
    userName: data.userName,
    userAvatar: data.userAvatar,
    isMining,
    progress,
    timeDisplay: formatTime(data.secondsDone),
    goalTime: formatTime(GOAL_SECONDS),
    toggleMining,
    spendPoints,
    updateUserName,
    updateUserAvatar,
    goalReached: data.secondsDone >= GOAL_SECONDS
  };
};
