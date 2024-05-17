import { NextResponse } from 'next/server'

import { MongoClient } from 'mongodb';
export async function DELETE(request) {
    const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
    await client.connect();
    console.log('connect successfully!');
    const database = client.db('posts'); // Choose a name for your database
    const collection = database.collection('posts'); // Choose a name for your collection 

    // Delete all data
    await collection.deleteMany({});

    return new Response(`Data deleted successfully!` , { status: 201 });
}