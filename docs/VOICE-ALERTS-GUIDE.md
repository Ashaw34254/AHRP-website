# AI Voice Alert System Documentation

## Overview

The AHRP CAD now includes an AI-powered text-to-speech (TTS) voice alert system that announces critical CAD events in real-time. Perfect for dispatchers and officers who need audio notifications while multitasking.

## Features

### ✅ Supported Providers
- **Web Speech API** (Free, Built-in) - Works in Chrome, Edge, Safari
- **Google Cloud TTS** (Premium) - High-quality voices, requires API key
- **Azure Cognitive Services** (Premium) - Natural neural voices
- **ElevenLabs** (Premium) - Ultra-realistic AI voices

### ✅ Voice Alert Types
- **New Calls** - Announces high/critical priority calls
- **BOLO Hits** - Alerts when ALPR detects BOLO plates
- **Stolen Vehicles** - Critical alert for stolen vehicle detection
- **Panic Buttons** - Emergency officer assistance alerts
- **Backup Requests** - Officer requests for assistance
- **Unit Assignments** - When units are assigned to calls
- **Priority Upgrades** - When call priority changes
- **Status Changes** - Unit status updates (optional)

### ✅ Smart Features
- **Priority Queue** - Critical alerts interrupt lower priority messages
- **Auto-Detection** - New calls automatically trigger voice alerts
- **Customizable** - Enable/disable specific alert types
- **Adjustable** - Control rate, pitch, volume, and voice
- **Persistent Settings** - Your preferences are saved locally

## Setup Instructions

### Step 1: Enable Voice Alerts

Voice alerts are **enabled by default** with the free Web Speech API.

### Step 2: Configure Settings

Navigate to: **Dashboard → Settings → Voice**

Or access directly at: `/dashboard/settings/voice`

### Step 3: Choose Provider

**For Free Usage (Recommended):**
1. Select "Web Speech API (Free, Built-in)"
2. Choose your preferred language
3. Adjust rate, pitch, and volume
4. Click "Test Voice"

**For Premium Quality:**
1. Select Google/Azure/ElevenLabs
2. Enter your API key
3. Save settings
4. Test voice

### Step 4: Customize Alert Types

Toggle which events trigger voice alerts:
- ✅ New Calls (High/Critical only)
- ✅ BOLO Hits (Always critical)
- ✅ Panic Alerts (Always critical)
- ⬜ Unit Status Changes (Can be noisy)
- ✅ Priority Alerts (High/Critical only)

## Usage

### Voice Control Widget

A floating widget appears in the bottom-right corner:
- 🔊 **Enabled** - Green icon, voice alerts active
- 🔇 **Disabled** - Gray icon, voice alerts muted
- Click to expand for quick controls

### Quick Commands

**In-Game (FiveM):**
```
/togglevoice    - Enable/disable voice alerts
/testvoice      - Test voice with custom message
/clearvoice     - Clear voice queue
```

**Web Dashboard:**
- Use Voice Control Widget for quick toggle
- Access full settings in Settings menu

### Integration with Components

Voice alerts automatically work with:
- **CAD Dispatch Console** - New calls, assignments
- **Active Calls** - Priority changes, status updates
- **Civil Records** - BOLO hits, stolen vehicles
- **Panic Alert Monitor** - Officer emergency alerts
- **BOLO System** - Automatic plate match alerts

## API Keys (Premium Providers)

### Google Cloud TTS
1. Go to https://console.cloud.google.com
2. Enable Text-to-Speech API
3. Create API key
4. Enter in Voice Settings
5. Pricing: ~$4 per 1M characters

### Azure Cognitive Services
1. Go to https://portal.azure.com
2. Create Speech Service resource
3. Copy API key and region
4. Enter in Voice Settings
5. Pricing: First 0.5M characters free

### ElevenLabs
1. Go to https://elevenlabs.io
2. Sign up for account
3. Copy API key from settings
4. Enter in Voice Settings
5. Pricing: Starts at $5/month

## Voice Templates

Pre-configured voice templates for consistency:

### New Call
> "New HIGH priority call. 10-50 Traffic Accident at Main Street and 5th Avenue. Call number 2025-001234."

### BOLO Hit
> "BOLO Alert. License plate ABC123. Blue Toyota Camry. Last seen at Downtown District. Proceed with caution."

### Stolen Vehicle
> "Alert. Stolen vehicle detected. Plate ABC123. Red Honda Civic. Request backup immediately."

### Panic Button
> "Emergency! Officer needs assistance. Unit A-247 activated panic button at Grove Street. All available units respond."

### Unit Assignment
> "Unit A-247, you have been assigned to call 2025-001234."

### Priority Upgrade
> "Attention. Call 2025-001234 upgraded to CRITICAL priority."

## Customization

### Voice Settings
```typescript
{
  provider: 'webspeech', // or 'google', 'azure', 'elevenlabs'
  voice: 'en-US',        // Language/voice ID
  rate: 1.0,             // 0.5 - 2.0 (speech speed)
  pitch: 1.0,            // 0.5 - 2.0 (voice pitch)
  volume: 0.8,           // 0.0 - 1.0 (volume level)
}
```

