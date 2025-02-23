"use client";

import Badges from "@/components/Badges";
import Warning from "@/components/Warning";
import dynamic from "next/dynamic";

const Navigation = dynamic(() => import("@/components/Navigation"), { ssr: false });
const Article = dynamic(() => import("@/components/Article"), { ssr: false });
const Report = dynamic(() => import("@/components/Report"), { ssr: false });

export default function Home() {
    return (
        <>
            <div className="relative flex flex-col items-center justify-center lg:min-h-screen gap-8 p-4 pb-16">
                <div className="lg:w-[80%] mx-auto px-4 mt-6">
                    <h1 className="text-3xl font-bold text-primary drop-shadow-sm">
                      madianti
                    </h1>
                </div>
              
            <div>
            <Navigation />
            </div>
              
            </div>
          
        </>
    );
}
