"use client";

import { useState, useEffect } from "react";
import ReviewForm from "@/components/features/ReviewForm";
import { getReviews } from "@/lib/data-service";
import { addReview } from "@/lib/actions/foodReviewActions";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@supabase/supabase-js";
import { Photo, Review, ReviewType } from "@/app/types/globals";

type PhotoWithReviewsProps = {
  currentUser: User;
  photo: Photo;
  type: ReviewType;
};

export default function PhotoWithReviews({
  currentUser,
  photo,
  type,
}: PhotoWithReviewsProps) {
  const [reviews, setReviews] = useState<Review[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      const data = await getReviews(photo.id, type);
      setHasUserReviewed(
        data.some((review) => review.user_id === currentUser.id),
      ); // check if user has already reviewed

      setReviews(data as Review[]);
      setIsLoading(false);
    };
    loadReviews();
  }, [photo.id, type]); // type?

  const handleReviewSubmit = async (
    photoId: string,
    type: ReviewType,
    reviewText: string,
  ) => {
    await addReview(photoId, type, reviewText);
    const data = await getReviews(photoId, type);
    setHasUserReviewed(true);
    setReviews(data as Review[]);
  };

  return (
    <Card className="max-w-xl">
      <CardHeader className="flex flex-col items-center justify-center gap-4 space-y-0">
        <Image
          src={photo.file_url}
          alt={photo.file_name}
          width={200}
          height={200}
          className="rounded-md object-cover"
        />
        <CardTitle className="text-3xl">{photo.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <h3 className="mb-2 ml-1 text-base font-medium">User Reviews</h3>
          {isLoading ? (
            <ReviewsSkeleton />
          ) : (
            <ul className="space-y-2">
              {reviews?.map((review) => (
                <ReviewItem
                  key={review.id}
                  review={review}
                  isCurrentUser={review.user_id === currentUser.id}
                />
              ))}
            </ul>
          )}
        </div>
        {!hasUserReviewed && (
          <ReviewForm
            photoId={photo.id}
            type={type}
            onReviewSubmit={handleReviewSubmit}
          />
        )}
      </CardContent>
    </Card>
  );
}

function ReviewItem({
  review,
  isCurrentUser,
}: {
  review: Review;
  isCurrentUser: boolean;
}) {
  return (
    <li className="flex items-start space-x-4 rounded-md bg-muted px-3 py-2">
      <div className="flex-1 space-y-1 overflow-hidden">
        <p className={`text-sm ${isCurrentUser ? "font-bold" : "font-medium"}`}>
          {review.user_email}
        </p>
        <p className="break-words text-base text-primary/80">
          {review.review_text}
        </p>
      </div>
    </li>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[450px]" />
            <Skeleton className="h-4 w-[400px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
