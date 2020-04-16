import React, { useState, useEffect } from "react";
import api from "./services/api";

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);
  useEffect(() => {
    api.get("repositories").then((response) => setRepositories(response.data));
  }, []);
  async function handleAddRepository() {
    api
      .post("repositories", {
        title: "titulo2",
        url: "apple.com",
        techs: "python",
      })
      .then((response) => setRepositories([...repositories, response.data]));
  }

  async function handleRemoveRepository(id) {
    api.delete(`repositories/${id}`);
    setRepositories(repositories.filter((repository) => repository.id !== id));
  }
  console.log(repositories);
  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map((repository) => {
          return (
            <li key={repository.id}>
              {repository.title}
              <button onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button>
            </li>
          );
        })}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
