import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import UserUpdatePopup from "../components/UserUpdatePopup";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

function DisplayAllUsers() {
  const [users, setUsers] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [updateUserData, setUpdateUserData] = useState({
    name: "",
    email: "",
    id: "",
  });

  // Pagination settings
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/proxy/get-all-users");
      const data = await response.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const handlePopup = (name, email, id) => {
    setIsPopupOpen(!isPopupOpen);
    setUpdateUserData({ name, email, id });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`/proxy/delete-user/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (data.msg) {
          toast.success(data.msg);
          fetchUsers();
        }
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <>
      <NavBar />
      <div className="flex">
        <SideBar />
        <div className="flex-1 p-8 bg-gray-50">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() =>
                              handlePopup(user.name, user.email, user._id)
                            }
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <FaEdit className="inline-block mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash className="inline-block mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full ${
                    currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white`}
                >
                  <FaChevronLeft />
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white`}
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <UserUpdatePopup
          close={() => setIsPopupOpen(false)}
          updateUserData={updateUserData}
          setUpdateUserData={setUpdateUserData}
          refreshUsers={fetchUsers}
        />
      )}
    </>
  );
}

export default DisplayAllUsers;
