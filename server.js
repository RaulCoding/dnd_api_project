const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());


app.use(express.static(path.join(__dirname, 'public')));

// Variable en memoria para almacenar los hechizos
let allSpells = [];

// Función para cargar los hechizos desde la API externa
const fetchSpells = async () => {
    try {
        const response = await axios.get("https://www.dnd5eapi.co/api/spells");
        const spellList = response.data.results;

        // Obtener detalles de cada hechizo
        const spellDetails = await Promise.all(
            spellList.map(spell => axios.get(`https://www.dnd5eapi.co${spell.url}`))
        );

        // Guardamos los hechizos en memoria
        allSpells = spellDetails.map(spell => spell.data);
        console.log("🔄 Hechizos cargados correctamente.");
    } catch (error) {
        console.error("❌ Error al cargar los hechizos:", error);
    }
};

// Cargar los hechizos al iniciar el servidor
fetchSpells();

// Ruta para obtener los hechizos con filtros
app.get("/spells", (req, res) => {
    const { damageType, level, school, spellClass } = req.query;

    const filteredSpells = allSpells.filter(spell => {
        let matches = true;

        if (damageType && spell.damage?.damage_type?.index !== damageType) {
            matches = false;
        }
        if (level && parseInt(spell.level) !== parseInt(level)) {
            matches = false;
        }
        if (school && spell.school?.index !== school) {
            matches = false;
        }
        if (spellClass && !spell.classes.some(c => c.index === spellClass)) {
            matches = false;
        }

        return matches;
    });

    res.json(filteredSpells);
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
