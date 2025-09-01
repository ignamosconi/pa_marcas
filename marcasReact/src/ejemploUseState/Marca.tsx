import { useState } from "react";
import type { IMarcaFront } from "./interfaces/IMarcaFront";

function Marca() {

  /*
    Antes en useState pasábamos un número "0", que indicaba el estado inicial del contador "marca". 
    Con este código, estamos diciendo que "MARCA" es un objeto con marca.nombre (una string) y 
    marca.descripcion (también una string), que usaremos para GUARDAR LOS DATOS DEL FORMULARIO.

    Para no "harcodear", usamos INTERFACES interfaces para definir las cosas que recibimos/enviamos del back

    De esta forma, en useState definimos el objeto "marca", que respeta la interfaz IMarcaFront (donde 
    definimos los datos que recibimos del back), por lo que tendrá los atributos "nombre" y "descripcion"
  */
  const [marca, setMarca] = useState<IMarcaFront>({
    nombre: "",
    descripcion: "",
  });



  /*
    manejarCambio
    Esta función se llama cada vez que se detecta un cambio en <input> o en <textarea>.

    evento: 
    Cuando en un <input> o en un <textarea> se activa un "onChange={manejarCambio}", React ejecuta esta
    función enviando automáticamente  el parámetro "evento", el cual indica lo que acaba de ocurrir.
      • evento para <input>: React.ChangeEvent<HTMLInputElement>
      • evento para <textarea>: React.ChangeEvent<HTMLTextAreaElement>
    
    → Ejemplo: En el input HTML tenemos la siguiente información:
      <input type="text" id="nombre" name="nombre" value={marca.nombre} onChange={manejarCambio}/>
    Cuando el usuario escriba algo, React ejecuta la función manejarCambio, pasando automáticamente el 
    parámetro "evento"; que contiene toda la información del input que cambió.
      • evento.target.name → Nombre de la etiqueta que cambió. Lo usamos para identificar campo modificado.
      • evento.target.value → Releva el valor actual escrito en el campo.

    Esta estructura nos permite que una sola función manejarCambio sirva para actualizar múltiples campos 
    del formulario.
   */
  const manejarCambio = (evento: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Sabemos que ocurrió un cambio, pero no donde. Desestructuramos entonces el nombre y valor del 
    // elemento que cambió.
    const { name, value } = evento.target;

    /* En la línea 16 creamos un objeto "marca". Si ejecutamos setMarca directamente, nos va a pedir que
    le pasemos un objeto marca completo, por ejemplo setMarca(nombre: "yes", descripcion: "yes²").

    Si el usuario sólo escribe en el input nombre, queremos actualizar sólo esta porción del objeto. 
    Podemos hacerlo con ifs, pero claramente esto no es escalable:
        if (name === "nombre") {                    //Name y value fueron desestructurados en la línea 46.
          setMarca({ ...marca, nombre: value });
        } else if (name === "descripcion") {
          setMarca({ ...marca, descripcion: value });
        }
    La solución es entonces usar ... (spread, ver la función siguiente)
    */ 
    
    // (...) es el operador Spread. Hace que marcaAnterior tome el valor anterior de marca. React sabe que 
    // setMarca (la función que estamos usando) está asociada al objeto marca, por eso spread sabe cuál 
    // es el "estado anterior" sin que se lo especifiquemos.

    //[name]: value → En el HTML hacemos que name corresponda con el de la interfaz, lo que nos permite
    //actualizar el valor sólamente del atributo que se haya modificado en el front; actualizando el valor
    //anterior que capturó ...marcaAnterior
    setMarca((marcaAnterior) => ({
      ...marcaAnterior,
      [name]: value,    
    }));
  };


  /*
    manejarEnvio:
    Esta función se ejecuta cuando se envía un formulario, como se especifica en la etiqueta
    <form onSubmit={manejarEnvio}>
  */
  const manejarEnvio = (evento: React.FormEvent<HTMLFormElement>) => {
    //HTML, por defecto, recarga la página después de enviar un formulario. Con esto lo evitamos.
    evento.preventDefault(); 

    //Enviamos un mensaje. Eventualmente vamos a hacer un POST.
    alert(
      `Marca registrada exitosamente: \n •Nombre: ${marca.nombre} \n •Descripción: ${marca.descripcion}`
    );
  };

  return (
    <div>
      
      <hr/>
      <br/>
      <h2>Registro de Marca</h2>

      {/* Creamos el formulario */}
      <form onSubmit={manejarEnvio}>

        <div>
          {/* Si hacemos <label> en lugar de <p> es mejor para la accesibilidad al llenar campos. */}
          <label htmlFor="nombre">Nombre de la marca: </label>
          <input
            maxLength={32}
            type="text"
            id="nombre"
            name="nombre" // Usamos los mismos nombres de la interfaz para identificar el campo, esto lo utilizara el metodo manejarCambio despues.
            value={marca.nombre} // Usa por defecto el valor del estado, y se actualiza con el metodo manejarCambio.
            onChange={manejarCambio}
          />
        </div>

        <div>
          <label htmlFor="descripcion">Descripción: </label>
          <textarea
            maxLength={256}
            rows={2}
            cols={31}
            id="descripcion"
            name="descripcion" // Usamos el name para identificar el campo, esto lo utilizara el metodo manejarCambio despues.
            value={marca.descripcion} // Usa por defecto el valor del estado, y se actualiza con el metodo manejarCambio.
            onChange={manejarCambio}
          />
        </div>
        
        {/* Este botón va a habilitar el onSubmit={manejarEnvio} que definimos al principio*/}
        <button type="submit">Registrar Marca</button> 
      </form>

      <br/>

      <h3>Datos de la marca</h3>
      <p>
        <strong>Nombre:</strong> {marca.nombre}
      </p>
      <p>
        <strong>Observaciones:</strong> {marca.descripcion}
      </p>
      <hr />
    </div>
  );
}

export default Marca;