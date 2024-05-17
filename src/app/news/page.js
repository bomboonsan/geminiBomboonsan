'use client'
import Image from "next/image";
import { useEffect, useState } from 'react';


export default function Home() {
    const [isLoad, setIsLoad] = useState(false);
    const [url, setUrl] = useState(null);
    const [data, setData] = useState(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoad(true);
        fetch('/api/content' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({urls : [url]})
        })
        .then(res => res.json())
        .then(data => {
            setData(data);
            setIsLoad(false);
            // console.log(data);
        })

    }

    // แปลงข้อมูล text เป็น HTML
    const textToHtml = (text) => {
        text = text.replace("**หัวข้อ:**", "").replace("**สรุปข่าว:**", "");
        return text.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
        ));
    };
    return (
        <div>
            <div className="max-w-screen-lg mx-auto py-2 md:py-10">
                <div className="flex gap-5">
                    <div className="w-3/4">
                        <div className="relative">
                            <input 
                                onChange={(e) => setUrl(e.target.value)}
                                type="url" 
                                className="peer py-3 pe-0 ps-8 block w-full bg-white/10 border-t-transparent border-b-2 border-x-transparent border-b-gray-200 text-sm focus:border-t-transparent focus:border-x-transparent focus:border-b-blue-500 focus:ring-0 disabled:opacity-50 disabled:pointer-events-none rounded-lg" 
                                placeholder="URL"
                            />
                            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-2 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
                                <svg className="flex-shrink-0 size-4 text-gray-500 dark:text-neutral-500" width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#EEEEEE"><path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22" stroke="#EEEEEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13 2.04932C13 2.04932 16 5.99994 16 11.9999" stroke="#EEEEEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11 21.9506C11 21.9506 8 17.9999 8 11.9999C8 5.99994 11 2.04932 11 2.04932" stroke="#EEEEEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2.62964 15.5H12" stroke="#EEEEEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2.62964 8.5H21.3704" stroke="#EEEEEE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M21.8789 17.9174C22.3727 18.2211 22.3423 18.9604 21.8337 19.0181L19.2671 19.309L18.1159 21.6213C17.8878 22.0795 17.1827 21.8552 17.0661 21.2873L15.8108 15.1713C15.7123 14.6913 16.1437 14.3892 16.561 14.646L21.8789 17.9174Z" stroke="#EEEEEE" stroke-width="1.5"></path></svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <button 
                            onClick={handleSubmit}
                            type="button" 
                            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            SUBMIT
                        </button>
                    </div>
                </div>
                {/* --------------- Data --------------- */}
                <div className="my-5"></div>
                {/* <img src="https://www.comingsoon.net/wp-content/uploads/sites/3/2024/04/Monkey-Man-White-Mask.png?resize=1024,576" alt="Your Image" width={800} height={450} layout="responsive" /> */}
                <div className="space-y-5">
                    
                    {isLoad && 
                    <>
                    <p className="h-4 bg-gray-200/10 rounded-full w-2/5"></p>
                    <ul className="mt-5 space-y-3">
                        <li className="w-full h-4 bg-gray-200/10 rounded-full"></li>
                        <li className="w-full h-4 bg-gray-200/10 rounded-full"></li>
                        <li className="w-full h-4 bg-gray-200/10 rounded-full"></li>
                        <li className="w-full h-4 bg-gray-200/10 rounded-full"></li>
                        <li className="w-full h-4 bg-gray-200/10 rounded-full"></li>
                        <li className="w-full h-4 bg-gray-200/10 rounded-full"></li>
                        <li className="w-full h-4 bg-gray-200/10 rounded-full"></li>
                        <li className="w-full h-4 bg-gray-200/10 rounded-full"></li>
                        <li className="w-full h-4 bg-gray-200/10 rounded-full"></li>
                    </ul>
                    </>
                    }

                    {data && !isLoad &&
                    <>      
                        <div className="space-y-3">
                            <img className="w-full h-auto aspect-[800/450] object-cover" src={data.images} alt="Your Image" />
                            <div className="prose text-white max-w-screen-md mx-auto">
                                {textToHtml(data.text)}
                            </div>
                        </div>
                    </>
                    }
                </div>
            </div>
        </div>
    );
}
