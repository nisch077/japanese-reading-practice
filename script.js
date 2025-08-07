
let currentExerciseIndex = 0;

// Get references to HTML elements
const exerciseContainer = document.getElementById('exercise-container');

function displayExercise() {
    // Clear any previous exercise content
    exerciseContainer.innerHTML = '';

    const current = exercises[currentExerciseIndex];

    const exerciseCard = document.createElement('div');
    exerciseCard.className = 'exercise-card';

    // Add the story paragraph
    const passage = document.createElement('p');
    passage.className = 'question';
    passage.textContent = current.passage;

    // Add the prompt to tell the user what to type
    const promptMessage = document.createElement('p');
    promptMessage.textContent = current.prompt;

    // Add the user input field
    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.id = 'answer-input';
    inputField.placeholder = 'Type your answer here...';

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
    exerciseCard.appendChild(passage);
    exerciseCard.appendChild(promptMessage);
    exerciseCard.appendChild(inputContainer);
    exerciseCard.appendChild(resultMessage);
    
    exerciseContainer.appendChild(exerciseCard);
    
    inputField.focus();

    inputField.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });
}

function checkAnswer() {
    const inputField = document.getElementById('answer-input');
    const resultMessage = document.getElementById('result');

    const userAnswer = inputField.value.trim().toLowerCase();
    const correctAnswer = exercises[currentExerciseIndex].answer.toLowerCase();

    if (userAnswer === correctAnswer) {
        resultMessage.textContent = 'Correct!';
        resultMessage.className = 'correct';
        setTimeout(nextExercise, 1500); 
    } else {
        resultMessage.textContent = `Incorrect. The correct answer was "${correctAnswer}".`;
        resultMessage.className = 'incorrect';
    }
}

function nextExercise() {
    currentExerciseIndex++;
    
    if (currentExerciseIndex >= exercises.length) {
        currentExerciseIndex = 0;
        alert("You've completed all the exercises! Starting over.");
    }
    
    displayExercise();
}

window.onload = displayExercise;