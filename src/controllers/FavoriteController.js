const mongoose = require("mongoose");
const Favoritos = mongoose.model("Favoritos");
const Empresa = mongoose.model("Empresas");



module.exports = {

    async checkFavorite(req, res) {

        try {
            const { idCliente, idEmpresa, flag } = req.body;

            if (flag == 1) {
                const registro = await Favoritos.find({ idCliente, idEmpresa })

                if (Object.keys(registro).length == 0) {
                    const empresa = await Empresa.findById(idEmpresa);

                    let objeto = new Object()
                    objeto.idCliente = idCliente
                    objeto.idEmpresa = idEmpresa
                    objeto.nomeEmpresa = empresa.nome
                    objeto.nomeFantasia = empresa.nomeFantasia
                    objeto.CNPJ = empresa.CNPJ
                    objeto.categoria = empresa.categoria
                    objeto.numero = empresa.numero
                    objeto.descricao = empresa.descricao
                    objeto.telefone = empresa.telefone
                    objeto.rua = empresa.rua
                    objeto.bairro = empresa.bairro
                    objeto.cidade = empresa.cidade
                    objeto.cep = empresa.cep
                    objeto.complemento = empresa.complemento
                    objeto.coordenadas = empresa.coordenadas

                    const favorito = await Favoritos.create(objeto);
                    if (favorito) {
                        return res.json({
                            status: 200,
                            mensagem: 'Empresa adicionada no Favoritos',
                            favorito
                        })
                    } else {
                        return res.json({
                            status: 500,
                            mensagem: 'Erro no cadastro da empresa ao favoritos'

                        })

                    }

                } else {


                    return res.json({
                        status: 200,
                        mensagem: 'Empresa ja foi cadastrada no Favoritos',
                    })
                }

            } else {
                const registro = await Favoritos.find({ idCliente, idEmpresa })
                if (Object.keys(registro).length > 0) {

                    await Favoritos.findByIdAndRemove(registro[0].id);
                    return res.json({
                        status: 200,
                        mensagem: 'Empresa removida dos Favoritos',
                    })
                } else {
                    return res.json({
                        status: 200,
                        mensagem: 'Nao existe empresa para deletar',
                    })

                }

            }


        } catch (err) {

            return res.json({
                status: 500,
                mensagem: 'Erro no processo do cadastro ou exclusão no favoritos',
                erro: err
            })
        }

    },
    async showFavorites(req, res) {
        try {
            const favoritos = await Favoritos.find({ idCliente: req.params.idCliente });
            return res.json({
                status: 200,
                favoritos
            })
        } catch{
            return res.json({
                status: 400,
                mensagem: "Erro no processo de busca dos favoritos do cliente"
            })

        }

    }


}