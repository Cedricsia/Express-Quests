const database = require("./database");

const getMovies = (req, res) => {
  database.query("SELECT * FROM movies").then(([result]) => {
    res.status(200).json(result);
  });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("select * from movies where id = ?", [id])
    .then(([movie]) => {
      if (movie != null) {
        res.json(movie);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;
  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.location(`/api/movies/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    });
};
const uptdateMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, director, year, color, duration } = req.body;
  database
    .query(
      "UPDATE movies set title= ?, director= ?, year= ?, color= ?, duration= ? where id= ?",
      [title, director, year, color, duration, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.statut(404).send("Not found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the movie");
    });
};
const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("DELETE FROM movies where id= ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.statut(404).send("Not found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting the movie");
    });
};

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  uptdateMovie,
  deleteMovie,
};
