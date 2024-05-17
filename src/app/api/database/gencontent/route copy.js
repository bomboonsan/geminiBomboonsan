import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { extract } from '@extractus/article-extractor'
const cheerio = require('cheerio') 

export async function POST(request) {
    try {      

        const { urls } = await request.json();

        if (!urls) {
            return new Response(`urls are required!` , { status: 500 });
        }

        const client = new MongoClient(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        await client.connect();
        console.log('connect successfully!');
        const database = client.db('posts'); // Choose a name for your database
        const collectionPosts = database.collection('posts'); // Choose a name for your collection
        const collection = database.collection('contents'); // Choose a name for your collection


        const articles = []
        const contents = []
        const images = []
        for (const url of urls) {
            // AI GEN           

            const article = await extract(url)
            
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

            // ------------- GEMINIAI -------------
            const apikeyBom = process.env.BOM_GEMINI_APIKEY
            const apikeyAom = process.env.AUN_GEMINI_APIKEY
            const randomKey = Math.floor(Math.random() * 2) === 0 ? apikeyBom : apikeyAom
            const genAI = new GoogleGenerativeAI(randomKey);
            // For text-only input, use the gemini-pro model
            const model = genAI.getGenerativeModel({ model: "gemini-pro"});
            // Load a system prompt
            // const sysPrompt = "ถอดคำและสรุปข่าวนี้ใหม่เป็นภาษาไทย พร้อมทั้งสร้างหัวข้อของข่าวนี้ ให้เหมือนมนุษย์เขียน 100% เพื่อหลีกเลี่ยงการตรวจสอบจากเครื่องมือตรวจสอบการเขียนด้วย AI ทุกรูปแบบ :"
            const sysPrompt = "ถอดคำและสรุปข่าวนี้ใหม่เป็นภาษาไทย และสร้างหัวข้อของข่าวนี้ ให้เหมือนมนุษย์เขียน 100% เพื่อหลีกเลี่ยงการตรวจสอบจากเครื่องมือตรวจสอบการเขียนด้วย AI ทุกรูปแบบ รูปแบบผลลัพท์ หัวข้อข่าว : , เนื้อหาข่าว :  เนื้อหาข่าวต้นฉบับคือ :"
            const prompt = sysPrompt + "\n" + content;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            // ใช้ Regular Expression ในการลบ string ที่อยู่ใน ** **
            // var response = response.replace(/\*\*(.*?)\*\*/g, "");
            const text = response.text();
            console.log(text)
            const textArr = text.split("**เนื้อหาข่าว:**");
            const artcieHead = textArr[0]?.replace("**หัวข้อข่าว:**","")?.replace(/(\r\n|\n|\r)/gm, "")?.replace('\n', "").trim();
            const articleContent = textArr[1]?.replace("\n\n**เนื้อหาข่าว:**","")?.replace("**เนื้อหาข่าว:**\n\n","")?.replace("**เนื้อหาข่าว:**","");
            // ------------- GEMINIAI -------------

            // Insert
            await collection.insertOne({ 
                title: artcieHead,
                content: articleContent,
                image: image,
                url: url,
                created_at: new Date()
            });

            // find and update
            await collectionPosts.updateOne({ url: url }, { $set: { status: 'paraphased' } });

        }

        function removeNewlinesBeforeContent(text) {
            // ตัดแต่งข้อความเพื่อลบ \n\n หรือ \n ที่อยู่ก่อนเนื้อหา
            text = text.replace("**เนื้อหาข่าว:**","");
            text = text.trim();
            text = text.replace(/^\n+\n?/g, '');
          
            // ตรวจสอบว่ามี \n\n ระหว่างเนื้อหาหรือไม่
            const hasDoubleNewline = text.includes('\n\n');
          
            // หากไม่มี \n\n ระหว่างเนื้อหา แสดงว่าไม่มีการเปลี่ยนแปลง
            if (!hasDoubleNewline) {
              return text;
            }
          
            // แยกเนื้อหาออกเป็นอาร์เรย์โดยใช้ \n\n เป็นตัวคั่น
            const contentArray = text.split('\n\n');
          
            // ลบ \n\n ออกจากเนื้อหา
            const cleanContent = contentArray.join('\n');
          
            return cleanContent;
        }


        return new Response({ message :`Data saved successfully!` , urls : urls } , { status: 201 });

    } catch (error) {
        console.error(error);   
    }
}


export async function GET(request) {

    const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
    await client.connect();
    console.log('connect successfully!');
    const database = client.db('posts'); // Choose a name for your database
    const collection = database.collection('contents'); // Choose a name for your collection

    const posts = await collection.find({}).toArray();
    return new Response(JSON.stringify(posts), { status: 200 });
}



export async function PATCH(request) {

    const { urls } = await request.json();
    if (!urls) {
        return new Response(`Name and score are required!` , { status: 500 });
    }

    const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
    await client.connect();
    console.log('connect successfully!');
    const database = client.db('posts'); // Choose a name for your database
    const collection = database.collection('contents'); // Choose a name for your collection

    for (const url of urls) {
        // Check url is duplicate
        const doc = await collection.findOne({ url });
        if (!doc) {
            continue;
        }
        // Update
        await collection.updateOne({ url }, { $set: { status: 'done' } });
    }

    return new Response(`Data saved successfully!` , { status: 201 });
    
}