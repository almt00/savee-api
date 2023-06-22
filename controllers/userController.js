const express = require("express");
const prisma = require("../lib/prisma.js");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { SALT_ROUNDS = 10 } = process.env;
const generateAuthToken = require("../utils/generateAuthToken.js");
const authenticate = require("../middlewares/authMiddleware.js");
const axios = require("axios");

// hash password
async function hashPassword(rawPassword) {
  return bcrypt.hash(rawPassword, Number(SALT_ROUNDS));
}

// users list route
// adding authenticate protects the route
router.get("/", authenticate, async function (req, res) {
  const users = await prisma.user.findMany();
  res.json(users);
});

// user details route
router.get("/:user_id", authenticate, async function (req, res) {
  const { user_id } = req.params;
  const user = await prisma.user.findFirst({
    where: {
      user_id: user_id,
    },
  });
  res.json(user);
});

// emails to be verified after invite
router.get("/invite/:invite_token", async function (req, res) {
  const { invite_token } = req.params;
  const userInvite = await prisma.verificationRequest.findFirst({
    where: {
      token: invite_token,
    },
    select: {
      house_id: true,
    },
  });
  res.json(userInvite);
});

// add user to DB
router.post("/", async (req, res) => {
  const {
    invite,
    first_name,
    last_name,
    username,
    password,
    email,
    email_colleagues,
    house_id,
    house_name,
    ref_avatar,
    date_payment,
  } = req.body;

  // check if user already exists
  const user_exists = await prisma.user.findFirst({ where: { email } });
  if (user_exists) {
    throw Error("User with that email already exists");
  } else {
    const house_exists = await prisma.house.findFirst({
      where: {
        house_name: {
          equals: house_name || undefined,
        },
      },
    });
    if (house_exists && invite === null) {
      throw Error("House with that name already exists");
    } else {
      let house_id;
      if (invite === null) {
        const house = await prisma.house.create({
          data: {
            house_name: house_name,
          },
        });
        house_id = house.house_id;
      } else {
        console.log(invite);
        house_id = invite.house_id;
      }

      const payment = await prisma.paymentHistory.create({
        data: {
          house_id: parseInt(house_id),
          date_payment: new Date(date_payment),
          value_payment: null,
        },
      });

      const payment_id = payment.payment_id;

      // ensure that the password is hashed before being stored
      const hashedPassword = await hashPassword(password);

      if (hashedPassword) {
      }
      const user = await prisma.user.create({
        data: {
          first_name: first_name,
          last_name: last_name,
          username: username,
          password_hash: hashedPassword,
          email: email,
          createdAt: new Date(),
          house_id: house_id,
          ref_avatar: ref_avatar,
        },
      });

      // Generate verification requests for colleagues' emails
      if (email_colleagues && email_colleagues.length > 0) {
        const verificationRequests = email_colleagues.map(async (email) => {
          const verificationRequest = await prisma.verificationRequest.create({
            data: {
              identifier: email,
              email: email,
              house_id: house_id,
              token: generateAuthToken({ email: email }),
              expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiration time to 1 week from now
            },
          });

          // Make a POST request to the email service to send the verification email
          const inviteData = {
            to: email,
            userToken: verificationRequest.token,
            inviterName: user.first_name,
          };

          await axios.post("https://savee-api.vercel.app/invite/", inviteData);
        });

        await Promise.all(verificationRequests);
      }

      const user_payment = await prisma.UserPayment.create({
        data: {
          payment_id: payment_id,
          payment_percentage: 0,
          user_id: user.user_id,
        },
      });

      // generate user token
      res.json({
        success: true,
        user_id: user.user_id,
        house_id: user.house_id,
        token: generateAuthToken(user),
      });
    }
  }
});

// login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // check if user exists
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) throw UnauthorizedError();

  // check if password is valid
  const isPwValid = await bcrypt.compare(password, user.password_hash);
  if (!isPwValid) throw UnauthorizedError();

  res.json({
    success: true,
    user: user,
    token: generateAuthToken(user),
  });
});

// logout user
router.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.json({
    success: true,
    message: "User logged out",
  });
});

//update user info
router.put("/:user_id", authenticate, (req, res) => {
  let data = req.body;
  res.send("user info added: " + JSON.stringify(data));
});

router.delete("/:user_id", authenticate, (req, res) => {
  let data = req.body;
  res.send("user deleted " + JSON.stringify(data));
});

router.get("/:user_id/task", authenticate, async function (req, res) {
  const { user_id } = req.params;
  const tasks = await prisma.userTask.findMany({
    where: {
      user_id: user_id,
    },
  });
  res.json(tasks);
  console.log(tasks);
});

router.post("/:user_id/task", authenticate, async function (req, res) {
  const { user_id } = req.params;
  const { start_time, end_time, duration, task } = req.body;
  const taskData = await prisma.userTask.create({
    data: {
      user_id: user_id,
      start_time: start_time,
      end_time: end_time,
      duration: parseInt(duration), // isto vai ser calculado aqui ou no frontend?
      task: task,
    },
  });
  res.json({
    success: true,
    task: taskData,
  });
});

router.get("/:user_id/task/:task_id", authenticate, async function (req, res) {
  const { user_id, task_id } = req.params;
  const task = await prisma.userTask.findFirst({
    where: {
      user_id: user_id,
      task_id: parseInt(task_id),
    },
  });
  res.json(task);
});

