import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (request, response) => {
  response.send('Hello !')
})

app.get('/notification', (request, response) => {
  response.json([
    {
      id: 1,
      title: 'Notification 1',
      message: 'Notification Message 1'
    },
    {
      id: 2,
      title: 'Notification 2',
      message: 'Notification Message 2'
    },
    {
      id: 3,
      title: 'Notification 3',
      message: 'Notification Message 3'
    },
    {
      id: 4,
      title: 'Notification 4',
      message: 'Notification Message 4'
    },
    {
      id: 5,
      title: 'Notification 5',
      message: 'Notification Message 5'
    }
  ])
})

app.get('/list', (request, response) => {
  response.json([
    {
      id: 1,
      name: 'List 1',
      query: 'Query 1'
    },
    {
      id: 2,
      name: 'List 2',
      query: 'Query 2'
    },
    {
      id: 3,
      name: 'List 3',
      query: 'Query 3'
    },
    {
      id: 4,
      name: 'List 4',
      query: 'Query 4'
    },
    {
      id: 5,
      name: 'List 5',
      query: 'Query 5'
    }
  ])
})

app.post('/list', (request, response) => {
  const name = request.body.name
  const query = request.body.query

  if (name === undefined || query === undefined) {
    response.status(400).end()
    return
  }

  response.json({
    id: 5,
    name,
    query,
  })
})

// Postgres との同期が完了してからサーバを起動する
app.listen(process.env.PORT || 8000)

export default app
