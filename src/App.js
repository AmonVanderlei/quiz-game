import './App.css';
import React, { useEffect, useState, useCallback } from 'react';

function App() {
  const [name, setName] = useState("Quiz Game")
  const [questions, setQuestions] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState([]);
  const [options, setOptions] = useState([["Opção 1", 0], ["Opção 2", 1], ["Opção 3", 2], ["Opção 4", 3]]);
  const [score, setScore] = useState(0);
  const [resultText, setResultText] = useState('');
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

  function getRandomNumber(n) {
    return Math.floor(Math.random() * n);
  }

  const setRandomIndex = useCallback(() => {
    let random = getRandomNumber(questions.length)
    while (questionsAnswered.includes(random)) {
      random = getRandomNumber(questions.length)
    }
    setQuestionIndex(random);
  }, [questions, questionsAnswered]);

  const setAlternatives = useCallback(() => {
    let newQuestions = [-1, -1, -1, -1];
    let addedQuestions = [questionIndex]
    let availableIndexes = [true, true, true, true]

    let i = getRandomNumber(4)
    newQuestions[i] = [questions[questionIndex].referencia, i]
    availableIndexes[i] = false

    for (let j = 0; j < availableIndexes.length; j++) {
      if (availableIndexes[j]) {
        let randomIndex = getRandomNumber(questions.length)
        while (addedQuestions.includes(randomIndex)) {
          randomIndex = getRandomNumber(questions.length);
        }
        newQuestions[j] = [questions[randomIndex].referencia, j]
        availableIndexes[j] = false
      }
    }
    setOptions(newQuestions);
  }, [questions, questionIndex]);

  const checkAnswer = (selectedAnswer) => {
    if (!showResult) {
      const currentQuestion = questions[questionIndex];
      let resultText = '';
  
      if (selectedAnswer === currentQuestion.referencia) {
        setScore(score + 1);
        resultText = correctMessages[getRandomNumber(correctMessages.length)];
      } else {
        resultText = wrongMessages[getRandomNumber(wrongMessages.length)];
      }
  
      if ((questionsAnswered.length + 1) === questions.length) {
        setQuizEnded(true);
      } else {
        setShowResult(true);
      }
  
      setResultText(resultText);
    }
  };
  

  const nextQuestion = () => {
    if (questionsAnswered.length === questions.length) {
      setQuizEnded(true);
    } else {
      setQuestionsAnswered([...questionsAnswered, questionIndex]);
      setShowResult(false);
    }
  };

  const restartQuiz = () => {
    setRandomIndex();
    setQuestionsAnswered([])
    setScore(0);
    setShowResult(false);
    setQuizEnded(false);
  };

  useEffect(() => {
    fetch('http://localhost:8000/')
      .then((response) => response.json())
      .then((jsonData) => {
        if (jsonData.livros && jsonData.livros[0] && jsonData.livros[0].novo_testamento) {
          setName(jsonData.livros[0].nome);
          setQuestions(jsonData.livros[0].novo_testamento);
        } else {
          console.error('A estrutura dos dados está incorreta');
        }
      })
      .catch((error) => {
        console.error('Erro ao carregar o JSON:', error);
      });
  }, []);
  
  useEffect(() => {
    if (questions !== null) {
      setRandomIndex()
    }
  }, [questions, setRandomIndex]);

  useEffect(() => {
    if (questions !== null) {
      setAlternatives()      
    }
  }, [questions, questionIndex, setAlternatives]);

  return (
    <>
      <header>
        <h1>Quiz - {name}</h1>
      </header>
      <main>
        <section id="question-container">
          <h2 id="question">{questions && questions[questionIndex].palavra_chave}</h2>
          <ul id="options">
            {questions && options.map((option) => (
                <li key={option[1]}>
                  <button onClick={() => checkAnswer(option[0])}>{option[0]}</button>
                </li>
              ))}
          </ul>
        </section>
        <section id="result-container" className={showResult ? '' : 'hidden'}>
          <p id="result-text">{resultText}</p>
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