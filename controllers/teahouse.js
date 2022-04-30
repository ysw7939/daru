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

/** 라우팅 정의 부분 */
module.exports = (app) => {
    let dbcon = null;

    /** 전체 목록 조회 --> Read(SELECT) */
    router.get("/teahouse", async (req, res, next) => {
        // 현재 페이지 번호 받기 (기본값은 1)
        const page = req.get("page", 1);

        // 한 페이지에 보여줄 목록 수 받기 (기본값은 10, 최소 10, 최대 30)
        const rows = req.get("rows", 10);

        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;
        let pagenation = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.database);
            await dbcon.connect();

            // 전체 데이터 수를 조회
            let sql1 = "SELECT COUNT(*) AS cnt FROM teahouse";

            const [result1] = await dbcon.query(sql1);
            const totalCount = result1[0].cnt;

            // 페이지번호 정보를 계산한다.
            pagenation = utilHelper.pagenation(totalCount, page, rows);
            logger.debug(JSON.stringify(pagenation));

            // 데이터 조회
            let sql2 =
                "SELECT place_name, phone, address, manager_phone FROM teahouse";

            // SQL문에 설정할 치환값
            let args2 = [];

            sql2 += " LIMIT ?, ?";
            args2.push(pagenation.offset);
            args2.push(pagenation.listCount);

            const [result2] = await dbcon.query(sql2, args2);

            // 조회 결과를 미리 준비한 변수에 저장함
            json = result2;
        } catch (err) {
            return next(err);
        } finally {
            dbcon.end();
        }

        // 모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson({ pagenation: pagenation, item: json });
    });

    /** 전체 목록 조회 --> Read(SELECT) */
    router.get("/teahouse/all", async (req, res, next) => {
        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.database);
            await dbcon.connect();

            // 데이터 조회
            const sql =
                "SELECT place_name, phone, address, manager_phone FROM teahouse";
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
    router.get("/teahouse/:teahouse_id", async (req, res, next) => {
        const teahouse_id = req.get("teahouse_id");

        if (teahouse_id == null) {
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
                "SELECT place_name, phone, address, manager_phone FROM teahouse WHERE teahouse_id=?";
            const [result] = await dbcon.query(sql, [teahouse_id]);

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
    router.post("/teahouse", async (req, res, next) => {
        // 저장을 위한 파라미터 입력받기
        const place_name = req.post("place_name");
        const phone = req.post("phone");
        const address = req.post("address");
        const manager_phone = req.post("manager_phone");

        try {
            regexHelper.value(place_name, "이름이 없습니다.");
            regexHelper.value(phone, "정보가 없습니다.");
            regexHelper.value(address, "정보가 없습니다.");
            regexHelper.value(manager_phone, "정보가 없습니다.");
        } catch (err) {
            return next(err);
        }

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.database);
            await dbcon.connect();

            // 데이터 저장하기
            const sql =
                "INSERT INTO teahouse (place_name, phone, address, manager_phone) VALUES (?, ?, ?, ?)";
            const input_data = [place_name, phone, address, manager_phone];
            const [result1] = await dbcon.query(sql, input_data);

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            const sql2 =
                "SELECT place_name, phone, address, manager_phone FROM teahouse WHERE teahouse_id=?";
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

    // /** 데이터 수정 --> Update(UPDATE) */
    // router.put("/department/:deptno", async (req, res, next) => {
    //     const deptno = req.get("deptno");
    //     const dname = req.put("dname");
    //     const loc = req.put("loc");

    //     console.log(deptno);
    //     console.log(dname);
    //     console.log(loc);
    //     if (deptno == null || dname == null || loc == null) {
    //         // 400 Bad Request -> 잘못된 요청

    //         return next(new BadRequestException("잘못된요청"));
    //     }

    //     /** 데이터 수정하기 */
    //     // 데이터 조회 결과가 저장될 빈 변수
    //     let json = null;

    //     try {
    //         // 데이터베이스 접속
    //         dbcon = await mysql2.createConnection(config.database);
    //         await dbcon.connect();

    //         // 데이터 수정하기
    //         const sql = "UPDATE department SET dname=?, loc=? WHERE deptno=?";
    //         const input_data = [dname, loc, deptno];
    //         const [result1] = await dbcon.query(sql, input_data);

    //         // 결과 행 수가 0이라면 예외처리
    //         if (result1.affectedRows < 1) {
    //             throw new Error("수정된 데이터가 없습니다.");
    //         }

    //         // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
    //         const sql2 =
    //             "SELECT deptno, dname, loc FROM department WHERE deptno=?";
    //         const [result2] = await dbcon.query(sql2, [deptno]);

    //         // 조회 결과를 미리 준비한 변수에 저장함
    //         json = result2;
    //     } catch (err) {
    //         return next(err);
    //     } finally {
    //         dbcon.end();
    //     }

    //     // 모든 처리에 성공했으므로 정상 조회 결과 구성
    //     res.sendJson({ item: json });
    // });

    // /** 데이터 삭제 --> Delete(DELETE) */
    // router.delete("/department/:deptno", async (req, res, next) => {
    //     const deptno = req.get("deptno");

    //     if (deptno === undefined) {
    //         //400 Bad Request -> 잘못된 요청
    //         return next(new Error(400));
    //     }

    //     /** 데이터 삭제하기 */
    //     try {
    //         // 데이터베이스 접속
    //         dbcon = await mysql2.createConnection(config.database);
    //         await dbcon.connect();

    //         // 삭제하고자 하는 원 데이터를 참조하는 자식 데이터를 먼저 삭제해야 한다.
    //         // 만약 자식데이터를 유지해야 한다면 참조키 값을 null로 업데이트 해야 한다.
    //         // 단, 자식 데이터는 결과행 수가 0이더라도 무시한다.
    //         await dbcon.query("DELETE FROM student WHERE deptno=?", [deptno]);
    //         await dbcon.query("DELETE FROM professor WHERE deptno=?", [deptno]);

    //         // 데이터 삭제하기
    //         const sql = "DELETE FROM department WHERE deptno=?";
    //         const [result1] = await dbcon.query(sql, [deptno]);

    //         // 결과 행 수가 0이라면 예외처리
    //         if (result1.affectedRows < 1) {
    //             throw new Error("삭제된 데이터가 없습니다.");
    //         }
    //     } catch (err) {
    //         return next(err);
    //     } finally {
    //         dbcon.end();
    //     }

    //     // 모든 처리에 성공했으므로 정상 조회 결과 구성
    //     res.sendJson();
    // });
    return router;
};
