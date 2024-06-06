import { DataSource, DataSourceOptions } from 'typeorm';
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: '',
  password: '',
  database: '',
  entities: ['dist/**/*.entity.js'], //1
  synchronize: false,
  migrations: ['dist/db/migrations/*.js'], // 3
};
const dataSource = new DataSource(dataSourceOptions); //4
export default dataSource;
