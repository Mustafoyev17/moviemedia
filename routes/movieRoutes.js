const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie"); // Kino modeli

// 📌 Barcha kinolarni olish
router.get("/movies/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: "Kino topilmadi!" });
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: "Xatolik yuz berdi!" });
    }
});


// 📌 Kino qo‘shish
router.post("/add", async (req, res) => {
    try {
        const { title, director, year, video } = req.body;
        const newMovie = new Movie({ title, director, year, video });
        await newMovie.save();
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ message: "Kino qo‘shishda xatolik!" });
    }
});

// 📌 Kino yangilash
router.put("/updateMovie/:id", async (req, res) => {
    try {
        const { title, director, year } = req.body;

        // Agar maydonlar bo‘sh bo‘lsa, xatolik qaytarish
        if (!title || !director || !year) {
            return res.status(400).json({ message: "Barcha maydonlarni to‘ldiring!" });
        }

        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            { title, director, year },
            { new: true }
        );

        if (!updatedMovie) {
            return res.status(404).json({ message: "Bunday kino topilmadi!" });
        }

        res.json({ success: true, message: "Kino muvaffaqiyatli yangilandi!", updatedMovie });
    } catch (error) {
        res.status(500).json({ message: "Tahrirlashda xatolik yuz berdi!" });
    }
});


// 📌 Kino o‘chirish
router.delete("/deleteMovie/:id", async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) {
            return res.status(404).json({ success: false, message: "Bunday kino topilmadi" });
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Kino o‘chirishda xatolik!" });
    }
});

module.exports = router;
