import { Sequelize } from "sequelize";

const db = new Sequelize("mahasiswa", "root", "",{
    host:"localhost",
    dialect:"mysql",
});

export default db;