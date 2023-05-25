/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('service_orders', table => {
    table.increments('id')
    table.string('data_id').notNullable().unique()
    table.string('entity_name')
    table.string('employee')
    table.string('equipment')
    table.string('service_order')
    table.string('status')
    table.text('docs')
    table.string('requesting_contact')
    table.text('problem')
    table.text('short_description')
    table.text('summary')
    table.text('address')
    table.string('date_created')
    table.string('date_modified')
    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('service_orders')
}
