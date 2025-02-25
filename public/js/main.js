document.addEventListener("DOMContentLoaded", function() {
    // 📌 Edit Movie Modalni chaqirish
    const editMovieModal = new bootstrap.Modal(document.getElementById("edit-movie-modal"));
    const editForm = document.getElementById("edit-movie-form");

    // 🎬 Kino tahrirlash tugmalarini ishlatish
    document.querySelectorAll(".edit-movie").forEach(button => {
        button.addEventListener("click", function() {
            const movieId = this.getAttribute("data-id");

            fetch(`/getMovie/${movieId}`)
                .then(response => response.json())
                .then(movie => {
                    document.getElementById("edit-movie-id").value = movie._id;
                    document.getElementById("edit-title").value = movie.title;
                    document.getElementById("edit-director").value = movie.director;
                    document.getElementById("edit-year").value = movie.year;
                    
                    editMovieModal.show();
                })
                .catch(error => console.error("Xatolik:", error));
        });
    });

    // 💾 Kino tahrirlashni saqlash
    editForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const movieId = document.getElementById("edit-movie-id").value;
        const updatedMovie = {
            title: document.getElementById("edit-title").value,
            director: document.getElementById("edit-director").value,
            year: document.getElementById("edit-year").value,
        };

        fetch(`/updateMovie/${movieId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedMovie)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("✅ Kino muvaffaqiyatli tahrirlandi!");
                location.reload();
            } else {
                alert("❌ Xatolik yuz berdi!");
            }
        })
        .catch(error => console.error("Xatolik:", error));
    });

    // 🗑 Kino o‘chirish
    document.querySelectorAll(".delete-movie").forEach(button => {
        button.addEventListener("click", function() {
            const movieId = this.getAttribute("data-id");
            const confirmation = confirm("🗑 Ushbu kinoni o‘chirishni tasdiqlaysizmi?");
            
            if (confirmation) {
                fetch(`/deleteMovie/${movieId}`, {
                    method: "DELETE",
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("✅ Kino muvaffaqiyatli o‘chirildi!");
                        location.reload(); // Sahifani yangilash
                    } else {
                        alert("❌ Xatolik yuz berdi! Kino o‘chirishni qayta urinib ko‘ring.");
                    }
                })
                .catch(error => {
                    console.error("Xatolik:", error);
                    alert("❌ Kino o‘chirishda xatolik yuz berdi!");
                });
            }
        });
    });
});
