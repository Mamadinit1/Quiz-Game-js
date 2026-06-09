const $ = document;

const response = await fetch("./script/questions.json");
const qData = await response.json();
const questions = await qData.questions;
console.log(questions);
