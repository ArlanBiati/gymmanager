module.exports = {
  age: function (timestamp) {
    // const today recebe a data de hoje
    const today = new Date()

    // const birthDate recebe a data de acordo com o timestamp(tempo em milisegundos) informado
    const birthDate = new Date(timestamp)

    // variavel age recebeo valor do ano do momento - o ano do timestamp
    let age = today.getFullYear() - birthDate.getFullYear()

    // const month recebe o mes do momento - o mes do timestamp
    const month = today.getMonth() - birthDate.getMonth()

    // validação para ver se já fez aniversario ou não naquele ano e se deve colocar uma idade a mais
    if ((month < 0 || month == 0) && today.getDate() <= birthDate.getDate()) {
      age = age - 1
    }
    return age
  },
}
