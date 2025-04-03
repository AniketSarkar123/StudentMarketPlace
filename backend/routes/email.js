const express = require("express");
const { sendEmail, sendHtmlEmail } = require("../utils/emailService");

const router = express.Router();

// Test plain text email
router.post('/text', async (req, res) => {
    try {
        const result = await sendEmail(
            'arinjoypramanik6@gmail.com', // Replace with your email
            
        );
        res.json({ success: true, messageId: result.messageId });
    } catch (error) {
        console.error('Test email failed:', error);
        res.status(500).json({ error: error.message });
    }
});

// Test HTML email
router.post('/html', async (req, res) => {
    try {
        const htmlContent = `
            <h1>Test HTML Email</h1>
            <p>This is a <strong>formatted</strong> test email.</p>
            <ul>
                <li>Item 1</li>
                <li>Item 2</li>
            </ul>
        `;
        
        const result = await sendHtmlEmail(
            'anirvanchakravarty39@gmail.com', // Replace with your email
            'Test HTML Email',
            htmlContent
        );
        res.json({ success: true, messageId: result.messageId });
    } catch (error) {
        console.error('Test HTML email failed:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;