// import { motion } from "framer-motion";
// import {
//   Globe, Users, Zap, Brain,
//   TrendingUp, MessageSquare, Activity, Clock,
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
//   ResponsiveContainer, BarChart, Bar,
// } from "recharts";
// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";

// const containerVariants = {
//   hidden: {},
//   visible: { transition: { staggerChildren: 0.08 } },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
// };

// const Dashboard = () => {
//   // Fetch real stats
//   const { data: totalUsers } = useQuery({
//     queryKey: ["totalUsers"],
//     queryFn: async () => {
//       const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true });
//       return count || 0;
//     },
//   });

//   const { data: activeSessions } = useQuery({
//     queryKey: ["activeSessions"],
//     queryFn: async () => {
//       const { count } = await supabase.from("conversations").select("*", { count: "exact", head: true }).is("ended_at", null);
//       return count || 0;
//     },
//   });

//   const { data: languagesUsed } = useQuery({
//     queryKey: ["languagesUsed"],
//     queryFn: async () => {
//       const { data } = await supabase.from("messages").select("language");
//       const unique = new Set(data?.map(m => m.language).filter(Boolean));
//       return unique.size;
//     },
//   });

//   const { data: avgResponse } = useQuery({
//     queryKey: ["avgResponse"],
//     queryFn: async () => {
//       const { data } = await supabase.from("assistant_analytics").select("duration_seconds");
//       if (!data || data.length === 0) return 0;
//       const avg = data.reduce((sum, a) => sum + (a.duration_seconds || 0), 0) / data.length;
//       return Math.round(avg * 1000); // to ms
//     },
//   });

//   const { data: languageData } = useQuery({
//     queryKey: ["languageData"],
//     queryFn: async () => {
//       const { data } = await supabase.from("messages").select("language");
//       const counts: Record<string, number> = {};
//       data?.forEach(m => {
//         if (m.language) counts[m.language] = (counts[m.language] || 0) + 1;
//       });
//       return Object.entries(counts).slice(0, 6).map(([lang, count]) => ({ lang, count }));
//     },
//   });

//   const { data: recentConversations } = useQuery({
//     queryKey: ["recentConversations"],
//     queryFn: async () => {
//       const { data } = await supabase
//         .from("conversations")
//         .select(`
//           id,
//           language,
//           sentiment,
//           created_at,
//           profiles(display_name)
//         `)
//         .order("created_at", { ascending: false })
//         .limit(5);
//       return data?.map(c => ({
//         user: (c.profiles as any)?.display_name || "Anonymous",
//         lang: `${c.language?.toUpperCase() || "EN"} → EN`,
//         sentiment: c.sentiment || "Neutral",
//         time: new Date(c.created_at).toLocaleString(),
//       })) || [];
//     },
//   });

//   // Mock activity data for now
//   const activityData = [
//     { name: "Mon", requests: 4200, users: 850 },
//     { name: "Tue", requests: 5100, users: 920 },
//     { name: "Wed", requests: 4800, users: 880 },
//     { name: "Thu", requests: 6300, users: 1100 },
//     { name: "Fri", requests: 5900, users: 1050 },
//     { name: "Sat", requests: 3200, users: 620 },
//     { name: "Sun", requests: 2900, users: 550 },
//   ];

//   const stats = [
//     {
//       label: "Total Users",
//       value: totalUsers !== undefined ? totalUsers.toLocaleString() : "...",
//       change: "+12%",
//       icon: Users,
//       color: "text-royal",
//     },
//     {
//       label: "Active Sessions",
//       value: activeSessions !== undefined ? activeSessions.toLocaleString() : "...",
//       change: "+5%",
//       icon: Activity,
//       color: "text-emerald-500",
//     },
//     {
//       label: "Languages Used",
//       value: languagesUsed !== undefined ? languagesUsed.toString() : "...",
//       change: "+2",
//       icon: Globe,
//       color: "text-azure",
//     },
//     {
//       label: "Avg. Response Time",
//       value: avgResponse !== undefined ? `${avgResponse}ms` : "...",
//       change: "-10ms",
//       icon: Clock,
//       color: "text-amber-500",
//     },
//   ];

//   return (
//     <motion.div
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className="space-y-6"
//     >
//       {/* Welcome */}
//       <motion.div variants={itemVariants}>
//         <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back, Admin</h1>
//         <p className="text-muted-foreground mt-1">Here's what's happening with UniSpeak AI today.</p>
//       </motion.div>

//       {/* Stats grid */}
//       <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat) => (
//           <Card key={stat.label} className="bg-card-gradient shadow-card border-border/50 hover:shadow-elevated transition-shadow duration-300">
//             <CardContent className="p-5">
//               <div className="flex items-center justify-between mb-3">
//                 <div className={`w-10 h-10 rounded-xl bg-royal/10 flex items-center justify-center`}>
//                   <stat.icon className={`w-5 h-5 ${stat.color}`} />
//                 </div>
//                 <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
//                   {stat.change}
//                 </span>
//               </div>
//               <div className="text-2xl font-bold text-foreground">{stat.value}</div>
//               <div className="text-sm text-muted-foreground">{stat.label}</div>
//             </CardContent>
//           </Card>
//         ))}
//       </motion.div>

