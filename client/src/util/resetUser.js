import user from "../stores/user"

export const resetUser = () => {
  const username = localStorage.getItem('user')
  if (username) {
    user.update(data => {
      return {
        ...data,
        showUserForm: true
      }
    })
  }
}