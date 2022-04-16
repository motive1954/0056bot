const { passenger, Mongo } = require('./Global.Client');
const client = global.client = new passenger({ fetchAllMembers: true })

Mongo.Connect();
client.fetchEvents();

client.login(sistem.SECTOKENS.TWO);

