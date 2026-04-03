package services;

import dao.ReviewDAO;
import models.Review;
import java.util.List;

public class ReviewService {
    private final ReviewDAO reviewDAO = new ReviewDAO();

    public List<Review> getReviewsByUser(int reviewedUserId) {
        return reviewDAO.getReviewsByUser(reviewedUserId);
    }

    public boolean addReview(Review review) {
        if (review.getRating() < 1 || review.getRating() > 5) {
            System.err.println("Rating must be between 1 and 5.");
            return false;
        }
        return reviewDAO.addReview(review);
    }
}
