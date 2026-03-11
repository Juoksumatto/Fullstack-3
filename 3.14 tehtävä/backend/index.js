require('dotenv').config()
const express = require('express')
const Person = require('./person')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    console.log('connnected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    console.log(persons)
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
})

app.post('/api/persons', (request, response) => { 
    const body = request.body 

    if (!body.name || !body.number) { 
        return response.status(400).json({ error: 'name or number missing' }) 
    } 

    const person = new Person({ 
      name: body.name, 
      number: body.number 
    }) 

    person.save() 
      .then(savedPerson => { 
        response.json(savedPerson) 
      }) 

      .catch(error => { 
        console.log(error) 
        response.status(500).json({ error: 'failed to save person' }) 
      })}) 

app.delete('/api/persons/:id', (request, response) => {
    persons = Persons.filter(p => p.id !== request.params.id)
    response.status(204).end()
})

app.use((request, response) => {
  response.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})