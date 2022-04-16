const { passenger, Mongo } = require('./Dist.Main.Client');
const client = global.client = new passenger({ fetchAllMembers: true })

client.fetchCommands()
client.fetchEvents()
Mongo.Connect();

client.login(sistem.SECTOKENS.DISTMAIN);

