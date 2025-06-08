const cron = require('node-cron');
const { comprobarGanadores } = require('./tareas/comprobar_ganadores.js'); // lógica separada si prefieres modularizar
// Ejecuta cada minuto
cron.schedule('* * * * *', () => {
  console.log('⏰ Ejecutando tarea programada: comprobar ganadores de subastas');
  comprobarGanadores();
});
