const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: 'b98e76cd',
  apiSecret: 'Dl1UiYfEh1MBuNlI',
});

const from = 'Nexmo';
const to = '5541997712691';
const text = 'Erica... vou puxar o seu pe enquanto voce dorme...';
console.log("enviou")
nexmo.message.sendSms(from, to, text);