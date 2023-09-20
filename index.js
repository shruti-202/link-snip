require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json());

/*DATABASE CONNECTION*/

mongoose.connect(process.env.DATABASE_URL);
mongoose.connection.once("connected", () =>
  console.log("🟢 DATABASE CONNECTED")
);
mongoose.connection.on("error", (err) => console.log("error", err));

/*MODEL*/

const LinkSchema = new mongoose.Schema(
  {
    shortStr: {
      type: String,
      require: [true, "Short string is required"],
      unique: true,
      trim: true,
      minlength: [3, "Short String must be 3 Character Long"],
    },
    longUrl: {
      type: String,
      trim: true,
      required: [true, "Long URL is required"],
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
LinkSchema.methods.incrementClicks = function () {
  this.clicks++;
  return this.save();
};
const LinkModel = mongoose.model("link", LinkSchema);

/*ROUTES*/

app.get("/health", (req, res) => res.send("I am healthy"));

app.post("/link", async (req, res) => {
  let shortStr = req?.body?.shortStr;
  const longUrl = req?.body?.longUrl;

  if (!longUrl) {
    res.status(400).end("LongUrl is Empty");
    return;
  }
  const urlRegex =
    /^(https:\/\/|http:\/\/)([a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})+)(\/[^\s]*)?$/;
  if (!urlRegex.test(longUrl)) {
    res.status(400).end("Invalid Long Url");
    return;
  }
  if (!shortStr) {
    res.status(400).end("ShortString is Empty");
    return;
  }
  const existingDoc = await LinkModel.find({ shortStr: shortStr });
  if (existingDoc?.length != 0) {
    res.status(400).end("ShortString already exists");
    return;
  }
  LinkModel.create({
    shortStr: shortStr,
    longUrl: longUrl,
  });
  res.status(201).json({ shortStr: shortStr });
});

app.get("/:shortStr", async (req, res) => {
  const shortStr = req.params.shortStr;

  const shortStrDoc = await LinkModel.find({ shortStr: shortStr });

  if (shortStrDoc.length === 0) {
    res.status(404).sendFile(path.join(__dirname, "view", "index.html"));
    return;
  }

  res.redirect(307, shortStrDoc[0].longUrl);
});

/*APP LISTEN*/

app.listen(process.env.APP_PORT, () =>
  console.log(`Server started at Port ${process.env.APP_PORT}🟢`)
);
