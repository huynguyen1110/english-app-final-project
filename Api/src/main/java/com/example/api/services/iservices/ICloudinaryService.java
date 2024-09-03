package com.example.api.services.iservices;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface ICloudinaryService {

    Map uploadFile(MultipartFile file, String folderName) throws IOException;
}
