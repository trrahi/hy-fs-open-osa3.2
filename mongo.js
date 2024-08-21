const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]
const url = `mongodb+srv://hy-fs-open-tr:${password}@hy-fs-open.swfbr.mongodb.net/puhelinluettelo?retryWrites=true&w=majority&appName=hy-fs-open`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})


const Contact = mongoose.model('Contact', personSchema)

// console.log("pituus: ", process.argv.length);
// console.log("argit: ", process.argv);

if (process.argv.length > 3) {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  })
  contact.save().then(() => {
    console.log('tallennettu: ', contact)
    mongoose.connection.close()
  })
} else {
  console.log('Phonebook:')
  Contact.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })
}


