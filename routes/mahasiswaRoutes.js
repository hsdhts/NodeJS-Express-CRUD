import express from "express";
import {
    getMahasiswa, 
    addMahasiswa,
    getMahasiswaById,
    updateMahasiswa,
    deleteMahasiswa,
} from "../controllers/mahasiswaController.js";

const router = express.Router();

router.get('/mahasiswa', getMahasiswa );
router.post('/mahasiswa', addMahasiswa);
router.get('/mahasiswa/:id', getMahasiswaById);
router.patch('/mahasiswa/:id', updateMahasiswa);
router.delete('/mahasiswa/:id', deleteMahasiswa);


export default router;