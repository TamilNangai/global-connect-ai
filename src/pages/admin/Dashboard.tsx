import { motion } from "framer-motion";
import {
  Globe, Users, Zap, Brain,
  TrendingUp, MessageSquare, Activity, Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";

const stats = [
  { label: "Total Users", value: "12,847", change: "+12.5%", icon: Users, color: "text-royal" },
  { label: "Active Sessions", value: "1,284", change: "+8.3%", icon: Activity, color: "text-azure" },
  { label: "Languages Used", value: "42", change: "+3", icon: Globe, color: "text-royal" },
  { label: "Avg Response", value: "87ms", change: "-14ms", icon: Clock, color: "text-azure" },
];

const activityData = [
  { name: "Mon", requests: 4200, users: 850 },
  { name: "Tue", requests: 5100, users: 920 },
  { name: "Wed", requests: 4800, users: 880 },
  { name: "Thu", requests: 6300, users: 1100 },
  { name: "Fri", requests: 5900, users: 1050 },
  { name: "Sat", requests: 3200, users: 620 },
  { name: "Sun", requests: 2900, users: 550 },
];

const languageData = [
  { lang: "English", count: 4200 },
  { lang: "Spanish", count: 2800 },
  { lang: "French", count: 1900 },
  { lang: "Chinese", count: 1600 },
  { lang: "Arabic", count: 1200 },
  { lang: "Hindi", count: 980 },
];

const recentConversations = [
  { user: "John D.", lang: "EN → ES", sentiment: "Positive", time: "2m ago" },
  { user: "Aisha K.", lang: "AR → EN", sentiment: "Neutral", time: "5m ago" },
  { user: "Li Wei", lang: "ZH → FR", sentiment: "Positive", time: "8m ago" },
  { user: "Maria S.", lang: "ES → EN", sentiment: "Neutral", time: "12m ago" },
  { user: "Raj P.", lang: "HI → EN", sentiment: "Positive", time: "15m ago" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Dashboard = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back, Admin</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with UniSpeak AI today.</p>
      </motion.div>

      {/* Stats grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card-gradient shadow-card border-border/50 hover:shadow-elevated transition-shadow duration-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-royal/10 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-royal" />
                Weekly Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorReqs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" strokeOpacity={0.5} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(215 20% 65%)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(215 20% 65%)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0 0% 100%)",
                        border: "1px solid hsl(214 32% 91%)",
                        borderRadius: "0.75rem",
                        fontSize: 12,
                      }}
                    />
                    <Area type="monotone" dataKey="requests" stroke="hsl(217 91% 60%)" fill="url(#colorReqs)" strokeWidth={2} />
                    <Area type="monotone" dataKey="users" stroke="hsl(199 89% 48%)" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Language distribution */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card border-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4 text-azure" />
                Top Languages
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={languageData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" strokeOpacity={0.5} />
                    <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(215 20% 65%)" />
                    <YAxis dataKey="lang" type="category" tick={{ fontSize: 11 }} stroke="hsl(215 20% 65%)" width={60} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0 0% 100%)",
                        border: "1px solid hsl(214 32% 91%)",
                        borderRadius: "0.75rem",
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(217 91% 60%)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent conversations table */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-royal" />
              Recent Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">User</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Translation</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden sm:table-cell">Sentiment</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentConversations.map((conv, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2 font-medium text-foreground">{conv.user}</td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-1 rounded-md bg-royal/10 text-royal text-xs font-medium">{conv.lang}</span>
                      </td>
                      <td className="py-3 px-2 hidden sm:table-cell">
                        <span className={`text-xs font-medium ${conv.sentiment === "Positive" ? "text-emerald-500" : "text-muted-foreground"}`}>
                          {conv.sentiment}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right text-muted-foreground">{conv.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
