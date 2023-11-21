const express = require("express");
const router = express.Router();
const {
  getAllPokemons,
  postPokemon,
  getOnePokemon,
  deletePokemon,
  updatePokemon,
} = require("../controllers/pokemons");

router.get("/", getAllPokemons);
router.post("/", postPokemon);
router.put("/", updatePokemon);
router.delete("/", deletePokemon);
router.get("/:id", getOnePokemon);

module.exports = router;
