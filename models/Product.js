var mongoose = require("mongoose");
var mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");
var User = require("./User");
var { Schema } = mongoose;

const notEmptyRan = [];
const notEmptyMsg = 'Please add at least one feature in the features array';


var notEmpty = function (columns) {
  if (columns.length === 0) { notEmptyRan.push(false); return false; }
  else { notEmptyRan.push(true); return true; }
};

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    oldPrice: {
      type: Number,
    },
    description: {
      type: String,
      required: true
    },
    owner: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    img: { type:[
      {
        original: {
          type: String,
          required: true,
      
        },
        thumb: {
          type: String,
        },
        color: Object,
      },
      
    ],
    validate: [notEmpty, notEmptyMsg]
    },
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

ProductSchema.virtual("likeCount", {
  ref: "User",
  localField: "_id",
  foreignField: "likes",
  count: true,
});


/*
ProductSchema.virtual("countLikes").get( async function () {
  const likes = await User.find({likes: this.id})
  console.log("count Like",likes, this.id)
  return likes.length
})
*/

ProductSchema.methods.loggedInUserLikes = async function (userId) {
  const user = await User.findOne({ _id: userId, likes: this.id });
  return user.length > 0;
};

ProductSchema.plugin(mongoose_fuzzy_searching, {
  fields: ["title", "category"],
});

module.exports = mongoose.model("Product", ProductSchema);
