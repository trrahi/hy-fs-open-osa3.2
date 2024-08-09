const express = require("express")
const app = express()


// Middleware
app.use(express.json())


let phonebook = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-523523",
  },
  {
    id: "3",
    name: "Dan Abramoc",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
];



// Routes
app.get("/", (req, res) => {
  res.send("Olet juuressa")
});

app.get("/api/persons", (req, res) => {
    res.json(phonebook)
    // res.send(phonebook)

});

app.get("/info", (req, res) => {
  let numberOfPersons = phonebook.length
  let info = `Phonebook has info for ${numberOfPersons} people`

  let date = new Date().toString()
  console.log(date);
  res.send(info + "<br>" +  date)
});

app.get("/api/persons/:id", (req, res) => {
  // console.log("req params", req.params);
  const id = req.params.id
  let person = phonebook.find(person => person.id === id)
  // console.log("id", id);
  // console.log("person", person);

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id
  let updatedPhonebook = phonebook.filter(person => person.id != id)
  // console.log("updated phonebook", updatedPhonebook);
  phonebook = updatedPhonebook
  // console.log(phonebook);
})

app.post("/api/persons/:id", (req, res) => {
  let newId = Math.floor(Math.random() * 99999);
  let reqBody = req.body

  let isPersonAlreadyThere = phonebook.find(person => person.name === reqBody.name) ? true : false

  if (isPersonAlreadyThere) {
    return res.status(400).json({
      error: "nimi pitää olla uniiikki!"
    })
  }

  
  if (reqBody.name && reqBody.number) {
      let newPerson = {
        id: newId,
        name: reqBody.name,
        number: reqBody.number,
      };
      console.log(newPerson);
      phonebook = phonebook.concat(newPerson)
      console.log("after concat", phonebook);
      res.json(phonebook)
  } else {
    res.status(400).json({
      error: "ei sisältöä!"
    })
  }



})

app.get("/test", (req, res) => {

  res.end()

})





// Port
const PORT = 3001
app.listen(PORT)
// console.log(`servu käynnis portis ${PORT}`);
