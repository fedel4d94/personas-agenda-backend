const express = require("express");
const appAgenda = express();
const requestLogger = require("./loggerMiddleware");
//npm install cors -E para
// permite manejar solicitudes desde otros dominios (cross-origin).
//generalmente los navegadores bloquean peticiones si la api y el cliente estan en dominios diferentes.
const cors = require("cors");

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
appAgenda.use(cors());
appAgenda.use(express.json());
appAgenda.use(requestLogger);

appAgenda.get("/api/persons", (request, response) => {
  response.json(persons);
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

appAgenda.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const persona = persons.find((p) => p.id === id);
  if (persona) {
    response.json(persona);
  } else {
    response.status(404).end();
  }
});

appAgenda.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

appAgenda.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 9999999),
    name: body.name,
    number: body.number,
  };
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

  const persona = persons.find((p) => p.name === newPerson.name);

  if (persona) {
    response
      .status(404)
      .json({ error: "el nombre: " + persona.name + " ya existe" });
  } else {
    persons = persons.concat(newPerson);
    response.json(newPerson);
  }
});

appAgenda.use(unknownEndpoint);
const port = 3002;
appAgenda.listen(port);
console.log("Servidor ejcutandose en el puerto " + port);
