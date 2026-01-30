package com.nvpacademy.Phucacademy.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "courseregistration")
public class CourseRegistration {
    @EmbeddedId
    private CourseRegistrationId id;

    @CreatedDate
    @Column(updatable = false)
    @JsonIgnore
    private LocalDateTime registrationDate;

    public CourseRegistration(CourseRegistrationId id) {
        this.id = id;
    }

}
