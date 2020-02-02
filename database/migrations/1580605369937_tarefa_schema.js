"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TarefaSchema extends Schema {
  up() {
    this.create("tarefas", table => {
      table.increments();
      //Meu conteudo é para estar entre table.increments() e table.timestamps()

      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      table.string("titulo").notNullable();
      table.string("descricao").notNullable();

      table.timestamps();
    });
  }

  down() {
    this.drop("tarefas");
  }
}

module.exports = TarefaSchema;
