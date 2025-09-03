// src/controllers/complaintController.js
import { supabase } from '../config/supabaseClient.js';
import { analyzeComplaint } from '../services/analysisService.js';

export const getAllComplaints = async (req, res) => {
    const { data, error } = await supabase.from('complaints').select('*');
    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(200).json(data);
    }
};

export const submitComplaint = async (req, res) => {
    const { complaint, postcode } = req.body;
    const user_id = req.user.id;

    if (!complaint || typeof postcode !== 'number') {
        return res.status(400).json({ error: 'complaint (string) and postcode (number) are required.' });
    }

    console.log('Sending complaint to AI for urgency analysis...');
    const analysis = await analyzeComplaint(complaint, postcode);

    const { data, error } = await supabase
        .from('complaints')
        .insert([{ 
            complaint, 
            postcode, 
            user_id,
            urgency: analysis.urgency
        }]) 
        .select();

    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(201).json(data);
    }
};