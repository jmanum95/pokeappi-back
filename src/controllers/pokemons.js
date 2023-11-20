const { default: axios } = require("axios")
const {Pokemon, Type} = require("../db")
const {getMixedInfo, getDbInfo} = require("./utils")

const getAllPokemons = async (req, res) => {
    try {
        const {name} = req.query
        if(name){
            let allPokemons = await axios("https://pokeapi.co/api/v2/pokemon?limit=10").then(e => e.data.results)
            let filtered = allPokemons.filter(e => e.name.includes(name)).map(e => e.url)
            let promised = filtered.map(url => axios(url).then(e => e.data))
            promised = await Promise.all(promised)
            let finaljoin = promised.map(e => {
                return {
                    id: e.id,
                    name: e.name,
                    img: e.sprites.other.home.front_default || e.sprites.other["official-artwork"].front_default,
                    attack: e.stats[1].base_stat,
                    defense : e.stats[2].base_stat,
                    hp: e.stats[0].base_stat,
                    speed: e.stats[5].base_stat,
                    weight: e.weight,
                    height: e.height,
                    type: e.types.map((t) => t.type.name),
                }
            })
            res.status(200).send(finaljoin)
        }
        else {
            let allPokemons = await getMixedInfo()
            res.status(200).send(allPokemons)
        } 
    } catch (error) {
        console.log("Something went wrong, ", error)
    }
}


const postPokemon = async (req, res) => {
    const {name, img, attack, defense, hp, speed, weight, height, type } = req.body
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
        })
        let typeDb = await Type.findAll({
            where: {name: type}
        })
        newPokemon.addType(typeDb)

        res.status(201).send("Exito")
    }
    catch (error) {
        console.log("Something went wrong, ", error)
    }
}

const getOnePokemon = async (req, res) => {
    try {
        const id = Number(req.params.id)
        if(id){
            let pokemon = await axios(`https://pokeapi.co/api/v2/pokemon/${id}`).then(e => e.data)
            let finaljoin ={
                    id: pokemon.id,
                    name: pokemon.name,
                    img: pokemon.sprites.other.home.front_default,
                    sprite: pokemon.sprites.versions["generation-v"]["black-white"].animated.front_default,
                    attack: pokemon.stats[1].base_stat,
                    defense : pokemon.stats[2].base_stat,
                    hp: pokemon.stats[0].base_stat,
                    speed: pokemon.stats[5].base_stat,
                    weight: pokemon.weight,
                    height: pokemon.height,
                    type: pokemon.types.map((t) => t.type.name),
                }
            res.status(200).send(finaljoin)
        }
        else {
            const dbAndApi = await getDbInfo()
            let oneGuy = dbAndApi.filter(e => e.id === req.params.id)
            res.status(200).send(...oneGuy)
        } 
    }
    catch (error) {
        console.log("Something went wrong, ", error)
    }
}

const deletePokemon = async (req, res) => {
    try {
        const oneGuy = await Pokemon.findOne({
            where: { id : req.body.id}
        })
        await oneGuy.destroy()
        res.send("Deleted")
    }
    catch (error) {
        console.log("Something went wrong, ", error)
    }
}

const updatePokemon = async (req, res) => {
    const {name, img, attack, defense, hp, speed, weight, height} = req.body
    try {
        const oneGuy = await Pokemon.findOne({
            where: { id : req.body.id}
        })
        await oneGuy.update({
            name,
            img,
            attack,
            defense,
            hp,
            speed,
            weight,
            height,
        })
        res.send("Updated")
    }
    catch (error) {
        console.log("Something went wrong, ", error)
    }
}

module.exports = {
    getAllPokemons,
    postPokemon,
    getOnePokemon,
    deletePokemon,
    updatePokemon,
}
