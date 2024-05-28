let router = require("express").Router();

router.use("/user", require("./user"));
router.use("/upload", require("./upload"));
router.use("/patient", require("./patient"));
router.use("/intake", require("./intake"));
router.use("/transcription", require("./transcription"));
router.use("/gpt-service", require("./gpt-service"));
router.use("/consultation", require("./consultation"));
router.use("/drugSearch", require("./drugSearch"));

module.exports = router;
