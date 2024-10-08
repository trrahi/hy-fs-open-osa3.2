// Otetaan ulkoiset kirjastot ja funktiot käyttöön
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
// Importit
const Contact = require('./models/contact')





// MIDDLEWARET
app.use(cors())
app.use(express.json())
app.use(
  morgan(':method :url :status :response-time ms :postRequestContent ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨')
)
app.use(express.static('dist'))

// Kustomoitu Morgan tokeni, joka palauttaa POST-pyyntöjen body contentin
morgan.token('postRequestContent', (req) => {
  if (req.method === 'POST') {
    let thing = req.body
    return JSON.stringify(thing)
  }
})





// REITIT PYYNNÖILLE
// JUURI ja INFO routet
app.get('/', (req, res) => {
  res.send('Olet juuressa')
})

app.get("/info", (req, res) => {
  Contact.find({})
    .then((result) => {
      let info = `Phonebook has info for ${result.length} people`;
      let date = new Date().toString();
      res.send(info + "<br>" + date);
    })
    .catch((error) => next(error));
});



// GET sisältö kokonaan
app.get('/api/persons', (req, res, next) => {
  Contact.find({}).then(contacts => {
    res.json(contacts)
  })
    .catch(error => next(error))
})

// GET tietty kontakti
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Contact.findById(id)
    .then(contact => {
      if (contact) {
        res.json(contact)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})





// DELETE kontakti
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Contact.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})






// POST uusi kontakti
app.post('/api/persons', (req, res, next) => {
  let reqBody = req.body
  const newContact = new Contact({
    name: reqBody.name,
    number: reqBody.number
  })
  newContact.save().then(addedContact => {
    res.json(addedContact)

    // Pidempi tapa jossa palautetaan koko puhelinluettelo
    // Contact.find({}).then(returnedContacts => {
    //   console.log("returnedContacts: ", returnedContacts);
    //   res.json(returnedContacts)
    // })
  })
    .catch(error => next(error))

})



// PUT päivitä kontaktin tiedot
app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body

  const updated = {
    name: body.name,
    number: body.number
  }

  Contact.findByIdAndUpdate(id, updated, { new: true, runValidators: true, context: 'query' })
    .then(updatedContact => {
      res.json(updatedContact)
    })
    .catch(error => next(error))
})





// Middleware pyynnöille, joilla on tuntematon osoite ja reitin toimintoja ei määritelty
const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error:
      'meow, this is an unknown endpoint. but what do i know, im just a smol cat',
  })
}
app.use(unknownEndpoint)

// Virheiden käsittely middleware
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res
      .status(400)
      .send({ error: 'Väärä ID virheidenkäsittelijässä 🛑' })
  } else if (error.name === 'ValidationError') {
    console.log('shit')
    return res.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)



// Käynnistetään palvelin.
const PORT = process.env.PORT
app.listen(PORT)
console.log(`Servu käynnis portis ${PORT} 🚢`)












// OLD CODE OLD CODE OLD CODE OLD CODE OLD CODE OLD CODE OLD CODE OLD CODE

// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:  ", request.path);
//   console.log("Body:  ", request.body);
//   console.log("🗿");
//   next();
// };
// app.use(requestLogger);