const database = require("./database");

const getMovies = (req, res) => {
  // methode facile
  // let sql = "select * from movies";
  // const sqlValues = [];
  // if (req.query.color != null) {
  //   sql += " where color = ?";
  //   sqlValues.push(req.query.color);

  //   if (req.query.max_duration != null) {
  //     sql += " and duration <= ?";
  //     sqlValues.push(req.query.max_duration);
  //   }
  // } else if (req.query.max_duration != null) {
  //   sql += " where duration <= ?";
  //   sqlValues.push(req.query.max_duration);
  // }

  // database
  //   .query(sql, sqlValues)
  //   .then(([movies]) => {
  //     res.status(200).json(movies);
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     res.status(500).send("Error retrieving data from database");
  //   });
  // methode plus pousser

  const initialSql = "select * from movies";
  const where = [];

  if (req.query.color != null) {
    where.push({
      column: "color",
      value: req.query.color,
      operator: "=",
    });
  }
  if (req.query.max_duration != null) {
    where.push({
      column: "duration",
      value: req.query.max_duration,
      operator: "<=",
    });
  }

  database
    .query(
      where.reduce(
        (sql, { column, operator }, index) =>
          `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`,
        initialSql
      ),
      where.map(({ value }) => value)
    )
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
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
