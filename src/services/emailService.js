const nodemailer = require("nodemailer");
const { host, port, user, pass } = require("../config/mail.json")

exports.send = async (flag, to, nome, token, id) => {
    if (flag == 1) {
        subject = "Seja bem vindo"
        html = "<h3>Ola " + nome + ". Bem vindo a Andy Services</h3></br>Obrigado por se cadastrar conosco!"
    } else if (flag == 2) {
        subject = "Redefinir senha"
        html="<h3>Acesse o seguinte endereço para  alterar a senha: </br>http://tccandy.herokuapp.com/resetPassword/"+token+"</h3>"
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure: true,
            auth: {
                user,
                pass
            },
            secure: false,
            tls: {
                rejectUnauthorized: false
            }

        });

        transporter.sendMail({
            from: "Andy Services <andy.services.it@gmail.com>",
            to,
            subject,
            html,
        }).then(message => {
            console.log(message);
        }).catch(err => {
            console.log(err);
        })
    }
}