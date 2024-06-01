"use strict";
// Erzwingt strengere JavaScript-Regeln für den gesamten Code.

const questionsPerRound = 10;
// Definiert die maximale Anzahl von Fragen pro Quizrunde.

let correctAnswers = 0;
// Initialisiert den Punktestand mit 0.

let currentQuestionIndex = 0;
// Initialisiert den Index der aktuellen Frage mit 0.

const progressElement = document.querySelector(".progress2");
// Holt das HTML-Element für die Fortschrittsleiste.

const restartButton = document.getElementById("restartButton");
// Holt das HTML-Element für den Neustart-Button.

const answerDelay = 1000;
// Setzt die Pause nach einer Antwort auf 1000 Millisekunden (1 Sekunde).

const username = "s86039@htw-dresden.de";
// Definiert den Benutzernamen für die Authentifizierung.

const password = "n15zlx+t2m";
// Definiert das Passwort für die Authentifizierung.

const headers = new Headers();
// Erstellt ein neues Headers-Objekt.

headers.append("Authorization", "Basic " + btoa(username + ":" + password));
// Fügt die Autorisierungs-Header mit Basic Authentifizierung hinzu.

const questions = [];
// Erstellt ein leeres Array für die Fragen.

async function fetchQuiz() {
// Definiert eine asynchrone Funktion zum Abrufen des Quiz.
    const baseUrl = "https://idefix.informatik.htw-dresden.de:8888/api/quizzes/";
    // Basis-URL für die API.

    const randomIndex = Math.floor(Math.random() * 31) + 2;
    // Wählt einen zufälligen Index zwischen 2 und 32.

    const url = baseUrl + randomIndex;
    // Kombiniert die Basis-URL mit dem zufälligen Index.

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: headers,
        });
        // Führt eine GET-Anfrage an die API durch.

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        // Überprüft, ob die Antwort erfolgreich war.

        const data = await response.json();
        // Wandelt die Antwort in JSON um.

        const correctAnswer = data.options[0];
        // Speichert die richtige Antwort.

        data.options = shuffleArray(data.options);
        // Mischt die Antwortmöglichkeiten.

        const correctIndex = data.options.findIndex(option => option === correctAnswer);
        // Findet den Index der richtigen Antwort.

        data.correctIndex = correctIndex;
        // Fügt den Index der richtigen Antwort als zusätzliches Feld hinzu.

        questions.push(data);
        // Fügt die Frage zum Array der Fragen hinzu.

        displayNextQuestion();
        // Zeigt die nächste Frage an.

    } catch (error) {
        console.error("Error fetching quiz:", error);
        // Behandelt Fehler beim Abrufen des Quiz.
    }
}

function displayNextQuestion() {
// Definiert die Funktion zum Anzeigen der nächsten Frage.
    const question = questions[currentQuestionIndex];
    // Holt die aktuelle Frage basierend auf dem Index.

    const cardContainer = document.getElementById("frageContainer");
    // Holt das HTML-Element für den Container der Fragen.

    const frageTextElement = document.getElementById('frageAllgWissen');
    // Holt das HTML-Element für den Fragetext.

    const card = document.createElement("div");
    // Erstellt ein neues div-Element.

    card.classList.add("mdl-cell", "mdl-cell--12-col");
    // Fügt dem div-Element Klassen hinzu.

    frageTextElement.textContent = question.text;
    // Setzt den Text der Frage.

    const cardBody = document.createElement("div");
    // Erstellt ein weiteres div-Element für den Karteninhalt.

    cardBody.classList.add("mdl-card__supporting-text");
    // Fügt dem div-Element eine Klasse hinzu.

    const shuffledOptions = shuffleArray([...question.options]);
    // Mischt die Antwortmöglichkeiten.

    clearButtons();
    // Löscht alte Antwort-Buttons.

    shuffledOptions.forEach((answer, index) => {
        // Für jede Antwortmöglichkeit:
        const button = document.createElement("button");
        // Erstellt einen neuen Button.

        button.classList.add("mdl-button", "mdl-js-button", "mdl-js-ripple-effect", "button4");
        // Fügt dem Button Klassen hinzu.

        console.log(question.correctIndex);
        // Gibt den Index der richtigen Antwort in der Konsole aus.

        if (index === question.correctIndex) {
            button.dataset.correct = "true";
            // Setzt ein Datenattribut für den Button, wenn er die richtige Antwort darstellt.
        }

        button.textContent = answer;
        // Setzt den Text des Buttons.

        button.addEventListener("click", () => checkAnswer(button));
        // Fügt einen Klick-Eventlistener hinzu.

        cardBody.appendChild(button);
        // Fügt den Button in das div-Element ein.
    });

    card.appendChild(cardBody);
    // Fügt den Karteninhalt in die Karte ein.

    cardContainer.appendChild(card);
    // Fügt die Karte in den Container ein.
}

function clearButtons() {
// Definiert die Funktion zum Löschen alter Buttons.
    document.querySelectorAll('.mdl-button').forEach(element => {
        element.remove();
    });
    // Entfernt alle Elemente mit der Klasse 'mdl-button'.
}

