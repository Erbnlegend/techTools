/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('tech_trips', table => {
    table.increments('id')
    table.string('data_id').notNullable()
    table.string('trip_id')
    table.string('tech')
    table.string('arrived')
    table.string('date_set')
    table.string('date_depart')
    table.string('allocated_hours')
    table.bigint('labor_start_time')
    table.bigint('labor_end_time')
    table.bigint('travel_start_time')
    table.bigint('travel_end_time')
    table.float('labor_hours')
    table.float('labor_travel')
    table.string('created')
    table.string('last_modified')
    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('tech_trips')
}
