import { Schema, model } from 'mongoose';

const quoteSchema = new Schema({
    client_id : {type: Schema.Types.ObjectId, ref: 'Client', required: true},
    pet_id : { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
    service_id :[ { type: Schema.Types.ObjectId, ref: 'Service', required: true }],
    date : { type: Date, required: true },
    status : { type: String, enum: ['abierta', 'terminada' , 'anulada'], default: 'abierta' },
    isReminderSent : { type: Boolean, default: false },
    total_amount : { type: Number, required: true }
}, { timestamps: true });

const Quote = model('Quote', quoteSchema);

export default Quote;