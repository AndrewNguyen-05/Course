package com.spring.dlearning.schedule;

import com.spring.dlearning.entity.Advertisement;
import com.spring.dlearning.repository.AdvertisementRepository;
import com.spring.dlearning.utils.AdsStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdsCleanUpScheduler {
    private final AdvertisementRepository adRepository;

    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanAds() {
        List<Advertisement> ads = adRepository.findAll();
        if(!ads.isEmpty()) {
            ads.stream()
                    .filter(a ->  a.getApprovalStatus().equals(AdsStatus.ACTIVE) && a.getEndDate().isBefore(LocalDate.now()))
                    .forEach(a -> {
                        a.setApprovalStatus(AdsStatus.COMPLETED);
                        adRepository.save(a);
                        log.info("Ad ID {} has been updated to COMPLETED.", a.getId());
                    });
        }
    }
}

/*
0 0 0 * * ?:
0: Giây (bắt đầu tại giây 0).
0: Phút (bắt đầu tại phút 0).
0: Giờ (vào lúc 12 giờ đêm, tức 00:00).
*: Mọi ngày trong tháng.
*: Mọi tháng.
?: Bỏ qua thông số ngày trong tuần (không cần thiết ở đây)
*/
