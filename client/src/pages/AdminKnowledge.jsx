import { useEffect, useState } from "react";
import api from "../services/api";
import {
    ArrowLeft,
    Plus,
    Search,
    Trash2,
    Edit
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminKnowledge() {
    const navigate = useNavigate();

    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [saving, setSaving] = useState(false);
    const [knowledge, setKnowledge] = useState([]);
    const [editingKnowledge, setEditingKnowledge] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        content: ""
    });

    useEffect(() => {
    const fetchKnowledge = async () => {
        try {
            const response = await api.get("/knowledge");

            const data = response.data.knowledge || [];

            setKnowledge(
                data.map((item) => ({
                    ...item,
                    id: item._id,
                    category: item.source || "General"
                }))
            );

        } catch (error) {
            console.error("Failed to fetch knowledge:", error);

            alert(
                error.response?.data?.message ||
                "Failed to load knowledge"
            );
        }
    };

    fetchKnowledge();
}, []);

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
        alert("Please enter title and content");
        return;
    }

    try {
        setSaving(true);

        let response;

        if (editingKnowledge) {
            // Update existing knowledge
            response = await api.patch(
                `/knowledge/${editingKnowledge.id}`,
                {
                    title: formData.title,
                    content: formData.content,
                    source: formData.category || "General"
                }
            );
        } else {
            // Create new knowledge
            response = await api.post("/knowledge", {
                title: formData.title,
                content: formData.content,
                source: formData.category || "General"
            });
        }

        const savedKnowledge = response.data.knowledge;

        const formattedKnowledge = {
            ...savedKnowledge,
            id: savedKnowledge._id,
            category: savedKnowledge.source || "General"
        };

        if (editingKnowledge) {
            // Replace the old item
            setKnowledge((prev) =>
                prev.map((item) =>
                    item.id === editingKnowledge.id
                        ? formattedKnowledge
                        : item
                )
            );
        } else {
            // Add new item at the top
            setKnowledge((prev) => [
                formattedKnowledge,
                ...prev
            ]);
        }

        // Reset form
        setFormData({
            title: "",
            category: "",
            content: ""
        });

        setEditingKnowledge(null);
        setShowForm(false);

        alert(
            editingKnowledge
                ? "Knowledge updated successfully"
                : "Knowledge added successfully"
        );

    } catch (error) {
        console.error("Knowledge error:", error);

        alert(
            error.response?.data?.message ||
            "Failed to save knowledge"
        );

    } finally {
        setSaving(false);
    }
};

   const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this knowledge?"
    );

    if (!confirmDelete) return;

    try {
        await api.delete(`/knowledge/${id}`);

        setKnowledge((prev) =>
            prev.filter((item) => item.id !== id)
        );

        alert("Knowledge deleted successfully");

    } catch (error) {
        console.error("Delete knowledge error:", error);

        alert(
            error.response?.data?.message ||
            "Failed to delete knowledge"
        );
    }
};
    

    const filteredKnowledge = knowledge.filter((item) =>
        `${item.title} ${item.category} ${item.content}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Main content */}
         <main className="p-8">
         <button
    onClick={() => navigate("/admin")}
    className="mb-6 flex items-center gap-2 text-slate-600 hover:text-blue-600"
>
    <ArrowLeft size={20} />
    Back to Dashboard
</button>
                <div className="p-10">

                    {/* Page heading */}
                    <div className="mb-8 flex items-center justify-between">

                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Knowledge Base
                            </h1>

                            <p className="mt-2 text-slate-500">
                                Manage the information used by LaunchFlow AI.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                        >
                            <Plus size={20} />
                            Add Knowledge
                        </button>

                    </div>

                    {/* Search */}
                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">

                        <div className="relative">

                            <Search
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                placeholder="Search knowledge..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
                            />

                        </div>

                    </div>

                    {/* Knowledge cards */}
                    <div className="space-y-4">

                        {filteredKnowledge.length === 0 ? (
                            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                    

                                <p className="font-medium text-slate-700">
                                    No knowledge found
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Add information for the AI to use.
                                </p>
                            </div>
                        ) : (
                            filteredKnowledge.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-6"
                                >

                                    <div className="flex items-start justify-between">

                                        <div className="flex-1">

                                            <div className="flex items-center gap-3">

                                                <h2 className="text-xl font-semibold text-slate-900">
                                                    {item.title}
                                                </h2>

                                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                                                    {item.category}
                                                </span>

                                            </div>

                                            <p className="mt-3 text-slate-600">
                                                {item.content}
                                            </p>

                                        </div>

                                        <div className="ml-6 flex gap-2">

                                           <button
    onClick={() => {
        setEditingKnowledge(item);

        setFormData({
            title: item.title,
            category: item.category,
            content: item.content
        });

        setShowForm(true);
    }}
    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
>
    <Edit size={18} />
</button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                        </div>

                                    </div>

                                </div>
                            ))
                        )}

                    </div>

                </div>

            </main>

            {/* Add Knowledge Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">

                    <div className="w-full max-w-2xl rounded-2xl bg-white p-7 shadow-xl">

                        <div className="mb-6 flex items-center justify-between">

                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">
    {editingKnowledge ? "Edit Knowledge" : "Add Knowledge"}
</h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Add information that the AI can use to
                                    answer customer questions.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowForm(false)}
                                className="text-2xl text-slate-400 hover:text-slate-600"
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. Refund Policy"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Category
                                </label>

                                <select
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            category: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
                                >
                                    <option value="">
                                        Select category
                                    </option>
                                    <option value="General">
                                        General
                                    </option>
                                    <option value="Account">
                                        Account
                                    </option>
                                    <option value="Billing">
                                        Billing
                                    </option>
                                    <option value="Pricing">
                                        Pricing
                                    </option>
                                    <option value="Technical">
                                        Technical
                                    </option>
                                    <option value="Policy">
                                        Policy
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Information
                                </label>

                                <textarea
                                    rows="7"
                                    placeholder="Enter the information that the AI should know..."
                                    value={formData.content}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            content: e.target.value
                                        })
                                    }
                                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">

                                <button
                                    type="button"
                                    onClick={() => {
    setShowForm(false);
    setEditingKnowledge(null);
    setFormData({
        title: "",
        category: "",
        content: ""
    });
}}
                                    className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                               <button
    type="submit"
    disabled={saving}
    className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
>
   {saving
    ? "Saving..."
    : editingKnowledge
        ? "Update Knowledge"
        : "Save Knowledge"
}
</button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminKnowledge;