router.post("/login", function (req, res, next) {
    console.log("REST API Post Method - Member Login And JWT Sign");
    const memberId = req.body.id;
    const memberPassword = req.body.password;
    var memberItem = memberList.find((object) => object.id == memberId);
    if (memberItem != null) {
        if (memberItem.password == memberPassword) {
            const secret = "005c9780fe7c11eb89b4e39719de58a5";
            jwt.sign(
                {
                    memberId: memberItem.id,
                    memberName: memberItem.name,
                },
                secret,
                {
                    expiresIn: "1d",
                },
                (err, token) => {
                    if (err) {
                        console.log(err);
                        res.status(401).json({
                            success: false,
                            errormessage: "token sign fail",
                        });
                    } else {
                        res.json({ success: true, accessToken: token });
                    }
                }
            );
        } else {
            res.status(401).json({
                success: false,
                errormessage: "id and password are not identical",
            });
        }
    } else {
        res.status(401).json({
            success: false,
            errormessage: "id and password are not identical",
        });
    }
});
