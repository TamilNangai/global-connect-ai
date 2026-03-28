// import { motion } from "framer-motion";
// import {
//   Globe, TrendingUp, Users, Zap,
//   Brain, BarChart3, PieChart as PieChartIcon, ArrowUpRight,
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
//   ResponsiveContainer, PieChart, Pie, Cell,
//   LineChart, Line, BarChart, Bar, Legend,
// } from "recharts";

// const monthlyData = [
//   { month: "Jan", users: 3200, translations: 18000, accuracy: 97.1 },
//   { month: "Feb", users: 4100, translations: 24000, accuracy: 97.8 },
//   { month: "Mar", users: 5200, translations: 31000, accuracy: 98.2 },
//   { month: "Apr", users: 6800, translations: 42000, accuracy: 98.5 },
//   { month: "May", users: 8400, translations: 56000, accuracy: 98.9 },
//   { month: "Jun", users: 10200, translations: 72000, accuracy: 99.1 },
//   { month: "Jul", users: 12847, translations: 89000, accuracy: 99.2 },
// ];

// const sentimentData = [
//   { name: "Positive", value: 62, color: "hsl(152 69% 45%)" },
//   { name: "Neutral", value: 28, color: "hsl(217 91% 60%)" },
//   { name: "Negative", value: 10, color: "hsl(0 84% 60%)" },
// ];

// const regionData = [
//   { region: "North America", users: 3800 },
//   { region: "Europe", users: 3200 },
//   { region: "Asia", users: 2900 },
//   { region: "South America", users: 1500 },
//   { region: "Africa", users: 900 },
//   { region: "Oceania", users: 547 },
// ];

// const hourlyTraffic = Array.from({ length: 24 }, (_, i) => ({
//   hour: `${i}:00`,
//   requests: Math.floor(Math.random() * 3000 + (i >= 8 && i <= 20 ? 4000 : 500)),
// }));

// const performanceMetrics = [
//   { label: "API Uptime", value: "99.97%", icon: Zap },
//   { label: "Avg Latency", value: "87ms", icon: TrendingUp },
//   { label: "Model Accuracy", value: "99.2%", icon: Brain },
//   { label: "Peak QPS", value: "4,280", icon: BarChart3 },
// ];

// const containerVariants = {
//   hidden: {},
//   visible: { transition: { staggerChildren: 0.06 } },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
// };

// const Analytics = () => {
//   return (
//     <motion.div
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className="space-y-6"
//     >
//       {/* Header */}
//       <motion.div variants={itemVariants}>
//         <h1 className="text-2xl md:text-3xl font-bold text-foreground">Analytics</h1>
//         <p className="text-muted-foreground mt-1">Deep dive into UniSpeak AI performance and usage metrics.</p>
//       </motion.div>

//       {/* Performance metrics */}
//       <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {performanceMetrics.map((m) => (
//           <Card key={m.label} className="bg-card-gradient shadow-card border-border/50">
//             <CardContent className="p-4 flex items-center gap-3">
//               <div className="w-10 h-10 rounded-xl bg-royal/10 flex items-center justify-center shrink-0">
//                 <m.icon className="w-5 h-5 text-royal" />
//               </div>
//               <div className="min-w-0">
//                 <div className="text-lg md:text-xl font-bold text-foreground truncate">{m.value}</div>
//                 <div className="text-xs text-muted-foreground truncate">{m.label}</div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </motion.div>

