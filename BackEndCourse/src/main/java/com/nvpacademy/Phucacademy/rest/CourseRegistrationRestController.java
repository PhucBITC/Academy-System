package com.nvpacademy.Phucacademy.rest;

import com.nvpacademy.Phucacademy.model.Person;
import com.nvpacademy.Phucacademy.model.Reponse;
import com.nvpacademy.Phucacademy.model.Roles;
import com.nvpacademy.Phucacademy.service.CourseRegistrationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping(path = "/api/regiscourse", produces = { MediaType.APPLICATION_JSON_VALUE,
        MediaType.APPLICATION_XML_VALUE })
public class CourseRegistrationRestController {
    @Autowired
    CourseRegistrationService courseRegistrationService;

    @PostMapping("/auth/addcourse")
    public ResponseEntity<Boolean> createCourse(@RequestParam("personId") int personId,
            @RequestParam("courseIds") List<Integer> courseIds) {
        courseRegistrationService.registerCourses(personId, courseIds);
        return ResponseEntity.status(HttpStatus.OK).body(true);
    }

    @GetMapping("/auth/checkCourseRegis")
    public ResponseEntity<Boolean> checkRegisterCourses(@RequestParam("personId") int personId,
            @RequestParam("courseId") int courseId) {
        boolean check = courseRegistrationService.checkRegisterCourses(personId, courseId);
        return ResponseEntity.status(HttpStatus.OK).body(check);
    }
}
