import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Importing images
import GuitarImage from "../../assets/images/guitarwobg.png";
import UkuleleImage from "../../assets/images/ukulele.png";
import PianoImage from "../../assets/images/piano.png";

const MusicSelection = () => {
    const [currentPage, setCurrentPage] = useState(1); // Toggle between pages
    const [selectedGenres, setSelectedGenres] = useState([]); // Track selected genres
    const [selectedInstrument, setSelectedInstrument] = useState(null); // Track selected instrument
    const navigate = useNavigate(); // Initialize navigate

    const genres = [
        "Country", "Electronic", "Funk", "Hip hop",
        "Jazz", "Latin", "Pop", "Punk",
        "R&B", "Rock", "Metal", "Soul music"
    ];

    const instruments = [
        { name: "Guitar", image: GuitarImage, color: "#C4EAFA", width: "w-80", height: "h-64" },
        { name: "Ukulele", image: UkuleleImage, color: "#C8E3FF", width: "w-64", height: "h-64" },
        { name: "Piano", image: PianoImage, color: "#ADCCFF", width: "w-72", height: "h-64" },
    ];

    // Handle genre selection
    const handleGenreClick = (genre) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter(item => item !== genre));
        } else if (selectedGenres.length < 3) {
            setSelectedGenres([...selectedGenres, genre]);
        }
    };

    // Handle Next button click
    const handleNextClick = () => {
        if (currentPage === 1 && selectedGenres.length === 3) {
            setCurrentPage(2); // Go to the instruments page
        } else if (currentPage === 2 && selectedInstrument) {
            navigate("/login"); // Navigate to the LoginPage
        }
    };

    // Handle instrument selection
    const handleInstrumentClick = (instrumentName) => {
        setSelectedInstrument(instrumentName); // Update selected instrument
    };

    return (
        <div className="text-center p-10 flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-4xl px-2">
                <div
                    className="w-full transition-transform duration-500"
                    style={{
                        transform: currentPage === 1 ? "translateX(0)" : "translateX(-100%)",
                    }}
                >
                    {/* Page 1 Content */}
                    {currentPage === 1 && (
                        <div className="flex flex-col items-center mt-10">
                            <h1 className="text-3xl font-bold mb-3 text-left w-full">Choose your interest..</h1>
                            <p className="text-gray-600 mb-6 text-left w-full">What rises the fuzziness in you. Please choose 3 genres</p>
                            <div className="grid grid-cols-4 gap-10 w-full px-4">
                                {genres.map((genre, index) => (
                                    <button
                                        key={index}
                                        className={`px-10 py-6 border border-gray-300 rounded-lg text-lg transition-all duration-200 ${
                                            selectedGenres.includes(genre)
                                                ? "bg-blue-200 text-blue-700"
                                                : "hover:bg-gray-200 text-gray-700"
                                        }`}
                                        onClick={() => handleGenreClick(genre)}
                                        disabled={selectedGenres.length >= 3 && !selectedGenres.includes(genre)}
                                    >
                                        {genre}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div
                    className="w-full transition-transform duration-500"
                    style={{
                        transform: currentPage === 2 ? "translateX(0)" : "translateX(100%)",
                    }}
                >
                    {/* Page 2 Content */}
                    {currentPage === 2 && (
                        <div className="flex flex-col items-center">
                            <h1 className="text-2xl font-bold mb-4 mt-10 text-center w-full">Choose an instrument...</h1>
                            <p className="text-gray-600 mb-10 mt-2 text-center w-full">Which sound moves you</p>
                            <div className="grid grid-cols-3 gap-8 w-full">
                                {instruments.map((instrument, index) => (
                                    <div
                                        key={index}
                                        className="text-center"
                                        onClick={() => handleInstrumentClick(instrument.name)}
                                    >
                                        <div
                                            className={`w-[260px] ${instrument.height} mx-auto rounded-md flex justify-center items-center cursor-pointer transition-all duration-200 ${
                                                selectedInstrument === instrument.name
                                                    ? "border-4 border-blue-500"
                                                    : "border-2 border-transparent"
                                            }`}
                                            style={{ backgroundColor: instrument.color }}
                                        >
                                            <img
                                                src={instrument.image}
                                                alt={instrument.name}
                                                className={`object-contain ${instrument.width} ${instrument.height}`}
                                            />
                                        </div>
                                        <p className="mt-3 font-semibold text-gray-700">{instrument.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Next Button */}
                <div className="mt-10 flex justify-end">
                    <button
                        className="px-14 py-5 text-sm font-bold text-white bg-gradient-to-r from-[#99CCFF] to-[#C6B7FF] rounded-full"
                        onClick={handleNextClick}
                        disabled={(currentPage === 1 && selectedGenres.length !== 3) || (currentPage === 2 && !selectedInstrument)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MusicSelection;

