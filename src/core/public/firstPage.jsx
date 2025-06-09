import React from 'react';

const FirstPage = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            <video
                src="src/assets/videos/horizon-sky-cello-piano-moewalls-com.mp4"
                type="video/mp4"
                autoPlay
                loop
                muted
                className="absolute top-0 left-0 w-full h-full object-cover opacity-75m "
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div>
            <div className="relative z-10 flex justify-center items-center w-full h-full text-white">
                <h1 className="text-3xl font-bold">Welcome to Melody Mentor</h1>
            </div>
        </div>
    );
};

export default FirstPage;
