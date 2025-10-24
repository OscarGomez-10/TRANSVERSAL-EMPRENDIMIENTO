import User from '../models/User.js';

const UserController = {}

UserController.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ msg: 'Usuario registrado exitosamente', user: newUser });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
}


UserController.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }
        if (user.password !== password) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }
        
        res.status(200).json({ msg: 'Inicio Existoso, ¡Bienvenido!', user });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
}






export default UserController;