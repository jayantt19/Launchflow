import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Ticket,
    Users,
    UserCog,
    LogOut,
    Bell,
    Clock,
    CheckCircle,
    AlertCircle,
    BookOpen,
    Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext.jsx";

function AdminDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
const [unreadCount, setUnreadCount] = useState(0);
const [showNotifications, setShowNotifications] = useState(false);
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await api.get("/admin/tickets");

                setTickets(response.data.tickets || []);
            } catch (error) {
                console.log("Failed to fetch tickets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    useEffect(() => {
    const fetchNotifications = async () => {
        try {
            const response = await api.get("/notifications");

            setNotifications(response.data.notifications || []);

            const unreadResponse = await api.get(
                "/notifications/unread-count"
            );

            setUnreadCount(unreadResponse.data.unreadCount || 0);
        } catch (error) {
            console.log("Failed to fetch notifications:", error);
        }
    };

    fetchNotifications();
}, []);

    const totalTickets = tickets.length;

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

    const handleNotificationClick = async (notification) => {
    try {
        if (!notification.read) {
            await api.patch(
                `/notifications/${notification._id}/read`
            );

            setNotifications((prev) =>
                prev.map((item) =>
                    item._id === notification._id
                        ? { ...item, read: true }
                        : item
                )
            );

            setUnreadCount((prev) => Math.max(prev - 1, 0));
        }
    } catch (error) {
        console.log("Failed to mark notification as read:", error);
    }
};

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">

                {/* Logo */}
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

                {/* Navigation */}
                <div className="p-4">

                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Admin
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
                            onClick={() => navigate("/admin/tickets")}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            <Ticket size={18} />
                            All Tickets
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/admin/users")}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            <Users size={18} />
                            Users
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/admin/agents")}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            <UserCog size={18} />
                            Agents
                        </button>
                        <button
    onClick={() => navigate("/admin/knowledge")}
    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
>
    <BookOpen size={18} />
    Knowledge Base
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

            {/* Main */}
            <div className="lg:ml-64">

                {/* Navbar */}
                <header className="sticky top-0 z-10 h-16 border-b border-slate-200 bg-white/95 backdrop-blur">

                    <div className="flex h-full items-center justify-between px-6">

                        <h1 className="text-lg font-semibold text-slate-900">
                            Admin Dashboard
                        </h1>

                        <div className="flex items-center gap-5">

                          <div className="relative">
    <button
        type="button"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative text-slate-500 hover:text-slate-900"
    >
        <Bell size={20} />

        {unreadCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount}
            </span>
        )}
    </button>

    {showNotifications && (
        <div className="absolute right-0 mt-3 w-80 rounded-xl border border-slate-200 bg-white shadow-lg">

            <div className="border-b border-slate-200 px-4 py-3">
                <h3 className="font-semibold text-slate-900">
                    Notifications
                </h3>
            </div>

            <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-slate-500">
                        No notifications
                    </p>
                ) : (
                    notifications.map((notification) => (
                        <button
                            key={notification._id}
                            type="button"
                            onClick={() =>
                                handleNotificationClick(notification)
                            }
                            className={`w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 ${
                                !notification.read
                                    ? "bg-blue-50"
                                    : "bg-white"
                            }`}
                        >
                            <p className="text-sm font-medium text-slate-900">
                                {notification.message}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                {new Date(
                                    notification.createdAt
                                ).toLocaleString()}
                            </p>
                        </button>
                    ))
                )}
            </div>

        </div>
    )}
</div>

                            <div className="h-7 w-px bg-slate-200" />

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                                    {(user?.username || user?.email || "A")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-slate-900">
                                        {user?.username || "Admin"}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Administrator
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </header>

                {/* Dashboard Content */}
                <main className="p-6 lg:p-8">

                    {/* Welcome */}
                    <section className="mb-8">

                        <h2 className="text-2xl font-bold text-slate-900">
                            Welcome back, {user?.username || "Admin"} 👋
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Here's an overview of your support system.
                        </p>

                    </section>

                    {/* Stats */}
                    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">

                        {/* Total */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Total Tickets
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {loading ? "—" : totalTickets}
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
                                    <Activity size={20} />
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

                    </section>

                    {/* Quick Actions */}
                    <section className="mt-8 grid gap-6 md:grid-cols-3">

                        <button
                            onClick={() => navigate("/admin/tickets")}
                            className="rounded-xl border border-slate-200 bg-white p-6 text-left transition hover:border-blue-300 hover:shadow-sm"
                        >
                            <Ticket className="text-blue-600" size={24} />

                            <h3 className="mt-4 font-semibold text-slate-900">
                                Manage Tickets
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                View, assign and manage support tickets.
                            </p>
                        </button>

                        <button
                            onClick={() => navigate("/admin/users")}
                            className="rounded-xl border border-slate-200 bg-white p-6 text-left transition hover:border-blue-300 hover:shadow-sm"
                        >
                            <Users className="text-blue-600" size={24} />

                            <h3 className="mt-4 font-semibold text-slate-900">
                                Manage Users
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                View and manage customer accounts.
                            </p>
                        </button>

                        <button
                            onClick={() => navigate("/admin/agents")}
                            className="rounded-xl border border-slate-200 bg-white p-6 text-left transition hover:border-blue-300 hover:shadow-sm"
                        >
                            <UserCog className="text-blue-600" size={24} />

                            <h3 className="mt-4 font-semibold text-slate-900">
                                Manage Agents
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Monitor and manage support agents.
                            </p>
                        </button>

                    </section>

                    {/* Recent Tickets */}
                    <section className="mt-8 rounded-xl border border-slate-200 bg-white">

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Recent Tickets
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    Latest support activity
                                </p>
                            </div>

                            <button
                                onClick={() => navigate("/admin/tickets")}
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
                            <div className="p-8 text-center text-sm text-slate-500">
                                No tickets found.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">

                                {tickets.slice(0, 5).map((ticket) => (
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

                    </section>

                </main>

            </div>

        </div>
    );
}

export default AdminDashboard;