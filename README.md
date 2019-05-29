mod-aspsms
==========

Gateway to SMS-Provider Aspsms for [node](http://nodejs.org).

```js
var config = {
  "disable": true, // switch to false to enable the service
  "UserName": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "Password": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "Originator": "Your Name",
  // Optional:
  "logger": console.log, // if you would like to see debug output
  "URLDeliveryNotification": "https://example.com/success",
  "URLNonDeliveryNotification": "https://example.com/failure"
};

var sms = require('./')(config);

var msg = 'Test SMS from NodeJs';

var addressBook = ['+41798765432'];

sms.send(addressBook, msg);
```

I released this code because I believe everyone should be able to send texts with node.

## Additional docs

https://json.aspsms.com/
