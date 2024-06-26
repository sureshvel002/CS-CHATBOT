const express=require('express');
const dotenv=require('dotenv');
const cors=require("cors");

const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: 'PUT CHATGPT APIKEY', //API KEY IN EMAIL ATTACHMENT
});

const app = express();
dotenv.config();
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(cors());

app.get('/',(req,res)=>{
    res.send('chat with personal assistant');
})

app.use(express.json());

app.get('/chat', async (req, res) => {
    const userMessage = req.query.message;
    if (!userMessage) {
        return res.status(400).json({ error: "You must provide a message" });
    }

    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: userMessage }],
            model: "gpt-3.5-turbo",
        });

        const botMessage = chatCompletion.choices[0].message.content;
        res.status(200).json({userMessage, botMessage });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Sorry, I couldn't understand that.");
    }
});

const PORT = process.env.PORT || 4000;
app.listen(4000,()=>{console.log(`server is running on port ${PORT}`)});