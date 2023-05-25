import axios from "axios"
import { isSameDay } from "date-fns"
import { get } from "svelte/store"

import currentMode from './mode.js'
import trips from "../stores/trips.js"

const url = currentMode.getMode()

export const submitHours = (e, id) => {
  const formData = new FormData(e.target)

  let returnedData = {}
  for (let field of formData) {
    const [key, value] = field
    returnedData[key] = value
  }

  const request = axios.post(`http://${url}/api/edithours`, returnedData)
  .then(() => {
    refresh(id)
  }).catch((err) => {
    console.log(err)
  })
}
const refresh = async (id) => {
  const req = await axios.get(`http://${url}/api/listtrips?serviceId=${id}`)
    .then(res => {
      trips.update(data => {
      return ({
        ...data,
        tripList: res.data.findRelated,
      })
    })
  }).then(() => {
    createDue()
  }).catch((err) => {
    console.log(err)
  })
}
const createDue = () => {
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
}

export const editTrip = (e) => {
  const data = e.target.value
  const editLabor = document.getElementById(data)
  const editForm = document.querySelector(`.trip${data}`)
  editForm.classList.toggle('show')
  editForm.classList.toggle('hide')
  editLabor.classList.toggle('show')
  editLabor.classList.toggle('hide')
}