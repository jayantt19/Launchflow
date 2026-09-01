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

module.exports = {
    createKnowledge
};