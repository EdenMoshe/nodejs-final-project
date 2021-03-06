const { Card } = require("../cardModel");
const lodash = require("lodash");

async function generateBizNum() {
  while (true) {
    const randomNum = lodash.random(1000000, 9999999);
    const card = await Card.findOne({ bizNumber: randomNum });
    if (!card) return String(randomNum);
  }
}

exports.generateBizNum = generateBizNum;
