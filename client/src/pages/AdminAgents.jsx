import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminAgents() {
    const navigate = useNavigate();

    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await api.get("/admin/agents");

                console.log("Agents:", response.data);

                setAgents(response.data.agents || []);
            } catch (error) {
                console.log("Failed to fetch agents:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, []);

    if (loading) {
        return <div className="p-8">Loading agents...</div>;
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
                Agents
            </h1>

            {agents.length === 0 ? (
                <p>No agents found.</p>
            ) : (
                <div className="space-y-4">
                    {agents.map((agent) => (
                        <div
                            key={agent._id}
                            className="bg-white border rounded-xl p-5 shadow-sm"
                        >
                            <h2 className="text-xl font-semibold">
                                {agent.name}
                            </h2>

                            <p className="text-gray-600 mt-1">
                                {agent.email}
                            </p>

                            <p className="text-sm text-gray-500 mt-2">
                                Role: Agent
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminAgents;