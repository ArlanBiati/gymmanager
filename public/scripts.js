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