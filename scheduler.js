/* -------------------------------------------------------------------------- */
/*                             Ignorar este ficheiro obg                      */
/* -------------------------------------------------------------------------- */

const prisma = require("../lib/prisma.js");

async function processRoutinesForUser(user_id) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)

  try {
    const routines = await prisma.userRoutine.findMany({
      where: {
        user_id: user_id,
        weekdays: { has: dayOfWeek },
      },
    });

    for (const routine of routines) {
      const { period_time, routine_id, task_id, house_id } = routine;
      const [startHour, startMinute, endHour, endMinute] = period_time;
      const startTime = new Date();
      startTime.setHours(startHour, startMinute, 0, 0);
      const endTime = new Date();
      endTime.setHours(endHour, endMinute, 59, 999);

      if (today >= startTime && today <= endTime) {
        await prisma.consumptionHistory.create({
          data: {
            user_id: user_id,
            task_id: task_id,
            routine_id: routine_id,
            house_id: parseInt(house_id),
          },
        });
      }
    }
  } catch (error) {
    console.error("Error processing consumption:", error);
    throw error;
  }
}

module.exports = {
  processRoutinesForUser,
};
