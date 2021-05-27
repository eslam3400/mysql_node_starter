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
   * make a connection to the database and save it to a connection variable to communicate with the database
  */
  connect() {
    this.connection = db.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'devtik_ms'
    })
  }
  /**
   * make a disconnection with the database
   */
  disconnect() {
    this.connection.destroy()
  }
  /**
   * this function get data from initalized table name provided depending on passed options
   * 
   * @param {*} options take a object that contains 3 constrains and do some operations depending on the statue of this constrains
   * limit => limit the returned data of a query to provided number
   * where => make a conditional query depending on what is provided to this where
   * order => is an object that has a {by,type} keys and ordring the query result in this order
   * 
   */
  get(options = { limit: null, where: null, order: null }) {

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

    return new Promise((resolve, reject) => {
      try {
        this.connect()
        this.connection.connect(connectionErr => {
          if (connectionErr) throw connectionErr;
          this.connection.query(sqlStatment, (queryErr, result) => {
            this.disconnect()
            if (queryErr) throw queryErr;
            resolve(result)
          });
        });
      } catch (error) {
        console.log(error)
      }
    })
  }
  /**
   * 
   * @param {*} SQLQuery sql query to be excuted
   */
  excute(SQLQuery) {
    return new Promise((resolve, reject) => {
      try {
        this.connect()
        this.connection.connect(connectionErr => {
          if (connectionErr) throw connectionErr;
          this.connection.query(SQLQuery, (queryErr, result) => {
            this.disconnect()
            if (queryErr) throw queryErr;
            resolve(result)
          });
        });
      } catch (error) {
        console.log(error)
      }
    })
  }

  async add(data, options = { unique: [{ key: null, value: null }] }) {
    let cols = []
    let values = []
    for (const key in data) {
      cols.push(key)
      values.push(data[key])
    }
    let { unique } = options
    if (unique[0].key != null) {
      let uniqueValues = ``
      let counter = 0
      unique.forEach(element => {
        if (counter == unique.length - 1)
          uniqueValues += `${element.key} = '${element.value}'`
        else
          uniqueValues += `${element.key} = '${element.value}' OR `
        counter++
      });
      let checkData = await this.get({ where: uniqueValues })
      if (checkData.length == 0)
        return new Promise((resolve, reject) => {
          try {
            this.connect()
            this.connection.connect(connectionErr => {
              if (connectionErr) throw connectionErr;
              this.connection.query(`INSERT INTO ${this.tabelName} (${cols.join(", ")}) VALUES ('${values.join("', '")}')`, (queryErr) => {
                this.disconnect()
                if (queryErr) throw queryErr;
                resolve(0)
              });
            });
          } catch (error) {
            console.log(error)
          }
        })
      else return `some information is already used before`
    }
    else
      return new Promise((resolve, reject) => {
        try {
          this.connect()
          this.connection.connect(connectionErr => {
            if (connectionErr) throw connectionErr;
            this.connection.query(`INSERT INTO ${this.tabelName} (${cols.join(", ")}) VALUES ('${values.join("', '")}')`, (queryErr) => {
              this.disconnect()
              if (queryErr) throw queryErr;
              resolve(0)
            });
          });
        } catch (error) {
          console.log(error)
        }
      })
  }

  delete(where) {
    return new Promise((resolve, reject) => {
      try {
        this.connect()
        this.connection.connect(connectionErr => {
          if (connectionErr) throw connectionErr;
          this.connection.query(`DELETE FROM ${this.tabelName} WHERE ${where}`, (queryErr) => {
            this.disconnect()
            if (queryErr) throw queryErr;
            resolve("Deleted")
          });
        });
      } catch (error) {
        console.log(error)
      }
    })
  }

  update(data, where) {
    let cols = []
    let values = []
    for (const key in data) {
      cols.push(key)
      values.push(data[key])
    }
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
    return new Promise((resolve, reject) => {
      try {
        this.connect()
        this.connection.connect(connectionErr => {
          if (connectionErr) throw connectionErr;
          this.connection.query(sql, (queryErr) => {
            this.disconnect()
            if (queryErr) throw queryErr;
            resolve("Updated")
          });
        });
      } catch (error) {
        console.log(error)
      }
    })
  }
}

module.exports = Model;