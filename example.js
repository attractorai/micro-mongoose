const {send} = require('micro')
const {Schema} = require('mongoose')
const microMongoose = require('./')

const models = {
    User: {
        name: 'user',
        schema: new Schema({
            email: String,
            name: String,

            salt: String,
            password: String,

            created_at: { type: Date, default: Date.now },
            updated_at: { type: Date, default: Date.now },
        })
    }
}

const withMongoose = microMongoose({ models, database: 'mydb', branching: true })

const handler = async (req, res, { User }) => {
    const user = await User.findOne()
    send(res, 200, user)
}

module.exports = microMongoose(handler)
