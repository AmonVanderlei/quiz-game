import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function Quiz() {
  const navigate = useNavigate();
  const [allAlternatives, setAllAlternatives] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState([]);
  const [wrongAnsweredQuestions, setWrongAnsweredQuestions] = useState([]);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(0);
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
    let options = [[], [], [], []];
    let availableIndexes = [true, true, true, true]

    let i = getRandomNumber(4)
    options[i] = [questions[questionIndex]?.referencia, i]
    availableIndexes[i] = false

    for (let j = 0; j < availableIndexes.length; j++) {
      if (availableIndexes[j]) {
        let randomIndex = getRandomNumber(allAlternatives.length)
        let currentOptions = options.map((array) => array[0])

        while (currentOptions.includes(allAlternatives[randomIndex])) {
          randomIndex = getRandomNumber(allAlternatives.length);
        }
        
        options[j] = [allAlternatives[randomIndex], j]
        availableIndexes[j] = false
      }
    }
    setOptions(options);
  }, [questions, questionIndex, allAlternatives]);

  const checkAnswer = (selectedAnswer) => {
    if (!showResult) {
      const currentQuestion = questions[questionIndex];
      let resultText = '';
  
      if (selectedAnswer === currentQuestion.referencia) {
        setAnsweredCorrectly(1);
        setScore(score + 1);
        resultText = correctMessages[getRandomNumber(correctMessages.length)];
      } else {
        setWrongAnsweredQuestions(prevQuestions => [
          ...prevQuestions,
          questionIndex
        ]);

        setAnsweredCorrectly(2);
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
      setAnsweredCorrectly(0);
      setQuestionsAnswered([...questionsAnswered, questionIndex]);
      setShowResult(false);
    }
  };

  const wrongQuiz = () => {
    let newQuestions = []
    for (const i of wrongAnsweredQuestions){
      newQuestions.push(questions[i]);
    };

    setQuestions(newQuestions);
    setAnsweredCorrectly(0);
    setWrongAnsweredQuestions([]);
    setQuestionIndex(0);
    setRandomIndex();
    setQuestionsAnswered([]);
    setScore(0);
    setShowResult(false);
    setQuizEnded(false);
  };

  const restartQuiz = () => {
    navigate('/')
  };

  useEffect(() => {
    if (localStorage.getItem('escrituras') !== null && localStorage.getItem('alternativas') !== null) {
      let escrituras = JSON.parse(localStorage.getItem('escrituras'))
      let alternativas = JSON.parse(localStorage.getItem('alternativas'))
      setQuestions(escrituras);
      setAllAlternatives(alternativas);
    } else {
      navigate('/');
    }
  }, [navigate]);
  
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
        <h1>Quiz das Escrituras</h1>
      </header>
      <main className={quizEnded ? 'hidden' : ''}>
        <section id="question-container">
          <h2 id="question">{questions && questions[questionIndex]?.palavra_chave}</h2>
          <ul id="options">
            {questions && options.map((option) => (
                <li key={option[1]}>
                  <button onClick={() => checkAnswer(option[0])}>{option[0]}</button>
                </li>
              ))}
          </ul>
        </section>
        <section id='result-container' className={showResult ? '' : 'hidden'}>
          <p id="result-text" className={answeredCorrectly === 1 ? 'green-text' : answeredCorrectly === 2 ? 'red-text' : ''}>
            {resultText}
            </p>
          <button id={answeredCorrectly === 1 ? 'green' : answeredCorrectly === 2 ? 'red' : ''} 
          onClick={nextQuestion}>Próxima pergunta</button>
        </section>
        <section id="score-container" className={showResult ? '' : 'hidden'}>
          <p className={answeredCorrectly === 1 ? 'green-text' : answeredCorrectly === 2 ? 'red-text' : ''}>Pontuação:       
            <span id="score" className={answeredCorrectly === 1 ? 'green-text' : answeredCorrectly === 2 ? 'red-text' : ''}>
              {score}/{questions?.length}
            </span>
          </p>
        </section>
      </main>
      <span id='ended' className={quizEnded ? '' : 'hidden'}>
        <h2><b>Quiz Concluído!</b></h2>
        <p><b>{endMessages[getRandomNumber(endMessages.length)]}</b></p>
        <p>Pontuação: <b>{score} / {questions?.length}</b></p>
        <button className={wrongAnsweredQuestions.length === 0 ? 'hidden' : ''} onClick={wrongQuiz}>Refazer questões erradas</button>
        <button onClick={restartQuiz}>Reiniciar</button>
      </span>
    </>
  );
}

export default Quiz;