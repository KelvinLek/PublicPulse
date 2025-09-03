import { supabase } from '../config/supabaseClient.js';

// Get all complaint records
export const getAllComplaints = async (req, res) => {
    const { data, error } = await supabase
        .from('complaints')
        .select('*');

    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(200).json(data);
    }
};

// Submit a new complaint
export const submitComplaint = async (req, res) => {
    const { complaint, postcode } = req.body;
    const user_id = req.user.id; 

    if (!complaint || typeof postcode !== 'number') {
        return res.status(400).json({ error: 'complaint (string) and postcode (number) are required.' });
    }

    const { data, error } = await supabase
        .from('complaints')
        .insert([{ complaint, postcode, user_id }]) 
        .select();

    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(201).json(data);
    }
};