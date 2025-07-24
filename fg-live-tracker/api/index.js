export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Extract tracking data
        const trackingData = {
            timestamp: new Date().toISOString(),
            ip: req.headers['x-forwarded-for']?.split(',')[0] || 'unknown',
            userAgent: req.headers['user-agent'] || 'unknown',
            referrer: req.headers.referer || 'direct',
            utmSource: req.query.utm_source || null,
            utmCampaign: req.query.utm_campaign || null,
            utmMedium: req.query.utm_medium || null,
            country: req.headers['x-vercel-ip-country'] || null,
        };

        // Log to Google Sheets (async, don't wait)
        if (process.env.GOOGLE_SHEETS_URL) {
            logToGoogleSheets(trackingData).catch(console.error);
        }

        // Set redirect headers
        res.setHeader('Location', 'https://shaw-theatre.com/whats-on/freshly-grounded-episode-400-live-show');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.status(302).end();

    } catch (error) {
        console.error('Tracking error:', error);
        // Always redirect even if tracking fails
        res.setHeader('Location', 'https://shaw-theatre.com/whats-on/freshly-grounded-episode-400-live-show');
        res.status(302).end();
    }
}

// Simple Google Sheets logging
async function logToGoogleSheets(data) {
    try {
        const response = await fetch(process.env.GOOGLE_SHEETS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([
                data.timestamp,
                data.ip,
                data.referrer,
                data.utmSource || '',
                data.utmCampaign || '',
                data.country || ''
            ])
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Failed to log to Google Sheets:', error);
    }
}
