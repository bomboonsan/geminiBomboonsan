import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(request) {
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
            parts: [{ text: "ต้องการเรียบเรียงบทความต่อไปนี้ สมมุติว่า Bard เป็นนักเขียนมืออาชีพสายข่าวภาพยนตร์ที่จะเขียนบทความให้ดูเป็นธรรมชาติที่อ่านแล้วให้รู้สึกว่าเป็นมนุษย์เขียนและตรวจสอบความถูกต้องของข้อมูล " }],
          },
          {
            role: "model",
            parts: [{ text: "ได้เลย ตอนนี้ฉันคือนักเขียนมืออาชีพ" }],
          },
          {
            role: "user",
            parts: [{ text: "หลังจากนี้ฉันจะให้ข้อมูลต้นฉบับที่เป็นข้อมูลดิบ ให้ Bard นำข้อมูลนี้ไปเรียบเรียงใหม่และเขียนให้ได้ผลลัพท์ที่มีรูปแบบดังนี้ = **หัวข้อข่าว** : , **เนื้อหาข่าว** : " }],
          },
          {
            role: "model",
            parts: [{ text: "ฉันเข้าใจแล้ว และฉันจะสร้างบทความนี้ที่มีผลลัพท์ดังนี้ = **หัวข้อข่าว** : , **เนื้อหาข่าว** :" }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 100,
        },
    });
      
    const msg = "บทความต้นฉบับคือ : หลังจาก Deadpool & Wolverine ปล่อยตัวอย่างแรกอออกมาเมื่อเดือนก่อน แฟนๆ ของจักรวาล Marvel ก็ต่างพากันคาดเดากันไปว่าจะมีตัวละครใดบ้างที่จะมาปรากฎตัวในภาพยนตร์เรื่องนี้ ซึ่งตัวละคร Cable ของ Josh Brolin ก็เป็นหนึ่งในตัวละครที่แฟนๆ คิดว่าจะปรากฎตัวออกมาเช่นกัน และล่าสุด Brolin ก็ได้ออกมาตอบคำถามเกี่ยวกับเรื่องนี้แล้ว  มื่อไม่นานมานี้ Josh Brolin ได้ไปออกรายการ Good Morning America เพื่อโปรโมต Dune: Part Two ภาพยนตร์เรื่องล่าสุดของเขาที่เพิ่งเข้าฉายในบ้านเราไปเมื่อวานนี้ และในระหว่างการพูดคุยกัน Brolin ได้ถูกถามซ้ำแล้วซ้ำอีกว่าเขาจะได้กลับมารับบทเป็น Cable อีกครั้งใน Deadpool & Wolverine ที่กำลังจะมาถึงหรือไม่? ซึ่งเขาก็ตอบแบบกวนๆ ทีเล่นทีจริงว่า “เขาไม่รู้”";
    const result = await chat.sendMessage(msg);
    console.log(result);
    const response = await result.response;
    console.log(response);
    const text = response.text();
    console.log(text);
    const resultText = result.response.text();
    return Response.json({ resultText });
}