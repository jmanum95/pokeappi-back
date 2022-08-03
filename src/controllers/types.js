const {Type} = require("../db")
const {getTypes} = require("./utils")

const getAllTypes = async (req, res) => {
    try {
        const types = await getTypes()
        types.forEach(async t => {
            if(t) {
                await Type.findOrCreate({
                    where: {name : t}
                })
            }
        })
        const allTypes = await Type.findAll()
        res.status(200).send(allTypes)
    }
    catch (error) {
        console.log("Something went wrong, ", error)
    }
}

const _server_getAllTypes = async (req, res) => {
    try {
        const types = await getTypes()
        types.forEach(async t => {
            if(t) {
                await Type.findOrCreate({
                    where: {name : t}
                })
            }
        })
        const allTypes = await Type.findAll()
    }
    catch (error) {
        console.log("Something went wrong, ", error)
    }
}

module.exports = {
    getAllTypes,
    _server_getAllTypes
}