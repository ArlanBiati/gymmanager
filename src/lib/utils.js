module.exports = {
  age(timestamp) {
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
  date(timestamp) {
    // const date recebe a data de acordo com o timestamp
    const date = new Date(timestamp)

    // const year recebe o ano de acordo com o timestamp acima - utilizamos UTC para pegar de forma universal
    const year = date.getUTCFullYear()

    // const month recebe o mes de acordo com o timestamp acima - utilizamos UTC para pegar de forma universal
    const month = `0${date.getUTCMonth() + 1}`.slice(-2)

    // const day recebe o dia de acordo com o timestamp acima - utilizamos UTC para pegar de forma universal
    const day = `0${date.getUTCDate()}`.slice(-2)

    // retornamos os dados em forma de string na ordem yyyy-mm-dd
    return {
      iso: `${year}-${month}-${day}`,
      birthDay: `${day}/${month}`
    }
  }
}
