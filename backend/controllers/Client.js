import Client from '../models/Client.js';
const clientController = {};


clientController.createClient = async (req, res) => {
    const { name, email, phone, address, password} = req.body;
    try {
        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            return res.status(400).json({ msg: "El correo ya esta registrado" });
        }

        const newClient = new Client({ name, email, phone, address, password });
        await newClient.save();
        res.status(201).json({ msg: "Cliente creado exitosamente" });
    } catch (error) {
        res.status(500).json({ msg: "Ha ocurrido un error en el servidor. Por favor, intenta más tarde." });
    }
}; 

clientController.loginClient = async (req, res) => {
    const { email, password } = req.body;
    try {
        const client = await Client.findOne({ email });
        if (!client) {
            return res.status(400).json({ msg: "Cliente no encontrado" });
        }
        if (client.password !== password) {
            return res.status(400).json({ msg: "Contraseña incorrecta" });
        }
        res.status(200).json({ msg: "Inicio de sesión exitoso", client });
    } catch (error) {
        res.status(500).json({ msg: "Ha ocurrido un error en el servidor. Por favor, intenta más tarde." });
    }
}

clientController.getClients = async (req, res) => {
    try {
        const name = req.query.name;
        let filtro = {};
        if (name) {
            filtro.name = { $regex: name, $options: 'i' }; // Búsqueda insensible a mayúsculas/minúsculas
        }

        const clients = await Client.find(filtro);

        res.status(200).json(clients);
    }
    catch (error) {
        res.status(500).json({ msg: "Ha ocurrido un error en el servidor. Por favor, intenta más tarde." });
    }
};

clientController.updateClient = async (req, res) => {
    const clientId = req.params.id;
    const { name, email, phone, address, password } = req.body;
    try {
        const updatedClient = await Client.findByIdAndUpdate(
            clientId,
            { name, email, phone, address, password },
            { new: true }
        );
        if (!updatedClient) {
            return res.status(404).json({ msg: "Cliente no encontrado" });
        }

        res.status(200).json({ msg: "Cliente actualizado exitosamente", updatedClient });
    } catch (error) {
        res.status(500).json({ msg: "Ha ocurrido un error en el servidor. Por favor, intenta más tarde." });
    }
};

clientController.deleteClient = async (req, res) => {
    const clientId = req.params.id;
    try {
        const deletedClient = await Client.findByIdAndDelete(clientId);

        if (!deletedClient) {
            return res.status(404).json({ msg: "Cliente no encontrado" });
        }
        res.status(200).json({ msg: "Cliente eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ msg: "Ha ocurrido un error en el servidor. Por favor, intenta más tarde." });
    }
};



export default clientController;