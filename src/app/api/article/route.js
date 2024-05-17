import { extract } from '@extractus/article-extractor'
const cheerio = require('cheerio') 
export async function POST(request) {
    // body = request.body
    const body = await request.json()
    const { urls } = body
    const articles = []
    const contents = []
    const cleanedContents = []
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

        // Clean Content
        
        const cleanedContent = content
            // .replace(/(\r\n|\n|\r|\t)/gm, "\n")
            // .replace(/\s+/g, " ")
            // .replace(/(\r\n|\n|\r|\t)/gm, "\n")
            // .replace(/\s+/g, " ")
            // .replace("\n\n", "\n")
            .replace("\t", "")
            .trim();

        articles.push(article)
        contents.push(content)
        cleanedContents.push(cleanedContent)
        images.push(image)
    }

    
    return Response.json({ articles , cleanedContents , images })
}