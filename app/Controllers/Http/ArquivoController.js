"use strict";

const Arquivo = use("App/Models/Arquivo");
const Tarefa = use("App/Models/Tarefa");

const Helpers = use("Helpers");

class ArquivoController {
  async create({ params, request, response }) {
    try {
      const tarefa = await Tarefa.findOrFail(params.id);
      const arquivos = request.file("file");
      await arquivos.moveAll(Helpers.tmpPath('arquivos'), file => ({
        name: `${Date.now()}-${file.clientName}`
      }));

      if (!arquivos.movedAll()) {
        return arquivos.errors();
      }

      /*await Promise.all(
        arquivos
        .movedList()
        .map(item => Arquivo.create({tarefa_id: params.id, caminho: item.fileName}))
      );*/

      await Promise.all(
        arquivos
        .movedList()
        .map(item => tarefa.arquivos().create({caminho: item.fileName}))
      );

      return response.status(200).send({
        message: 'Arquivo inserido com sucesso'
      })
    } catch (error) {
      return response.status(500).send({
        error: `error: ${error.message}`
      });
    }
  }
}

module.exports = ArquivoController;
