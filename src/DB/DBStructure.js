const Model = require('../Model/Model')
const sqls = []

let buildDataBaseStructure = () => {
  sqls.forEach(sql => new Model().excute(sql));
}

buildDataBaseStructure()