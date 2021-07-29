var express = require("express");
var createError = require("http-errors");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const { update } = require("../models/Product");
const User = require("../models/User");
const sharp = require('sharp');
const Vibrant = require('node-vibrant')

const aggregation = (id, ids) => [
{ $match : { _id : mongoose.Types.ObjectId(ids) } },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "likes",
      as: "likes"
    }
  },{
    $addFields: {
      "loggedInUserLiked": {
        $size: {
          $filter: {
            input: "$likes",
            as: "user",
            cond: {
              $eq: ["$$user._id", mongoose.Types.ObjectId(id)]
            }
          }
        }
      }
    }
  }
]

const aggregationDeal = (id) => [
  { $match: { $expr: { $gt: ["$oldPrice", "$price"] } } },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "likes",
      as: "likes"
    }
  },{
    $addFields: {
      "loggedInUserLiked": {
        $size: {
          $filter: {
            input: "$likes",
            as: "user",
            cond: {
              $eq: ["$$user._id", mongoose.Types.ObjectId(id)]
            }
          }
        }
      }
    }
  }
]

const aggregations = (id) => [
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "likes",
        as: "likes"
      }
    },{
      $addFields: {
        "loggedInUserLiked": {
          $size: {
            $filter: {
              input: "$likes",
              as: "user",
              cond: {
                $eq: ["$$user._id", mongoose.Types.ObjectId(id)]
              }
            }
          }
        }
      }
  },{$unset: "likes"}
]
  
const aggregationsSearch = (id, quriId) => [
  {$match: { title: { "$regex": quriId, "$options": "i" } }},
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "likes",
        as: "likes"
      }
    },{
      $addFields: {
        "loggedInUserLiked": {
          $size: {
            $filter: {
              input: "$likes",
              as: "user",
              cond: {
                $eq: ["$$user._id", mongoose.Types.ObjectId(id)]
              }
            }
          }
        }
      }
  },{$unset: "likes"}
]
  

/*
try {
  let img = []
  let thumb = []
  let dataBody = req.body 
 await Promise.all( req.files.map(async (el, i) => {
    const orginalPath = el.path
    const orginalName = el.originalname
    const resizeImg = `./public/thumb/${orginalName}`
    await sharp(orginalPath).resize(200).toFile(resizeImg)
    img.push(orginalPath.replace('./public/', ''))
    thumb.push(resizeImg.replace('./public/', ''))
 }))
  if (req.files) {
    dataBody.img = {
    } img
  }
  */

exports.getProducts = async (req, res, next) => {
  try {
 
    const products = await Product.aggregate(aggregations(req.user._id, req.query.query))
    await Product.populate(products, { select: "-tokens -password", path: "owner" })
    await Product.populate(products, {path:"likeCount"})

    res.status(200).send(products);
  } catch (e) {
    console.log(e)
    next(e);
  }
};

exports.searchProducts = async (req, res, next) => {
  try {

    /* Old way with Find() ********
    const newOptions = { title: { "$regex": req.query.query, "$options": "i" } }
    const products = await Product.find(req.query.query ? newOptions : {}).populate({ select: "-tokens -password", path: "owner" }).populate('likeCount')
    */
    const products = await Product.aggregate(aggregationsSearch(req.user._id, req.query.query))

    await Product.populate(products, { select: "-tokens -password", path: "owner" })
    await Product.populate(products, {path:"likeCount"})

    res.status(200).send(products);
  } catch (e) {
    console.log(e)
    next(e);
  }
};




exports.getProduct = async (req, res, next) => {

  try {
   const product = await Product.aggregate(aggregation(req.user._id, req.params.id))
    await Product.populate(product, { select: "-tokens -password", path: "owner" })
    await Product.populate(product, {path:"likeCount"})
    if (!product) throw new createError.NotFound();
    res.status(200).send(product[0]);
  } catch (e) {
    next(e);
  }
};

exports.addProduct = async (req, res, next) => {
  
  try {
    if (req.files) req.body.img = await Promise.all(req.files.map(async (el, i) => {
       
      const orginalPath = el.path
      const orginalName = el.originalname
      const resizeImg = `./public/thumb/${orginalName}`
      await sharp(orginalPath).resize(200).toFile(resizeImg)
      const colors = await Vibrant.from(orginalPath)
      .getPalette()
        .then((palette) => {
          return {
            Vibrant: palette.Vibrant.getHex(),
            DarkVibrant: palette.DarkVibrant.getHex(),
            LightVibrant: palette.LightVibrant.getHex(),
            Muted: palette.Muted.getHex(),
            DarkMuted: palette.DarkMuted.getHex(),
            LightMuted: palette.LightMuted.getHex()
        }
      })
      return {
        original: orginalPath.replace('public/', ''),
        thumb: resizeImg.replace('public/', ''),
        color: colors
      }
    }
    ))
    
    const product = new Product(req.body);
    await product.save();
    const newProduct = await product.populate('owner').execPopulate()
    res.status(200).send(newProduct);
    
  } catch (e) {
    next(e);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    
    const product = await Product.findByIdAndDelete(req.params.id).populate("owner");
    if (!product) throw new createHttpError.NotFound();
     // const newList = await Product.find()
      res.status(200).send(product);
    } catch (e) {
      next(e);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.aggregate(aggregation(req.user._id, req.params.id))
     await Product.populate(product, {path: "owner likeCount"})
     await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    if (!product) throw new createHttpError.NotFound();
  //  const newList = await Product.find()
      res.status(200).send(product[0]);
  } catch (e) {
    next(e);
  }
};

exports.getDealProducts = async (req, res, next) => {
  try {
    const product = await Product.aggregate(aggregationDeal(req.user._id))
    if (!product) throw new createHttpError.NotFound();
  //  const newList = await Product.find()
      res.status(200).send(product);
  } catch (e) {
    next(e);
  }
};

