import Quote from "../models/Quote.js";
import Client from "../models/Client.js";
import Service from "../models/Service.js";
import Pet from "../models/Pet.js";
import { SendEmail } from "../utils/sendEmail.util.js";

const quoteController = {};

quoteController.createQuote = async (req, res) => {
  const { client_id, pet_id, service_id, date, total_amount } = req.body;
  const appointmentDate = new Date(date);
  if (Number.isNaN(appointmentDate.getTime())) {
    return res.status(400).json({ msg: "Fecha de cita inválida" });
  }
  try {
    const newQuote = new Quote({
      client_id,
      pet_id,
      service_id,
      date: appointmentDate,
      total_amount,
    });
    await newQuote.save();

    const cliente = await Client.findById(client_id);
    const mascota = await Pet.findById(pet_id);

    const servicio = await Service.find({ _id: { $in: service_id } });
    const texto = servicio.map((s) => s.name).join(", ");

    const fechaLocal = appointmentDate.toLocaleDateString("es-CO", {
      timeZone: "America/Bogota",
    });
    const horaLocal = appointmentDate.toLocaleTimeString("es-CO", {
      timeZone: "America/Bogota",
      hour: "2-digit",
      minute: "2-digit",
    });
    const totalDisplay = total_amount ? `$${total_amount}` : "N/A";

    const customerBody = `
    <!doctype html>
    <html>
      <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="20">
          <tr>
        <td align="center">
          <table role="presentation" width="600" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">
            <tr style="background:#1f8ef1;color:#ffffff;">
              <td style="padding:20px 30px;font-size:20px;font-weight:600;">
            Clínica Veterinaria
              </td>
            </tr>
            <tr>
              <td style="padding:24px 30px;color:#333333;line-height:1.5;">
            <h2 style="margin:0 0 12px 0;font-size:18px;color:#111111;">Hola ${cliente.name},</h2>
            <p style="margin:0 0 16px 0;">Su cita para <strong>${mascota.name}</strong> ha sido creada exitosamente.</p>

            <table role="presentation" width="100%" style="margin:12px 0 18px 0;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;color:#666666;width:120px;">Fecha:</td>
                <td style="padding:8px 0;color:#111111;">${fechaLocal} ${horaLocal}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#666666;">Servicios:</td>
                <td style="padding:8px 0;color:#111111;">${texto}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#666666;">Total:</td>
                <td style="padding:8px 0;color:#111111;">${totalDisplay}</td>
              </tr>
            </table>

            <p style="margin:0 0 18px 0;color:#555555;">Si necesita modificar o cancelar la cita, por favor contáctenos respondiendo este correo o llamando a la clínica.</p>

            <p style="margin:0;color:#333333;font-weight:600;">Saludos,<br/>Clínica Veterinaria</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f0f4f8;padding:12px 30px;font-size:12px;color:#888888;">
            ¿Preguntas? Responda a este correo para contactarnos.
              </td>
            </tr>
          </table>
        </td>
          </tr>
        </table>
      </body>
    </html>`.trim();

    const adminBody = `
    <!doctype html>
    <html>
      <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="20">
          <tr>
        <td align="center">
          <table role="presentation" width="600" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">
            <tr style="background:#2dce89;color:#ffffff;">
              <td style="padding:20px 30px;font-size:18px;font-weight:700;">
            Nueva Cita Registrada
              </td>
            </tr>
            <tr>
              <td style="padding:20px 30px;color:#333333;line-height:1.5;">
            <p style="margin:0 0 12px 0;">Se ha registrado una nueva cita en la agenda:</p>

            <table role="presentation" width="100%" style="margin:12px 0 18px 0;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;color:#666666;width:130px;">Cliente:</td>
                <td style="padding:8px 0;color:#111111;">${cliente.name} (${
      cliente.email || "sin email"
    })</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#666666;">Mascota:</td>
                <td style="padding:8px 0;color:#111111;">${mascota.name}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#666666;">Fecha:</td>
                <td style="padding:8px 0;color:#111111;">${fechaLocal} ${horaLocal}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#666666;">Servicios:</td>
                <td style="padding:8px 0;color:#111111;">${texto}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#666666;">Total:</td>
                <td style="padding:8px 0;color:#111111;">${totalDisplay}</td>
              </tr>
            </table>

            <p style="margin:0;color:#555555;">Revise la agenda para más detalles o gestione la cita desde el panel administrativo.</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f0f4f8;padding:12px 30px;font-size:12px;color:#888888;">
            Notificación automática del sistema.
              </td>
            </tr>
          </table>
        </td>
          </tr>
        </table>
      </body>
    </html>`.trim();

    SendEmail(cliente.email, "Nueva Cita Creada", customerBody);
    SendEmail(
      "oscarr.2343@gmail.com",
      "Se ha registrado una nueva cita",
      adminBody
    );

    res.status(201).json({ msg: "Cita creada exitosamente" });
  } catch (error) {
      console.log(error);
    res.status(500).json({
      msg: "Ha ocurrido un error en el servidor. Por favor, intenta más tarde.",
    });
  }
};

quoteController.getQuotes = async (req, res) => {
  const { client_id } = req.query;
  try {
    let filter = {};
    if (client_id) {
      filter.client_id = client_id;
    }
    const quotes = await Quote.find(filter)
      .populate("client_id")
      .populate("pet_id")
      .populate("service_id");
    res.status(200).json({ msg: quotes });
  } catch (error) {
    res.status(500).json({
      msg: "Ha ocurrido un error en el servidor. Por favor, intenta más tarde.",
    });
  }
};

quoteController.updateQuote = async (req, res) => {
  const { id } = req.params;
  // Aceptar actualización parcial y permitir actualizar 'status'
  const updatableFields = [
    "client_id",
    "pet_id",
    "service_id",
    "date",
    "total_amount",
    "status",
  ];
  const updateData = {};
  for (const key of updatableFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      updateData[key] = req.body[key];
    }
  }

  try {
    const updatedQuote = await Quote.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    if (!updatedQuote) {
      return res.status(404).json({ msg: "Cita no encontrada" });
    }
    res
      .status(200)
      .json({ msg: "Cita actualizada exitosamente", updatedQuote });
  } catch (error) {
    res.status(500).json({
      msg: "Ha ocurrido un error en el servidor. Por favor, intenta más tarde.",
    });
  }
};

quoteController.deleteQuote = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedQuote = await Quote.findByIdAndDelete({ _id: id });
    if (!deletedQuote) {
      return res.status(404).json({ msg: "Cita no encontrada" });
    }
    res.status(200).json({ msg: "Cita eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({
      msg: "Ha ocurrido un error en el servidor. Por favor, intenta más tarde.",
    });
  }
};

export default quoteController;
