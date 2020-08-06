const express = require('express')
const morgan = require('morgan')

morgan.token('body', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
  })

const app = express()

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

app.get('/info', (req, res) => {
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

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
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

    // If name already exists
    if (persons.map(person => person.name).includes(body.name)) {
        return res.status(400).json({
            error: `hey i've seen you before ${body.name}`,
        })
    }

    // Validation all good. Add person to phonebook
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})