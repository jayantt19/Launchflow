const askAI = require("../services/ragService");

const askAIController = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                message: "Question is required"
            });
        }

        const result = await askAI(
    question,
    req.user._id
);

        return res.status(200).json({
            message: "AI response generated successfully",
            ...result
        });

    } catch (err) {
        return res.status(500).json({
            message: "AI Server Error",
            err: err.message
        });
    }
};

module.exports = {
    askAIController
};