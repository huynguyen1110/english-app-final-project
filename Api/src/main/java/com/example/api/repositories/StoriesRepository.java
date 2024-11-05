package com.example.api.repositories;

import com.example.api.entities.Stories;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoriesRepository extends JpaRepository<Stories, Long> {

    Page<Stories> findAllByIsDeletedFalse(Pageable pageable);
}
