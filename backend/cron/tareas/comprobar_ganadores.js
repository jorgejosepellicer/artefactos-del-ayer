const db = require('../../db'); // Ajusta el path según tu estructura
const { enviarCorreo } = require('../../utils/mailer');

async function comprobarGanadores() {
  try {
    // 1. Finalizar productos cuya fecha ya pasó y aún no están finalizados
    const [productosAFinalizar] = await db.query(`
      SELECT * FROM productos 
      WHERE fecha_fin < NOW() AND finalizado = 0
    `);

    for (const producto of productosAFinalizar) {
      const [pujas] = await db.query(`
        SELECT * FROM pujas 
        WHERE id_producto = ? 
        ORDER BY precio DESC 
        LIMIT 1
      `, [producto.id_producto]);

      const pujaGanadora = pujas[0];

      if (pujaGanadora) {
        await db.query(`
          UPDATE productos 
          SET finalizado = 1, id_usuario_ganador = ? 
          WHERE id_producto = ?
        `, [pujaGanadora.id_usuario, producto.id_producto]);

        // Obtener el email del usuario ganador
        const [usuarios] = await db.query(`
          SELECT email, nombre FROM usuarios WHERE id_usuario = ?
        `, [pujaGanadora.id_usuario]);

        const usuario = usuarios[0];

        if (usuario) {
          const asunto = `¡Felicidades ${usuario.nombre}! Has ganado la subasta de "${producto.nombre}"`;
          const cuerpo = `
            <h3>¡Felicidades, ${usuario.nombre}!</h3>
            <p>Has ganado la subasta del producto <strong>${producto.nombre}</strong> con una puja de <strong>${pujaGanadora.precio} €</strong>.</p>
            <p>Nos pondremos en contacto contigo para los detalles del pago y envío.</p>
            <p>Gracias por participar en Artefactos del Ayer.</p>
          `;

          await enviarCorreo(usuario.email, asunto, cuerpo);
        }
        console.log(`✅ Producto ${producto.nombre} finalizado. Ganador: Usuario ${pujaGanadora.id_usuario}`);
      } else {
        await db.query(`
          UPDATE productos SET finalizado = 1 WHERE id_producto = ?
        `, [producto.id_producto]);

        console.log(`⚠️ Producto ${producto.nombre} finalizado sin pujas.`);
      }
    }

    // 2. Reabrir productos si su fecha de fin fue modificada a futuro
    const [productosAReabrir] = await db.query(`
      SELECT * FROM productos 
      WHERE fecha_fin > NOW() AND finalizado = 1
    `);

    for (const producto of productosAReabrir) {
      await db.query(`
        UPDATE productos 
        SET finalizado = 0, id_usuario_ganador = NULL 
        WHERE id_producto = ?
      `, [producto.id_producto]);

      console.log(`🔁 Producto ${producto.nombre} reabierto. Fecha de fin modificada a futuro.`);
    }

  } catch (err) {
    console.error('❌ Error comprobando ganadores o reabriendo productos:', err);
  }
}

module.exports = { comprobarGanadores };
