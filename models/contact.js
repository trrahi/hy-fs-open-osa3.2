// Mongo DB ja Mongoose määrittelyt
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URI

// Muodostetaan yhteys Mongooseen
mongoose.connect(url)
.then(result => {
    console.log("Yhdistetty Mongoon! 🫶");
})
.catch((error) => {
    console.log("Virhe yhdistäessä Mongoon: ", error.message);
})

// Luodaan koodin sisäinen skeema 
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// Määritellään palautettavien asioiden muoto
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});


// Exportoidaan model
module.exports = mongoose.model("Contact", personSchema)