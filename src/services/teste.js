const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: 'b98e76cd',
  apiSecret: 'Dl1UiYfEh1MBuNlI',
});

const from = 'Nexmo';
const to = '5541997713790';
const text = 'Hello from node js';
console.log("enviou")
nexmo.message.sendSms(from, to, text);