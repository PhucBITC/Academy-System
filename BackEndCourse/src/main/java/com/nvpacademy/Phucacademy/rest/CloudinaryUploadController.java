package com.nvpacademy.Phucacademy.rest;

import com.nvpacademy.Phucacademy.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/clupload")
public class CloudinaryUploadController {
    @Autowired
    private CloudinaryService cloudinaryService;
    // @PostMapping
    // public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file)
    // {
    // String fileUrl = cloudinaryService.uploadFile(file);
    // return ResponseEntity.ok().body("File uploaded successfully: " + fileUrl);
    // }

    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        // Kiểm tra nếu không có file được gửi lên
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty. Please upload a valid file.");
        }

        // Kiểm tra định dạng file
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.startsWith("image/") && !contentType.startsWith("video/"))) {
            return ResponseEntity.badRequest().body("Invalid file type. Only images and videos are allowed.");
        }

        try {
            // Upload file lên Cloudinary
            String fileUrl = cloudinaryService.uploadWithPreset(file);

            // Trả về kết quả dưới dạng JSON
            Map<String, String> response = new HashMap<>();
            response.put("message", "File uploaded successfully");
            response.put("url", fileUrl);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Xử lý lỗi khi upload thất bại
            return ResponseEntity.status(500).body("An error occurred while uploading the file: " + e.getMessage());
        }
    }
}
