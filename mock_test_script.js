// This file contains the JavaScript for the Mock Test functionality.
// It handles kanji selection, test generation, and displaying results.

// A list of Kanji to use for the exercises is defined in kanji_data.js
let currentExerciseIndex = 0;
let correctCount = 0;
let incorrectCount = 0;

// The array of exercises for the current test
let testExercises = [];
let totalQuestions = 0;

// Get references to HTML elements from mock_test.html
const exerciseContainer = document.getElementById('exercise-container');
const scoreTracker = document.getElementById('score-tracker');
const selectKanjiButton = document.getElementById('select-kanji-button');
const selectionModalOverlay = document.getElementById('modal-overlay');
const selectionContent = document.getElementById('selection-content'); // Updated ID
const kanjiSelectionList = document.getElementById('kanji-selection-list');
const selectAllButton = document.getElementById('select-all-button');
const selectNoneButton = document.getElementById('select-none-button');
const startTestButton = document.getElementById('start-test-button');
const cancelSelectionButton = document.getElementById('cancel-selection-button');
const reportModalOverlay = document.getElementById('report-modal-overlay');
const reportContent = document.getElementById('report-content'); // Updated ID
const finalReportDiv = document.getElementById('final-report');
const closeReportButton = document.getElementById('close-report-button');

// A simple function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to get a unique list of exercises
function getUniqueExercises(arr) {
    const uniqueKanji = {};
    return arr.filter(exercise => {
        if (!uniqueKanji[exercise.kanji]) {
            uniqueKanji[exercise.kanji] = true;
            return true;
        }
        return false;
    });
}

// Function to display the kanji selection modal
function showSelectionModal() {
    selectionModalOverlay.classList.add('active');
    populateKanjiSelection();
}

// Function to close the kanji selection modal
function hideSelectionModal() {
    selectionModalOverlay.classList.remove('active');
}

// Function to create and populate the list of kanji buttons in the modal
function populateKanjiSelection() {
    kanjiSelectionList.innerHTML = '';
    
    const uniqueKanji = getUniqueExercises(kanjiExercises);
    
    uniqueKanji.forEach(exercise => {
        const button = document.createElement('button');
        button.textContent = exercise.kanji;
        button.className = 'kanji-select-button selected'; // All selected by default
        button.setAttribute('data-kanji', exercise.kanji);
        
        button.addEventListener('click', () => {
            // Toggle the 'selected' class on click
            button.classList.toggle('selected');
        });
        
        kanjiSelectionList.appendChild(button);
    });
}

// Function to start the test based on selected kanji
function startTest() {
    const selectedKanjiButtons = document.querySelectorAll('.kanji-select-button.selected');
    
    if (selectedKanjiButtons.length === 0) {
        alert('Please select at least one kanji to start the test!');
        return;
    }
    
    const selectedKanjiList = Array.from(selectedKanjiButtons).map(button => button.getAttribute('data-kanji'));
    
    // Create the test exercises from the selected kanji
    testExercises = kanjiExercises.filter(exercise => selectedKanjiList.includes(exercise.kanji));
    totalQuestions = testExercises.length;
    
    // Shuffle the test exercises and reset the score
    shuffleArray(testExercises);
    currentExerciseIndex = 0;
    correctCount = 0;
    incorrectCount = 0;
    updateScoreDisplay();
    
    // Hide the selection modal and start the test
    hideSelectionModal();
    displayExercise();
}

