const path = require("path");

module.exports = {
    /** 로그 파일이 저장될 경로 및 출력 레벨 */
    log: {
        debug: {
            path: path.join(__dirname, "../_files/_logs"),
            level: "debug",
        },

        error: {
            path: path.join(__dirname, "../_files/_logs"),
            level: "error",
        },
    },

    /** 웹 서버 포트번호 */
    server_port: 80,

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

    // jwt 인증 번호
    jwt: {
        secret: "SeCrEtKeYfOrHaShInG",
    },

    // 카카오톡 REST API 키
    kakao: {
        kakao_id: "5a73e366fa63d6ac8f9903669559d43c",
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
