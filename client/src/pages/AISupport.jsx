import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AISupport() {
    const navigate = useNavigate();

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [sources, setSources] = useState([]);
    const [ticketId, setTicketId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAsk = async (e) => {
        e.preventDefault();

        if (!question.trim()) return;

        try {
            setLoading(true);
            setError("");
            setAnswer("");
            setSources([]);
            setTicketId(null);

            const response = await api.post("/ai/ask", {
                question
            });

            setAnswer(response.data.answer);
            setSources(response.data.sources || []);
            setTicketId(response.data.ticketId || null);

        } catch (error) {
            console.log("AI error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to get AI response"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-10">

            <div className="mx-auto max-w-4xl">

                <button
                    onClick={() => navigate("/customer")}
                    className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    ← Back to Dashboard
                </button>

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">
                        AI Support
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Ask a question and get an answer from our knowledge base.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                    <form onSubmit={handleAsk}>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            How can we help?
                        </label>

                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ask something about our products, policies, or services..."
                            rows="5"
                            className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <button
                            type="submit"
                            disabled={loading || !question.trim()}
                            className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Thinking..." : "Ask AI"}
                        </button>

                    </form>

                    {error && (
                        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {answer && (
                        <div className="mt-8 border-t border-slate-200 pt-6">

                            <h2 className="text-lg font-semibold text-slate-900">
                                AI Response
                            </h2>

                            <div className="mt-4 rounded-lg bg-slate-50 p-5">
                                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                    {answer}
                                </p>
                            </div>

                            {ticketId && (
                                <div className="mt-4 rounded-lg bg-amber-50 p-4">
                                    <p className="text-sm font-medium text-amber-800">
                                        We couldn't find enough information to answer your question.
                                    </p>

                                    <p className="mt-1 text-sm text-amber-700">
                                        A support ticket has been created for you.
                                    </p>

                                    <button
                                        onClick={() =>
                                            navigate(`/tickets/${ticketId}`)
                                        }
                                        className="mt-3 text-sm font-semibold text-amber-800 hover:underline"
                                    >
                                        View Ticket →
                                    </button>
                                </div>
                            )}

                            {sources.length > 0 && (
                                <div className="mt-6">

                                    <h3 className="text-sm font-semibold text-slate-900">
                                        Sources
                                    </h3>

                                    <div className="mt-3 space-y-2">
                                        {sources.map((source, index) => (
                                            <div
                                                key={index}
                                                className="rounded-lg border border-slate-200 p-3"
                                            >
                                                <p className="text-sm font-medium text-slate-800">
                                                    {source.title}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {source.source}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            )}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default AISupport;