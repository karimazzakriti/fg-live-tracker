export default async function handler(req, res) {
    // Simple analytics endpoint
    // For now, just return a basic response
    // You can enhance this later with actual data retrieval
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    res.status(200).json({
        message: "Analytics endpoint ready",
        note: "Connect Google Sheets to see real data"
    });
}
