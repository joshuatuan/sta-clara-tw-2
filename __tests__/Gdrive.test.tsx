import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  uploadPhoto,
  fetchPhotos,
  deletePhoto,
} from "@/lib/actions/gDriveActions";
import PhotoDrive from "@/components/features/PhotoDrive";

jest.mock("@/lib/actions/gDriveActions");

const mockPhotos = [
  {
    id: "1",
    file_name: "photo1.jpg",
    file_url: "http://example.com/photo1.jpg",
  },
  {
    id: "2",
    file_name: "photo2.jpg",
    file_url: "http://example.com/photo2.jpg",
  },
  {
    id: "3",
    file_name: "photo3.jpg",
    file_url: "http://example.com/photo3.jpg",
  },
];

describe("PhotoDrive", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component", async () => {
    (fetchPhotos as jest.Mock).mockResolvedValue(mockPhotos);

    render(<PhotoDrive />);

    expect(screen.getByPlaceholderText("Search by name")).toBeInTheDocument();
    expect(screen.getByText("Upload a photo")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByAltText("photo1.jpg")).toBeInTheDocument();
      expect(screen.getByAltText("photo2.jpg")).toBeInTheDocument();
      expect(screen.getByAltText("photo3.jpg")).toBeInTheDocument();
    });
  });

  it("handles photo upload", async () => {
    (fetchPhotos as jest.Mock).mockResolvedValue(mockPhotos);
    (uploadPhoto as jest.Mock).mockResolvedValue({});

    render(<PhotoDrive />);

    const fileInput = screen.getByLabelText("Upload a photo");
    const file = new File(["photo"], "photo.jpg", { type: "image/jpeg" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(uploadPhoto).toHaveBeenCalledWith(file, "photo.jpg");

    await waitFor(() => {
      expect(fetchPhotos).toHaveBeenCalledTimes(2);
    });
  });

  it("handles photo deletion", async () => {
    (fetchPhotos as jest.Mock).mockResolvedValue(mockPhotos);
    (deletePhoto as jest.Mock).mockResolvedValue({});

    render(<PhotoDrive />);

    await waitFor(() => {
      expect(screen.getByAltText("photo1.jpg")).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteButton);

    expect(deletePhoto).toHaveBeenCalledWith(
      "1",
      "http://example.com/photo1.jpg",
    );

    await waitFor(() => {
      expect(fetchPhotos).toHaveBeenCalledTimes(2);
    });
  });

  it("handles search query change", async () => {
    (fetchPhotos as jest.Mock).mockResolvedValue(mockPhotos);

    render(<PhotoDrive />);

    const searchInput = screen.getByPlaceholderText("Search by name");
    fireEvent.change(searchInput, { target: { value: "photo1" } });

    await waitFor(() => {
      expect(fetchPhotos).toHaveBeenCalledWith("photo1", "date");
    });
  });

  it("handles sort by change", async () => {
    (fetchPhotos as jest.Mock).mockResolvedValue(mockPhotos);

    render(<PhotoDrive />);

    const sortBySelect = screen.getByDisplayValue("Sort by date");
    fireEvent.change(sortBySelect, { target: { value: "name" } });

    await waitFor(() => {
      expect(fetchPhotos).toHaveBeenCalledWith("", "name");
    });
  });
});
