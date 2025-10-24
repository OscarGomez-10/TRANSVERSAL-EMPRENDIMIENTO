import cron from 'node-cron';
import {sendRemainders} from "./searchQuotes.js";

cron.schedule('39 00 * * *', // a las 23:24 todos los días
  () => {
    console.log('⏰ CRON EJECUTADO');
    sendRemainders();
  },
   {
  timezone: "America/Bogota"
}
);
