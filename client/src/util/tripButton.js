import trips from "../stores/trips"

export default {
  summary () {
    trips.update(data => {
      return {
        ...data,
        showSummary: !data.showSummary
      }
    })
  },
  showAllTrips () {
    trips.update(data => {
      return {
        ...data,
        showAll: !data.showAll
      }
    })
  }
}