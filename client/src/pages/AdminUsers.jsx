import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminUsers() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get("/admin/users");

                setUsers(response.data.users || []);
            } catch (error) {
                console.log("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div className="p-8">Loading users...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">

            <button
                onClick={() => navigate("/admin")}
                className="mb-6 text-blue-600"
            >
                ← Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold mb-6">
                Users
            </h1>

            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <div className="space-y-4">
                    {users.map((user) => (
                        <div
                            key={user._id}
                            className="bg-white border rounded-xl p-5 shadow-sm"
                        >
                            <h2 className="text-xl font-semibold">
                                {user.name}
                            </h2>

                            <p className="text-gray-600 mt-1">
                                {user.email}
                            </p>

                            <p className="text-sm text-gray-500 mt-2">
                                Role: Customer
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminUsers;