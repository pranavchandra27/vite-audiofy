import axios from 'axios';

const api = import.meta.env.VITE_API;

export const synthesizeSpeech = async (text: string, voice: string, speed: number): Promise<string> => {
    try {
        const response = await axios.post(api + '/synthesize', { text, voice, speed }, {
            responseType: 'arraybuffer'
        });
        const audioBlob = new Blob([response.data], { type: 'audio/mp3' });
        return URL.createObjectURL(audioBlob);
    } catch (error) {
        console.error('Error synthesizing speech:', error);
        throw error;
    }
};
