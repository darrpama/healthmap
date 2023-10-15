import { Pool } from "pg";

let conn;

if (!conn) {
  conn = new Pool({
    user: 'myregree',
    password: '2p@cAmaru',
    host: 'localhost',
    port: '5432',
    database: 'healthmap',
  });
}

export default conn ;