const nodemailer = require("nodemailer");


exports.send = async (flag,to,nome,token,id) => {
if(flag==1){
    subject="Seja bem vindo"
    html="<h3>Ola "+nome+". Bem vindo a Andy Services</h3>"
    console.log("é dois")
}else if(flag==2){
    subject="Redefinir senha"
    html="<h3>Acesse o seguinte endereço para  alterar a senha: </br>http://tccandyapi.herokuapp.com/resetPassword/"+token+"/"+id+"</h3>"
}
const transporter = nodemailer.createTransport({
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
    to,
    subject,
    //text: "Testando o corpo do email",
    html,
}).then(message => {
    console.log(message);
}).catch(err => {
    console.log(err);
})

}