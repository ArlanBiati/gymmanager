const db = require('../config/db')
const { date } = require('../lib/utils')

module.exports = {
  all(callback) {

    // estamos selecionando todos os campos dentro de instructors no BD
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
  }
}