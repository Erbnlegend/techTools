import contact from "../stores/contact"

export const contactInfo = (e) => {
  const contactList = document.querySelector('#contactList')
  // @ts-ignore
  const dropDownValue = contactList.value
  contact.update(data => {
    return {
      ...data,
      contact: Number(dropDownValue),
      selected: true

    }
  })
}

export const switchContact = () => {
  contact.update(data => {
    return {
      ...data,
      switch: true
    }
  })
}