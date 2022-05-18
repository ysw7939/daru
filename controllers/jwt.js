const config = require("../helper/_config");
const logger = require("../helper/LogHelper");
const router = require("express").Router();
const mysql2 = require("mysql2/promise");
const regexHelper = require("../helper/RegexHelper");
const utilHelper = require("../helper/UtilHelper");
const jwt = require("jsonwebtoken");
const BadRequestException = require("../exceptions/BadRequestExeption");

const { generateAccessToken } = require("../helper/CertifyHelper");
const { generateRefreshToken } = require("../helper/CertifyHelper");
const { authenticateAccessToken } = require("../helper/CertifyHelper");

// const { upload } = require('../../helper/_config');

/** 라우팅 정의 부분 */
module.exports = (app) => {
    let dbcon = null;

    // 아이디 중복 검사
    router.post("/members/id_unique_check", async (req, res, next) => {
        //파라미터 받기
        const user_id = req.post("user_id");

        try {
            regexHelper.value(user_id, "아이디를 입력하세요.");
        } catch (err) {
            return next(err);
        }

        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.database);
            await dbcon.connect();

            let sql1 = "SELECT COUNT(*) as cnt FROM members WHERE user_id=?";
            let args1 = [user_id];

            const [result1] = await dbcon.query(sql1, args1);
            const totalCount = result1[0].cnt;

            if (totalCount > 0) {
                throw new BadRequestException("이미 사용중인 이이디 입니다.");
            }
        } catch (err) {
            return next(err);
        } finally {
            dbcon.end();
        }

        res.sendJson();
    });

    router.post("/managers/login", async (req, res, next) => {
        // 파라미터 받기
        const user_id = req.post("user_id");
        const password = req.post("password");

        try {
            // 아이디와 비밀번호를 유추하는데 흰트가 될 수 있으므로
            // 유효성 검사는 입력 여부만 확인한다.
            regexHelper.value(user_id, "아이디를 입력하세요.");
            regexHelper.value(password, "비밀번호를 입력하세요.");
        } catch (err) {
            return next(err);
        }

        let json = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.database);
            await dbcon.connect();

            let sql1 =
                "SELECT manager_id, email, phone, password, user_id, date_birth, gender FROM managers WHERE user_id=? AND password=? ";
            let args1 = [user_id, password];

            const [result] = await dbcon.query(sql1, args1);

            json = result;

            if (json == null || json.length == 0) {
                return next(
                    new BadRequestException(
                        "아이디나 비밀번호가 잘못되었습니다."
                    )
                );
            }
            let accessToken = generateAccessToken(json[0].user_id);
            let refreshToken = generateRefreshToken(json[0].user_id);

            try {
                let sql2 =
                    "INSERT INTO tokens (refreshtoken, manager_id) VALUES (?,?)";
                let args2 = [refreshToken, json[0].manager_id];

                const [result] = await dbcon.query(sql2, args2);
            } catch (err) {
                return next(err);
            }

            res.json({ accessToken, refreshToken });
        } catch (err) {
            return next(err);
        } finally {
            dbcon.end();
        }
    });

    // access token을 refresh token 기반으로 재발급
    router.post("/refresh", async (req, res, next) => {
        let refreshToken = req.post("refreshToken");
        if (!refreshToken) return res.sendStatus(401);

        let user_id = null;

        jwt.verify(refreshToken, config.jwt.secret, (error, user) => {
            if (error) return res.sendStatus(403);

            user_id = user;
        });

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.database);
            await dbcon.connect();

            let sql1 =
                "SELECT COUNT(*) as cnt FROM tokens WHERE refreshtoken=?";
            let args1 = [refreshToken];

            const [result1] = await dbcon.query(sql1, args1);

            if (result1[0].cnt < 1) {
                throw new BadRequestException("일치하는 리프레쉬토큰이없음");
            }
        } catch (err) {
            return next(err);
        }

        let accessToken = generateAccessToken(user_id);
        let new_refreshToken = generateRefreshToken(user_id);

        try {
            let sql2 = "UPDATE tokens SET refreshtoken=? WHERE refreshtoken=?";
            let args2 = [new_refreshToken, refreshToken];

            const [result] = await dbcon.query(sql2, args2);
        } catch (err) {
            return next(err);
        } finally {
            dbcon.end();
        }

        res.json({ accessToken, new_refreshToken });
    });

    // access token 유효성 확인을 위한 예시 요청
    router.get("/manager_info", authenticateAccessToken, async (req, res) => {
        console.log(req.user);

        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;

        // 데이터베이스 접속
        dbcon = await mysql2.createConnection(config.database);
        await dbcon.connect();

        // 아이디와 비밀번호가 일치하는 데이터를 조회 (조회결과에서 비밀번호는 제외)
        let sql1 =
            "SELECT manager_id, email, phone, user_id, date_birth, gender FROM managers WHERE user_id=? ";
        let args1 = [req.user.id];

        const [result] = await dbcon.query(sql1, args1);

        // 조회된 회원정보 객체를 저장하고 있는 1차원 배열(원소는 1개)
        json = result;

        // 조회된 데이터가 없다면? WHERE절이 맞지 않다는 의미 -> 아이디,비번 틀림
        if (json == null || json.length == 0) {
            return next(new BadRequestException("아이디가 잘못되었습니다."));
        }

        res.sendJson({ item: json });
    });

    return router;
};
