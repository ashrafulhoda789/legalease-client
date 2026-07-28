import { getUserList } from "@/lib/api/users";
import UserTable from "./UserTable";
import Pagination from "@/components/common/Pagination";

export default async function UsersPage({ searchParams }) {
    const params = await searchParams;
    const currentPage = Number(params?.page) || 1;
    const limit = 10;

    const res = await getUserList();
    const allUsers = res?.users || [];

    // Pagination Calculation
    const totalUsers = allUsers.length;
    const totalPages = Math.max(1, Math.ceil(totalUsers / limit));

    const startIndex = (currentPage - 1) * limit;
    const paginatedUsers = allUsers.slice(startIndex, startIndex + limit);

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Manage Users</h1>
                    <p className="text-xs text-slate-400 mt-1">
                        View, change roles, and manage registered users.
                    </p>
                </div>
            </div>

            {/* Table Component */}
            <UserTable
                initialUsers={paginatedUsers}
                currentPage={currentPage}
                limit={limit}
            />

            {/* Reusable Pagination Component */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </div>
    );
}