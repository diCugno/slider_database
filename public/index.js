import { createMiddleware, controller, createNavigator, createLogin, createPubSub, createTable, createAdd } from '../scripts/components.js';

const login_btn = document.getElementById('login');
const loginContainer = document.getElementById('login-container');
const tableAdmin = document.getElementById('table-container-admin');
const add_btn = document.getElementById('add');
const addContainer = document.getElementById('add-container');
const add_btn_container = document.getElementById('add-btn-container');

let myToken, myKey;

//https://i.postimg.cc/mktDtpgj/JEROME.jpg
//ws.cipiaceinfo.it
let listaFoto = []

fetch('./conf.json')
  .then((response) => {
    if (!response.ok) {
      console.log('Errore nel caricamento del file JSON');
    }
    return response.json();
  })
  .then((data) => {
    myToken = data.cacheToken;
    myKey = data.myKey;
    console.log("chiave:  ", myKey);
    console.log("token:  ", myToken);

    let login = createLogin(loginContainer, myToken, pubsub);
    login.createModal(login_btn);

  })
  .catch((error) => console.error('Errore:', error));


const nav = createNavigator(document.querySelector('#container'));

const pubsub = createPubSub();

const middleware = createMiddleware();

let table = createTable(tableAdmin,pubsub);

let add = createAdd(addContainer, pubsub, middleware);
add.createModal(add_btn);


/*
function render(){
  console.log("RENDERRR")
}
render();
*/


// iscrivo all evento newPlaceAdded
pubsub.subscribe("newFotoAdded", (listaFoto) => {
  console.log("Nuova Foto aggiunta, aggiorno la tabella");
  table.setData(listaFoto); // aggiorna i dati della tabella
  table.renderTableAdmin(); // render della tabella con i nuovi dati
});

pubsub.subscribe("Logged", (isLogged) => {
  console.log("tabella aggiornata ", isLogged);
  table.setData(listaFoto); // aggiorna i dati della tabella
  table.renderTableAdmin(); // render della tabella con i nuovi dati
  add_btn_container.classList.add("visible");
  add_btn_container.classList.remove("hidden");
});

pubsub.subscribe("fotoRemoved", (listaFoto) => {
  console.log("Foto rimossa, aggiorno la tabella");
  table.setData(listaFoto); // aggiorna i dati della tabella
  table.renderTableAdmin(); // render della tabella con i nuovi dati
});