package com.nvpacademy.Phucacademy.service;

import com.nvpacademy.Phucacademy.model.RatingId;
import com.nvpacademy.Phucacademy.model.Ratings;
import com.nvpacademy.Phucacademy.reponsitory.RatingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class RatingService {
    private static final Logger log = LoggerFactory.getLogger(RatingService.class);
    @Autowired
    private RatingRepository ratingRepository;

    public String saveOrUpdateRating(int courseId, int personId, int rating) {
        RatingId ratingId = new RatingId();
        ratingId.setCourseId(courseId);
        ratingId.setPersonId(personId);

        if (rating >= 1 && rating <= 5) {
            Optional<Ratings> ratingsOptional = ratingRepository.findById(ratingId);

            Ratings rate;
            if (ratingsOptional.isPresent()) {
                rate = ratingsOptional.get();
                rate.setRating(rating);
            } else {
                rate = new Ratings();
                rate.setId(ratingId);
                rate.setRating(rating);
            }

            rate.setTimestamp(LocalDateTime.now());
            log.info("time" + rate.getTimestamp());

            ratingRepository.save(rate);

            return "Rating saved or updated successfully";
        } else {
            return "Invalid rating value. Rating should be between 1 and 5.";
        }
    }

}
