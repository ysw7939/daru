/**
 * department 테이블에 대한 CRUD 기능을 수행하는 Restful API
 */

/** 모듈 참조 부분 */
const config = require("../helper/_config");
const logger = require("../helper/LogHelper");
const router = require("express").Router();
const mysql2 = require("mysql2/promise");
const regexHelper = require("../helper/RegexHelper");
const cache = require("memory-cache");
const BadRequestException = require("../exceptions/BadRequestExeption");

const { sendVerificationSMS } = require("../helper/SmsHelper");

/** 라우팅 정의 부분 */
module.exports = (app) => {
    let dbcon = null;

    router.post("/sms", sendVerificationSMS);

    router.post("/cotfc_num", async (req, res, next) => {
        const phone = req.post("phone");
        const number = req.post("number");

        const cachedata = cache.get(phone);
        if (!cachedata) {
            return next(new Error("인증번호를 다시 요청해주세요."));
        }

        if (cachedata !== number) {
            return next(new Error("인증번호를 다시 요청해주세요."));
        }

        cache.del(number);
        return res.sendJson({ message: "인증번호 검증 성공" });
    });

    return router;
};
