const db = require('../Model/Model')
const sqls = []

let buildDataBaseStructure = () => {
  sqls.forEach(sql => db.target('db').excute(sql));
}

buildDataBaseStructure()