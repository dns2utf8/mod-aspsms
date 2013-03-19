'use strict'

var http = require('http');

var servers = [
  'xml1.aspsms.com:5061/xmlsvr.asp',
  'xml1.aspsms.com:5098/xmlsvr.asp',
  'xml2.aspsms.com:5061/xmlsvr.asp',
  'xml2.aspsms.com:5098/xmlsvr.asp'
];

var xmlBase = '<?xml version="1.0" encoding="ISO-8859-1"?>\r\n\
<aspsms>\r\n\
  <Userkey>{userkey}</Userkey>\r\n\
  <Password>{password}</Password>\r\n\
  <Originator>{originator}</Originator>\r\n\
  <Recipient>\r\n\
    <PhoneNumber>{phonenumber}</PhoneNumber>\r\n\
    <TransRefNumber>{idsms}</TransRefNumber>\r\n\
  </Recipient>\r\n\
  <MessageData>{message}</MessageData>\r\n\
  <FlashingSMS>{flashing}</FlashingSMS>\r\n\
    <URLDeliveryNotification>{deliveryNotificationUrl}</URLDeliveryNotification>\r\n\
    <URLNonDeliveryNotification>{nonDeliveryNotificationUrl}</URLNonDeliveryNotification>\r\n\
  <Action>SendTextSMS</Action>\r\n\
</aspsms>';

function t(s, d) {
  for(var p in d)
    s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
  return s;
}

var options = {
  hostname: '',
  port: 80,
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'text/xml',
    'Content-Length': 0
  }
}

var SMS = function(config) {
  var self = this;
  
  var idsms = 0;
  var flashing = 0;
  
  if (config.disable) {
    return {
      send: function(phonenumber, message) {
        if (message.length > 144)
          throw 'msg too long'
        
        console.log('SMS NOT sent: '+phonenumber+' "'+message+'"')
      }
    }
  }
  
  xmlBase = t(xmlBase, {
    userkey: config.userkey,
    password: config.password,
    originator: config.originator
  });
  
  return {
    send: function(phonenumber, message) {
      if (message.length > 144)
        throw 'message too long'
      
      phonenumber = phonenumber.replace('+', '00');
      message = message.replace(/&/g, '&#38;')
            .replace(/</g, '&#60;').replace(/>/g, '&#62;')
            .replace(/ü/g, '&#252;').replace(/ö/g, '&#246;').replace(/ä/g, '&#228;')
            .replace(/Ü/g, '&#220;').replace(/Ö/g, '&#214;').replace(/Ä/g, '&#196;')
      
      var xml = t(xmlBase, {
        phonenumber: phonenumber,
        idsms: idsms,
        flashing: flashing,
        deliveryNotificationUrl: config.deliveryNotificationUrl,
        nonDeliveryNotificationUrl: config.nonDeliveryNotificationUrl,
        message: message
      });
      
      var url = servers[Math.floor(Math.random()*servers.length)].split(':');
      options.hostname = url[0];
      url = url[1].split('/');
      options.port = url[0];
      options.path = '/'+url.slice(1, url.length).join('/');
      
      options.headers['Content-Length'] = xml.length;
      
      console.log('%j\n'+xml, options);
      var req = http.request(options, function(res) {
        console.log('STATUS: '+res.statusCode);
        console.log('HEADERS: '+JSON.stringify(res.headers));
        
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
          console.log('BODY: '+chunk);
        });
        
        res.on('error', function(e) {
          console.warn('problem with request: '+e.message);
        });
        
      });
      
      req.write(xml/*, 'ISO-8859-1'*/);
      req.end();
    }
  }
}

module.exports = SMS;
