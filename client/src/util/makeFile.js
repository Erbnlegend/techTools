import comments from "../stores/comments"
import { get } from 'svelte/store'

export const handleDrop = (e) => {
  const commentInput = document.getElementById('commentInput')
  const inputForm = document.getElementById('inputForm')
  const comment = document.getElementById('comment')
  comment.style.paddingBottom = '10px'
  // @ts-ignore
  comment.placeholder = 'type, paste or drop'
  const files = [...e.dataTransfer.items]
  if (files) {
    files.forEach(async ( item, i) => {
    if (item.kind === "file") {
      const file = item.getAsFile()
      const fileData = await fetch(file)
      .then(res => res.blob()
      .then(blob => {
        const [clean] = file.name.match(/^([^.]+)/g)
        const cleanSpace = clean.replace(/\s/g, '' )
        const newFile = new File([file], `${cleanSpace}_${Math.floor(Date.now() * Math.random()).toString()}.${file.type.match(/[^\/]+$/gm)}`, { type: file.type})
        return newFile
      }))
      comments.update(comment => {
        return {
          ...comment,
          files: [...comment.files, fileData]
        }
      })
    }
  })
  } else {
    // Use DataTransfer interface to access the file(s)
    [...e.dataTransfer.files].forEach((file, i) => {

      console.log(`… file[${i}].name = ${file}`)
    })
  }
}

export const handleSelect = (e) => {
  const filesInput = document.getElementById('files')
  filesInput.style.paddingBottom = '10px'

  const files = [...e.target.files]
  if (files) {
    files.forEach(async ( item, i) => {
    if (files.length > 0) {
      console.log(item)
      const fileData = await fetch(item)
      .then(res => res.blob()
      .then(blob => {
        const [clean] = item.name.match(/^([^.]+)/g)
        const cleanSpace = clean.replace(/\s/g, '' )
        if (item.type === 'text/plain') {
          const newFile = new File([item], `${cleanSpace}_${Math.floor(Date.now() * Math.random()).toString()}.txt`, { type: 'text/plain'})
          return newFile
        }
        else if (item.type === '') {
          const newFile = new File([item], `${cleanSpace}_${Math.floor(Date.now() * Math.random()).toString()}.txt`, { type: 'text/plain'})
          return newFile
        }
        else {
          const newFile = new File([item], `${cleanSpace}_${Math.floor(Date.now() * Math.random()).toString()}.${item.type.match(/[^\/]+$/gm)}`, { type: item.type})
          return newFile
        }
       
      }))
      // @ts-ignore
      comments.update(comment => {
        return {
          ...comment,
          files: [...comment.files, fileData]
        }
      })
    }
  })
  } else {
    // Use DataTransfer interface to access the file(s)
    [...e.dataTransfer.files].forEach((file, i) => {

      console.log(`… file[${i}].name = ${file}`)
    })
  }
}

export const handleDragover = (e) => {
  const comment = document.getElementById('comment')
  comment.style.paddingBottom = '60px'
  // @ts-ignore
  comment.placeholder = 'Drop Here'
}

export const handleDragleave = (e) => {
  const comment = document.getElementById('comment')
  comment.style.paddingBottom = '10px'
  // @ts-ignore
  comment.placeholder = 'type, paste or drop'
}

export const handlePaste = async (e) => {
  const parser = new DOMParser()
  const commentInput = document.getElementById('commentInput')
  const comment = document.getElementById('comment')
  const data = e.clipboardData.getData('text/html')
  const newData = parser.parseFromString(data, "text/html")
  
  if (newData.images.length === 0) {
    const data = e.clipboardData.getData('text')
    e.target.value = `${e.target.value}${data}`
    return
  }

  const image = newData.images[0]
  const source = image.src

  if (source.includes('http')) {

    if (source.includes('gif')) {
      const fileData = await fetch(source)
      .then(res => res.blob()
      .then(blob => {
        const file = new File([blob], `${Math.floor(Date.now() * Math.random()).toString()}.gif`, { type: 'image/gif'})
        return file
      }))
      comments.update(comment => {
        return {
          ...comment,
          files: [...comment.files, fileData]
        }
      })
      const createImg = document.createElement('img')
      createImg.setAttribute('src', source)
      createImg.classList.add('commentImage')
      commentInput.append(createImg)
      console.log(get(comments))
      return
    }

    else if (source.includes('png')) {
      const fileData = await fetch(source)
      .then(res => res.blob()
      .then(blob => {
        const file = new File([blob], `${Math.floor(Date.now() * Math.random()).toString()}.png`, { type: 'image/png'})
        return file
      }))
      comments.update(comment => {
        return {
          ...comment,
          files: [...comment.files, fileData]
        }
      })
      const createImg = document.createElement('img')
      createImg.setAttribute('src', source)
      createImg.classList.add('commentImage')
      commentInput.append(createImg)
      return
    }

    else if (source.includes('jpg')) {
      const fileData = await fetch(source)
      .then(res => res.blob()
      .then(blob => {
        const file = new File([blob], `${Math.floor(Date.now() * Math.random()).toString()}.jpg`, { type: 'image/jpg'})
        return file
      }))
      comments.update(comment => {
        return {
          ...comment,
          files: [...comment.files, fileData]
        }
      })
      const createImg = document.createElement('img')
      createImg.setAttribute('src', source)
      createImg.classList.add('commentImage')
      commentInput.append(createImg)
      return
    }

    else if (source.includes('jpeg')) {
      const fileData = await fetch(source)
      .then(res => res.blob()
      .then(blob => {
        const file = new File([blob], `${Math.floor(Date.now() * Math.random()).toString()}.jpg`, { type: 'image/jpeg'})
        return file
      }))
      comments.update(comment => {
        return {
          ...comment,
          files: [...comment.files, fileData]
        }
      })
      const createImg = document.createElement('img')
      createImg.setAttribute('src', source)
      createImg.classList.add('commentImage')
      commentInput.append(createImg)
      return
    }
    else {
      console.log('kill')
      comment.style.borderColor = 'red'
      setTimeout(() => {
        comment.style.borderColor = 'rgba(0, 0, 0, .5)'
      }, 1000)
      return
    }
  }

  if (source !== 'http') {
    const fileData = await fetch(source)
    .then(res => res.blob()
    .then(blob => {
      const file = new File([blob], `${Math.floor(Date.now() * Math.random()).toString()}.${source.match(/[^:/]\w+(?=;|,)/)[0]}`, { type: source.match(/^data:(.+);base64/)?.[1]})
      console.log(file.name)
      return file
    }))
    comments.update(comment => {
      return {
        ...comment,
        files: [...comment.files, fileData]
      }
    })
    const createImg = document.createElement('div')
    createImg.style.backgroundImage = `url(${source})`
    createImg.classList.add('previewImage')
    commentInput.append(createImg)
    return
  }
}