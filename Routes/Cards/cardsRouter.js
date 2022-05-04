const { Card } = require("./cardModel");
const express = require("express");
const auth = require("../../middlewares/authorization");
const router = express.Router();
const chalk = require("chalk");
const { generateBizNum } = require("./services/generateBizNum");
const { validateCard } = require("./cardValidation");

/********** סעיף 7 **********/
router.get("/allCards", auth, async (req, res) => {
  try {
    const cards = await Card.find();
    return res.send(cards);
  } catch (error) {
    console.log(chalk.redBright(error.message));
    return res.status(500).send(error.message);
  }
});

/********** סעיף 8 **********/
// router.get("/card/:id", async (req, res) => {
//   // לפרויקט הגדול עם ריאקט
//   // router.get("/card/:id", auth, async (req, res) => {
//   // בשביל ההגשה בלבד

//   // const user = req.user;
//   const cardID = req.params.id;
//   const card = await Card.findOne({ _id: cardID });
//   // const card = await Card.findOne({ _id: cardID, userID: user._id });
//   // const _id = req.params.id;
//   // const card = await Card.findOne({ _id });

//   return res.send(card);
// });

router.get("/card/:id", async (req, res) => {
  // לפרויקט הגדול עם ריאקט
  // router.get("/card/:id", auth, async (req, res) => {
  // בשביל ההגשה בלבד
  try {
    // const user = req.user;
    const cardID = req.params.id;
    const card = await Card.findOne({ _id: cardID });
    // const card = await Card.findOne({ _id: cardID, userID: user._id });
    // const _id = req.params.id;
    // const card = await Card.findOne({ _id });
    return res.send(card);
  } catch (error) {
    console.log(chalk.redBright(error.message));
    return res.status(500).send(error.message);
  }
});

/********** סעיף 9 **********/
router.get("/my-cards", auth, (req, res) => {
  let user = req.user;
  if (!user.biz) return res.status(403).json("Un authorize user!");

  Card.find({ userID: user._id })
    .then((cards) => res.json(cards))
    .catch((error) => res.status(500).send(error.message));
});

/********** סעיף 10 **********/
router.post("/", auth, async (req, res) => {
  try {
    const user = req.user;
    if (!user.biz) {
      console.log(
        chalk.redBright("A non biz user attempted to create a card!")
      );
      return res.status(403).json("Un authorize user!");
    }

    let card = req.body;
    const { error } = validateCard(card);
    if (error) {
      console.log(chalk.redBright(error.details[0].message));
      return res.status(400).send(error.details[0].message);
    }

    const bizNumber = await generateBizNum();

    card = {
      name: card.name,
      description: card.description,
      address: card.address,
      phone: card.phone,
      image: card.image
        ? card.image
        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      userID: user._id,
      bizNumber,
    };

    card = new Card(card);
    await card.save();
    return res.send(card);
  } catch (error) {
    console.log(chalk.redBright(error.message));
    return res.status(500).send(error.message);
  }
});

router.put("/:cardid", auth, async (req, res) => {
  const updatedObject = req.body;
  const userId = req.user._id;
  const cardId = req.params.cardid;

  const cardFilter = {
    _id: cardId,
  };

  const user = req.user;
  if (!user.biz) {
    console.log(chalk.redBright("A non biz user attempted to create a card!"));
    return res.status(403).json("Un authorize user!");
  }

  Card.updateOne(cardFilter, updatedObject)
    .then((y) => res.json(y))
    .catch((y) => res.status(400).json(y));
});

router.delete("/:id", auth, async (req, res) => {
  try {
    let user = req.user;
    if (!user.biz) {
      console.log(
        chalk.redBright("A non-business user attempted to create a card!")
      );
      return res.status(403).json("You are not authorize to edit card!");
    }
    const cardID = req.params.id;
    let card = await Card.findById(cardID);

    // console.log({ user, card });
    if (user.admin || card.userID.toString() === user._id) {
      card = await Card.findOneAndRemove({ _id: cardID });
      return res.send(card);
    }
    console.log(chalk.redBright("Un authorized user!"));
    return res.status(403).send("You are noe authorize to delete cards");
  } catch (error) {
    console.log(chalk.redBright("Could not delete card:", error.message));
    return res.status(500).send(error.message);
  }
});
/********** סעיף 11 **********/

/********** סעיף 12 **********/

/********** סעיף 13 **********/

module.exports = router;
