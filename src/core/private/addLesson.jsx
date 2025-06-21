import React, { useState } from "react";
import AdminSidebar from "../../components/adminSidebar.jsx";
import { useTheme } from "../../components/ThemeContext";

export default function AddQuiz() {
    const { theme } = useTheme();
    const [day, setDay] = useState("");
    const [quizzes, setQuizzes] = useState([]);
    const [docxFiles, setDocxFiles] = useState([]);
    const [instrument, setInstrument] = useState("guitar");

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedQuizzes = [...quizzes];
        updatedQuizzes[index] = { ...updatedQuizzes[index], [name]: value };
        setQuizzes(updatedQuizzes);
    };

    const handleOptionChange = (index, optionIndex, value) => {
        const updatedQuizzes = [...quizzes];
        updatedQuizzes[index].options[optionIndex] = value;
        setQuizzes(updatedQuizzes);
    };

    const handleDiagramChange = (index, e) => {
        const updatedQuizzes = [...quizzes];
        const file = e.target.files[0];
        if (file) {
            updatedQuizzes[index].chordDiagram = file;
            // Assign fileIndex based on the number of files already assigned
            const fileIndex = quizzes.filter(q => q.chordDiagram).length;
            updatedQuizzes[index].fileIndex = fileIndex;
        } else {
            updatedQuizzes[index].chordDiagram = null;
            updatedQuizzes[index].fileIndex = null;
        }
        setQuizzes(updatedQuizzes);
    };

    const handleDocxFileChange = (event) => {
        setDocxFiles([...event.target.files]);
    };

    const addQuiz = () => {
        if (quizzes.length < 5) {
            setQuizzes([
                ...quizzes,
                {
                    question: "",
                    chordDiagram: null,
                    fileIndex: null, // Initialize fileIndex as null
                    options: ["", "", "", ""],
                    correctAnswer: "",
                },
            ]);
        } else {
            alert("You can only add up to 5 quizzes.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        const quizData = {
            day,
            instrument,
            quizzes: quizzes.map((quiz, index) => ({
                question: quiz.question,
                options: quiz.options,
                correctAnswer: quiz.correctAnswer,
                fileIndex: quiz.fileIndex, // Include fileIndex instead of chordDiagram
            })),
        };

        formData.append("quizData", JSON.stringify(quizData));

        // Append chordDiagrams in the order of fileIndex
        const chordDiagrams = quizzes
            .filter(quiz => quiz.chordDiagram && quiz.fileIndex != null)
            .sort((a, b) => a.fileIndex - b.fileIndex) // Ensure files are appended in fileIndex order
            .map(quiz => quiz.chordDiagram);

        chordDiagrams.forEach((file, index) => {
            formData.append("chordDiagrams", file);
        });

        docxFiles.forEach((file) => {
            formData.append("docxFiles", file);
        });

        try {
            const response = await fetch("http://localhost:3000/api/quiz/addquiz", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to add quizzes");
            }

            alert("Quizzes added successfully!");
            setQuizzes([]);
            setDocxFiles([]);
            setDay("");
            setInstrument("guitar");
        } catch (error) {
            console.error("Error:", error);
            alert("Error adding quizzes. Please try again.");
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex">
            <AdminSidebar />
            <div className="flex justify-center items-center w-full">
                <div className="p-6 bg-white dark:bg-gray-800 dark:bg-opacity-80 rounded-lg shadow-md w-[65%] ml-[-5%] h-[90vh] flex flex-col">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Add New Quizzes</h2>
                    <div className="overflow-y-auto flex-grow p-2">
                        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300">Select Day</label>
                                <select
                                    value={day}
                                    onChange={(e) => setDay(e.target.value)}
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                    required
                                >
                                    <option value="" disabled>Select a day</option>
                                    {Array.from({ length: 7 }, (_, i) => (
                                        <option key={i} value={`Day ${i + 1}`}>{`Day ${i + 1}`}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300">Select Instrument</label>
                                <select
                                    value={instrument}
                                    onChange={(e) => setInstrument(e.target.value)}
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                    required
                                >
                                    <option value="guitar">Guitar</option>
                                    <option value="ukulele">Ukulele</option>
                                    <option value="piano">Piano</option>
                                </select>
                            </div>
                            {quizzes.map((quiz, index) => (
                                <div key={index} className="mb-4 p-4 border rounded-md dark:border-gray-600 dark:bg-gray-700">
                                    <h3 className="font-bold mb-2 text-gray-800 dark:text-gray-200">{`Quiz ${index + 1}`}</h3>
                                    <div>
                                        <label className="block font-medium text-gray-700 dark:text-gray-300">Quiz Question</label>
                                        <input
                                            type="text"
                                            name="question"
                                            value={quiz.question}
                                            onChange={(e) => handleChange(index, e)}
                                            className="w-full p-2 border rounded-md dark:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-medium text-gray-700 dark:text-gray-300">Upload Chord Diagram</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleDiagramChange(index, e)}
                                            className="w-full p-2 text-gray-700 dark:text-gray-300"
                                        />
                                    </div>
                                    {quiz.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center">
                                            <label className="block font-medium text-gray-700 dark:text-gray-300">{`Option ${optionIndex + 1}`}</label>
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                                className="w-full p-2 border rounded-md ml-2 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
                                                required
                                            />
                                        </div>
                                    ))}
                                    <div>
                                        <label className="block font-medium text-gray-700 dark:text-gray-300">Correct Answer</label>
                                        <input
                                            type="text"
                                            name="correctAnswer"
                                            value={quiz.correctAnswer}
                                            onChange={(e) => handleChange(index, e)}
                                            className="w-full p-2 border rounded-md dark:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
                                            placeholder="Enter the correct answer"
                                            required
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addQuiz}
                                className="bg-blue-300 dark:bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-green-600 dark:hover:bg-green-700 w-full"
                            >
                                Add Another Quiz
                            </button>
                            <button
                                type="submit"
                                className="bg-purple-300 dark:bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 w-full"
                            >
                                Submit All Quizzes
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}