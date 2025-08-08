// A list of Kanji to use for the exercises is defined in kanji_data.js
let currentExerciseIndex = 0;

// Get references to HTML elements from kanji.html
const exerciseContainer = document.getElementById('exercise-container');
const modalOverlay = document.getElementById('modal-overlay');
const restartButton = document.getElementById('restart-button');

function displayExercise() {
    // Clear any previous exercise content
    exerciseContainer.innerHTML = '';

    // Get the current exercise from our list
    const current = kanjiExercises[currentExerciseIndex];

    // Create the HTML structure for the exercise card
    const exerciseCard = document.createElement('div');
    exerciseCard.className = 'exercise-card';

    // Add the question (Kanji)
    const question = document.createElement('p');
    question.className = 'question';
    question.textContent = current.kanji;

    // Add the prompt to tell the user what to type
    const promptMessage = document.createElement('p');
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
    checkButton.textContent = 'Check Answer';
    checkButton.onclick = checkAnswer;

    // Add a result message area
    const resultMessage = document.createElement('p');
    resultMessage.id = 'result';

    // Assemble the card
    inputContainer.appendChild(inputField);
    inputContainer.appendChild(checkButton);
    exerciseCard.appendChild(question);
    exerciseCard.appendChild(promptMessage);
    exerciseCard.appendChild(inputContainer);
    exerciseCard.appendChild(resultMessage);
    
    // Add the finished card to the main container
    exerciseContainer.appendChild(exerciseCard);
    
    // Automatically focus the input field for a better user experience
    inputField.focus();

    // Listen for the 'Enter' key press on the input field
    inputField.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });
}

function checkAnswer() {
    const inputField = document.getElementById('answer-input');
    const resultMessage = document.getElementById('result');
    const inputContainer = document.querySelector('.input-container');

    const userAnswer = inputField.value.trim().toLowerCase();
    const correctAnswer = kanjiExercises[currentExerciseIndex].reading;

    if (userAnswer === correctAnswer) {
        resultMessage.textContent = 'Correct!';
        resultMessage.className = 'correct';
        setTimeout(nextExercise, 1500); 
    } else {
        resultMessage.textContent = `Incorrect. The correct answer was "${correctAnswer}".`;
        resultMessage.className = 'incorrect';
        
        // Add a "Next" button when the answer is wrong
        const nextButton = document.createElement('button');
        nextButton.className = 'button';
        nextButton.textContent = 'Next Exercise';
        nextButton.onclick = nextExercise;
        inputContainer.appendChild(nextButton);
        
        // Disable the original Check Answer button
        document.querySelector('.input-container .button').disabled = true;
    }
}

function nextExercise() {
    // Move to the next exercise in the list
    currentExerciseIndex++;
    
    // If we've reached the end, show the modal
    if (currentExerciseIndex >= kanjiExercises.length) {
        showModal();
    } else {
        displayExercise();
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
    hideModal();
    displayExercise();
});

// Start the first exercise when the page loads
window.onload = displayExercise;