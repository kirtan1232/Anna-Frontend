import React, { useState } from "react";
import * as mammoth from "mammoth";
import '@fortawesome/fontawesome-free/css/all.min.css';
import AdminSidebar from "../../components/adminSidebar.jsx";
import axios from 'axios';
import { useTheme } from "../../components/ThemeContext";

const AddChord = () => {
    const { theme } = useTheme();
    const [songName, setSongName] = useState("");
    const [selectedInstrument, setSelectedInstrument] = useState("ukulele");
    const [lyrics, setLyrics] = useState([
        { section: "", lyric: "", chord: "", docxFiles: [] }
    ]);
    const [isOpen, setIsOpen] = useState(true);
    const [chordDiagrams, setChordDiagrams] = useState([]);

    const handleInstrumentChange = (e) => {
        setSelectedInstrument(e.target.value);
    };

    const handleChordDiagramUpload = (e) => {
        const files = Array.from(e.target.files);
        setChordDiagrams((prevFiles) => [...new Set([...prevFiles, ...files].map(f => f.name))].map(name => files.find(f => f.name === name) || prevFiles.find(f => f.name === name)));
    };

    const handleDocxUpload = (e, index) => {
        const files = Array.from(e.target.files);
        const updatedLyrics = [...lyrics];
        updatedLyrics[index].docxFiles = [...new Set([...updatedLyrics[index].docxFiles, ...files].map(f => f.name))].map(name => files.find(f => f.name === name) || updatedLyrics[index].docxFiles.find(f => f.name === name));
        setLyrics(updatedLyrics);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result;
                mammoth.extractRawText({ arrayBuffer })
                    .then((result) => {
                        const extractedText = result.value;
                        const lyricsLines = parseDocxText(extractedText);
                        updateLyricsWithDocx(index, lyricsLines);
                    })
                    .catch((err) => console.log("Error parsing DOCX:", err));
            };
            reader.readAsArrayBuffer(file);
        });
    };

    const parseDocxText = (text) => {
        const lines = text.split("\n").filter(line => line.trim() !== "");
        const parsedLyrics = lines.map(line => {
            const parts = line.split(":");
            if (parts.length >= 2) {
                const [section, ...rest] = parts;
                const [lyric, chord = ""] = rest.join(":").split(" ");
                return { section: section.trim(), lyric: lyric.trim(), chord: chord.trim() };
            }
            return { section: "", lyric: line.trim(), chord: "" };
        });
        return parsedLyrics;
    };

    const updateLyricsWithDocx = (index, parsedLyrics) => {
        const updatedLyrics = [...lyrics];
        if (parsedLyrics[0]) {
            updatedLyrics[index] = {
                ...updatedLyrics[index],
                section: parsedLyrics[0].section || updatedLyrics[index].section,
                lyric: parsedLyrics[0].lyric || updatedLyrics[index].lyric,
                chord: parsedLyrics[0].chord || updatedLyrics[index].chord
            };
            setLyrics(updatedLyrics);
        }
    };

    const handleLyricsChange = (index, field, value) => {
        const updatedLyrics = [...lyrics];
        updatedLyrics[index][field] = value;
        setLyrics(updatedLyrics);
    };

    const addLine = () => {
        setLyrics([...lyrics, { section: "", lyric: "", chord: "", docxFiles: [] }]);
    };

    const removeLine = (index) => {
        setLyrics(lyrics.filter((_, i) => i !== index));
    };

    const copyLine = (index) => {
        const newLine = {
            section: lyrics[index].section,
            lyric: lyrics[index].lyric,
            chord: lyrics[index].chord,
            docxFiles: []
        };
        setLyrics([...lyrics, newLine]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!songName.trim()) {
            alert("Song title is required.");
            return;
        }

        const formData = new FormData();
        formData.append("songName", songName);
        formData.append("selectedInstrument", selectedInstrument);
        formData.append("lyrics", JSON.stringify(lyrics.map(({ section, lyric, chord }) => ({ section, lyrics: lyric, chord }))));

        chordDiagrams.forEach((file) => {
            formData.append("chordDiagrams", file);
        });

        lyrics.forEach((lyric) => {
            lyric.docxFiles.forEach((file) => {
                formData.append("docxFiles", file);
            });
        });

        try {
            const response = await axios.post("http://localhost:3000/api/songs/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200 || response.status === 201) {
                alert("Chords Added Successfully!");
                setSongName("");
                setLyrics([{ section: "", lyric: "", chord: "", docxFiles: [] }]);
                setChordDiagrams([]);
            }
        } catch (error) {
            console.error("Error submitting chord data:", error);
            alert("An error occurred while adding the chord.");
        }
    };

    const toggleSection = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex">
            <AdminSidebar />
            <main className="flex-1 p-1 flex justify-center items-center">
                <div className="w-11/12 max-xl bg-white dark:bg-gray-800 dark:bg-opacity-80 p-8 rounded-lg shadow-lg h-full flex flex-col">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Add Chord</h1>
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Song Title</label>
                            <input
                                type="text"
                                value={songName}
                                onChange={(e) => setSongName(e.target.value)}
                                className="w-full p-2 border rounded-lg shadow-sm dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                placeholder="Enter song title"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Select Instrument</label>
                            <select
                                value={selectedInstrument}
                                onChange={handleInstrumentChange}
                                className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            >
                                <option value="ukulele">Ukulele</option>
                                <option value="guitar">Guitar</option>
                                <option value="piano">Piano</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Upload Chord Diagram(s)</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleChordDiagramUpload}
                                className="w-full p-2 text-gray-700 dark:text-gray-300"
                            />
                            {chordDiagrams.length > 0 && (
                                <ul className="mt-2">
                                    {chordDiagrams.map((file, idx) => (
                                        <li key={idx} className="text-gray-700 dark:text-gray-300">{file.name}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                                Lyrics and Chords
                                <button onClick={toggleSection} className="ml-20 text-gray-600 dark:text-gray-400 hover:underline">
                                </button>
                            </h2>
                            {isOpen && lyrics.map((item, index) => (
                                <div key={index} className="mb-4 p-4 bg-white dark:bg-gray-700 shadow rounded-lg">
                                    <input
                                        type="text"
                                        value={item.section}
                                        onChange={(e) => handleLyricsChange(index, "section", e.target.value)}
                                        className="w-full p-2 border rounded-lg dark:bg-gray-600 dark:text-gray-300 dark:border-gray-600 mt-2"
                                        placeholder="Enter section title (e.g., Verse 1)"
                                    />
                                    <input
                                        type="file"
                                        accept=".docx"
                                        multiple
                                        onChange={(e) => handleDocxUpload(e, index)}
                                        className="w-full p-2 text-gray-700 dark:text-gray-300 mt-2"
                                    />
                                    {item.docxFiles && item.docxFiles.length > 0 && (
                                        <ul className="mt-2">
                                            {item.docxFiles.map((file, idx) => (
                                                <li key={idx} className="text-gray-700 dark:text-gray-300">Uploaded: {file.name}</li>
                                            ))}
                                        </ul>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeLine(index)}
                                        className="px-3 py-1 bg-red-500 dark:bg-red-600 text-white rounded-lg mr-2 mt-2"
                                    >
                                        Remove
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => copyLine(index)}
                                        className="px-3 py-1 bg-blue-500 dark:bg-blue-600 text-white rounded-lg mt-2"
                                    >
                                        Copy
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addLine}
                                className="px-3 py-1 bg-green-500 dark:bg-green-600 text-white rounded-lg mt-2"
                            >
                                Add Line
                            </button>
                        </div>
                        <button type="submit" className="px-4 py-2 bg-blue-300 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700">
                            Submit Chord
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddChord;