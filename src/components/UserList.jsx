import React, { useState, useEffect } from "react";
import axios from "axios";
import EditUserModal from "./EditUserModal"; // Ensure correct import
import { toast } from "react-toastify"; // Import toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://reqres.in/api";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false); // Track if no results are found

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page) => {
    try {
      const response = await axios.get(`${BASE_URL}/users?page=${page}`);
      setUsers(response.data.data);
      setFilteredUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users. Please try again.");
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter(user =>
      user.first_name.toLowerCase().includes(query) ||
      user.last_name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );

    setFilteredUsers(filtered);
    setNoResults(filtered.length === 0); // If no results, show the "No user found" message
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/"); // Redirect to login page
  };

  const handleDelete = async (id) => {
    try {
      // Perform delete via API
      await axios.delete(`${BASE_URL}/users/${id}`);

      // Update state to remove the user
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

      // Success toast
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  const handleSave = async (id, updatedData) => {
    try {
      // First, update the user via the API
      await axios.put(`${BASE_URL}/users/${id}`, updatedData);

      // Now update the local state
      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, ...updatedData } : user
      );

      // Update state
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

      // Success toast
      toast.success("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center my-4">Users List</h2>
      
      {/* Search Input */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          className="p-2 border rounded w-1/2"
          placeholder="Search users by name or email"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* No Results Message */}
      {noResults && (
        <p className="text-center text-red-500 font-semibold">No user found</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="p-4 border rounded shadow">
            <img
              src={user.avatar}
              alt={user.first_name}
              className="w-16 h-16 rounded-full mx-auto"
            />
            <h3 className="text-lg font-semibold text-center">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-center">{user.email}</p>
            <div className="flex justify-center space-x-2 mt-2">
              <button
                onClick={() => handleEdit(user)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded mr-2 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() =>
            setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
          }
          disabled={currentPage >= totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="bg-black text-white px-4 py-2 rounded tran ml-[1300px] mt-20"
      >
        Logout
      </button>

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default UserList;