### Alert Type Filters
```typescript
{
  newCalls: true,          // Announce new calls
  boloHits: true,          // Announce BOLO detections
  panicAlerts: true,       // Announce panic buttons
  unitStatusChanges: false, // Announce status changes (can be noisy)
  priorityAlerts: true,    // Announce high-priority events
}
```

## Programmatic Usage

### Trigger Voice Alert from Code

```typescript
import { useCADVoiceAlerts } from '@/lib/use-voice-alerts';

function MyComponent() {
  const voiceAlerts = useCADVoiceAlerts();
  
  // Announce new call
  voiceAlerts.announceNewCall({
    callNumber: '2025-001234',
    type: '10-50 Traffic Accident',
    priority: 'HIGH',
    location: 'Main St & 5th Ave'
  });
  
  // Announce BOLO hit
  voiceAlerts.announceBOLOHit({
    plate: 'ABC123',
    vehicle: 'Blue Toyota Camry',
    location: 'Downtown'
  });
  
  // Custom message
  voiceAlerts.speak('Custom alert message', 'high');
}
```

### Trigger from Events

```typescript
import { triggerCADEvent } from '@/lib/use-voice-alerts';

// Trigger voice alert via custom event
triggerCADEvent('newCall', {
  callNumber: '2025-001234',
  type: '10-50 Traffic Accident',
  priority: 'HIGH',
  location: 'Main St & 5th Ave'
});
```

## Best Practices

### For Dispatchers
1. **Keep voice enabled** - Don't miss critical alerts
2. **Use headphones** - Better audio quality, more private
3. **Disable status changes** - Reduces alert fatigue
4. **Test before shift** - Ensure voice works properly
5. **Adjust volume** - Balance with radio traffic

### For Officers (In-Game)
1. **Enable for patrol** - Get BOLO alerts while driving
2. **Disable in meetings** - Toggle off when not needed
3. **Use clear plates mode off** - Avoid spam from clean plates
4. **Test at start of shift** - Verify voice is working

### For Administrators
1. **Web Speech API** - Good default for most users
2. **Premium voices** - Consider for critical dispatch centers
3. **Monitor usage** - Premium APIs have usage costs
4. **Train dispatchers** - Show them voice settings

## Troubleshooting

### Voice Not Working

**Check Browser:**
- Chrome/Edge: Full support
- Firefox: Limited voices
- Safari: Good support on Mac

**Check Settings:**
1. Go to Dashboard → Settings → Voice
2. Verify "Enabled" switch is ON
3. Click "Test Voice" button
4. Check browser console for errors

**Check Permissions:**
- Some browsers require HTTPS
- Check browser audio permissions
- Ensure volume is not muted

### Voice Sounds Robotic

**Solution 1: Change Voice**
- Try different voice options in dropdown
- Google/Microsoft voices are higher quality

**Solution 2: Upgrade Provider**
- Switch to Google Cloud TTS
- Or use Azure Neural voices
- ElevenLabs for best quality

### Alerts Too Frequent

**Solution:**
1. Disable "Unit Status Changes"
2. Enable only High/Critical calls
3. Reduce auto-refresh intervals
4. Use priority filters

### API Key Not Working

**Check:**
1. API key is correct (no spaces)
2. API is enabled in cloud console
3. Billing is set up (for paid tiers)
4. Region is correct (Azure only)
5. Check API quota/limits

## Performance

### Browser CPU Usage
- Web Speech API: ~2-5% CPU
- Google TTS: ~3-8% CPU (audio decode)
- Quality vs Performance: Web Speech wins

### Memory Usage
- Negligible (<10MB additional)
- Voice queue limited to 50 items
- Old alerts automatically cleared

### Network Usage
- Web Speech: None (offline)
- Google TTS: ~50KB per alert
- Azure TTS: ~30KB per alert

## Privacy & Security

### Data Handling
- Voice settings stored locally only
- API keys never sent to AHRP servers
- TTS requests go directly to provider
- No voice recordings made

### API Key Security
- Store API keys in browser localStorage
- Keys encrypted in transit (HTTPS)
- Never commit keys to git
- Rotate keys regularly

## Future Enhancements

### Planned Features
- [ ] Voice recognition (voice commands)
- [ ] Custom voice templates
- [ ] Multi-language support
- [ ] Voice recording playback
- [ ] Integration with phone systems
- [ ] Webhook voice notifications
- [ ] Mobile app voice alerts
- [ ] Emergency broadcast system

### Community Requests
- Voice profiles per officer
- Department-specific voices
- Custom audio files
- Radio effects/filters
- Batch announcements

## Support

### Getting Help
- **Discord**: Join AHRP Discord for voice support
- **GitHub**: Report bugs or request features
- **Documentation**: Check this file for answers

### Known Issues
- Safari iOS: Limited voice options
- Firefox: Slower TTS initialization
- Edge: Occasional voice cancellation

### Provider Support
- **Google TTS**: https://cloud.google.com/text-to-speech/docs
- **Azure**: https://docs.microsoft.com/azure/cognitive-services/speech-service/
- **ElevenLabs**: https://elevenlabs.io/docs

---

✅ **Voice System Ready** - Your CAD now speaks! Configure settings and test your alerts.
