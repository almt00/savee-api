import { verify, decode } from "jsonwebtoken";
const prisma = require("../lib/prisma.js");
import { error } from "../utils/apiResponse";

export default async function authMiddleware(req, res, next) {
  let token;

  // Retirar o token do header do request ou das cookies
  if (req.headers.authorization) {
    token =
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer" &&
      req.headers.authorization.split(" ")[1];
  } else {
    token = req.cookies.authorization;
  }

  if (!token) {
    res.status(401).send(error("Unauthorized", 401));
    return;
  }

  try {
    // validação se o token é valido
    const isValid = verify(token, env.TOKEN_SECRET);
    if (!isValid) {
      res.status(401).send(error("Unauthorized", 401));
      return;
    }

    // se for válido extraímos a data
    const { sub: userId, exp } = await decode(token);

    if (exp <= Math.floor(Date.now() / 1000)) {
      res.status(401).send(error("Unauthorized", 401));
      return;
    }

    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      res.status(401).send(error("Unauthorized", 401));
      return;
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(401).send(error("Unauthorized", 401));
  }
}
