const { response } = require('express');
const database = require('../database/conenection');

class ClienteController{

  novoCliente(request, response) {
    const { Nome, Contato } = request.body;
  
    // Verificar se já existe um cliente com o mesmo nome
    database.select('ClienteID').from('Clientes').where('Nome', Nome).then(existingClient => {
      if (existingClient.length > 0) {
        // Cliente com mesmo nome já existe
        const existingClientId = existingClient[0].ClienteID;
        response.status(409).json({ message: `Já existe um cliente cadastrado com o nome '${Nome}'. ID do cliente existente: ${existingClientId}` });
      } else {
        // Verificar se já existe um cliente com o mesmo contato
        database.select('ClienteID').from('Clientes').where('Contato', Contato).then(existingClientContact => {
          if (existingClientContact.length > 0) {
            // Cliente com mesmo contato já existe
            const existingClientId = existingClientContact[0].ClienteID;
            response.status(409).json({ message: `Já existe um cliente cadastrado com o contato '${Contato}'. ID do cliente existente: ${existingClientId}` });
          } else {
            // Nenhum cliente existente com mesmo nome ou contato, pode inserir
            database.insert({ Nome, Contato }).table("Clientes").then(data => {
              const newClientId = data[0];
              response.json({ message: "Cliente criado com sucesso" });
            }).catch(error => {
              console.log(error);
              response.status(500).json({ error: "Erro ao criar cliente" });
            });
          }
        }).catch(error => {
          console.log(error);
          response.status(500).json({ error: "Erro ao verificar contato existente" });
        });
      }
    }).catch(error => {
      console.log(error);
      response.status(500).json({ error: "Erro ao verificar nome existente" });
    });
  }

ListarCliente(request, response){

  database.select("*").table("Clientes").then(clientes =>{

    console.log(clientes);
    response.json(clientes);
  }).catch(error =>{
    console.log(error);
  })
}


ListarUmCliente(request, response) {
  const id = parseInt(request.params.id);

  // Validar se o ID é um número inteiro positivo
  if (!Number.isInteger(id) || id <= 0) {
    return response.status(400).json({ error: 'ID de cliente inválido' });
  }

  // Verificar se o cliente com o ID fornecido existe no banco de dados
  database.select("*").table("Clientes").where({ ClienteID: id }).then(clientes => {
    if (clientes.length === 0) {
      // Cliente não encontrado, retornar status 404
      return response.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Cliente encontrado, retornar os detalhes do cliente
    response.json(clientes);
  }).catch(error => {
    // Tratar erros no acesso ao banco de dados
    console.log(error);
    response.status(500).json({ error: "Erro ao obter detalhes do cliente" });
  });
}

AtualizarCliente(request, response) {
  const id = parseInt(request.params.id);
  const { Nome, Contato } = request.body;

  // Validar se o ID é um número inteiro positivo
  if (!Number.isInteger(id) || id <= 0) {
    return response.status(400).json({ error: 'ID de cliente inválido' });
  }

  // Verificar se o cliente com o ID fornecido existe no banco de dados
  database.select("*").table("Clientes").where({ ClienteID: id }).then(clientes => {
    if (clientes.length === 0) {
      // Cliente não encontrado, retornar status 404
      return response.status(404).json({ error: 'Cliente não encontrado' });
    }

    const clienteAtual = clientes[0];

    // Verificar se os dados a serem atualizados são diferentes dos dados existentes
    if (clienteAtual.Nome === Nome && clienteAtual.Contato === Contato) {
      return response.status(400).json({ error: 'Não é possível realizar a atualização com os mesmos dados já existentes.' });
    }

    // Validar se os campos Nome e Contato não estão em branco ou nulos
    if (!Nome || !Contato) {
      return response.status(400).json({ error: 'Os campos Nome e Contato são obrigatórios' });
    }

    // Cliente encontrado, dados são diferentes e campos são válidos, realizar a atualização
    database.table("Clientes").where({ ClienteID: id }).update({ Nome, Contato }).then(updatedClient => {
      response.json({ message: "Cliente atualizado com sucesso" });
    }).catch(error => {
      console.log(error);
      response.status(500).json({ error: "Erro ao atualizar cliente" });
    });
  }).catch(error => {
    // Tratar erros no acesso ao banco de dados
    console.log(error);
    response.status(500).json({ error: "Erro ao obter detalhes do cliente para atualização" });
  });
}

removerCliente(request,response){

  const id = (request.params.id);

  database.where({ClienteID:id}).del().table("Clientes").then(clientes =>{
    response.json({messagge: "Cliente removido com sucesso"});
  }).catch(error =>{
    console.log("error");
  })

}


}

module.exports = new ClienteController();