// Function to display the current exercise
function displayExercise() {
    // Add a guard clause to prevent errors when the test is over
    if (currentExerciseIndex >= testExercises.length) {
        showReportModal();
        return; // Exit the function early
    }

    const current = testExercises[currentExerciseIndex];

    // Create a new exercise card
    const exerciseCard = document.createElement('div');
    exerciseCard.className = 'exercise-card';
    
    // For now, let's add a placeholder to show it's working
    exerciseCard.innerHTML = `
        <p class="question">${current.kanji}</p>
        <p class="prompt-message">${current.prompt}</p>
        <div class="input-container">
            <input type="text" id="answer-input" placeholder="Type the reading here...">
            <button id="check-button" class="button">Check Answer</button>
        </div>
        <p id="result"></p>
    `;
    
    // Clear previous exercise and append the new one
    const existingWrapper = document.getElementById('exercise-content-wrapper');
    if (existingWrapper) {
        existingWrapper.remove();
    }
    
    const exerciseContentWrapper = document.createElement('div');
    exerciseContentWrapper.id = 'exercise-content-wrapper';
    exerciseContentWrapper.appendChild(exerciseCard);
    exerciseContainer.appendChild(exerciseContentWrapper);
    
    // Hide the select kanji button and show the score tracker
    selectKanjiButton.style.display = 'none';
    scoreTracker.style.display = 'block';

    // Add event listeners for the new elements
    const checkButton = document.getElementById('check-button');
    checkButton.onclick = checkAnswer;
    const inputField = document.getElementById('answer-input');
    inputField.focus();
    inputField.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });
}

// Function to check the user's answer (simplified for now)
function checkAnswer() {
    const inputField = document.getElementById('answer-input');
    const resultMessage = document.getElementById('result');
    const checkButton = document.getElementById('check-button');
    
    const userAnswer = inputField.value.trim().toLowerCase();
    const correctAnswer = testExercises[currentExerciseIndex].reading;
    
    checkButton.disabled = true;

    if (userAnswer === correctAnswer) {
        resultMessage.textContent = 'Correct!';
        resultMessage.className = 'correct';
        correctCount++;
    } else {
        resultMessage.textContent = `Incorrect. The correct answer was "${correctAnswer}".`;
        resultMessage.className = 'incorrect';
        incorrectCount++;
    }
    
    updateScoreDisplay();

    // Create and add the 'Next Exercise' button
    const nextButton = document.createElement('button');
    nextButton.className = 'button next-button';
    nextButton.textContent = 'Next Exercise';
    nextButton.onclick = nextExercise;
    checkButton.parentNode.appendChild(nextButton);
}

// Function to move to the next exercise
function nextExercise() {
    // Remove the 'Next Exercise' button
    const nextButton = document.querySelector('.next-button');
    if (nextButton) {
        nextButton.remove();
    }
    
    // Clear the previous exercise card
    const existingWrapper = document.getElementById('exercise-content-wrapper');
    if (existingWrapper) {
        existingWrapper.remove();
    }

    currentExerciseIndex++;

    // Check if there are more exercises in the test
    if (currentExerciseIndex < testExercises.length) {
        // If there are more exercises, display the next one
        displayExercise();
    } else {
        // All exercises are complete, show the report
        showReportModal();
    }
}

// Function to update the score display
function updateScoreDisplay() {
    const correctDisplay = document.getElementById('correct-count');
    const incorrectDisplay = document.getElementById('incorrect-count');
    correctDisplay.textContent = correctCount;
    incorrectDisplay.textContent = incorrectCount;
}

// Function to show the final report modal
function showReportModal() {
    reportModalOverlay.classList.add('active');
    finalReportDiv.innerHTML = `
        <p>Total questions: ${totalQuestions}</p>
        <p>Correct answers: ${correctCount}</p>
        <p>Incorrect answers: ${incorrectCount}</p>
        <p>Accuracy: ${((correctCount / totalQuestions) * 100).toFixed(2)}%</p>
    `;
}

// Function to close the report modal and go back to the selection screen
function closeReportModal() {
    reportModalOverlay.classList.remove('active');
    
    // Clear the exercise content and show the select kanji button again
    const existingWrapper = document.getElementById('exercise-content-wrapper');
    if (existingWrapper) {
        existingWrapper.remove();
    }
    selectKanjiButton.style.display = 'block';
    scoreTracker.style.display = 'none';
}

