"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquareQuote, Calendar } from "lucide-react";

export default function ViewFeedbackPage() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/api/feedback`);
            if (!res.ok) throw new Error("Failed to load feedbacks");

            const data = await res.json();
            setFeedbacks(data.feedbacks || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (isoString) => {
        const d = new Date(isoString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short", day: "numeric", year: "numeric",
            hour: "numeric", minute: "numeric"
        }).format(d);
    };

    const renderStars = (rating) => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                            }`}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 max-w-md w-full text-center">
                    <p className="font-semibold mb-2">Could not load feedbacks</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    const averageRating = feedbacks.length > 0
        ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                {/* Header Stats */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8 flex flex-col sm:flex-row justify-between items-center sm:items-start">
                    <div className="mb-4 sm:mb-0 text-center sm:text-left">
                        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center sm:justify-start gap-3">
                            <MessageSquareQuote className="h-8 w-8 text-indigo-500" />
                            Customer Feedbacks
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Viewing all {feedbacks.length} submissions from local testers.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 bg-indigo-50 px-6 py-4 rounded-xl border border-indigo-100">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-indigo-700">{averageRating}</div>
                            <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mt-1">Avg Rating</div>
                        </div>
                        <div className="flex flex-col justify-center">
                            {renderStars(Math.round(averageRating))}
                            <span className="text-sm text-gray-500 font-medium mt-1 text-center">{feedbacks.length} Total</span>
                        </div>
                    </div>
                </div>

                {/* Feedback Grid */}
                {feedbacks.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                        No feedbacks have been submitted yet. Share your app using localtunnel!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {feedbacks.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-indigo-600 font-medium">{item.email}</p>
                                    </div>
                                    {renderStars(item.rating)}
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100 text-gray-700 italic">
                                    &quot;{item.comments}&quot;
                                </div>

                                <div className="flex items-center text-xs text-gray-400 mt-auto pt-2 border-t border-gray-50">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(item.timestamp)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
