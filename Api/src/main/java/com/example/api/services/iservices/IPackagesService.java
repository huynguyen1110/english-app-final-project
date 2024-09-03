package com.example.api.services.iservices;

import com.example.api.dtos.packages.PackagesDto;
import com.example.api.entities.Packages;
import com.example.api.services.impservices.PackagesService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface IPackagesService {
    Packages createPackage(PackagesDto packagesDto, String userEmail) throws Exception;

    Packages updatePackage(PackagesDto packagesDto, Long id) throws Exception;

    void deletePackageById(Long id) throws Exception;

    Page<Packages> getAllPackages(int page, int size, String sortField, Boolean sortDirection, String createBy, Boolean isPublished);
}
