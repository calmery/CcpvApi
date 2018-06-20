import express from 'express'

const app = express()

app.get('/', (request, response) => {
  response.send('Hello !')
})

app.listen(process.env.PORT || 3000)

export default app