//       {/* Growth chart */}
//       <motion.div variants={itemVariants}>
//         <Card className="shadow-card border-border/50">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-base font-semibold flex items-center gap-2">
//               <TrendingUp className="w-4 h-4 text-royal" />
//               Growth Over Time
//               <span className="ml-auto text-xs text-emerald-500 flex items-center gap-1">
//                 <ArrowUpRight className="w-3 h-3" /> +301% users
//               </span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="pt-0">
//             <div className="h-72">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={monthlyData}>
//                   <defs>
//                     <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
//                       <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
//                     </linearGradient>
//                     <linearGradient id="colorTrans" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.2} />
//                       <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" strokeOpacity={0.5} />
//                   <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215 20% 65%)" />
//                   <YAxis tick={{ fontSize: 12 }} stroke="hsl(215 20% 65%)" />
//                   <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(214 32% 91%)", borderRadius: "0.75rem", fontSize: 12 }} />
//                   <Legend />
//                   <Area type="monotone" dataKey="users" stroke="hsl(217 91% 60%)" fill="url(#colorUsers)" strokeWidth={2} name="Users" />
//                   <Area type="monotone" dataKey="translations" stroke="hsl(199 89% 48%)" fill="url(#colorTrans)" strokeWidth={2} name="Translations" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Middle row — Sentiment + Regions */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Sentiment */}
//         <motion.div variants={itemVariants}>
//           <Card className="shadow-card border-border/50 h-full">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-base font-semibold flex items-center gap-2">
//                 <PieChartIcon className="w-4 h-4 text-azure" />
//                 Sentiment Distribution
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="pt-0">
//               <div className="h-64 flex items-center justify-center">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={sentimentData}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={60}
//                       outerRadius={90}
//                       dataKey="value"
//                       strokeWidth={2}
//                       stroke="hsl(0 0% 100%)"
//                     >
//                       {sentimentData.map((entry, i) => (
//                         <Cell key={i} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(214 32% 91%)", borderRadius: "0.75rem", fontSize: 12 }} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//               <div className="flex justify-center gap-6 mt-2">
//                 {sentimentData.map((s) => (
//                   <div key={s.name} className="flex items-center gap-2 text-xs">
//                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
//                     <span className="text-muted-foreground">{s.name} ({s.value}%)</span>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Regions */}
//         <motion.div variants={itemVariants}>
//           <Card className="shadow-card border-border/50 h-full">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-base font-semibold flex items-center gap-2">
//                 <Globe className="w-4 h-4 text-royal" />
//                 Users by Region
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="pt-0">
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={regionData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" strokeOpacity={0.5} />
//                     <XAxis dataKey="region" tick={{ fontSize: 10 }} stroke="hsl(215 20% 65%)" angle={-20} textAnchor="end" height={50} />
//                     <YAxis tick={{ fontSize: 11 }} stroke="hsl(215 20% 65%)" />
//                     <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(214 32% 91%)", borderRadius: "0.75rem", fontSize: 12 }} />
//                     <Bar dataKey="users" fill="hsl(199 89% 48%)" radius={[6, 6, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Traffic + Accuracy */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <motion.div variants={itemVariants}>
//           <Card className="shadow-card border-border/50">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-base font-semibold flex items-center gap-2">
//                 <Zap className="w-4 h-4 text-azure" />
//                 24h Traffic Pattern
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="pt-0">
//               <div className="h-56">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart data={hourlyTraffic}>
//                     <defs>
//                       <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
//                         <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" strokeOpacity={0.5} />
//                     <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="hsl(215 20% 65%)" interval={3} />
//                     <YAxis tick={{ fontSize: 11 }} stroke="hsl(215 20% 65%)" />
//                     <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(214 32% 91%)", borderRadius: "0.75rem", fontSize: 12 }} />
//                     <Area type="monotone" dataKey="requests" stroke="hsl(199 89% 48%)" fill="url(#colorTraffic)" strokeWidth={2} />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         <motion.div variants={itemVariants}>
//           <Card className="shadow-card border-border/50">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-base font-semibold flex items-center gap-2">
//                 <Brain className="w-4 h-4 text-royal" />
//                 Accuracy Trend
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="pt-0">
//               <div className="h-56">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={monthlyData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" strokeOpacity={0.5} />
//                     <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215 20% 65%)" />
//                     <YAxis domain={[96, 100]} tick={{ fontSize: 11 }} stroke="hsl(215 20% 65%)" />
//                     <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(214 32% 91%)", borderRadius: "0.75rem", fontSize: 12 }} />
//                     <Line type="monotone" dataKey="accuracy" stroke="hsl(152 69% 45%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(152 69% 45%)" }} name="Accuracy %" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default Analytics;




import { motion } from "framer-motion";
import { Globe, TrendingUp, Users, Zap, Brain, BarChart3, PieChart as PieChartIcon, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, Legend } from "recharts";

// Dummy data
const monthlyData = [
  { month: "Jan", users: 3200, translations: 18000, accuracy: 97.1 },
  { month: "Feb", users: 4100, translations: 24000, accuracy: 97.8 },
  { month: "Mar", users: 5200, translations: 31000, accuracy: 98.2 },
  { month: "Apr", users: 6800, translations: 42000, accuracy: 98.5 },
  { month: "May", users: 8400, translations: 56000, accuracy: 98.9 },
  { month: "Jun", users: 10200, translations: 72000, accuracy: 99.1 },
  { month: "Jul", users: 12847, translations: 89000, accuracy: 99.2 },
];

const sentimentData = [
  { name: "Positive", value: 62, color: "hsl(152 69% 45%)" },
  { name: "Neutral", value: 28, color: "hsl(217 91% 60%)" },
  { name: "Negative", value: 10, color: "hsl(0 84% 60%)" },
];

const regionData = [
  { region: "North America", users: 3800 },
  { region: "Europe", users: 3200 },
  { region: "Asia", users: 2900 },
  { region: "South America", users: 1500 },
  { region: "Africa", users: 900 },
  { region: "Oceania", users: 547 },
];

const hourlyTraffic = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  requests: Math.floor(Math.random() * 3000 + (i >= 8 && i <= 20 ? 4000 : 500)),
}));

