import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1687510940898 implements MigrationInterface {
    name = 'Migration1687510940898';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "likes" (
                "postsId" integer NOT NULL,
                "usersId" integer NOT NULL,
                CONSTRAINT "PK_ec06673d02806abfa9ec8e5fcfb" PRIMARY KEY ("postsId", "usersId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_376f9c48925cfe81125f0a8715" ON "likes" ("postsId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_d5312be6de5784293ac2908978" ON "likes" ("usersId")
        `);
        await queryRunner.query(`
            ALTER TABLE "posts"
            ADD "numberOfLikes" integer DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "likes"
            ADD CONSTRAINT "FK_376f9c48925cfe81125f0a87152" FOREIGN KEY ("postsId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "likes"
            ADD CONSTRAINT "FK_d5312be6de5784293ac29089784" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "likes" DROP CONSTRAINT "FK_d5312be6de5784293ac29089784"
        `);
        await queryRunner.query(`
            ALTER TABLE "likes" DROP CONSTRAINT "FK_376f9c48925cfe81125f0a87152"
        `);
        await queryRunner.query(`
            ALTER TABLE "posts" DROP COLUMN "numberOfLikes"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_d5312be6de5784293ac2908978"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_376f9c48925cfe81125f0a8715"
        `);
        await queryRunner.query(`
            DROP TABLE "likes"
        `);
    }
}
