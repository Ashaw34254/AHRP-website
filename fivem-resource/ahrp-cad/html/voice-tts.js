/**
 * AHRP CAD - Text-to-Speech Engine
 * 
 * Supports multiple TTS providers:
 * - Web Speech API (built-in browser TTS)
 * - Google Cloud TTS (requires API key)
 * - Azure Cognitive Services (requires API key)
 * - ElevenLabs (requires API key)
 */

class VoiceTTS {
    constructor() {
        this.provider = 'webspeech';
        this.config = {
            voice: 'en-US',
            rate: 1.0,
            pitch: 1.0,
            volume: 0.8,
            apiKey: null
        };
        this.isSpeaking = false;
        this.audioQueue = [];
        
        this.initWebSpeech();
    }
    
    // Initialize Web Speech API
    initWebSpeech() {
        if ('speechSynthesis' in window) {
            this.synth = window.speechSynthesis;
            this.voices = [];
            
            // Load voices
            this.loadVoices();
            
            // Chrome needs this event
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = () => this.loadVoices();
            }
            
            console.log('[Voice TTS] Web Speech API initialized');
        } else {
            console.error('[Voice TTS] Web Speech API not supported');
        }
    }
    
    loadVoices() {
        this.voices = this.synth.getVoices();
        console.log(`[Voice TTS] Loaded ${this.voices.length} voices`);
    }
    
    // Initialize TTS system with config
    init(config) {
        this.config = { ...this.config, ...config };
        this.provider = config.provider || 'webspeech';
        
        console.log(`[Voice TTS] Initialized with provider: ${this.provider}`);
    }
    
    // Speak text
    async speak(text, priority = 'normal') {
        if (this.provider === 'webspeech') {
            this.speakWebSpeech(text, priority);
        } else if (this.provider === 'google') {
            await this.speakGoogle(text);
        } else if (this.provider === 'azure') {
            await this.speakAzure(text);
        } else if (this.provider === 'elevenlabs') {
            await this.speakElevenLabs(text);
        }
    }
    
    // Web Speech API (built-in browser TTS)
    speakWebSpeech(text, priority) {
        if (!this.synth) {
            console.error('[Voice TTS] Speech synthesis not available');
            return;
        }
        
        // Cancel current speech if critical priority
        if (priority === 'critical' && this.synth.speaking) {
            this.synth.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Find appropriate voice
        const voice = this.voices.find(v => 
            v.lang.startsWith(this.config.voice) || 
            v.name.includes('Google') ||
            v.name.includes('Microsoft')
        ) || this.voices[0];
        
        if (voice) {
            utterance.voice = voice;
        }
        
        utterance.rate = this.config.rate;
        utterance.pitch = this.config.pitch;
        utterance.volume = this.config.volume;
        
        // Event handlers
        utterance.onstart = () => {
            this.isSpeaking = true;
            console.log('[Voice TTS] Started speaking:', text);
        };
        
        utterance.onend = () => {
            this.isSpeaking = false;
            console.log('[Voice TTS] Finished speaking');
            this.notifyGameEnd();
        };
        
        utterance.onerror = (event) => {
            console.error('[Voice TTS] Error:', event);
            this.isSpeaking = false;
            this.notifyGameEnd();
        };
        
        // Speak
        this.synth.speak(utterance);
    }
    
    // Google Cloud TTS
    async speakGoogle(text) {
        if (!this.config.apiKey) {
            console.error('[Voice TTS] Google TTS requires API key');
            return;
        }
        
        try {
            const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize?key=' + this.config.apiKey, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input: { text },
                    voice: {
                        languageCode: 'en-US',
                        name: this.config.voice || 'en-US-Standard-A',
                        ssmlGender: 'NEUTRAL'
                    },
                    audioConfig: {
                        audioEncoding: 'MP3',
                        speakingRate: this.config.rate,
                        pitch: this.config.pitch,
                        volumeGainDb: 0
                    }
                })
            });
            
            const data = await response.json();
            
            if (data.audioContent) {
                this.playAudioBase64(data.audioContent);
            }
        } catch (error) {
            console.error('[Voice TTS] Google TTS error:', error);
            this.notifyGameEnd();
        }
    }
    
    // Azure Cognitive Services TTS
    async speakAzure(text) {
        if (!this.config.apiKey || !this.config.azureRegion) {
            console.error('[Voice TTS] Azure TTS requires API key and region');
            return;
        }
        
        try {
            const response = await fetch(`https://${this.config.azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`, {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': this.config.apiKey,
                    'Content-Type': 'application/ssml+xml',
                    'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
                },
                body: `<speak version='1.0' xml:lang='en-US'>
                    <voice name='${this.config.voice || 'en-US-JennyNeural'}'>
                        ${text}
                    </voice>
                </speak>`
            });
            
            const audioBlob = await response.blob();
            this.playAudioBlob(audioBlob);
        } catch (error) {
            console.error('[Voice TTS] Azure TTS error:', error);
            this.notifyGameEnd();
        }
    }
    
    // ElevenLabs TTS (high quality)
    async speakElevenLabs(text) {
        if (!this.config.apiKey) {
            console.error('[Voice TTS] ElevenLabs requires API key');
            return;
        }
        
        const voiceId = this.config.voice || '21m00Tcm4TlvDq8ikWAM'; // Default voice
        
        try {
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                method: 'POST',
                headers: {
                    'xi-api-key': this.config.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_monolingual_v1',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75
                    }
                })
            });
            
            const audioBlob = await response.blob();
            this.playAudioBlob(audioBlob);
        } catch (error) {
            console.error('[Voice TTS] ElevenLabs error:', error);
            this.notifyGameEnd();
        }
    }
    
    // Play audio from base64
    playAudioBase64(base64Audio) {
        const audio = new Audio('data:audio/mp3;base64,' + base64Audio);
        audio.volume = this.config.volume;
        
        audio.onended = () => {
            this.isSpeaking = false;
            this.notifyGameEnd();
        };
        
        audio.onerror = (error) => {
            console.error('[Voice TTS] Audio playback error:', error);
            this.isSpeaking = false;
            this.notifyGameEnd();
        };
        
        this.isSpeaking = true;
        audio.play();
    }
    
    // Play audio from blob
    playAudioBlob(blob) {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.volume = this.config.volume;
        
        audio.onended = () => {
            URL.revokeObjectURL(url);
            this.isSpeaking = false;
            this.notifyGameEnd();
        };
        
        audio.onerror = (error) => {
            console.error('[Voice TTS] Audio playback error:', error);
            URL.revokeObjectURL(url);
            this.isSpeaking = false;
            this.notifyGameEnd();
        };
        
        this.isSpeaking = true;
        audio.play();
    }
    
    // Stop speaking
    stop() {
        if (this.provider === 'webspeech' && this.synth) {
            this.synth.cancel();
        }
        this.isSpeaking = false;
    }
    
    // Notify game that speech ended
    notifyGameEnd() {
        fetch(`https://${GetParentResourceName()}/onSpeechEnd`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    }
}

// Global instance
const voiceTTS = new VoiceTTS();

// Message handler
window.addEventListener('message', (event) => {
    const data = event.data;
    
    if (data.type === 'initVoiceSystem') {
        voiceTTS.init(data.config);
    } else if (data.type === 'speakText') {
        voiceTTS.speak(data.text, data.priority);
    } else if (data.type === 'stopSpeaking') {
        voiceTTS.stop();
    }
});

console.log('[Voice TTS] System loaded');
