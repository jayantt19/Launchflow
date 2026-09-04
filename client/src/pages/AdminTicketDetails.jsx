import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, User } from "lucide-react";
import api from "../services/api";

function AdminTicketDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState("");

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await api.get(`/tickets/${id}`);
               setTicket(response.data.ticket);

if (response.data.ticket.assignedTo) {
    setSelectedAgent(response.data.ticket.assignedTo._id);
}

const agentsResponse = await api.get("/admin/agents");
setAgents(agentsResponse.data.agents || []);
            } catch (error) {
                console.log("Failed to fetch ticket:", error);
            } finally {
                setLoading(false);
            }

        };

        fetchTicket();


    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-8">
                <p className="text-sm text-slate-500">
                    Loading ticket...
                </p>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="min-h-screen bg-slate-50 p-8">
                <p className="text-sm text-red-500">
                    Ticket not found.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-10">

            <div className="mx-auto max-w-5xl">

                {/* Back */}
                <button
                    onClick={() => navigate("/admin/tickets")}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    <ArrowLeft size={16} />
                    Back to All Tickets
                </button>

                {/* Ticket */}
                <div className="rounded-xl border border-slate-200 bg-white">

                    {/* Header */}
                    <div className="border-b border-slate-200 p-6">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                            <div>
                                <p className="text-xs font-medium text-slate-400">
                                    Ticket #{ticket._id.slice(-6).toUpperCase()}
                                </p>

                                <h1 className="mt-2 text-2xl font-bold text-slate-900">
                                    {ticket.title}
                                </h1>
                            </div>

                            <div className="flex gap-2">

                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                                    {ticket.priority}
                                </span>

                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-600">
                                    {ticket.status}
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* Description */}
                    <div className="p-6">

                        <h2 className="text-sm font-semibold text-slate-900">
                            Description
                        </h2>

                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                            {ticket.description}
                        </p>

                    </div>

                    {/* Ticket information */}
                    <div className="grid gap-4 border-t border-slate-200 p-6 sm:grid-cols-3">

                        {/* Created By */}
                        <div className="rounded-lg bg-slate-50 p-4">

                            <div className="flex items-center gap-2 text-slate-500">
                                <User size={16} />

                                <span className="text-xs">
                                    Created By
                                </span>
                            </div>

                            <p className="mt-2 text-sm font-medium text-slate-900">
                                {ticket.createdBy?.username ||
                                    ticket.createdBy?.email ||
                                    "Customer"}
                            </p>

                        </div>

                        {/* Created */}
                        <div className="rounded-lg bg-slate-50 p-4">

                            <div className="flex items-center gap-2 text-slate-500">
                                <Clock size={16} />

                                <span className="text-xs">
                                    Created
                                </span>
                            </div>

                            <p className="mt-2 text-sm font-medium text-slate-900">
                                {new Date(
                                    ticket.createdAt
                                ).toLocaleString()}
                            </p>

                        </div>

                        {/* SLA */}
                        <div className="rounded-lg bg-slate-50 p-4">

                            <div className="flex items-center gap-2 text-slate-500">
                                <Clock size={16} />

                                <span className="text-xs">
                                    SLA Deadline
                                </span>
                            </div>

                            <p className="mt-2 text-sm font-medium text-slate-900">
                                {ticket.slaDeadline
                                    ? new Date(
                                        ticket.slaDeadline
                                    ).toLocaleString()
                                    : "Not set"}
                            </p>

                        </div>

                    </div>

                </div>
                {/* Assigned Agent */}
<div className="border-t border-slate-200 p-6">
    <h2 className="text-lg font-semibold text-slate-900">
        Assigned Agent
    </h2>

    <p className="mt-2 text-sm text-slate-600">
        {ticket.assignedTo
            ? `${ticket.assignedTo.name || "Agent"}`
            : "Not assigned"}
    </p>
</div>

                {/* Assign Ticket */}
<div className="border-t border-slate-200 p-6">

    <h2 className="text-lg font-semibold text-slate-900">
        Assign Ticket
    </h2>

    <div className="mt-4 flex items-center gap-3">

        <select
    value={selectedAgent}
    onChange={(e) => setSelectedAgent(e.target.value)}
    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm"
>
            <option value="">
                Select Agent
            </option>

            {agents.map((agent) => (
                <option
                    key={agent._id}
                    value={agent._id}
                >
                    {agent.name} ({agent.email})
                </option>
            ))}
        </select>

        <button
    onClick={async () => {
        try {
            if (!selectedAgent) {
                alert("Please select an agent");
                return;
            }

            const response = await api.patch(
                `/admin/tickets/${id}/assign`,
                {
                    agentId: selectedAgent
                }
            );

              setTicket(response.data.ticket);
            alert("Ticket assigned successfully");

        } catch (error) {
            console.log("Assignment failed:", error);
            alert(
                error.response?.data?.message || "Failed to assign ticket"
            );
        }
    }}
    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
>
   {ticket.assignedTo ? "Reassign" : "Assign"}
</button>

    </div>

</div>

                {/* Comments */}
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Comments
                    </h2>

                    <div className="mt-5 space-y-4">

                        {ticket.comments?.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                No comments yet.
                            </p>
                        ) : (
                            ticket.comments?.map((item, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg bg-slate-50 p-4"
                                >
                                    <div className="flex items-center justify-between">

                                        <p className="text-sm font-medium text-slate-900">
                                            {item.user?.username ||
                                                item.user?.email ||
                                                "User"}
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            {new Date(
                                                item.createdAt
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                    <p className="mt-2 text-sm text-slate-600">
                                        {item.message}
                                    </p>

                                </div>
                            ))
                        )}

                    </div>

                </div>

                {/* Activity History */}
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Activity History
                    </h2>

                    <div className="mt-5 space-y-4">

                        {ticket.activity?.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                No activity yet.
                            </p>
                        ) : (
                            ticket.activity?.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex gap-3"
                                >
                                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />

                                    <div>
                                        <p className="text-sm font-medium text-slate-800">
                                            {item.action}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {new Date(
                                                item.createdAt
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminTicketDetails;