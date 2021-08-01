const db = require('mysql');
const config = require('../../config.json')
/**
 * tabel name that we work on to fetch or send data
 */
let tableName = null
/**
 * a variable hold connection to communicate with the database
 */
let connection = null
/**
 * An Object to deal with database easly made with love by eslam magdy ♥
 */
const Model = {
  /**
   * Use this function one time in your app and preferred to be in the app entry point
   * to provide configration to connect to the database
   * 
   * @param {*} Object {host, user, password, database}
   */
  config(options = { host: null, user: null, password: null, database: null }) {
    let { host, user, password, database } = options
    if (host == undefined || user == undefined || password == undefined || database == undefined)
      console.warn("Please make sure to provide all required options [host,username,password,database]")
    else
      connection = db.createConnection({ host, user, password, database })
  },
  /**
   * targting a database table to start running the other methods on this table
   * @param {*} tableName the name of the table you will start handel
   * @returns refrance to this object to chain this method call with other methods in this object
   */
  target(_tableName) {
    tableName = _tableName
    return this
  },
  /**
   * excute a provided sql query and return the result if founded
   * @param {*} sqlStatment sql statement to be executed
   * @returns promis with a result if founded
   */
  excute(_sqlStatment) {
    if (tableName == null || tableName == undefined)
      console.warn("please make sure to use target() providing the tabel name as a parameter")
    else
      return new Promise((resolve, reject) => {
        connection.query(_sqlStatment, (queryErr, result) => {
          if (queryErr) {
            console.error('error: ' + queryErr.message)
            reject(queryErr)
          } else resolve(result)
        })
      })
  },
  /**
   * get data from database targeted table accordion to the passed option object
   * @param {*} Object {limit: number of the records wanna be returned ex '10',
   * where: running condetion on database ex 'username = eslam',
   * order: {by: name of the column to order the data accordion to ex 'name',type: 'asc' or 'desc'}}
   * @returns promis with a result if founded 
   */
  get(options = { limit: null, where: null, order: null }) {
    let { limit, where, order } = options
    let sqlStatment

    if (limit == null && where == null && order == null)
      sqlStatment = `SELECT * FROM ${tableName}`
    else if (limit != null && where == null && order == null)
      sqlStatment = `SELECT * FROM ${tableName} LIMIT ${limit}`
    else if (limit != null && where != null && order == null)
      sqlStatment = `SELECT * FROM ${tableName} WHERE ${where} LIMIT ${limit}`
    else if (limit != null && where != null && order != null)
      sqlStatment = `SELECT * FROM ${tableName} WHERE ${where} ORDER BY ${order.by} ${order.type} LIMIT ${limit}`
    else if (limit == null && where != null && order != null)
      sqlStatment = `SELECT * FROM ${tableName} WHERE ${where} ORDER BY ${order.by} ${order.type}`
    else if (limit == null && where == null && order != null)
      sqlStatment = `SELECT * FROM ${tableName} ORDER BY ${order.by} ${order.type}`
    else if (limit == null && where != null && order == null)
      sqlStatment = `SELECT * FROM ${tableName} WHERE ${where}`

    return this.excute(sqlStatment)
  },
  /**
   * add the provided data to the database tabel 
   * @param {*} data provide the data you wanna add in the form of object where the key is the column name and value
   * is the value wanna be stored in this column ex => {id:1,name:'eslam magdy',age:22} please make sure that all the
   * provided data is valied like the column is existed and the data for this column is accepted for the database
   * @param {*} unique an array of columns name that must be unique if the data object have the same value of existing
   * column provided in the unique the return of this method will be null
   * @returns promise
   */
  async add(data, unique = [null]) {
    let cols = []
    let values = []
    for (const key in data) {
      cols.push(key)
      values.push(connection.escape(data[key]))
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
        return this.excute(`INSERT INTO ${tableName} (${cols.join(", ")}) VALUES ('${values.join("', '")}')`)
      else {
        console.warn(`some information is already used before`)
        return null
      }
    }
    else
      return this.excute(`INSERT INTO ${tableName} (${cols.join(", ")}) VALUES ('${values.join("', '")}')`)
  },
  /**
   * delete a record/s from database table
   * @param {*} where a condetion to konw what to delete ex => 'id = 5'
   * @returns promise
   */
  delete(where) {
    return this.excute(`DELETE FROM ${tableName} WHERE ${where}`)
  },
  /**
   * update record/s in the database table based on the given condetion and data
   * @param {*} data obj witch holds the data in a form of key/value pairs where keys are the name of table column
   * and values are the data inside this column ex => {id:1,name:'eslam magdy,age:22}
   * @param {*} where a condetion that spacifies the recordes gonna be updated ex => 'id = 6'
   * @returns promise
   */
  update(data, where) {
    let cols = []
    let values = []
    for (const key in data) {
      cols.push(key)
      values.push(connection.escape(data[key]))
    }
    let sqlStatment = `UPDATE ${tableName} SET`
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

Model.config(config.database)

module.exports = Model;