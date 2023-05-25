/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('contacts', table => {
    table.increments('id')
    table.string('entity_id').notNullable()
    table.string('internal_id')
    table.string('name')
    table.string('company_name')
    table.string('email')
    table.string('phone')
    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('contacts')
}