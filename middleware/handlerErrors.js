const handlerErrors = (error, request, response, next) => {
  console.error("MENSAJE DE ERROR: " + error.message);
  console.log("ERROR NAME: " + error.name);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

module.exports = handlerErrors;
