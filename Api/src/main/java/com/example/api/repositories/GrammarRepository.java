package com.example.api.repositories;

import com.example.api.entities.Grammar;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GrammarRepository extends JpaRepository<Grammar, Long> {

    Page<Grammar> findAllByIsDeletedFalse(Pageable pageable);
}
