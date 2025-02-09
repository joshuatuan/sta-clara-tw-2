// o3 mini ::::
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getReviews } from "@/lib/data-service";
import { addReview } from "@/lib/actions/foodReviewActions";
import PhotoWithReviews from "@/components/features/PhotoWithReviews";

// Mock modules
jest.mock("@/lib/data-service", () => ({
  getReviews: jest.fn(),
}));
jest.mock("@/lib/actions/foodReviewActions", () => ({
  addReview: jest.fn(),
}));
jest.mock("next/image", () => (props: any) => {
  return <img {...props} />;
});
jest.mock("@/components/features/ReviewForm", () => (props: any) => {
  return (
    <div data-testid="review-form">
      <button onClick={() => props.onReviewSubmit("photo1", "food", "Great!")}>
        Submit Review
      </button>
    </div>
  );
});

// Sample test data
const samplePhoto = {
  id: "photo1",
  file_url: "https://example.com/photo.jpg",
  file_name: "photo.jpg",
  title: "Sample Photo",
};

const currentUser = { id: "user1", email: "user@example.com" };

const reviewsWithoutCurrentUser = [
  {
    id: "r1",
    user_id: "user2",
    user_email: "other@example.com",
    review_text: "Nice photo!",
  },
];

const reviewsWithCurrentUser = [
  {
    id: "r2",
    user_id: "user1",
    user_email: "user@example.com",
    review_text: "I love it!",
  },
];

describe("PhotoWithReviews", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("shows loading skeleton while fetching reviews", async () => {
    // Return a promise that resolves after a short delay
    (getReviews as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve([]), 100);
        }),
    );

    render(
      <PhotoWithReviews
        currentUser={currentUser}
        photo={samplePhoto}
        type="food"
      />,
    );

    // Skeleton should be in the document initially
    expect(screen.getByText(/User Reviews/i)).toBeInTheDocument();
    // Wait for the getReviews promise to finish
    await waitFor(() => expect(getReviews).toHaveBeenCalled());
  });

  it("renders reviews and shows review form when current user has not reviewed", async () => {
    (getReviews as jest.Mock).mockResolvedValue(reviewsWithoutCurrentUser);

    render(
      <PhotoWithReviews
        currentUser={currentUser}
        photo={samplePhoto}
        type="food"
      />,
    );

    // wait for reviews to load
    await waitFor(() => expect(getReviews).toHaveBeenCalled());

    // Check review item is rendered
    expect(screen.getByText("other@example.com")).toBeInTheDocument();
    expect(screen.getByText("Nice photo!")).toBeInTheDocument();
    // Review form should be visible because currentUser hasn't reviewed yet.
    expect(screen.getByTestId("review-form")).toBeInTheDocument();
  });

  it("does not render the review form when the current user has already reviewed", async () => {
    (getReviews as jest.Mock).mockResolvedValue(reviewsWithCurrentUser);

    render(
      <PhotoWithReviews
        currentUser={currentUser}
        photo={samplePhoto}
        type="food"
      />,
    );

    await waitFor(() => expect(getReviews).toHaveBeenCalled());

    // Check review from current user is rendered
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    expect(screen.getByText("I love it!")).toBeInTheDocument();
    // Review form should not appear if user already reviewed.
    expect(screen.queryByTestId("review-form")).toBeNull();
  });

  it("submits a review and updates the reviews list", async () => {
    // Initially return reviews without the current user
    (getReviews as jest.Mock)
      .mockResolvedValueOnce(reviewsWithoutCurrentUser)
      // After submitting, return reviews including current user's review.
      .mockResolvedValueOnce(reviewsWithCurrentUser);

    render(
      <PhotoWithReviews
        currentUser={currentUser}
        photo={samplePhoto}
        type="food"
      />,
    );

    await waitFor(() => expect(getReviews).toHaveBeenCalledTimes(1));

    // Review form is present and click the submit button in the mocked ReviewForm
    const submitButton = screen.getByRole("button", { name: /Submit Review/i });
    fireEvent.click(submitButton);

    // Ensure addReview is called with expected parameters
    await waitFor(() => {
      expect(addReview).toHaveBeenCalledWith("photo1", "food", "Great!");
    });

    // After review submission, getReviews should be called again to update reviews
    await waitFor(() => {
      expect(getReviews).toHaveBeenCalledTimes(2);
    });

    // Now the current user's review should be rendered and ReviewForm should no longer be visible.
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    expect(screen.getByText("I love it!")).toBeInTheDocument();
    expect(screen.queryByTestId("review-form")).toBeNull();
  });
});
