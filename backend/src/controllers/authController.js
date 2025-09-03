// src/controllers/authController.js
import { supabase } from '../config/supabaseclient.js';

export const signUp = async (req, res) => {
    const { email, password } = req.body; // Role is no longer needed from the client

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    // This signs up the user. The trigger will automatically handle the profile.
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    
    if (!data.user) {
         return res.status(500).json({ error: 'User registration failed, please try again.' });
    }

    // The manual insert is gone! Success!
    res.status(201).json({ user: data.user });
};

export const signIn = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return res.status(401).json({ error: error.message });
    }

    res.status(200).json(data);
};