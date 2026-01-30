package com.nvpacademy.Phucacademy.reponsitory;

import com.nvpacademy.Phucacademy.model.Person;
import com.nvpacademy.Phucacademy.model.RatingId;
import com.nvpacademy.Phucacademy.model.Ratings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Ratings, RatingId> {
    int countByIdCourseId(int courseId);

    List<Ratings> findByIdCourseId(int courseId);

}
