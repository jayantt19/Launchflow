import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyTickets() {
    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await api.get("/tickets");

                setTickets(response.data.tickets || []);
            } catch (error) {
                console.log("Failed to fetch tickets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-10">

            <div className="mx-auto max-w-6xl">

                <button
                    onClick={() => navigate("/customer")}
                    className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    ← Back to Dashboard
                </button>

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">
                        My Tickets
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        View and track all your support requests.
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

                    {loading ? (
                        <div className="p-8 text-center text-sm text-slate-500">
                            Loading tickets...
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-sm text-slate-500">
                                You haven't created any tickets yet.
                            </p>

                            <button
                                onClick={() => navigate("/create-ticket")}
                                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Create Ticket
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">

                            {tickets.map((ticket) => (
                                <div
                                    key={ticket._id}
                                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50"
                                >

                                    <div>
                                        <h3 className="font-medium text-slate-900">
                                            {ticket.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {ticket.description}
                                        </p>

                                        <p className="mt-2 text-xs text-slate-400">
                                            Created{" "}
                                            {new Date(
                                                ticket.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                                            {ticket.priority}
                                        </span>

                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-600">
                                            {ticket.status}
                                        </span>

                                        <button
                                            onClick={() =>
                                                navigate(`/tickets/${ticket._id}`)
                                            }
                                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
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

export default MyTickets;