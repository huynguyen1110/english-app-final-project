package com.example.api.repositories;

import com.example.api.entities.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    @Query("SELECT n FROM News n LEFT JOIN n.topic t WHERE n.isDeleted = false AND (:topicId IS NULL OR t.id = :topicId)")
    Page<News> findAllNews(@Param("topicId") Long topicId, Pageable pageable);

    @Query("SELECT n FROM News n WHERE n.newsId = :newsId AND n.isDeleted = false")
    Optional<News> findNewsById(@Param("newsId") Long newsId);

    // Query to get paginated news where isDeleted is false and sourceName matches
    @Query("SELECT n FROM News n WHERE n.isDeleted = false AND n.sourceName = :sourceName")
    Page<News> findBySourceNameAndIsDeletedFalse(Pageable pageable, String sourceName);
}
