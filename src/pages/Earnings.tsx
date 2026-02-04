import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Coins, Clock, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { EarningHistoryItem } from '@/hooks/useEarnifyData';

interface EarningsProps {
  points: number;
  totalPointsEarned: number;
  totalPointsSpent: number;
  daysActive: number;
  earningHistory: EarningHistoryItem[];
  onBack: () => void;
}

export const Earnings = ({
  points,
  totalPointsEarned,
  totalPointsSpent,
  daysActive,
  earningHistory,
  onBack
}: EarningsProps) => {
  
  // Generate chart data from history or mock data if empty
  const getChartData = () => {
    if (earningHistory.length === 0) {
      // Mock data for visualization
      return [
        { day: 'Mon', earned: 0, spent: 0 },
        { day: 'Tue', earned: 0, spent: 0 },
        { day: 'Wed', earned: 0, spent: 0 },
        { day: 'Thu', earned: 0, spent: 0 },
        { day: 'Fri', earned: 0, spent: 0 },
        { day: 'Sat', earned: 0, spent: 0 },
        { day: 'Sun', earned: totalPointsEarned, spent: totalPointsSpent },
      ];
    }
    
    // Group by day for last 7 days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const chartData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayEarnings = earningHistory
        .filter(item => item.date.startsWith(dateStr) && item.type === 'earned')
        .reduce((sum, item) => sum + item.pointsEarned, 0);
      
      const daySpent = earningHistory
        .filter(item => item.date.startsWith(dateStr) && item.type === 'spent')
        .reduce((sum, item) => sum + item.pointsEarned, 0);
      
      chartData.push({
        day: days[date.getDay()],
        earned: dayEarnings,
        spent: daySpent
      });
    }
    
    return chartData;
  };

  const chartData = getChartData();
  const avgPerDay = daysActive > 0 ? (totalPointsEarned / daysActive).toFixed(1) : '0';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = [
    { 
      icon: Coins, 
      label: 'Total Earned', 
      value: totalPointsEarned,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    { 
      icon: TrendingUp, 
      label: 'Current Balance', 
      value: points,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      icon: Calendar, 
      label: 'Days Active', 
      value: daysActive,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    { 
      icon: Clock, 
      label: 'Avg/Day', 
      value: avgPerDay,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
  ];

  return (
    <div className="flex-1 flex flex-col px-4 py-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold text-foreground">My Earnings</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-2`}>
                    <Icon size={20} className={stat.color} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Earnings Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Weekly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEarned" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    hide
                    domain={[0, 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="earned"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorEarned)"
                    name="Earned"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Points Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Points Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: 'Points', earned: totalPointsEarned, spent: totalPointsSpent, balance: points }]} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="earned" fill="hsl(142, 71%, 45%)" name="Earned" radius={[4, 4, 4, 4]} />
                  <Bar dataKey="spent" fill="hsl(0, 84%, 60%)" name="Spent" radius={[4, 4, 4, 4]} />
                  <Bar dataKey="balance" fill="hsl(var(--primary))" name="Balance" radius={[4, 4, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-xs text-muted-foreground">Earned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="text-xs text-muted-foreground">Spent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary" />
                <span className="text-xs text-muted-foreground">Balance</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* History List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {earningHistory.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-muted-foreground text-sm">No activity yet</p>
                <p className="text-xs text-muted-foreground mt-1">Start mining to see your history!</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {earningHistory.slice(0, 10).map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.type === 'earned' ? 'bg-green-500/10' : 'bg-red-500/10'
                      }`}>
                        {item.type === 'earned' ? (
                          <ArrowUpRight size={16} className="text-green-500" />
                        ) : (
                          <ArrowDownRight size={16} className="text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.description}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
                      </div>
                    </div>
                    <span className={`font-semibold ${
                      item.type === 'earned' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {item.type === 'earned' ? '+' : '-'}{item.pointsEarned}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
