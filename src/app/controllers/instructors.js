const Instructor = require('../../models/Instructor')
const { age, date } = require('../../lib/utils')


module.exports = {
  index(req, res) {
    let { filter, page, limit } = req.query

    // se não existir a PAGE ele coloca com 1, caso contrário coloca o numero da pagina
    page = page || 1

    // funciona da mesma forma que o PAGE, se tiver mais que 5 dados na pagina ele ira criar uma seguinte e preencher, caso contrário ele apresenta apenas uma página com os dados disponiveis
    limit = limit || 5

    // a variavel offset vai apresentar os dados na página com a seguinte condição
    // 1-1 = 0 -> 0*5 = 0 --- mostra os dados apartir do id 0
    // 2-1 = 1 -> 1*5 = 5 --- mostra os dados apartir do id 5
    // 3-1 = 2 -> 2*5 = 10 --- mostra os dados apartir do id 10
    // desta maneira os dados sempre seram sequentes e nunca repetiram na apresentação
    let offset = limit * (page - 1)

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(instructors) {
        const pagination = {
          total: Math.ceil(instructors[0].total / limit),
          page
        }
        return res.render('instructors/instructors', { instructors, pagination, filter })
      }
    }

    Instructor.paginate(params)

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

    // estamos pegando o arquivo Instructor e passando a funcionalidade de crear um instrutor no BD.
    // create passa os dados do body e a função de cadastro
    Instructor.create(req.body, function (instructor) {

      // se der certo o envio de dados para o banco, redirecionamos o usuário para a página do instrutor cadastrado
      return res.redirect(`/instructors/${instructor.id}`)
    })

  },

  show(req, res) {
    Instructor.find(req.params.id, function (instructor) {
      if (!instructor) {
        return res.send("Instrutor não encontrado!")
      }

      instructor.age = age(instructor.birth)
      instructor.services = instructor.services.split(",")

      instructor.created_at = date(instructor.created_at).format

      return res.render('instructors/showInstructors', { instructor })
    })

  },

  edit(req, res) {
    Instructor.find(req.params.id, function (instructor) {
      if (!instructor) {
        return res.send("Instrutor não encontrado!")
      }

      instructor.birth = date(instructor.birth).iso
      instructor.services = instructor.services.split(",")

      instructor.created_at = date(instructor.created_at).format

      return res.render('instructors/editInstructors', { instructor })
    })
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

    Instructor.update(req.body, function () {
      return res.redirect(`/instructors/${req.body.id}`)
    })
  },

  delete(req, res) {

    Instructor.delete(req.body.id, function () {
      return res.redirect(`/instructors`)
    })
  }
}