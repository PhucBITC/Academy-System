package com.nvpacademy.Phucacademy.reponsitory;

import com.nvpacademy.Phucacademy.model.CourseRegistration;
import com.nvpacademy.Phucacademy.model.CourseRegistrationId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRegistrationReponsitory extends JpaRepository<CourseRegistration, CourseRegistrationId> {

}