async function checkAnswer(selectedButton) {
// Definiert die asynchrone Funktion zur Überprüfung der Antwort.
    const isCorrect = selectedButton.dataset.correct === "true";
    // Überprüft, ob die ausgewählte Antwort korrekt ist.

    if (isCorrect) {
        correctAnswers++;
        // Erhöht den Punktestand, wenn die Antwort richtig ist.
    }

    markAnswer(selectedButton, isCorrect);
    // Markiert die Antwort als richtig oder falsch.

    await sleep(answerDelay);
    // Wartet für die angegebene Zeitspanne (answerDelay).

    updateProgressBar();
    // Aktualisiert die Fortschrittsleiste.

    if (currentQuestionIndex < questionsPerRound - 1) {
        currentQuestionIndex++;
        // Erhöht den Index der aktuellen Frage, wenn noch nicht alle Fragen beantwortet sind.
    } else {
        displayFinalScore();
        // Zeigt das Endergebnis an, wenn alle Fragen beantwortet sind.
        return;
    }

    fetchQuiz();
    // Ruft die nächste Frage ab.
}

function markAnswer(selectedButton, isCorrect) {
// Definiert die Funktion zur Markierung der Antwort.
    selectedButton.style.border = isCorrect ? '2px solid green' : '2px solid red';
    // Setzt die Rahmenfarbe des Buttons je nach Richtigkeit der Antwort.
}

function updateProgressBar() {
// Definiert die Funktion zur Aktualisierung der Fortschrittsleiste.
    const progress = (currentQuestionIndex / questionsPerRound) * 100;
    // Berechnet den Fortschritt in Prozent.

    const progressBar = document.querySelector('.progress2');
    // Holt das HTML-Element für die Fortschrittsleiste.

    progressBar.style.width = `${progress}%`;
    // Setzt die Breite der Fortschrittsleiste.
}

function displayFinalScore() {
// Definiert die Funktion zum Anzeigen des Endergebnisses.
    const frageTextElement = document.getElementById('frageText');
    // Holt das HTML-Element für den Fragetext.

  

    loadStatistic();
    // Lädt die Statistik.

    clearButtons();
    // Löscht alte Buttons.

    const cardContainer = document.getElementById("frageContainer");
    // Holt das HTML-Element für den Container der Fragen.

    cardContainer.appendChild(frageTextElement);
    // Fügt das Fragetext-Element in den Container ein.
}

function resetQuiz() {
// Definiert die Funktion zum Zurücksetzen des Quiz.
    currentQuestionIndex = 0;
    // Setzt den Index der aktuellen Frage auf 0.

    correctAnswers = 0;
    // Setzt den Punktestand auf 0.

    progressElement.style.width = `0%`;
    // Setzt die Breite der Fortschrittsleiste auf 0%.

    if (currentQuestionIndex == questionsPerRound - 1) {
        const cardContainer = document.getElementById("frageContainer");
        // Holt das HTML-Element für den Container der Fragen.

        cardContainer.querySelector("h3").remove();
        // Entfernt das h3-Element, wenn es vorhanden ist.
    }

    fetchQuiz();
    // Ruft die erste Frage ab.
}

restartButton.addEventListener("click", resetQuiz);
// Fügt dem Neustart-Button einen Klick-Eventlistener hinzu, der das Quiz zurücksetzt.

fetchQuiz();
// Ruft die erste Frage ab, wenn das Skript geladen wird.

function shuffleArray(array) {
// Definiert die Funktion zum Mischen eines Arrays.
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Wählt einen zufälligen Index.

        [array[i], array[j]] = [array[j], array[i]];
        // Tauscht die Elemente an den Positionen i und j.
    }
    return array;
    // Gibt das gemischte Array zurück.
}

function sleep(ms) {
// Definiert die Funktion für eine Pause.
    return new Promise(resolve => setTimeout(resolve, ms));
    // Gibt ein Promise zurück, das nach der angegebenen Zeitspanne aufgelöst wird.
}

function loadStatistic() {
// Definiert die Funktion zum Laden der Statistik.
    fetch('statistik.html')
    // Führt eine GET-Anfrage für die Statistik-Seite durch.

        .then(response => response.text())
        .then(html => {
            // Wandelt die Antwort in Text um.

            document.body.innerHTML = html;
            // Setzt den HTML-Inhalt des Body-Elements.

            const statisticContainer = document.getElementById('StatisitkContainer');
            // Holt das HTML-Element für den Statistik-Container.

            if (statisticContainer) {
                const kategorieElement = document.createElement('p');
                // Erstellt ein neues p-Element.

                kategorieElement.textContent = 'Folgende Kategorie: Externe Fragen';
                // Setzt den Text des p-Elements.

                statisticContainer.appendChild(kategorieElement);
                // Fügt das p-Element in den Statistik-Container ein.

                const richtigBeantwortetElement = document.createElement('p');
                // Erstellt ein weiteres p-Element.

                richtigBeantwortetElement.textContent = `Richtig beantwortete Fragen: ${correctAnswers}`;
                // Setzt den Text des p-Elements.

                statisticContainer.appendChild(richtigBeantwortetElement);
                // Fügt das p-Element in den Statistik-Container ein.

                const quote = (correctAnswers / questionsPerRound) * 100;
                // Berechnet die Quote der richtig beantworteten Fragen.

                const quoteElement = document.createElement('p');
                // Erstellt ein weiteres p-Element.

                quoteElement.textContent = `Quote: ${quote.toFixed(2)}%`;
                // Setzt den Text des p-Elements.

                statisticContainer.appendChild(quoteElement);
                // Fügt das p-Element in den Statistik-Container ein.
            }
        })
        .catch(error => {
            console.error('Beim Laden der Statistik ist ein Fehler aufgetreten:', error);
            // Behandelt Fehler beim Laden der Statistik.
        });
}
