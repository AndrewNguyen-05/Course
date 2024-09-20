package com.spring.dlearning.service;

import jakarta.annotation.PostConstruct;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BannedWordsService {

    private List<String> bannedWords = new ArrayList<>();

    @PostConstruct
    public void loadBannedWords() {
        try {
            ClassPathResource resource = new ClassPathResource("banned_words.txt");
            bannedWords.addAll(Files.readAllLines(resource.getFile().toPath()));
            log.info("banned {}", bannedWords);
        } catch (IOException e) {
            log.error("Lỗi khi đọc file banned_words.txt: ", e);
        }
    }

    public boolean containsBannedWords(String content) {
        for (String word : bannedWords) {
            if (content.toLowerCase().contains(word.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
}

