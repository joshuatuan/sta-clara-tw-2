import PhotoWithReviews from "@/components/features/PhotoWithReviews";
import CreateReviewForm from "@/components/features/CreateReviewForm";
import { getReviewPhotos, getUser } from "@/lib/data-service";
import { redirect } from "next/navigation";
import { ReviewType } from "@/app/types/globals";

const REVIEW_TYPE = "food" as ReviewType;

export default async function FoodReviewPage() {
  const foodReviewPhotos = await getReviewPhotos(REVIEW_TYPE);
  const user = await getUser();

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="max-w-7xl space-y-4">
      <h1 className="text-2xl font-bold">Food Reviews</h1>
      <div className="block h-[70vh] xl:grid xl:grid-cols-[1fr_2fr] xl:gap-x-8">
        <div>
          <CreateReviewForm type={REVIEW_TYPE} />
        </div>

        <div className="mt-8 xl:mt-0 xl:overflow-y-auto">
          <div className="space-y-6">
            {foodReviewPhotos.map((foodReviewPhoto) => (
              <PhotoWithReviews
                currentUser={user}
                key={foodReviewPhoto.id}
                photo={foodReviewPhoto}
                type={REVIEW_TYPE}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
