document.addEventListener("DOMContentLoaded", () => {
  // Obtener los elementos del DOM
  const searchListButton = document.getElementById("searchListButton");
  const damageTypeInput = document.getElementById("damage-type");
  const levelInput = document.getElementById("spell-level");
  const schoolInput = document.getElementById("spell-school");
  const classInput = document.getElementById("spellcaster-class");

  // Agregar el evento de click al botón
  searchListButton.addEventListener("click", async () => {
    const damageType =
      damageTypeInput.value !== "noType" ? damageTypeInput.value : "";
    const level = levelInput.value !== "noLevel" ? levelInput.value : "";
    const school = schoolInput.value !== "noSchool" ? schoolInput.value : "";
    const spellClass = classInput.value !== "noClass" ? classInput.value : "";

    try {
      // Crear la URL base para hacer la solicitud
      const url = new URL("http://localhost:3000/spells");

      // Crear un objeto con los parámetros de la búsqueda
      const params = {
        damageType: damageType || undefined,
        level: level || undefined,
        school: school || undefined,
        spellClass: spellClass || undefined,
      };

      // Eliminar los parámetros undefined
      Object.keys(params).forEach(
        (key) => params[key] === undefined && delete params[key]
      );

      // Agregar los parámetros a la URL correctamente con URLSearchParams
      url.search = new URLSearchParams(params).toString();

      // Hacer la solicitud al servidor con los parámetros
      const response = await fetch(url.toString());
      const spells = await response.json();

      // Procesar los hechizos y mostrarlos en la interfaz
      displaySpells(spells);
    } catch (error) {
      console.error("Error al buscar hechizos:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al buscar hechizos",
      });
    }
  });
});

// Función para mostrar los hechizos en el HTML
const displaySpells = (spells) => {
  const spellListContainer = document.querySelector(".spellList");
  spellListContainer.style.display = "block";
  spellListContainer.innerHTML = ""; // Limpiar la lista antes de mostrar los nuevos resultados

  if (spells.length === 0) {
    spellListContainer.innerHTML =
      "<p>No se encontraron hechizos con esos filtros.</p>";
    return;
  }

  // Recorrer los hechizos y agregarlos a la lista
  spells.forEach((spell) => {
    const spellItem = document.createElement("div");
    spellItem.classList.add("spellItem");
    spellItem.innerHTML = `
            <h3>${spell.name}</h3>
            <p><strong>Level:</strong> ${spell.level}</p>
            <p><strong>School:</strong> ${spell.school.name}</p>
            <p><strong>Damage Type:</strong> ${
              spell.damage?.damage_type?.name || "No aplica"
            }</p>
        `;

    // Agregar evento de click para mostrar los detalles del hechizo
    spellItem.addEventListener("click", () => {
      displaySpellDetails(spell); // Función que muestra los detalles en el tercer div
    });

    spellListContainer.appendChild(spellItem);
  });
};

// Función para mostrar los detalles de un hechizo en el div de detalles
const displaySpellDetails = (spell) => {
  const spellDescDiv = document.querySelector(".spellDescDiv");
  const spellImgContainer = document.querySelector(".spellImgContainer");
  const spellTextContainer = document.querySelector(".spellTextContainer");
  let schoolImage = "";
  spellDescDiv.style.display = "block";
  switch (spell.school.name.toLowerCase()) {
    case "abjuration":
      schoolImage = "../static/images/abjuration.png";
      break;
    case "conjuration":
      schoolImage = "../static/images/conjuration.png";
      break;
    case "divination":
      schoolImage = "../static/images/divination.png";
      break;
    case "enchantment":
      schoolImage = "../static/images/enchantment.png";
      break;
    case "evocation":
      schoolImage = "../static/images/Evocation.png";
      break;
    case "illusion":
      schoolImage = "../static/images/illusion.png";
      break;
    case "necromancy":
      schoolImage = "../static/images/necromancy.png";
      break;
    case "transmutation":
      schoolImage = "../static/images/transmutation.png";
  }
  spellImgContainer.innerHTML = `
        <img id="spellImage" src="${schoolImage}" alt="School Icon">
    `;
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
