'use client'; // Indicates this is a client component

import React from 'react';

function Video() {
    return (
        <div className="relative w-full h-full overflow-hidden border-4 border-customPink rounded-lg shadow-lg">

            <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover opacity-70">
                <source src="/Kanban_Video.mp4" />
                Your browser does not support video playback.
            </video>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-transparent"></div>
     
        </div>
    );
}

export default Video;
