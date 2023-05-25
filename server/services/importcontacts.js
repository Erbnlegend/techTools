import db from '../util/db.js'
import contacts from '../contacts.json' assert { type: 'json' }

export default {
  async removeNulls (contacts) {
    for (const item of contacts) {
      for (const key in item) {
        if (Object.hasOwnProperty.call(item, key)) {
          const element = item[key]
          if (element === null) {
            delete item[key]
          }
        }
      }
    }
  },

  async importNew (contacts) {
    // Get what is in contacts
    // select only data_id column
    // compare to new contacts incoming JSON
    // if there is an existing data_id in DB,
      // remove that from the working array from incoming JSON

    const dbData = await db('contacts')
    .select('entity_id')

    const findNewRecords = contacts.filter(item => {
      const data = dbData.find(dbItem => Number(dbItem.entity_id) === item.ID)
      return data === undefined
    })

    const payload = findNewRecords.map(item => {
      return {
        entity_id: item.ID,
        internal_id: item.Internal_ID,
        name: item.Name,
        company_name: item.Company,
        email: item.Email,
        phone: item.Phone
      }
    })
    if (payload.length === 0) return
    await db('contacts')
      .insert(
        payload
      )
  },

  async importContacts () {
    // Future call to Netsuite
    this.removeNulls(contacts)

    const payload = contacts.map( async item => {
      const data = await db('contacts')
      .update(
        {
          entity_id: item.ID,
          internal_id: item.Internal_ID,
          name: item.Name,
          company_name: item.Company,
          email: item.Email,
          phone: item.Phone
        }
      )
      .where(
        {
          entity_id: item.ID
        }
      )
      if (data.length === 0) return
      return data
    })
    this.importNew(contacts)
    return console.log('contacts updated')
  }
}