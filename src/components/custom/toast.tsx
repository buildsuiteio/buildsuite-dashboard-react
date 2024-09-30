import { toast } from "../ui/use-toast";

export const showSuccessToast = (message: string) => {
  toast({
    title: "Success",
    description: message,
  });
};

export const showErrorToast = (message: string) => {
  toast({
    title: "Error",
    description: message,
  });
};
