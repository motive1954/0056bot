const { Client, Collection, GuildMember, Guild, MessageEmbed, Message } = require('discord.js');
const fs = require('fs')
const moment = require('moment');
require("moment-duration-format");
require("moment-timezone");
const ms = require('ms');
const dataLimit = new Map()
const mongoose = require('mongoose');
class passenger extends Client {
    constructor(options) {
        super(options);

            // Sistem Gereksinimi
                this.ayarlar = global.ayarlar = require('../Moderation/passenger/Settings/_extends');
                this.kanalar = global.kanallar = require('../Moderation/passenger/Settings/_channels.json');
                this.emojiler = global.emojiler = require('../Moderation/passenger/Settings/_emojis.json');
                this.roller = global.roller = require('../Moderation/passenger/Settings/_roles.json');
                this.sistem = global.sistem = require('../Moderation/passenger/Settings/system');
                this.cevaplar = global.cevaplar = require('../Moderation/passenger/Settings/reply');
                this.uPConf = global.uPConf = this.StConf = global.StConf = require('../Moderation/passenger/Settings/_stat');
                this.taskConf = global.taskConf = require('../Moderation/passenger/Settings/_task'); 
                this.guardConf = global.guardConf = require('../Moderation/passenger/Settings/_guard.json');
            // Sistem Gereksinimi

            // em
                this.setMaxListeners(10000)
            // em

            

            // Logger
                this.logger = require("../Moderation/passenger/Functions/Global.logger");
                this.on("guildUnavailable", async (guild) => { console.log(`[UNAVAIBLE]: ${guild.name}`) })
                .on("disconnect", () => this.logger.log("Bot is disconnecting...", "disconnecting"))
                .on("reconnecting", () => this.logger.log("Bot reconnecting...", "reconnecting"))
                .on("error", (e) => this.logger.log(e, "error"))
                .on("warn", (info) => this.logger.log(info, "warn"));

                process.on("unhandledRejection", (err) => {this.logger.log(err, "caution")});
                process.on("warning", (warn) => { this.logger.log(warn, "varn") });
                process.on("beforeExit", () => { console.log('Sistem kapatılıyor...'); });
                process.on("uncaughtException", err => {
                    const hata = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
                        console.error("Beklenmedik Hata: ", hata);
                       // process.exit(1);
                });
            // Logger
    }

    safe(id, process = "İşlem Bulunamadı.", processnumber) {
        let uye = this.guilds.cache.get(ayarlar.sunucuID).members.cache.get(id);
        let senkron = fs.readFileSync('../Moderation/passenger/Settings/_guard.json', 'utf8')
        let safelist = JSON.parse(senkron).guardIzinliler || []
        let everHere = JSON.parse(fs.readFileSync('../Moderation/passenger/Settings/_guard.json', 'utf8')).everyoneIzinliler.includes(id)
        let emoji = JSON.parse(fs.readFileSync('../Moderation/passenger/Settings/_guard.json', 'utf8')).emojiIzinliler.includes(id)
        let sagtikUyeBanKick = JSON.parse(fs.readFileSync('../Moderation/passenger/Settings/_guard.json', 'utf8')).banKickIzinliler.includes(id)
        let sagtikRolVer = JSON.parse(fs.readFileSync('../Moderation/passenger/Settings/_guard.json', 'utf8')).rolYönetIzinliler.includes(id)
        if(this.sistem.staff.some(x => x.id == id)) return true;

        if(processnumber == 1) if(emoji) return this.limitChecker(uye, process)
        if(processnumber == 2) if(sagtikUyeBanKick) return this.limitChecker(uye, process)
        if(processnumber == 3) if(sagtikRolVer) return this.limitChecker(uye, process)
        if(processnumber == 4) if(everHere) return this.limitChecker(uye, process)

        if(!uye || uye.id === client.user.id || uye.id === uye.guild.owner.id || safelist.some(g => uye.id === g || uye.roles.cache.has(g))) {
            return this.limitChecker(uye, process)
        };
        return false;
    }
    limitChecker(uye, process = "İşlem Bulunamadı.") {
	if(uye.user.bot) return true
        let id = uye.id
        let limitController = dataLimit.get(id) || []
        let type = { _id: id, proc: process, date: Date.now() }
        limitController.push(type)
        dataLimit.set(id, limitController)
        setTimeout(() => { if (dataLimit.has(id)) { dataLimit.delete(id) } }, ms("10m"))
           
            if (limitController.length >= 12) {
                let loged = uye.guild.kanalBul("guard-log");
                let taslak = `${uye} (\`${uye.id}\`) isimli güvenli listesinde ki yönetici anlık işlem uygulama nedeni ile "__${process}__" zoruyla cezalandırıldı.
\`\`\`fix
Son Anlık işlemler;
${limitController.map((x, index) => `${index+1}. | ${x.proc} | ${tarihsel(x.date)}`).join("\n")}
                \`\`\``
                if(loged) loged.send(taslak);
                this.sistem.staff.forEach(x => {
                    let botOwner = uye.guild.members.cache.get(x)
                    if(botOwner) botOwner.send(taslak).catch(err => {})
                })
                uye.guild.owner.send(taslak).catch(err => {})
                return false 
            } else {
                return true
            }
    }     

