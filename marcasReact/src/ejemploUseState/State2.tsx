import { useState } from "react";

function State2() {
  
  /*
    Seguimos teniendo un useState tradicional, pero ahora un """"switch"""" controla qué hacer con él.
  */

  // Iniciamos el estado con 0
  const [contador, setContador] = useState(0); 

  //Según la cadena que recibimos, hacemos distintas acciones.
  const manejarClick = (accion: string) => {
    switch(accion) {
      
      case "incrementar":
        setContador(contador+1)
        break;

      case "reiniciar":
        setContador(0)
        break;
    }
  };

  return (
    <div className="container">
      <hr/>
      <h2>State 2</h2>
      <p className="socotroco"> <b> El contador está en</b>: {contador}</p>
      <button className="button" onClick={() => manejarClick("incrementar")}>Incrementar</button>
      <button className="button" onClick={() => manejarClick("reiniciar")}>Reiniciar</button>
    </div>
  );
}

export default State2;