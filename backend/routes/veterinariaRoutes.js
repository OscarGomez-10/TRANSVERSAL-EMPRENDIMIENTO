import { Router } from "express";
import UserController from "../controllers/User.js";
import clientController from "../controllers/Client.js";
import PetController from "../controllers/Pet.js";
import quoteController from "../controllers/Quote.js";

import ServiceController from "../controllers/Service.js";
const router = Router();


router.post("/User/register", UserController.register);
router.post("/User/login", UserController.login);


router.post("/Client/register", clientController.createClient);
router.post("/Client/login", clientController.loginClient);
router.get("/Client/list", clientController.getClients);
router.put("/Client/update/:id", clientController.updateClient);
router.delete("/Client/delete/:id", clientController.deleteClient);


router.post("/Pet/register", PetController.createPet);
router.get("/Pet/list", PetController.getPets);
router.put("/Pet/update/:id", PetController.updatePet);
router.delete("/Pet/delete/:id", PetController.deletePet);

router.post("/Quote/register", quoteController.createQuote);
router.get("/Quote/list", quoteController.getQuotes);
router.put("/Quote/update/:id", quoteController.updateQuote);
router.delete("/Quote/delete/:id", quoteController.deleteQuote);

router.post("/Service/register", ServiceController.createService);
router.get("/Service/list", ServiceController.getServices);
router.put("/Service/update/:id", ServiceController.updateService);
router.delete("/Service/delete/:id", ServiceController.deleteService);




export default router;
