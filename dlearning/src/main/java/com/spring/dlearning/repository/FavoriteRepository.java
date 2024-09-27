package com.spring.dlearning.repository;

import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.Favorite;
import com.spring.dlearning.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {
    Page<Favorite> findByUser(User user, Pageable pageable);

    List<Favorite> findByUser(User user);

    boolean existsByUserAndCourse(User user, Course course);
}
