import express from 'express'
import fs from 'fs-extra'
import path from 'path'
import multer from 'multer'
import services from './services/query.js'
import importServices from './services/importServices.js'
import importTrips from './services/importTrips.js'
import importEmployees from './services/importemployees.js'
import importEquip from './services/importequip.js'
import importcustomers from './services/importcustomers.js'
import importcontacts from './services/importcontacts.js'

import cors from 'cors'
import bodyParser from 'body-parser'

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, '../data/files')
   },
  filename: function (req, file, cb) {
      cb(null , file.originalname)
  }
})
var upload = multer({ storage: storage })
const app = express()

export const __dirname = path.dirname(new URL(import.meta.url).pathname)
export const rootPath = path.join(__dirname, '../')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/static', express.static('../data'))

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})


app.post('/api/upload', upload.array('files'), async (req, res) => {
  const files = req.files
  if (!files || files === undefined) {
    return res.status(400).send('No files were uploaded.')
  }

  // move uploaded files from temporary location to /files directory
  const errors = []
  const successes = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const tempPath = file.path
    const targetPath = path.join(rootPath, 'files', file.originalname)
    fs.rename(tempPath, targetPath, (err) => {
      if (err) {
        errors.push(file.originalname)
      } else {
        successes.push(file.originalname)
      }
      // if (errors.length + successes.length === files.length) {
      //   if (errors.length > 0) {
      //     res.status(500).send(`Failed to upload ${errors.length} files: ${errors.join(', ')}`)
      //   } else {
      //     res.send(`Uploaded ${successes.length} files successfully: ${successes.join(', ')}`)
      //   }
      // }
    })
  }
})

app.post('/api/addcomment', async (req, res) => {
  const comment = req.body
  try {
    const data = await services.createComment(comment)
    res.send(data)
  } catch (err) {
    console.error(err)
    const { message } = err

    if (message.includes('duplicate key')) {
      res.status(400)
      res.send({
        message: 'Duplicate'
      })
    }

    res.status(500)
    res.send({
      message
    })
  }
})

app.post('/api/starttravel', async (req, res) => {
  const time = req.body
  try {
    const data = await services.startTravel(time)
    res.send(data)
  } catch (err) {
    console.error(err)
    const { message } = err

    if (message.includes('duplicate key')) {
      res.status(400)
      res.send({
        message: 'Duplicate'
      })
    }

    res.status(500)
    res.send({
      message
    })
  }
})

app.post('/api/endtravel', async (req, res) => {
  const time = req.body
  try {
    const data = await services.endTravel(time)
    res.send(data)
  } catch (err) {
    console.error(err)
    const { message } = err

    if (message.includes('duplicate key')) {
      res.status(400)
      res.send({
        message: 'Duplicate'
      })
    }

    res.status(500)
    res.send({
      message
    })
  }
})

app.post('/api/startlabor', async (req, res) => {
  const time = req.body
  try {
    const data = await services.startLabor(time)
    res.send(data)
  } catch (err) {
    console.error(err)
    const { message } = err

    if (message.includes('duplicate key')) {
      res.status(400)
      res.send({
        message: 'Duplicate'
      })
    }

    res.status(500)
    res.send({
      message
    })
  }
})

app.post('/api/endlabor', async (req, res) => {
  const time = req.body
  try {
    const data = await services.endLabor(time)
    res.send(data)
  } catch (err) {
    console.error(err)
    const { message } = err

    if (message.includes('duplicate key')) {
      res.status(400)
      res.send({
        message: 'Duplicate'
      })
    }

    res.status(500)
    res.send({
      message
    })
  }
})

app.post('/api/edithours', async (req, res) => {
  const hours = req.body
  try {
    const data = await services.editHours(hours)
    res.send(data)
  } catch (err) {
    console.error(err)
    const { message } = err

    if (message.includes('duplicate key')) {
      res.status(400)
      res.send({
        message: 'Duplicate'
      })
    }

    res.status(500)
    res.send({
      message
    })
  }
})

app.get('/api/list', async (req, res) => {
  const offset = Number(req.query.offset)

  try {
    const data = await services.selectServices(offset)
    res.send(data)
  } catch (err) {
    console.error(err)
    const { message } = err

    res.status(500)
    res.send({
      message
    })
  }
})

app.get('/api/listtrips', async (req, res) => {
  const serviceId = Number(req.query.serviceId)

  try {
    const data = await services.selectTrips(serviceId)
    res.send(data)
  } catch (err) {
    console.error(err)
    const { message } = err

    res.status(500)
    res.send({
      message
    })
  }
})

app.get('/api/listcomments', async (req, res) => {
  const serviceId = Number(req.query.serviceId)

  try {
    const data = await services.selectComments(serviceId)
    res.send(data)
  } catch (err) {
    console.error(err)
    const { message } = err

    res.status(500)
    res.send({
      message
    })
  }
})

app.get('/api/listtechs', async (req, res) => {
  try {
    const data = await services.listTechs()
    res.send(data)
  } catch (err) {
    console.error(err)
    const { message } = err

    res.status(500)
    res.send({
      message
    })
  }
})

app.get('/api/importservices', async (req, res) => {
  try {
    const data = await importServices.importServices()
    res.send(data)
  } catch (err) {
    console.error(err)
    const { message } = err

      res.status(500)
      res.send({
      message
    })
  }
})

app.get('/api/importtrips', async (req, res) => {
  try {
    const data = await importTrips.importTrips()
    res.send(data)
  } catch (err) {
    console.error(err)
    const { message } = err

    res.status(500)
    res.send({
      message
    })
  }
})

app.get('/api/importemployees', async (req, res) => {
  try {
    const data = await importEmployees.importEmployees()
    res.send(data)
  } catch (err) {
    console.error(err)
    const { message } = err

    res.status(500)
    res.send({
      message
    })
  }
})

app.get('/api/importcontacts', async (req, res) => {
  try {
    const data = await importcontacts.importContacts()
    res.send(data)
  } catch (err) {
    console.error(err)
    const { message } = err

    res.status(500)
    res.send({
      message
    })
  }
})

app.get('/api/importequipment', async (req, res) => {
  try {
    const data = await importEquip.importEquip()
    res.send(data)
  } catch (err) {
    console.error(err)
    const { message } = err

    res.status(500)
    res.send({
      message
    })
  }
})

app.get('/api/importcustomers', async (req, res) => {
  try {
    const data = await importcustomers.importcustomers()
    res.send(data)
  } catch (err) {
    console.error(err)
    const { message } = err

    res.status(500)
    res.send({
      message
    })
  }
})

const listener = app.listen(5000, () => {
  console.log(`listening for calls on port ${listener.address().port}`)
})