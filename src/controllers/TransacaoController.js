const { response } = require('express');
const database = require('../database/conenection');

class TransacaoController {
  novaTransacaoEntrada(request, response) {
    const { ClienteID, ProdutoID, Tipo, Quantidade, DataHoraEntrada} = request.body;
    const {DataHoraSaida = null } = request.body;

    // Validar se ClienteID e ProdutoID são números inteiros positivos
    if (!Number.isInteger(ClienteID) || ClienteID <= 0 || !Number.isInteger(ProdutoID) || ProdutoID <= 0) {
      return response.status(400).json({ error: 'IDs de cliente e produto devem ser números inteiros positivos' });
    }

    // Verificar se o cliente com o ClienteID fornecido existe no banco de dados
    database.select("*").table("Clientes").where({ ClienteID }).then(clientes => {
      if (clientes.length === 0) {
        // Cliente não encontrado, retornar status 404
        return response.status(404).json({ error: 'Cliente não encontrado' });
      }

      // Verificar se o produto com o ProdutoID fornecido existe no banco de dados
      database.select("*").table("Produtos").where({ ProdutoID }).then(produtos => {
        if (produtos.length === 0) {
          // Produto não encontrado, retornar status 404
          return response.status(404).json({ error: 'Produto não encontrado' });
        }

        // Nenhum cliente existente com mesmo nome ou contato, pode inserir
        database.insert({ ClienteID, ProdutoID, Tipo, Quantidade, DataHoraEntrada, DataHoraSaida }).table("Transacoes").then(data => {
          const newTransacaoId = data[0];
          response.json({ message: "Transação criada com sucesso" });
        }).catch(error => {
          console.log(error);
          response.status(500).json({ error: "Erro ao criar transação" });
        });
      }).catch(error => {
        console.log(error);
        response.status(500).json({ error: "Erro ao verificar ProdutoID existente" });
      });
    }).catch(error => {
      console.log(error);
      response.status(500).json({ error: "Erro ao verificar ClienteID existente" });
    });
  }

  novaTransacaoSaida(request, response) {
    const { ClienteID, ProdutoID, Tipo, Quantidade, DataHoraSaida} = request.body;
    const {DataHoraEntrada = null } = request.body;

    // Validar se ClienteID e ProdutoID são números inteiros positivos
    if (!Number.isInteger(ClienteID) || ClienteID <= 0 || !Number.isInteger(ProdutoID) || ProdutoID <= 0) {
      return response.status(400).json({ error: 'IDs de cliente e produto devem ser números inteiros positivos' });
    }

    // Verificar se o cliente com o ClienteID fornecido existe no banco de dados
    database.select("*").table("Clientes").where({ ClienteID }).then(clientes => {
      if (clientes.length === 0) {
        // Cliente não encontrado, retornar status 404
        return response.status(404).json({ error: 'Cliente não encontrado' });
      }

      // Verificar se o produto com o ProdutoID fornecido existe no banco de dados
      database.select("*").table("Produtos").where({ ProdutoID }).then(produtos => {
        if (produtos.length === 0) {
          // Produto não encontrado, retornar status 404
          return response.status(404).json({ error: 'Produto não encontrado' });
        }

        // Nenhum cliente existente com mesmo nome ou contato, pode inserir
        database.insert({ ClienteID, ProdutoID, Tipo, Quantidade, DataHoraEntrada, DataHoraSaida }).table("Transacoes").then(data => {
          const newTransacaoId = data[0];
          response.json({ message: "Transação criada com sucesso" });
        }).catch(error => {
          console.log(error);
          response.status(500).json({ error: "Erro ao criar transação" });
        });
      }).catch(error => {
        console.log(error);
        response.status(500).json({ error: "Erro ao verificar ProdutoID existente" });
      });
    }).catch(error => {
      console.log(error);
      response.status(500).json({ error: "Erro ao verificar ClienteID existente" });
    });
  }

  //Listar transções
  listarTransacoes(request, response) {
    database.select("*").table("Transacoes").then(transacoes => {
      response.json(transacoes);
    }).catch(error => {
      console.log(error);
      response.status(500).json({ error: "Erro ao listar transações" });
    });
  }

  listarTransacaoEntradaPorId(request, response) {
    const TransacaoID = parseInt(request.params.id);
  
    // Validar se o TransacaoID é um número inteiro positivo
    if (!Number.isInteger(TransacaoID) || TransacaoID <= 0) {
      return response.status(400).json({ error: 'ID de transação inválido' });
    }
  
    const query = database.select("*").table("Transacoes").where({ TransacaoID, Tipo: "Entrada" });
  
    // Executar a consulta
    query.then(transacaoEntrada => {
      if (transacaoEntrada.length === 0) {
        return response.status(404).json({ error: 'Transação de entrada não encontrada' });
      }
      response.json(transacaoEntrada);
    }).catch(error => {
      console.log(error);
      response.status(500).json({ error: `Erro ao listar transação de entrada para o TransacaoID ${TransacaoID}` });
    });
  }
  
  listarTransacaoSaidaPorId(request, response) {
    const TransacaoID = parseInt(request.params.id);
  
    // Validar se o TransacaoID é um número inteiro positivo
    if (!Number.isInteger(TransacaoID) || TransacaoID <= 0) {
      return response.status(400).json({ error: 'ID de transação inválido' });
    }
  
    const query = database.select("*").table("Transacoes").where({ TransacaoID, Tipo: "Saida" });
  
    // Executar a consulta
    query.then(transacaoSaida => {
      if (transacaoSaida.length === 0) {
        return response.status(404).json({ error: 'Transação de saída não encontrada' });
      }
      response.json(transacaoSaida);
    }).catch(error => {
      console.log(error);
      response.status(500).json({ error: `Erro ao listar transação de saída para o TransacaoID ${TransacaoID}` });
    });
  }

