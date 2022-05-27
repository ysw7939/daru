const router = require("express").Router();
const cache = require("memory-cache");

const { sendVerificationSMS } = require("../helper/CertifyHelper");

/** 라우팅 정의 부분 */
module.exports = (app) => {
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

    router.get("/kakao");

    return router;
};
