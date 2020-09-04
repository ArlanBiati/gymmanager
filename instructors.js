const fs = require('fs')
const data = require('./data.json')
const Intl = require('intl')
const { age, date } = require('./utils')


exports.show = function (req, res) {
  // estamos desestruturando o id de dentro da requisição do tipo params
  const { id } = req.params

  // foundInstructor esta verificando se no array instructors tem um instrusctor.id igual ao id do params
  // (vai no array dos intrutores e procura o instrutor com id: 1 e ve se é igual ao id que esta na url)
  const foundInstructor = data.instructors.find(function (instructor) {
    return instructor.id == id
  })

  // se o id for diferent, retorna uma mensagem dizendo que o instrutor nao foi encontrado
  if (!foundInstructor) {
    return res.send('Instrutor não encontrada')
  }

  // dentro do objeto instructor, queremos corrigir alguns dados que vieram incorretos. Por exemplo: age, gender, services, created_at. O RESTO dos dados eu deixo da forma que estão. *** OBS -> os dados inalterados devem ser os primeiros a serem retornados.
  const instructor = {
    ...foundInstructor, // spred operator (resto dos dados inalterados)

    age: age(foundInstructor.birth), // transformando a idade de milisegundos para anos e validando o mes e dia de aniversario

    services: foundInstructor.services.split(','), // dentro do instrutor pegue os servicos dele e separe sempre que encontrar uma virgula

    created_at: new Intl.DateTimeFormat('pt-BR').format(
      foundInstructor.created_at
    ), // usando Intl para transformar o tempo de milisegundos para data normal 28/08/2020
  }

  // se tudo estiver correto, retorne a pagina showInstructors apresentando os dados do instrutor correspondente
  return res.render('instructors/showInstructors', {
    instructor,
  })
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

  // desestruturação dos dados que queremos pegar dentro do body
  let { avatar_url, name, birth, gender, services } = req.body

  // pegamos o valor da chave birth e transformamos ela em milisegundos
  birth = Date.parse(birth)

  // cria uma chave created_at que recebe a data do momento atual
  const created_at = Date.now()

  // cria uma chave id que recebe um número como valor (tamanho do array de instrutores + 1)
  const id = Number(data.instructors.length + 1)

  // o metodo push coloca todos os dados desestruturados que veem no body dentro do array instructors
  data.instructors.push({
    id,
    avatar_url,
    name,
    birth,
    gender,
    services,
    created_at,
  })

  // configurando o file system para escrever as modificações dentro de um arquivo data.json
  fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
    if (err) {
      return res.send('Write file error')
    }
    return res.redirect('/instructors')
  })

  // retornamos nossos dados do Body no navegador
  // return res.send(req.body)
}

exports.edit = function (req, res) {

  const { id } = req.params

  // foundInstructor esta verificando se no array instructors tem um instrusctor.id igual ao id do params
  // (vai no array dos intrutores e procura o instrutor com id: 1 e ve se é igual ao id que esta na url)
  const foundInstructor = data.instructors.find(function (instructor) {
    return instructor.id == id
  })

  // se o id for diferent, retorna uma mensagem dizendo que o instrutor nao foi encontrado
  if (!foundInstructor) {
    return res.send('Instrutor não encontrada')
  }

  // dentro do objeto instructor, queremos corrigir alguns dados que vieram incorretos. Por exemplo: age, gender, services, created_at. O RESTO dos dados eu deixo da forma que estão. *** OBS -> os dados inalterados devem ser os primeiros a serem retornados.
  const instructor = {
    ...foundInstructor,

    // transformando a data de aniversário de milisegundos para o formato yyyy-mm-dd
    birth: date(foundInstructor.birth)
  }

  return res.render("instructors/editInstructors", { instructor })
}

exports.put = function (req, res) {
  // pegando id pelo formulário
  const { id } = req.body

  // variavel index recebe o valor de 0
  let index = 0

  // foundInstructor esta verificando se no array instructors tem um instrusctor.id igual ao id do body(formulário)
  // (vai no array dos intrutores e procura o instrutor com id: 1 e ve se é igual ao id do formulário que está em edição, caso seja, o index recebe a posição do instrutor no array e retorna true)
  const foundInstructor = data.instructors.find(function (instructor, foundIndex) {
    if (id == instructor.id) {
      index = foundIndex
      return true
    }
  })

  // se o id for diferente, retorna uma mensagem dizendo que o instrutor nao foi encontrado
  if (!foundInstructor) {
    return res.send('Instrutor não encontrada')
  }

  const instructor = {
    // espalha todos os dados que já existem no instrutor
    ...foundInstructor,

    // espalha todos os dados atualizados que vem do formulário    *** não tem problema esplahar os dois, eles se complementam
    ...req.body,

    // transforma o id em numero
    id: Number(id),

    // transforma a data de nascimento em milisegundos
    birth: Date.parse(req.body.birth)
  }
  // dentro do array de instrutores na posição do index, recebe o instrutor
  data.instructors[index] = instructor

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
    if (err) {
      return res.send('Write file error')
    }
    return res.redirect(`/instructors/${id}`)
  })
}