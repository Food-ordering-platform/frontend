import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function RatingModal({ orderId, isOpen, onClose, onSubmit }: any) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit({ orderId, rating, comment });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate your Order</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)}>
                <Star 
                  size={32} 
                  className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                />
              </button>
            ))}
          </div>
          
          <Textarea 
            placeholder="How was the food?" 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          
          <Button onClick={handleSubmit} disabled={rating === 0} className="w-full">
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}