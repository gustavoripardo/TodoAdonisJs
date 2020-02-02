"use strict";

const Tarefa = use("App/Models/Tarefa");
const { validateAll } = use("Validator");
const Database = use("Database");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tarefas
 */
class TarefaController {
  /**
   * Show a list of all tarefas.
   * GET tarefas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    try {
      const { id } = auth.user;
      // const tarefas = await Tarefa.all();    //CHAMA TODOS INCLUINDO OQ N É DO USER
      const tarefas = await Tarefa
      .query()
      .where('user_id', id)
      .withCount('arquivos as qtdArquivos')   //CHAMA TODOS QUE FOR DO USER
      .fetch()
      // const tarefas = await Database.select("id", "titulo", "descricao")
      //   .from("tarefas")
      //   .where("user_id", id); //CHAMA APENAS ALGUNS CAMPOS QUE FOR DO USER
      
      return tarefas;
    } catch (error) {
      return response.status(401).send({
        message: `Error: ${error.message}`
      });
    }
  }

  /**
   * Create/save a new tarefa.
   * POST tarefas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    try {
      const { id } = auth.user;

      const validation = await validateAll(request.all(), {
        titulo: "required",
        descricao: "required"
      });

      if (validation.fails()) {
        return response.status(400).send({
          message: validation.messages()
        });
      }

      const data = request.only(["titulo", "descricao"]);

      const tarefa = await await Tarefa.create({ ...data, user_id: id });

      return tarefa;
    } catch (error) {
      return response.status(400).send({
        message: `Error: ${error.message}`
      });
    }
  }

  /**
   * Display a single tarefa.
   * GET tarefas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response, auth }) {
    try {
      const { id } = auth.user;

      const tarefa = await Tarefa
        .query()
        .where("user_id", id)
        .where("id", params.id)
        .first();

      if (!tarefa) {
        return response.status(404).send({
          message: "Item não encontrado"
        });
      }
      await tarefa.load('arquivos')
      return tarefa;
    } catch (error) {
      return response.status(400).send({
        message: `Erro: ${error.messages()}`
      });
    }
  }

  /**
   * Update tarefa details.
   * PUT or PATCH tarefas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    try {
      const { id } = auth.user;
      const { titulo, descricao } = request.all();

      const tarefa = await Tarefa
        .query()
        .where("user_id", id)
        .where("id", params.id)
        .first();

      if (!tarefa) {
        return response.status(404).send({
          message: "Item não encontrado"
        });
      }

      tarefa.titulo = titulo;
      tarefa.descricao = descricao;
      tarefa.id = params.id;

      await tarefa.save();

      return tarefa;
    } catch (error) {
      return response.status(400).send({
        message: error.messages()
      });
    }
  }

  /**
   * Delete a tarefa with id.
   * DELETE tarefas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, auth, response }) {
    try {
      const { id } = auth.user;
      

      const tarefa = await Tarefa
        .query()
        .where("user_id", id)
        .where("id", params.id)
        .first();

      if (!tarefa) {
        return response.status(404).send({
          message: "Item não encontrado"
        });
      }

      await tarefa.delete()
      return response.status(200).send({
        message: "Item removido"
      })
    } catch (error) {
      return response.status(500).send({
        error: `error: ${error.message}`
      });
    }
  }
}

module.exports = TarefaController;
