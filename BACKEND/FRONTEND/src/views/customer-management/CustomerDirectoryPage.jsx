import React from "react";


import { useState } from "react";


const mockCustomers = [
  {
    id: 777,
    name: "Kobus Pretorius",
    email: "kpretorius49@gmail.com",
    status: "Active",
    type: "Individual",
    industry: "Music Entertainment",
    joined: "2023-11-15",
  },
  {
    id: 1294,
    name: "Byron Paizes",
    email: "paizesb@gmail.com",
    status: "Inactive",
    type: "Business",
    industry: "Estate",
    joined: "2024-02-13",
  },
  {
    id: 6671,
    name: "Jayden Holtzhauzen",
    email: "jaydenholtz1601@gmail.com",
    status: "Active",
    type: "Individual",
    industry: "Retail",
    joined: "2025-03-31",
  },
  {
    id: 23,
    name: "Eric Motlhanke",
    email: "jpjakoba@gmail.com",
    status: "Active",
    type: "Individual",
    industry: "N/A",
    joined: "2023-05-29",
  },
  {
    id: 2083,
    name: "RM Tsheole",
    email: "dollamase@gmail.com",
    status: "Active",
    type: "Individual",
    industry: "",
    joined: "2024-09-24",
  },
  {
    id: 6695,
    name: "Joseph Sitoe",
    email: "jsjoezar1@gmail.com",
    status: "Active",
    type: "Business",
    industry: "Trading",
    joined: "2025-04-09",
  },
  {
    id: 564,
    name: "Dumisane Mandla Hlatshwayo",
    email: "dmhlatshwayo@gmail.com",
    status: "Active",
    type: "Business",
    industry: "Security Services",
    joined: "2023-09-15",
  },
  {
    id: 2101,
    name: "Lerato Tsimane",
    email: "cl.tsimane@gmail.com",
    status: "Active",
    type: "Individual",
    industry: "",
    joined: "2024-09-30",
  },
  {
    id: 6481,
    name: "Matome Tshepo Lucas Matlala",
    email: "mtlmatlala@yahoo.com",
    status: "Active",
    type: "Individual",
    industry: "",
    joined: "2025-02-08",
  },
  {
    id: 2397,
    name: "Pieter Van Schalkwyk",
    email: "Pieter@juba.co.za",
    status: "Active",
    type: "Business",
    industry: "Productions",
    joined: "2024-11-22",
  },
  {
    id: 5479,
    name: "Gordon Chandergupth",
    email: "gordonchan08@gmail.com",
    status: "Active",
    type: "Business",
    industry: "Incorporated",
    joined: "2024-12-13",
  },
  {
    id: 2166,
    name: "Christian Simon",
    email: "cheylennq2002@gmail.com",
    status: "Active",
    type: "Individual",
    industry: "",
    joined: "2024-10-22",
  },
  {
    id: 1923,
    name: "Christine Walker",
    email: "ianwalker@aerosat.co.za",
    status: "Active",
    type: "Individual",
    industry: "N/A",
    joined: "2024-08-09",
  },
  {
    id: 2201,
    name: "Adebisi Thompson",
    email: "bisithompson@yahoo.com",
    status: "Active",
    type: "Individual",
    industry: "",
    joined: "2024-11-03",
  },
  {
    id: 2228,
    name: "Ryan Powell",
    email: "ryan.r.powell@gmail.com",
    status: "Active",
    type: "Individual",
    industry: "",
    joined: "2024-11-11",
  },
  {
    id: 1974,
    name: "Moses Patson Shongwe",
    email: "mosespatson@gmail.com",
    status: "Active",
    type: "Business",
    industry: "",
    joined: "2024-08-25",
  },
  {
    id: 6584,
    name: "Nehan Ungerer",
    email: "nehan@omaramba.co.za",
    status: "Active",
    type: "Business",
    industry: "Holiday Resort",
    joined: "2025-02-20",
  },
  {
    id: 1476,
    name: "James Calderhead",
    email: "daehredlacgj@gmail.com",
    status: "Active",
    type: "Individual",
    industry: "Private",
    joined: "2024-03-26",
  },
  {
    id: 6604,
    name: "Justice Chauke",
    email: "justchauke@gmail.com",
    status: "Active",
    type: "Business",
    industry: "District Municipality",
    joined: "2025-02-25",
  },
  {
    id: 494,
    name: "Zikho Mbelwa",
    email: "zikho.mbelwa@fnb.co.za",
    status: "Active",
    type: "Individual",
    industry: "",
    joined: "2023-08-23",
  },
];


