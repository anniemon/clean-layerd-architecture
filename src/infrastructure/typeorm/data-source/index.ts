import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: ':memory:',
  entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
  synchronize: true,
  logging: false,
};

const dataSource = new DataSource(<DataSourceOptions>dataSourceOptions);
export default dataSource;
