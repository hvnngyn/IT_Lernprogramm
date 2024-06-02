"use strict";
// Erzwingt strengere JavaScript-Regeln für den gesamten Code.

let currentQuestionID = 0;
let questions = [];
let correctAnswerCount = 0;
const questionsPerRound = 10;
const answerDelay = 1000;

const username = "s86039@htw-dresden.de";
const password = "n!5ZLX+t2m";
const headers = new Headers();
// Erstellt ein neues Headers-Objekt.
headers.append("Authorization", "Basic " + btoa(username + ":" + password));
// Fügt die Autorisierungs-Header mit Basic Authentifizierung hinzu.


document.addEventListener("DOMContentLoaded", () => {
    fetchQuiz();
    document.getElementById('restartButton').addEventListener('click', () => {
        restart();
      });
});


async function fetchQuiz() {

    const baseUrl = "https://idefix.informatik.htw-dresden.de:8888/api/quizzes/";
    const randomIndex = Math.floor(Math.random() * 31) + 2;
    const url = baseUrl + randomIndex;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: headers,
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const correctAnswer = data.options[0];

        data.options = shuffleArray(data.options);
        
        const correctIndex = data.options.findIndex(option => option === correctAnswer);
        data.correctIndex = correctIndex;

        questions.push(data);

        displayNextQuestion();

    } catch (error) {
        console.error("Error fetching quiz:", error);
    }
}

function displayNextQuestion() {

    const question = questions[currentQuestionID];
    const cardContainer = document.getElementById("FrageContainer");
    const frageElement = document.getElementById('frageAllgWissen');

    const card = document.createElement("div");
    card.classList.add("mdl-cell", "mdl-cell--12-col");

    frageElement.textContent = question.text;

    const cardBody = document.createElement("div");
    cardBody.classList.add("mdl-card__supporting-text");

    const shuffledOptions = shuffleArray([...question.options]);
    clearButtons();

    shuffledOptions.forEach((answer, index) => {
        
        const button = document.createElement("button");
        button.classList.add("button4", 'mdl');

        console.log(question.correctIndex);

        if (index === question.correctIndex) {
            button.dataset.correct = "true";
        }
        button.textContent = answer;
        button.addEventListener("click", () => checkAnswer(button));
        cardBody.appendChild(button);
    });
    updateProgress();
    styleButtons();
    card.appendChild(cardBody);
    cardContainer.appendChild(card);
    
}


function clearButtons() {

    document.querySelectorAll('.button4').forEach(element => {
        element.remove();
    });
    
}

async function checkAnswer(selectedButton) {
    const isCorrect = selectedButton.dataset.correct === "true";

    updateProgress();
    if (isCorrect) {
        correctAnswerCount++;
        console.log("Richtig");
        
    } else {
        console.log("Falsch");
    }

    markAnswer(selectedButton, isCorrect);
    await sleep(answerDelay);
    updateProgress();

    if (currentQuestionID < questionsPerRound - 1) {
        currentQuestionID++;
        updateProgress();
    } else {
        updateProgress();
        showScore();
        return;
    }

    fetchQuiz();
    updateProgress();
}

function markAnswer(selectedButton, isCorrect) {
// Definiert die Funktion zur Markierung der Antwort.
    selectedButton.style.backgroundColor = isCorrect ? '#008770' : '#EFA9AE';
    updateProgress();
}

function updateProgress() {
  
    const progressPercentage = (currentQuestionID / questionsPerRound) * 100; 
    const progressbar = document.getElementById('progressbar');
    progressbar.style.width = `${progressPercentage}%`;
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
function restart() {
    currentQuestionID = 0;
    correctAnswerCount = 0;
    fetchQuiz();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showScore() {
    const frageElement = document.getElementById('frageAllgWissen');
    const antwortContainer = document.getElementById('antwortContainer');
    updateProgress();
    frageElement.innerHTML = ` SUPER! Dein Score: ${correctAnswerCount} von ${questionsPerRound} Fragen richtig beantwortet!`;
    antwortContainer.innerHTML = '';
  }