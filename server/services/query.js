import db from '../util/db.js'

import { differenceInHours, differenceInMinutes, differenceInSeconds, isSameDay } from 'date-fns'

export default {
  async selectServices (offset) {
    const [ {count} ] = await db('service_orders').count()

    const trips = await db('tech_trips')
    .leftOuterJoin('employees', 'tech_trips.tech', '=', 'employees.NS_ID')

    const service = await db('service_orders')
    .leftOuterJoin('customers', 'service_orders.entity_name', '=', 'customers.entity_id')
    .leftOuterJoin('employees', 'service_orders.employee', '=', 'employees.NS_ID')
    .leftOuterJoin('equipment', 'service_orders.equipment', '=', 'equipment.NS_ID')
    .orderBy('service_orders.id', 'desc')
    .limit(100)
    .offset(offset)

    // Current date for init only
    const today = new Date()
    const findRelated = service.map(item => {
      const data = trips.filter(dbMatch => Number(dbMatch.trip_id) === Number(item.data_id))

      // Rewrite into a join
      const tripsDue = trips.filter(dbMatch => {
        const dateSet = new Date(dbMatch.date_set)
        return isSameDay(dateSet, today) && Number(dbMatch.trip_id) === Number(item.data_id)
      })
      //
      return {
        ...item,
        trips: data,
        tripsDue
      }
    })
    return {findRelated, count}
  },

  async selectTrips (serviceId) {
    const service = await db('service_orders')
    .where('data_id', serviceId)
    .orderBy('service_orders.id', 'desc')

    const trips = await db('tech_trips')
    .join('employees', 'tech_trips.tech', '=', 'employees.NS_ID')
    .where('trip_id', serviceId)

    const em = await db('employees')
    const equipment = await db('equipment')
    const contacts = await db('contacts')

    // Map all fields together

    const [findRequestingContact] = service.map(item => {
      const data = contacts.filter(dbMatch => Number(dbMatch.internal_id) === Number(item.requesting_contact))
      return data
    })
  

    const findEquipment = service.map(item => {
      const data = equipment.filter(dbMatch => Number(dbMatch.NS_ID) === Number(item.equipment))
      const [result] = data.map(itemName => { return itemName.name})
      return result
    })

    const [findContacts] = service.map(item => {
      const data = contacts.filter(dbMatch => dbMatch.entity_id === item.entity_name)
      return data
    })

    const findRelated = service.map(item => {
      const data = trips.filter(dbMatch => Number(dbMatch.trip_id) === Number(item.data_id))
      
    return {
      ...item,
      trips: data,
      equipment: findEquipment,
      contact_selected: findRequestingContact,
      contacts: findContacts
    }
    })
    return {findRelated}
  },

  async listTechs () {
    const technicians = await db('employees')
    .where('is_tech', 'T')

    return {technicians}
  },

  async selectComments (serviceId) {
    const technicians = await db('employees')
    .where('is_tech', 'T')

    const comments = await db('comments')
    .join('employees', 'comments.employee', '=', 'employees.NS_ID')
    .where('data_id', serviceId)
    .orderBy('comments.id', 'asc')

    return { comments, technicians }
  },

  async createComment (data) {
    const payload = {
      data_id: data.service,
      employee: data.techs,
      comment: data.comment,
      path: `http://localhost:5000/static`,
      file_name: [...data.file_name],
      date: data.date
    }

    await db('comments')
    .insert(
      payload
    )
  },

  async startTravel (data) {
    const payload = data
    await db('tech_trips')
    .update(
      {
        travel_start_time: payload.travel_start_time
      }
    )
    .where(
      {
        data_id: payload.data_id
      }
    )
  },

  async endTravel (data) {
    const payload = data
    const trips = await db('tech_trips')
    .where(
      {
        data_id: payload.data_id
      }
    )
    
    const getAccruedHours = () => {
      const currentAccrued = Number(trips[0].labor_travel)
      let accruedInstance = 0

      const start = Number(trips[0].travel_start_time)
      const end = Number(payload.travel_end_time)
      let differenceHours = Number(differenceInHours(end, start, 'floor'))
      let differenceMinutes = Number(differenceInMinutes(end, start))
      let differenceSeconds = Number(differenceInSeconds(end, start))

      if (differenceHours > 0) {
        accruedInstance = accruedInstance + differenceHours
        differenceMinutes = differenceMinutes - (differenceHours * 60)
        differenceSeconds = differenceSeconds - (differenceHours * 3600)
      }
      if (differenceMinutes > 0) {
        const decimal = differenceMinutes / 60
        accruedInstance = accruedInstance + (decimal)
        differenceSeconds = differenceSeconds - (differenceMinutes * 60)
      }
      if (differenceSeconds > 0) {
        const decimal = differenceSeconds / 3600
        accruedInstance = accruedInstance + (decimal)
      }
      const newTotal = currentAccrued + accruedInstance
      return newTotal
      }
    const totalAccrual = getAccruedHours()

    await db('tech_trips')
    .update(
      {
        travel_end_time: payload.travel_end_time,
        labor_travel: totalAccrual,
        travel_start_time: null,
        travel_end_time: null
      }
    )
    .where(
      {
        data_id: payload.data_id
      }
    )
  },

  async startLabor (data) {
    const payload = data
    await db('tech_trips')
    .update(
      {
        labor_start_time: payload.labor_start_time
      }
    )
    .where(
      {
        data_id: payload.data_id
      }
    )
  },

  async endLabor (data) {
    const payload = data
    const trips = await db('tech_trips')
    .where(
      {
        data_id: payload.data_id
      }
    )
    
    const getAccruedHours = () => {
      const currentAccrued = Number(trips[0].labor_hours)
      let accruedInstance = 0

      const start = Number(trips[0].labor_start_time)
      const end = Number(payload.labor_end_time)
      let differenceHours = Number(differenceInHours(end, start, 'floor'))
      let differenceMinutes = Number(differenceInMinutes(end, start))
      let differenceSeconds = Number(differenceInSeconds(end, start))

      if (differenceHours > 0) {
        accruedInstance = accruedInstance + differenceHours
        differenceMinutes = differenceMinutes - (differenceHours * 60)
        differenceSeconds = differenceSeconds - (differenceHours * 3600)
      }
      if (differenceMinutes > 0) {
        const decimal = differenceMinutes / 60
        accruedInstance = accruedInstance + (decimal)
        differenceSeconds = differenceSeconds - (differenceMinutes * 60)
      }
      if (differenceSeconds > 0) {
        const decimal = differenceSeconds / 3600
        accruedInstance = accruedInstance + (decimal)
      }
      const newTotal = currentAccrued + accruedInstance
      return newTotal
      }
    const totalAccrual = getAccruedHours()

    await db('tech_trips')
    .update(
      {
        labor_end_time: payload.travel_end_time,
        labor_hours: totalAccrual,
        labor_start_time: null,
        labor_end_time: null
      }
    )
    .where(
      {
        data_id: payload.data_id
      }
    )
  },

  async editHours (data) {
    const payload = data
    await db('tech_trips')
    .update(
      {
        labor_hours: payload.labor_hours,
        labor_travel: payload.labor_travel
      }
    )
    .where({
      data_id: payload.data_id
    })
  }
}