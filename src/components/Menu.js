import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Menu() {
  const navigate = useNavigate();
  const [escrituras, setEscrituras] = useState([]);
  const [allChecked, setAllChecked] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);

  const handleSelectAll = (i) => {
    setIsChecked((prevState) => {
      const updatedIsChecked = [...prevState];
      const updateAllChecked = [...allChecked];
      updateAllChecked[i] = !updateAllChecked[i];
      setAllChecked(updateAllChecked);
      updatedIsChecked[i] = Array(24).fill(updateAllChecked[i]);

      return updatedIsChecked;
    });
    setExpanded((prevExpanded) => {
      const updatedExpanded = [...prevExpanded];
      updatedExpanded[i] = !updatedExpanded[i];
      return updatedExpanded;
    });
  };

  const handleCheckbox = (id, checked, groupIndex) => {
    setIsChecked((prevState) => {
      const updatedIsChecked = [...prevState];
      updatedIsChecked[groupIndex][id] = checked;
      return updatedIsChecked;
    });
  };

  const startQuiz = (e) => {
    e.preventDefault();

    let questions = [];
    let alternatives = [];
    for (let i = 0; i < allChecked.length; i++) {
      if (allChecked[i]) {
        for (let j = 0; j < isChecked[i].length; j++) {
          if (isChecked[i][j]) {
            if (escrituras[i].dominio_doutrinario[j] !== undefined) {
              questions.push(escrituras[i].dominio_doutrinario[j]);
              alternatives.push(
                escrituras[i].dominio_doutrinario[j].referencia
              );
            }
          }
        }
      }
    }

    localStorage.setItem("alternativas", JSON.stringify(alternatives));
    localStorage.setItem("escrituras", JSON.stringify(questions));
    navigate("/quiz");
  };

  const scriptureChecks = (escritura, groupIndex) => {
    return escritura.map((item, i) => (
      <label key={i} id="scriptures">
        <input
          type="checkbox"
          name={item.referencia}
          checked={isChecked[groupIndex][i] || false}
          onChange={(e) => handleCheckbox(i, e.target.checked, groupIndex)}
        />
        {item.referencia}
      </label>
    ));
  };

  useEffect(() => {
    fetch("https://quiz-api-amonvanderlei.vercel.app/")
      .then((response) => response.json())
      .then((jsonData) => {
        if (jsonData.livros) {
          setEscrituras(jsonData.livros);
          setExpanded(Array(jsonData.livros.length).fill(false));
          setAllChecked(Array(jsonData.livros.length).fill(false));
          setIsChecked(
            Array(jsonData.livros.length)
              .fill([])
              .map(() => Array(24).fill(false))
          );
        } else {
          console.error("A estrutura dos dados está incorreta");
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar o JSON:", error);
      });
  }, []);

  return (
    <>
      <header>
        <h1>Quiz das Escrituras</h1>
      </header>
      <main>
        <h2>Selecionar Conteúdo</h2>
        <form id="menu-form">
          {escrituras.map((escritura, i) => (
            <div key={i} id="choose-scriptures">
              <label>
                <input
                  type="checkbox"
                  name={`checkbox${i + 1}`}
                  checked={allChecked[i] || false}
                  onChange={() => handleSelectAll(i)}
                />
                <strong>{escritura.nome}</strong>
              </label>
              <div style={{ display: expanded[i] ? "flex" : "none" }}>
                {scriptureChecks(escritura.dominio_doutrinario, i)}
              </div>
            </div>
          ))}

          <button onClick={startQuiz}>Iniciar Quiz</button>
        </form>
      </main>
    </>
  );
}

export default Menu;
