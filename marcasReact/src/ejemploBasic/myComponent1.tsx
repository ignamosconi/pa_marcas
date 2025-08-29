import './myComponent1.css'

function MyComponent1() {

    //En esta función no vamos a usar "html puro", sino JSX / TSX, una modificación usada por React.

  return (
    /*Div: Contenedor principal. El return tiene que devolver una sola cosa, por lo que encapsulamos
    todo dentro de un div.

    className="myComponent1": Aplica una clase de css llamada myComponent1 a este div (la importamos arriba)
    */
    <div className="myComponent1">   
      MyComponent1
        
        <p> Párrafo común. </p>               {/* //p: Etiqueta que muestra párrafos -oración continua- */}
        <h2>"Datos de usuaurio" </h2>  {/* h2: Título de nivel 2 */}
        
        <br/>                           {/* br: Enter */}
        
        <p> 
            <b>Usuario:</b>   {/* b: Pone el texto en negrita */}
            Igna Mosconi :)
        </p>
      
        <p> 
            <strong> Rol : </strong>    {/* strong: Otra forma de poner negrita */}
            Estudiante
        </p>
    </div>
  );
}

export default MyComponent1;