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

//PATCH

  const statusTarefas = useCallback(async(id) => {
    
    const response = await fetch (`http://localhost:3000/tarefas/${id}`, {
      method: 'PATCH',
    }) 
    console.log(response)
    if (response.ok) handleFetchTarefas()
  }, [handleFetchTarefas] )
 

// DELETE (FEITO POR EU)
const deletar = useCallback(async (id) => {
const response = await fetch(`http://localhost:3000/tarefas/${id}`, {
    method: 'DELETE',
  })
  console.log(response)
    if (response.ok) handleFetchTarefas();
}, [handleFetchTarefas])




// FINAL DO DELETE (FEITO POR EU)

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
          <label>Convidado</label>
          <input ref={inputTitle} type="text" name="title" placeholder="Quem precisa ser adicionado?" required />
        </div>
{/* Selecionar presunto */}
        <div>
          <label for="Presente">Escolha seu presente:</label> 
          <select ref={inputDescription}>
            <option>-- selecione um item --</option>
            <option value = "Camisa do Grêmio">Camisa do Grêmio</option>
            <option value = "Pix">Pix</option>
            <option value = "Porsche Blue">Porsche Blue</option>
            <option value = "Cruzeiro">Cruzeiro</option>
            <option value = "Katana">Katana</option>
            <option value = "Orfeu">Orfeu</option>
          </select>
        </div>

        <div className="form-group">
          <label>Presentes</label>
          <input type="text" name="description" placeholder="Qual presente vai levar..." />
        </div>
        <button type="submit">Adicionar Convidado</button>
      </form>

      {addLoading && <div className="loading">Carregando Convidado...</div>}

      {loading ?
        <div className="loading">Carregando Convidados...</div>
        : (
          <ul>
            {tarefas.map((item, index) => (
              <li key={index}>
                <strong>{item.title}</strong>
                {item.description && <span>{item.description}</span>}

              <div>
                <input type = "checkbox" checked={item.completed??false} onChange= {() => statusTarefas(item.id)}/>
                <label>Chegou</label>
              </div>

               <div>
                <button onClick={() => deletar(item.id)}>DELETAR O CONVIDADO</button>
                </div>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}

export default App;
