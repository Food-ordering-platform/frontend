// components/orders/rating-dialog.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogTrigger, <--- REMOVE THIS IMPORT
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRateOrder } from "@/services/order/order.queries"; 

interface RatingDialogProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function RatingDialog({ orderId, isOpen, onClose }: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { mutateAsync: rateOrder, isPending } = useRateOrder();

  const handleSubmit = async () => {
    if (rating === 0) return toast.error("Please select a star rating");
    try {
      await rateOrder({ orderId, rating, comment });
      toast.success("Thanks for your feedback!");
      onClose();
    } catch (error) {
      toast.error("Failed to submit rating");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* ❌ DELETE <DialogTrigger>...</DialogTrigger> IF IT EXISTS HERE 
         We are controlling 'open' via state, so we don't need a button here.
      */}
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate your Order</DialogTitle>
          <DialogDescription>
            How was your experience? Your feedback helps us improve.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          {/* Star Inputs */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`transition-all hover:scale-110 focus:outline-none ${
                  star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              >
                <Star className={`h-8 w-8 ${star <= rating ? "fill-current" : ""}`} />
              </button>
            ))}
          </div>
          <p className="text-sm font-medium text-gray-600">
            {rating === 5 ? "Excellent! 🤩" : rating > 3 ? "Good 🙂" : rating > 0 ? "Fair 😐" : "Tap a star"}
          </p>

          <Textarea 
            placeholder="Write a short review (optional)..." 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none"
          />
        </div>

        <DialogFooter className="sm:justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending || rating === 0} className="bg-[#7b1e3a] hover:bg-[#60132a]">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}