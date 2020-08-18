require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

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
app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
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
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person)
  })
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' }) 
    })
})

const generateId = () => {
  return Math.floor(Math.random() * 99999);
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  // If no name is included in body
  if (!body.name) {
    return res.status(400).json({
      error: "hey babe what's your name",
    })
  }

  // If no number is included in body
  if (!body.number) {
    return res.status(400).json({
      error: "hey babe what's your number",
    })
  }

  // // If name already exists
  // if (persons.map(person => person.name).includes(body.name)) {
  //     return res.status(400).json({
  //         error: `hey i've seen you before ${body.name}`,
  //     })
  // }

  // Validation all good. Add person to phonebook
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

// Goes here for unknown route. 404 message
const unknownEndpoint = (req, res) => {
  req.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})