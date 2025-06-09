import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from "../../components/adminSidebar.jsx";
import { useTheme } from "../../components/ThemeContext";

const ViewChords = () => {
    const { theme } = useTheme(); // Get theme from context
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedInstrument, setSelectedInstrument] = useState("All");
    const [editSong, setEditSong] = useState(null);
    const [editFormData, setEditFormData] = useState({
        songName: "",
        selectedInstrument: "",
        lyrics: [{ section: "", lyrics: "", parsedDocxFile: [] }],
        chordDiagrams: [],
        docxFiles: []
    });

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/songs/getsongs', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSongs(Array.isArray(response.data.songs) ? response.data.songs : []);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching songs');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (song) => {
        setEditSong(song);
        setEditFormData({
            songName: song.songName,
            selectedInstrument: song.selectedInstrument,
            lyrics: song.lyrics.map(lyric => ({
                section: lyric.section || "",
                lyrics: lyric.lyrics || "",
                parsedDocxFile: lyric.parsedDocxFile || []
            })),
            chordDiagrams: [],
            docxFiles: []
        });
    };

    const handleFormChange = (e, index, field) => {
        if (field === "songName" || field === "selectedInstrument") {
            setEditFormData({ ...editFormData, [field]: e.target.value });
        } else {
            const updatedLyrics = [...editFormData.lyrics];
            updatedLyrics[index][field] = e.target.value;
            setEditFormData({ ...editFormData, lyrics: updatedLyrics });
        }
    };

    const handleFileUpload = (e, field) => {
        const files = Array.from(e.target.files);
        setEditFormData({ ...editFormData, [field]: files });
    };

    const addLyricSection = () => {
        setEditFormData({
            ...editFormData,
            lyrics: [...editFormData.lyrics, { section: "", lyrics: "", parsedDocxFile: [] }]
        });
    };

    const removeLyricSection = (index) => {
        setEditFormData({
            ...editFormData,
            lyrics: editFormData.lyrics.filter((_, i) => i !== index)
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert("No authentication token found. Please log in.");
            return;
        }
        if (!editFormData.songName || !editFormData.selectedInstrument) {
            alert("Song name and instrument are required.");
            return;
        }
        const formData = new FormData();
        formData.append("songName", editFormData.songName);
        formData.append("selectedInstrument", editFormData.selectedInstrument);
        formData.append("lyrics", JSON.stringify(editFormData.lyrics));
        editFormData.chordDiagrams.forEach(file => {
            formData.append("chordDiagrams", file);
        });
        editFormData.docxFiles.forEach(file => {
            formData.append("docxFiles", file);
        });
        try {
            const response = await axios.put(`http://localhost:3000/api/songs/${editSong._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });
            alert("Song updated successfully!");
            setEditSong(null);
            fetchSongs();
        } catch (err) {
            alert(`Error updating song: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleDelete = async (songId) => {
        if (window.confirm("Are you sure you want to delete this song?")) {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("No authentication token found. Please log in.");
                return;
            }
            if (!songId.match(/^[0-9a-fA-F]{24}$/)) {
                alert("Invalid song ID format.");
                return;
            }
            try {
                const response = await axios.delete(`http://localhost:3000/api/songs/${songId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Song deleted successfully!");
                fetchSongs();
            } catch (err) {
                alert(`Error deleting song: ${err.response?.data?.message || err.message}`);
            }
        }
    };

    const uniqueInstruments = ["All", ...new Set(songs.map(song => song.selectedInstrument))];
    const filteredSongs = selectedInstrument === "All"
        ? songs
        : songs.filter(song => song.selectedInstrument === selectedInstrument);

    return (
        <div className="h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex">
            <AdminSidebar />
            <div className="flex justify-center items-center w-full">
                <div className="p-6 bg-white dark:bg-gray-800 dark:bg-opacity-80 rounded-lg shadow-md w-[65%] ml-[-5%] h-[90vh] flex flex-col">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">View Chords</h2>
                    <div className="flex justify-start space-x-8 mb-6">
                        {uniqueInstruments.map((instrument) => (
                            <span
                                key={instrument}
                                onClick={() => setSelectedInstrument(instrument)}
                                className={`cursor-pointer ${
                                    selectedInstrument === instrument
                                        ? "text-blue-500 dark:text-blue-400 underline font-semibold"
                                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                }`}
                            >
                                {instrument}
                            </span>
                        ))}
                    </div>
                    <div className="overflow-y-auto flex-grow p-2">
                        {loading ? (
                            <p className="text-gray-700 dark:text-gray-300">Loading...</p>
                        ) : error ? (
                            <p className="text-red-500 dark:text-red-400">{error}</p>
                        ) : filteredSongs.length > 0 ? (
                            <ul className="space-y-4">
                                {filteredSongs.map((song) => (
                                    <li key={song._id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
                                        <div className="flex justify-between items-center">
                                            <strong className="text-lg text-gray-800 dark:text-gray-200">Song Name: {song.songName}</strong>
                                            <div>
                                                <button
                                                    onClick={() => handleEdit(song)}
                                                    className="px-3 py-1 bg-blue-500 dark:bg-blue-600 text-white rounded-lg mr-2"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(song._id)}
                                                    className="px-3 py-1 bg-red-500 dark:bg-red-600 text-white rounded-lg"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">Instrument: {song.selectedInstrument}</p>
                                        {song.chordDiagrams && song.chordDiagrams.length > 0 && (
                                            <div className="mt-2">
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">Chord Diagrams:</p>
                                                <div className="flex space-x-2 overflow-x-auto">
                                                    {song.chordDiagrams.map((diagram, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={`http://localhost:3000/${diagram}`}
                                                            alt={`Chord Diagram ${idx + 1}`}
                                                            className="w-24 h-24 object-contain"
                                                            onError={(e) => console.log(`Failed to load image: ${diagram}`)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <ul className="mt-2 space-y-1">
                                            {song.lyrics && song.lyrics.length > 0 ? (
                                                song.lyrics.map((lyric, idx) => (
                                                    <li key={idx} className="text-gray-700 dark:text-gray-300">
                                                        <strong>{lyric.section || "Unknown Section"}:</strong>{" "}
                                                        {lyric.lyrics || "No lyrics available"}
                                                        {lyric.parsedDocxFile && lyric.parsedDocxFile.length > 0 && (
                                                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                                Parsed DOCX: {lyric.parsedDocxFile.join(", ")}
                                                            </p>
                                                        )}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-gray-700 dark:text-gray-300">No lyrics available</li>
                                            )}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400">No chords available for {selectedInstrument}.</p>
                        )}
                    </div>
                </div>
            </div>
            {editSong && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-1/2 max-h-[80vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Edit Song</h3>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Song Title</label>
                                <input
                                    type="text"
                                    value={editFormData.songName}
                                    onChange={(e) => handleFormChange(e, null, "songName")}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                    placeholder="Enter song title"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Select Instrument</label>
                                <select
                                    value={editFormData.selectedInstrument}
                                    onChange={(e) => handleFormChange(e, null, "selectedInstrument")}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                >
                                    <option value="guitar">Guitar</option>
                                    <option value="piano">Piano</option>
                                    <option value="ukulele">Ukulele</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Upload Chord Diagram(s)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleFileUpload(e, "chordDiagrams")}
                                    className="w-full p-2 text-gray-700 dark:text-gray-300"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Upload DOCX File(s)</label>
                                <input
                                    type="file"
                                    accept=".docx"
                                    multiple
                                    onChange={(e) => handleFileUpload(e, "docxFiles")}
                                    className="w-full p-2 text-gray-700 dark:text-gray-300"
                                />
                            </div>
                            {editFormData.lyrics.map((lyric, index) => (
                                <div key={index} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Section</label>
                                        <input
                                            type="text"
                                            value={lyric.section}
                                            onChange={(e) => handleFormChange(e, index, "section")}
                                            className="w-full p-2 border rounded-lg dark:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
                                            placeholder="Enter section name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Lyrics</label>
                                        <textarea
                                            value={lyric.lyrics}
                                            onChange={(e) => handleFormChange(e, index, "lyrics")}
                                            className="w-full p-2 border rounded-lg dark:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
                                            placeholder="Enter lyrics"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeLyricSection(index)}
                                        className="mt-2 px-3 py-1 bg-red-500 dark:bg-red-600 text-white rounded-lg"
                                    >
                                        Remove Section
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addLyricSection}
                                className="px-3 py-1 bg-green-500 dark:bg-green-600 text-white rounded-lg"
                            >
                                Add Lyric Section
                            </button>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setEditSong(null)}
                                    className="px-3 py-1 bg-gray-500 dark:bg-gray-600 text-white rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-3 py-1 bg-blue-500 dark:bg-blue-600 text-white rounded-lg"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewChords;