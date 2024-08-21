// Mongo DB ja Mongoose määrittelyt
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

// Muodostetaan yhteys Mongooseen
mongoose.connect(url)
  .then(() => {
    console.log('Yhdistetty Mongoon! 🫶')
  })
  .catch((error) => {
    console.log('Virhe yhdistäessä Mongoon: ', error.message)
  })

// Luodaan koodin sisäinen skeema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: v => /\d{2}-\d{6}/.test(v),
      message: thing => `${thing.value} ei ole käypä puhelinnumero!`
    },
    required: true
  }
})

// Määritellään palautettavien asioiden muoto
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})


// Exportoidaan model
module.exports = mongoose.model('Contact', personSchema)