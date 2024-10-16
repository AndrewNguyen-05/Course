package com.spring.dlearning.repository;

import com.spring.dlearning.entity.Advertisement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {

    @Query("SELECT ads FROM Advertisement ads WHERE ads.user.id = :userId ORDER BY ads.createdAt DESC")
    Page<Advertisement> findAdvertisementByUserId(Long userId, Pageable pageable);

    @Query(value = "SELECT * FROM advertisements WHERE approval_status = :status", nativeQuery = true)
    List<Advertisement> findAdvertisementByApprovalStatusActive(@Param("status") String status);

}
