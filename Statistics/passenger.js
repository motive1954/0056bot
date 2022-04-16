const { passenger, Mongo } = require('./Global.Client');
const { Stat, Monthly } = require('./Stat.Autoclean');
const client = global.client = new passenger({ fetchAllMembers: true })

Mongo.Connect();
client.fetchEvents();
Stat.Clean();
Monthly.System();

client.login(sistem.STATTOKEN);

