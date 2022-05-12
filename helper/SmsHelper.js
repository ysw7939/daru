const { sens } = require("./_config");
const CryptoJS = require("crypto-js");
const axios = require("axios");
const cache = require("memory-cache");

module.exports = {
    sendVerificationSMS: async (req, res) => {
        try {
            const phone = req.post("phone");

            cache.del(phone);

            let verifyCode = "";
            for (let i = 0; i < 6; i++) {
                verifyCode += parseInt(Math.random() * 10);
            }

            cache.put(phone, verifyCode, 180000); // 유효시간 3분
            const date = Date.now().toString(); // 날짜 string

            // 환경 변수
            const sens_service_id = sens.serviceId;
            const sens_access_key = sens.accessKey;
            const sens_secret_key = sens.secretKey;
            const sens_call_number = sens.callNumber;

            // url 관련 변수 선언.
            const method = "POST";
            const space = " ";
            const newLine = "\n";
            const url = `https://sens.apigw.ntruss.com/sms/v2/services/${sens_service_id}/messages`;
            const url2 = `/sms/v2/services/${sens_service_id}/messages`;

            // signature 작성 : crypto-js 모듈을 이용하여 암호화
            const hmac = CryptoJS.algo.HMAC.create(
                CryptoJS.algo.SHA256,
                sens_secret_key
            );
            hmac.update(method);
            hmac.update(space);
            hmac.update(url2);
            hmac.update(newLine);
            hmac.update(date);
            hmac.update(newLine);
            hmac.update(sens_access_key);
            const hash = hmac.finalize();
            const signature = hash.toString(CryptoJS.enc.Base64);

            // sens 서버로 요청 전송
            const smsRes = await axios({
                method: method,
                url: url,
                headers: {
                    "Contenc-type": "application/json; charset=utf-8",
                    "x-ncp-iam-access-key": sens_access_key,
                    "x-ncp-apigw-timestamp": date,
                    "x-ncp-apigw-signature-v2": signature,
                },
                data: {
                    type: "SMS",
                    countryCode: "82",
                    from: sens_call_number,
                    content: `인증번호는 [${verifyCode}] 입니다.`,
                    messages: [{ to: `${phone}` }],
                },
            });
            console.log("response", smsRes.data);
            return res.status(200).json({ message: "SMS sent" });
        } catch (err) {
            console.log(err);
            return res.status(404).json({ message: "SMS not sent" });
        }
    },
};
