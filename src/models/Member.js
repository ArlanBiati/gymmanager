const db = require('../config/db')
const { date } = require('../lib/utils')

module.exports = {
  all(callback) {

    // estamos selecionando todos os campos dentro de members no BD
    db.query(`SELECT * FROM members`, function (err, results) {

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
        height
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
    db.query(`SELECT * FROM members WHERE id = $1`, [id], function (err, results) {

      // se der erro retornamos uma mensagem "Database error"
      if (err) throw `Database error! ${err}`

      // se ocorrer com exito nossa função, retornamos na callback o resultado com o objeto da posição 0 do array
      callback(results.rows[0])
    })
  },
  update(data, callback) {

    // estamos usando o UPDATE para fazer a atualização dos dados no BD
    const query = `
      UPDATE members SET
        avatar_url=($1),
        name=($2),
        email=($3)
        birth=($4),
        blood=($5),
        gender=($6),
        weight=($7),
        height=($8)
      WHERE id = $9
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
  }
}