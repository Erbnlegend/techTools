/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('comments', table => {
    table.increments('id')
    table.string('data_id')
    table.string('employee')
    table.string('comment')
    table.string('path')
    table.specificType('file_name', 'text ARRAY')
    table.string('date')
    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('comments')
}