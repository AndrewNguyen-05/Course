package com.spring.dlearning.repository;

import com.spring.dlearning.entity.User;
import com.spring.dlearning.utils.RegistrationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, CustomUserRepository {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.role.name = :roleName")
    Page<User> findByRoleName(@Param("roleName") String roleName, Pageable pageable);


    @Query("SELECT u FROM User u WHERE u.role.name = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);

    @Query("SELECT u FROM User u WHERE u.role.name = :roleName AND " +
            "(LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<User> searchByRoleAndKeywords(@Param("roleName") String roleName,
                                       @Param("keyword") String keyword,
                                       Pageable pageable);


    @Query("SELECT u FROM User u WHERE u.role.name = :roleName AND u.registrationStatus = :status")
    Page<User> findByRoleNameAndRegistrationStatus(@Param("roleName") String roleName,
                                                   @Param("status") RegistrationStatus status,
                                                   Pageable pageable);
}
