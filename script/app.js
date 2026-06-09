const $ = document;
const cardWrapper = $.querySelector(".cardWrapper");

const response = await fetch("./script/questions.json");
const qData = await response.json();
const questions = await qData.questions;
let currQuestionIndex = 0;
let answerContainer;
let userAnswer = "";

createQuestionCard(questions[currQuestionIndex]);

function createQuestionCard(question) {
  userAnswer = "";
  currQuestionIndex = question.id - 1;
  cardWrapper.innerHTML = "";
  cardWrapper.insertAdjacentHTML(
    "beforeend",
    `
    <div class="card">
      <h1 class="question" id="questionText">
        ${question.question}
      </h1>
      <div class="answer" id="answerContainer">
      </div>
      <div class="info-row">
        <div class="category" id="categoryText">${question.category}</div>
        <div class="score-box">Score: <span id="scoreValue">${+question.point}</span></div>
      </div>
      <div class="your-answer">
        <p>📝 Your answer:</p>
        <p id="displayAnswer">_____</p>
      </div>
    </div>
        `,
  );
  let lastCard = cardWrapper.lastElementChild;
  answerContainer = lastCard.querySelector("#answerContainer");
  let answerLength = question.answer.length;
  for (let i = 0; i < answerLength; i++) {
    answerContainer.insertAdjacentHTML(
      "beforeend",
      `<input id="answerInput" type="text" maxlength="1" />`,
    );
  }
  makeAnswerInput();
}

function makeAnswerInput() {
  Array.from(answerContainer.children).forEach((item) => {
    item.addEventListener("keyup", (e) => {
      makeInputOTP(e);
    });
  });
}

function checkAnswer() {
  console.log("checking...");
  for (let item of answerContainer.children) {
    userAnswer += item.value;
  }
  console.log(
    `check useranswer ${userAnswer} and real answer ${questions[currQuestionIndex].answer}`,
  );

  if (
    userAnswer.toLowerCase() ===
    questions[currQuestionIndex].answer.toLowerCase()
  ) {
    console.log("✅");

    return true;
  } else {
    console.log("❌");

    return false;
  }
}

function makeInputOTP(e) {
  let { target, key } = e;
  if (target.value.length === 1 && target.value != " ") {
    target.nextElementSibling
      ? target.nextElementSibling.focus()
      : (checkAnswer(), target.blur());
  } else if (key === "Backspace") {
    if (target.previousElementSibling) {
      target.previousElementSibling.focus();
    }
  }
}
