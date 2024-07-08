package com.example.api.services.iservices;

import com.example.api.dtos.words.WordDto;
import com.example.api.entities.Words;
import org.springframework.data.domain.Page;

public interface IWordService {

    Words createWord(WordDto wordDto) throws Exception;

    Words updateWord(WordDto wordDto, Long id) throws Exception;

    void deleteWord(Long id) throws Exception;

    Page<Words> getAllWords(int page, int size, String sortField, Boolean sortDirection);
}
