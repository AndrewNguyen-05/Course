package com.spring.dlearning.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FileService {

    /**
     * save file
     * @param file
     * @param folder
     */
    public String store(MultipartFile file, String folder) throws URISyntaxException, IOException {
        String encodedFileName = URLEncoder.encode(Objects.requireNonNull(file.getOriginalFilename()), StandardCharsets.UTF_8);
        String finalName = System.currentTimeMillis() + "-" + encodedFileName;

        URI uri = new URI("file:///E:/Course/" + folder + "/" + finalName);
        log.info("URI: {}", uri);

        Path path = Paths.get(uri);
        log.info("Path: {}", path);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);
        }

        return finalName;
    }

}

