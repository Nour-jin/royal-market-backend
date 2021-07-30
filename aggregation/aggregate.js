const mongoose = require("mongoose");


exports.aggregation = (id, ids) => [
  { $match: { _id: mongoose.Types.ObjectId(ids) } },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "likes",
      as: "likes",
    },
  },
  {
    $addFields: {
      loggedInUserLiked: {
        $size: {
          $filter: {
            input: "$likes",
            as: "user",
            cond: {
              $eq: ["$$user._id", mongoose.Types.ObjectId(id)],
            },
          },
        },
      },
    },
  },
];

exports.aggregationDeal = (id) => [
  { $match: { $expr: { $gt: ["$oldPrice", "$price"] } } },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "likes",
      as: "likes",
    },
  },
  {
    $addFields: {
      loggedInUserLiked: {
        $size: {
          $filter: {
            input: "$likes",
            as: "user",
            cond: {
              $eq: ["$$user._id", mongoose.Types.ObjectId(id)],
            },
          },
        },
      },
    },
  },
];

exports.aggregations = (id) => [
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "likes",
      as: "likes",
    },
  },
  {
    $addFields: {
      loggedInUserLiked: {
        $size: {
          $filter: {
            input: "$likes",
            as: "user",
            cond: {
              $eq: ["$$user._id", mongoose.Types.ObjectId(id)],
            },
          },
        },
      },
    },
  },
  { $unset: "likes" },
];

exports.aggregationsSearch = (id, quriId) => [
  { $match: { title: { $regex: quriId, $options: "i" } } },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "likes",
      as: "likes",
    },
  },
  {
    $addFields: {
      loggedInUserLiked: {
        $size: {
          $filter: {
            input: "$likes",
            as: "user",
            cond: {
              $eq: ["$$user._id", mongoose.Types.ObjectId(id)],
            },
          },
        },
      },
    },
  },
  { $unset: "likes" },
];
