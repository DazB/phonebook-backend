const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please give password dingus')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}` +
    `@fullstackopen.qyyfr.mongodb.net/phonebook-app`+
    `?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

// If provided with password, name and number
if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log('Person saved!')
        mongoose.connection.close()
    })
}

// If only provided with password
else if (process.argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then(persons => {
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

// Wrong number of parameters passed
else {
    console.log('Enter correct number of arguments')
}