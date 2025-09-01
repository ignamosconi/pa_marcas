import { useState } from "react";

function Marca() {
  // Estado para la marca, que es un objeto con nombre y observaciones
  const [marca, setMarca] = useState({
    denominacion: "",
    observaciones: "",
  });

  /**
   * Asigna valores a las propiedades del objeto Marca ante un cambio de un elemento del formulario.
   *
   * @param {import("react").ChangeEvent} evento Propiedad que contiene la informacion del evento y su elemento.
   *
   * @return {void}
   */
  const manejarCambio = (evento) => {
    // Destructurar nombre y valor del elemento que cambio.
    // Para aprender sobre la destructuracion en Javascript @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    const { name, value } = evento.target;

    // Actualiza solo la propiedad que cambia (nombre u observaciones), el resto lo deja igual (...)
    // Para aprender sobre el operador spread @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    setMarca((prevMarca) => ({
      ...prevMarca,
      [name]: value,
    }));
  };

  /**
   * Captura y ejecuta las acciones cuando se envia el formulario.
   *
   * @param {SubmitEvent} evento Evento de `submit` del formulario (envio).
   *
   * @return {void}
   */
  const manejarEnvio = (evento) => {
    evento.preventDefault();

    alert(
      `Marca registrada: \nNombre: ${marca.denominacion}\nObservaciones: ${marca.observaciones}`
    );
  };

  return (
    <div className="container">
      <hr/>
      <br/>
      <h2>Registro de Marca</h2>
      <form onSubmit={manejarEnvio}>
        <div>
          <label htmlFor="denominacion">Nombre de la marca:</label>
          <input
            type="text"
            id="denominacion"
            name="denominacion" // Usamos el name para identificar el campo, esto lo utilizara el metodo manejarCambio despues.
            value={marca.denominacion} // Usa por defecto el valor del estado, y se actualiza con el metodo manejarCambio.
            onChange={manejarCambio}
          />
        </div>
        <div>
          <label htmlFor="observaciones">Observaciones:</label>
          <textarea
            id="observaciones"
            name="observaciones" // Usamos el name para identificar el campo, esto lo utilizara el metodo manejarCambio despues.
            value={marca.observaciones} // Usa por defecto el valor del estado, y se actualiza con el metodo manejarCambio.
            onChange={manejarCambio}
          />
        </div>
        <br></br>
        <button type="submit">Registrar Marca</button>
      </form>
      <br></br>
      <h3>Datos de la marca</h3>
      <p>
        <strong>Nombre:</strong> {marca.denominacion}
      </p>
      <p>
        <strong>Observaciones:</strong> {marca.observaciones}
      </p>
    </div>
  );
}

export default Marca;