// src/controllers/authController.js
import { supabase } from '../config/supabaseclient.js';

export const signUp = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    if (!data.user) {
        return res.status(500).json({ error: 'User registration failed, please try again.' });
    }

        // Fetch profile from public.profiles
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('id, role')
                        .eq('id', data.user.id)
                        .single();

        console.log('SIGNUP: profile query result:', profile);
        if (profileError) {
                console.error('SIGNUP: profile query error:', profileError);
                return res.status(201).json({ user: data.user }); // fallback: no profile
        }

        res.status(201).json({ user: { ...data.user, ...profile } });
};

export const signIn = async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required.' });
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
                return res.status(401).json({ error: error.message });
        }

            // Fetch profile from public.profiles
            const userId = data.user?.id || data.session?.user?.uid;
            let profile = null;
            if (userId) {
                                        const { data: profileData, error: profileError } = await supabase
                                            .from('profiles')
                                            .select('id, role')
                                            .eq('id', userId)
                                            .single();
                console.log('SIGNIN: profile query result:', profileData);
                if (profileError) {
                    console.error('SIGNIN: profile query error:', profileError);
                }
                if (!profileError) profile = profileData;
            }

            res.status(200).json({ ...data, user: { ...(data.user || data.session?.user || {}), ...profile } });
};