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

interface TaskCarouselProps {
  images: TaskDocument[];
  currentIndex: number;
}

export function TaskCarousel({ images, currentIndex }: TaskCarouselProps) {
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
    </div>
  );
}
