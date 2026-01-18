"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface RatingDialogProps {
  orderId: string;
  trigger?: React.ReactNode;
  onSubmit?: (rating: number, comment: string) => Promise<void>;
}

export function RatingDialog({ orderId, trigger, onSubmit }: RatingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // If you have a prop function, use it, otherwise call API here
      if (onSubmit) {
        await onSubmit(rating, comment);
      } else {
        // Example API call
        // await api.post(`/orders/${orderId}/rate`, { rating, comment });
        console.log("Rated:", { orderId, rating, comment });
      }
      toast.success("Thanks for your feedback!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={isSubmitting || rating === 0} 
            className="w-full bg-[#7b1e3a] hover:bg-[#60132a]"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}