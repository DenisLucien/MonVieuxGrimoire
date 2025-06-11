import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true },
    },
  ],
  averageRating: { type: Number, required: true, default: 0 },
});

bookSchema.methods.calculateAverageRating = function (): Number {
  if (this.ratings.length > 0) {
    const total = this.ratings.reduce(
      (sum: number, rating: { userId: string; grade: number }) =>
        sum + rating.grade,
      0
    );
    this.averageRating = Math.round((total / this.ratings.length)*10)/10;
  } else {
    this.averageRating = 0;
  }
  return this.averageRating;
};

type BookDocument = mongoose.InferSchemaType<typeof bookSchema> & {
  calculateAverageRating: () => number;
};

const Book = mongoose.model<BookDocument>("Book", bookSchema);
export default Book;
export type { BookDocument };
