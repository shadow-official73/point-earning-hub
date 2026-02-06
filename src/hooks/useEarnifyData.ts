import { useState, useEffect, useCallback } from 'react';

export interface EarningHistoryItem {
  date: string;
  pointsEarned: number;
  secondsMined: number;
  type: 'earned' | 'spent';
  description: string;
}

interface EarnifyData {
  points: number;
  secondsDone: number;
  lastDate: string;
  userName: string;
  userAvatar: string | null;
  totalPointsEarned: number;
  totalPointsSpent: number;
  daysActive: number;
  earningHistory: EarningHistoryItem[];
}

const STORAGE_KEY = 'rajvirwala_data';
const GOAL_SECONDS = 18000; // 5 hours = 18,000 seconds

const getInitialData = (): EarnifyData => {
  const today = new Date().toISOString().split('T')[0];
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (stored) {
    const data = JSON.parse(stored) as EarnifyData;
    // Reset daily progress if it's a new day
    if (data.lastDate !== today) {
      const newDaysActive = (data.daysActive || 1) + 1;
      return { ...data, secondsDone: 0, lastDate: today, daysActive: newDaysActive };
    }
    return {
      ...data,
      totalPointsEarned: data.totalPointsEarned || data.points,
      totalPointsSpent: data.totalPointsSpent || 0,
      daysActive: data.daysActive || 1,
      earningHistory: data.earningHistory || []
    };
  }
  
  return {
    points: 0,
    secondsDone: 0,
    lastDate: today,
    userName: 'User',
    userAvatar: null,
    totalPointsEarned: 0,
    totalPointsSpent: 0,
    daysActive: 1,
    earningHistory: []
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
          const newHistoryItem: EarningHistoryItem = {
            date: new Date().toISOString(),
            pointsEarned: 1,
            secondsMined: GOAL_SECONDS,
            type: 'earned',
            description: 'Daily mining goal completed'
          };
          return {
            ...prev,
            points: prev.points + 1,
            totalPointsEarned: prev.totalPointsEarned + 1,
            secondsDone: 0,
            earningHistory: [newHistoryItem, ...prev.earningHistory].slice(0, 50)
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

  const spendPoints = useCallback((amount: number, description: string = 'Points spent'): boolean => {
    if (data.points >= amount) {
      const newHistoryItem: EarningHistoryItem = {
        date: new Date().toISOString(),
        pointsEarned: amount,
        secondsMined: 0,
        type: 'spent',
        description
      };
      setData(prev => ({ 
        ...prev, 
        points: prev.points - amount,
        totalPointsSpent: prev.totalPointsSpent + amount,
        earningHistory: [newHistoryItem, ...prev.earningHistory].slice(0, 50)
      }));
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
    totalPointsEarned: data.totalPointsEarned,
    totalPointsSpent: data.totalPointsSpent,
    daysActive: data.daysActive,
    earningHistory: data.earningHistory,
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
