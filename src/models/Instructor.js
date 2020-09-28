const db = require('../config/db')
const { date } = require('../lib/utils')

module.exports = {
  all(callback) {

    db.query(`
      SELECT instructors.*, count(members) AS total_students
      FROM instructors
      LEFT JOIN members ON (instructors.id = members.instructor_id)
      GROUP BY instructors.id
      ORDER BY total_students DESC`
      , function (err, results) {

        // se der erro retornamos uma mensagem "Database error"
        if (err) throw `Database error! ${err}`

        // se ocorrer com exito nossa função, retornamo na callback o array contendo os instrutores.
        callback(results.rows)
      })
  },
  create(data, callback) {

    // cadastramos uma query que ira inserir os dados abaixo dentro da tabela instructors e no final retornar um ID
    const query = `
      INSERT INTO instructors (
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `

    // o array values vai substituir o values nas querys, passando os valores informados no cadastro de novos instrutores
    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.gender,
      data.services,
      date(Date.now()).iso,
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
    db.query(`SELECT * FROM instructors WHERE id = $1`, [id], function (err, results) {

      // se der erro retornamos uma mensagem "Database error"
      if (err) throw `Database error! ${err}`

      // se ocorrer com exito nossa função, retornamos na callback o resultado com o objeto da posição 0 do array
      callback(results.rows[0])
    })
  },
  findBy(filter, callback) {
    db.query(`
      SELECT instructors.*, count(members) AS total_students
      FROM instructors
      LEFT JOIN members ON (instructors.id = members.instructor_id)
      WHERE instructors.name ILIKE '%${filter}%'
      OR instructors.services ILIKE '%${filter}%'
      GROUP BY instructors.id
      ORDER BY total_students DESC`
      , function (err, results) {

        // se der erro retornamos uma mensagem "Database error"
        if (err) throw `Database error! ${err}`

        // se ocorrer com exito nossa função, retornamo na callback o array contendo os instrutores.
        callback(results.rows)
      })
  },
  update(data, callback) {

    // estamos usando o UPDATE para fazer a atualização dos dados no BD
    const query = `
      UPDATE instructors SET
        avatar_url=($1),
        name=($2),
        birth=($3),
        gender=($4),
        services=($5)
      WHERE id = $6
    `
    // nunca esquecer de por WHERE no UPDATE, se não ele ira atualizar o BD com os mesmos dados em todos

    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.gender,
      data.services,
      data.id
    ]

    db.query(query, values, function (err, results) {

      // se der erro retornamos uma mensagem "Database error"
      if (err) throw `Database error! ${err}`

      callback()
    })
  },
  delete(id, callback) {
    db.query(`DELETE FROM instructors WHERE id = $1`, [id], function (err, results) {

      // se der erro retornamos uma mensagem "Database error"
      if (err) throw `Database error! ${err}`

      return callback()
    })
  },
  paginate(params) {
    const { filter, limit, offset, callback } = params

    let query = ""
    let filterQuery = ""
    let totalQuery = `
      (SELECT count(*) FROM instructors)
      AS total
    `

    // se houver um filtro, a query recebera o valor dela não modificado + os possiveis filtros
    // WHERE: onde devemos pesquisar. Estamos pesquisando dentro da tabela de instrutores a coluna de nome
    // OR: ou devemos pesquisar tambem dentro da tabela de instrutores a coluna de serviços
    // ILIKE: é tipo de filtro que estamos autorizando ele identificar. Neste caso aceita qualquer formato de palavra sem destinção de caixa alta ou baixa
    if (filter) {
      filterQuery = `
        ${query}
        WHERE instructors.name ILIKE '%${filter}%'
        OR instructors.services ILIKE '%${filter}%'
      `

      totalQuery = `(
        SELECT count(*) FROM instructors
        ${filterQuery}
      ) AS total`
    }

    // variavel query esta recebendo:
    // SELECT: seleciones todos os instrutores e identifique quantos membros cada instrutor tem (total_students)
    // (aqui utilizamos uma subquery para identificar a quantidade de instrutores e colocar dentro do total)
    // FROM: pegue todos os dados da tabela de instrutores
    // LEFT JOIN: integre a tabela de instrutores com a de mebros (members.instructor_id recebe instructors.id) (linkando informações de uma tabela para outra)
    query = `
      SELECT instructors.*, ${totalQuery}, count(members) AS total_students
      FROM instructors
      LEFT JOIN members ON (instructors.id = members.instructor_id)
      ${filterQuery}
      GROUP BY instructors.id
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