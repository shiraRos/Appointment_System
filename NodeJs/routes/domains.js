
import express from 'express';
import {
    getDomains,
    getDomain,
    postDomain,
    updateDomain,
    getDomainNames 
} from '../database/domainsdb.js';

const route = express.Router();

// החזרת כל התחומים
route.get('/', async (req, res) => {
    try {
        const domains = await getDomains();
        res.json(domains);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// החזרת שמות התחומים בלבד
route.get('/names', async (req, res) => {
    try {
        const domainNames = await getDomainNames();
        res.json(domainNames);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// החזרת תחום לפי מספר זהות
route.get('/:domainId', async (req, res) => {
    try {
        const { domainId } = req.params;
        const domain = await getDomain(domainId);
        if (!domain) {
            return res.status(404).json({ message: 'Domain not found.' });
        }
        res.json(domain);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// הוספת תחום חדש
route.post('/', async (req, res) => {
    try {
        const { domainName } = req.body;
        const domain = await postDomain(domainName);
        res.json({ domain, message: 'Domain added successfully' });
    } catch (error) {
        res.status(201).json({ message: error.message });
    }
});

// עדכון תחום
route.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await updateDomain(id, req.body);
        res.json({ message: 'Domain updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


export default route;