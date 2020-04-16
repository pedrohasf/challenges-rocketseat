const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    response.status(400).send();
  }

  const { title, url, techs } = request.body;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  repositories[repositoryIndex].title = title;
  repositories[repositoryIndex].url = url;
  repositories[repositoryIndex].techs = techs;

  response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    response.status(400).send();
  }

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  repositories.splice(repositoryIndex, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    response.status(400).send();
  }
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  repositories[repositoryIndex].likes += 1;

  response.json(repositories[repositoryIndex]);
});

module.exports = app;
