import React from "react";

const AdminUserManagementPage = () => {
  // TODO: Integrate with backend user management API
  // For now, show a placeholder table and add user button
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="mb-4 flex justify-end">
        <button className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded">Add User</button>
      </div>
      <div className="bg-white dark:bg-navy-800 rounded-lg shadow p-4 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left py-2 px-4">Name</th>
              <th className="text-left py-2 px-4">Email</th>
              <th className="text-left py-2 px-4">Role</th>
              <th className="text-left py-2 px-4">Status</th>
              <th className="text-left py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Example users */}
            <tr>
              <td className="py-2 px-4">Jane Admin</td>
              <td className="py-2 px-4">jane@company.com</td>
              <td className="py-2 px-4">Super Admin</td>
              <td className="py-2 px-4">Active</td>
              <td className="py-2 px-4">
                <button className="text-blue-600 hover:underline mr-2">Edit</button>
                <button className="text-red-600 hover:underline">Disable</button>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">John User</td>
              <td className="py-2 px-4">john@company.com</td>
              <td className="py-2 px-4">Admin</td>
              <td className="py-2 px-4">Active</td>
              <td className="py-2 px-4">
                <button className="text-blue-600 hover:underline mr-2">Edit</button>
                <button className="text-red-600 hover:underline">Disable</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserManagementPage;
