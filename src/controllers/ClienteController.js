const database = require('../database/conenection');

class ClienteController{

novoCliente(request,response){

const {ClienteID , Nome, Contato} = request.body;
 console.log("request.body:\n ", request.body);

 database.insert({ClienteID, Nome, Contato}).table("Clientes").then(data =>{

  console.log(data);
  response.json({message:"Cliente criado com sucesso"});

 }).catch(error =>{
  console.log(error);
 })
}





}

module.exports = new ClienteController();