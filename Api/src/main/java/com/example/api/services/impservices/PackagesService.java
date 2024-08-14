package com.example.api.services.impservices;

import com.example.api.dtos.packages.PackagesDto;
import com.example.api.entities.News;
import com.example.api.entities.Packages;
import com.example.api.repositories.PackagesRepository;
import com.example.api.services.iservices.IPackagesService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PackagesService implements IPackagesService {

    @Autowired
    private final PackagesRepository packagesRepository;

    @Override
    public Packages createPackage(PackagesDto packagesDto, String userEmail) throws Exception {
        if (packagesDto == null || userEmail.isEmpty()) {
            throw new Exception("Can not create package: Invalid input");
        }

        Packages packages = Packages.builder()
                .name(packagesDto.getName())
                .createBy(userEmail)
                .isDeleted(false)
                .description(packagesDto.getDescription())
                .numOfDownloaded(0)
                .isPublished(packagesDto.getIsPublished())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        packagesRepository.save(packages);
        return packages;
    }

    @Override
    public Packages updatePackage(PackagesDto packagesDto, Long id) throws Exception {

        Optional<Packages> packagesOptional = packagesRepository.findPackagesById(id);

        Packages packages = packagesOptional.orElseThrow(() -> new Exception("Can not find package"));

        packages.setName(packagesDto.getName());
        packages.setDescription(packagesDto.getDescription());
        packages.setUpdatedAt(LocalDateTime.now());
        packages.setIsPublished(packagesDto.getIsPublished());

        packagesRepository.save(packages);
        return packages;
    }

    @Override
    public void deletePackageById(Long id) throws Exception {
        Optional<Packages> packagesOptional = packagesRepository.findPackagesById(id);

        Packages packages = packagesOptional.orElseThrow(() -> new Exception("Can not find package"));

        packages.setIsDeleted(true);
        packages.setDeletedAt(LocalDateTime.now());

        packagesRepository.save(packages);
    }

    @Override
    public Page<Packages> getAllPackages(int page, int size, String sortField, Boolean sortDirection, String createBy) {
        // check if the field is valid or not
        boolean isValidField = Arrays.stream(Packages.class.getDeclaredFields())
                .map(Field::getName)
                .anyMatch(fieldName -> fieldName.equals(sortField));

        if (!isValidField) {
            throw new IllegalArgumentException("Invalid sortField: " + sortField);
        }

        // If sortDirection == true then sort in ascending order, if false then sort in descending order
        Sort.Direction direction = (sortDirection != null && sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        return packagesRepository.findAllByIsDeletedFalse(createBy, pageable);
    }

}
