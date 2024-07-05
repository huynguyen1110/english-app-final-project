package com.example.api.repositories;

import com.example.api.entities.Packages;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PackagesRepository extends JpaRepository<Packages, Long> {

    @Query("SELECT p FROM Packages p WHERE p.id = :packageId and p.isDeleted = false ")
    Optional<Packages> findPackagesById(@Param("packageId") Long packageId);

    @Query("SELECT p FROM Packages p WHERE p.isDeleted = false")
    Page<Packages> findAllByIsDeletedFalse(Pageable pageable);
}
