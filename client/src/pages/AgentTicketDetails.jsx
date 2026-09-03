import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, User } from "lucide-react";
import api from "../services/api";

function AgentTicketDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");
const [updating, setUpdating] = useState(false);
const [comment, setComment] = useState("");
const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await api.get(`/tickets/${id}`);
                setTicket(response.data.ticket);
                console.log("Activity:", response.data.ticket.activity);
                setStatus(response.data.ticket.status);
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

    const handleStatusUpdate = async () => {
    try {
        setUpdating(true);

        const response = await api.patch(
            `/agent/tickets/${id}/status`,
            {
                status
            }
        );

        setTicket(response.data.ticket);

        console.log("Status updated:", response.data);

    } catch (error) {
        console.log("Failed to update status:", error);
    } finally {
        setUpdating(false);
    }
};

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
    
    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-10">

            <div className="mx-auto max-w-5xl">

                {/* Back */}
                <button
                    onClick={() => navigate("/agent/tickets")}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    <ArrowLeft size={16} />
                    Back to My Tickets
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
                   <div className="border-t border-slate-200 p-6">
    <h2 className="text-sm font-semibold text-slate-900">
        Update Status
    </h2>

    <div className="mt-4 flex items-center gap-3">

    <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    >
        <option value="open">
            Open
        </option>

        <option value="in-progress">
            In Progress
        </option>

        <option value="resolved">
            Resolved
        </option>
    </select>

    <button
        onClick={handleStatusUpdate}
        disabled={updating || status === ticket.status}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
        {updating ? "Updating..." : "Update Status"}
    </button>
 </div>
 </div>
</div>

                    {/* Ticket information */}
                    <div className="grid gap-4 border-t border-slate-200 p-6 sm:grid-cols-3">

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

                {/* Comments */}
<div className="border-t border-slate-200 p-6">

    <h2 className="text-lg font-semibold text-slate-900">
        Comments
    </h2>

    {/* Existing comments */}
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

    {/* Add comment */}
    <form
        onSubmit={handleComment}
        className="mt-6"
    >

        <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a reply to the customer..."
            rows="4"
            className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
            type="submit"
            disabled={submitting || !comment.trim()}
            className="mt-3 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {submitting ? "Sending..." : "Add Comment"}
        </button>

    </form>

</div>
      {/* Activity History */}
<div className="border-t border-slate-200 p-6">

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
    ) 
}

export default AgentTicketDetails;