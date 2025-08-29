import './listaPituca.css'

function MyComponent2() {
    //Definición de variables
    let usuario = "Igna Mosconi"
    let rol = "Estudiante"

    //Definición de objetos
    let usr = {
        nombre: "Igna :)",
        apellido: "Mosconi",
        rol: "Estudiante"
    }

    //Devolvemos un único bloque HTML por componente, por eso lo encapsulamos en una div
    return (
    <div>
        <hr/>                       {/*hr: Pone una línea horizontal */}
        MyComponent2        

        <ul className="listaPituca">        {/* ul: Unsorted list, muestra los elementos de una lista desordenada <li> </li> en este caso */}
            Datos del usuario con 2 VARIABLES
            <li>    {/* li: Muestra el primer elemento de la lista <ul> </ul> */}
                Nombre del usuario:  
                <strong> {usuario} </strong>    
            </li> 

            {/* li: Mostramos el segundo elemento de la lista */}
            <li>    
                Rol: 
                <b> {rol} </b> 
            </li> 

         </ul> 

         <br />

         <ul className="listaPituca">   
            Datos del usuario con OBJETO
            <li> 
                Nombre del usuario:  
                <strong> {usr.nombre + " " + usr.apellido} </strong>    
            </li> 

            <li>    
                Rol: 
                <b> {usr.rol} </b> 
            </li> 

         </ul> 
    </div>
  )
}

export default MyComponent2