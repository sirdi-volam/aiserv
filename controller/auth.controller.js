import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export async function signup(req, res) {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ success: false, message: "Все поля обязательны для заполнения" });
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Неверный формат почты" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Пароль должен быть не менее 6 символов" });
    }

    const existingUserByEmail = await User.findOne({ email: email });

    if (existingUserByEmail) {
      return res.status(400).json({ success: false, message: "Электронная почта уже существует" });
    }

    const existingUserByUsername = await User.findOne({ username: username });

    if (existingUserByUsername) {
      return res.status(400).json({ success: false, message: "Имя пользователя уже существует" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      image,
    });

    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      success: true,
      user: {
        ...newUser._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log("Ошибка в контроллере регистрации", error.message);
    res.status(500).json({ success: false, message: "Внутренняя ошибка сервера" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Все поля обязательны для заполнения" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Неверные учётные данные" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Неверные учётные данные" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log("Ошибка в контроллере входа в систему", error.message);
    res.status(500).json({ success: false, message: "Внутренняя ошибка сервера" });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("jwt-ainai");
    res.status(200).json({ success: true, message: "Успешный выход" });
  } catch (error) {
    console.log("Ошибка в контроллере входа в систему", error.message);
    res.status(500).json({ success: false, message: "Внутренняя ошибка сервера" });
  }
}

export async function authCheck(req, res) {
  try {
    console.log("req.user:", req.user);
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.log("Ошибка в контроллере Authcheck", error.message);
    res.status(500).json({ success: false, message: "Внутренняя ошибка сервера" });
  }
}