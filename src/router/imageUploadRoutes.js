const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinaryConfig"); // Mengimpor konfigurasi Cloudinary
const db = require("../config/database"); // Mengimpor konfigurasi basis data

// Rute untuk mengunggah gambar ke Cloudinary
router.post("/upload", (req, res) => {
  // Menggunakan cloudinary.v2.uploader untuk mengunggah gambar ke Cloudinary
  cloudinary.uploader.upload(req.file.path, (error, result) => {
    if (error) {
      return res.status(500).json({ error: "Gagal mengunggah gambar ke Cloudinary" });
    }

    const imageUrl = result.url;

    // Simpan URL gambar ke dalam database (contoh: tabel "recipe")
    const recipeId = req.body.recipeId; // Sesuaikan dengan cara Anda mengirimkan ID resep

    const updateQuery = "UPDATE recipe SET image_url = $1 WHERE id = $2";

    db.query(updateQuery, [imageUrl, recipeId])
      .then(() => {
        res.json({ imageUrl });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Gagal menyimpan URL gambar di basis data" });
      });
  });
});

module.exports = router;
