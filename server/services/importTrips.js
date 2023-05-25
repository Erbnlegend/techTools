import db from '../util/db.js'
import techTrips from '../techTrips.json' assert { type: 'json' }

export default {
  async removeNulls (techTrips) {
    for (const item of techTrips) {
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

  async importNew (techTrips) {
    // Get what is in service_orders
    // select only data_id column
    // compare to new serviceOrders incoming JSON
    // if there is an existing data_id in DB,
      // remove that from the working array from incoming JSON

    const dbData = await db('tech_trips')
    .select('data_id')

    const findNewRecords = techTrips.filter(item => {
      const data = dbData.find(dbItem => Number(dbItem.data_id) === item.id)
      return data === undefined
    })

    const payload = findNewRecords.map(item => {
      if (!item.custrecord_cmms_techtimealloc_totallabor) {
        item.custrecord_cmms_techtimealloc_totallabor = 0
      }
      if (!item.custrecord_cmms_techtimealloc_totaltrave) {
        item.custrecord_cmms_techtimealloc_totaltrave = 0
      }
      return {
        data_id: item.id,
        trip_id: item.custrecord_cmms_techtimealloc_srvc_order,
        tech: item.custrecord_cmms_techtimealloc_tech,
        arrived: item.custrecord_cmms_techtimealloc_arrivetime,
        date_set: item.custrecord_cmms_techtimealloc_date,
        date_depart: item.custrecord_cmms_techtimealloc_departtime,
        allocated_hours: item.custrecord_cmms_techtimealloc_hours,
        labor_hours: item.custrecord_cmms_techtimealloc_totallabor,
        labor_travel: item.custrecord_cmms_techtimealloc_totaltrave,
        created: item.created,
        last_modified: item.lastmodified
      }
    })
    if (payload.length === 0) return
    await db('tech_trips')
      .insert(
        payload
      )
  },

  async importTrips () {
    // future call to netsuite
    this.removeNulls(techTrips)

    const payload = techTrips.map( async item => {
    if (!item.custrecord_cmms_techtimealloc_totallabor) {
      item.custrecord_cmms_techtimealloc_totallabor = 0
    }
    if (!item.custrecord_cmms_techtimealloc_totaltrave) {
      item.custrecord_cmms_techtimealloc_totaltrave = 0
    }
    const data = await db('tech_trips')
    .update(
      {
        data_id: item.id,
        trip_id: item.custrecord_cmms_techtimealloc_srvc_order,
        tech: item.custrecord_cmms_techtimealloc_tech,
        arrived: item.custrecord_cmms_techtimealloc_arrivetime,
        date_set: item.custrecord_cmms_techtimealloc_date,
        date_depart: item.custrecord_cmms_techtimealloc_departtime,
        allocated_hours: item.custrecord_cmms_techtimealloc_hours,
        labor_hours: item.custrecord_cmms_techtimealloc_totallabor,
        labor_travel: item.custrecord_cmms_techtimealloc_totaltrave,
        created: item.created,
        last_modified: item.lastmodified
      }
    )
    .where(
      {
        data_id: item.id
      }
    )
    if (data.length === 0) return
    return data
    })
    this.importNew(techTrips)
    return console.log('trips updated')
  }
}