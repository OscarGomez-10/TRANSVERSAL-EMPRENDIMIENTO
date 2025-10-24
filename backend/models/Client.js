import {Schema, model} from 'mongoose';

const clientSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    address: {type: String, required: true},
    password: {type: String, required: true},
    
}, {timestamps: true});


const Client = model('Client', clientSchema);

export default Client;