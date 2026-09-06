const KnowledgeBase = require("../models/KnowledgeBase");
const generateEmbedding = require("../services/embeddedService");

const createKnowledge = async (req, res) => {
    try {
        const { title, content, source } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const embedding = await generateEmbedding(content);

        const knowledge = await KnowledgeBase.create({
            title,
            content,
            source: source || "manual",
            embedding
        });

        return res.status(201).json({
            message: "Knowledge added successfully",
            knowledge
        });

    } catch (err) {
        return res.status(500).json({
            message: "Server Error",
            err: err.message
        });
    }
};


const getKnowledge = async (req, res) => {
    try {
        const knowledge = await KnowledgeBase.find()
            .select("-embedding")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            knowledge
        });

    } catch (err) {
        console.error("Get knowledge error:", err);

        return res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
};

const deleteKnowledge = async (req, res) => {
    try {
        const { id } = req.params;

        const knowledge = await KnowledgeBase.findByIdAndDelete(id);

        if (!knowledge) {
            return res.status(404).json({
                message: "Knowledge not found"
            });
        }

        return res.status(200).json({
            message: "Knowledge deleted successfully"
        });

    } catch (err) {
        console.error("Delete knowledge error:", err);

        return res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
};

const updateKnowledge = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, source } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        // Generate a new embedding for the updated content
        const embedding = await generateEmbedding(content);

        const knowledge = await KnowledgeBase.findByIdAndUpdate(
            id,
            {
                title,
                content,
                source: source || "General",
                embedding
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!knowledge) {
            return res.status(404).json({
                message: "Knowledge not found"
            });
        }

        return res.status(200).json({
            message: "Knowledge updated successfully",
            knowledge
        });

    } catch (err) {
        console.error("Update knowledge error:", err);

        return res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
};
module.exports = {
    createKnowledge,getKnowledge,deleteKnowledge,updateKnowledge
};