import Pet from "../models/Pet.js";

const petController = {};


petController.createPet = async (req, res) => {
    const { name, type, age, owner } = req.body;
    try {
        const newPet = new Pet({ name, type, age, owner });
        await newPet.save();
        res.status(201).json({ msg: "Mascota creada exitosamente" });
    }
    catch (error) {
        res.status(500).json({ msg: "Error al crear la mascota", error });
    }
};

petController.updatePet = async (req, res) => {
    const { id } = req.params;
    const { name, type, age } = req.body;
    try {
        await Pet.findByIdAndUpdate(id, { name, type, age });
        res.status(200).json({ msg: "Mascota actualizada exitosamente" });
    }
    catch (error) {
        res.status(500).json({ msg: "Error al actualizar la mascota", error });
    }
};


petController.getPets = async (req, res) => {
    try {
        const idOwner = req.query.idOwner;
        const name = req.query.name;

        let filtro = {}

        if (idOwner) {
            filtro.owner = idOwner;
        }

        if(name){
            filtro.name = { $regex: name, $options: 'i' };
        }

        const pets = await Pet.find(filtro).populate('owner');

        res.status(200).json(pets);
    }
    catch (error) {
        res.status(500).json({ msg: "Error al obtener las mascotas", error });
    }
};


petController.deletePet = async (req, res) => {
    const { id } = req.params;
    try {
        await Pet.findByIdAndDelete(id);
        res.status(200).json({ msg: "Mascota eliminada exitosamente" });
    }
    catch (error) {
        res.status(500).json({ msg: "Error al eliminar la mascota", error });
    }
}

export default petController;