import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import CustomerDashboard from "./pages/CustomerDashboard";
import CreateTicket from "./pages/CreateTicket";
import MyTickets from "./pages/MyTickets";
import TicketDetails from "./pages/TicketDetails";
import AISupport from "./pages/AISupport";
import AgentTicketDetails from "./pages/AgentTicketDetails";
import AgentDashboard from "./pages/AgentDashboard";
import AgentTickets from "./pages/AgentTickets";
import AdminTicketDetails from "./pages/AdminTicketDetails";
import AdminTickets from "./pages/AdminTickets";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAgents from "./pages/AdminAgents"
import AdminUsers from "./pages/AdminUsers"
import ProtectedRoute from "./components/ProtectedRoute";
import AdminKnowledge from "./pages/AdminKnowledge";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes */}
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />


                <Route
    path="/admin/knowledge"
    element={<AdminKnowledge />}
/>

                <Route
    path="/admin/tickets/:id"
    element={<AdminTicketDetails />}
/> 
<Route
    path="/admin/agents"
    element={<AdminAgents />}
/>

<Route
    path="/admin/users"
    element={<AdminUsers />}
/>

<Route
    path="/admin/tickets"
    element={
        <ProtectedRoute allowedRoles={["admin"]}>
            <AdminTickets />
        </ProtectedRoute>
    }
/>

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* Customer Routes */}

                <Route
                    path="/customer"
                    element={
                        <ProtectedRoute allowedRoles={["customer","admin"]}>
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/create-ticket"
                    element={
                        <ProtectedRoute allowedRoles={["customer","admin"]}>
                            <CreateTicket />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tickets"
                    element={
                        <ProtectedRoute allowedRoles={["customer"]}>
                            <MyTickets />
                        </ProtectedRoute>
                    }
                />
<Route
    path="/agent/tickets/:id"
    element={
        <ProtectedRoute allowedRoles={["agent", "admin"]}>
            <AgentTicketDetails />
        </ProtectedRoute>
    }
/>

                <Route
                    path="/tickets/:id"
                    element={
                        <ProtectedRoute allowedRoles={["customer"]}>
                            <TicketDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ai-support"
                    element={
                        <ProtectedRoute allowedRoles={["customer"]}>
                            <AISupport />
                        </ProtectedRoute>
                    }
                />


                {/* Agent Routes */}

                <Route
                    path="/agent"
                    element={
                        <ProtectedRoute allowedRoles={["agent","admin"]}>
                            <AgentDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/agent/tickets"
                    element={
                        <ProtectedRoute allowedRoles={["agent","admin"]}>
                            <AgentTickets />
                        </ProtectedRoute>
                    }
                />


                {/* Admin Routes */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;