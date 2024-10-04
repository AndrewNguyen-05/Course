package com.spring.dlearning.repository;

import com.spring.dlearning.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c where c.post.id = :postId order by c.createdAt desc ")
    Page<Comment> findCommentByPostId(Long postId, Pageable pageable);

}
