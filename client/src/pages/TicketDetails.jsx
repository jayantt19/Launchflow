import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function TicketDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
const [submitting, setSubmitting] = useState(false);

const handleComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
        setSubmitting(true);

        const response = await api.post(
            `/tickets/${id}/comments`,
            {
                message: comment
            }
        );

        setTicket(response.data.ticket);
        setComment("");

    } catch (error) {
        console.log("Failed to add comment:", error);
    } finally {
        setSubmitting(false);
    }
};

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await api.get(`/tickets/${id}`);

                console.log("Ticket:", response.data);

                setTicket(response.data.ticket);
            } catch (error) {
                console.log("Failed to fetch ticket:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [id]);

    if (loading) {
        return <div className="p-8">Loading ticket...</div>;
    }

    if (!ticket) {
        return <div className="p-8">Ticket not found.</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
            <div className="mx-auto max-w-4xl">

                <button
                    onClick={() => navigate("/tickets")}
                    className="mb-6 text-sm font-medium text-blue-600"
                >
                    ← Back to My Tickets
                </button>

                <div className="rounded-xl border border-slate-200 bg-white p-6">

                    <h1 className="text-2xl font-bold text-slate-900">
                        {ticket.title}
                    </h1>

                    <p className="mt-4 text-slate-600">
                        {ticket.description}
                    </p>

                    <div className="mt-6 flex gap-3">
                        
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm capitalize">
                            {ticket.priority}
                        </span>

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm capitalize text-blue-600">
                            {ticket.status}
                        </span>
                    </div>
                    {/* Comments */}
<div className="mt-8 border-t border-slate-200 pt-6">

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
                            {item.user?.username || "User"}
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

    {/* Add Comment */}
    <form
        onSubmit={handleComment}
        className="mt-6"
    >
        <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            rows="4"
            className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
            type="submit"
            disabled={submitting}
            className="mt-3 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
            {submitting ? "Adding..." : "Add Comment"}
        </button>
    </form>

</div>

                </div>

            </div>
        </div>
    );
}

export default TicketDetails;