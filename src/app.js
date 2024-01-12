const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  try {
    repositories.push(repository);
    return response.status(200).json(repository);
  } catch (e) {
    console.log(e);
    return response.status(400).json({ message: `Error: ${e}` });
  }
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if ( repositoryIndex < 0 ) {
    return response.status(400).json({error: "Repository not found"})
  }

  const repository = {
    id: id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  try {
    repositories[repositoryIndex] = repository;
    return response.status(200).json(repository);
  } catch (e) {
    console.log(e);
    return response.status(400).json({ message: `Error: ${e}` });
  };
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if ( repositoryIndex < 0 ) {
    return response.status(400).json({error: "Repository not found"})
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  };

  repositories[repositoryIndex].likes += 1;

  return response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;