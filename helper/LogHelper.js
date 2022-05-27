/* -------------------------------------------------------------------------
 * 로그 처리 모듈
 *-----------------------------------------------------------------------*/

/** 1) 패키지 참조 */
const fileHelper = require("./FileHelper"); // 로그 처리 모듈
const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file");
const path = require("path");
const config = require("./_config");

/** 2) 로그가 저장될 폴더생성 */
fileHelper.mkdirs(config.log.debug.path);
fileHelper.mkdirs(config.log.error.path);

/** 3) 로그가 출력될 형식 지정 함수 참조 */
const { combine, timestamp, printf, splat, simple } = winston.format;

/** 4) winston 객체 만들기 */
const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss.SSS",
        }),
        printf((info) => {
            return `${info.timestamp} [${info.level}] ${info.message}`;
        }),
        splat()
    ),
    //일반 로그 규칙 정의
    transports: [
        // 하루에 하나씩 파일 형태로 기록하기 위한 설정
        new winstonDaily({
            name: "debug-file",
            level: config.log.debug.level, //출력할 로그의 수준
            datePattern: "YY-MM-DD",
            dirname: config.log.debug.path, //파일이 저장될 위치
            filename: "log_%DATE%.log", // %DATE%는 datePattern의 값
            maxsize: 50000000,
            maxFiles: 50,
            zippedArchive: true,
        }),

        new winstonDaily({
            name: "error-file",
            level: config.log.error.level,
            datePattern: "YY-MM-DD",
            dirname: config.log.error.path,
            filename: "error_%DATE%.log",
            maxsize: 50000000,
            maxFiles: 50,
            zippedArchive: true,
        }),
    ],
});

/**5) 콘솔 설정 */
// 개발단계에서만 사용
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            prettyPrint: true,
            showLevel: true,
            level: config.log.debug.level,
            format: combine(
                winston.format.colorize(),
                printf((info) => {
                    return `${info.timestamp} [${info.level}] ${info.message}`;
                })
            ),
        })
    );
}

/** 6) 모듈 내보내기 */
module.exports = logger;
