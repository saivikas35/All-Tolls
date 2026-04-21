"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function FeedbackPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        rating: 0,
        comments: "",
    });
    const [hoveredStar, setHoveredStar] = useState(0);
    const [status, setStatus] = useState("idle"); // idle, submitting, success, error
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.rating === 0) {
            setErrorMessage("Please select a star rating.");
            setStatus("error");
            return;
        }

        setStatus("submitting");
        setErrorMessage("");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/api/feedback`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error("Failed to submit feedback. Try again.");
            }

            setStatus("success");
            setFormData({ name: "", email: "", rating: 0, comments: "" });
        } catch (err) {
            setStatus("error");
            setErrorMessage(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Feedback
                    </h2>
                    <p className="text-sm text-gray-500">
                        Tell us what you think! Your feedback helps us improve AllTools.
                    </p>
                </div>

                {status === "success" ? (
                    <div className="text-center bg-green-50 rounded-xl p-6 border border-green-100">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <Star className="h-6 w-6 text-green-600 fill-current" />
                        </div>
                        <h3 className="text-lg font-medium text-green-800 mb-2">
                            Thank You!
                        </h3>
                        <p className="text-sm text-green-600">
                            Your feedback has been successfully submitted. We appreciate your thoughts.
                        </p>
                        <button
                            onClick={() => setStatus("idle")}
                            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            Submit Another Response
                        </button>
                    </div>
                ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Rating Stars */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                                How would you rate your experience?
                            </label>
                            <div className="flex justify-center space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        onMouseEnter={() => setHoveredStar(star)}
                                        onMouseLeave={() => setHoveredStar(0)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`h-10 w-10 ${star <= (hoveredStar || formData.rating)
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-200"
                                                } transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-y-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="comments"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Comments
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="comments"
                                        name="comments"
                                        rows="4"
                                        required
                                        value={formData.comments}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 transition-colors resize-none"
                                        placeholder="Tell us what you loved or what we can do better..."
                                    />
                                </div>
                            </div>
                        </div>

                        {status === "error" && (
                            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md">
                                {errorMessage}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={status === "submitting"}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all ${status === "submitting"
                                        ? "bg-indigo-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:shadow-lg transform active:scale-95"
                                    }`}
                            >
                                {status === "submitting" ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    "Submit Feedback"
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
