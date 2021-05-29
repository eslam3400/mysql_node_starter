const db = require('mysql');

const DB = {
  /**
  * tabel name that we work on to fetch or send data
  */
  tableName: null,
  /**
   * a variable hold connection to communicate with the database
  */
  connection: null,
  config(options = { host: null, user: null, password: null, database: null }) {
    let { host, user, password, database } = options
    if (host == undefined || user == undefined || password == undefined || database == undefined)
      return console.error("Please make sure to provide all required options [host,username,password,database]")
    else
      this.connection = db.createConnection({ host, user, password, database })
  },
  target(tableName) {
    console.log(tableName)
    this.tableName = tableName
  },
  excute(sqlStatment) {
    if (this.tableName == null || this.tableName == undefined)
      return console.error("please make sure to use target() providing the tabel name as a parameter")
    else
      return new Promise((resolve, reject) => {
        this.connection.query(sqlStatment, (queryErr, result) => {
          if (queryErr) {
            console.error('error: ' + queryErr.message)
            reject(queryErr)
          } else resolve(result)
        })
      })
  },
  get(options = { limit: null, where: null, order: null }) {
    let { limit, where, order } = options
    let sqlStatment

    if (limit == null && where == null && order == null)
      sqlStatment = `SELECT * FROM ${this.tableName}`
    else if (limit != null && limit > 0 && where == null && order == null)
      sqlStatment = `SELECT * FROM ${this.tableName} LIMIT ${limit}`
    else if (limit != null && limit > 0 && where != null && order == null)
      sqlStatment = `SELECT * FROM ${this.tableName} WHERE ${where} LIMIT ${limit}`
    else if (limit != null && limit > 0 && where != null && order != null)
      sqlStatment = `SELECT * FROM ${this.tableName} WHERE ${where} ORDER BY ${order.by} ${order.type} LIMIT ${limit}`
    else if (limit == null && where != null && order != null)
      sqlStatment = `SELECT * FROM ${this.tableName} WHERE ${where} ORDER BY ${order.by} ${order.type}`
    else if (limit == null && where == null && order != null)
      sqlStatment = `SELECT * FROM ${this.tableName} ORDER BY ${order.by} ${order.type}`
    else if (limit == null && where != null && order == null)
      sqlStatment = `SELECT * FROM ${this.tableName} WHERE ${where}`

    return this.excute(sqlStatment)
  },
  async add(data, unique = [null]) {
    let cols = []
    let values = []
    for (const key in data) {
      cols.push(key)
      values.push(data[key])
    }
    if (unique[0] != null) {
      let uniqueValues = ``
      let counter = 0
      unique.forEach(element => {
        if (counter == unique.length - 1)
          uniqueValues += `${element} = '${data[element]}'`
        else
          uniqueValues += `${element} = '${data[element]}' OR `
        counter++
      });
      let checkData = await this.get({ where: uniqueValues })
      if (checkData.length == 0)
        return this.excute(`INSERT INTO ${this.tableName} (${cols.join(", ")}) VALUES ('${values.join("', '")}')`)
      else {
        console.log(`some information is already used before`)
        return null
      }
    }
    else
      return this.excute(`INSERT INTO ${this.tableName} (${cols.join(", ")}) VALUES ('${values.join("', '")}')`)
  },
  delete(where) {
    return this.excute(`DELETE FROM ${this.tableName} WHERE ${where}`)
  },
  update(data, where) {
    let cols = []
    let values = []
    for (const key in data) {
      cols.push(key)
      values.push(data[key])
    }
    let sqlStatment = `UPDATE ${this.tableName} SET`
    let final = cols.length - 1
    let counter = 0
    cols.forEach(col => {
      if (counter == final)
        sqlStatment += ` ${col} = '${values[counter]}'`
      else
        sqlStatment += ` ${col} = '${values[counter]}',`
      counter++
    });
    sqlStatment += ` WHERE ${where}`
    return this.excute(sqlStatment)
  }
}
class Model {
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
      sqlStatment = `SELECT * FROM ${this.tableName}`
    else if (limit == null && where == null && order == null)
      sqlStatment = `SELECT * FROM ${this.tableName}`
    else if (limit != null && limit > 0 && where == null && order == null)
      sqlStatment = `SELECT * FROM ${this.tableName} LIMIT ${limit}`
    else if (limit != null && limit > 0 && where != null && order == null)
      sqlStatment = `SELECT * FROM ${this.tableName} WHERE ${where} LIMIT ${limit}`
    else if (limit != null && limit > 0 && where != null && order != null)
      sqlStatment = `SELECT * FROM ${this.tableName} WHERE ${where} ORDER BY ${order.by} ${order.type} LIMIT ${limit}`
    else if (limit == null && where != null && order != null)
      sqlStatment = `SELECT * FROM ${this.tableName} WHERE ${where} ORDER BY ${order.by} ${order.type}`
    else if (limit == null && where == null && order != null)
      sqlStatment = `SELECT * FROM ${this.tableName} ORDER BY ${order.by} ${order.type}`
    else if (limit == null && where != null && order == null)
      sqlStatment = `SELECT * FROM ${this.tableName} WHERE ${where}`

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
              this.connection.query(`INSERT INTO ${this.tableName} (${cols.join(", ")}) VALUES ('${values.join("', '")}')`, (queryErr) => {
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
            this.connection.query(`INSERT INTO ${this.tableName} (${cols.join(", ")}) VALUES ('${values.join("', '")}')`, (queryErr) => {
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
          this.connection.query(`DELETE FROM ${this.tableName} WHERE ${where}`, (queryErr) => {
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
    let sql = `UPDATE ${this.tableName} SET`
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