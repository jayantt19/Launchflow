import {LayoutDashboard,Ticket,Plus,Bot,Bell,LogOut,ChevronDown,Clock,CheckCircle,AlertCircle} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import api from "../services/api";

function CustomerDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchTickets = async () => {
        try {
            const response = await api.get("/tickets");

            console.log("Tickets:", response.data);
            console.log("TOTAL TICKETS:", response.data.tickets.length);
         console.log(
    "STATUSES:",
    response.data.tickets.map(ticket => ticket.status)
);
            setTickets(response.data.tickets || []);
        } catch (error) {
            console.log("Failed to fetch tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchTickets();
}, []);

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
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                            L
                        </div>

                        <span className="text-xl font-bold text-slate-900">
                            LaunchFlow
                        </span>
                    </div>
                </div>

                <div className="p-4">

                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Workspace
                    </p>

                    <nav className="space-y-1">

                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-600"
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/tickets")}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            <Ticket size={18} />
                            My Tickets
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/create-ticket")}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            <Plus size={18} />
                            Create Ticket
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/ai-support")}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            <Bot size={18} />
                            AI Support
                        </button>

                    </nav>

                    <div className="mt-8">
                        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Account
                        </p>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>

                </div>

            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">

                {/* Navbar */}
                <header className="sticky top-0 z-10 h-16 border-b border-slate-200 bg-white/95 backdrop-blur">

                    <div className="flex h-full items-center justify-between px-6">

                        <div>
                            <h1 className="text-lg font-semibold text-slate-900">
                                Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center gap-5">

                            <button
                                type="button"
                                className="relative text-slate-500 hover:text-slate-900"
                            >
                                <Bell size={20} />

                                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
                            </button>

                            <div className="h-7 w-px bg-slate-200" />

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                                    {(user?.username || user?.email || "U")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-slate-900">
                                        {user?.username || "User"}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Customer
                                    </p>
                                </div>

                                <ChevronDown
                                    size={16}
                                    className="text-slate-400"
                                />

                            </div>

                        </div>

                    </div>

                </header>

                {/* Dashboard */}
                <main className="p-6 lg:p-8">

                    {/* Welcome */}
                    <section className="mb-8">

                        <h2 className="text-2xl font-bold text-slate-900">
                            Good morning, {user?.username || "there"} 👋
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Here's what's happening with your support requests.
                        </p>

                    </section>

                    {/* Stats */}
                    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Open Tickets
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                       {tickets.filter(ticket => ticket.status === "open").length}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                                    <Ticket size={20} />
                                </div>

                            </div>

                            <p className="mt-4 text-xs text-slate-400">
                                Currently being handled
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        In Progress
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                       {tickets.filter(ticket => ticket.status === "in-progress").length}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
                                    <Clock size={20} />
                                </div>

                            </div>

                            <p className="mt-4 text-xs text-slate-400">
                                Being worked on
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Resolved
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {tickets.filter(ticket => ticket.status === "resolved").length}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-green-50 p-3 text-green-600">
                                    <CheckCircle size={20} />
                                </div>

                            </div>

                            <p className="mt-4 text-xs text-slate-400">
                                Successfully resolved
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Urgent
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {tickets.filter(ticket => ticket.priority === "urgent").length}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-red-50 p-3 text-red-600">
                                    <AlertCircle size={20} />
                                </div>

                            </div>

                            <p className="mt-4 text-xs text-slate-400">
                                Requires attention
                            </p>
                        </div>

                    </section>

                    {/* Main cards */}
                    <section className="mt-8 grid gap-6 xl:grid-cols-3">

                        {/* Create Ticket */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 xl:col-span-2">

                            <div className="flex items-start justify-between">

                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Need help?
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Create a support ticket and our team will
                                        get back to you.
                                    </p>
                                </div>

                                <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                                    <Ticket size={22} />
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={() => navigate("/create-ticket")}
                                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
                            >
                                <Plus size={18} />
                                Create New Ticket
                            </button>

                        </div>

                        {/* AI */}
                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">

                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
                                <Bot size={22} />
                            </div>

                            <h3 className="mt-5 text-lg font-semibold text-slate-900">
                                Ask LaunchFlow AI
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Get instant answers from our AI support
                                assistant before creating a ticket.
                            </p>

                            <button
                                type="button"
                                onClick={() => navigate("/ai-support")}
                                className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Ask AI →
                            </button>

                        </div>

                    </section>

                    {/* Recent Tickets */}
                    <section className="mt-8 rounded-xl border border-slate-200 bg-white">

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Recent Tickets
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    Your latest support requests
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate("/tickets")}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                View all
                            </button>

                        </div>

                        <div className="divide-y divide-slate-100">

                            {loading ? (
    <div className="px-6 py-8 text-center text-sm text-slate-500">
        Loading tickets...
    </div>
) : tickets.length === 0 ? (
    <div className="px-6 py-8 text-center text-sm text-slate-500">
        No tickets found.
    </div>
) : (
    tickets.slice(0, 3).map((ticket) => (
        <div
            key={ticket._id}
            className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <p className="font-medium text-slate-900">
                    {ticket.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                    #{ticket._id.slice(-6).toUpperCase()}
                </p>
            </div>

            <div className="flex items-center gap-3">
                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                        ticket.priority === "urgent"
                            ? "bg-red-50 text-red-600"
                            : ticket.priority === "high"
                            ? "bg-orange-50 text-orange-600"
                            : ticket.priority === "medium"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-100 text-slate-600"
                    }`}
                >
                    {ticket.priority}
                </span>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                        ticket.status === "resolved"
                            ? "bg-green-50 text-green-600"
                            : ticket.status === "in-progress"
                            ? "bg-amber-50 text-amber-600"
                            : ticket.status === "closed"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-blue-50 text-blue-600"
                    }`}
                >
                    {ticket.status}
                </span>
            </div>
        </div>
    ))
)}


                        </div>

                    </section>

                </main>

            </div>

        </div>
    );
}

export default CustomerDashboard;