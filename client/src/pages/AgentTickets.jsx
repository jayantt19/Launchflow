import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, ArrowLeft } from "lucide-react";
import api from "../services/api";

function AgentTickets() {
    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await api.get("/agent/tickets");
                setTickets(response.data.tickets || []);
            } catch (error) {
                console.log("Failed to fetch tickets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const filteredTickets =
    filter === "all"
        ? tickets
        : tickets.filter((ticket) => ticket.status === filter);

    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
            <div className="mx-auto max-w-6xl">

                {/* Back */}
                <button
                    onClick={() => navigate("/agent")}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">
                        My Tickets
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage tickets assigned to you.
                    </p>
                </div>

                {/* Filters */}
<div className="mb-6 flex gap-3">
    {["all", "open", "in-progress", "resolved"].map((status) => (
        <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
                filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200"
            }`}
        >
            {status}
        </button>
    ))}
</div>

                {/* Tickets */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

                    {loading ? (
                        <div className="p-10 text-center text-sm text-slate-500">
                            Loading tickets...
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="p-10 text-center">

                            <Ticket
                                size={36}
                                className="mx-auto text-slate-300"
                            />

                            <p className="mt-3 text-sm text-slate-500">
                                No tickets are currently assigned to you.
                            </p>

                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">

                            {filteredTickets.map((ticket) => (
                                <div
                                    key={ticket._id}
                                    className="flex flex-col gap-4 p-6 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                                >

                                    {/* Ticket info */}
                                    <div className="min-w-0">

                                        <h3 className="font-semibold text-slate-900">
                                            {ticket.title}
                                        </h3>

                                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                                            {ticket.description}
                                        </p>

                                        <p className="mt-2 text-xs text-slate-400">
                                            Created{" "}
                                            {new Date(
                                                ticket.createdAt
                                            ).toLocaleDateString()}
                                        </p>

                                    </div>

                                    {/* Status */}
                                    <div className="flex shrink-0 items-center gap-3">

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                                            {ticket.priority}
                                        </span>

                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-600">
                                            {ticket.status}
                                        </span>

                                        <button
                                            onClick={() =>
                                               navigate(`/agent/tickets/${ticket._id}`)
                                            }
                                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                        >
                                            View
                                        </button>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}

export default AgentTickets;