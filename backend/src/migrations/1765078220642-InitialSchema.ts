import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1765078220642 implements MigrationInterface {
    name = 'InitialSchema1765078220642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "device_areas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "hw_id" character(4), "description" text NOT NULL DEFAULT 'No comment', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_5240e78d4e2babf86d9478613ab" UNIQUE ("name"), CONSTRAINT "UQ_b9f14499d9f0291d0c73e734016" UNIQUE ("hw_id"), CONSTRAINT "PK_7cd6f791f649c6281b536740a9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "device_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "hw_id" character(4), "description" text NOT NULL DEFAULT 'No comment', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_755591f9e972996061e1e90eb38" UNIQUE ("name"), CONSTRAINT "UQ_7a1ff058e48aa26e415bfce21aa" UNIQUE ("hw_id"), CONSTRAINT "PK_c22e8985afe8ffe3ee485e41af8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "devices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "number" numeric, "hw_id" character(14), "description" text NOT NULL DEFAULT 'No comment', "is_active" boolean NOT NULL DEFAULT true, "device_type_id" uuid NOT NULL, "device_area_id" uuid NOT NULL, CONSTRAINT "UQ_d9413c5d13d14583623d800fa77" UNIQUE ("number"), CONSTRAINT "UQ_518b940fdad78b01d8a3f13ea8b" UNIQUE ("hw_id"), CONSTRAINT "PK_b1514758245c12daf43486dd1f0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" text NOT NULL, "full_name" text NOT NULL, "password" text NOT NULL, "is_active" boolean NOT NULL DEFAULT false, "roles" text array NOT NULL DEFAULT '{user}', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_0adc0a8834ea0f252e96d154de9" UNIQUE ("full_name"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "FK_473c90a9cf5f18226886e62a3b3" FOREIGN KEY ("device_type_id") REFERENCES "device_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "FK_43974f811ca5ad692d414f74045" FOREIGN KEY ("device_area_id") REFERENCES "device_areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "FK_43974f811ca5ad692d414f74045"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "FK_473c90a9cf5f18226886e62a3b3"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "devices"`);
        await queryRunner.query(`DROP TABLE "device_types"`);
        await queryRunner.query(`DROP TABLE "device_areas"`);
    }

}
