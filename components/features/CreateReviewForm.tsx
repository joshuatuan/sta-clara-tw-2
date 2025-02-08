import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createReviewAction } from "@/lib/actions/foodReviewActions";
import { SubmitButton } from "../submit-button";
import { Textarea } from "../ui/textarea";

export default async function CreateReviewForm({ type }: { type: string }) {
  return (
    <form
      action={createReviewAction}
      className="max-w-sm space-y-4 rounded-xl border p-4 shadow-md"
    >
      <h1 className="mb-4 text-xl font-semibold">Create a Review</h1>

      <div>
        <Label className="ml-1 text-xs text-primary/80" htmlFor="photo">
          Upload {type} photo
        </Label>
        <Input
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          className="w-full"
          required
        />
      </div>
      <div>
        <Label className="ml-1 text-xs text-primary/80" htmlFor="reviewText">
          Review Title
        </Label>
        <Input
          id="reviewTitle"
          name="reviewTitle"
          type="text"
          placeholder="Enter title"
          className="w-full"
          required
        />
      </div>
      <div>
        <Label className="ml-1 text-xs text-primary/80" htmlFor="reviewText">
          Review
        </Label>
        <Textarea
          className="min-h-20 w-full"
          id="reviewText"
          name="reviewText"
          placeholder="Write your review"
          required
        />
      </div>
      <input type="hidden" name="type" value={type} />
      <SubmitButton className="w-full" pendingText="Submitting...">
        Submit Review
      </SubmitButton>
    </form>
  );
}
