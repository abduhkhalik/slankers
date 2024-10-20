const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // no_kk: {
    //   type: String,
    //   required: true,
    // },
    no_ktp: {
      type: String,
      required: true,
    },
    no_rt: {
      type: String,
      required: true,
    },
    no_rw: {
      type: String,
      required: true,
    },
    no_tps: {
      type: String,
      required: true,
    },
    no_hp: {
      type: String,
      required: true,
    },
    kelurahan: {
      type: String,
      required: false,
    },
    kecamatan: {
      type: String,
      required: true,
    },
    kabupaten: {
      type: String,
      required: true,
    },
    simpul: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const post = mongoose.model("Post", PostSchema);

module.exports = post;
