// import UserTable from "@/components/UserTable";
import { getUserList } from "@/lib/api/users";
import UserTable from "./UserTable";

export default async function UsersPage() {

    const res = await getUserList();
    // console.log(res.users);

    return (
        <div className="p-6 max-w-350">
            <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
            <UserTable initialUsers={res.users} />
        </div>
    );
}