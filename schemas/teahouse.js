// routes/posts.js

/**
 * @swagger
 * tags:
 *   name: Teahouse
 *   description: 매장데이터 처리
 * definitions:
 *   Post:
 *     type: "object"
 *     properties:
 *       place_name:
 *         type: "string"
 *       phone:
 *         type: "string"
 *       address:
 *         type: "string"
 *       manager_phone:
 *         type: "string"
 *       instagram:
 *         type: "string"
 *       homepage:
 *         type: "string"
 *   Put:
 *     type: "object"
 *     properties:
 *       place_name:
 *         type: "string"
 *       phone:
 *         type: "string"
 *       address:
 *         type: "string"
 *       manager_phone:
 *         type: "string"
 *       instagram:
 *         type: "string"
 *       homepage:
 *         type: "string"
 */
// 위와 같이 각 라우트 파일마다 최상단에 태그를 만들어주었습니다.
// definitions에는 Post라는 이름의 object를 만들어주었습니다.
// properties에는 Post object의 각 속성과 타입을 지정해주었습니다.
// images같은 경우 배열 타입인데, 각 요소에 대한 타입은 items:를 통하여 지정해줄 수 있었습니다.

// 아래와 같이 각 route마다 yaml 문서를 작성해주었습니다.
// /posts route에 get요청을 하는 예시 코드입니다. (게시글 전체 조회)
// tags에는 태그명을 넣어주었습니다.
// parameters에는 해당 route의 parameter들을 넣어줍니다.
// in: "query"는 쿼리스트링에 포함된 파라미터를 의미합니다. ex) /posts?category=카테고리1
// 이 외에도 in: "path"는 쿼리 파라미터를 의미하고, in: "body"는 req.body를 의미합니다.
// 자세한 사항은 swagger 관련 문서를 찾아보시면 될 것 같습니다.
// responses: 에는 응답에 관한 사항을 기록해줍니다.
/**
 * @swagger
 * /teahouse:
 *   get:
 *     description: 매장데이터 조회
 *     tags: [Teahouse]
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - name: "page"
 *       in: "query"
 *       description: "조회할 데이터의 패이지 번호,  ex) ?page=1"
 *       type: "number"
 *     - name: "rows"
 *       in: "query"
 *       description: "한 페이지에 보여줄 목록 수, ex) ?rows=10"
 *       type: "number"
 *     responses:
 *       "200":
 *         description: "successful operation"
 *
 */
router.get("/", function (req, res) {
    // /teahouse?page=1&rows=10
});
/**
 * @swagger
 * /teahouse/all:
 *   get:
 *     description: 매장데이터 전체 조회
 *     tags: [Teahouse]
 *     responses:
 *       "200":
 *         description: "successful operation"
 *
 */
router.get("/", function (req, res) {
    // /teahouse/all
});

// 다음은 게시물 생성에 관한 yaml 작성 파일입니다.
// parameters로 위의 definitions에 정의 했던 Post를 주었습니다.
// schema: 속성으로 "$ref: #/definitions/Post" 정의해주면 됩니다.
/**
 * @swagger
 * /teahouse:
 *   post:
 *     description: 매장 생성 하기
 *     tags: [Teahouse]
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - name: "body"
 *       in: "body"
 *       required: true
 *       schema:
 *         $ref: "#/definitions/Post"
 *     responses:
 *       "200":
 *         description: "successful operation"
 *
 */
router.post("/", function (req, res) {
    // 매장데이터 생성
});

/**
 * @swagger
 * /teahouse/{tehouse_id} :
 *   put:
 *     description: 매장데이터 수정
 *     tags: [Teahouse]
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - name: "tehouse_id"
 *       in: "path"
 *       description: "ID of tehouse to update"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     - name: "body"
 *       in: "body"
 *       required: true
 *       schema:
 *         $ref: "#/definitions/Post"
 *     responses:
 *       "200":
 *         description: "successful operation"
 */
router.post("/", function (req, res) {
    // 매장 데이터 수정
});

/**
 * @swagger
 * /teahouse/{teahouse_id}:
 *   get:
 *     description: 매장데이터 상세 조회
 *     tags: [Teahouse]
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - name: "teahouse_id"
 *       in: "path"
 *       description: "ID of tehouse to update"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     responses:
 *       "200":
 *         description: "successful operation"
 *
 */
router.get("/", function (req, res) {
    // 매장데이터 상세조회
});

/**
 * @swagger
 * /teahouse/{teahouse_id}:
 *   delete:
 *     description: 매장데이터 상세 조회
 *     tags: [Teahouse]
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - name: "teahouse_id"
 *       in: "path"
 *       description: "ID of tehouse to update"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     responses:
 *       "200":
 *         description: "successful operation"
 *
 */
router.delete("/", function (req, res) {
    // 매장데이터 삭제
});
