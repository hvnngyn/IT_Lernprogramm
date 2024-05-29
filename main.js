// Frage laden, Antowrten laden, Starten funktion,
// Neustart, Warten funktion, progress bar,
// statistik auswerten,richtig falsch

let currentQuestionID = 0;
let question = [];
let correctAnswer = 0;
const questionPerRound = 10;
const answerDelay = 1000;

document.addEventListener('DOMContentLoaded', () => {
  console.log("Everything is loaded");

  const mainElement = document.querySelector('main');
  const datapart = mainElement.getAttribute('data-part');
  loadQuestion(datapart);
  renderMathInElement(document.body, {
    // customised options
    // • auto-render specific keys, e.g.:
    delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
    ],
    // • rendering keys, e.g.:
    throwOnError : false
  });
  
});

function loadQuestion(datapart) {
  fetch("fragen.json")
  .then(response => {
    if (!response.ok) {
      throw new Error('Network Error');
    }
    return response.json();
  })

    .then(data => {
      question = data[datapart].slice(0); // Kopiert den Datensatz von teil-allgemein in questions
      shufflequestions(question);
      question = question.slice(0, questionPerRound); // Nimmt die ersten 10 Fragen
     // console.log("loading Questions");
      displayQuestion();
    })
    .catch(error => {
      console.error('Beim Laden ist ein Problem aufgetreten.', error);
    });
}


function shufflequestions(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function displayQuestion() {
  const frageElement = document.getElementById('frageAllgWissen');
  const antwortContainer = document.getElementById('antwortContainer'); // Typo korrigiert

  if (currentQuestionID < questionPerRound) {
    const currentQuestion = question[currentQuestionID]; // Zugriff auf das aktuelle Array-Element
    const correctAnswer = currentQuestion.l[0]; // Richtige Antwort

    frageElement.innerHTML = currentQuestion.a;

    const shuffledAnswers = shuffleArray(currentQuestion.l.slice(0)); // Antworten mischen

    const correctId = shuffledAnswers.indexOf(currentQuestion.a);
    shuffledAnswers[correctId] = currentQuestion.a;

    antwortContainer.innerHTML = '';
    shuffledAnswers.forEach((answer, i) => {
      const antwortButton = document.createElement('button');
      antwortButton.classList.add('button');
      antwortButton.innerHTML = answer;
      antwortButton.addEventListener('click', () => handleAnswer(i, antwortButton.innerHTML === correctAnswer));
      antwortContainer.appendChild(antwortButton);
    });
    renderMathInElement(frageElement, {
      // customised options
      // • auto-render specific keys, e.g.:
      delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false},
          {left: '\\(', right: '\\)', display: false},
          {left: '\\[', right: '\\]', display: true}
      ],
      // • rendering keys, e.g.:
      throwOnError : false
    });
    renderMathInElement(antwortContainer, {
      // customised options
      // • auto-render specific keys, e.g.:
      delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false},
          {left: '\\(', right: '\\)', display: false},
          {left: '\\[', right: '\\]', display: true}
      ],
      // • rendering keys, e.g.:
      throwOnError : false
    });
  } else {
    showScore();
    
  }
}

function showScore() {
  // Score-Anzeige
  const frageElement = document.getElementById('frageAllgWissen');
  const antwortContainer = document.getElementById('antwortcontainer');

  frageElement.innerHTML = `Dein Score: ${correctAnswer} von ${questionPerRound}`;
  antwortContainer.innerHTML = ''; // Antworten löschen

}

async function handleAnswer(selectedAnswer, isCorrect) {
  const currentQuestion = question[currentQuestionID];

  markAnswer(selectedAnswer, isCorrect);
  await sleep(answerDelay);

  if (isCorrect) {
    console.log('Richtig');
    correctAnswer++;
  } else {
    console.log('Falsch');
  }

  currentQuestionID++;
  displayQuestion();
}

function markAnswer(selectedIndex, isCorrect) {
  const answerButtons = document.querySelectorAll('button');
  answerButtons[selectedIndex].style.backgroundColor = isCorrect ? 'green' : 'red';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

