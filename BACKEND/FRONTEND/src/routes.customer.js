import React from "react";
import { MdPeople, MdBarChart, MdSettings } from "react-icons/md";
import CustomerDashboard from "views/customer-management/CustomerDashboard";
import CustomerDirectoryPage from "views/customer-management/CustomerDirectoryPage";
import CustomerAnalyticsPage from "views/customer-management/CustomerAnalyticsPage";

const customerRoutes = [
  {
    name: "Customer Dashboard",
    layout: "/admin",
    path: "customer-dashboard",
    icon: <MdBarChart className="h-6 w-6" />,
    component: <CustomerDashboard />,
  },
  {
    name: "Customer Directory",
    layout: "/admin",
    path: "customer-directory",
    icon: <MdPeople className="h-6 w-6" />,
    component: <CustomerDirectoryPage />,
  },
  {
    name: "Customer Analytics",
    layout: "/admin",
    path: "customer-analytics",
    icon: <MdBarChart className="h-6 w-6" />,
    component: <CustomerAnalyticsPage />,
  },
];

export default customerRoutes;
