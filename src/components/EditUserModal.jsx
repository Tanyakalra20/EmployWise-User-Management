import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`https://reqres.in/api/users/${user.id}`, formData);
      if (response.status === 200) {
        onSave(user.id, formData); 
        toast.success("User updated successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-400 px-3 py-1 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
