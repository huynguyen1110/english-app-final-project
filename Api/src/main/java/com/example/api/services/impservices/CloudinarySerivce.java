package com.example.api.services.impservices;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.api.services.iservices.ICloudinaryService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@AllArgsConstructor
public class CloudinarySerivce implements ICloudinaryService {

    private final Cloudinary cloudinary;


    // upload image
    @Override
    public Map uploadFile(MultipartFile file, String folderName) throws IOException {
        String contentType = file.getContentType();

        String resourceType;
        if (contentType != null && contentType.startsWith("image/")) {
            resourceType = "image";
        } else if (contentType != null && contentType.startsWith("audio/")) {
            resourceType = "video"; // Dùng "video" để hỗ trợ phát MP3
        } else {
            throw new IllegalArgumentException("Chỉ hỗ trợ ảnh hoặc file MP3.");
        }

        return cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", resourceType,
                        "folder", folderName
                ));
    }

}
