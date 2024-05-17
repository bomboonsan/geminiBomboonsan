import { extract } from '@extractus/article-extractor'
const cheerio = require('cheerio') 

export async function GET(request) {
    const url = 'https://www.imdb.com/title/tt19864802/';
    const article = await extract(url)
    const content_html = article.content
    const $ = cheerio.load(content_html)
    const content = $('body').text()
    return Response.json({ content });
}