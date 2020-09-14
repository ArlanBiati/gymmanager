const Intl = require('intl')
const { age, date } = require('../../lib/utils')

module.exports = {
  index(req, res) {
    return res.render('instructors/instructors', { instructors: data.instructors })
  },
  create(req, res) {
    return res.render('instructors/createInstructors')
  },
  post(req, res) {
    // criamos um Constructor (Object) que criara um objeto e dentro dele contem todos os dados enviados no body (avatar, nome, nascimento, servicos, sexo)
    const keys = Object.keys(req.body)

    // neste For passamos por cada chave verificando se os valores são vazios e retornando uma mensagem para preencher todos os dados, caso a condição seja True
    for (key of keys) {
      if (req.body[key] == '') {
        return res.send('Por favor, preencha todos os campos')
      }
    }
    return
  },
  show(req, res) {
    return
  },
  edit(req, res) {
    return
  },
  put(req, res) {
    // criamos um Constructor (Object) que criara um objeto e dentro dele contem todos os dados enviados no body (avatar, nome, nascimento, servicos, sexo)
    const keys = Object.keys(req.body)

    // neste For passamos por cada chave verificando se os valores são vazios e retornando uma mensagem para preencher todos os dados, caso a condição seja True
    for (key of keys) {
      if (req.body[key] == '') {
        return res.send('Por favor, preencha todos os campos')
      }
    }
    return
  },
  delete(req, res) {
    return
  }
}