const nodemailer = require("nodemailer");


exports.send = async (to,nome) => {
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
        user: "andy.services.it@gmail.com",
        pass: "ypfytutjogcjpena"
    },
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
   
});

transporter.sendMail({
    from: "Andy Services <andy.services.it@gmail.com>",
    to: to,
    subject: "Andy esta ao seu dispor!",
    //text: "Testando o corpo do email",
    html: "<h3>Bem vindo "+nome+" !!</h3></br>Venha conhecer um mundo de facilidades! Bem vindo a Andy Services!"
}).then(message => {
    console.log(message);
}).catch(err => {
    console.log(err);
})

}