import React from "react";
import { FaUsers, FaUserCheck, FaUserPlus, FaChartLine } from "react-icons/fa";

const CustomerDashboard = () => {
  // Sample data for demo
  const metrics = [
    { label: "Total Customers", value: 1200, icon: <FaUsers size={32} />, gradient: "from-blue-400 to-blue-600" },
    { label: "Active Customers", value: 980, icon: <FaUserCheck size={32} />, gradient: "from-green-400 to-green-600" },
    { label: "New This Month", value: 45, icon: <FaUserPlus size={32} />, gradient: "from-purple-400 to-purple-600" },
  ];
  const activity = [
    { user: "Kobus Pretorius", action: "Placed an order", time: "2 hours ago" },
    { user: "Byron Paizes", action: "Updated profile", time: "5 hours ago" },
    { user: "Jayden Holtzhauzen", action: "Registered", time: "1 day ago" },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 dark:from-navy-900 dark:to-navy-800">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight text-gray-900 dark:text-white drop-shadow-lg">Customer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`relative rounded-2xl shadow-xl p-7 flex flex-col items-center overflow-hidden bg-white dark:bg-navy-800 group transition-transform hover:scale-[1.03]`}
            style={{ minHeight: 170 }}
          >
            <div className={`absolute inset-0 z-0 bg-gradient-to-br ${m.gradient} opacity-20 group-hover:opacity-30 transition-all`} />
            <div className="z-10 flex flex-col items-center">
              <div className="mb-2 text-4xl text-blue-700 dark:text-blue-300 drop-shadow-lg">{m.icon}</div>
              <div className="text-lg font-semibold mb-1 text-gray-800 dark:text-white tracking-wide">{m.label}</div>
              <div className="text-5xl font-extrabold mb-1 text-gray-900 dark:text-white drop-shadow">{m.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative bg-white dark:bg-navy-800 rounded-2xl shadow-xl p-7 overflow-hidden flex flex-col min-h-[220px]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-300 dark:from-navy-700 dark:to-navy-900 opacity-10 pointer-events-none" />
          <h2 className="text-xl font-bold mb-5 text-gray-800 dark:text-white flex items-center gap-2"><FaChartLine className="text-blue-500" /> Recent Activity</h2>
          <ul className="divide-y divide-gray-100 dark:divide-navy-700 z-10">
            {activity.map((a, i) => (
              <li key={i} className="py-3 flex justify-between items-center">
                <span className="font-medium text-gray-700 dark:text-white"><b>{a.user}</b> <span className="text-gray-500 dark:text-gray-300 font-normal">{a.action}</span></span>
                <span className="text-xs text-gray-400 dark:text-gray-400">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative bg-white dark:bg-navy-800 rounded-2xl shadow-xl p-7 flex flex-col items-center justify-center min-h-[220px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-300 dark:from-purple-900 dark:to-navy-900 opacity-10 pointer-events-none" />
          <h2 className="text-xl font-bold mb-5 text-gray-800 dark:text-white flex items-center gap-2"><FaChartLine className="text-purple-500" /> Customer Growth</h2>
          <div className="w-full h-24 flex items-center justify-center text-gray-400 dark:text-gray-500 z-10">[Chart Placeholder]</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
