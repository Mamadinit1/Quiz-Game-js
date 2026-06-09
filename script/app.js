const $ = document;
const cardWrapper = $.querySelector(".cardWrapper");
const btnNext = $.querySelector(".btnNext");
let totalScoreElem = $.querySelector("#totalScore");
let answeredCountElem = $.querySelector("#answeredCount");
let totalQuestionsElem = $.querySelector("#totalQuestions");
let progressFill = $.querySelector("#progressFill");
let progressPercent = $.querySelector("#progressPercent");

/* ============= For Toast ============= */
const toast = $.querySelector(".toast");
const toastTop = $.querySelector(".toastTop");
const toastMain = $.querySelector(".toastMain");
const tip = $.querySelector(".tip");
const progress = $.querySelector(".progress");
let toastTimer = null;
let progressAnimation = null;

const response = await fetch("./script/questions.json");
const qData = await response.json();
const questions = await qData.questions;
let currQuestionIndex = 0;
let answerContainer;
let showUserAnswer;
let userAnswer = "";
let totalQuestionsLength = questions.length;
totalQuestionsElem.innerHTML = totalQuestionsLength;
let correctAnswers = 0;
let totalScore = 0;

btnNext.addEventListener("click", () => {
  createQuestionCard(questions[currQuestionIndex + 1]);
});

createQuestionCard(questions[currQuestionIndex]);

function createQuestionCard(question) {
  if (!question) {
    return;
  }
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
  showUserAnswer = lastCard.querySelector("#displayAnswer");
  for (let i = 0; i < answerLength; i++) {
    answerContainer.insertAdjacentHTML(
      "beforeend",
      `<input id="answerInput" type="text" maxlength="1" />`,
    );
  }
  answerContainer.firstElementChild.focus();
  makeAnswerInput();
  updateProgressInfo();
}

function makeAnswerInput() {
  Array.from(answerContainer.children).forEach((item) => {
    item.addEventListener("keyup", (e) => {
      makeInputOTP(e);
    });
  });
}

function checkAnswer() {
  if (
    userAnswer.toLowerCase() ===
    questions[currQuestionIndex].answer.toLowerCase()
  ) {
    console.log("✅");
    correctAnswer();
    return true;
  } else {
    wrongAnswer();
    console.log("❌");

    return false;
  }
}

function makeInputOTP(e) {
  let { target, key } = e;
  if (target.value.length === 1 && target.value != " ") {
    makeUserAnswer();
    target.nextElementSibling
      ? target.nextElementSibling.focus()
      : (checkAnswer(), target.blur());
  } else if (key === "Backspace") {
    makeUserAnswer();
    if (target.previousElementSibling) {
      target.previousElementSibling.focus();
    }
  }
}

function makeUserAnswer() {
  userAnswer = "";
  for (let item of answerContainer.children) {
    userAnswer += item.value;
    showUserAnswer.innerHTML = userAnswer;
  }
}

function correctAnswer() {
  showToast("✅Correct", questions[currQuestionIndex].answer, true);
  correctAnswers++;
  totalScore += +questions[currQuestionIndex].point;
  currQuestionIndex++;
  updateProgressInfo();
  createQuestionCard(questions[currQuestionIndex]);
}

function wrongAnswer() {
  showToast("❌Incorrect", questions[currQuestionIndex].answer, false);
  currQuestionIndex++;
  updateProgressInfo();
  createQuestionCard(questions[currQuestionIndex]);
}

function updateProgressInfo() {
  answeredCountElem.innerHTML = correctAnswers;
  totalScoreElem.innerHTML = totalScore;
  let percent = ((currQuestionIndex + 1) / totalQuestionsLength) * 100;
  if (percent <= 100) {
    progressFill.style.width = `${percent}%`;
    progressPercent.innerHTML = `${Math.floor(percent)}%`;
  }
}

function showToast(topValue, answer, status) {
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }
  if (progressAnimation) {
    cancelAnimationFrame(progressAnimation);
    progressAnimation = null;
  }

  toast.classList.remove("hidden");
  toastTop.innerHTML = topValue;
  tip.innerHTML = answer;

  if (status === true) {
    progress.style.backgroundColor = "#22c55e";
  } else {
    progress.style.backgroundColor = "#ef4444";
  }

  progress.style.transition = "none";
  progress.style.width = "0%";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      progress.style.transition = "width 3s linear";
      progress.style.width = "100%";
    });
  });

  toastTimer = setTimeout(() => {
    hideToast();
  }, 3000);
}

function hideToast() {
  toast.classList.add("hidden");
  progress.style.transition = "none";
  progress.style.width = "0%";

  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }
  if (progressAnimation) {
    cancelAnimationFrame(progressAnimation);
    progressAnimation = null;
  }
}
