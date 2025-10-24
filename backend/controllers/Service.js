import Service from "../models/Service.js";

const serviceController = {};

serviceController.createService = async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const newService = new Service({ name, description, price });
        await newService.save();
        res.status(201).json({ msg: "Servicio creado exitosamente" });
    } catch (error) {
        res.status(500).json({ msg: "Error al crear el servicio", error });
    }
}

serviceController.updateService = async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    try {
        const updatedService = await Service.findByIdAndUpdate(
            { _id: id },
            { name, description, price }
        );
    
        res.status(200).json({ msg: "Servicio actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar el servicio", error });
    }
}

serviceController.getServices = async (req, res) => {
    try {
        const name = req.query.name;
        let filtro = {};

        if (name) {
            filtro.name = { $regex: name, $options: 'i' };
        }
        
        const services = await Service.find(filtro);
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los servicios", error });
    }
}

serviceController.deleteService = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedService = await Service.findByIdAndDelete({ _id: id });
        res.status(200).json({ msg: "Servicio eliminado exitosamente" });
    }
    catch (error) {
        res.status(500).json({ msg: "Error al eliminar el servicio", error });
    }
}


export default serviceController;
