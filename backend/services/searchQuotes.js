import Quote from '../models/Quote.js';
import { sendEmail } from '../middlewares/sendEmail.js';

import moment from "moment-timezone";

const searchQuotesForReminders = async () => {
  try {
    const timezone = "America/Bogota";

    const startOfTomorrow = moment().tz(timezone).add(1, "day").startOf("day").toDate();
    const endOfTomorrow = moment().tz(timezone).add(1, "day").endOf("day").toDate();

    console.log("🔎 Buscando citas (Bogotá):", startOfTomorrow, endOfTomorrow);

    const quotes = await Quote.find({
      date: { $gte: startOfTomorrow, $lt: endOfTomorrow },
      $or: [{ isReminderSent: false }, { isReminderSent: { $exists: false } }]
    })
      .populate("client_id")
      .populate("pet_id");

    console.log(`📅 ${quotes.length} citas para enviar recordatorios.`);
    return quotes;
  } catch (error) {
    console.error("❌ Error searching quotes for reminders:", error);
    throw error;
  }
};


const sendRemainders = async () => {
    const quotes = await searchQuotesForReminders();
    console.log(`se encontraron ${quotes.length} citas para enviar recordatorios.`);
    if(quotes.length === 0) return;
    console.log(quotes);
    
    for (const quote of quotes) {
        const fechaLocal = quote.date.toLocaleDateString('es-CO', { timeZone: 'America/Bogota' });
        const horaLocal = quote.date.toLocaleTimeString('es-CO', { timeZone: 'America/Bogota' });

    const mensaje = `<div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0; display: flex; justify-content: center;">
  <div style="background: #ffffff; width: 100%; max-width: 600px; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); overflow: hidden;">

    <!-- Encabezado -->
    <div style="background: linear-gradient(90deg, #4f46e5, #06b6d4); color: #fff; padding: 20px; text-align: center;">
      <h2 style="margin: 0; font-size: 22px;">Recordatorio de Cita</h2>
      <p style="margin: 4px 0 0 0; font-size: 14px;">VetTime</p>
    </div>

    <!-- Contenido principal -->
    <div style="padding: 24px; color: #1e293b; font-size: 15px;">
      <p style="margin: 0 0 12px 0;">Hola <strong>${quote.client_id.name}</strong>,</p>
      <p style="margin: 0 0 12px 0;">
        Este es un recordatorio de su cita programada para su mascota <strong>${quote.pet_id.name}</strong>.
      </p>

      <!-- Tarjeta de información -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 16px 0;">
        <p style="margin: 0 0 6px 0;"><strong>🐾 Mascota:</strong> ${quote.pet_id.name}</p>
        <p style="margin: 0 0 6px 0;"><strong>📅 Fecha:</strong> ${fechaLocal}</p>
        <p style="margin: 0 0 6px 0;"><strong>⏰ Hora:</strong> ${horaLocal}</p>
        <p style="margin: 0;"><strong>📍 Lugar:</strong> San Gil, Calle 10 # 5-20</p>
      </div>

      <!-- Notas -->
      <p style="margin-top: 24px; font-size: 14px; color: #475569;">
        Si necesita modificar su cita o tiene alguna pregunta, puede contactarnos al <strong>123456789</strong>.
      </p>
    </div>

  </div>
</div>`;
        await Quote.findByIdAndUpdate(quote._id, { isReminderSent: true });
        sendEmail(
            quote.client_id.email,
            'Recordatorio de cita',
            mensaje
        );
    }
}

export {sendRemainders}