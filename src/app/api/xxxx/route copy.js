// import { extract } from '@extractus/article-extractor'
// import { movier } from 'movier'
// const movier = require('movier') 
const imdbScraper = require('easyimdbscraper')

export async function GET(request) {
    // const data = movier.searchTitleByName("interstellar 2014")
    // console.log(data);
    const id = 'tt0816692'
    const info = await imdbScraper.getInfoByID(id)
    // // const text = extract(data);
    // console.log(data);
    const text = 'helloworld';
    return Response.json({ info });
}