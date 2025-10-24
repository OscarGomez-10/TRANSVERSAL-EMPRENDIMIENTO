import Quote from "../models/Quote.js";
import Client from "../models/Client.js";

const quoteController = {};

quoteController.createQuote = async (req, res) => { 
    const { client_id, pet_id, service_id, date, total_amount} = req.body;
    console.log(date);
    try{
        const newQuote = new Quote({ client_id, pet_id, service_id, date, total_amount });
        await newQuote.save();
        res.status(201).json({ msg: "Cita creada exitosamente" });    
    }
    catch(error){
        res.status(500).json({ msg: "Ha ocurrido un error en el servidor. Por favor, intenta más tarde."});
    }}

quoteController.getQuotes = async (req, res) => {
    const{client_id}= req.query;
    try {
        let filter={};
        if(client_id){
            filter.client_id=client_id;
        }
        const quotes = await Quote.find(filter).populate('client_id').populate('pet_id').populate('service_id');
        res.status(200).json({msg: quotes});
    } catch (error) {
         res.status(500).json({ msg: "Ha ocurrido un error en el servidor. Por favor, intenta más tarde."});
    }
}    

quoteController.updateQuote = async (req, res) => {
    const { id } = req.params;
    // Aceptar actualización parcial y permitir actualizar 'status'
    const updatableFields = [
        'client_id',
        'pet_id',
        'service_id',
        'date',
        'total_amount',
        'status'
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
        res.status(200).json({ msg: "Cita actualizada exitosamente", updatedQuote });
    } catch (error) {
        res.status(500).json({ msg: "Ha ocurrido un error en el servidor. Por favor, intenta más tarde."});
    }}

quoteController.deleteQuote = async (req, res) => {
    const { id } = req.params;  
    try {
        const deletedQuote = await Quote.findByIdAndDelete({_id:id});
        if (!deletedQuote) {
            return res.status(404).json({ msg: "Cita no encontrada" });
        }
        res.status(200).json({ msg: "Cita eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ msg: "Ha ocurrido un error en el servidor. Por favor, intenta más tarde."});
    }}


export default quoteController;