/**
 * department 테이블에 대한 CRUD 기능을 수행하는 Restful API
 */

/** 모듈 참조 부분 */
const config = require("../helper/_config");
const logger = require("../helper/LogHelper");
const router = require("express").Router();
const mysql2 = require("mysql2/promise");
const regexHelper = require("../helper/RegexHelper");
const utilHelper = require("../helper/UtilHelper");

const { sendVerificationSMS } = require("../helper/CertifyHelper");

/** 라우팅 정의 부분 */
module.exports = (app) => {
    let dbcon = null;

    /** 전체 목록 조회 --> Read(SELECT) */
    router.get("/managers", async (req, res, next) => {
        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.database);
            await dbcon.connect();

            // 데이터 조회
            const sql =
                "SELECT manager_id, email, phone, user_id, date_birth, gender FROM managers";
            const [result] = await dbcon.query(sql);
            json = result;
        } catch (err) {
            return next(err);
        } finally {
            dbcon.end();
        }

        //모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson({ item: json });
    });

    /** 특정 항목에 대한 상세 조회 --> Read(SELECT) */
    router.get("/managers/:manager_id", async (req, res, next) => {
        const manager_id = req.get("manager_id");

        if (manager_id == null) {
            // 400 Bad Request -> 잘못된 요청
            return next(new Error(400));
        }
        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.database);
            await dbcon.connect();

            // 데이터 조회
            const sql =
                "SELECT manager_id, email, phone, password, user_id, date_birth, gender FROM managers where manager_id=?";
            const [result] = await dbcon.query(sql, [manager_id]);

            // 조회 결과를 미리 준비한 변수에 저장함
            json = result;
        } catch (err) {
            next(err);
        } finally {
            dbcon.end();
        }

        //모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson({ item: json });
    });

    /** 데이터 추가 --> Create(INSERT) */
    router.post("/managers", async (req, res, next) => {
        // 저장을 위한 파라미터 입력받기
        const email = req.post("email");
        const phone = req.post("phone");
        const password = req.post("password");
        const user_id = req.post("user_id");
        const date_birth = req.post("date_birth");
        const gender = req.post("gender");

        try {
            regexHelper.value(email, "이름이 없습니다.");
            regexHelper.value(user_id, "정보가 없습니다.");
            regexHelper.value(password, "정보가 없습니다.");
            regexHelper.value(gender, "정보가 없습니다.");
            regexHelper.value(date_birth, "정보가 없습니다.");
        } catch (err) {
            return next(err);
        }

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.database);
            await dbcon.connect();

            // 데이터 저장하기
            const sql =
                "INSERT INTO managers (email, phone, password, user_id, date_birth, gender) VALUES (?, ?, ?, ?, ?, ?)";
            const input_data = [
                email,
                phone,
                password,
                user_id,
                date_birth,
                gender,
            ];
            const [result1] = await dbcon.query(sql, input_data);

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            const sql2 =
                "SELECT manager_id, email, phone, user_id, date_birth, gender FROM managers WHERE manager_id=?";
            const [result2] = await dbcon.query(sql2, [result1.insertId]);

            // 조회 결과를 미리 준비한 변수에 저장함
            json = result2;
        } catch (err) {
            return next(err);
        } finally {
            dbcon.end();
        }

        // 모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson({ item: json });
    });

    /** 데이터 수정 --> Update(UPDATE) */
    router.put("/managers/:manager_id", async (req, res, next) => {
        const manager_id = req.get("manager_id");

        const email = req.post("email");
        const phone = req.post("phone");
        const password = req.post("password");
        const user_id = req.post("user_id");
        const date_birth = req.post("date_birth");
        const gender = req.post("gender");

        try {
            regexHelper.value(email, "이름이 없습니다.");
            regexHelper.value(user_id, "정보가 없습니다.");
            regexHelper.value(password, "정보가 없습니다.");
            regexHelper.value(gender, "정보가 없습니다.");
            regexHelper.value(date_birth, "정보가 없습니다.");
        } catch (err) {
            return next(err);
        }

        /** 데이터 수정하기 */
        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.database);
            await dbcon.connect();

            // 데이터 수정하기
            const sql =
                "UPDATE managers SET email=?, phone=?, password=?, user_id=?, date_birth=?, gender=? WHERE manager_id=?";
            const input_data = [
                email,
                phone,
                password,
                user_id,
                date_birth,
                gender,
                manager_id,
            ];
            const [result1] = await dbcon.query(sql, input_data);

            // 결과 행 수가 0이라면 예외처리
            if (result1.affectedRows < 1) {
                throw new Error("수정된 데이터가 없습니다.");
            }

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            const sql2 =
                "SELECT manager_id, email, phone, user_id, date_birth, gender FROM managers where manager_id=?";
            const [result2] = await dbcon.query(sql2, [manager_id]);

            // 조회 결과를 미리 준비한 변수에 저장함
            json = result2;
        } catch (err) {
            return next(err);
        } finally {
            dbcon.end();
        }

        // 모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson({ item: json });
    });

    /** 데이터 삭제 --> Delete(DELETE) */
    router.delete("/managers/:manager_id", async (req, res, next) => {
        const manager_id = req.get("manager_id");

        /** 데이터 삭제하기 */
        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.database);
            await dbcon.connect();

            // 삭제하고자 하는 원 데이터를 참조하는 자식 데이터를 먼저 삭제해야 한다.
            // 만약 자식데이터를 유지해야 한다면 참조키 값을 null로 업데이트 해야 한다.
            // 단, 자식 데이터는 결과행 수가 0이더라도 무시한다.

            // 데이터 삭제하기
            const sql = "DELETE FROM managers WHERE manager_id=?";
            const [result1] = await dbcon.query(sql, [manager_id]);

            // 결과 행 수가 0이라면 예외처리
            if (result1.affectedRows < 1) {
                throw new Error("삭제된 데이터가 없습니다.");
            }
        } catch (err) {
            return next(err);
        } finally {
            dbcon.end();
        }

        // 모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson();
    });

    return router;
};
