var mongoose = require("mongoose");
var mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");
var User = require("./User");
var { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    title: {
      type: String,
    },
    category: {
      type: String,
    },
    price: {
      type: Number,
    },
    oldPrice: {
      type: Number,
    },
    description: {
      type: String,
    },
    owner: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    img: [
      {
        original: {
          type: String,
        },
        thumb: {
          type: String,
        },
        color: Object,
      },
    ],
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
