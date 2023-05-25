import { format, isSameDay } from "date-fns"
import axios from "axios"
import { get } from "svelte/store"
import trips from "../stores/trips.js"

import currentMode from './mode.js'
const url = currentMode.getMode()

export default {
  async refresh (id) {
    const req = await axios.get(`http://${url}/api/listtrips?serviceId=${id}`)
      .then(res => {
        trips.update(data => {
        return ({
          ...data,
          tripList: res.data.findRelated,
        })
      })
      }).then(() => {
        this.createDue()
      }).catch((err) => {
        console.log(err)
      })
  },

  async createDue () {
    const getTrips = get(trips)
    const date = new Date(getTrips.date)
    const tripsList = getTrips.tripList[0].trips
    const createTripsDue = tripsList.filter(dbMatch => {
    const dateSet = new Date(dbMatch.date_set)
      return isSameDay(dateSet, date)
    })
    trips.update(data => {
      return {
        ...data,
        tripsDue: createTripsDue
      }
    })
  },

  async startTravel (e, id) {
    const data = {
      data_id: e.target.value,
      travel_start_time: Date.now()
    }
    const request = await axios.post(`http://${url}/api/starttravel`, data)
    .then(()=> {
      this.refresh(id)
    }).catch((err) => {
      console.log(err)
    })
  },

  async endTravel (e, id) {
    const data = {
      data_id: e.target.value,
      travel_end_time: Date.now()
    }
    const request = await axios.post(`http://${url}/api/endtravel`, data)
    .then(() => {
      this.refresh(id)
    }).catch((err) => {
      console.log(err)
    })
  },

  async startLabor (e, id) {
    const data = {
      data_id: e.target.value,
      labor_start_time: Date.now()
    }
    const request = await axios.post(`http://${url}/api/startlabor`, data)
    .then(()=> {
      this.refresh(id)
    }).catch((err) => {
      console.log(err)
    })
  },

  async endLabor (e, id) {
    const data = {
      data_id: e.target.value,
      labor_end_time: Date.now()
    }
    const request = await axios.post(`http://${url}/api/endlabor`, data)
    .then(() => {
      this.refresh(id)
    }).catch((err) => {
      console.log(err)
    })
    }
  }