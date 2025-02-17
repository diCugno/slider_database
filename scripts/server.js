const express = require("express");
const http = require('http');
const path = require('path');
const app = express();
const multer = require('multer');
const database = require("./database");

database.createTable(); //crea tabella

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, path.join(__dirname, "images"));//CAMBIA NOME
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).single('file');

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

//upload file
/*
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error("Errore durante l'upload:", err);
            res.status(500).json({ error: "Errore nell'upload del file" });
            return;
        }
        if (!req.file) {
            res.status(400).json({ error: "Nessun file caricato" });
            return;
        }

        console.log("File caricato:", req.file.filename);

        database.insert("./images/" + req.file.filename)
            .then(() => res.json({ url: "/images/" + req.file.filename }))
            .catch((dbError) => {
                console.error("Errore nel database:", dbError);
                res.status(500).json({ error: "Errore nel salvataggio nel database" });
            });
    });
});
*/
app.post('/upload', multer({storage: storage}).single('file'), async(req, res) => {
    await database.insert("./images/" + req.file.originalname);
    res.json({result: "ok"});
});

//ottiene lista immagini
app.get('/images', (req, res) => {
    database.select()
        .then((list) => res.json(list))
        .catch((error) => {
            console.error("Errore nel recupero delle immagini:", error);
            res.status(500).json({ error: "Errore nel recupero delle immagini" });
        });
});

//elimina immagine
app.delete('/delete/:id', (req, res) => {
    database.delete(req.params.id)
        .then(() => res.json({ result: "ok" }))
        .catch((error) => {
            console.error("Errore nella cancellazione:", error);
            res.status(500).json({ error: "Errore nella cancellazione del file" });
        });
});

const server = http.createServer(app);
server.listen(5600, () => {
    console.log("- Server running su http://localhost:5600");
});
