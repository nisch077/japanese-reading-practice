// A list of Kanji to use for the exercises is defined in kanji_data.js
let currentExerciseIndex = 0;
let correctCount = 0;
let incorrectCount = 0;

// A simple function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

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

// Get references to HTML elements from kanji.html
const exerciseContainer = document.getElementById('exercise-container');
const modalOverlay = document.getElementById('modal-overlay');
const restartButton = document.getElementById('restart-button');

function displayExercise() {
    // Get the current exercise from our list
    const current = kanjiExercises[currentExerciseIndex];

    // Add the question (Kanji)
    const question = document.createElement('p');
    question.className = 'question';
    question.textContent = current.kanji;

    // Add the prompt to tell the user what to type
    const promptMessage = document.createElement('p');
    promptMessage.className = 'prompt-message';
    promptMessage.textContent = current.prompt;

    // Add the user input field
    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.id = 'answer-input';
    inputField.placeholder = 'Type the reading here...';

    // Add a check button
    const checkButton = document.createElement('button');
    checkButton.className = 'button';
    checkButton.id = 'check-button';
    checkButton.textContent = 'Check Answer';
    checkButton.onclick = checkAnswer;

    // Add a result message area
    const resultMessage = document.createElement('p');
    resultMessage.id = 'result';

    // Assemble the card
    inputContainer.appendChild(inputField);
    inputContainer.appendChild(checkButton);

    // Create a wrapper for the exercise content that will be cleared
    const exerciseContentWrapper = document.createElement('div');
    exerciseContentWrapper.id = 'exercise-content-wrapper';
    exerciseContentWrapper.appendChild(question);
    exerciseContentWrapper.appendChild(promptMessage);
    exerciseContentWrapper.appendChild(inputContainer);
    exerciseContentWrapper.appendChild(resultMessage);

    // Clear only the previous exercise content, not the score tracker
    const existingWrapper = document.getElementById('exercise-content-wrapper');
    if (existingWrapper) {
        existingWrapper.remove();
    }

    // Add the new exercise content to the main container
    exerciseContainer.appendChild(exerciseContentWrapper);

    // Automatically focus the input field for a better user experience
    inputField.focus();

    // Listen for the 'Enter' key press on the input field
    inputField.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });
}

// Function to check the user's answer
function checkAnswer() {
    const inputField = document.getElementById('answer-input');
    const resultMessage = document.getElementById('result');
    const inputContainer = document.querySelector('.input-container');

    const userAnswer = inputField.value.trim().toLowerCase();
    const correctAnswer = kanjiExercises[currentExerciseIndex].reading;

    // Disable the 'Check Answer' button to prevent multiple submissions
    const checkButton = document.getElementById('check-button');
    if (checkButton) {
        checkButton.disabled = true;
    }

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
    nextButton.className = 'button next-button'; // Add a unique class to identify it
    nextButton.textContent = 'Next Exercise';
    nextButton.onclick = nextExercise;
    inputContainer.appendChild(nextButton);
}

function updateScoreDisplay() {
    const correctDisplay = document.getElementById('correct-count');
    const incorrectDisplay = document.getElementById('incorrect-count');
    correctDisplay.textContent = correctCount;
    incorrectDisplay.textContent = incorrectCount;
}

// Function to move to the next exercise
function nextExercise() {
    // Clear the result message and input field
    document.getElementById('result').textContent = ''; 
    document.getElementById('result').className = ''; 
    document.getElementById('answer-input').value = '';

    // Remove the 'Next Exercise' button
    const nextButton = document.querySelector('.next-button');
    if (nextButton) {
        nextButton.remove();
    }
    
    // Re-enable the 'Check Answer' button
    const checkButton = document.getElementById('check-button');
    if (checkButton) {
        checkButton.disabled = false;
    }

    currentExerciseIndex++;
    if (currentExerciseIndex < kanjiExercises.length) {
        displayExercise();
    } else {
        showModal();
    }
}

function showModal() {
    modalOverlay.classList.add('active');
}

function hideModal() {
    modalOverlay.classList.remove('active');
}

// Add an event listener to the restart button
restartButton.addEventListener('click', function() {
    currentExerciseIndex = 0;
    correctCount = 0;
    incorrectCount = 0;
    hideModal();
    const uniqueKanjiExercises = getUniqueExercises(kanjiExercises);
    shuffleArray(uniqueKanjiExercises);
    kanjiExercises = uniqueKanjiExercises; // Use the new unique array
    displayExercise();
    updateScoreDisplay();
});

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

// Start the first exercise and create the keyboard when the page loads
window.onload = function() {
    const uniqueKanjiExercises = getUniqueExercises(kanjiExercises);
    shuffleArray(uniqueKanjiExercises);
    kanjiExercises = uniqueKanjiExercises; // Use the new unique array
    displayExercise();
    createKeyboard();
};