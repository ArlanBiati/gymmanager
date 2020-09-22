const Member = require('../../models/Member')
const { date } = require('../../lib/utils')


module.exports = {
  index(req, res) {
    // estamos pegando o arquivo Member e chamando todos os instrutores que estiverem cadastrados no BD
    Member.all(function (members) {
      return res.render('members/members', { members })
    })
  },

  create(req, res) {

    Member.instructorsSelectOptions(function (options) {

      return res.render('members/createMembers', { instructorOptions: options })
    })

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

    // estamos pegando o arquivo Member e passando a funcionalidade de crear um instrutor no BD.
    // create passa os dados do body e a função de cadastro
    Member.create(req.body, function (member) {

      // se der certo o envio de dados para o banco, redirecionamos o usuário para a página do instrutor cadastrado
      return res.redirect(`/members/${member.id}`)
    })
  },

  show(req, res) {
    Member.find(req.params.id, function (member) {
      if (!member) {
        return res.send("Instrutor não encontrado!")
      }

      member.birth = date(member.birth).birthDay

      return res.render('members/showMembers', { member })
    })
  },

  edit(req, res) {
    Member.find(req.params.id, function (member) {
      if (!member) {
        return res.send("Instrutor não encontrado!")
      }

      member.birth = date(member.birth).iso

      Member.instructorsSelectOptions(function (options) {

        return res.render('members/editMembers', { member, instructorOptions: options })
      })
    })
  },

  put(req, res) {
    // criamos um Constructor (Object) que criara um objeto e dentro dele contem todos os dados enviados no body (avatar, nome, nascimento...)
    const keys = Object.keys(req.body)

    // neste For passamos por cada chave verificando se os valores são vazios e retornando uma mensagem para preencher todos os dados, caso a condição seja True
    for (key of keys) {
      if (req.body[key] == '') {
        return res.send('Por favor, preencha todos os campos')
      }
    }

    Member.update(req.body, function () {
      return res.redirect(`/members/${req.body.id}`)
    })
  },

  delete(req, res) {
    Member.delete(req.body.id, function () {
      return res.redirect(`/members`)
    })
  }
}