  atualizarTransacaoEntrada(request, response) {
    const id = parseInt(request.params.id);
    const { ClienteID, ProdutoID, Quantidade, DataHoraEntrada } = request.body;

    // Validar se o ID é um número inteiro positivo
    if (!Number.isInteger(id) || id <= 0) {
      return response.status(400).json({ error: 'ID de transação inválido' });
    }

    // Verificar se a transação de entrada com o ID fornecido existe no banco de dados
    database.select("*").table("Transacoes").where({ TransacaoID: id, Tipo: "Entrada" }).then(transacoesEntrada => {
      if (transacoesEntrada.length === 0) {
        // Transação de entrada não encontrada, retornar status 404
        return response.status(404).json({ error: 'Transação de entrada não encontrada' });
      }

      // Transação de entrada encontrada, dados são diferentes e campos são válidos, realizar a atualização
      const updatedFields = {};

      // Verificar se pelo menos um dos campos deve ser fornecido para atualização
      if (ClienteID !== transacoesEntrada[0].ClienteID) updatedFields.ClienteID = ClienteID;
      if (ProdutoID !== transacoesEntrada[0].ProdutoID) updatedFields.ProdutoID = ProdutoID;
      if (Quantidade !== transacoesEntrada[0].Quantidade) updatedFields.Quantidade = Quantidade;

      if (
        updatedFields.ClienteID === undefined &&
        updatedFields.ProdutoID === undefined &&
        updatedFields.Quantidade === undefined 
      ) {
        return response.status(400).json({ error: 'Pelo menos um dos campos deve ser modificado para realizar a atualização.' });
      }

      database.table("Transacoes").where({ TransacaoID: id }).update(updatedFields).then(updatedTransacao => {
        response.json({ message: "Transação de entrada atualizada com sucesso" });
      }).catch(error => {
        console.log(error);
        response.status(500).json({ error: "Erro ao atualizar transação de entrada" });
      });
    }).catch(error => {
      // Tratar erros no acesso ao banco de dados
      console.log(error);
      response.status(500).json({ error: "Erro ao obter detalhes da transação de entrada para atualização" });
    });
  }

  atualizarTransacaoSaida(request, response) {
    const id = parseInt(request.params.id);
    const { ClienteID, ProdutoID, Quantidade, DataHoraSaida } = request.body;

    // Validar se o ID é um número inteiro positivo
    if (!Number.isInteger(id) || id <= 0) {
      return response.status(400).json({ error: 'ID de transação inválido' });
    }

    // Verificar se a transação de saída com o ID fornecido existe no banco de dados
    database.select("*").table("Transacoes").where({ TransacaoID: id, Tipo: "Saida" }).then(transacoesSaida => {
      if (transacoesSaida.length === 0) {
        // Transação de saída não encontrada, retornar status 404
        return response.status(404).json({ error: 'Transação de saída não encontrada' });
      }

      // Transação de saída encontrada, dados são diferentes e campos são válidos, realizar a atualização
      const updatedFields = {};

      // Verificar se pelo menos um dos campos deve ser fornecido para atualização
      if (ClienteID !== transacoesSaida[0].ClienteID) updatedFields.ClienteID = ClienteID;
      if (ProdutoID !== transacoesSaida[0].ProdutoID) updatedFields.ProdutoID = ProdutoID;
      if (Quantidade !== transacoesSaida[0].Quantidade) updatedFields.Quantidade = Quantidade;
    

      if (
        updatedFields.ClienteID === undefined &&
        updatedFields.ProdutoID === undefined &&
        updatedFields.Quantidade === undefined 
      ) {
        return response.status(400).json({ error: 'Pelo menos um dos campos deve ser modificado para realizar a atualização.' });
      }

      database.table("Transacoes").where({ TransacaoID: id }).update(updatedFields).then(updatedTransacao => {
        response.json({ message: "Transação de saída atualizada com sucesso" });
      }).catch(error => {
        console.log(error);
        response.status(500).json({ error: "Erro ao atualizar transação de saída" });
      });
    }).catch(error => {
      // Tratar erros no acesso ao banco de dados
      console.log(error);
      response.status(500).json({ error: "Erro ao obter detalhes da transação de saída para atualização" });
    });
  }

  removerTransacaoEntrada(request, response) {
    const id = parseInt(request.params.id);

    // Validar se o ID é um número inteiro positivo
    if (!Number.isInteger(id) || id <= 0) {
      return response.status(400).json({ error: 'ID de transação inválido' });
    }

    database.table("Transacoes").where({ TransacaoID: id, Tipo: "Entrada" }).del().then(rowsDeleted => {
      if (rowsDeleted > 0) {
        response.json({ message: "Transação de entrada removida com sucesso" });
      } else {
        response.status(404).json({ error: 'Transação de entrada não encontrada' });
      }
    }).catch(error => {
      console.log(error);
      response.status(500).json({ error: "Erro ao remover transação de entrada" });
    });
  }

  removerTransacaoSaida(request, response) {
    const id = parseInt(request.params.id);

    // Validar se o ID é um número inteiro positivo
    if (!Number.isInteger(id) || id <= 0) {
      return response.status(400).json({ error: 'ID de transação inválido' });
    }

    database.table("Transacoes").where({ TransacaoID: id, Tipo: "Saida" }).del().then(rowsDeleted => {
      if (rowsDeleted > 0) {
        response.json({ message: "Transação de saída removida com sucesso" });
      } else {
        response.status(404).json({ error: 'Transação de saída não encontrada' });
      }
    }).catch(error => {
      console.log(error);
      response.status(500).json({ error: "Erro ao remover transação de saída" });
    });
  }



}

module.exports = new TransacaoController();