export const showMenu = () => {
  const menu = document.querySelector('.hiddenMenu')
  menu.classList.toggle('hide')
  menu.classList.toggle('show')
}