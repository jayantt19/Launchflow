const mongoose = require("mongoose");

const knowledgeBaseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            required: true
        },

        source: {
            type: String,
            default: "manual"
        },

        embedding: {
            type: [Number],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const KnowledgeBase = mongoose.model(
    "KnowledgeBase",
    knowledgeBaseSchema
);

module.exports = KnowledgeBase;