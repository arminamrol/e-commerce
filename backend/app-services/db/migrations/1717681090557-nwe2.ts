import { MigrationInterface, QueryRunner } from "typeorm";

export class Nwe21717681090557 implements MigrationInterface {
    name = 'Nwe21717681090557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "mamad" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mamad"`);
    }

}
