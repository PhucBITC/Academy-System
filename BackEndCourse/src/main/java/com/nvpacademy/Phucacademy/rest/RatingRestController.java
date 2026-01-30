package com.nvpacademy.Phucacademy.rest;

import com.nvpacademy.Phucacademy.model.Ratings;
import com.nvpacademy.Phucacademy.reponsitory.RatingRepository;
import com.nvpacademy.Phucacademy.request.RatingUpdateRequest;
import com.nvpacademy.Phucacademy.service.RatingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping(path = "/api/ratings", produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
public class RatingRestController {
    @Autowired
    RatingRepository ratingRepository;
    @Autowired
    RatingService ratingService;

    @GetMapping("/public/count-rating/{courseId}")
    public int getCountRatingByCourseId(@PathVariable int courseId) {
        return ratingRepository.countByIdCourseId(courseId);
    }

    @GetMapping("/public/user_rating/{courseId}")
    public List<Ratings> getRatingsByCourseId(@PathVariable int courseId) {

        return ratingRepository.findByIdCourseId(courseId);
    }

    @PutMapping("/auth/updateRatingUser")
    public String updateRating(@RequestBody RatingUpdateRequest ratingUpdateRequest) {
        int personId = ratingUpdateRequest.getPersonId();
        int courseId = ratingUpdateRequest.getCourseId();
        int newRating = ratingUpdateRequest.getNewRating();

        return ratingService.saveOrUpdateRating(courseId, personId, newRating);
    }
}
