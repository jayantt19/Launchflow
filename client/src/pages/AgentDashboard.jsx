import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Ticket,
    Clock,
    CheckCircle,
    AlertCircle,
    Bell,
    LogOut,
    User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";

function AgentDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await api.get("/agent/tickets");

                console.log("Agent tickets:", response.data);

                setTickets(response.data.tickets || []);
            } catch (error) {
                console.log("Failed to fetch agent tickets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const assignedTickets = tickets.length;

    const openTickets = tickets.filter(
        (ticket) => ticket.status === "open"
    ).length;

    const inProgressTickets = tickets.filter(
        (ticket) => ticket.status === "in-progress"
    ).length;

    const resolvedTickets = tickets.filter(
        (ticket) => ticket.status === "resolved"
    ).length;

    const urgentTickets = tickets.filter(
        (ticket) => ticket.priority === "urgent"
    ).length;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">

                <div className="flex h-16 items-center border-b border-slate-200 px-6">
                    <div className="flex items-center gap-2">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
                            L
                        </div>

                        <span className="text-xl font-bold text-slate-900">
                            LaunchFlow
                        </span>

                    </div>
                </div>

                <div className="p-4">

                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Agent
                    </p>

                    <nav className="space-y-1">

                        <button
                            onClick={() => navigate("/agent")}
                            className="flex w-full items-center gap-3 rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-600"
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </button>

                        <button
                            onClick={() => navigate("/agent/tickets")}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            <Ticket size={18} />
                            My Tickets
                        </button>

                    </nav>

                    <div className="mt-8">

                        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Account
                        </p>

                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>

                    </div>

                </div>

            </aside>

            {/* Main */}
            <div className="lg:ml-64">

                {/* Navbar */}
                <header className="sticky top-0 z-10 h-16 border-b border-slate-200 bg-white">

                    <div className="flex h-full items-center justify-between px-6">

                        <h1 className="text-lg font-semibold text-slate-900">
                            Agent Dashboard
                        </h1>

                        <div className="flex items-center gap-5">

                            <button className="relative text-slate-500">
                                <Bell size={20} />

                                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
                            </button>

                            <div className="h-7 w-px bg-slate-200" />

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <User size={18} />
                                </div>

                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-slate-900">
                                        {user?.username || "Agent"}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Support Agent
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </header>

                {/* Content */}
                <main className="p-6 lg:p-8">

                    {/* Welcome */}
                    <div className="mb-8">

                        <h2 className="text-2xl font-bold text-slate-900">
                            Welcome back, {user?.username || "Agent"} 👋
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Here's an overview of your assigned support tickets.
                        </p>

                    </div>

                    {/* Stats */}
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">

                        {/* Assigned */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Assigned
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {loading ? "—" : assignedTickets}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                                    <Ticket size={20} />
                                </div>

                            </div>
                        </div>

                        {/* Open */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Open
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {loading ? "—" : openTickets}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                                    <AlertCircle size={20} />
                                </div>

                            </div>
                        </div>

                        {/* In Progress */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        In Progress
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {loading ? "—" : inProgressTickets}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
                                    <Clock size={20} />
                                </div>

                            </div>
                        </div>

                        {/* Resolved */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Resolved
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {loading ? "—" : resolvedTickets}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-green-50 p-3 text-green-600">
                                    <CheckCircle size={20} />
                                </div>

                            </div>
                        </div>

                        {/* Urgent */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Urgent
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {loading ? "—" : urgentTickets}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-red-50 p-3 text-red-600">
                                    <AlertCircle size={20} />
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Recent Tickets */}
                    <div className="mt-8 rounded-xl border border-slate-200 bg-white">

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Assigned Tickets
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    Tickets currently assigned to you
                                </p>
                            </div>

                            <button
                                onClick={() => navigate("/agent/tickets")}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                View all
                            </button>

                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-sm text-slate-500">
                                Loading tickets...
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="p-8 text-center">

                                <Ticket
                                    size={32}
                                    className="mx-auto text-slate-300"
                                />

                                <p className="mt-3 text-sm text-slate-500">
                                    No tickets assigned to you.
                                </p>

                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">

                                {tickets.slice(0, 5).map((ticket) => (
                                    <div
                                        key={ticket._id}
                                        className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50"
                                    >

                                        <div>

                                            <p className="font-medium text-slate-900">
                                                {ticket.title}
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {ticket.description}
                                            </p>

                                        </div>

                                        <div className="flex items-center gap-3">

                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                                                {ticket.priority}
                                            </span>

                                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-600">
                                                {ticket.status}
                                            </span>

                                        </div>

                                    </div>
                                ))}

                            </div>
                        )}

                    </div>

                </main>

            </div>

        </div>
    );
}

export default AgentDashboard;