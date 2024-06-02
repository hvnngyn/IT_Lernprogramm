let currentQuestionID = 0;
let questions = [];
let correctAnswerCount = 0;
const questionsPerRound = 10;
const answerDelay = 1000;
const {Renderer, Stave} = Vex.Flow;


document.addEventListener('DOMContentLoaded', () => {
  console.log("Alles ist geladen");

  loadQuestions();

  document.getElementById('restartButton').addEventListener('click', () => {
    restart(datapart);
  });

});

function restart(){
  currentQuestionID = 0;
  correctAnswerCount = 0;
  loadQuestions('teil-noten');
}

function loadQuestions() {
  fetch("fragen.json")
  .then(response => {
    if (!response.ok) {
      throw new Error('Netzwerkfehler');
    }
    return response.json();
  })
  .then(data => {
    questions = data['teil-noten'].slice(0);
    shuffleArray(questions);
    questions = questions.slice(0, questionsPerRound);
    displayQuestion();
  })
  .catch(error => {
    console.error('Beim Laden ist ein Problem aufgetreten.', error);
  });
}

function displayQuestion() {
  const div= document.getElementById('notation');
  const frageElement = document.getElementById('frageAllgWissen');
  const antwortContainer = document.getElementById('antwortContainer');
  div.innerHTML = '';
  frageElement.innerHTML = '';

  if (currentQuestionID < questionsPerRound) {
    const currentQuestion = questions[currentQuestionID];
    const correctAnswer = currentQuestion.l[0];
    const note = currentQuestion.a;
    console.log(note);

    const renderer = new Vex.Flow.Renderer(notation, Vex.Flow.Renderer.Backends.SVG);
    renderer.resize(500, 200); // Anpassen der Größe
    const context = renderer.getContext();

    const stave = new Vex.Flow.Stave(10, 40, 475);
    stave.addClef('treble').addTimeSignature('4/4').setContext(context).draw();

    const staveNote = new Vex.Flow.StaveNote({
      clef: 'treble',
      keys: [note],
      duration: 'q'
    });

    Vex.Flow.Formatter.FormatAndDraw(context, stave, [staveNote]);

    const shuffledAnswers = shuffleArray(currentQuestion.l.slice(0));
    frageElement.innerHTML= 'Welche Note ist das?'
    antwortContainer.innerHTML = '';
    shuffledAnswers.forEach((answer, i) => {
      const antwortButton = document.createElement('button');
      antwortButton.classList.add('button');
      antwortButton.innerHTML = answer;
      antwortButton.addEventListener('click', () => handleAnswer(i, answer === correctAnswer));
      antwortContainer.appendChild(antwortButton);
    });

    styleButtons();
    updateProgress();


  } else {
    showScore();
    updateProgress();
  }
}

function styleButtons() {
  const buttons = document.querySelectorAll('.button');
  buttons.forEach(button => {
    button.style.backgroundColor = '#A7C1E1';
    button.style.color = 'white';
    button.style.padding = '10px 20px'; 
    button.style.fontSize = '18px';
    button.style.margin = '5px';
  });
}

function showScore() {
  const frageElement = document.getElementById('frageAllgWissen');
  const antwortContainer = document.getElementById('antwortContainer');

  frageElement.innerHTML = ` SUPER! Dein Score: ${correctAnswerCount} von ${questionsPerRound} Fragen richtig beantwortet!`;
  antwortContainer.innerHTML = '';
}


async function handleAnswer(selectedAnswer, isCorrect) {
  markAnswer(selectedAnswer, isCorrect);
  await sleep(answerDelay);


  if (isCorrect) {
    console.log('Richtig');
    correctAnswerCount++;
  } else {
    console.log('Falsch');
  }

  currentQuestionID++;
  displayQuestion();
}

function markAnswer(selectedIndex, isCorrect) {
  const answerButtons = document.querySelectorAll('button');
  answerButtons[selectedIndex].style.backgroundColor = isCorrect ? '#008770' : '#EFA9AE';
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

function updateProgress() {
  
  const progressPercentage = (currentQuestionID / questionsPerRound) * 100; // Fortschritt in Prozent berechnen
  // Fortschrittsleisten-Element abrufen
  const progressbar = document.getElementById('progressbar');

  // Fortschrittsleiste aktualisieren
  progressbar.style.width = `${progressPercentage}%`;
}

