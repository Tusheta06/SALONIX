import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 0, count, showNumber = true, size = 'sm' }) => {
  const stars = [1, 2, 3, 4, 5];
  const sizeClasses = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <div className="flex items-center space-x-1">
      {stars.map((star) => (
        <Star
          key={star}
          className={`${sizeClasses} ${
            star <= Math.round(rating)
              ? 'text-amber-400 fill-amber-400'
              : 'text-gray-300'
          }`}
        />
      ))}
      {showNumber && (
        <span className="text-xs font-semibold text-gray-700 ml-1">
          {Number(rating).toFixed(1)} {count !== undefined && <span className="text-gray-400">({count})</span>}
        </span>
      )}
    </div>
  );
};
