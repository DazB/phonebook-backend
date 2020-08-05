const express = require('express')
const { json } = require('express')
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

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})