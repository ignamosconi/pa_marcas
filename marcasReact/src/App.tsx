import './index.css';

import MyComponent1 from './ejemploBasic/myComponent1'
import MyComponent2 from './ejemploBasic/myComponent2'
import MyList1 from './ejemploBasic/myList1'
import MyList2 from './ejemploBasic/myList2'

import ComponenteEventos1 from './ejemploClases/ComponenteEventos1'
import ComponenteEventos2 from './ejemploClases/ComponenteEventos2'
import State1 from './ejemploUseState/State1'
import State1_1 from './ejemploUseState/State1.1';
import State2 from './ejemploUseState/State2';
import Marca from './ejemploUseState/Marca';


function App() {
  //REPO GLOBAL: https://github.com/orgs/Programacion-Avanzada-UTN-FRVM/repositories?type=all*
  return (
    <div>
      <div>
        <h1> Carpeta "ejemploClases"</h1>
        <ComponenteEventos1/>   {/* Usamos la función de flecha directamente en el parámetro*/}
        <br/>
        <br/>
        <ComponenteEventos2/>   {/* Sacamos la función de flecha afuera */}

      </div>


      <div>
        <h1>Carpeta "ejemploBasic"</h1>
        <p> <b>Manejo básico de HTML: </b>https://github.com/Programacion-Avanzada-UTN-FRVM/example-react </p>
        <br/>
        <MyComponent1/>
        <br/>
        <MyComponent2/>
        <br/>
        <MyList1/>
        <br/>
        <MyList2/>
      </div>

      
      <div>
        <h1>Carpeta "useState"</h1>
        <p> <b> Hooks de React - useState: </b> https://github.com/Programacion-Avanzada-UTN-FRVM/example-react-hooks/tree/main/src </p>
        
        <State1/>
        <State1_1/>
        <State2/>
        <Marca/>


      </div>

      <div>
        <h1>Carpeta "useEffect"</h1>
        <p> <b> Hooks de React - useEffect: </b> https://github.com/Programacion-Avanzada-UTN-FRVM/example-react-effect </p>
      
      
      </div>


    </div>
  )    
}

export default App
