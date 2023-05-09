const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const prisma = require("../lib/prisma.js");
const crypto = require("crypto");
const router = express.Router();

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (!user) {
        return cb(null, false, {
          message: "Incorrect username or password.",
        });
      }

      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        function (err, hashedPassword) {
          if (err) {
            return cb(err);
          }
          if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
            return cb(null, false, {
              message: "Incorrect username or password.",
            });
          }
          return cb(null, user);
        }
      );
    } catch (err) {
      return cb(err);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.get("/login", async function (req, res, next) {
  res.render("login");
});

router.post(
  "/login/password",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/signup", function (req, res, next) {
  res.render("signup");
});

router.post("/signup", async function (req, res, next) {
  const { username, password } = req.body;
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(
    req.body.password,
    salt,
    310000,
    32,
    "sha256",
    async function (err, hashedPassword) {
      if (err) {
        return next(err);
      }
      try {
        const user = await prisma.user.create({
          data: {
            username,
            hashed_password: hashedPassword,
            salt,
          },
        });
        req.login(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.redirect("/");
        });
      } catch (err) {
        return next(err);
      }
    }
  );
});

module.exports = router;
