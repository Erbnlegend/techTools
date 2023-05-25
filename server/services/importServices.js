import db from '../util/db.js'
import serviceOrders from '../serviceOrders-2.json' assert { type: 'json' }

export default {
  employees: await db('employees'),

  async removeNulls (serviceOrders) {
    for (const item of serviceOrders) {
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

  async importNew (serviceOrders) {
    // Get what is in service_orders
    // select only data_id column
    // compare to new serviceOrders incoming JSON
    // if there is an existing data_id in DB,
      // remove that from the working array from incoming JSON

    const dbData = await db('service_orders')
    .select('data_id')

    const findNewRecords = serviceOrders.filter(item => {
      const data = dbData.find(dbItem => Number(dbItem.data_id) === item.id)
      return data === undefined
    })
    const payload = findNewRecords.map(item => {
      return {
        data_id: item.id,
        entity_name: item.custrecord_cmms_eqsrv_customer_name,
        employee: item.owner,
        equipment: item.custrecord_cmms_eqsrv_equipment,
        service_order: item.name,
        status: item.custrecord_cmms_eqsrv_workflow_status,
        docs: item.custrecord_ads_documentation,
        requesting_contact: item.custrecord_cmms_eqsrv_requesting_contact,
        problem: item.custrecord_cmms_eqsrv_problem,
        short_description: item.custrecord_short_description,
        summary: item.custrecord_cmmseqsrvrpt_summary,
        address: item.custrecord_cmms_eqsrv_cust_addr_req,
        date_created: item.custrecord_cmms_date_created,
        date_modified: item.lastmodified
      }
    })
    if (payload.length === 0) return
    await db('service_orders')
      .insert(
        payload
      )
  },

  async importServices () {
    // Future call to Netsuite
    this.removeNulls(serviceOrders)

    const payload = serviceOrders.map( async item => {
      const data = await db('service_orders')
      .update(
        {
          data_id: item.id,
          entity_name: item.custrecord_cmms_eqsrv_customer_name,
          employee: item.owner,
          equipment: item.custrecord_cmms_eqsrv_equipment,
          service_order: item.name,
          status: item.custrecord_cmms_eqsrv_workflow_status,
          docs: item.custrecord_ads_documentation,
          requesting_contact: item.custrecord_cmms_eqsrv_requesting_contact,
          problem: item.custrecord_cmms_eqsrv_problem,
          short_description: item.custrecord_short_description,
          summary: item.custrecord_cmmseqsrvrpt_summary,
          address: item.custrecord_cmms_eqsrv_cust_addr_req,
          date_created: item.custrecord_cmms_date_created,
          date_modified: item.lastmodified
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
    this.importNew(serviceOrders)
    return console.log('services updated')
  }
}