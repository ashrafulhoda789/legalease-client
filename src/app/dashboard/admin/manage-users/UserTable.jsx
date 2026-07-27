"use client";

import { deleteUser, updateUserRole } from "@/lib/action/users";
import React, { useState } from "react";

export default function UserTable({ initialUsers = [] }) {
    const [users, setUsers] = useState(initialUsers);
    const [loadingId, setLoadingId] = useState(null);

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null); // { id, name }

    // 1. Handle Role Change
    const handleRoleChange = async (userId, newRole) => {
        setLoadingId(userId);
        try {
            const data = await updateUserRole({ role: newRole }, userId);

            if (data?.success) {
                setUsers((prev) =>
                    prev.map((u) => (u.id === userId || u._id === userId ? { ...u, role: newRole } : u))
                );
            } else {
                alert(data?.message || "Failed to update role");
            }
        } catch (error) {
            console.error("Error updating role:", error);
            // alert("Something went wrong while updating role!");
        } finally {
            setLoadingId(null);
        }
    };

    // 2. Open Delete Modal
    const openDeleteModal = (user) => {
        setUserToDelete({
            id: user.id || user._id,
            name: user.name || "this user",
        });
        setIsDeleteModalOpen(true);
    };

    // 3. Confirm Delete User
    const confirmDelete = async () => {
        if (!userToDelete) return;

        const userId = userToDelete.id;
        setLoadingId(userId);

        try {
            const data = await deleteUser(userId);

            if (data?.success) {
                setUsers((prev) => prev.filter((u) => (u.id || u._id) !== userId));
            } else {
                // alert(data?.message || "Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            // alert("Something went wrong while deleting user!");
        } finally {
            setLoadingId(null);
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    return (
        <div className="relative w-full">
            <div className="w-full bg-[#0d1527] rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-slate-200">
                {/* Table Header */}
                <div className="p-6 border-b border-slate-800/80 bg-[#0f192e] flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">All Users</h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Total {users.length} registered users found
                        </p>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0b1222] text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                                <th className="py-4 px-6 text-center w-12">#</th>
                                <th className="py-4 px-6">User</th>
                                <th className="py-4 px-6">Current Role</th>
                                <th className="py-4 px-6">Change Role</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-sm">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-slate-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, index) => {
                                    const userId = user.id || user._id;
                                    const userRole = user.role || "user";
                                    const isProcessing = loadingId === userId;

                                    return (
                                        <tr
                                            key={userId}
                                            className="hover:bg-slate-800/40 transition-colors duration-150"
                                        >
                                            {/* Index */}
                                            <td className="py-4 px-6 text-center font-medium text-slate-500">
                                                {index + 1}
                                            </td>

                                            {/* Name & Email */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-900/40 text-blue-300 border border-blue-700/50 font-bold flex items-center justify-center text-sm shrink-0">
                                                        {user.name ? user.name[0].toUpperCase() : "U"}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-white">
                                                            {user.name || "N/A"}
                                                        </div>
                                                        <div className="text-xs text-slate-400">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Current Role Badge */}
                                            <td className="py-4 px-6">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize border ${userRole === "admin"
                                                        ? "bg-purple-950/60 text-purple-300 border-purple-800/60"
                                                        : userRole === "lawyer"
                                                            ? "bg-blue-950/60 text-blue-300 border-blue-800/60"
                                                            : "bg-emerald-950/60 text-emerald-300 border-emerald-800/60"
                                                        }`}
                                                >
                                                    {userRole}
                                                </span>
                                            </td>

                                            {/* Role Change Dropdown */}
                                            <td className="py-4 px-6">
                                                <select
                                                    disabled={isProcessing}
                                                    value={userRole}
                                                    onChange={(e) => handleRoleChange(userId, e.target.value)}
                                                    className="bg-[#090d16] border border-slate-700 text-slate-200 text-xs rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 block p-2 cursor-pointer disabled:opacity-50 outline-none"
                                                >
                                                    <option value="user" className="bg-[#0f192e]">User</option>
                                                    <option value="lawyer" className="bg-[#0f192e]">Lawyer</option>
                                                    <option value="admin" className="bg-[#0f192e]">Admin</option>
                                                </select>
                                            </td>

                                            {/* Delete Action Button */}
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    disabled={isProcessing}
                                                    onClick={() => openDeleteModal(user)}
                                                    className="inline-flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-900/50 border border-red-800/50 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                                                >
                                                    {isProcessing && loadingId === userId ? "Processing..." : "Delete"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-[#0f192e] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">

                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-white">
                                Delete User Confirmation
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Are you sure you want to delete <span className="text-red-400 font-semibold">{userToDelete?.name}</span>? This action cannot be undone.
                            </p>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="flex items-center justify-end gap-3 text-xs font-medium">
                            <button
                                disabled={loadingId === userToDelete?.id}
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setUserToDelete(null);
                                }}
                                className="px-4 py-2 text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={loadingId === userToDelete?.id}
                                onClick={confirmDelete}
                                className="px-4 py-2 text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loadingId === userToDelete?.id ? (
                                    <>
                                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete User'
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}