const {send} = require('micro')
const {Schema} = require('mongoose')
const withMongoose = require('./')

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

const handler = async (req, res, { User }) => {
    const user = await User.findOne()
    send(res, 200, user)
}

module.exports = withMongoose({ models, database: 'mydb', branching: true }, handler)
