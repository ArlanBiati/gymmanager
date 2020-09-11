const fs = require('fs')
const data = require('../data.json')
const { date } = require('../utils')

exports.index = function (req, res) {
  return res.render('members/members', { members: data.members })
}

exports.show = function (req, res) {
  // estamos desestruturando o id de dentro da requisição do tipo params
  const { id } = req.params

  // foundMember esta verificando se no array members tem um instrusctor.id igual ao id do params
  // (vai no array dos intrutores e procura o instrutor com id: 1 e ve se é igual ao id que esta na url)
  const foundMember = data.members.find(function (member) {
    return member.id == id
  })

  // se o id for diferent, retorna uma mensagem dizendo que o instrutor nao foi encontrado
  if (!foundMember) {
    return res.send('Instrutor não encontrada')
  }

  // dentro do objeto member, queremos corrigir alguns dados que vieram incorretos. Por exemplo: age, gender, services, created_at. O RESTO dos dados eu deixo da forma que estão. *** OBS -> os dados inalterados devem ser os primeiros a serem retornados.
  const member = {
    ...foundMember, // spred operator (resto dos dados inalterados)

    birth: date(foundMember.birth).birthDay // transformando a idade de milisegundos para anos e validando o mes e dia de aniversario
  }

  // se tudo estiver correto, retorne a pagina showMembers apresentando os dados do instrutor correspondente
  return res.render('members/showMembers', {
    member,
  })
}

exports.create = function (req, res) {
  return res.render('members/createMembers')
}

exports.edit = function (req, res) {

  const { id } = req.params

  // foundMember esta verificando se no array members tem um instrusctor.id igual ao id do params
  // (vai no array dos intrutores e procura o instrutor com id: 1 e ve se é igual ao id que esta na url)
  const foundMember = data.members.find(function (member) {
    return member.id == id
  })

  // se o id for diferent, retorna uma mensagem dizendo que o instrutor nao foi encontrado
  if (!foundMember) {
    return res.send('Instrutor não encontrada')
  }

  // dentro do objeto member, queremos corrigir alguns dados que vieram incorretos. Por exemplo: age, gender, services, created_at. O RESTO dos dados eu deixo da forma que estão. *** OBS -> os dados inalterados devem ser os primeiros a serem retornados.
  const member = {
    ...foundMember,

    // transformando a data de aniversário de milisegundos para o formato yyyy-mm-dd
    birth: date(foundMember.birth).iso
  }

  return res.render("members/editMembers", { member })
}

exports.post = function (req, res) {
  // criamos um Constructor (Object) que criara um objeto e dentro dele contem todos os dados enviados no body (avatar, nome, nascimento, servicos, sexo)
  const keys = Object.keys(req.body)

  // neste For passamos por cada chave verificando se os valores são vazios e retornando uma mensagem para preencher todos os dados, caso a condição seja True
  for (key of keys) {
    if (req.body[key] == '') {
      return res.send('Por favor, preencha todos os campos')
    }
  }

  // pegamos o valor da chave birth e transformamos ela em milisegundos
  birth = Date.parse(req.body.birth)

  let id = 1
  const lastMember = data.members[data.members.length - 1]

  if (lastMember) {
    id = lastMember.id + 1
  }

  // o metodo push coloca todos os dados desestruturados que veem no body dentro do array members
  data.members.push({
    id,
    ...req.body,
    birth
  })

  // configurando o file system para escrever as modificações dentro de um arquivo data.json
  fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
    if (err) {
      return res.send('Write file error')
    }
    return res.redirect('/members')
  })

  // retornamos nossos dados do Body no navegador
  // return res.send(req.body)
}

exports.put = function (req, res) {
  // pegando id pelo formulário
  const { id } = req.body

  // variavel index recebe o valor de 0
  let index = 0

  // foundMember esta verificando se no array members tem um instrusctor.id igual ao id do body(formulário)
  // (vai no array dos intrutores e procura o instrutor com id: 1 e ve se é igual ao id do formulário que está em edição, caso seja, o index recebe a posição do instrutor no array e retorna true)
  const foundMember = data.members.find(function (member, foundIndex) {
    if (id == member.id) {
      index = foundIndex
      return true
    }
  })

  // se o id for diferente, retorna uma mensagem dizendo que o instrutor nao foi encontrado
  if (!foundMember) {
    return res.send('Instrutor não encontrada')
  }

  const member = {
    // espalha todos os dados que já existem no instrutor
    ...foundMember,

    // espalha todos os dados atualizados que vem do formulário    *** não tem problema esplahar os dois, eles se complementam
    ...req.body,

    // transforma o id em numero
    id: Number(id),

    // transforma a data de nascimento em milisegundos
    birth: Date.parse(req.body.birth)
  }
  // dentro do array de instrutores na posição do index, recebe o instrutor
  data.members[index] = member

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
    if (err) {
      return res.send('Write file error')
    }
    return res.redirect(`/members/${id}`)
  })
}

exports.delete = function (req, res) {
  // pegando id pelo formulário
  const { id } = req.body

  // dentro do array members, filtramos um instrutor. Se for true adicionamos ele no nosso novo array filteredMembers
  const filteredMembers = data.members.filter(function (member) {

    // se o member tiver o id diferente do id informado no body, iremos enviar ele para dentro do filteredMembers (esse é o array de objetos que sera deletado)
    return member.id != id
  })

  data.members = filteredMembers

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
    if (err) {
      return res.send("Write file error")
    }

    return res.redirect('/members')
  })
}