const performanceMetrics = [
  { label: "API Uptime", value: "99.97%", icon: Zap },
  { label: "Avg Latency", value: "87ms", icon: TrendingUp },
  { label: "Model Accuracy", value: "99.2%", icon: Brain },
  { label: "Peak QPS", value: "4,280", icon: BarChart3 },
];

// Animation variants
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Analytics = () => {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 p-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into UniSpeak AI performance and usage metrics.</p>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((m) => (
          <Card key={m.label} className="bg-card-gradient shadow-card border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-royal/10 flex items-center justify-center shrink-0">
                <m.icon className="w-5 h-5 text-royal" />
              </div>
              <div className="min-w-0">
                <div className="text-lg md:text-xl font-bold text-foreground truncate">{m.value}</div>
                <div className="text-xs text-muted-foreground truncate">{m.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Growth Over Time */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-royal" />
              Growth Over Time
              <span className="ml-auto text-xs text-emerald-500 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +301% users
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorTrans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" strokeOpacity={0.5} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215 20% 65%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(215 20% 65%)" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(214 32% 91%)", borderRadius: "0.75rem", fontSize: 12 }} />
                  <Legend />
                  <Area type="monotone" dataKey="users" stroke="hsl(217 91% 60%)" fill="url(#colorUsers)" strokeWidth={2} name="Users" />
                  <Area type="monotone" dataKey="translations" stroke="hsl(199 89% 48%)" fill="url(#colorTrans)" strokeWidth={2} name="Translations" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sentiment + Regions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card border-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-azure" />
                Sentiment Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" strokeWidth={2} stroke="hsl(0 0% 100%)">
                      {sentimentData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(214 32% 91%)", borderRadius: "0.75rem", fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Regions */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card border-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4 text-royal" />
                Users by Region
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" strokeOpacity={0.5} />
                    <XAxis dataKey="region" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(214 32% 91%)", borderRadius: "0.75rem", fontSize: 12 }} />
                    <Bar dataKey="users" fill="hsl(199 89% 48%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Traffic + Accuracy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-azure" />
                24h Traffic Pattern
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyTraffic}>
                    <defs>
                      <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" strokeOpacity={0.5} />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={3} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(214 32% 91%)", borderRadius: "0.75rem", fontSize: 12 }} />
                    <Area type="monotone" dataKey="requests" stroke="hsl(199 89% 48%)" fill="url(#colorTraffic)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Accuracy */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Brain className="w-4 h-4 text-royal" />
                Accuracy Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" strokeOpacity={0.5} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis domain={[96, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(214 32% 91%)", borderRadius: "0.75rem", fontSize: 12 }} />
                    <Line type="monotone" dataKey="accuracy" stroke="hsl(152 69% 45%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(152 69% 45%)" }} name="Accuracy %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;
