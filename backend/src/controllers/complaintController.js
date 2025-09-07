// Mark complaint as cleared
export const markComplaintCleared = async (req, res) => {
    const complaintId = req.params.id;
    if (!complaintId) {
        return res.status(400).json({ error: 'Complaint ID is required.' });
    }
    const { data, error } = await supabase
        .from('complaints')
        .update({ cleared: true })
        .eq('id', complaintId)
        .select();
    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(200).json(data);
    }
};
// Get complaints for the authenticated user
export const getUserComplaints = async (req, res) => {
    const user_id = req.user.id;
    if (!user_id) {
        return res.status(401).json({ error: 'Unauthorized: user not found in token.' });
    }
    const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', user_id);
    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(200).json(data);
    }
};
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
    const { description, postcode } = req.body;
    const user_id = req.user.id;

    if (!description || typeof postcode !== 'number') {
        return res.status(400).json({ error: 'description (string) and postcode (number) are required.' });
    }

    console.log('Sending complaint to AI for urgency analysis...');
    const analysis = await analyzeComplaint(description, postcode);

    const { data, error } = await supabase
        .from('complaints')
        .insert([{ 
            description, 
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