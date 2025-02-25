const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// 📌 Ro‘yxatdan o‘tish (signup)
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Foydalanuvchini tekshirish
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("❌ Bu email bilan foydalanuvchi allaqachon mavjud!");
        }

        // Parolni hash qilish
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.redirect("/login"); // Ro‘yxatdan o‘tganidan keyin login sahifasiga yo‘naltirish
    } catch (error) {
        console.log("Signup xatolik:", error);
        res.status(500).send("❌ Ro‘yxatdan o‘tishda xatolik yuz berdi!");
    }
});

// 📌 Login (kirish)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send("❌ Email yoki parol noto‘g‘ri!");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("❌ Email yoki parol noto‘g‘ri!");
        }

        req.session.user = user; // Sessiyaga foydalanuvchini saqlash
        res.redirect("/"); // Bosh sahifaga yo‘naltirish
    } catch (error) {
        console.log("Login xatolik:", error);
        res.status(500).send("❌ Kirishda xatolik yuz berdi!");
    }
});

// 📌 Logout (chiqish)
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login"); // Login sahifasiga qaytarish
    });
});

module.exports = router;
