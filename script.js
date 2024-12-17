const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

let questions = [];
let currentQuestionIndex = 0;
let correctScore = 0;
let incorrectScore = 0;

const correctScoreElem = document.getElementById('correct-score');
const incorrectScoreElem = document.getElementById('incorrect-score');
const percentageElem = document.getElementById('percentage');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const confirmButton = document.getElementById('confirm-button');
const nextButton = document.getElementById('next-button');
const fileInput = document.getElementById('file-input');

// Container para a explicação
const explanationContainer = document.createElement('p');
explanationContainer.style.marginTop = "20px";
explanationContainer.style.color = "#ffffff";
document.getElementById('game-container').appendChild(explanationContainer);

// Carrega o JSON
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        questions = JSON.parse(e.target.result);
        currentQuestionIndex = 0;
        resetGame();
        displayQuestion();
      } catch (error) {
        alert("Erro ao carregar o arquivo JSON. Verifique o formato.");
        console.error(error);
      }
    };
    reader.readAsText(file);
  }
});

// Exibe a pergunta atual e as opções
function displayQuestion() {
  explanationContainer.textContent = ""; // Limpa explicação anterior

  if (currentQuestionIndex >= questions.length) {
    questionText.textContent = "Fim do Jogo! Parabéns!";
    optionsContainer.innerHTML = "";
    confirmButton.style.display = "none";
    nextButton.style.display = "none";
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  questionText.textContent = currentQuestion.question;
  optionsContainer.innerHTML = "";

  currentQuestion.options.forEach((optionText, index) => {
    const optionElem = document.createElement('div');
    optionElem.classList.add('option');
    optionElem.textContent = optionText;
    optionElem.dataset.index = index; // Salva o índice da opção
    optionElem.addEventListener('click', () => selectOption(optionElem));
    optionsContainer.appendChild(optionElem);
  });

  confirmButton.disabled = true;
  confirmButton.style.display = "block";
  nextButton.style.display = "none";
}

// Seleciona a opção
function selectOption(selectedOption) {
  optionsContainer.querySelectorAll('.option').forEach(option => {
    option.classList.remove('selected');
  });
  selectedOption.classList.add('selected');
  confirmButton.disabled = false;
}

// Confirma a resposta
confirmButton.addEventListener('click', () => {
  const selectedOption = optionsContainer.querySelector('.option.selected');
  if (!selectedOption) return;

  const currentQuestion = questions[currentQuestionIndex];
  const correctIndex = currentQuestion.correctIndex;
  const selectedIndex = parseInt(selectedOption.dataset.index);

  if (selectedIndex === correctIndex) {
    selectedOption.classList.add('correct');
    correctSound.play();
    correctScore++;
    explanationContainer.textContent = `✅ Explicação: ${currentQuestion.explanation}`;
  } else {
    selectedOption.classList.add('incorrect');
    optionsContainer.children[correctIndex].classList.add('correct'); // Mostra a resposta correta
    wrongSound.play();
    incorrectScore++;
    explanationContainer.textContent = `❌ Explicação: ${currentQuestion.explanation}`;
  }

  updateScore();
  confirmButton.style.display = "none";
  nextButton.style.display = "block";
});

// Vai para a próxima pergunta
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  displayQuestion();
});

// Atualiza o placar
function updateScore() {
  correctScoreElem.textContent = correctScore;
  incorrectScoreElem.textContent = incorrectScore;
  const total = correctScore + incorrectScore;
  percentageElem.textContent = total > 0 ? ((correctScore / total) * 100).toFixed(2) + "%" : "0%";
}

// Reseta o jogo
function resetGame() {
  correctScore = 0;
  incorrectScore = 0;
  correctScoreElem.textContent = 0;
  incorrectScoreElem.textContent = 0;
  percentageElem.textContent = "0%";
  explanationContainer.textContent = "";
}
