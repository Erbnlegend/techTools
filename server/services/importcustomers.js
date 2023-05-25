import db from '../util/db.js'
import customers from '../customers.json' assert { type: 'json' }

export default {
  async removeNulls (customers) {
    for (const item of customers) {
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

  async importNew (customers) {
    const dbData = await db('customers')

    const findNewRecords = customers.filter(item => {
      const data = dbData.find(dbItem => dbItem.entity_id === item.entityid)
      return data === undefined
    })

    const payload = findNewRecords.map(item => {
      return {
        entity_id: item.entityid,
        sales_rep: item.salesrep,
        company_name: item.companyname
      }
    })
    if (payload.length === 0) return
    await db('customers')
      .insert(
        payload
      )
  },

  async importcustomers () {
    // Future call to Netsuite
    this.removeNulls(customers)

    const payload = customers.map( async item => {
      const data = await db('customers')
      .update(
        {
          entity_id: item.entityid,
          sales_rep: item.salesrep,
          company_name: item.companyname
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
    this.importNew(customers)
    return console.log('customers updated')
  }
}