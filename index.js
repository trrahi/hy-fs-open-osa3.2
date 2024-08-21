// Otetaan ulkoiset kirjastot ja funktiot käyttöön
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors")
require("dotenv").config()
// Importit
const Contact = require("./models/contact")





// MIDDLEWARET
app.use(cors())
app.use(express.json());
app.use(
  morgan(":method :url :status :response-time ms :postRequestContent ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨")
);
app.use(express.static("dist"))

// Kustomoitu Morgan tokeni, joka palauttaa POST-pyyntöjen body contentin
morgan.token("postRequestContent", (req, res) => {
  if (req.method == "POST") {
    let thing = req.body;
    return JSON.stringify(thing);
  }
});






// // Puhelinluettelon alkutila
// let phonebook = [
//       {
//         id: "1",
//         name: "Arto Hellas",
//         number: "666 666 666 6666",
//       },
//       {
//         id: "2",
//         name: "Ada Lovelace",
//         number: "39-44-5323523",
//       },
//       {
//         id: "3",
//         name: "Dan Abramov",
//         number: "12-43-234345",
//       },
//       {
//         id: "4",
//         name: "Mary Poppendick",
//         number: "020202",
//       },
// ]







// REITIT PYYNNÖILLE
// JUURI ja INFO routet
app.get("/", (req, res) => {
  res.send("Olet juuressa");
});

app.get("/info", (req, res) => {
  let info = `Phonebook has info for ${phonebook.length} people`;
  let date = new Date().toString();
  res.send(info + "<br>" + date);
});



// GET phonebookin sisältö kokonaan
app.get("/api/persons", (req, res) => {
  Contact.find({}).then(contacts => {
    res.json(contacts)
  })
  .catch(error => next(error))
});

// GET tietty kontakti phonebookista
app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Contact.findById(id)
  .then(contact => {
    if (contact) {
      res.json(contact)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
});





// DELETE kontakti
app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Contact.findByIdAndDelete(id)
  .then(()=> {
    res.status(204).end()
  })
  .catch(error => next(error))
  });






// POST uusi kontakti
app.post("/api/persons", (req, res) => {
  let reqBody = req.body;
  if (reqBody.name && reqBody.number) {
    const newContact = new Contact({
      name: reqBody.name,
      number: reqBody.number
    })
    newContact.save().then(addedContact =>{
      res.json(addedContact)

      // Pidempi tapa jossa palautetaan koko puhelinluettelo
      // Contact.find({}).then(returnedContacts => {
      //   console.log("returnedContacts: ", returnedContacts);
      //   res.json(returnedContacts)
      // })
    })
    .catch(error => next(error))

  } else {
    res.status(400).json({
      error: "Pitää ilmoittaa sekä lisättävän kontaktin nimi, että numero.",
    });
  }
});



// PUT päivitä kontaktin tiedot
app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id
  const body = req.body

  const updated = {
    name: body.name,
    number: body.number
  }

  Contact.findByIdAndUpdate(id, updated, {new: true})
  .then(updatedContact => {
    res.json(updatedContact)
  })
  .catch(error => next(error))
})





// Middleware pyynnöille, joilla on tuntematon osoite ja reitin toimintoja ei määritelty
const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error:
      "meow, this is an unknown endpoint. but what do i know, im just a smol cat",
  });
};
app.use(unknownEndpoint);

// Virheiden käsittely middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response
      .status(400)
      .send({ error: "Väärä ID virheidenkäsittelijässä 🛑" });
  }
  next(err);
};
app.use(errorHandler);



// Käynnistetään palvelin.
const PORT = process.env.PORT
app.listen(PORT);
console.log(`Servu käynnis portis ${PORT} 🚢`);












// OLD CODE OLD CODE OLD CODE OLD CODE OLD CODE OLD CODE OLD CODE OLD CODE 

// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:  ", request.path);
//   console.log("Body:  ", request.body);
//   console.log("🗿");
//   next();
// };
// app.use(requestLogger);