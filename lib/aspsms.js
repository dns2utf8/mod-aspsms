'use strict'

const https = require('https');

const servers = [
  'json.aspsms.com/SendTextSMS',
];

const options = {
    hostname: '',
    port: 443,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'text/json',
        'Content-Length': 0,
    },
}

var SMS = function(user_config) {
    var self = this;

    var idsms = 0;
    var flashing = 0;

    var logger = user_config.logger || function() {};

    if (user_config.disable) {
        return {
            send: function(phonenumber, message) {
                if (message.length > 144) {
                    throw 'msg too long';
                }

                logger('SMS NOT sent: '+phonenumber+' "'+message+'"');
            }
        }
    }
    const default_config = { "UserName": "", "Password": "", "Originator": "", "Recipients": [ "" ], "MessageText": "", "DeferredDeliveryTime": "", "FlashingSMS": "", "URLBufferedMessageNotification": "", "URLDeliveryNotification": "", "URLNonDeliveryNotification": "", "AffiliateID": "", "ForceGSM7bit": false };
    const config = apply_settings(default_config, user_config);


    return {
        send: function(phonenumbers, message) {
            if (message.length > 603) {
                throw 'message too long';
            }

            if (phonenumbers.length > 1000) {
                throw 'too many recipients';
            }

            message = message.replace(/&/g, '&#38;')
                    .replace(/</g, '&#60;').replace(/>/g, '&#62;')
                    .replace(/ü/g, '&#252;').replace(/ö/g, '&#246;').replace(/ä/g, '&#228;')
                    .replace(/Ü/g, '&#220;').replace(/Ö/g, '&#214;').replace(/Ä/g, '&#196;');

            const recipients = phonenumbers.map(phonenumber => {
                return phonenumber.replace('+', '00');
            });

            const json = JSON.stringify(apply_settings(config, {
                Recipients: recipients,
                MessageText: message,
            })) + "\n";

            const url = servers[Math.floor(Math.random()*servers.length)].split('/');
            options.hostname = url[0];
            options.path = "/" + url[1];

            options.headers['Content-Length'] = json.length;

            logger('%j\n'+json, options);
            var req = https.request(options, function(res) {
                logger('STATUS: '+res.statusCode);
                logger('HEADERS: '+JSON.stringify(res.headers));

                res.setEncoding('utf8');
                var data = '';
                res.on('data', function(chunk) {
                    logger('BODY: '+chunk);
                    data += chunk;
                });

                res.on('error', function(e) {
                    console.warn('problem with request: '+e.message);
                    throw [e, data];
                });
            });

            req.write(json, 'utf8');
            req.end();
        }
    }
}

function apply_settings(defs, set) {
    var copy = {};
    Object.getOwnPropertyNames(defs)
        .forEach(k => {
            copy[k] = set.hasOwnProperty(k) ? set[k] : defs[k];
        });
    return copy;
}

module.exports = SMS;
