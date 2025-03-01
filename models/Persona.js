const { Schema, model } = require("mongoose");

//creamos un schema

//EL ESQUEMA LE DICE A MONGODB COMO SON LAS PERSONAS
const personSchemma = new Schema({
  name: {
    type: String,
    minLength: 5,
    required: true,
  },
  number: String,
});

personSchemma.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

//ahora que tenemos un schema, creamos un modelo q lo use y a partir de ese poder crear instancias del modelo
const Persona = new model("Persona", personSchemma);

module.exports = Persona;
/* ejemplo de crear una instancia de un modelo
const persona = new Persona({
  name: "Federico",
  number: "123456",
});
persona.save().then(result => {
  console.log('persona saved!')
  mongoose.connection.close()
})
*/
