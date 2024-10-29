package com.example.api.services.impservices;

import com.example.api.dtos.grammar.GrammarDto;
import com.example.api.entities.Grammar;
import com.example.api.repositories.GrammarRepository;
import com.example.api.services.iservices.IGrammarService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.lang.reflect.Field;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
@AllArgsConstructor
public class GrammarService implements IGrammarService {

    @Autowired
    private final GrammarRepository grammarRepository;

    public Page<Grammar> getGrammars(int page, int size, String sortField, Boolean sortDirection) {
        // Kiểm tra tính hợp lệ của sortField
        boolean isValidField = Arrays.stream(Grammar.class.getDeclaredFields())
                .map(Field::getName)
                .anyMatch(fieldName -> fieldName.equals(sortField));

        if (!isValidField) {
            throw new IllegalArgumentException("Invalid sortField: " + sortField);
        }

        // Đặt hướng sắp xếp dựa trên sortDirection
        Sort.Direction direction = (sortDirection != null && sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        return grammarRepository.findAllByIsDeletedFalse(pageable);
    }

    @Override
    public Grammar createGrammar(GrammarDto grammarDto) throws Exception {
        try {
            Grammar grammar = new Grammar();
            grammar.setTitle(grammarDto.getTitle());
            grammar.setDescription(grammarDto.getDescription());
            grammar.setContent(grammarDto.getContent());
            grammar.setCreateBy(grammarDto.getCreateBy());
            grammar.setCreatedDate(LocalDateTime.now());
            grammar.setIsDeleted(false);
            grammar.setIsPublished(grammarDto.getIsPublished());

            return grammarRepository.save(grammar);
        } catch (Exception e) {
            throw new Exception("Failed to create Grammar");
        }
    }

    @Override
    public Grammar updateGrammar(Long id, GrammarDto grammarDto) throws Exception {
        // Tìm đối tượng Grammar theo id
        Grammar grammar = grammarRepository.findById(id)
                .orElseThrow(() -> new Exception("Grammar with ID " + id + " not found"));

        // Cập nhật các trường từ grammarDto
        grammar.setTitle(grammarDto.getTitle());
        grammar.setDescription(grammarDto.getDescription());
        grammar.setContent(grammarDto.getContent());
        grammar.setUpdateBy(grammarDto.getUpdateBy());
        grammar.setUpdatedDate(LocalDateTime.now());
        grammar.setIsPublished(grammarDto.getIsPublished());

        // Lưu lại Grammar đã cập nhật
        return grammarRepository.save(grammar);
    }

    @Override
    public void deleteGrammar(Long id) throws Exception {
        Grammar grammar = grammarRepository.findById(id)
                .orElseThrow(() -> new Exception("Grammar with ID " + id + " not found"));
        grammar.setIsDeleted(true);
        grammar.setDeletedDate(LocalDateTime.now());
        grammarRepository.save(grammar);
    }
}
