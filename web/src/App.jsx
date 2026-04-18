import { useCallback, useEffect, useRef, useState } from "react";
import './App.css';

function App() {
  const inputTitle = useRef(null);
  const inputDescription = useRef(null);
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const handleFetchTarefas = useCallback(async () => {
    setLoading(true);
    const response = await fetch('http://localhost:3000/tarefas')
      .then((response) => response.json());

    setTarefas(response.data);
    setLoading(false);
  }, []);

  const adicionarItem = useCallback(async (title, description) => {
    setAddLoading(true);
    const response = await fetch('http://localhost:3000/tarefas', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
    setAddLoading(false);

    if (response.ok) handleFetchTarefas();
  }, [handleFetchTarefas]);

  const handleSubmit = function (e) {
    e.preventDefault();

    const title = inputTitle.current?.value;
    const description = inputDescription.current?.value;
    
    adicionarItem(title, description);

    inputTitle.current.value = '';
    inputDescription.current.value = '';
    inputTitle.current?.focus();
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleFetchTarefas();
  }, [handleFetchTarefas]);

  useEffect(() => {
    if (!inputTitle.current) return;
    inputTitle.current?.focus();
  }, []);

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título</label>
          <input ref={inputTitle} type="text" name="title" placeholder="O que precisa ser feito?" required />
        </div>
        <div className="form-group">
          <label>Descrição</label>
          <input ref={inputDescription} type="text" name="description" placeholder="Adicione detalhes..." />
        </div>
        <button type="submit">Salvar Tarefa</button>
      </form>

      {addLoading && <div className="loading">Salvando novo item...</div>}

      {loading ?
        <div className="loading">Carregando itens...</div>
        : (
          <ul>
            {tarefas.map((item, index) => (
              <li key={index}>
                <strong>{item.title}</strong>
                {item.description && <span>{item.description}</span>}
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}

export default App;
