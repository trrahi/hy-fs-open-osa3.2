const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors")

// MIDDLEWARET
app.use(cors())
app.use(express.json());
app.use(
  morgan(":method :url :status :response-time ms :postRequestContent ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨")
);

// Kustomoitu Morgan tokeni, joka palauttaa POST-pyyntöjen body contentin
morgan.token("postRequestContent", (req, res) => {
  if (req.method == "POST") {
    let thing = req.body;
    return JSON.stringify(thing);
  }
});










// Puhelinluettelon alkutila
let phonebook = [
      {
        id: "1",
        name: "Arto Hellas",
        number: "666 666 666 6666",
      },
      {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523",
      },
      {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345",
      },
      {
        id: "4",
        name: "Mary Poppendick",
        number: "020202",
      },
]










// REITIT PYYNNÖILLE
app.get("/", (req, res) => {
  res.send("Olet juuressa");
});

// GET phonebookin sisältö kokonaan
app.get("/api/persons", (req, res) => {
  res.json(phonebook);
});

// GET tietty kontakti phonebookista
app.get("/api/persons/:id", (req, res) => {
  // console.log("req params", req.params);
  const id = req.params.id;
  let person = phonebook.find((person) => person.id === id);
  // console.log("id", id);
  // console.log("person", person);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});









// DELETE kontakti
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  // console.log("id from backend: ", id);
  // Filtteröidaan phonebook uudelleen siten, että pyynnön parametrin id omaava henkilö ei ole enää luettelossa
  let updatedPhonebook = phonebook.filter((person) => {
    // console.log(person);
    return person.id !== id;
  });
  // Jos updatedPhonebook ja phonebook ovat samaan pituisia, vastataan 404 koodilla, että henkilöä ei löytynyt
  if (updatedPhonebook.length == phonebook.length) {
    res.status(404).json({
      error: "Henkilöä ei löytynyt",
    });
  // Muussa tapauksessa lähetään onnistumisesta kertova statuskoodi ja päätetään pyyntö
  } else {
    console.log("backend, else happened");
    res.status(200).end();
  }
  // Päivitetään luettelo vastaamaan henkilön poiston mukaista luetteloa
  phonebook = updatedPhonebook;
  console.log("After deleting a person, this is from the backend", phonebook);

});











// POST uusi kontakti
app.post("/api/persons", (req, res) => {
  let newId = Math.floor(Math.random() * 9999999).toString()
  let reqBody = req.body;
  // console.log("reqBody: ", reqBody);

  // Tätä ei taideta tarvita, koska phonebook hoitaa nämä PUT pyynnöllä?
  let isPersonAlreadyThere = phonebook.find((person) => person.name === reqBody.name)
    ? true
    : false;

  if (isPersonAlreadyThere) {
    return res.status(400).json({
      error: "nimi pitää olla uniikki!",
    });
  }

  // Jos nimi ja puh. nro laitetaan tiedot newPerson olioon ja olion tiedot konkatenoidaan phonebookiiin uudeksi alkioksi.
  if (reqBody.name && reqBody.number) {
    let newPerson = {
      id: newId,
      name: reqBody.name,
      number: reqBody.number,
    };
    // console.log(newPerson);
    phonebook = phonebook.concat(newPerson);
    // console.log("After adding a new person, this is from the backend", phonebook);
    res.json(phonebook);
  } else {
    res.status(400).json({
      error: "ei sisältöä!",
    });
  }
});






app.get("/info", (req, res) => {
  let info = `Phonebook has info for ${phonebook.length} people`;
  let date = new Date().toString();
  res.send(info + "<br>" + date);
});


// Middleware pyynnöille, joilla on tuntematon osoite ja reitin toimintoja ei määritelty
const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error:
      "meow, this is an unknown endpoint. but what do i know, im just a smol cat",
  });
};
app.use(unknownEndpoint);

// Käynnistetään palvelin. ENV-muuttuja on Renderiä varten, jotta se voi avata haluamsa portin. Jos Renderin valitsema portti ei ole käytössä, käytetään porttia 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT);
// console.log(`servu käynnis portis ${PORT}`);












// OLD CODE OLD CODE OLD CODE OLD CODE OLD CODE OLD CODE OLD CODE OLD CODE 

// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:  ", request.path);
//   console.log("Body:  ", request.body);
//   console.log("🗿");
//   next();
// };
// app.use(requestLogger);