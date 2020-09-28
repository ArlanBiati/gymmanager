const db = require('../config/db')
const { date } = require('../lib/utils')

module.exports = {
  all(callback) {

    // estamos selecionando todos os campos dentro de members no BD
    db.query(`SELECT * FROM members ORDER BY name ASC`, function (err, results) {

      // se der erro retornamos uma mensagem "Database error"
      if (err) throw `Database error! ${err}`

      // se ocorrer com exito nossa função, retornamo na callback o array contendo os membros.
      callback(results.rows)
    })
  },
  create(data, callback) {

    // cadastramos uma query que ira inserir os dados abaixo dentro da tabela members e no final retornar um ID
    const query = `
      INSERT INTO members (
        avatar_url,
        name,
        email,
        birth,
        blood,
        gender,
        weight,
        height,
        instructor_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `

    // o array values vai substituir o values nas querys, passando os valores informados no cadastro de novos membros
    const values = [
      data.avatar_url,
      data.name,
      data.email,
      date(data.birth).iso,
      data.blood,
      data.gender,
      data.weight,
      data.height,
      data.instructor
    ]

    // estamos enviando nossos dados para o banco de dados.
    //query recebe 3 valores, a query = dados, values = valores dos dados e uma função de callback que recebe como parametros err (erro) e results (resultado)
    db.query(query, values, function (err, results) {

      // se der erro retornamos uma mensagem "Database error"
      if (err) throw `Database error! ${err}`

      // se ocorrer com exito nossa função, retornamos na callback o resultado com o objeto da posição 0 do array
      callback(results.rows[0])

      // *** sempre é retornado ROWS (array) e pegamos na posição zero
    })
  },
  find(id, callback) {

    // estamos procurando um instrutor especifico de acordo com seu ID
    db.query(`
      SELECT members.*, instructors.name AS instructor_name
      FROM members 
      LEFT JOIN instructors ON (members.instructor_id = instructors.id)
      WHERE members.id = $1
      `, [id], function (err, results) {

      // se der erro retornamos uma mensagem "Database error"
      if (err) throw `Database error! ${err}`

      // se ocorrer com exito nossa função, retornamos na callback o resultado com o objeto da posição 0 do array
      callback(results.rows[0])
    })
  },
  findBy(filter, callback) {
    db.query(`
      SELECT members.*, instructors.name AS instructor_name
      FROM members 
      LEFT JOIN instructors ON (members.instructor_id = instructors.id)
      WHERE members.name ILIKE '%${filter}%'
      `, function (err, results) {

      // se der erro retornamos uma mensagem "Database error"
      if (err) throw `Database error! ${err}`

      // se ocorrer com exito nossa função, retornamo na callback o array contendo os instrutores.
      callback(results.rows)
    })
  },
  update(data, callback) {

    // estamos usando o UPDATE para fazer a atualização dos dados no BD
    const query = `
      UPDATE members SET
        avatar_url=($1),
        name=($2),
        email=($3),
        birth=($4),
        blood=($5),
        gender=($6),
        weight=($7),
        height=($8),
        instructor_id=($9)
      WHERE id = $10
    `
    // nunca esquecer de por WHERE no UPDATE, se não ele ira atualizar o BD com os mesmos dados em todos.
    const values = [
      data.avatar_url,
      data.name,
      data.email,
      date(data.birth).iso,
      data.blood,
      data.gender,
      data.weight,
      data.height,
      data.instructor,
      data.id
    ]


    db.query(query, values, function (err, results) {

      // se der erro retornamos uma mensagem "Database error"
      if (err) throw `Database error! ${err}`

      callback()
    })
  },
  delete(id, callback) {
    db.query(`DELETE FROM members WHERE id = $1`, [id], function (err, results) {

      // se der erro retornamos uma mensagem "Database error"
      if (err) throw `Database error! ${err}`

      return callback()
    })
  },
  instructorsSelectOptions(callback) {
    db.query(`SELECT name, id FROM instructors`, function (err, results) {
      if (err) throw `Database error! ${err}`

      callback(results.rows)
    })
  },
  paginate(params) {
    const { filter, limit, offset, callback } = params

    let query = ""
    let filterQuery = ""
    let totalQuery = `
      (SELECT count(*) FROM members)
      AS total
    `

    // se houver um filtro, a query recebera o valor dela não modificado + os possiveis filtros
    // WHERE: onde devemos pesquisar. Estamos pesquisando dentro da tabela de instrutores a coluna de nome
    // OR: ou devemos pesquisar tambem dentro da tabela de instrutores a coluna de serviços
    // ILIKE: é tipo de filtro que estamos autorizando ele identificar. Neste caso aceita qualquer formato de palavra sem destinção de caixa alta ou baixa
    if (filter) {
      filterQuery = `
        ${query}
        WHERE members.name ILIKE '%${filter}%'
        OR members.email ILIKE '%${filter}%'
      `

      totalQuery = `(
        SELECT count(*) FROM members
        ${filterQuery}
      ) AS total`
    }

    // variavel query esta recebendo:
    // SELECT: seleciones todos os instrutores e identifique quantos membros cada instrutor tem (total_students)
    // (aqui utilizamos uma subquery para identificar a quantidade de instrutores e colocar dentro do total)
    // FROM: pegue todos os dados da tabela de instrutores
    // LEFT JOIN: integre a tabela de instrutores com a de mebros (members.instructor_id recebe instructors.id) (linkando informações de uma tabela para outra)
    query = `
      SELECT members.*, ${totalQuery}
      FROM members
      ${filterQuery}
      LIMIT $1
      OFFSET $2
    `

    db.query(query, [limit, offset], function (err, results) {
      if (err) throw `Database error! ${err}`

      // se ocorrer com exito nossa função, retornamo na callback o array contendo os instrutores.
      callback(results.rows)
    })
  }
}