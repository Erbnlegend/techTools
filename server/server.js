import people from './services/person.js'

export const init = async () => {
  await people.create('Aaron16', 'Test16', false, 'woohoo16@gmail.com')
}
init()