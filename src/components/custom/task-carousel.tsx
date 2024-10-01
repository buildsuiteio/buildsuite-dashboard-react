import * as React from "react";
import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { TaskDocument } from "@/state/task/taskSlice";
import Image from "next/image";
import { MdDelete } from "react-icons/md";

interface TaskCarouselProps {
  images: TaskDocument[];
  currentIndex: number;
  onDelete: (index: TaskDocument) => void; // Add a prop for the delete function
}

export function TaskCarousel({
  images,
  currentIndex,
  onDelete,
}: TaskCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(currentIndex);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (api) {
      setCount(api.scrollSnapList().length);
      // Scroll to the current index when the component initializes
      api.scrollTo(currentIndex);
      setCurrent(api.selectedScrollSnap() + 1);

      api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1);
      });
    }
  }, [api, currentIndex]);

  const handleDeleteClick = () => {
    onDelete(images[current]); // Trigger the parent delete function with the current index
  };

  return (
    <div className="mx-auto w-full h-full flex flex-col items-center justify-center">
      <Carousel setApi={setApi} className="w-[90%]">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <CardContent className="flex items-center justify-center p-2 rounded-sm">
                <Image
                  width={0}
                  height={0}
                  alt="Image"
                  key={image.id}
                  src={image.file_url_with_protocol}
                  className="h-[80vh] w-[90%] object-contain rounded-sm"
                />
              </CardContent>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
      <MdDelete
        className="text-white text-2xl cursor-pointer"
        onClick={handleDeleteClick} // Handle the delete click
      />
    </div>
  );
}
