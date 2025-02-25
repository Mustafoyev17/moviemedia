const Movie = require("../models/Movie");

// Barcha kinolarni olish
exports.getMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.render("index", { movies });
    } catch (error) {
        res.status(500).send("Serverda xatolik");
    }
};

// Yangi kino qo‘shish
exports.addMovie = async (req, res) => {
    try {
        const { title, director, year } = req.body;
        const newMovie = new Movie({ title, director, year });
        await newMovie.save();
        res.redirect("/");
    } catch (error) {
        res.status(500).send("Serverda xatolik");
    }
};
