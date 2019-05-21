const mongoose = require('mongoose')
mongoose.Promise = global.Promise

if (!process.env.MONGO_HOST) {
    console.log('[mongoose] env MONGO_HOST is not set, falling back to localhost')
    process.env.MONGO_HOST = 'mongodb://localhost'
}

const exportModels = (models) => {
    const map = {}

    Object.keys(models).map(modelName => {
        const model = models[modelName];

        try {
            map[modelName] = mongoose.model(model.name);
        } catch (e) {
            map[modelName] = mongoose.model(model.name, model.schema);
        }
    })

    return map;
}

const withMongoose = (options = {}) => handler => async (req, res, ...restArgs) => {
    const state = mongoose.STATES[mongoose.connection.readyState];
    const connected = state == "connected";

    if (!connected) {
        const isStaging = process.env.NOW_GITHUB_COMMIT_REF !== 'master';
        const databasePrefix = isStaging ? 'staging' : 'live';
        const databaseName = options.branching ? `${databasePrefix}-${options.database}` : options.database;

        try {
            const uri = `${process.env.MONGO_HOST}/${databaseName}?retryWrites=true`;
            await mongoose.connect(uri, { useNewUrlParser: true });

            console.log('[mongoose] connected to mongodb! 😃🔥')
        } catch (e) {
            console.error('[mongoose] failed to connect to mongodb 😕💥 ')
            console.error(e)
        }
    }

    restArgs.push(exportModels(options.models))

    return handler(req, res, ...restArgs)
}

module.exports = withMongoose;
