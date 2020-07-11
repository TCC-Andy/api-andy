const nodemailer = require("nodemailer");
const { host, port, user, pass } = require("../config/mail.json")

exports.send = async (flag, to, nome, token, id) => {
    if (flag == 1) {
        subject = "Seja bem vindo"
        html = "<h3>Ola " + nome + ". Bem vindo a Andy Services</h3></br>Obrigado por se cadastrar conosco!"
    } else if (flag == 2) {
        subject = "Redefinir senha"
        //html="<h3>Acesse o seguinte endereço para  alterar a senha: </br>http://tccandy.herokuapp.com/forgotPassword/"+token+"/"+id+"</h3>"
        html = '<!DOCTYPE html>\
    <html lang="pt-BR">\
    <head>\
        <meta charset="utf-8" />\
        <meta name="viewport" content="width=device-width, initial-scale=1" />\
        <meta name="description" content="Web site created using create-react-app" />\
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">\
        <style>\
            .message {\
                text-align: center;\
                font-weight: bold;\
            }\
            .dataHora {\
                color: #ff0000;\
            }\
        </style>\
    </head>\
    <body>\
        <div class="row">\
            <div class="col-md-12">\
                <div class="message">\
                    Clique no link abaixo para criar uma senha nova, o link é válido até o dia <span\
                        class="dataHora">{{ data }}</span> as <span class="dataHora">{{ hora }}</span>. Se você não\
                    solicitou uma senha nova simplesmente ignore essa mensagem.”\
                    <br />\
                    <a href="{{ url }}/alterarSenha/{{ token }}" class="btn btn-success btn-sm active"\
                        role="button" aria-pressed="true">Clique aqui</a>\
                </div>\
            </div>\
        </div>\
        <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"></script>\
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"></script>\
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>\
    </body>\
    </html>'

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
            //text: "Testando o corpo do email",
            html,
        }).then(message => {
            console.log(message);
        }).catch(err => {
            console.log(err);
        })
    }
}