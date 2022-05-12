const path = require("path");

module.exports = {
    /** 로그 파일이 저장될 경로 및 출력 레벨 */
    log: {
        // 개발자가 필요에 의해 기록하는 정보들을 저장할 파일
        debug: {
            path: path.join(__dirname, "../_files/_logs"),
            level: "debug",
        },
        // 시스템에 심각한 문제가 발생했을 때의 정보를 저장할 파일
        error: {
            path: path.join(__dirname, "../_files/_logs"),
            level: "error",
        },
    },

    /** 웹 서버 포트번호 */
    server_port: 80,

    /** 쿠키 저장시 사용할 도메인 */
    // 1) localhost인 경우 공백으로 설정
    // 2) 도메인이 itpaper.co.kr인 경우 앞에 점을 붙여서 명시 --> ".itpaper.co.kr"
    cookie_domain: "",

    /** 보안키 (암호화 키) */
    secure: {
        cookie_encrypt_key: "1234567890",
        session_encrypt_key: "1234567890",
    },

    /** SMS 발송 정보 */
    sens: {
        accessKey: "WgAPV0UzHskuFAXIStZR",
        secretKey: "09OkIK4aCwSHygE2UWuhTfuynwH6Etl7NHjfNQp3",
        serviceId: "ncp:sms:kr:283677234942:daru",
        callNumber: "01063207939",
    },
    /** 메일 발송 정보 */
    sendmail_info: {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "ysw7939@gmail.com",
            pass: "awnejyqveqeusgjh",
        },
    },

    /** 업로드 경로 */
    upload: {
        path: "/upload",
        dir: path.join(__dirname, "../_files/upload"),
        max_size: 1024 * 1024 * 20,
        max_count: 10,
    },

    /** 썸네일 이미지 생성 경로 */
    thumbnail: {
        sizes: [640, 750, 1020],
        dir: path.join(__dirname, "../_files/thumb"),
    },

    /** 데이터베이스 연동 정보 */
    database: {
        host: "3.39.178.133", // MSQL 서버 주소 (다른 PC인 경우 IP주소)
        port: 3306, // MySQL 설치시 기본값 3306
        user: "root", // 접근 권한 이이디 (root=관리자)
        password: "root", // 설치시 입력한 비밀번호
        database: "daru_database", // 사용할 데이터베이스 이름
    },
};