router.delete("/:user_id/task/:task_id", authenticate, (req, res) => {
  let data = req.body;
  res.send(`task ${req.params.task_id} deleted ` + JSON.stringify(data));
});

router.get("/:user_id/routine", authenticate, async function (req, res) {
  const { user_id } = req.params;
  const routines = await prisma.userRoutine.findMany({
    where: {
      user_id: user_id,
    },
  });
  res.json(routines);
});

router.get(
  "/:user_id/routine/:routine_id",
  authenticate,
  async function (req, res) {
    const { user_id, routine_id } = req.params;
    const routine = await prisma.userRoutine.findFirst({
      where: {
        user_id: user_id,
        routine_id: parseInt(routine_id),
      },
    });
    res.json(routine);
  }
);

router.post("/:user_id/routine", authenticate, async function (req, res) {
  const { user_id } = req.params;
  const { duration_routine, task, weekdays, period_time } = req.body;
  const routine = await prisma.userRoutine.create({
    data: {
      user_id: user_id,
      duration_routine: duration_routine, // em segundos
      creation_routine: new Date(),
      task: task,
      weekdays: weekdays,
      period_time: period_time,
    },
  });
  res.json({
    success: true,
    routine: routine,
  });
});

router.put("/:user_id/routine/:routine_id", authenticate, function (req, res) {
  let data = req.body;
  res.send(
    `user's ${req.params.routine_id}º routine updated: ${JSON.stringify(data)}`
  );
});

router.delete(
  "/:user_id/routine/:routine_id",
  authenticate,
  async (req, res) => {
    const { user_id, routine_id } = req.params;

    // Check if the routine exists
    const routine = await prisma.userRoutine.findMany({
      where: {
        user_id: user_id,
        routine_id: parseInt(routine_id),
      },
    });

    if (!routine) {
      // If the routine is not found, send an appropriate error response
      return res.status(404).json({ error: "Routine not found." });
    }

    // Delete the routine
    const deleteRoutine = await prisma.userRoutine.deleteMany({
      where: {
        user_id: user_id,
        routine_id: parseInt(routine_id),
      },
    });

    // Send a success response
    res.json({
      success: true,
      routine: routine_id,
      message: `Routine ${routine_id} deleted successfully.`,
    });
  }
);

router.get("/:user_id/payment", authenticate, async function (req, res) {
  const { user_id } = req.params;
  const payments = await prisma.userPayment.findMany({
    where: {
      user_id: user_id,
    },
    orderBy: {
      payment: {
        date_payment: "desc",
      },
    },
    include: {
      payment: {
        select: {
          date_payment: true,
          value_payment: true,
        },
      },
    },
  });
  res.json(payments);
});

router.get(
  "/:user_id/payment/date_payment",
  authenticate,
  async function (req, res) {
    const { user_id } = req.params;
    const date_payment = await prisma.userPayment.findFirst({
      where: {
        user_id: user_id,
      },
      orderBy: {
        payment: {
          date_payment: "desc",
        },
      },
      include: {
        payment: {
          select: {
            date_payment: true,
          },
        },
      },
    });
    res.json(date_payment);
  }
);

router.get(
  "/:user_id/payment/:payment_id",
  authenticate,
  async function (req, res) {
    const { user_id, payment_id } = req.params;
    const payment = await prisma.userPayment.findFirst({
      where: {
        user_id: user_id,
        payment_id: parseInt(payment_id), // aqui não tenho a crtz se é pelo id de pagamento referente (casa) ou pelo id do pagamento nesta tabela
      },
    });
    res.json(payment);
  }
);

router.get(
  "/:user_id/payment/:payment_id/insights",
  authenticate,
  async function (req, res) {
    const { user_id, payment_id } = req.params;
    const user_consumption = await prisma.consumptionHistory.findMany({
      where: {
        user_id: user_id,
      },
      include: {
        task: {
          select: {
            task: true,
            start_time: true,
            end_time: true,
          },
        },
        routine: {
          select: {
            duration_routine: true,
            task: true,
          },
        },
      },
    });

    let consumption = [];
    if (user_consumption) {
      consumption = user_consumption.filter(
        (consumption) => consumption.payment_id === parseInt(payment_id)
      );
    }

    const payment = await prisma.userPayment.findFirst({
      where: {
        user_id: user_id,
        payment_id: parseInt(payment_id),
      },
    });

    const insights = {
      payment: payment,
      consumption: consumption,
    };

    res.json(insights);
  }
);

// filter consumptions by task
router.get(
  "/:user_id/payment/:payment_id/insights/:task",
  authenticate,
  async function (req, res) {
    const { user_id, payment_id, task } = req.params;
    const user_consumption = await prisma.consumptionHistory.findMany({
      where: {
        user_id: user_id,
      },
      include: {
        task: {
          select: {
            task: true,
            start_time: true,
            end_time: true,
          },
        },
        routine: {
          select: {
            duration_routine: true,
            task: true,
          },
        },
      },
    });

    let consumption = [];
    if (user_consumption) {
      consumption = user_consumption.filter(
        (consumption) =>
          consumption.payment_id === parseInt(payment_id) &&
          ((consumption.task && consumption.task.task === parseInt(task)) ||
            (consumption.routine &&
              consumption.routine.task === parseInt(task)))
      );
    }

    const payment = await prisma.userPayment.findFirst({
      where: {
        user_id: user_id,
        payment_id: parseInt(payment_id),
      },
    });

    const insights = {
      payment: payment,
      consumption: consumption,
    };

    res.json(insights);
  }
);

module.exports = router;
