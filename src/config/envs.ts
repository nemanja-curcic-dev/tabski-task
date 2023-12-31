// environment variables
export class Envs {
    public static DATABASE_URL: string = process.env.DATABASE_URL || 'postgres://tabski:tabski@db:5432/tabski';
    public static HTTP_PORT = Number(process.env.HTTP_PORT || '4000');

    public static LOG_LEVEL: string = (process.env.LOG_LEVEL || 'debug').toLowerCase();
    public static TESTING: boolean = process.env.TESTING === 'true';
}
