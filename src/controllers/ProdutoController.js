const { response } = require('express');
const database = require('../database/conenection');


class ProdutoController {
  novoProduto(request, response) {
    const { Nome, QuantidadeEmEstoque, Tipo, Tamanho, Marca, CodigoDeBarras } = request.body;

    // Verificar se já existe um produto com o mesmo nome
    database.select('ProdutoID').from('Produtos').where('Nome', Nome).then(existingProduct => {
      if (existingProduct.length > 0) {
        // Produto com mesmo nome já existe
        const existingProductId = existingProduct[0].ProdutoID;
        response.status(409).json({ message: `Já existe um produto cadastrado com o nome '${Nome}'. ID do produto existente: ${existingProductId}` });
      } else {
        // Verificar se já existe um produto com o mesmo código de barras
        database.select('ProdutoID').from('Produtos').where('CodigoDeBarras', CodigoDeBarras).then(existingProductCode => {
          if (existingProductCode.length > 0) {
            // Produto com mesmo código de barras já existe
            const existingProductId = existingProductCode[0].ProdutoID;
            response.status(409).json({ message: `Já existe um produto cadastrado com o código de barras '${CodigoDeBarras}'. ID do produto existente: ${existingProductId}` });
          } else {
            // Nenhum produto existente com mesmo nome ou código de barras, pode inserir
            database.insert({ Nome, QuantidadeEmEstoque, Tipo, Tamanho, Marca, CodigoDeBarras }).table("Produtos").then(data => {
              const newProductId = data[0];
              response.json({ message: "Produto criado com sucesso"});
            }).catch(error => {
              console.log(error);
              response.status(500).json({ error: "Erro ao criar produto" });
            });
          }
        }).catch(error => {
          console.log(error);
          response.status(500).json({ error: "Erro ao verificar código de barras existente" });
        });
      }
    }).catch(error => {
      console.log(error);
      response.status(500).json({ error: "Erro ao verificar nome existente" });
    });
  }

  listarProdutos(request, response) {
    database.select("*").table("Produtos").then(produtos => {
      response.json(produtos);
    }).catch(error => {
      console.log(error);
      response.status(500).json({ error: "Erro ao listar produtos" });
    });
  }

  listarUmProduto(request, response) {
    const id = parseInt(request.params.id);

    // Validar se o ID é um número inteiro positivo
    if (!Number.isInteger(id) || id <= 0) {
      return response.status(400).json({ error: 'ID de produto inválido' });
    }

    // Verificar se o produto com o ID fornecido existe no banco de dados
    database.select("*").table("Produtos").where({ ProdutoID: id }).then(produtos => {
      if (produtos.length === 0) {
        // Produto não encontrado, retornar status 404
        return response.status(404).json({ error: 'Produto não encontrado' });
      }

      // Produto encontrado, retornar os detalhes do produto
      response.json(produtos);
    }).catch(error => {
      // Tratar erros no acesso ao banco de dados
      console.log(error);
      response.status(500).json({ error: "Erro ao obter detalhes do produto" });
    });
  }

  atualizarProduto(request, response) {
    const id = parseInt(request.params.id);
    const { Nome, QuantidadeEmEstoque, Tipo, Tamanho, Marca, CodigoDeBarras } = request.body;
  
    // Validar se o ID é um número inteiro positivo
    if (!Number.isInteger(id) || id <= 0) {
      return response.status(400).json({ error: 'ID de produto inválido' });
    }
  
    // Verificar se o produto com o ID fornecido existe no banco de dados
    database.select("*").table("Produtos").where({ ProdutoID: id }).then(produtos => {
      if (produtos.length === 0) {
        // Produto não encontrado, retornar status 404
        return response.status(404).json({ error: 'Produto não encontrado' });
      }
  
      // Produto encontrado, dados são diferentes e campos são válidos, realizar a atualização
      const updatedFields = {};
  
      // Verificar se pelo menos um dos campos deve ser fornecido para atualização
      if (Nome !== produtos[0].Nome) updatedFields.Nome = Nome;
      if (QuantidadeEmEstoque !== produtos[0].QuantidadeEmEstoque) updatedFields.QuantidadeEmEstoque = QuantidadeEmEstoque;
      if (Tipo !== produtos[0].Tipo) updatedFields.Tipo = Tipo;
      if (Tamanho !== produtos[0].Tamanho) updatedFields.Tamanho = Tamanho;
      if (Marca !== produtos[0].Marca) updatedFields.Marca = Marca;
      if (CodigoDeBarras !== produtos[0].CodigoDeBarras) updatedFields.CodigoDeBarras = CodigoDeBarras;
  
      if (
        updatedFields.Nome === undefined &&
        updatedFields.QuantidadeEmEstoque === undefined &&
        updatedFields.Tipo === undefined &&
        updatedFields.Tamanho === undefined &&
        updatedFields.Marca === undefined &&
        updatedFields.CodigoDeBarras === undefined
      ) {
        return response.status(400).json({ error: 'Pelo menos um dos campos deve ser modificado para realizar a atualização.' });
      }
  
      database.table("Produtos").where({ ProdutoID: id }).update(updatedFields).then(updatedProduto => {
        response.json({ message: "Produto atualizado com sucesso" });
      }).catch(error => {
        console.log(error);
        response.status(500).json({ error: "Erro ao atualizar produto" });
      });
    }).catch(error => {
      // Tratar erros no acesso ao banco de dados
      console.log(error);
      response.status(500).json({ error: "Erro ao obter detalhes do produto para atualização" });
    });
  }

  removerProduto(request, response) {
    const id = parseInt(request.params.id);

    // Validar se o ID é um número inteiro positivo
    if (!Number.isInteger(id) || id <= 0) {
      return response.status(400).json({ error: 'ID de produto inválido' });
    }

    database.table("Produtos").where({ ProdutoID: id }).del().then(rowsDeleted => {
      if (rowsDeleted > 0) {
        response.json({ message: "Produto removido com sucesso" });
      } else {
        response.status(404).json({ error: 'Produto não encontrado' });
      }
    }).catch(error => {
      console.log(error);
      response.status(500).json({ error: "Erro ao remover produto" });
    });
  }
}

module.exports = new ProdutoController();