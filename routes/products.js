let express = require("express");
let router = express.Router();
let multer = require('multer');
const auth = require("../middleware/authenticator");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/img')
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname)
  }
})

const upload = multer({ storage :storage })
const { addLikeProduct } = require("../controllers/usersController")
 const {getWatchProducts} = require('../controllers/usersController')
const {
  searchProducts,
  getDealProducts,
  getProducts,
  getProduct,
  addProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

router.route("/").get(getProducts).post(auth, upload.array('img', 5), addProduct);
router.route("/deals").get(getDealProducts)
router.route("/watch").get(getWatchProducts)
router.route("/search").get(searchProducts)
router.route("/:id/like").put(addLikeProduct)
router.route("/:id").get(getProduct).delete(auth, deleteProduct).put(auth,updateProduct);
module.exports = router;
