const MOVIES_GRID = `http://localhost:3001/movies/grid`;
const MOVIES_HISTORY = `http://localhost:3002/movies/history`;
const RECOMENDATIONS = `http://localhost:3003/recomendation`;

async function obtenerPeliculas() {
  try {
    const response = await fetch(MOVIES_GRID);
    const data = await response.json();

    mostrarPeliculas(data);
  } catch (error) {
    console.error("Error al obtener las películas:", error);
  }
}

async function obtenerRecomendaciones() {
  try {
    const response = await fetch(RECOMENDATIONS);
    const data = await response.json();

    mostrarRecomendaciones(data);
  } catch (error) {
    console.error("Error al obtener las películas:", error);
  }
}

function mostrarPeliculas(peliculas) {
  const contenedor = document.getElementById("movie-container");

  contenedor.innerHTML = "";

  peliculas.forEach((pelicula) => {
    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.addEventListener("click", async () => {
      const response = await fetch(MOVIES_HISTORY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          id: pelicula._id,
          title: pelicula.title,
        }),
      });

      mostrarDetalles(pelicula);
    });

    const imagen = pelicula.poster;

    card.innerHTML = `
        <img src="${imagen}" alt="${pelicula.title}">
        <div class="info">
          <h3 class="title">${
            pelicula.title + " " + "(" + pelicula.year + ")"
          }</h3>
          <p class="overview">${
            pelicula.plot
              ? pelicula.plot.slice(0, 64) + "..."
              : "Sin descripción disponible"
          }</p>
        </div>
      `;

    contenedor.appendChild(card);
  });
}

function mostrarRecomendaciones(pelicula) {
  const contenedor = document.getElementById("movie-recomendations");

  contenedor.innerHTML = "";

  const card = document.createElement("div");
  card.classList.add("movie-card");
  card.addEventListener("click", async () => {
    mostrarDetalles(pelicula);
  });

  const imagen = pelicula.poster;
  card.innerHTML = `
      <img src="${imagen}" alt="${pelicula.title}">
      <div class="info">
        <h3 class="title">${
          pelicula.title + " " + "(" + pelicula.year + ")"
        }</h3>
        <p class="overview">${
          pelicula.plot
            ? pelicula.plot.slice(0, 64) + "..."
            : "Sin descripción disponible"
        }</p>
      </div>
    `;

  contenedor.appendChild(card);
}

// Función para manejar el evento de clic y mostrar detalles de la película en un modal
function mostrarDetalles(pelicula) {
  // Obtener los elementos del modal
  const modal = document.getElementById("movie-modal");
  const titleElement = document.getElementById("modal-title");
  const descriptionElement = document.getElementById("modal-description");
  const closeModalButton = document.getElementById("close-modal");

  // Rellenar los detalles de la película en el modal
  titleElement.textContent = pelicula.title;
  descriptionElement.textContent =
    pelicula.plot || "Sin descripción disponible";

  // Mostrar el modal
  modal.style.display = "block";

  // Cerrar el modal cuando se haga clic en la "X"
  closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Cerrar el modal si el usuario hace clic fuera del modal
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}

// Llamar a la función para obtener las películas al cargar la página
window.onload = () => {
  obtenerPeliculas();
  obtenerRecomendaciones();

  setInterval(obtenerRecomendaciones, 120000);
};
