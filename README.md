# micro-mongoose

A simple package that allows you to use mongoose with micro.

## Installation

```sh
$ npm i @attractor/micro-mongoose --save
```

## Usage

```js
const {send} = require('micro')
const {Schema} = require('mongoose')
const withMongoose = require('@attractor/micro-mongoose')

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
```

and run locally via

```sh

$ MONGO_HOST=mongodb://localhost node index.js
```

or deploy with ZEIT's `now`

```sh

now -e MONGO_HOST=mongodb://someremote.mongodb.host:11111
```

## Details

Exported method `withMongoose` consists of 2 arguments: options and handler.

 * `handler` is the micro function that you will use to handle the http request with.
 * `options` is an object that has following parameters:
    * `models` an object containing a properly formatted dictionary of mongoose schemes
    * `database` string with database name
    * `branching` in case you are using ZEIT's `now`, you can enable branching so prefixes would be added to the database names;
        On a now deployment from master branch prefix will be `live-`, in any other case prefix will be `staging-`.
