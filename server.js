const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
const session = require("express-session");
const Movie = require("./models/Movie"); // Kino modeli
const movieRoutes = require("./routes/movieRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config(); // ✅ `.env` ni yuklash birinchi bo‘lishi kerak

const app = express();
const PORT = process.env.PORT || 5000;

// 📌 MongoDBga ulanish
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDBga ulanish muvaffaqiyatli!"))
  .catch(err => console.log("❌ MongoDB xatosi:", err));

// 📌 Session sozlash (Routerlardan oldin bo‘lishi kerak!)
app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true
}));

// 📌 Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON formatini o‘qish uchun

// 📌 Routerlarni ulash (Middlewarelardan keyin!)
app.use("/", authRoutes);
app.use("/", movieRoutes);

// 📌 Signup sahifasi
app.get("/signup", (req, res) => {
    res.render("signup");
});

// 📌 Qidiruv marshruti
app.get("/search", async (req, res) => {
    try {
        const query = req.query.q; // Foydalanuvchi yozgan qidiruv so‘zi
        const movies = await Movie.find({ title: { $regex: query, $options: "i" } }); // Case-insensitive qidiruv
        res.render("index", { movies });
    } catch (error) {
        res.status(500).send("❌ Qidiruvda xatolik yuz berdi!");
    }
});

// 📌 Asosiy sahifa
app.get("/", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.render("index", { movies });
    } catch (error) {
        res.status(500).send("❌ Xatolik yuz berdi!");
    }
});

// 📌 Kino qo‘shish sahifasi
app.get("/addMovie", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    res.render("addMovie");
});

// 📌 Kino tomosha qilish sahifasi
app.get("/watch/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.render("watch", { movie });
    } catch (error) {
        res.status(500).send("❌ Kino topilmadi!");
    }
});

// 📌 Multer sozlamalari (Videolarni saqlash)
const storage = multer.diskStorage({
    destination: "public/uploads",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Fayl nomiga vaqtni qo‘shish
    }
});
const upload = multer({ storage });

// 📌 Kino qo‘shish marshruti
app.post("/add", upload.single("videoFile"), async (req, res) => {
    try {
        const { title, director, year } = req.body;
        const videoPath = req.file ? `/uploads/${req.file.filename}` : null;

        const newMovie = new Movie({ title, director, year, video: videoPath });
        await newMovie.save();

        res.redirect("/");
    } catch (err) {
        console.log("❌ Xatolik:", err);
        res.status(500).send("Kino qo‘shishda xatolik!");
    }
});

// 📌 Kino o‘chirish marshruti
app.delete("/deleteMovie/:id", async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Xatolik yuz berdi!" });
    }
});

// 📌 Serverni ishga tushirish
app.listen(PORT, () => {
    console.log(`🚀 Server ishga tushdi: http://localhost:${PORT}`);
});
