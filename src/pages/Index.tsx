import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopNav } from '@/components/TopNav';
import { Drawer } from '@/components/Drawer';
import { Dashboard } from '@/pages/Dashboard';
import { Recharge } from '@/pages/Recharge';
import { Profile } from '@/pages/Profile';
import { Earnings } from '@/pages/Earnings';
import { ComingSoon } from '@/pages/ComingSoon';
import { useEarnifyData } from '@/hooks/useEarnifyData';
import { useToast } from '@/hooks/use-toast';

type Page = 'dashboard' | 'recharge' | 'profile' | 'earnings' | 'settings';

const Index = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { toast } = useToast();
  
  const {
    points,
    progress,
    timeDisplay,
    isMining,
    toggleMining,
    spendPoints,
    userName,
    userAvatar,
    updateUserName,
    updateUserAvatar,
    totalPointsEarned,
    totalPointsSpent,
    daysActive,
    earningHistory,
    goalReached
  } = useEarnifyData();

  // Show toast when goal is reached
  useEffect(() => {
    if (goalReached) {
      toast({
        title: "🎉 Congratulations!",
        description: "Daily 5 hours complete! 1 Point has been added.",
      });
    }
  }, [goalReached, toast]);

  const pageTitles: Record<Page, string> = {
    dashboard: 'Dashboard',
    recharge: 'Recharge',
    profile: 'My Profile',
    earnings: 'My Earnings',
    settings: 'Settings',
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            points={points}
            progress={progress}
            timeDisplay={timeDisplay}
            isMining={isMining}
            onToggleMining={toggleMining}
          />
        );
      case 'recharge':
        return (
          <Recharge
            points={points}
            onSpendPoints={spendPoints}
            onNavigate={setCurrentPage}
          />
        );
      case 'profile':
        return (
          <Profile
            userName={userName}
            userAvatar={userAvatar}
            points={points}
            onUpdateName={updateUserName}
            onUpdateAvatar={updateUserAvatar}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'earnings':
        return (
          <Earnings
            points={points}
            totalPointsEarned={totalPointsEarned}
            totalPointsSpent={totalPointsSpent}
            daysActive={daysActive}
            earningHistory={earningHistory}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      default:
        return (
          <ComingSoon
            title={pageTitles[currentPage]}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav 
        onMenuClick={() => setDrawerOpen(true)} 
        points={points}
      />
      
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={(page) => setCurrentPage(page as Page)}
        currentPage={currentPage}
        points={points}
        userName={userName}
        userAvatar={userAvatar}
      />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col"
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default Index;
