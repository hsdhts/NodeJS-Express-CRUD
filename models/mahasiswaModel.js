import { Sequelize } from "sequelize";
import db from '../config/Connect.js'


const {DataTypes} = Sequelize

const Mahasiswa = db.define("informatika",{
    nama: DataTypes.STRING,
    foto:DataTypes.STRING,
    fotoUrl:DataTypes.STRING,
    jurusan:DataTypes.STRING,
    alamat:DataTypes.STRING
},
{
    freezeTableName:true,
})

export default Mahasiswa;

(async()=>{
    await db.sync();
})();