const db = require('mysql');

class Model {
  /**
   * tabel name that we work on fetch data or send data
   */
  tabelName = null;
  /**
   * connection object to communicate with the database with it
   */
  connection = null;
  /**
   * define the table name in the creation of the object and make a connection to the database
   * and save it to a connection variable to communicate with the database
  */
  constructor(tabelName) {
    this.tabelName = tabelName;
    this.connection = db.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'devtik_ms'
    })
  }
  /**
   * 
   * @param {*} callBack => take a function definetion to be excuted at the time the sql statement is excuted
   *                        it provided with a param that hold the data of the the sql statement excuted before
   *                        so we can handle it at the function definetion to do some operations on this sql result
   * @param {*} options => take a object that contains 3 constrains and do some operations depending on the statue
   *                       of this constrains
   *                       limit => limit the returned data of a query to provided number
   *                       where => make a conditional query depending on what is provided to this where
   *                       order => is an object that has a {by,type} keys and ordring the query result in this order
   * 
   * this function get data from initalized table name provided depending on passed options
   */
  get(callBack = data => { }, options = { limit: null, where: null, order: null }) {

    let { limit, where, order } = options
    let sqlStatment

    if (options == null)
      sqlStatment = `SELECT * FROM ${this.tabelName}`
    else if (limit == null && where == null && order == null)
      sqlStatment = `SELECT * FROM ${this.tabelName}`
    else if (limit != null && limit > 0 && where == null && order == null)
      sqlStatment = `SELECT * FROM ${this.tabelName} LIMIT ${limit}`
    else if (limit != null && limit > 0 && where != null && order == null)
      sqlStatment = `SELECT * FROM ${this.tabelName} WHERE ${where} LIMIT ${limit}`
    else if (limit != null && limit > 0 && where != null && order != null)
      sqlStatment = `SELECT * FROM ${this.tabelName} WHERE ${where} ORDER BY ${order.by} ${order.type} LIMIT ${limit}`
    else if (limit == null && where != null && order != null)
      sqlStatment = `SELECT * FROM ${this.tabelName} WHERE ${where} ORDER BY ${order.by} ${order.type}`
    else if (limit == null && where == null && order != null)
      sqlStatment = `SELECT * FROM ${this.tabelName} ORDER BY ${order.by} ${order.type}`
    else if (limit == null && where != null && order == null)
      sqlStatment = `SELECT * FROM ${this.tabelName} WHERE ${where}`

    this.connection.connect(connectionErr => {
      if (connectionErr) throw connectionErr;
      this.connection.query(sqlStatment, (queryErr, result) => {
        if (queryErr) throw queryErr;
        callBack(result)
      });
    });
  }

  add(data) {
    let cols = []
    let values = []
    for (const key in data) {
      cols.push(key)
      values.push(data[key])
    }
    this.connection.connect(connectionErr => {
      if (connectionErr) throw connectionErr;
      this.connection.query(`INSERT INTO ${this.tabelName} (${cols.join(", ")}) VALUES ('${values.join("', '")}')`, (queryErr) => {
        if (queryErr) throw queryErr;
        // console.log(`INSERT INTO ${this.tabelName} (${cols.join(", ")}) VALUES ('${values.join("', '")}')`)
      });
    });
  }

  delete(where) {
    this.connection.connect(connectionErr => {
      if (connectionErr) throw connectionErr;
      this.connection.query(`DELETE FROM ${this.tabelName} ${where}`, (queryErr) => {
        if (queryErr) throw queryErr;
      });
    });
  }

  update(data, where) {
    let cols = []
    let values = []
    for (const key in data) {
      cols.push(key)
      values.push(data[key])
    }
    this.connection.connect(connectionErr => {
      if (connectionErr) throw connectionErr;
      let sql = `UPDATE ${this.tabelName} SET`
      let final = cols.length - 1
      let counter = 0
      cols.forEach(col => {
        if (counter == final)
          sql += ` ${col} = '${values[counter]}'`
        else
          sql += ` ${col} = '${values[counter]}',`
        counter++
      });
      sql += ` WHERE ${where}`
      this.connection.query(sql, (queryErr) => {
        if (queryErr) throw queryErr;
        console.log(sql)
      });
    });
  }
}

// new Model("users").add({
//   id: 1,
//   fname: "eslam",
//   lname: "magdy",
//   email: "eslam3400@gmail.com"
// })

// new Model("users").update({
//   id: 2,
//   fname: "updated",
//   lname: "updated",
//   email: "updated"
// }, "id = 0")

// new Model('users').get({ where: "req.cookies.token" }, data => console.log(data[0].id))

module.exports = Model;