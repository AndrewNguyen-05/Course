package com.spring.dlearning.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FileService {

    @Value("${upload-file.base-uri}")
    @NonFinal
    String baseURI;

    /**
     * new a folder if not exists
     * @param folder -> represents the directory you want to create
     * @throws URISyntaxException
     */
    public void createDirectory(String folder) throws URISyntaxException {
        /*
        URI: đường link thanh URL
        PAth: đường link trên máy tính của chúng ta
         */
        URI uri = new URI(folder);
        Path path = Paths.get(uri);
        File tmpDir = new File(path.toString());
        if(!tmpDir.isDirectory()){
            try {
                Files.createDirectory(tmpDir.toPath());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    /**
     * save file
     * @param file
     * @param folder
     */
    public String store(MultipartFile file, String folder) throws URISyntaxException, IOException {
        String finalName = System.currentTimeMillis() + "-" + file.getOriginalFilename();
        URI uri = new URI("file:///C:/D-Learning/" + folder + "/" +finalName);
        log.info("uri {}", uri );
        Path path = Paths.get(uri);
        try(InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);
        }
        return finalName;
    }

    public long getFileLength(String fileName, String folder) throws URISyntaxException {

        URI uri = new URI(baseURI + folder + "/" + fileName);
        Path path = Paths.get(uri);

        File tmpDir = new File(path.toString());
        if(!tmpDir.isDirectory() || tmpDir.exists()){
            return 0;
        }
        return tmpDir.length();
    }

    public InputStreamResource getResource(String fileName, String folder) throws URISyntaxException, FileNotFoundException {
        URI uri = new URI(baseURI + folder + "/" + fileName);
        Path path = Paths.get(uri);

        File file = new File(path.toString());

        return new InputStreamResource(new FileInputStream(file));
    }
}

