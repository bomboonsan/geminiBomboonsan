import { GoogleGenerativeAI } from "@google/generative-ai";
export async function GET(request) {
    const apikeyBom = process.env.BOM_GEMINI_APIKEY
    const apikeyAom = process.env.AUN_GEMINI_APIKEY
    const randomKey = Math.floor(Math.random() * 2) === 0 ? apikeyBom : apikeyAom
    const genAI = new GoogleGenerativeAI(randomKey);
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const sysPrompt = "ถอดคำและสรุปข่าวนี้ใหม่เป็นภาษาไทย ให้เหมือนมนุษย์เขียน 100% เพื่อหลีกเลี่ยงการตรวจสอบจากเครื่องมือตรวจสอบการเขียนด้วย AI ทุกรูปแบบ :"
    const Article = "Rosamund Pike, renowned for her roles in Saltburn and Gone Girl, is set to weave her own brand of enchantment in Lionsgate’s upcoming Now You See Me 3. The Golden Globe & Emmy winner, and Oscar & BAFTA nominee, has signed on for a mysterious role in the latest installment of the beloved magical franchise. Pike joins a talented cast that includes returning favouritesJesse Eisenberg, Woody Harrelson, Isla Fisher, Dave Franco, and Morgan Freeman. Additionally, newcomers Justice Smith, Dominic Sessa, and Ariana Greenblatt are poised to make their magical debut."
    const prompt = sysPrompt + Article

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return Response.json({ text })
}