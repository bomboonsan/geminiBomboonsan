import { GoogleGenerativeAI } from "@google/generative-ai";

import { extract } from '@extractus/article-extractor'
const cheerio = require('cheerio') 

export async function GET(request) {
    const urls = [
        'https://screenrant.com/tarot-box-office-horror-movie-budget-comparison-week-2/'
    ]

    const articles = []
    const contents = []
    const images = []
    for (const url of urls) {
        const article = await extract(url)
        console.log(article)
        
        // Title
        const title = article.title
        const image = article.image

        // Content
        const content_html = article.content
        const $ = cheerio.load(content_html)
        const content = $('body').text()

        articles.push(article)
        contents.push(content)
        images.push(image)
    }

    console.log(contents)

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
          parts: [{ text: "ต้องการเรียบเรียงบทความต่อไปนี้ สมมุติว่า Bard เป็นนักเขียนมืออาชีพสายข่าวภาพยนตร์ที่จะเขียนบทความให้ดูเป็นธรรมชาติที่อ่านแล้วให้รู้สึกว่าเป็นมนุษย์เขียนและตรวจสอบความถูกต้องของข้อมูล หลังจากนี้ฉันจะให้ข้อมูลต้นฉบับที่เป็นข้อมูลดิบ ให้ Bard นำข้อมูลนี้ไปเรียบเรียงใหม่และเขียนให้ได้ผลลัพท์ที่มีรูปแบบดังนี้ = **หัวข้อข่าว** : , **เนื้อหาข่าว** : " }],
        },
        {
          role: "model",
          parts: [{ text: "ฉันเข้าใจแล้ว และฉันจะสร้างบทความนี้ที่มีผลลัพท์ดังนี้ = **หัวข้อข่าว** : , **เนื้อหาข่าว** : " }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 8000,
      },
    });
  
    const msg = "บทความต้นฉบับคือ : " + "\n" + contents.join("\n");
  
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    return Response.json({ text });
}