const Ticket = require("../models/Ticket");

const checkSla = async (req, res) => {
    try {
        const tickets = await Ticket.find({
    status: {
        $in: ["open", "in-progress"]
    },
    slaDeadline: {
        $ne: null
    }

        });
       const now = new Date();

const ticketsWithSla = tickets.map(ticket => {

    const remainingTime = ticket.slaDeadline - now;

    let hours = Math.floor(
        Math.abs(remainingTime) / (1000 * 60 * 60)
    );

    let minutes = Math.floor(
        (Math.abs(remainingTime) % (1000 * 60 * 60)) / (1000 * 60)
    );

    let slaTime;
    let isSlaBreached = false;

    if (remainingTime <= 0) {
        isSlaBreached = true;
        slaTime = `Breached by ${hours}h ${minutes}m`;
    } else {
        slaTime = `${hours}h ${minutes}m remaining`;
    }

    return {
        ...ticket.toObject(),
        slaTime,
        isSlaBreached
    };
});

  return res.status(200).json({
    message: "SLA status checked successfully",
    tickets: ticketsWithSla
});

    } catch (err) {
        return res.status(500).json({
            message: "Server Error",
            err: err.message
        });
    }
};

module.exports = {
    checkSla
};