package com.spring.dlearning.schedule;

import com.spring.dlearning.entity.InvalidatedToken;
import com.spring.dlearning.repository.InvalidatedTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class TokenCleanupScheduler {

    final InvalidatedTokenRepository invalidatedTokenRepository;

    @Scheduled(fixedRate = 3600000) // Chạy mỗi giờ
    public void cleanupExpiredTokens(){
        System.out.println("Start Scheduler Delete Token Expired");
        List<InvalidatedToken> invalidatedTokens = invalidatedTokenRepository.findAll();
        if(! invalidatedTokens.isEmpty()){
            invalidatedTokenRepository.deleteAll();
        }
    }
}
