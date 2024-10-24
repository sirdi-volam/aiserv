import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "15d" });

  res.cookie("jwt-ainai", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 дней в MS
    httpOnly: true, // Предотвратить атаки xss атаки сценария сценариев, сделайте их не доступным JS
    sameSite: "strict", // CSRF атакует атаки подделки по перекрестному запросу
    secure: ENV_VARS.NODE_ENV !== "development",
  });

  return token;
};