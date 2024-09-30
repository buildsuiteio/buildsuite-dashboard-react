import { useState } from "react";
import { TaskDocument } from "@/state/task/taskSlice";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
interface TaskImageProps {
  taskImage: TaskDocument;
}

const TaskImage = ({ taskImage }: TaskImageProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setAnchorPoint({ x: event.clientX, y: event.clientY });
    setIsPopoverOpen(true);
  };

  const handleDelete = () => {
    // Handle delete logic
    console.log("Delete image");
    setIsPopoverOpen(false);
  };

  return (
    <div className="relative h-full w-full" onContextMenu={handleContextMenu}>
      <img
        alt="Task Image"
        width={100}
        height={100}
        src={taskImage.file_url_with_protocol}
        className="object-cover w-full h-full"
      />

      {isPopoverOpen && (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="top-4 left-8" />
          </PopoverTrigger>
          <PopoverContent>
            <button className="text-red-600" onClick={handleDelete}>
              Delete Image
            </button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default TaskImage;
