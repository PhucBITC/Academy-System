package com.nvpacademy.Phucacademy.service;

import com.nvpacademy.Phucacademy.model.Comments;
import com.nvpacademy.Phucacademy.model.Courses;
import com.nvpacademy.Phucacademy.model.Person;
import com.nvpacademy.Phucacademy.reponsitory.CommentRepository;
import com.nvpacademy.Phucacademy.reponsitory.CourseRepository;
import com.nvpacademy.Phucacademy.reponsitory.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class CommentService {
    @Autowired
    PersonRepository personRepository;
    @Autowired
    CourseRepository courseRepository;
    @Autowired
    CommentRepository commentRepository;

    public Comments createComment(String content, String datetime, int courseId, int personId, int parentId) {
        Optional<Courses> courses = courseRepository.findById(courseId);
        Optional<Person> person = personRepository.findById(personId);
        if (courses.isPresent() && person.isPresent()) {
            Comments comments = new Comments();
            comments.setContent(content);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss dd/MM/yyyy");
            LocalDateTime localDateTime = LocalDateTime.parse(datetime, formatter);
            comments.setCreatedAt(localDateTime);
            comments.setCourses(courses.get());
            comments.setPerson(person.get());
            if (parentId != 0) {
                Optional<Comments> parentComment = commentRepository.findById(parentId);
                if (parentComment.isPresent()) {
                    comments.setParent(parentComment.get());
                } else {
                    throw new RuntimeException("Invalid parentId");
                }
            } else {
                comments.setParent(null);
            }
            return commentRepository.save(comments);
        }
        throw new RuntimeException("Invalid courseId or personId");
    }
}
