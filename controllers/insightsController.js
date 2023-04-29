const express = require("express");
const prisma = require("../lib/prisma.js");
const router = express.Router();

// insight by user

router.get("(/user/:user_id)", async function (req, res) {
    const { user_id } = req.params;
    const user_insights = await prisma.consumptionHistory.findMany({
        where: {
            user_id: parseInt(user_id),
        },
        orderBy: {
            consumption_date: "desc",
        },
        include: {
            task: {
                select: {
                    start_time: true,
                    end_time: true,
                    task: true,
                },
            },
            routine: {
                select: {
                    duration_routine: true,
                    creation_routine: true,
                    task: true,
                },
            },
        },
    });
    res.json(user_insights);
});

module.exports = router;