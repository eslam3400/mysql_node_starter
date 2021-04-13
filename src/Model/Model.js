const db = require('mysql');

class Model {

  tabelName = null;
  connection = null;

  constructor(tabelName) {
    this.tabelName = tabelName;
    this.connection = db.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'devtik_ms'
    })
  }

  get(options = { limit: null, where: null, order: null }, callBack = data => { }) {
    let { limit, where, order } = options
    if (limit == null && where == null && order == null)
      this.connection.connect(connectionErr => {
        if (connectionErr) throw connectionErr;
        this.connection.query(`SELECT * FROM ${this.tabelName}`, (queryErr, result) => {
          if (queryErr) throw queryErr;
          callBack(result)
        });
      });
    if (limit != null && limit > 0 && where == null && order == null)
      this.connection.connect(connectionErr => {
        if (connectionErr) throw connectionErr;
        this.connection.query(`SELECT * FROM ${this.tabelName} LIMIT ${limit}`, (queryErr, result) => {
          if (queryErr) throw queryErr;
          callBack(result)
        });
      });
    if (limit != null && limit > 0 && where != null && order == null)
      this.connection.connect(connectionErr => {
        if (connectionErr) throw connectionErr;
        this.connection.query(`SELECT * FROM ${this.tabelName} WHERE ${where} LIMIT ${limit}`, (queryErr, result) => {
          if (queryErr) throw queryErr;
          callBack(result)
        });
      });
    if (limit != null && limit > 0 && where != null && order != null)
      this.connection.connect(connectionErr => {
        if (connectionErr) throw connectionErr;
        this.connection.query(`SELECT * FROM ${this.tabelName} WHERE ${where} ORDER BY ${order.by} ${order.type} LIMIT ${limit}`, (queryErr, result) => {
          if (queryErr) throw queryErr;
          callBack(result)
        });
      });
    if (limit == null && where != null && order != null)
      this.connection.connect(connectionErr => {
        if (connectionErr) throw connectionErr;
        this.connection.query(`SELECT * FROM ${this.tabelName} WHERE ${where} ORDER BY ${order.by} ${order.type}`, (queryErr, result) => {
          if (queryErr) throw queryErr;
          callBack(result)
        });
      });
    if (limit == null && where == null && order != null)
      this.connection.connect(connectionErr => {
        if (connectionErr) throw connectionErr;
        this.connection.query(`SELECT * FROM ${this.tabelName} ORDER BY ${order.by} ${order.type}`, (queryErr, result) => {
          if (queryErr) throw queryErr;
          callBack(result)
        });
      });
    if (limit == null && where != null && order == null)
      this.connection.connect(connectionErr => {
        if (connectionErr) throw connectionErr;
        this.connection.query(`SELECT * FROM ${this.tabelName} WHERE ${where}`, (queryErr, result) => {
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
        console.log(`INSERT INTO ${this.tabelName} (${cols.join(", ")}) VALUES ('${values.join("', '")}')`)
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

module.exports = Model;