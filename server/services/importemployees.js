import db from '../util/db.js'
import employees from '../employees.json' assert { type: 'json' }

export default {
  async removeNulls (employees) {
    for (const item of employees) {
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

  async importNew (employees) {
    const dbData = await db('employees')
    .select('NS_ID')

    const findNewRecords = employees.filter(item => {
      const data = dbData.find(dbItem => Number(dbItem.NS_ID) === item.id)
      return data === undefined
    })

    const payload = findNewRecords.map(item => {
      return {
        entity_id: item.entityid,
        NS_ID: item.id,
        is_tech: item.custentity_cmms_is_technician
      }
    })
    
    if (payload.length === 0) return
    await db('employees')
      .insert(
        payload
      )
  },

  async importEmployees () {
    // Future call to Netsuite
    this.removeNulls(employees)

    const payload = employees.map( async item => {
      const data = await db('employees')
      .update(
        {
          entity_id: item.entityid,
          NS_ID: item.id,
          is_tech: item.custentity_cmms_is_technician
        }
      )
      .where(
        {
          entity_id: item.entityid
        }
      )
      if (data.length === 0) return
      return data
    })
    this.importNew(employees)
    return console.log('employees updated')
  }
}