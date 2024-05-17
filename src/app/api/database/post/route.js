import { NextResponse } from 'next/server'

import { MongoClient } from 'mongodb';
export async function POST(request) {
    console.log('Yo!');
    try {      

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
        const collection = database.collection('posts'); // Choose a name for your collection

        for (const url of urls) {
            // Check url is duplicate
            const doc = await collection.findOne({ url });
            if (doc) {
                continue;
            }
            // Insert
            await collection.insertOne({ 
                url: url , 
                status: 'pending',
                created_at: new Date()
            });
        }

        return new Response(`Data saved successfully!` , { status: 201 });

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
    const collection = database.collection('posts'); // Choose a name for your collection

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
    const collection = database.collection('posts'); // Choose a name for your collection

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

export async function DELETE(request) {
    const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
    await client.connect();
    console.log('connect successfully!');
    const database = client.db('posts'); // Choose a name for your database
    const collection = database.collection('posts'); // Choose a name for your collection 

    await collection.deleteMany({});

    return new Response(`Data deleted successfully!` , { status: 201 });
}