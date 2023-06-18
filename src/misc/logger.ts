/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import winston from 'winston';
import { Envs } from '../config/envs';

const customFormat = winston.format.combine(
    winston.format.colorize({
        all: true,
    }),
    winston.format.label({
        label: '[template-service]',
    }),
    winston.format.timestamp({
        format: 'YY-MM-DD HH:mm:ss',
    }),
    winston.format.printf((info) => ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`)
);

export const logger = winston.createLogger({
    level: Envs.LOG_LEVEL,
    defaultMeta: { service: 'template-service' },
    transports: [
        new winston.transports.Console({
            format: customFormat,
        }),
    ],
});

export function LogResolverCalled(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        logger.debug(`---------- ${propertyKey} resolver called ----------`);
        return originalMethod.apply(this, args);
    };

    return descriptor;
}
