import express from 'express';
import {
    getType_services,
    getType_serviceById,
    postType_service,
    updateType_service,
    deleteType_service,
    getType_servicesByDomain 
} from '../database/type_servicedb.js';

const route = express.Router();

//פונקציה שמחזירה את כל סוגי התת תחום לפי מזהה תחום
route.get('/type/:type_serviceId', async (req, res) => {
    try {
        const { type_serviceId } = req.params;
        const type_service = await getType_serviceById(type_serviceId);
        if (!type_service) {
            return res.status(404).json({ message: 'type_service not found.' });
        }
        res.json(type_service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// החזרת כל סוגי הטיפול
route.get('/', async (req, res) => {
    try {
        const type_services = await getType_services();
        res.json(type_services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// החזרת סוגי טיפול לפי תחום
route.get('/:domainName', async (req, res) => {
    try {
        const { domainName } = req.params;
        const type_services = await getType_servicesByDomain(domainName);
        res.json(type_services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// הכנסת סוג טיפול חדש
route.post('/', async (req, res) => {
    try {
        const { typeName, domainCode } = req.body;
        const type_service = await postType_service(typeName, domainCode);
        res.json({ type_service, message: 'type_service added successfully' });
    } catch (error) {
        res.status(201).json({ message: error.message });
    }
});

// עדכון סוג טיפול
route.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await updateType_service(id, req.body);
        res.json({ message: 'type_service updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// מחיקת סוג טיפול
route.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await deleteType_service(id);
        res.json({ message: 'type_service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default route;