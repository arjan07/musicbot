import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'log' }),
    ],
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
    ),
});

export default class LoggerTool {
    static warn(message: any) {
        logger.log('warn', message);
    }

    static error(message: any) {
        logger.log('error', message);
    }

    static info(message: any) {
        logger.log('info', message);
    }
}
