// food-ordering-platform/frontend/frontend-wip-staging/components/orders/rating-dialog.tsx

"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react"; // Added Loader2
import { toast } from "sonner";
import { useRateOrder } from "@/services/order/order.queries"; // 🟢 Import Hook

interface RatingDialogProps {
  orderId: string;
  trigger?: React.ReactNode;
  // removed onSubmit prop since we handle it internally now, 
  // or you can keep it optional for flexibility
  onSuccess?: () => void; 
}

export function RatingDialog({ orderId, trigger, onSuccess }: RatingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  
  // 🟢 Use the hook
  const { mutate: submitRating, isPending } = useRateOrder();

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    
    submitRating(
      { orderId, rating, comment },
      {
        onSuccess: () => {
          setIsOpen(false);
          if (onSuccess) onSuccess();
          // Reset form
          setRating(0);
          setComment("");
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Rate Order</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">How was your order?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  size={36}
                  className={`${
                    star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                  } transition-colors duration-200`}
                />
              </button>
            ))}
          </div>
          
          <Textarea
            placeholder="Tell us more about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none"
            rows={4}
          />
          
          <Button 
            onClick={handleSubmit} 
            disabled={isPending || rating === 0} 
            className="w-full bg-[#7b1e3a] hover:bg-[#60132a]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}