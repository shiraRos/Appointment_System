import express from 'express';
import { getProfessionalServices, getProffServiceID, postProfessionalService, updateProfessionalService, getProfessionalServicesById } from '../database/professional_servicesdb.js';

const route = express.Router();

// Route to get all professional services
route.get('/', async (req, res) => {
    try {
        const profServices = await getProfessionalServices();
        res.json(profServices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a professional service by ID
route.get('/profServicesId', async (req, res) => {
    try {
        const { idProfessional, serviceTypeCode } = req.params;
        const profService = await getProffServiceID(idProfessional, serviceTypeCode);
        if (!profService) {
            return res.status(404).json({ message: 'Professional service not found.' });
        }
        res.json(profService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a professional service by ID
route.get('/:profServicesId', async (req, res) => {
    try {
        const { profServicesId } = req.params;
        const profService = await getProfessionalServicesById(profServicesId);
        if (!profService) {
            return res.status(404).json({ message: 'Professional service not found.' });
        }
        res.json(profService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to add a new professional service
route.post('/', async (req, res) => {
    try {
        const { serviceTypeCode, idProfessional, price, duration } = req.body;
        const profService = await postProfessionalService(serviceTypeCode, idProfessional, price, duration);
        res.json({ profService, message: 'Professional service added successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to update a professional service
route.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await updateProfessionalService(id, req.body);
        res.status().json({ message: 'Professional service updated successfully.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default route;
