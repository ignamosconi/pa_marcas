function MyList2() {
    const lista = ["Rojo", "Azul", "Amarillo", "Negro", "Verde"]
 
    return (
      <div>
        <hr />
        <p> Lista 2 </p>
        <p> Recorremos la lista con MAP </p>

        {/* 
        En archivos TSX, las llaves indican que se está escribiendo código java script adentro
        de un HTML (por eso ponemos las variables con {usuario}, los comentarios con {//}; y 
        ahora funciones 
        
        En este caso aplicamos la función .map en la variable lista. 

        */}

        { /* 
        lista.map( (color, index)) recorre el array "lista" elemento por elemento, y para cada elemento 
        extrae:
          1. color: Esta variable almacena el dato en sí del elemento que se está revisando actualmente 
          2. index: Esta variable almacena el N° de elemento que se está revisando: 0, 1, 2, etc.

        Los parámetros (color, index) provistos por .map se utilizan como parámetros de entrada para
        la función de flecha, por eso vemos (color,index) => <li> ... </li>. 

        Dentro de la etiqueta li:
          1. key={index}: key es una opción de etiquetas que añade React. Cuando cambiamos su valor a cualquier
          otro, se actualizará solamente esta etiqueta, lo que evita recargar toda la página. Si tenemos muchos
          objetos, generalmente la key para actualizar suele ser la ID del objeto, porque sabemos que van a 
          ser números distintos (recordemos, sólo se actualiza la etiqueta si la key cambia). Aplicamos este
          mismo concepto con el index del array: cada índice será distinto, por lo que va a actualizar 
          la etiqueta para que muestre el siguiente contenido.
          2. Color: para indicar qué texto va a haber dentro de esa lista.
        */ }
        <ul className = "listaPituca">
          {
            lista.map( 
              (color, index) => 
                <li key={index}>
                  {color}
                </li>
            )
          }
        </ul>

    </div>
  )
}

export default MyList2