require('dotenv').config()
const express = require('express')
const Person = require('./backend/person')
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

app.use(express.static(path.join(__dirname, 'backend/dist')))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    console.log(persons)
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => { 
  Person.findById(request.params.id).then(person => { 
    if (person) { 
      response.json(person) 
    } else { 
      response.status(404).end() 
    } 
  }) 
  .catch(error => next(error)) 
  }) 

app.put('/api/persons/:id', (request, response, next) => { 
  const { name, number } = request.body 

  Person.findById(request.params.id) 
    .then(person => { 
      if (!person) { 
        return response.status(404).end() 
      } 

      person.name = name 
      person.number = number 

      return person.save().then((updatedPerson) => { 
        response.json(updatedPerson) 
      }) 
    }) 
    .catch(error => next(error)) 
}) 

app.post('/api/persons', (request, response, next) => { 
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
      .catch(error => next(error))
}) 

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.use((request, response) => {
  response.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const errorHandler = (error, request, response, next) => { 
  console.error(error.message) 

  if (error.name === 'CastError') { 
    return response.status(400).send({ error: 'malformatted id' }) 
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error) 
} 

app.use(errorHandler) 

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})