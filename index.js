const express = require('express')
const { response } = require('express')
const app = express()

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

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})