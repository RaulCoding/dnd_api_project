document.addEventListener("DOMContentLoaded", () => {
  // Obtener elementos del DOM
  const searchButton = document.getElementById("searchSpellButton");
  const spellInput = document.getElementById("spellName");

  // Agregar evento de "Enter" al campo de texto
  spellInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      // Disparamos el clic del botón al presionar "Enter"
      searchButton.click();
    }
  });

  // Agregar evento de búsqueda por nombre al botón
  searchButton.addEventListener("click", async () => {
    const spellName = spellInput.value.trim();

    if (!spellName) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, ingresa el nombre de un hechizo.",
      });
      return;
    }

    try {
      const url = `http://localhost:3000/spells/${encodeURIComponent(
        spellName
      )}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Hechizo no encontrado");
      }

      const spell = await response.json();
      displaySpellDetails(spell);
    } catch (error) {
      console.error("Error al buscar el hechizo:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se encontró el hechizo.",
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    }
  });
});

// Función para mostrar los detalles de un hechizo
const displaySpellDetails = (spell) => {
  let spellDescDiv = document.querySelector(".spellDescDiv");
  const spellImgContainer = document.querySelector(".spellImgContainer");
  const spellTextContainer = document.querySelector(".spellTextContainer");
  spellDescDiv.style.height = "600px"; // Cambia el tamaño del desc div al pulsar

  let schoolImage = "";
  spellDescDiv.style.display = "block";

  // Asignar imagen según la escuela de magia
  const schoolImages = {
    abjuration: "../static/images/abjuration.png",
    conjuration: "../static/images/conjuration.png",
    divination: "../static/images/divination.png",
    enchantment: "../static/images/enchantment.png",
    evocation: "../static/images/Evocation.png",
    illusion: "../static/images/illusion.png",
    necromancy: "../static/images/necromancy.png",
    transmutation: "../static/images/transmutation.png",
  };

  schoolImage = schoolImages[spell.school.index] || "";

  // Mostrar imagen de la escuela
  spellImgContainer.innerHTML = schoolImage
    ? `<img id="spellImage" src="${schoolImage}" alt="School Icon">`
    : "";

  // Mostrar detalles del hechizo
  spellTextContainer.innerHTML = `
          <h2>${spell.name}</h2>
          <p><strong>Level:</strong> ${spell.level}</p>
          <p><strong>School:</strong> ${spell.school.name}</p>
          <p><strong>Duration:</strong> ${spell.duration}</p>
          <p><strong>Casting Time:</strong> ${spell.casting_time}</p>
          <p><strong>Range/Area:</strong> ${spell.range}</p>
          <p><strong>Components:</strong> ${spell.components.join(", ")}</p>
          <p><strong>Description:</strong> ${spell.desc.join("<br>")}</p>
      `;
};
