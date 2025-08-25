import React from "react";
import { FaMapMarkerAlt, FaUserFriends, FaCrown, FaChartPie, FaChartBar } from "react-icons/fa";

const CustomerAnalyticsPage = () => {
  // Sample analytics data
  const insights = [
    { label: "Top Location", value: "Cape Town", icon: <FaMapMarkerAlt size={28} className="text-pink-500" />, gradient: "from-pink-400 to-pink-600" },
    { label: "Most Active Age Group", value: "25-34", icon: <FaUserFriends size={28} className="text-blue-500" />, gradient: "from-blue-400 to-blue-600" },
    { label: "Highest LTV Customer", value: "Kobus Pretorius", icon: <FaCrown size={28} className="text-yellow-500" />, gradient: "from-yellow-300 to-yellow-500" },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50 dark:from-navy-900 dark:to-navy-800">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight text-gray-900 dark:text-white drop-shadow-lg">Customer Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {insights.map((i) => (
          <div
            key={i.label}
            className={`relative rounded-2xl shadow-xl p-7 flex flex-col items-center overflow-hidden bg-white dark:bg-navy-800 group transition-transform hover:scale-[1.03]`}
            style={{ minHeight: 150 }}
          >
            <div className={`absolute inset-0 z-0 bg-gradient-to-br ${i.gradient} opacity-20 group-hover:opacity-30 transition-all`} />
            <div className="z-10 flex flex-col items-center">
              <div className="mb-2">{i.icon}</div>
              <div className="text-lg font-semibold mb-1 text-gray-800 dark:text-white tracking-wide">{i.label}</div>
              <div className="text-2xl font-extrabold mb-1 text-gray-900 dark:text-white drop-shadow">{i.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative bg-white dark:bg-navy-800 rounded-2xl shadow-xl p-7 flex flex-col items-center justify-center min-h-[220px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-indigo-300 dark:from-navy-700 dark:to-navy-900 opacity-10 pointer-events-none" />
          <h2 className="text-xl font-bold mb-5 text-gray-800 dark:text-white flex items-center gap-2"><FaChartPie className="text-indigo-500" /> Customer Demographics</h2>
          <div className="w-full h-32 flex items-center justify-center text-gray-400 dark:text-gray-500 z-10">[Demographics Chart Placeholder]</div>
        </div>
        <div className="relative bg-white dark:bg-navy-800 rounded-2xl shadow-xl p-7 flex flex-col items-center justify-center min-h-[220px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-yellow-300 dark:from-yellow-900 dark:to-navy-900 opacity-10 pointer-events-none" />
          <h2 className="text-xl font-bold mb-5 text-gray-800 dark:text-white flex items-center gap-2"><FaChartBar className="text-yellow-500" /> Order Frequency</h2>
          <div className="w-full h-32 flex items-center justify-center text-gray-400 dark:text-gray-500 z-10">[Order Frequency Chart Placeholder]</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalyticsPage;
