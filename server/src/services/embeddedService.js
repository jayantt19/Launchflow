const { InferenceClient } = require("@huggingface/inference");

const hf = new InferenceClient(process.env.HF_TOKEN);

const generateEmbedding = async (text) => {
    const result = await hf.featureExtraction({
        model: "Qwen/Qwen3-Embedding-0.6B",
        inputs: text
    });

    return result[0];;
};

module.exports = generateEmbedding;