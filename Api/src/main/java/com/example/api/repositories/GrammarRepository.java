package com.example.api.repositories;

import com.example.api.entities.Grammar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GrammarRepository extends JpaRepository<Grammar, Long> {
}
