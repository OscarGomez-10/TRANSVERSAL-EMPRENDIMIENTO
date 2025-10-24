import {Schema, model} from 'mongoose';

const petSchema = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    age: {type: Number, required: true},
    owner: {type: Schema.Types.ObjectId, ref: 'Client', required: true},
    history_quotes: [{type: Schema.Types.ObjectId, ref: 'Quote'}],
}, {timestamps: true});

const Pet = model('Pet', petSchema);

export default Pet;