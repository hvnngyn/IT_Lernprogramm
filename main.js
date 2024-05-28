// Frage laden, Antowrten laden, Starten funktion,
// Neustart, Warten funktion, progress bar,
// statistik auswerten,richtig falsch

let currentQuestionID = 0;

let question = [];

let correctAnswer = 0;

const questionPerRound = 10;

const answerDelay = 1000;

document.addEventListener('DOMContentLoaded', () => {

  loadQuestion();
});

function loadQuestion() {

  fetch('fragen.json')

    .then(response=>response.json()) //Antwort wird als json deklariert

    .then(data => { 

      question = data['teil-allgemein'].slice(0); // kopiert den Datensatz von teil-allgemein in questions

      shuffle(question);

      question = question.slice(0,questionPerRound); // nimmt die ersten 10 Fragen

      displayQuestion();

    })

    .catch(error => {
    console.error('Beim Laden ist ein Problem aufgetreten.',error);
    }); //wenn error dann abgefangen

}

function shuffle(array) {

  for(let i = array.length - 1; i > 0; i--) {  // Geht das Array von hinten durch
    const j = Math.floor(Math.random() * (i + 1)); // wählt zufälligen Index
    [array[i], array[j]] = [array[j], array[i]]; // tauscht den Werte von i mit j
  }
}

function displayQuestion() {

  const frageElement = document.getElementById['frageAllgWissen']; 

  const antwortConatiner = document.getElementbyId['antwortcontainer'];

  if(currentQuestionID < questionPerRound) {s

    const currentQuestion = question[currentQuestionID]['a']; 
    const correctAnswer = currentQuestion['l'][0];

    frageElement.innerHTML = currentQuestion;

    const shuffledAnswers = shuffle(currentQuestion['l'].slice(0));

    const correctId = shuffledanswers.indexOf(correctAnswer);

    shuffledAnswers[correctId] = currentQuestion['a'];

    antwortConatiner.innerHTML = '';

    shuffledAnswers.forEach((answer, i) => {

      const antwortButton = document.createElement('button');

      antwortButton.textContent = answer;

      antwortButton.addEventListener('click', () => handleAnswer(i, antwortButton.textContent === correctAnswer));
      
      antwortConatiner.appendChild(antwortButton);
      });

    } else {
      showScore();
    }
  }
  

  function handleAnswer(i, isCorrect) {

  }

  function showScore() {

  }