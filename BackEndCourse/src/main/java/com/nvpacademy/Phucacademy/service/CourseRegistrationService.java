package com.nvpacademy.Phucacademy.service;

import com.nvpacademy.Phucacademy.model.CourseRegistration;
import com.nvpacademy.Phucacademy.model.CourseRegistrationId;
import com.nvpacademy.Phucacademy.reponsitory.CourseRegistrationReponsitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CourseRegistrationService {
    @Autowired
    CourseRegistrationReponsitory courseRegistrationReponsitory;

    public void registerCourses(int personId, List<Integer> courseIds) {
        List<CourseRegistration> registrations = new ArrayList<>();

        for (Integer courseId : courseIds) {
            CourseRegistrationId registrationId = new CourseRegistrationId(personId, courseId);
            CourseRegistration registration = new CourseRegistration(registrationId);
            registrations.add(registration);
        }

        courseRegistrationReponsitory.saveAll(registrations);
    }

    public boolean checkRegisterCourses(int personId, int courseId) {
        CourseRegistrationId courseRegistrationId = new CourseRegistrationId(personId, courseId);
        Optional<CourseRegistration> courseRegistration = courseRegistrationReponsitory.findById(courseRegistrationId);
        if (courseRegistration.isPresent()) {
            return true;
        } else {
            return false;
        }
    }
}
