package com.nvpacademy.Phucacademy.request;

import lombok.Data;

@Data
public class RatingUpdateRequest {
    private int personId;
    private int courseId;
    private int newRating;
}
