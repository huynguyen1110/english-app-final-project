package com.example.api.repositories;

import com.example.api.entities.Packages;
import com.example.api.entities.Words;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WordsRepository extends JpaRepository<Words, Long> {

    @Query("SELECT w FROM Words w WHERE w.wordId = :wordId")
    Optional<Words> findWordsByWordId(@Param("wordId") Long wordId);

    @Query("SELECT w FROM Words w WHERE w.isDeleted = false")
    Page<Words> findAllByIsDeletedFalse(Pageable pageable);
}
