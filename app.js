/*----------------------------------------------------------
| 1) 모듈참조
-----------------------------------------------------------*/

// 직접 구현한 모듈
const config = require("./helper/_config");
const logger = require("./helper/LogHelper");
const util = require("./helper/UtilHelper");
const fileHelper = require("./helper/FileHelper");
const webHelper = require("./helper/WebHelper");
// exceptions
const BadRequestException = require("./exceptions/BadRequestExeption");
const PageNotFoundException = require("./exceptions/PageNotFoundException");
const RuntimeException = require("./exceptions/RuntimeException");
//내장모듈
const url = require("url");
const path = require("path");
// 설치가 필요한 모듈
const express = require("express");
const useragent = require("express-useragent");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

/*----------------------------------------------------------
| 2) Express 객체 생성
-----------------------------------------------------------*/
// 여기서 생성한 app 객체의 use() 함수를 사용해서
// 각종 외부 기능, 설정 내용, URL을 계속해서 확장하는 형태로 구현이 진행된다.
const app = express();

/*----------------------------------------------------------
| 스웨거 모듈 설정
-----------------------------------------------------------*/
const swaggerDefinition = {
    info: {
        title: "daru Server API",
        version: "1.0.0",
        description: "다루 API 명세서",
    },

    host: "cheeseinthelife.com",
    basePath: "/",
    schemes: ["https"],
};
const options = {
    swaggerDefinition,
    apis: ["./schemas/teahouse.js"],
};
const swaggerSpec = swaggerJSDoc(options);

app.get("swagger.json", (err, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

/*----------------------------------------------------------
| 3) 클라이언트의 접속시 초기화 -> 접속한 클라이언트의 정보를 파악
-----------------------------------------------------------*/
app.use(useragent.express());

//클라이언트의 접속을 감지
app.use((req, res, next) => {
    logger.debug("*****클라이언트가 접속했습니다.*****");

    // 클라이언트가 접속한 시간
    const beginTime = Date.now();

    // 클라이언트의 IP주소
    const ip =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    // 클라이언트의 디바이스 정보 기록 (UserAgent 사용)
    logger.debug(
        "[client의 UserAgent]" +
            ip +
            " / " +
            req.useragent.os +
            " / " +
            req.useragent.browser +
            " (" +
            req.useragent.version +
            ") / " +
            req.useragent.platform
    );

    // 클라이언트가 요청한 페이지URL
    const current_url = url.format({
        protocol: req.protocol,
        host: req.get("host"),
        port: req.part,
        pathname: req.originalUrl,
    });

    //req.method(get,post,put,delete)
    logger.debug("[" + req.method + "]" + decodeURIComponent(current_url));

    // 클라이언트의 접속이 종료된 경우의 이벤트
    res.on("finish", () => {
        //접속 종료시간
        const endTime = Date.now();

        // 실행시간
        const time = endTime - beginTime;
        logger.debug(
            "※※※※※ 클라이언트의 접속이 종료되었습니다. ※※※※※    [실행하는데 걸린시간 runtime] :" +
                time +
                "ms"
        );
        logger.debug("----------------------------------------");
    });

    next();
});

/*----------------------------------------------------------
| 4) Express 객체의 추가 설정
-----------------------------------------------------------*/

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text()); // TEXT형식의 파라미터 수신 가능.
app.use(bodyParser.json()); // JSON형식의 파라미터 수신가능.

/** HTTP PUT, DELETE 전송방식 확장 */
app.use(methodOverride("X-HTTP-Method"));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(methodOverride("X-Method-Override"));
app.use(methodOverride("_method"));

// cors
app.use(
    cors({
        origin: "*",
        credential: "true",
    })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/** req, res 객체의 기능을 확장하는 모듈 */
https: app.use(webHelper());

// 라우터(URL 분배기)
const router = express.Router();
// 라우터를 express에 등록
app.use("/", router);

/*----------------------------------------------------------
| 5) 각 URL별 백엔드 기능 정의
-----------------------------------------------------------*/
app.use(require("./controllers/teahouse")(app));
app.use(require("./controllers/managers")(app));
app.use(require("./controllers/certification")(app));
app.use(require("./controllers/jwt")(app));

//런타임 에러가 발생한 경우에 대한 일괄 처리
app.use((err, req, res, next) => {
    if (err instanceof BadRequestException) {
        res.sendError(err);
    } else {
        res.sendError(new BadRequestException(err.message));
    }
});

// 앞에서 정의하지 않은 그 밖의 url에 대한 일괄처리
app.use("*", (req, res, next) => {
    const err = new PageNotFoundException();
    res.sendError(err);
});

/*----------------------------------------------------------
| 6) 설정한 내용을 기반으로 서버 구동 시작
-----------------------------------------------------------*/
// 백엔드를 가동하고 3000번 포트에서 대기
const ip = util.myip();

var server = app.listen(config.server_port, () => {
    logger.debug("-------------------------------------");
    logger.debug("|        Start Express Server       |");
    logger.debug("-------------------------------------");
    var host = server.address().address;

    var port = server.address().port;

    ip.forEach((v, i) => {
        logger.debug(
            "server address => http://" + v + ":" + config.server_port
        );
    });

    logger.debug("-------------------------------------");
});
