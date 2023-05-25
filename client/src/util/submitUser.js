import { get } from "svelte/store"
import user from "../stores/user"
import { userSelect } from "./userSelect"


export const submitUser = () => {
  const dropDownList = document.querySelector('#dropDownList')
    // @ts-ignore
  const dropDownValue = dropDownList.value
  user.update(data => {
    return {
      ...data,
      user: dropDownValue,
      showUserForm: false
    }
  })
  const userSet = get(user)
  localStorage.setItem('user', userSet.user)
  userSelect()
}

export const closeForm = () => {
  userSelect()
}