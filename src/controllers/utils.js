const axios = require("axios")
const {Pokemon, Type} = require("../db")

const getApiInfo = async () => {
    try {
        let api = await axios(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=40`).then(e => e.data.results)
        let prom = api.map(pokemon => pokemon.url)
        let join = prom.map(url => axios(url).then(e => e.data))
        join = await Promise.all(join)

        let finaljoin = join.map(e => {
            return {
                id: e.id,
                name: e.name,
                img: e.sprites.other.home.front_default,
                sprite: e.sprites.versions["generation-v"]["black-white"].animated.front_default,
                attack: e.stats[1].base_stat,
                defense : e.stats[2].base_stat,
                hp: e.stats[0].base_stat,
                speed: e.stats[5].base_stat,
                weight: e.weight,
                height: e.height,
                type: e.types.map((t) => t.type.name),
            }
        })
        return finaljoin
    }
    catch (error) {
        console.log("Something went wrong, ", error)
    }
}

const getDbInfo = async () => {
    try {
        let db = await Pokemon.findAll({
            include: {
                model: Type,
                attributes: ['name'],
                through: { attributes: []}
            }
        })
        db = db.map(p => {
            let types = p.types.map(t => t.name)
            return {
                id: p.id,
                name: p.name,
                img: p.img || "https://pm1.narvii.com/6166/de357461f3a370e586e7dd1e20ec4af46b268a47_hq.jpg",
                attack: p.attack,
                defense : p.defense,
                hp: p.hp,
                speed: p.speed,
                weight: p.weight,
                height: p.height,
                type: types,
            }
        })
        return db
    }
    catch (error) {
        console.log("Something went wrong, ", error)
    }
}

const getMixedInfo = async () => {

    try {
        let api1 = await getApiInfo()
        let db = await getDbInfo()
        let allinfo = Promise.all([...db, ...api1])
        return allinfo
    } catch (error) {
        console.log("Something went wrong, ", error)
    }
  }

const getTypes = async () => {
    try {
        let api = await axios("https://pokeapi.co/api/v2/type")
        let typesGet = api.data.results.map(e => e.name)
		return typesGet
    }
    catch (error) {
        console.log("Something went wrong, ", error)
    }
}

module.exports = {
    getMixedInfo,
    getDbInfo,
    getTypes,
}