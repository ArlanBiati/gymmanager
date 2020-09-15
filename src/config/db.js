const { Pool } = require("pg")

module.exports = new Pool({
  user: "postgres",
  password: "postgres",
  host: "172.17.0.2",
  port: "5432",
  database: "gymmanager"
})