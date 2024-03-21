console.log("Working")

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('dist'))
app.use(cors())





morgan.token('body', (req, res) => JSON.stringify(req.body));


app.use(express.json())

app.use(morgan(':method :url :status :total-time[3] - :response-time[3] ms :body'))



let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    console.log("GET PERSONS")
    response.json(persons)
  })
  
app.get('/info', (request, response) => {
    const numberofpersons = persons.length
    const currentDate = new Date()

    const options = {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
    }

    const formattedDate = currentDate.toLocaleString('en-US', options);

    const message = "<p>Phonebook has info for " + numberofpersons + " people <br/>" + formattedDate + "</p>"
    response.send(message)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })


  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    console.log("Person deleted")
    response.status(204).end()
  })


  app.post('/api/persons', (request, response) => {

    const body = request.body
    const personlist = persons.map(person=>person.name)
    console.log("Got ", body)
    
    
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    else if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }
    else if (personlist.includes(body.name)) {
        console.log("Person already exists")
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }
  
    const id = Math.floor((Math.random() * 1000000) + 1)

    const person = {
        id: id,
        name: body.name,
        number: body.number,
        
    }
    console.log("ADDING ", person )
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
