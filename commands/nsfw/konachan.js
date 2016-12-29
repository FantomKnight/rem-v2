/**
 * Created by julia on 07.11.2016.
 */
let Command = require('../../structures/command');
let winston = require('winston');
let request = require('request');
class Konachan extends Command {
    constructor(t) {
        super();
        this.cmd = "kona";
        this.cat = "nsfw";
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
    }

    run(msg) {
        let msgSplit = msg.content.split(' ');
        let msgSearch = "";
        let searchOrig = "";
        for (let i = 1; i < msgSplit.length; i++) {
            if (i === 1) {
                searchOrig = msgSplit[i];
            } else {
                searchOrig = searchOrig + " " + msgSplit[i];
            }
        }
        msgSearch = 'order:score rating:questionableplus ' + searchOrig;
        request.get('https://konachan.com/post.json', {
            qs: {
                limit: 200,
                tags: msgSearch
            }
        }, (error, response, body) => {
            if (error) {
                return msg.channel.createMessage(this.t('nsfw-images.error-body', {lngs: msg.lang}));
            }
            if (!error && response.statusCode == 200) {
                try {
                    body = JSON.parse(body);
                } catch (e) {
                    return msg.channel.createMessage(this.t('nsfw-images.error-body', {lngs: msg.lang}));
                }
                if (typeof (body) !== 'undefined' && body.length > 0) {
                    let random = Math.floor(Math.random() * body.length);
                    if (typeof(body[random]) !== 'undefined' && typeof (body[random].file_url) !== 'undefined') {

                        msg.channel.createMessage(`http://${body[random].file_url.substring(2)}`);
                    } else {
                        msg.channel.createMessage(this.t('nsfw-images.error-body', {lngs: msg.lang}));
                    }
                } else {
                    msg.channel.createMessage(this.t('nsfw-images.nothing-found', {
                        lngs: msg.lang,
                        tags: searchOrig
                    }));
                }
            }
        });
    }
}
module.exports = Konachan;