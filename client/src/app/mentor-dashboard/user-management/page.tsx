"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Mail,
  Shield,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";

/* ──────────────────────── Types ──────────────────────── */

interface User {
  _id: string;
  name: string;
  email: string;
  userType: "student" | "professional" | "admin";
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UsersResponse {
  success: boolean;
  users: User[];
  pagination: PaginationData;
}

/* ──────────────────────── Component ──────────────────────── */

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [selectedUserType, setSelectedUserType] = useState<string>("");

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);

      const params = {
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: search,
        ...(selectedUserType && { userType: selectedUserType }),
      };

      const response = await authAPI.getAllUsers(params);

      if (response.data.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, search, selectedUserType]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to first page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedUserType]);

  // Update user status
  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      setIsUpdating(true);

      const response = await authAPI.updateUserStatus(userId, !currentStatus);

      if (response.data.success) {
        toast.success(
          `User marked as ${!currentStatus ? "active" : "inactive"}`,
        );
        // Update local state
        setUsers(
          users.map((u) =>
            u._id === userId ? { ...u, isActive: !currentStatus } : u,
          ),
        );
      }
    } catch (error: any) {
      console.error("Error updating user status:", error);
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get user type color
  const getUserTypeBadgeColor = (userType: string) => {
    switch (userType) {
      case "admin":
        return "bg-red-900/30 text-red-300 border border-red-700/50";
      case "professional":
        return "bg-blue-900/30 text-blue-300 border border-blue-700/50";
      default:
        return "bg-purple-900/30 text-purple-300 border border-purple-700/50";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-gray-400">
            Manage all registered users, search, and control their access
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
              />
            </div>

            {/* Filter by User Type */}
            <select
              value={selectedUserType}
              onChange={(e) => setSelectedUserType(e.target.value)}
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            >
              <option value="">All User Types</option>
              <option value="student">Students</option>
              <option value="professional">Professionals</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-400">
            Showing{" "}
            {users.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * itemsPerPage, pagination.total)} of{" "}
            {pagination.total} users
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-400" size={32} />
          </div>
        )}

        {/* Users Table */}
        {!isLoading && users.length > 0 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-800/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      User Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-zinc-800 hover:bg-zinc-800/30 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Mail size={16} />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getUserTypeBadgeColor(
                            user.userType,
                          )}`}
                        >
                          {user.userType.charAt(0).toUpperCase() +
                            user.userType.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {user.isActive ? (
                            <CheckCircle size={18} className="text-green-400" />
                          ) : (
                            <XCircle size={18} className="text-red-400" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              user.isActive ? "text-green-300" : "text-red-300"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            handleStatusToggle(user._id, user.isActive)
                          }
                          disabled={isUpdating}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            user.isActive
                              ? "bg-red-900/30 text-red-300 hover:bg-red-900/50"
                              : "bg-green-900/30 text-green-300 hover:bg-green-900/50"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isUpdating ? (
                            <Loader2
                              size={16}
                              className="animate-spin inline"
                            />
                          ) : user.isActive ? (
                            "Deactivate"
                          ) : (
                            "Activate"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700"
                >
                  <div className="mb-3">
                    <h3 className="font-semibold text-white text-lg">
                      {user.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                      <Mail size={14} />
                      {user.email}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">User Type</p>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold inline-block ${getUserTypeBadgeColor(
                          user.userType,
                        )}`}
                      >
                        {user.userType.charAt(0).toUpperCase() +
                          user.userType.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <div className="flex items-center gap-1">
                        {user.isActive ? (
                          <CheckCircle size={16} className="text-green-400" />
                        ) : (
                          <XCircle size={16} className="text-red-400" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            user.isActive ? "text-green-300" : "text-red-300"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 text-xs text-gray-400">
                    Joined: {formatDate(user.createdAt)}
                  </div>

                  <button
                    onClick={() => handleStatusToggle(user._id, user.isActive)}
                    disabled={isUpdating}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition ${
                      user.isActive
                        ? "bg-red-900/30 text-red-300 hover:bg-red-900/50"
                        : "bg-green-900/30 text-green-300 hover:bg-green-900/50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isUpdating ? (
                      <Loader2 size={14} className="animate-spin inline" />
                    ) : user.isActive ? (
                      "Deactivate"
                    ) : (
                      "Activate"
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && users.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No users found
            </h3>
            <p className="text-gray-400">
              {search || selectedUserType
                ? "Try adjusting your search or filters"
                : "No users have been registered yet"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && users.length > 0 && pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </div>

            <div className="flex items-center gap-4">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || isLoading}
                  className="p-2 rounded-lg border border-zinc-700 hover:border-blue-500 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= pagination.totalPages || isLoading}
                  className="p-2 rounded-lg border border-zinc-700 hover:border-blue-500 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
