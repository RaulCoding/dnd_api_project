const spellInput = document.getElementById("spellInput");
const searchButton = document.getElementById("searchButton");
const spellResult = document.getElementById("spellName");
const spellLevel = document.getElementById("spellLevel");
const spellSchool = document.getElementById("spellSchool");
const spellDesc = document.getElementById("spellDesc");
const spellSchoolImg = document.getElementById("spellSchoolImg")

//CREAMOS EL EVENTO Y DENTRO DEL BUCLE IF SI EXISTE UN SPELLNAME SE EJECUTAN LAS FUNCIONES

searchButton.addEventListener("click", () => {
  let spellName = spellInput.value.toLowerCase().trim();
  if (spellName) {
    spellName = spellName.replace(/ /g, "-");
    clearResults();
    searchSpell(spellName);
  } else {
    alert("Spell type a spellName");
  }
});

//CREAMOS LAS FUNCIONES 1º UNA QUE LIMPIA LOS CAMPOS Y LUEGO LA PETICIÓN A LA API
function clearResults() {
  spellResult.innerHTML = "";
  spellLevel.innerHTML = "";
  spellSchool.innerHTML = "";
  spellDesc.innerHTML = "";
}

function searchSpell(spellName) {
  spellResult.innerHTML = "Searching...";

  fetch(`https://www.dnd5eapi.co/api/2014/spells/${spellName}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error is the request");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data Obteined", data);
      spellResult.innerHTML = data.name;
      spellLevel.innerHTML =  "Level: " + data.level;
      spellSchool.innerHTML = data.school.name;
      spellDesc.innerHTML = data.desc;

      switch (data.school.name.toLowerCase()) {
        case "evocation":
          spellSchoolImg.src = "../static/images/Evocation.png";
          spellSchoolImg.alt = "Evocation";
          break;
        case "illusion":
          spellSchoolImg.src = "../static/images/illusion.png";
          spellSchoolImg.alt = "Illusion";
          break;
        case "necromancy":
          spellSchoolImg.src = "../static/images/necromancy.png";
          spellSchoolImg.alt = "Necromancy";
          break;
        case "abjuration":
          spellSchoolImg.src = "../static/images/abjuration.png";
          spellSchoolImg.alt = "Abjuration";
          break;
        case "transmutation":
          spellSchoolImg.src = "../static/images/transmutation.png";
          spellSchoolImg.alt = "Transmutation";
          break;
        case "divination":
          spellSchoolImg.src = "../static/images/divination.png";
          spellSchoolImg.alt = "Divination";
          break;
        case "enchantment":
          spellSchoolImg.src = "../static/images/enchantment.png";
          spellSchoolImg.alt = "Enchantment";
          break;
          case "conjuration":
            spellSchoolImg.src = "../static/images/conjuration.png";
            spellSchoolImg.alt = "Conjuration";
            break;
        default:
          spellSchoolImg.src = "images/default.png"; 
          spellSchoolImg.alt = "Magic School";
          break;
      }

      document.getElementById("result").style.display = "block";
    })
    .catch((error) => {
      console.error("hubo un problema con la solicitud:", error);
      spellResult.innerHTML = "Error en la busqueda. Intenta de Nuevo";
    });
}
