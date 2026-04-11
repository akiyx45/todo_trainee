import { useState} from "react";


function App() {
  const [tarefas, setTarefas] = useState ([]);

  const adicionarItem = function (title, description) {
    setTarefas((trf) => {
      return [{ title, description}, ...trf ];
    })
  };

  const handleSubmit = function (e) {
    e.preventDefault();

    const title = e.target.title.value;
    const description = e.target.description.value;
    
    adicionarItem(title, description);

    e.target.title.value = ''
    e.target.description.value = ''
  }
  return (
  <div>
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Título:</label>
          <input type="text" name="title" />
        </div>
        <div>
          <label htmlFor="title">Descrição:</label>
          <input type="text" name="description" />
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
    <div>
      <ul>
        {tarefas.map((item) => <li key = {item.title}>{item.title}</li> )}
      </ul>
    </div>
  </div>
  )
  
}

export default App;
