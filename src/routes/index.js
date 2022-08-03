const { Router } = require('express'); 
const router = Router();

const pokemons = require("./pokemons")
const types = require("./types")

router.use("/pokemons", pokemons)
router.use("/types", types)

module.exports = router;

