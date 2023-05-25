import user from "../stores/user"

export const userSelect = () => {
  const username = localStorage.getItem('user')
  if (!username) {
    user.update(data => {
      return {
        ...data,
        showUserForm: true
      }
    })
  }
  if (username) {
    user.update(data => {
      return {
        ...data,
        user: username,
        showUserForm: false
      }
    })
  }
}