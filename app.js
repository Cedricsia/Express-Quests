require("dotenv").config();
const express = require("express");

const app = express();

const port = process.env.APP_PORT ?? 5000;

app.use(express.json());

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
app.get("/api/movies", movieHandlers.getMovies);

const { validateMovie } = require("./validator");
app.post("/api/movies", validateMovie, movieHandlers.postMovie);

app.get("/api/movies/:id", movieHandlers.getMovieById);
app.put("/api/movies/:id", movieHandlers.uptdateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

const userHandlers = require("./userHandler");
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUsersById);

const { validateUsers } = require("./validator");
app.post("/api/users", validateUsers, userHandlers.postUsers);

app.put("/api/users/:id", userHandlers.uptdateUser);
app.delete("/api/users/:id", userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
