import ComponenteEventos1 from './ComponenteEventos1'
import ComponenteEventos2 from './ComponenteEventos2'
import Saludar from "./Saludar"

function App() {
  return (
    <div>

      <Saludar/>

      <ComponenteEventos1/>   //Usamos la función de flecha directamente en el parámetro
      <br></br>
      <ComponenteEventos2/>   //Sacamos la función de flecha afuera. 
    
      </div>
  )    
}

export default App
