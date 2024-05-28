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
  loadQuestion();
});

function loadQuestion() {

  fetch('fragen.json')

    .then(response => {

      if (!response.ok){
        throw new Error('Network Error');
      } 
        return response.json; //Antwort wird als json deklariert
      }) 

    .then(data => { 

      question = data['teil-allgemein']; // kopiert den Datensatz von teil-allgemein in questions

      shuffle(question);

      question = question.slice(0,questionPerRound); // nimmt die ersten 10 Fragen

      console.log("loading Questions");
      displayQuestion();

    })

    .catch(error => {
      console.error('Beim Laden ist ein Problem aufgetreten.',error);
    }); //wenn error dann abgefangen

}

function shuffle(array) {

  for (let i = array.length - 1; i > 0; i--) {
      
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

function displayQuestion() {

  const frageElement = document.getElementById['frageAllgWissen']; 

  const antwortConatiner = document.getElementbyId['antwortcontainer'];
  
  frageElement.innerHTML = 'frage';

  if(currentQuestionID < questionPerRound) {

    frageElement.innerHTML="frage";

    const currentQuestion = question.currentQuestionID.a; 
    const correctAnswer = currentQuestion.l[0];

    frageElement.innerHTML = currentQuestion.a;

    const shuffledAnswers = shuffle(currentQuestion.l.slice(0));

    const correctId = shuffledanswers.indexOf(currentQuestion.a);

    shuffledAnswers[correctId] = currentQuestion.a;

    antwortConatiner.innerHTML = '';

    shuffledAnswers.forEach((answer, i) => {

      const antwortButton = document.createElement('button');

      antwortButton.innerHTML = answer;

      antwortButton.addEventListener('click', () => handleAnswer(i, antwortButton.innerHTML === correctAnswer));
      
      antwortConatiner.appendChild(antwortButton);
      });

    // } else {
    //   showScore();
   }
  }
  

  function handleAnswer(i, isCorrect) {



  }

  function showScore() {

  }