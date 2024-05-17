import { extract } from '@extractus/article-extractor'
const cheerio = require('cheerio') 
export async function POST(request) {
    // body = request.body
    const body = await request.json()
    const { urls } = body
    const articles = []
    const contents = []
    for (const url of urls) {
        const article = await extract(url)
        console.log(article)
        
        // Title
        const title = article.title

        // Content
        const content_html = article.content
        const $ = cheerio.load(content_html)
        const content = $('body').text()

        articles.push(article)
        contents.push(content)
    }

    
    return Response.json({ articles })
}