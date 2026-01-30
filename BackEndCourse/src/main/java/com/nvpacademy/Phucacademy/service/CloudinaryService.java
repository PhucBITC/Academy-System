package com.nvpacademy.Phucacademy.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {
    @Autowired
    private Cloudinary cloudinary;

    // public String uploadFile(MultipartFile file) {
    // try {
    // Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
    // ObjectUtils.asMap("resource_type", "auto"));
    // return uploadResult.get("url").toString();
    // } catch (IOException e) {
    // throw new RuntimeException("Upload failed: " + e.getMessage());
    // }
    // }
    public String uploadWithPreset(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "video",
                            "upload_preset", "compress_video" // Sử dụng preset tối ưu
                    ));
            return uploadResult.get("url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Upload failed: " + e.getMessage());
        }
    }

}
