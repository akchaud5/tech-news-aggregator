// server.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/news', async (req, res) => {
    try {
        const response = await axios.get('https://www.theverge.com', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html'
            },
            timeout: 5000
        });
        
        const $ = cheerio.load(response.data);
        let articles = [];
        
        $('h2 a').each((i, elem) => {
            if (i < 5) {
                const $link = $(elem);
                let href = $link.attr('href');
                if (!href) return;

                const url = href.startsWith('http') ? href : new URL(href, 'https://www.theverge.com').toString();
                
                articles.push({
                    title: $link.text().trim(),
                    link: url,
                    source: 'The Verge',
                    summary: 'Read the full article on The Verge'
                });
            }
        });

        res.json(articles);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));