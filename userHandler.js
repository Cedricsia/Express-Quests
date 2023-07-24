const database = require("./database");

const getUsers = (req, res) => {
  //methode 1
  // let sql = "SELECT * FROM users";
  // const sqlValue = [];
  // if (req.query.city != null) {
  //   sql += " where city = ?";
  //   sqlValue.push(req.query.city);

  //   if (req.query.language != null) {
  //     sql += " and  language = ? ";
  //     sqlValue.push(req.query.language);
  //   }
  // } else if (req.query.language != null) {
  //   sql += " where language = ? ";
  //   sqlValue.push(req.query.language);
  // }
  // database
  //   .query(sql, sqlValue)
  //   .then(([users]) => {
  //     res.json(users);
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     res.status(500).send("Error retrieving data from database");
  //   });
  //methonde 2
  const initialSql = "SELECT * FROM users";
  const where = [];
  if (req.query.city != null) {
    where.push({
      column: "city",
      value: req.query.city,
      operator: "=",
    });
  }
  if (req.query.language != null) {
    where.push({
      column: "language",
      value: req.query.language,
      operator: "=",
    });
  }
  database
    .query(
      where.reduce(
        (sql, { column, operator }, index) =>
          `${sql}${index === 0 ? " where " : " and "}${column} ${operator} ?`,
        initialSql
      ),
      where.map(({ value }) => value)
    )
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUsersById = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("select * from users where id = ?", [id])
    .then(([users]) => {
      if (users[0] != null) {
        res.json(users[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};
const postUsers = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;
  database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    });
};
const uptdateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, city, language } = req.body;
  database
    .query(
      "UPDATE users set firstname= ?, lastname= ?, email= ?, city= ?, language= ? where id= ?",
      [firstname, lastname, email, city, language, id]
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
const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("DELETE FROM users where id= ?", [id])
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
  getUsers,
  getUsersById,
  postUsers,
  uptdateUser,
  deleteUser,
};
