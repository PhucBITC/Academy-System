package com.nvpacademy.Phucacademy.rest;

import com.nvpacademy.Phucacademy.model.Comments;
import com.nvpacademy.Phucacademy.reponsitory.CommentRepository;
import com.nvpacademy.Phucacademy.request.CommentRequest;
import com.nvpacademy.Phucacademy.service.CommentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping(path = "/api/comments", produces = { MediaType.APPLICATION_JSON_VALUE,
        MediaType.APPLICATION_XML_VALUE })
public class CommentReponsitory {

    @Autowired
    CommentRepository commentRepository;
    @Autowired
    private CommentService commentService;

    @GetMapping("/public/getOriginalComment")
    public List<Comments> getOriginalComment(@RequestParam int courseId) {
        return commentRepository.findByCoursesCourseIdAndParentIsNull(courseId);
    }

    @GetMapping("/public/getCommentRelies")
    public List<Comments> getCommentRelies(@RequestParam List<Integer> parentIds) {
        return commentRepository.findByParentCommentIdIn(parentIds);
    }

    @PostMapping("/auth/createComment")
    public ResponseEntity<Comments> createComment(@RequestBody CommentRequest commentRequest) {
        try {
            Comments createComment = commentService.createComment(
                    commentRequest.getContent(),
                    commentRequest.getDatetime(),
                    commentRequest.getCourseId(),
                    commentRequest.getPersonId(),
                    commentRequest.getParentId());
            return ResponseEntity.ok(createComment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

}
