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
const microMongoose = require('@attractor/micro-mongoose')

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

module.exports = withMongoose(handler)
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

Exported method `withMongoose` has the following options:
* `models` an object containing a properly formatted dictionary of mongoose schemes
* `database` string with database name
* `branching` in case you are using ZEIT's `now`, you can enable branching so prefixes would be added to the database names; Any given deployment from `master` branch will have a `live-` prefixed added to the database name, in any other case prefix will be `staging-`.
