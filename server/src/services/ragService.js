const searchKnowledge = require("./searchKnowledge");
const generateAnswer = require("./llmService");
const Ticket=require("../models/Ticket");

const askAI = async (question, userId) => {

    const results = await searchKnowledge(question);

    const relevantResults = results.filter(
        item => item.score >= 0.75
    );

   if (relevantResults.length === 0) {

    const slaDeadline = new Date();
    slaDeadline.setHours(
        slaDeadline.getHours() + 12
    );

    const ticket = await Ticket.create({
        title: "AI Support Request",
        description: question,
        createdBy: userId,
        priority: "medium",
        slaDeadline,

        activity: [
            {
                action: "Ticket created by AI",
                performedBy: userId
            }
        ]
    });

    return {
        answer: "I don't have enough information to answer this question. A support ticket has been created for you.",
        sources: [],
        ticketId: ticket._id
    };
}

    const context = relevantResults
        .map((item) => {
            return `Title: ${item.title}\nContent: ${item.content}`;
        })
        .join("\n\n");

    const answer = await generateAnswer(question, context);

    return {
        answer,
        sources: relevantResults.map((item) => ({
            title: item.title,
            source: item.source,
            score: item.score
        }))
    };
};

module.exports = askAI;