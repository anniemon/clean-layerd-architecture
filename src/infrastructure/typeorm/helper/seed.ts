import { DataSource } from 'typeorm';

export const setInitialData = async (
  dataSource: DataSource,
  fixtures: Record<string, any[]>,
) => {
  const targetFixtures = Object.assign({}, fixtures);

  await dataSource.query('PRAGMA foreign_keys = OFF');

  for (const [tableName, rows] of Object.entries(targetFixtures)) {
    await dataSource.query(`DELETE FROM ${tableName};`);
    await dataSource.query('VACUUM;');
    if (rows?.length > 0) {
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(tableName)
        .values(rows)
        .execute();
    }
  }

  await dataSource.query('PRAGMA foreign_keys = ON');
};
