const fs = require("fs")
const data = require("./data.json")

exports.post = function(req, res) {

    // criamos um Constructor (Object) que criara um objeto e dentro dele contem todos os dados enviados no body (avatar, nome, nascimento, servicos, sexo)
    const keys = Object.keys(req.body)

    // neste For passamos por cada chave verificando se os valores são vazios e retornando uma mensagem para preencher todos os dados, caso a condição seja True
    for(key of keys) {
        if(req.body[key] == "") {
            return res.send("Por favor, preencha todos os campos")
        }
    }

    // pegamos o valor da chave birth e transformamos ela em milisegundos
    req.body.birth = Date.parse(req.body.birth)

    // cria uma chave createdAt que recebe a data do momento atual
    req.body.createdAt = Date.now()

    // o metodo push coloca todos os dados que veem no body dentro do array instructors 
    data.instructors.push(req.body)


    // configurando o file system para escrever as modificações dentro de um arquivo data.json
    fs.writeFile("data.json", JSON.stringify(data, null ,2), function(err) {
        if(err) {
            return res.send("Write file error")
        }
        return res.redirect("/instructors")
    })

    // retornamos nossos dados do Body no navegador
    // return res.send(req.body)
}