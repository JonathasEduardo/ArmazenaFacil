const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClienteController');
const ProdutoController = require('../controllers/ProdutoController');
const TransacaoController = require('../controllers/TransacaoController');

// Rotas para Cliente
router.post('/novoCliente', ClienteController.novoCliente);
router.get('/clientes', ClienteController.ListarCliente);
router.get('/cliente/:id', ClienteController.ListarUmCliente);
router.put('/atualizar/cliente/:id', ClienteController.AtualizarCliente);
router.delete('/deletar/cliente/:id', ClienteController.removerCliente);

// Rotas para Produto
router.post('/novoProduto', ProdutoController.novoProduto);
router.get('/produtos', ProdutoController.listarProdutos);
router.get('/produto/:id', ProdutoController.listarUmProduto);
router.put('/atualizar/produto/:id', ProdutoController.atualizarProduto);
router.delete('/deletar/produto/:id', ProdutoController.removerProduto);

// Rotas para Transacao
router.post('/novaTransacao/entrada', TransacaoController.novaTransacaoEntrada);
router.post('/novaTransacao/saida', TransacaoController.novaTransacaoSaida);
router.get('/transacoes',TransacaoController.listarTransacoes)
router.get('/transacao/entrada/:id', TransacaoController.listarTransacaoEntradaPorId);
router.get('/transacao/saida/:id', TransacaoController.listarTransacaoSaidaPorId);
router.put('/atualizar/transacao/entrada/:id', TransacaoController.atualizarTransacaoEntrada);
router.put('/atualizar/transacao/saida/:id', TransacaoController.atualizarTransacaoSaida);
router.delete('/deletar/transacao/entrada/:id', TransacaoController.removerTransacaoEntrada);
router.delete('/deletar/transacao/saida/:id', TransacaoController.removerTransacaoSaida);

module.exports = router;