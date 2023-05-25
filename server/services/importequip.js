import db from '../util/db.js'
import equipment from '../equipment.json' assert { type: 'json' }

export default {
  async removeNulls (equipment) {
    for (const item of equipment) {
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

  async importNew (equipment) {
    // Get what is in equipment
    // select only data_id column
    // compare to new equipment incoming JSON
    // if there is an existing data_id in DB,
      // remove that from the working array from incoming JSON

    const dbData = await db('equipment')
    .select('NS_ID')

    const findNewRecords = equipment.filter(item => {
      const data = dbData.find(dbItem => Number(dbItem.NS_ID) === item.id)
      return data === undefined
    })

    const payload = findNewRecords.map(item => {
      return {
        NS_ID: item.id,
        name: item.name
      }
    })
    if (payload.length === 0) return
    await db('equipment')
      .insert(
        payload
      )
  },

  async importEquip () {
    // Future call to Netsuite
    this.removeNulls(equipment)

    const payload = equipment.map( async item => {
      const data = await db('equipment')
      .update(
        {
          NS_ID: item.id,
          name: item.name
        }
      )
      .where(
        {
          NS_ID: item.id
        }
      )
      if (data.length === 0) return
      return data
    })
    this.importNew(equipment)
    return console.log('equipment updated')
  }
}