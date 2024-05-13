package com.example.api.repositories;

import com.example.api.entities.Topic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {

    @Query("SELECT t FROM Topic t WHERE t.id = :id")
    Optional<Topic> findTopicById(@Param("id") Long id);

    @Query("SELECT t FROM Topic t WHERE t.isDeleted = false")
    Page<Topic> findAllActiveTopics(Pageable pageable);
}
