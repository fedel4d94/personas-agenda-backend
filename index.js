require("dotenv").config(); //para usar variables de entorno
require("./mongo.js");
//lo de arriba es lo mismo q lo de abajo, como son modulos al requierirlos se ejecutan solos.
/*const connectDB = require("./mongo.js");
connectDB();*/
const Persona = require("./models/Persona.js");
const express = require("express");
const appAgenda = express();
const requestLogger = require("./middleware/loggerMiddleware.js");
//npm install cors -E para
// permite manejar solicitudes desde otros dominios (cross-origin).
//generalmente los navegadores bloquean peticiones si la api y el cliente estan en dominios diferentes.
const cors = require("cors");
const notFound = require("./middleware/notFound.js");
const handlerErrors = require("./middleware/handlerErrors.js");

appAgenda.use(cors());
appAgenda.use(express.json());
appAgenda.use(requestLogger);

appAgenda.get("/api/persons", (request, response) => {
  Persona.find({}).then((persons) => {
    response.json(persons);
  });
});

appAgenda.get("/info", (request, response) => {
  const date = new Date();
  const dateString = date.toString();
  const respuesta =
    "<h1>La Agenda tiene info de " +
    persons.length +
    " Persoans  </h1>" +
    dateString;
  response.send(respuesta);
});

appAgenda.get("/api/persons/:id", (request, response, next) => {
  const { id } = request.params;
  Persona.findById(id)
    .then((persona) => {
      if (persona) {
        response.json(persona);
      } else {
        console.log("no se encontro la persona con el id: " + id);
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

appAgenda.delete("/api/persons/:id", (request, response, next) => {
  const { id } = request.params;
  Persona.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));

  //response.status(204).end();
});

appAgenda.post("/api/persons", (request, response, next) => {
  const body = request.body;
  if (!body) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const newPerson = new Persona({
    name: body.name,
    number: body.number,
  });
  if (!newPerson.name || newPerson.name.trim().length === 0) {
    console.log("el Nombre esta vacio o es nulo/indefinido");
    response
      .status(404)
      .json({ error: "el Nombre esta vacio o es nulo/indefinido" });
  }
  if (!newPerson.number) {
    console.log("el Numero esta vacio o es nulo/indefinido");
    response
      .status(404)
      .json({ error: "el Numero esta vacio o es nulo/indefinido" });
  }

  Persona.findOne({ name: newPerson.name }).then((persona) => {
    if (persona) {
      return response
        .status(404)
        .json({ error: "el nombre: " + persona.name + " ya existe" });
    } else {
      newPerson
        .save()
        .then((savedPerson) => {
          response.json(savedPerson);
        })
        .catch((error) => next(error));
    }
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

appAgenda.use(unknownEndpoint);
appAgenda.use(notFound);
// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
appAgenda.use(handlerErrors);

const port = process.env.PORT;
appAgenda.listen(port);
console.log("Servidor ejcutandose en el puerto " + port);
