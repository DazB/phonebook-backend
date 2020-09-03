require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const { response } = require('express')

morgan.token('body', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

const app = express()
// For GET requests, will check build folder if any static paths
// match the request
app.use(express.static('build'))
// Content Origin Resource Sharing allowed 
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5425436",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "0432-3213-432",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "040-12345643",
    id: 4
  },
]

/**
 * Routes
 */
app.get('/info', (req, res, next) => {
  Person
    .find({})
    .then(persons => {
      res.send(`
              <div>
                  <div>
                      Phonebook has info for ${persons.length} people
                  </div>
                  <div>
                      ${new Date()}
                  </div>
              </div>
          `)
      })
    .catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person
    .findById(req.params.id)
    .then(person => {
      res.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  // // If no name is included in body
  // if (!body.name) {
  //   return res.status(400).json({
  //     error: "hey babe what's your name",
  //   })
  // }

  // // If no number is included in body
  // if (!body.number) {
  //   return res.status(400).json({
  //     error: "hey babe what's your number",
  //   })
  // }

  // Initial validation all good. Add person to phonebook
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

// handler of requests with unknown endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// handler of requests with result to errors
const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send( { error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})