// Function to select all kanji
function selectAllKanji() {
    const kanjiButtons = document.querySelectorAll('.kanji-select-button');
    kanjiButtons.forEach(button => {
        button.classList.add('selected');
    });
}

// Function to deselect all kanji
function selectNoneKanji() {
    const kanjiButtons = document.querySelectorAll('.kanji-select-button');
    kanjiButtons.forEach(button => {
        button.classList.remove('selected');
    });
}

// Function to create and render the virtual keyboard
function createKeyboard() {
    const keyboardContainer = document.getElementById('keyboard');
    
    // Mapping for voiced (tenten) and semi-voiced (maru) consonants
    const tentenMap = {
        'か': 'が', 'き': 'ぎ', 'く': 'ぐ', 'け': 'げ', 'こ': 'ご',
        'さ': 'ざ', 'し': 'じ', 'す': 'ず', 'せ': 'ぜ', 'そ': 'ぞ',
        'た': 'だ', 'ち': 'ぢ', 'つ': 'づ', 'て': 'で', 'と': 'ど',
        'は': 'ば', 'ひ': 'び', 'ふ': 'ぶ', 'へ': 'べ', 'ほ': 'ぼ'
    };
    const maruMap = {
        'は': 'ぱ', 'ひ': 'ぴ', 'ふ': 'ぷ', 'へ': 'ぺ', 'ほ': 'ぽ'
    };

    const hiraganaKeys = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ', 'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'を', 'ん', 'ゃ', 'ゅ', 'ょ', '、', '。'];

    // Add all the basic hiragana keys
    hiraganaKeys.forEach(char => {
        const key = document.createElement('div');
        key.className = 'key';
        key.textContent = char;
        key.addEventListener('click', () => {
            const inputField = document.getElementById('answer-input'); // Find the current input field
            inputField.value += char;
            inputField.focus();
        });
        keyboardContainer.appendChild(key);
    });

    // Add special character keys
    const specialKeys = ['゛', '゜', 'っ', 'Backspace'];
    specialKeys.forEach(char => {
        const key = document.createElement('div');
        key.className = 'key';
        key.textContent = char;

        if (char === '゛') {
            key.addEventListener('click', () => {
                const inputField = document.getElementById('answer-input'); // Find the current input field
                const lastChar = inputField.value.slice(-1);
                if (tentenMap[lastChar]) {
                    inputField.value = inputField.value.slice(0, -1) + tentenMap[lastChar];
                }
                inputField.focus();
            });
        } else if (char === '゜') {
            key.addEventListener('click', () => {
                const inputField = document.getElementById('answer-input'); // Find the current input field
                const lastChar = inputField.value.slice(-1);
                if (maruMap[lastChar]) {
                    inputField.value = inputField.value.slice(0, -1) + maruMap[lastChar];
                }
                inputField.focus();
            });
        } else if (char === 'っ') {
            key.addEventListener('click', () => {
                const inputField = document.getElementById('answer-input'); // Find the current input field
                inputField.value += 'っ';
                inputField.focus();
            });
        } else if (char === 'Backspace') {
            key.className += ' backspace';
            key.addEventListener('click', () => {
                const inputField = document.getElementById('answer-input'); // Find the current input field
                inputField.value = inputField.value.slice(0, -1);
                inputField.focus();
            });
        }
        keyboardContainer.appendChild(key);
    });
}

// Event Listeners
selectKanjiButton.addEventListener('click', showSelectionModal);
selectAllButton.addEventListener('click', selectAllKanji);
selectNoneButton.addEventListener('click', selectNoneKanji);
startTestButton.addEventListener('click', startTest);
cancelSelectionButton.addEventListener('click', hideSelectionModal);
closeReportButton.addEventListener('click', closeReportModal);


// Initialize the page by showing the select kanji button and creating the keyboard
window.onload = function() {
    selectKanjiButton.style.display = 'block';
    scoreTracker.style.display = 'none';
    populateKanjiSelection(); // Pre-populate the modal for a faster user experience
    createKeyboard(); // Add this line to create the keyboard on page load
};
