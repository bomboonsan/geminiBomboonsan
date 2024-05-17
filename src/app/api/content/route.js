import { GoogleGenerativeAI } from "@google/generative-ai";
import { extract } from '@extractus/article-extractor'
const cheerio = require('cheerio') 
export async function POST(request) {
    // body = request.body
    const body = await request.json()
    const { urls } = body
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

    // ------------- GEMINIAI -------------
    const apikeyBom = process.env.BOM_GEMINI_APIKEY
    const apikeyAom = process.env.AUN_GEMINI_APIKEY
    const randomKey = Math.floor(Math.random() * 2) === 0 ? apikeyBom : apikeyAom
    const genAI = new GoogleGenerativeAI(randomKey);
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    // Load a system prompt
    // const sysPrompt = "ถอดคำและสรุปข่าวนี้ใหม่เป็นภาษาไทย พร้อมทั้งสร้างหัวข้อของข่าวนี้ ให้เหมือนมนุษย์เขียน 100% เพื่อหลีกเลี่ยงการตรวจสอบจากเครื่องมือตรวจสอบการเขียนด้วย AI ทุกรูปแบบ :"
    const sysPrompt = "ถอดคำและสรุปข่าวนี้ใหม่เป็นภาษาไทย และสร้างหัวข้อของข่าวนี้ ให้เหมือนมนุษย์เขียน 100% เพื่อหลีกเลี่ยงการตรวจสอบจากเครื่องมือตรวจสอบการเขียนด้วย AI ทุกรูปแบบ รูปแบบผลลัพท์ หัวข้อข่าว : , เนื้อหาข่าว : ข่าวต้นฉบับคือ :"
    const prompt = sysPrompt + "\n" + contents.join("\n")
    const result = await model.generateContent(prompt);
    const response = await result.response;
    // ใช้ Regular Expression ในการลบ string ที่อยู่ใน ** **
    // var response = response.replace(/\*\*(.*?)\*\*/g, "");
    const text = response.text();
    const textArr = text.split("**เนื้อหาข่าว:**");
    const artcieHead = textArr[0].replace("**หัวข้อข่าว:**","").replace("*","").replace(/(\r\n|\n|\r)/gm, "");
    const articleContent = textArr[1].replace("**เนื้อหาข่าว:**","").replace(/(\r\n|\n|\r)/gm, "");
    // ------------- GEMINIAI -------------    
    return Response.json({ text , images , artcieHead , articleContent })
}