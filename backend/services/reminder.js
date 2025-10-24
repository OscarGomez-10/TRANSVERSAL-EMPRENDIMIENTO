import cron from 'node-cron';
import {sendRemainders} from "./searchQuotes.js";

cron.schedule('18 10 * * *',
  () => {
    console.log('⏰ CRON EJECUTADO');
    sendRemainders();
  },
  {
  timezone: "America/Bogota"
}
);
