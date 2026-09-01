const KnowledgeBase = require("../models/KnowledgeBase");
const generateEmbedding = require("./embeddedService");

const searchKnowledge = async (query) => {

    const queryEmbedding = await generateEmbedding(query);

    const results = await KnowledgeBase.aggregate([
        {
            $vectorSearch: {
                index: "vector_index",
                path: "embedding",
                queryVector: queryEmbedding,
                numCandidates: 20,
                limit: 3
            }
        },
        {
            $project: {
                title: 1,
                content: 1,
                source: 1,
                score: {
                    $meta: "vectorSearchScore"
                }
            }
        }
    ]);

    return results;
};

module.exports = searchKnowledge;