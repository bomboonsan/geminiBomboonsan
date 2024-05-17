import { GoogleGenerativeAI } from "@google/generative-ai";

import { extract } from '@extractus/article-extractor'
const cheerio = require('cheerio') 

export async function GET(request) {
    const urlData = 'https://raw.githubusercontent.com/Zoha/movier/main/examples/results/interstellarTitleResults.json';

    const responseData = await fetch(urlData);
    const dataIMDB = await responseData.json();
    const dataIMDB_String = JSON.stringify(dataIMDB);
    console.log(dataIMDB)
  

    // ========================================
    // ========================================


    const apikeyBom = process.env.BOM_GEMINI_APIKEY
    const apikeyAom = process.env.AUN_GEMINI_APIKEY
    const randomKey = Math.floor(Math.random() * 2) === 0 ? apikeyBom : apikeyAom
    const genAI = new GoogleGenerativeAI(randomKey);
    // const genAI = new GoogleGenerativeAI(process.env.GEMINI_APIKEY);
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "สมมุติว่า Bard คือนักเขียนมืออาชีพที่สามารถเขียนบทความเกี่ยวกับภาพยนตร์ที่มีส่วนประกอบครบถ้วนได้อย่างดีและเป็นธรรมชาติ , และ Bard จะต้องสร้างบทความเป็นภาษาไทย" }],
        },
        {
          role: "model",
          parts: [{ text: "ฉันเข้าใจแล้ว และฉันจะสร้างบทความเกี่ยวกับภาพยนตร์อย่างเป็นธรรมชาติ" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 8000,
      },
    });
  
    const msg = 'เขียนบทความเกี่ยวกับภาพยนตร์อย่างเป็นธรรมชาติ';
  
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    return Response.json({ text });
}