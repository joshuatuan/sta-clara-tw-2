"use client";

import { useState, useEffect } from "react";
import {
  uploadPhoto,
  fetchPhotos,
  deletePhoto,
} from "@/lib/actions/gDriveActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { GDrivePhoto } from "@/app/types/globals";

export default function PhotoDrive() {
  const [photos, setPhotos] = useState<GDrivePhoto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadPhotos = async () => {
      setIsLoading(true);
      const data = await fetchPhotos(searchQuery, sortBy);
      setPhotos(data);
      setIsLoading(false);
    };
    loadPhotos();
  }, [searchQuery, sortBy]);

  const SkeletonGrid = () => (
    <div className="grid grid-cols-3 gap-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="relative aspect-square">
          <Skeleton className="h-full w-full rounded-md" />
        </div>
      ))}
    </div>
  );

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      await uploadPhoto(file, file.name);
      const data = await fetchPhotos(searchQuery, sortBy);
      setPhotos(data);
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    try {
      await deletePhoto(id, fileUrl);
      const data = await fetchPhotos(searchQuery, sortBy);
      setPhotos(data);
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md flex-grow"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-9 rounded-md border p-1 text-sm text-primary shadow-sm dark:bg-black"
        >
          <option value="date">Sort by date</option>
          <option value="name">Sort by name</option>
        </select>
      </div>

      <div>
        <input
          id="file-upload"
          type="file"
          onChange={handleUpload}
          className="hidden"
          disabled={isUploading}
        />
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="min-w-30 text-center"
            disabled={isUploading}
            asChild
          >
            <Label htmlFor="file-upload" className="cursor-pointer">
              {isUploading ? "Uploading..." : "Upload a photo"}
            </Label>
          </Button>
          {isUploading && <Loader2 className="mr-2 h-6 w-6 animate-spin" />}
        </div>
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : (
        // <div className="flex h-32 items-center justify-center">
        //   <Loader2 className="h-8 w-8 animate-spin" />
        // </div>
        <div className="grid grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square">
              <Image
                src={photo.file_url}
                alt={photo.file_name}
                fill
                className="rounded-lg object-cover"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute right-2 top-2"
                onClick={() => handleDelete(photo.id, photo.file_url)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
