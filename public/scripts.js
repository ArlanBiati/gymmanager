// pega o caminho da nossa página após a raiz
const currentPage = location.pathname

// menuItems recebe a tag A
const menuItems = document.querySelectorAll('header .nav a')

//  fazemos um for para pegar o item dentro do menu e validar se o caminho da págia é correspondente ao href passado na tag A. Caso seja o mesmo caminho, adicionamos uma classe de nome Active
for (item of menuItems) {
  if (currentPage.includes(item.getAttribute('href'))) {
    item.classList.add('active')
  }
}

// paginação

function paginate(selectedPage, totalPages) {

  // variavel pages é um array vazio que sera preenchido de acordo com a quantidade de dados
  let pages = []

  let oldPage

  // enquanto o currentPage for menor que o totalPages, incremente mais um
  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {

    const firstAndLastPage = currentPage == 1 || currentPage == totalPages
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

    if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {


      if (oldPage && currentPage - oldPage > 2) {
        pages.push('...')
      }

      if (oldPage && currentPage - oldPage === 2) {
        pages.push(oldPage + 1)
      }

      pages.push(currentPage)
      oldPage = currentPage
    }
  }
  return pages
}

function createPagination(pagination) {
  const filter = +pagination.dataset.filter
  const page = +pagination.dataset.page
  const total = +pagination.dataset.total
  const pages = paginate(page, total)

  let elements = ""

  for (let page of pages) {
    if (String(page).includes("...")) {
      elements += `<span>${page}</span>`
    } else {
      if (filter) {
        elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
      } else {
        elements += `<a href="?page=${page}">${page}</a>`
      }
    }
  }

  pagination.innerHTML = elements
}
const pagination = document.querySelector(".pagination")

if (pagination) {
  createPagination(pagination)
}