//       {/* Charts row */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Activity chart */}
//         <motion.div variants={itemVariants} className="lg:col-span-2">
//           <Card className="shadow-card border-border/50">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-base font-semibold flex items-center gap-2">
//                 <TrendingUp className="w-4 h-4 text-royal" />
//                 Weekly Activity
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="pt-0">
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart data={activityData}>
//                     <defs>
//                       <linearGradient id="colorReqs" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
//                         <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" strokeOpacity={0.5} />
//                     <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(215 20% 65%)" />
//                     <YAxis tick={{ fontSize: 12 }} stroke="hsl(215 20% 65%)" />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: "hsl(0 0% 100%)",
//                         border: "1px solid hsl(214 32% 91%)",
//                         borderRadius: "0.75rem",
//                         fontSize: 12,
//                       }}
//                     />
//                     <Area type="monotone" dataKey="requests" stroke="hsl(217 91% 60%)" fill="url(#colorReqs)" strokeWidth={2} />
//                     <Area type="monotone" dataKey="users" stroke="hsl(199 89% 48%)" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Language distribution */}
//         <motion.div variants={itemVariants}>
//           <Card className="shadow-card border-border/50 h-full">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-base font-semibold flex items-center gap-2">
//                 <Globe className="w-4 h-4 text-azure" />
//                 Top Languages
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="pt-0">
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={languageData} layout="vertical">
//                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" strokeOpacity={0.5} />
//                     <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(215 20% 65%)" />
//                     <YAxis dataKey="lang" type="category" tick={{ fontSize: 11 }} stroke="hsl(215 20% 65%)" width={60} />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: "hsl(0 0% 100%)",
//                         border: "1px solid hsl(214 32% 91%)",
//                         borderRadius: "0.75rem",
//                         fontSize: 12,
//                       }}
//                     />
//                     <Bar dataKey="count" fill="hsl(217 91% 60%)" radius={[0, 6, 6, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Recent conversations table */}
//       <motion.div variants={itemVariants}>
//         <Card className="shadow-card border-border/50">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-base font-semibold flex items-center gap-2">
//               <MessageSquare className="w-4 h-4 text-royal" />
//               Recent Conversations
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="pt-0">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b border-border">
//                     <th className="text-left py-3 px-2 text-muted-foreground font-medium">User</th>
//                     <th className="text-left py-3 px-2 text-muted-foreground font-medium">Translation</th>
//                     <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden sm:table-cell">Sentiment</th>
//                     <th className="text-right py-3 px-2 text-muted-foreground font-medium">Time</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {recentConversations.map((conv, i) => (
//                     <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
//                       <td className="py-3 px-2 font-medium text-foreground">{conv.user}</td>
//                       <td className="py-3 px-2">
//                         <span className="px-2 py-1 rounded-md bg-royal/10 text-royal text-xs font-medium">{conv.lang}</span>
//                       </td>
//                       <td className="py-3 px-2 hidden sm:table-cell">
//                         <span className={`text-xs font-medium ${conv.sentiment === "Positive" ? "text-emerald-500" : "text-muted-foreground"}`}>
//                           {conv.sentiment}
//                         </span>
//                       </td>
//                       <td className="py-3 px-2 text-right text-muted-foreground">{conv.time}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default Dashboard;


import { motion } from "framer-motion";
import { Globe, Users, Activity, Clock, TrendingUp, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Dashboard = () => {
  // Stats
  const stats = [
    { label: "Total Users", value: "1,234", change: "+12%", icon: Users, color: "text-blue-500" },
    { label: "Active Sessions", value: "56", change: "+5%", icon: Activity, color: "text-green-500" },
    { label: "Languages Used", value: "8", change: "+2", icon: Globe, color: "text-purple-500" },
    { label: "Avg. Response Time", value: "450ms", change: "-10ms", icon: Clock, color: "text-yellow-500" },
  ];

  // Weekly Activity Chart Data
  const activityData = [
    { name: "Mon", requests: 4200, users: 850 },
    { name: "Tue", requests: 5100, users: 920 },
    { name: "Wed", requests: 4800, users: 880 },
    { name: "Thu", requests: 6300, users: 1100 },
    { name: "Fri", requests: 5900, users: 1050 },
    { name: "Sat", requests: 3200, users: 620 },
    { name: "Sun", requests: 2900, users: 550 },
  ];

  // Language Usage Chart Data
  const languageData = [
    { lang: "EN", count: 120 },
    { lang: "DE", count: 80 },
    { lang: "FR", count: 45 },
    { lang: "ES", count: 30 },
    { lang: "ZH", count: 25 },
    { lang: "JA", count: 15 },
  ];

  // Recent Conversations Table
  const recentConversations = [
    { user: "Alice", lang: "EN → DE", sentiment: "Positive", time: "2026-03-28 10:15 AM" },
    { user: "Bob", lang: "FR → EN", sentiment: "Neutral", time: "2026-03-28 09:50 AM" },
    { user: "Charlie", lang: "ES → EN", sentiment: "Positive", time: "2026-03-27 05:30 PM" },
    { user: "Dana", lang: "DE → EN", sentiment: "Negative", time: "2026-03-27 03:10 PM" },
    { user: "Eve", lang: "EN → FR", sentiment: "Neutral", time: "2026-03-27 01:45 PM" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome back, Admin
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with UniSpeak AI today.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-xs font-medium text-green-500 bg-green-100 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" /> Weekly Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Area type="monotone" dataKey="requests" stroke="#3b82f6" fill="url(#colorRequests)" strokeWidth={2} />
                    <Area type="monotone" dataKey="users" stroke="#10b981" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Languages Chart */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-500" /> Top Languages
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={languageData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis dataKey="lang" type="category" width={60} stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Conversations Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" /> Recent Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th>User</th>
                    <th>Translation</th>
                    <th className="hidden sm:table-cell">Sentiment</th>
                    <th className="text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentConversations.map((conv, i) => (
                    <tr key={i} className="hover:bg-gray-100 transition-colors">
                      <td>{conv.user}</td>
                      <td>
                        <span className="px-2 py-1 bg-blue-100 text-blue-500 rounded-md text-xs font-medium">
                          {conv.lang}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell">{conv.sentiment}</td>
                      <td className="text-right">{conv.time}</td>
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
