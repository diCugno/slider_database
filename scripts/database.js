const fs = require("fs");
const mysql = require("mysql2");

//const conf = JSON.parse(fs.readFileSync('conf_database.json'));
const path = require("path");
const conf = JSON.parse(fs.readFileSync(path.join(__dirname, "conf.json")));

conf.ssl = {
    //ca: fs.readFileSync(__dirname + '/ca.pem')
    ca: fs.readFileSync(path.join(__dirname, conf["ca"]))
    //ca: fs.readFileSync(path.join(__dirname, "scripts", "ca.pem"))
}
const connection = mysql.createConnection(conf);

const executeQuery = (sql) =>{
    return new Promise((resolve, reject) => {
        connection.query(sql,function(err,result) {
            if(err){
                console.error(err);
                reject();
            }
            console.log('done');
            resolve(result)
        });
    })
}

const database = {
    createTable: () => {
        return executeQuery(`
            CREATE TABLE IF NOT EXISTS images (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL
            );
                `);
    },
    insert: (name) => {
        const template = `
        INSERT INTO images (name) VALUES ('$NAME')
           `;
        sql = sql.replace("$NAME", name);
        return executeQuery(sql); 
    },

    select: () => {
        const sql = `
        SELECT id, name, completed FROM images 
           `;
        return executeQuery(sql); 
    },

    delete : (id) => {
        let sql = `
        DELETE FROM images
        WHERE id=$ID
           `;
        sql = sql.replace("%ID", id);
        return executeQuery(sql); 
    },
}

module.exports = database;