import comments from "../stores/comments"
import user from "../stores/user"
import { get } from 'svelte/store'
import axios from "axios"
import { format } from "date-fns"

import currentMode from './mode.js'
import { userSelect } from "./userSelect"
const url = currentMode.getMode()

export const submitComment = async (e) => {
  const commentvalue = document.getElementById('comment')
  const inputFiles = document.getElementById('files')

  const service = get(comments)
  const userStore = get(user)

  if (!userStore.user) {
    userSelect()
    return
  }

  // @ts-ignore
  inputFiles.value = null
  const formData = new FormData(e.target)

  service.files.forEach(item => {
    formData.append('files', item, item.name )
  })
  const nameArray = service.files.map(item => {
    return item.name
  })

  let returnedData = {
    service: service.service,
    file_name: nameArray,
    techs: userStore.user
  }

  for (let field of formData) {
    const [key, value] = field
    returnedData[key] = value
  }

  const relateTech = () => {
    const [tech] = service.technicians.filter(item => Number(item.NS_ID) === Number(returnedData.techs))
    return tech
  }

  const assignedTech = relateTech()
  if (url === '10.10.20.72') {
    returnedData = {...returnedData, path: `http://${url}:5000/static`, entity_id: assignedTech.entity_id, date: format(new Date(), 'MM-dd-yyyy HH:mm:ss') }
  } else {
    returnedData = {...returnedData, path: `http://${url}/static`, entity_id: assignedTech.entity_id, date: format(new Date(), 'MM-dd-yyyy HH:mm:ss') }
  }
  
  setTimeout(() => {
    comments.update(newComment => {
      return {
        ...newComment,
        comments: [...newComment.comments, returnedData ],
        files: []
      }
    })
  },1000)
  // @ts-ignore
  commentvalue.value = ''

  const deleteImages = () => {
    const commentInput = document.getElementById('commentInput')
    while (commentInput.firstChild) {
      commentInput.firstChild.remove()
    }
  }
  deleteImages()

  const postComment = await axios.post(`http://${url}/api/addcomment`, returnedData )

  const postFiles = await axios.post(`http://${url}/api/upload`, formData )

  return { postComment, postFiles }
}