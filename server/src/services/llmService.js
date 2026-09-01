const { InferenceClient } = require("@huggingface/inference");

const hf = new InferenceClient(process.env.HF_TOKEN);

const generateAnswer = async (question, context) => {
    const response = await hf.chatCompletion({
        model: "openai/gpt-oss-120b:fastest",
        messages: [
            {
                role: "system",
                content: `You are a customer support assistant for LaunchFlow.

Answer the customer's question using ONLY the provided knowledge.

If the knowledge does not contain enough information to answer the question, say:
"I don't have enough information to answer this question."

Do not invent policies, prices, deadlines, or other company information.

Knowledge:
${context}`
            },
            {
                role: "user",
                content: question
            }
        ],
        max_tokens: 300
    });

    return response.choices[0].message.content;
};

module.exports = generateAnswer;