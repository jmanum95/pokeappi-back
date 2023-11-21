const { default: axios } = require("axios");
const { Pokemon, Type } = require("../db");
const { getMixedInfo, getDbInfo } = require("./utils");

const getAllPokemons = async (req, res) => {
  try {
    const { name } = req.query;
    if (name) {
      const pokeResp = await axios(
        `https://pokeapi.co/api/v2/pokemon/${name}`
      ).then((poke) => {
        return {
          id: poke.data.id,
          name: poke.data.name,
          img:
            poke.data.sprites.other.home.front_default ||
            e.sprites.other["official-artwork"].front_default,
          attack: poke.data.stats[1].base_stat,
          defense: poke.data.stats[2].base_stat,
          hp: poke.data.stats[0].base_stat,
          speed: poke.data.stats[5].base_stat,
          weight: poke.data.weight,
          height: poke.data.height,
          type: poke.data.types.map((t) => t.type.name),
        };
      });
      res.status(200).send(pokeResp);
    } else {
      let allPokemons = await getMixedInfo();
      res.status(200).send(allPokemons);
    }
  } catch (error) {
    if (error.response.status && error.response.statusText) {
      res.status(error.response.status).send(error.response.statusText);
    } else {
      res.status(500).send("unhandled error");
    }
  }
};

const postPokemon = async (req, res) => {
  const { name, img, attack, defense, hp, speed, weight, height, type } =
    req.body;
  try {
    let newPokemon = await Pokemon.create({
      name,
      img,
      attack,
      defense,
      hp,
      speed,
      weight,
      height,
    });
    let typeDb = await Type.findAll({
      where: { name: type },
    });
    newPokemon.addType(typeDb);

    res.status(201).send("successful creation");
  } catch (error) {
    if (error.response.status && error.response.statusText) {
      res.status(error.response.status).send(error.response.statusText);
    } else {
      res.status(500).send("unhandled error");
    }
  }
};

const getOnePokemon = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (id) {
      let pokemon = await axios(`https://pokeapi.co/api/v2/pokemon/${id}`).then(
        (e) => e.data
      );
      let finaljoin = {
        id: pokemon.id,
        name: pokemon.name,
        img: pokemon.sprites.other.home.front_default,
        sprite:
          pokemon.sprites.versions["generation-v"]["black-white"].animated
            .front_default,
        attack: pokemon.stats[1].base_stat,
        defense: pokemon.stats[2].base_stat,
        hp: pokemon.stats[0].base_stat,
        speed: pokemon.stats[5].base_stat,
        weight: pokemon.weight,
        height: pokemon.height,
        type: pokemon.types.map((t) => t.type.name),
      };
      res.status(200).send(finaljoin);
    } else {
      const dbAndApi = await getDbInfo();
      let oneGuy = dbAndApi.filter((e) => e.id === req.params.id);
      res.status(200).send(...oneGuy);
    }
  } catch (error) {
    if (error.response.status && error.response.statusText) {
      res.status(error.response.status).send(error.response.statusText);
    } else {
      res.status(500).send("unhandled error");
    }
  }
};

const deletePokemon = async (req, res) => {
  try {
    const oneGuy = await Pokemon.findOne({
      where: { id: req.body.id },
    });
    await oneGuy.destroy();
    res.status(200).send("Deleted");
  } catch (error) {
    if (error.response.status && error.response.statusText) {
      res.status(error.response.status).send(error.response.statusText);
    } else {
      res.status(500).send("unhandled error");
    }
  }
};

const updatePokemon = async (req, res) => {
  const { name, img, attack, defense, hp, speed, weight, height } = req.body;
  try {
    const oneGuy = await Pokemon.findOne({
      where: { id: req.body.id },
    });
    await oneGuy.update({
      name,
      img,
      attack,
      defense,
      hp,
      speed,
      weight,
      height,
    });
    res.status(200).send("Updated");
  } catch (error) {
    if (error.response.status && error.response.statusText) {
      res.status(error.response.status).send(error.response.statusText);
    } else {
      res.status(500).send("unhandled error");
    }
  }
};

module.exports = {
  getAllPokemons,
  postPokemon,
  getOnePokemon,
  deletePokemon,
  updatePokemon,
};
