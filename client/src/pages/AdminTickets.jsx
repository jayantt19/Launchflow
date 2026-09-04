import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminTickets() {
    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await api.get("/admin/tickets", {
    params: {
        status,
        priority,
          search,
           page,
        limit: 8
    }
});


                setTickets(response.data.tickets || []);
                setTotalPages(response.data.totalPages || 1);
            } catch (error) {
                console.log("Failed to fetch admin tickets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
   }, [status, priority,search,page]);

   useEffect(() => {
    setPage(1);
}, [status, priority, search]);
    if (loading) {
        return <div className="p-8">Loading tickets...</div>;
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
                All Tickets
            </h1>
            <div className="flex gap-4 mb-6">
          <input
    type="text"
    placeholder="Search tickets..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border rounded-lg px-4 py-2 bg-white w-64"
/>
    <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border rounded-lg px-4 py-2 bg-white"
    >
        <option value="">All Status</option>
        <option value="open">Open</option>
        <option value="in-progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
    </select>

    <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="border rounded-lg px-4 py-2 bg-white"
    >
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
    </select>

</div>

            {tickets.length === 0 ? (
                <p>No tickets found.</p>
            ) : (
                <div className="space-y-4">

                    {tickets.map((ticket) => (
                        <div
                            key={ticket._id}
                            className="bg-white border rounded-xl p-5 shadow-sm"
                        >
                            <h2 className="text-lg font-semibold">
                                {ticket.title}
                            </h2>

                            <p className="text-gray-600 mt-2">
                                {ticket.description}
                            </p>

                            <div className="flex gap-4 mt-4 text-sm">
                                <span>
                                    Status: {ticket.status}
                                </span>

                                <span>
                                    Priority: {ticket.priority}
                                </span>

                              <span
    className={
        ticket.isSlaBreached
            ? "text-red-600 font-semibold"
            : "text-green-600 font-semibold"
    }
>
    SLA: {ticket.isSlaBreached ? "Breached" : ticket.remainingTime}
</span>
                                <button
    onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
>
    View Ticket
</button>
                            </div>
                        </div>
                    ))}

                </div>
            )}
            {/* Pagination */}
{totalPages >= 1 && (
    <div className="mt-8 flex items-center justify-center gap-2">

        <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="rounded-lg border bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
            Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
                <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`rounded-lg px-4 py-2 text-sm ${
                        page === pageNumber
                            ? "bg-blue-600 text-white"
                            : "border bg-white text-slate-700"
                    }`}
                >
                    {pageNumber}
                </button>
            )
        )}

        <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="rounded-lg border bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
            Next
        </button>

    </div>
)}

        </div>

        
    );
}

export default AdminTickets;