// Enhance mockCustomers with detailed fields for the modal (for demo)
const detailedCustomers = mockCustomers.map((c, i) => ({
  ...c,
  avatar_url: c.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name || "Customer")}`,
  account_number: `ACC${1000 + i}`,
  loyalty_points: i * 10 + 50,
  billing_name: c.name,
  billing_company: c.industry || "",
  billing_address: `123 Billing St, City ${i}`,
  billing_city: `City ${i}`,
  billing_postcode: `100${i}`,
  billing_country: "ZA",
  billing_phone: `0800-000-${i.toString().padStart(3, "0")}`,
  shipping_name: c.name,
  shipping_company: c.industry || "",
  shipping_address: `456 Shipping Ave, City ${i}`,
  shipping_city: `City ${i}`,
  shipping_postcode: `200${i}`,
  shipping_country: "ZA",
  shipping_phone: `0800-111-${i.toString().padStart(3, "0")}`,
  order_history: [
    { id: `ORD${i}A`, date: `2025-0${(i%9)+1}-15`, total: 100 + i * 5, status: "Completed" },
    { id: `ORD${i}B`, date: `2025-0${(i%9)+1}-20`, total: 50 + i * 3, status: "Pending" },
  ],
  meta_data: [
    { key: "Newsletter", value: i % 2 === 0 ? "Subscribed" : "Unsubscribed" },
    { key: "VIP", value: i % 5 === 0 ? "Yes" : "No" },
  ],
}));

const CustomerDirectoryPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = detailedCustomers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || c.status === status;
    const matchesType = type === "all" || c.type === type;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Directory</h1>
      <div className="flex gap-4 mb-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="Search by name or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          className="border rounded px-3 py-2"
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="Individual">Individual</option>
          <option value="Business">Business</option>
        </select>
      </div>
      <div className="bg-white dark:bg-navy-800 rounded-lg shadow p-4 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left py-2 px-4">Name</th>
              <th className="text-left py-2 px-4">Email</th>
              <th className="text-left py-2 px-4">Status</th>
              <th className="text-left py-2 px-4">Type</th>
              <th className="text-left py-2 px-4">Industry</th>
              <th className="text-left py-2 px-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">
                  No customers found.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-t cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-700"
                  onClick={() => setSelectedCustomer(c)}
                >
                  <td className="py-2 px-4">{c.name}</td>
                  <td className="py-2 px-4">{c.email}</td>
                  <td className="py-2 px-4">{c.status}</td>
                  <td className="py-2 px-4">{c.type}</td>
                  <td className="py-2 px-4">{c.industry}</td>
                  <td className="py-2 px-4">{c.joined}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Profile Modal */}
  {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl p-0 w-full max-w-3xl relative overflow-y-auto max-h-[95vh] border border-gray-200 dark:border-navy-700">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl"
              onClick={() => setSelectedCustomer(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col md:flex-row gap-8 p-8 pb-4 border-b border-gray-100 dark:border-navy-700">
              <div className="flex flex-col items-center md:items-start min-w-[180px]">
                <img src={selectedCustomer.avatar_url} alt="avatar" className="w-24 h-24 rounded-full border mb-2 shadow" />
                <h2 className="text-2xl font-bold mb-1 text-center md:text-left">{selectedCustomer.name}</h2>
                <div className="text-gray-500 text-center md:text-left">{selectedCustomer.email}</div>
                <div className="text-xs text-gray-400 text-center md:text-left">Customer ID: {selectedCustomer.id}</div>
                <div className="mt-4 flex flex-col gap-1 w-full">
                  <span className="inline-block bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded px-2 py-1 text-xs font-semibold w-fit">{selectedCustomer.status}</span>
                  <span className="inline-block bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded px-2 py-1 text-xs font-semibold w-fit">{selectedCustomer.type}</span>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-navy-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-navy-800">
                  <h3 className="font-semibold mb-2 text-brand-600 dark:text-brand-300">Account Info</h3>
                  <div className="mb-1"><b>Industry:</b> {selectedCustomer.industry}</div>
                  <div className="mb-1"><b>Joined:</b> {selectedCustomer.joined}</div>
                  <div className="mb-1"><b>Account #:</b> {selectedCustomer.account_number}</div>
                  <div className="mb-1"><b>Loyalty Points:</b> {selectedCustomer.loyalty_points} <span className="text-gray-400">(coming soon)</span></div>
                </div>
                <div className="bg-gray-50 dark:bg-navy-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-navy-800">
                  <h3 className="font-semibold mb-2 text-brand-600 dark:text-brand-300">Contact</h3>
                  <div className="mb-1"><b>Email:</b> {selectedCustomer.email}</div>
                  <div className="mb-1"><b>Phone:</b> {selectedCustomer.billing_phone}</div>
                </div>
                <div className="bg-gray-50 dark:bg-navy-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-navy-800">
                  <h3 className="font-semibold mb-2 text-brand-600 dark:text-brand-300">Billing Info</h3>
                  <div className="mb-1"><b>Name:</b> {selectedCustomer.billing_name}</div>
                  <div className="mb-1"><b>Company:</b> {selectedCustomer.billing_company}</div>
                  <div className="mb-1"><b>Address:</b> {selectedCustomer.billing_address}</div>
                  <div className="mb-1"><b>City:</b> {selectedCustomer.billing_city}</div>
                  <div className="mb-1"><b>Postcode:</b> {selectedCustomer.billing_postcode}</div>
                  <div className="mb-1"><b>Country:</b> {selectedCustomer.billing_country}</div>
                  <div className="mb-1"><b>Phone:</b> {selectedCustomer.billing_phone}</div>
                </div>
                <div className="bg-gray-50 dark:bg-navy-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-navy-800">
                  <h3 className="font-semibold mb-2 text-brand-600 dark:text-brand-300">Shipping Info</h3>
                  <div className="mb-1"><b>Name:</b> {selectedCustomer.shipping_name}</div>
                  <div className="mb-1"><b>Company:</b> {selectedCustomer.shipping_company}</div>
                  <div className="mb-1"><b>Address:</b> {selectedCustomer.shipping_address}</div>
                  <div className="mb-1"><b>City:</b> {selectedCustomer.shipping_city}</div>
                  <div className="mb-1"><b>Postcode:</b> {selectedCustomer.shipping_postcode}</div>
                  <div className="mb-1"><b>Country:</b> {selectedCustomer.shipping_country}</div>
                  <div className="mb-1"><b>Phone:</b> {selectedCustomer.shipping_phone}</div>
                </div>
              </div>
            </div>
            <div className="p-8 pt-4">
              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-brand-600 dark:text-brand-300">Order History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm mb-2 border rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 dark:bg-navy-900">
                      <tr>
                        <th className="text-left px-2 py-1">Order #</th>
                        <th className="text-left px-2 py-1">Date</th>
                        <th className="text-left px-2 py-1">Total</th>
                        <th className="text-left px-2 py-1">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCustomer.order_history?.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-blue-50 dark:hover:bg-navy-800 cursor-pointer"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="px-2 py-1 text-blue-700 underline">{order.id}</td>
                          <td className="px-2 py-1">{order.date}</td>
                          <td className="px-2 py-1">R{order.total}</td>
                          <td className="px-2 py-1">{order.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative overflow-y-auto max-h-[90vh] border border-gray-200 dark:border-navy-700">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl"
              onClick={() => setSelectedOrder(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className="mb-2"><b>Order #:</b> {selectedOrder.id}</div>
            <div className="mb-2"><b>Date:</b> {selectedOrder.date}</div>
            <div className="mb-2"><b>Total:</b> R{selectedOrder.total}</div>
            <div className="mb-2"><b>Status:</b> {selectedOrder.status}</div>
            {/* Add more detailed order info here as needed */}
            <div className="mt-4 text-gray-400">Order line items, shipping, payment, and more will be shown here (mocked for now).</div>
          </div>
        </div>
      )}
              <div className="mb-2">
                <h3 className="font-semibold mb-2 text-brand-600 dark:text-brand-300">Meta Data</h3>
                <ul className="text-sm grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  {selectedCustomer.meta_data?.map((meta, idx) => (
                    <li key={idx} className="mb-1"><b>{meta.key}:</b> {meta.value}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDirectoryPage;
