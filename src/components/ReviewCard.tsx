import { Review } from '../types';

interface ReviewCardProps {
    review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
    return (
        <div className="p-4 bg-base-100 rounded-lg border border-base-300">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                            <span className="text-xl">{review.userName.charAt(0)}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-base-content">{review.userName}</h3>
                        <div className="flex items-center gap-2">
                            <div className="rating rating-sm">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <input
                                        key={star}
                                        type="radio"
                                        name={`rating-${review.id}`}
                                        className="mask mask-star-2 bg-orange-400"
                                        checked={star === Math.round(review.rating)}
                                        readOnly
                                    />
                                ))}
                            </div>
                            <span className="font-medium text-base-content">{review.rating}</span>
                        </div>
                    </div>
                </div>
                <span className="text-sm opacity-70">{review.date}</span>
            </div>
            <div className="mt-3 text-base-content">{review.comment}</div>
            <div className="flex justify-end mt-3 gap-2">
                <button className="btn btn-sm btn-ghost text-base-content">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    有用
                </button>
                <button className="btn btn-sm btn-ghost text-base-content">回复</button>
            </div>
        </div>
    );
} 