import { Pool } from "pg";

const connectionString = 'postgres://rpgbylna:EuV0i5Jy0__uhd9vEQ_H3Kqzlqh6q3YO@kesavan.db.elephantsql.com/rpgbylna';

const db = new Pool({connectionString});

export default db;

/*Criação do Pool para a conexção com o banco de dados */