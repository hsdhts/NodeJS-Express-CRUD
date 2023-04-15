import Mahasiswa from "../models/mahasiswaModel.js";
import path from 'path'
import crypto from "crypto";
import fs from "fs";


export const getMahasiswa = async(req, res) => {
    try{
        const result = await Mahasiswa.findAll();
        res.json(result);
    }catch(e){
        console.log(e);
    }
};

export const addMahasiswa = async(req, res) => {
    if(req.files === null) return res.status(404).json({msg:"Foto tidak diupload"});

    const nama = req.body.nama;
    const foto = req.files.foto;
    const jurusan = req.body.jurusan;
    const alamat = req.body.alamat;
    const ukuranFoto = foto.data.length;
    const ext = path.extname(foto.name);
    const unikKarakter= crypto.randomBytes(3).toString("hex");
    const namaFoto = unikKarakter + foto.md5 + ext;
    const fotoUrl = `${req.protocol}://${req.get("host")}/images/${namaFoto}`;
    const tipeFoto = ['.png', '.jpg', '.jpeg'];

    if(!tipeFoto.includes(ext.toLocaleLowerCase()))
    return res.status(404).json({ msg: "Tipe Foto Tidak Sesuai"});

    if(ukuranFoto > 5000000) 
    return res.status(404).json({ msg: "ukuran foto terlalu besar"});

    foto.mv(`./public/images/${namaFoto}`, async(err) =>{
        if(err) return res.status(500).json({ msg: err.message });
        try{
         await Mahasiswa.create({
            nama: nama,
            foto: namaFoto,
            fotoUrl: fotoUrl,
            jurusan: jurusan,
            alamat: alamat,
            
         });
         res.status(200).json({ msg: "Data Berhasil Ditambahkan"});
        } catch (error){
            console.log(error.message);
        }
    });
};


export const getMahasiswaById = async (req, res) => {
    try{
        const result = await Mahasiswa.findOne ({
            where: {
                id: req.params.id
            }
        })
        res.json(result)
    }catch (error){
        console.log(error);
    }
};

export const updateMahasiswa = async (req, res) => {
    const mahasiswa = await Mahasiswa.findOne({
        where: {
            id: req.params.id
        }
    })
    if(!mahasiswa) return res.status(404).json({ msg: "Mahasiswa tidak ditemukan" });

    let foto = ""
    if(req.files === null){
        foto = mahasiswa.foto;
    } else {
        const fotoBaru = req.files.foto
        const ukuranFoto = fotoBaru.data.length
        const ext = path.extname(fotoBaru.name);
        const unikKarakter = crypto.randomBytes(3).toString("hex");
        foto = unikKarakter + fotoBaru.md5 + ext 
        const tipeFoto = ['.png', '.jpg', '.jpeg'];

        if(!tipeFoto.includes(ext.toLocaleLowerCase()))
        return res.status(404).json({ msg: "Tipe Foto Tidak Sesuai"});
    
        if(ukuranFoto > 5000000) 
        return res.status(404).json({ msg: "ukuran foto terlalu besar"});

        const pathFoto = `./public/images/${mahasiswa.foto}`;
        fs.unlinkSync(pathFoto)

        fotoBaru.mv(`./public/images/${foto}`, (err) => {
            if(err) return res.status(500).json({ msg: err.message });
        });
    }
    const nama = req.body.nama;
    const jurusan = req.body.jurusan;
    const alamat = req.body.alamat;
    const pathUrl = `${req.protocol}://${req.get("host")}/images/${foto}`

    try{
        await Mahasiswa.update({
            nama: nama,
            foto: pathUrl,
            jurusan: jurusan,
            alamat: alamat,
        },
        {
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({ msg: "Data Berhasil Diubah"});
    } catch(error) {
       
        console.log(error);
    }
};

export const deleteMahasiswa = async (req, res) => {
    const mahasiswa = await Mahasiswa.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!mahasiswa) {
        return res.status(404).json({ msg: "Mahasiswa tidak ditemukan" });
    }

    try {
        const pathFoto = `./public/images/${mahasiswa.foto}`;
        fs.unlinkSync(pathFoto);
        await Mahasiswa.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "Data Berhasil Dihapus" });
    } catch (error) {
        console.log(error.message);
    }
};
