const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

let persons = [
    { 
      name: "Arto Hellas", 
      number: "040-123456",
      id: "1"
    },
    { 
      name: "Ada Lovelace", 
      number: "39-44-5323523",
      id: "2"
    },
    { 
      name: "Dan Abramov", 
      number: "12-43-234345",
      id: "3"
    },
    { 
      name: "Mary Poppendieck", 
      number: "39-23-6423122",
      id: "4"
    }]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(p => p.id === request.params.id)
    person ? response.json(person) : response.status(404).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number missing' })
    }
    if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({ error: 'name must be unique' })
      }
    if (persons.find(p => p.number === body.number)) {
        return response.status(400).json({ error: 'number must be unique' })
      }

    const person = {
      id: Math.floor(Math.random() * 1000000).toString(),
      name: body.name,
      number: body.number}
      console.log(person)

      persons=persons.concat(person)
      response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter(p => p.id !== request.params.id)
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})