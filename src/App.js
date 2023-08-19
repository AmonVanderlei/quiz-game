import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [name, setName] = useState("Quiz Game")
  const [questions, setQuestions] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);

  const correctMessages = ["Excelente! Você acertou!",
  "Muito bem! Resposta correta!",
  "Isso aí! Você está certo!",
  "Bom trabalho! Você acertou!",
  "Você está no caminho certo! Acertou!"]
  const wrongMessages = ["Oops! Tente novamente.",
  "Não foi dessa vez. Continue tentando!",
  "Quase lá! Próxima pergunta!",
  "Errou, mas não desista!",
  "Não desanime! Continue tentando."]
  const endMessages = ["Parabéns! Você é um mestre do conhecimento.",
  "Quiz concluído! Você é realmente um especialista.",
  "Incrível! Você venceu o desafio.",
  "Parabéns! Quiz completo.",
  "Quiz encerrado! Você arrasou nas respostas.",
  "O verdadeiro campeão é aquele que não desiste!",
  "Missão cumprida! Todas as perguntas respondidas."]

  useEffect(() => {
    fetch('escrituras.json')
      .then((response) => response.json())
      .then((jsonData) => {
        setName(jsonData.livros[0].nome)
        setQuestions(jsonData.livros[0].novo_testamento);
      })
      .catch((error) => {
        console.error('Erro ao carregar o JSON:', error);
      });
  }, []);

  function getRandomNumber(n) {
    return Math.floor(Math.random() * n);
  }

  const checkAnswer = (selectedIndex) => {
    if (!showResult) {
      const currentQuestion = questions[questionIndex];
      if (currentQuestion.opcoes[selectedIndex][1]) {
        setScore(score + 1);
        document.getElementById('result-text').textContent = correctMessages[getRandomNumber(correctMessages.length)];
      } else {
        document.getElementById('result-text').textContent = wrongMessages[getRandomNumber(wrongMessages.length)];
      }

      if (questionIndex === questions.length - 1) {
        setQuizEnded(true);
      } else {
        setShowResult(true);
      }
    }
  };

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setShowResult(false);
    } else {
      setQuizEnded(true);
    }
  };

  const restartQuiz = () => {
    setQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setQuizEnded(false);
  };

  return (
    <>
      <header>
        <h1>Quiz - {name}</h1>
      </header>
      <main>
        <section id="question-container">
          <h2 id="question">{questions && questions[questionIndex].referencia}</h2>
          <ul id="options">
            {questions && questions[questionIndex].opcoes.map((option, index) => (
                <li key={index}>
                  <button onClick={() => checkAnswer(index)}>{option}</button>
                </li>
              ))}
          </ul>
        </section>
        <section id="result-container" className={showResult ? '' : 'hidden'}>
          <p id="result-text">Correct!</p>
          <button onClick={nextQuestion}>Próxima pergunta</button>
        </section>
        <section id="score-container" className={showResult ? '' : 'hidden'}>
          <p>Pontuação: <span id="score">{score}/{questions?.length}</span></p>
        </section>
      </main>
      <span id='ended' className={quizEnded ? '' : 'hidden'}>
        <h2><b>Quiz Concluído!</b></h2>
        <p><b>{endMessages[getRandomNumber(endMessages.length)]}</b></p>
        <p>Pontuação: <b>{score} / {questions?.length}</b></p>
        <button onClick={restartQuiz}>Reiniciar</button>
      </span>
    </>
  );
}

export default App;