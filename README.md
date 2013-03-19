mod-aspsms
==========

Gateway to SMS-Provider Aspsms for [node](http://nodejs.org).

```js
var config = {
  "disable": true,
  "userkey": "YOUR_USERKEY",
  "password": "YOUR_PASSWORD",
  "originator": "YOUR_NAME",
  // Optional:
  "deliveryNotificationUrl": "http://example.com/success",
  "nonDeliveryNotificationUrl": "http://example.com/failure"
};

var sms = require('mod-aspsms')(config);

var msg = 'Test SMS from NodeJs';

var addressBook = ['+41765432109'];

for (var i = 0; i < addressBook.length; i++) {
  sms.send(addressBook[i], msg);
}
```

I released this code because I believe everyone should be able to send texts with node.