    async fetchEvents() {
        let dirs = fs.readdirSync("./passenger/Events", { encoding: "utf8" });
        dirs.forEach(dir => {
            let files = fs.readdirSync(`./passenger/Events/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
            files.forEach(file => {
                let referans = require(`./passenger/Events/${dir}/${file}`);
                this.on(referans.config.Event, referans);
            });
        });
    }
    

}

class Executive {
    static async Roles() {
        const rolData = require('../Moderation/Database/Schema/Security/Roles');
        let guild = client.guilds.cache.get(ayarlar.sunucuID);
        if (guild) {
            await rolData.deleteMany({});
            if(rolData) {await rolData.deleteMany({});}
            guild.roles.cache.filter(r => r.name !== "@everyone" && !r.managed).forEach(async role => {
            let roleChannelOverwrites = [];
            guild.channels.cache.filter(c => c.permissionOverwrites.has(role.id)).forEach(c => {
             let channelPerm = c.permissionOverwrites.get(role.id);
             let pushlanacak = { id: c.id, allow: channelPerm.allow.toArray(), deny: channelPerm.deny.toArray() };
             roleChannelOverwrites.push(pushlanacak);
            });
            await new rolData({
              _id: new mongoose.Types.ObjectId(),
              guildID: ayarlar.sunucuID,
              roleID: role.id,
              name: role.name,
              color: role.hexColor,
              hoist: role.hoist,
              position: role.position,
              permissions: role.permissions,
              mentionable: role.mentionable,
              time: Date.now(),
              members: role.members.map(m => m.id),
              channelOverwrites: roleChannelOverwrites
            }).save();
          })  
          client.logger.log("ROL => Saatlik yedekleme işlemi başarıyla alındı.", "backup")
        }
    } 
}


class Mongo {
    static Connect() {
        require('mongoose').connect(require('../Moderation/passenger/Settings/system').MongoURL, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).then(() => {
            client.logger.log("Connected to the MongoDB.", "mongodb");
        }).catch((err) => {
            client.logger.log("Unable to connect to the MongoDB. Error: " + err, "error");
        });
    }

}

const puniUser = global.puniUser = async function(id, type) {
    let uye = client.guilds.cache.get(ayarlar.sunucuID).members.cache.get(id);
    if (!uye) return;

    if (type == "jail") { 
    if(uye.voice.channel) await uye.voice.kick().catch(err => {})
    return await uye.roles.cache.has(roller.boosterRolü) ? uye.roles.set([roller.boosterRolü, roller.jailRolü]) : uye.roles.set([roller.jailRolü]); 
    }

    if (type == "ban") return await uye.ban({ reason: "Guard Tarafından Siki Tuttu." }).catch(err => {}) 
};

const ytKapat = global.ytKapat = async function (){
    let sunucu = client.guilds.cache.get(ayarlar.sunucuID);
    if(!sunucu) return;
    sunucu.roles.cache.filter(r => r.editable && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_NICKNAMES") || r.permissions.has("MANAGE_WEBHOOKS") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_CHANNELS") || r.permissions.has("MANAGE_EMOJIS") || r.permissions.has("MANAGE_GUILD") || r.permissions.has("BAN_MEMBERS") || r.permissions.has("KICK_MEMBERS"))).forEach(async r => await r.setPermissions(0));     
}


let aylartoplam = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" };
global.aylar = aylartoplam;

const tarihsel = global.tarihsel = function(tarih) {
    let tarihci = moment(tarih).tz("Europe/Istanbul").format("DD") + " " + global.aylar[moment(tarih).tz("Europe/Istanbul").format("MM")] + " " + moment(tarih).tz("Europe/Istanbul").format("YYYY HH:mm")   
    return tarihci;
};

Guild.prototype.kanalBul = function(kanalisim) {
    let kanal = this.channels.cache.find(k => k.name === kanalisim)
    return kanal;
}



module.exports = { passenger, Mongo, Executive };