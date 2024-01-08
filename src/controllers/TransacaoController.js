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

  listarTransacoes(request, response) {
    const { tipoTransacao } = request.query;
  
    // Validar se o tipo de transação fornecido é válido (opcional)
    if (tipoTransacao && !["Entrada", "Saida"].includes(tipoTransacao)) {
      return response.status(400).json({ error: 'Tipo de transação inválido' });
    }
  
    // Construir a consulta base
    let query = database.select("*").table("Transacoes");
  
    // Adicionar um filtro se o tipo de transação for fornecido
    if (tipoTransacao) {
      query = query.where({ Tipo: tipoTransacao });
    }
  
    // Executar a consulta
    query.then(transacoes => {
      response.json(transacoes);
    }).catch(error => {
      console.log(error);
      response.status(500).json({ error: "Erro ao listar transações" });
    });
  }

  listarUmaTransacao(request, response) {
    const id = parseInt(request.params.id);
  
    // Validar se o ID é um número inteiro positivo
    if (!Number.isInteger(id) || id <= 0) {
      return response.status(400).json({ error: 'ID de transação inválido' });
    }
  
    // Verificar se a transação com o ID fornecido existe no banco de dados
    database.select("*").table("Transacoes").where({ TransacaoID: id }).then(transacoes => {
      if (transacoes.length === 0) {
        // Transação não encontrada, retornar status 404
        return response.status(404).json({ error: 'Transação não encontrada' });
      }
  
      // Transação encontrada, determinar o tipo e adicionar ao objeto de resposta
      const tipoTransacao = transacoes[0].Tipo;
      const transacaoComTipo = { ...transacoes[0], TipoTransacao: tipoTransacao };
  
      // Retornar os detalhes da transação com o tipo
      response.json(transacaoComTipo);
    }).catch(error => {
      // Tratar erros no acesso ao banco de dados
      console.log(error);
      response.status(500).json({ error: "Erro ao obter detalhes da transação" });
    });
  }
  atualizarTransacao(request, response) {
    const id = parseInt(request.params.id);
    const { ClienteID, ProdutoID, Tipo, Quantidade, DataHoraEntrada, DataHoraSaida } = request.body;

    // Validar se o ID é um número inteiro positivo
    if (!Number.isInteger(id) || id <= 0) {
      return response.status(400).json({ error: 'ID de transação inválido' });
    }

    // Verificar se a transação com o ID fornecido existe no banco de dados
    database.select("*").table("Transacoes").where({ TransacaoID: id }).then(transacoes => {
      if (transacoes.length === 0) {
        // Transação não encontrada, retornar status 404
        return response.status(404).json({ error: 'Transação não encontrada' });
      }

      // Transação encontrada, dados são diferentes e campos são válidos, realizar a atualização
      const updatedFields = {};

      // Verificar se pelo menos um dos campos deve ser fornecido para atualização
      if (ClienteID !== transacoes[0].ClienteID) updatedFields.ClienteID = ClienteID;
      if (ProdutoID !== transacoes[0].ProdutoID) updatedFields.ProdutoID = ProdutoID;
      if (Tipo !== transacoes[0].Tipo) updatedFields.Tipo = Tipo;
      if (Quantidade !== transacoes[0].Quantidade) updatedFields.Quantidade = Quantidade;
      if (DataHoraEntrada !== transacoes[0].DataHoraEntrada) updatedFields.DataHoraEntrada = DataHoraEntrada;
      if (DataHoraSaida !== transacoes[0].DataHoraSaida) updatedFields.DataHoraSaida = DataHoraSaida;

      if (
        updatedFields.ClienteID === undefined &&
        updatedFields.ProdutoID === undefined &&
        updatedFields.Tipo === undefined &&
        updatedFields.Quantidade === undefined &&
        updatedFields.DataHoraEntrada === undefined &&
        updatedFields.DataHoraSaida === undefined
      ) {
        return response.status(400).json({ error: 'Pelo menos um dos campos deve ser modificado para realizar a atualização.' });
      }

      database.table("Transacoes").where({ TransacaoID: id }).update(updatedFields).then(updatedTransacao => {
        response.json({ message: "Transação atualizada com sucesso" });
      }).catch(error => {
        console.log(error);
        response.status(500).json({ error: "Erro ao atualizar transação" });
      });
    }).catch(error => {
      // Tratar erros no acesso ao banco de dados
      console.log(error);
      response.status(500).json({ error: "Erro ao obter detalhes da transação para atualização" });
    });
  }

  removerTransacao(request, response) {
    const id = parseInt(request.params.id);

    // Validar se o ID é um número inteiro positivo
    if (!Number.isInteger(id) || id <= 0) {
      return response.status(400).json({ error: 'ID de transação inválido' });
    }

    database.table("Transacoes").where({ TransacaoID: id }).del().then(rowsDeleted => {
      if (rowsDeleted > 0) {
        response.json({ message: "Transação removida com sucesso" });
      } else {
        response.status(404).json({ error: 'Transação não encontrada' });
      }
    }).catch(error => {
      console.log(error);
      response.status(500).json({ error: "Erro ao remover transação" });
    });
  }
}

module.exports = new TransacaoController();