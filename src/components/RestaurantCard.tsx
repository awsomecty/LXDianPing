import Link from 'next/link';
import { Restaurant } from '../types';

interface RestaurantCardProps {
    restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
    // 计算评价数量
    const reviewCount = restaurant.reviews.length;

    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="card-body">
                <div className="flex items-start justify-between">
                    <h2 className="card-title text-base-content">
                        {restaurant.name}
                        <div className="badge badge-secondary">{restaurant.priceRange}</div>
                    </h2>
                    <div className="badge badge-outline">{restaurant.cuisine}</div>
                </div>

                <p className="text-base-content">{restaurant.description}</p>

                <div className="flex items-center gap-2 mt-2">
                    <div className="rating rating-md">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <input
                                key={star}
                                type="radio"
                                name={`rating-${restaurant.id}`}
                                className="mask mask-star-2 bg-orange-400"
                                checked={star === Math.round(restaurant.rating)}
                                readOnly
                            />
                        ))}
                    </div>
                    <span className="font-bold text-base-content">{restaurant.rating}</span>
                    <span className="text-sm opacity-70">
                        ({reviewCount} {reviewCount <= 1 ? '评价' : '评价'})
                    </span>
                </div>

                <div className="flex items-center gap-2 mt-1 opacity-70">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{restaurant.address}</span>
                </div>

                <div className="card-actions justify-end mt-4">
                    <Link href={`/restaurant/${restaurant.id}`}>
                        <button className="btn btn-primary text-white">查看详情</button>
                    </Link>
                </div>
            </div>
        </div>
    );
} 