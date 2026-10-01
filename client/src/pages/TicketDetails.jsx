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
const [editing, setEditing] = useState(false);
const [editTitle, setEditTitle] = useState("");
const [editDescription, setEditDescription] = useState("");
const [updating, setUpdating] = useState(false);
const [deleting, setDeleting] = useState(false);

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
const handleDelete = async () => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this ticket?"
    );

    if (!confirmed) return;

    try {
        setDeleting(true);

        await api.delete(`/tickets/${id}`);

        navigate("/tickets");

    } catch (error) {
        console.log("Failed to delete ticket:", error);
    } finally {
        setDeleting(false);
    }
};
const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editTitle.trim() || !editDescription.trim()) {
        return;
    }

    try {
        setUpdating(true);

        const response = await api.put(`/tickets/${id}`, {
            title: editTitle,
            description: editDescription
        });

        setTicket(response.data.ticket);
        setEditing(false);

    } catch (error) {
        console.log("Failed to update ticket:", error);
    } finally {
        setUpdating(false);
    }
};

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await api.get(`/tickets/${id}`);

    

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

{/* Edit / Delete buttons */}
{ticket.status === "open" && (
    <div className="mt-4 flex gap-3">

        <button
            onClick={() => {
                setEditTitle(ticket.title);
                setEditDescription(ticket.description);
                setEditing(true);
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
            Edit
        </button>

        <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
            {deleting ? "Deleting..." : "Delete"}
        </button>

    </div>
)}

{/* Edit Ticket Form */}
{editing && (
    <form
        onSubmit={handleUpdate}
        className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5"
    >
        <h2 className="text-lg font-semibold text-slate-900">
            Edit Ticket
        </h2>

        <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            placeholder="Ticket title"
        />

        <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows="5"
            className="mt-3 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            placeholder="Ticket description"
        />

        <div className="mt-4 flex gap-3">

            <button
                type="submit"
                disabled={updating}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
                {updating ? "Saving..." : "Save Changes"}
            </button>

            <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
            >
                Cancel
            </button>

        </div>
    </form>
)}

{!editing && (
    <>
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
    </>
)}

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
           ticket.comments?.map((item, index) => {
    const isAgent = item.user?.role === "agent";

    return (
        <div
            key={index}
            className={`flex ${
                isAgent ? "justify-start" : "justify-end"
            }`}
        >
            <div
                className={`max-w-[75%] rounded-xl p-4 ${
                    isAgent
                        ? "bg-slate-100 text-slate-900"
                        : "bg-blue-600 text-white"
                }`}
            >
                <div className="flex items-center justify-between gap-6">
                    <p
                        className={`text-sm font-semibold ${
                            isAgent
                                ? "text-slate-900"
                                : "text-white"
                        }`}
                    >
                        {isAgent ? "Agent" : "You"}
                    </p>

                    <p
                        className={`text-xs ${
                            isAgent
                                ? "text-slate-400"
                                : "text-blue-100"
                        }`}
                    >
                        {new Date(
                            item.createdAt
                        ).toLocaleString()}
                    </p>
                </div>

                <p
                    className={`mt-2 text-sm ${
                        isAgent
                            ? "text-slate-600"
                            : "text-white"
                    }`}
                >
                    {item.message}
                </p>
            </div>
        </div>
    );
})
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