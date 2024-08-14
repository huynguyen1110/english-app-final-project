package com.example.api.services.impservices;

import com.example.api.dtos.words.WordDto;
import com.example.api.entities.Packages;
import com.example.api.entities.Words;
import com.example.api.repositories.PackagesRepository;
import com.example.api.repositories.WordsRepository;
import com.example.api.services.iservices.IWordService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

@Service
@AllArgsConstructor
public class WordSerivce implements IWordService {

    @Autowired
    private final WordsRepository wordsRepository;

    @Autowired
    private final PackagesRepository packagesRepository;

    @Override
    public Words createWord(WordDto wordDto) {
        validateWordDto(wordDto);

        Words newWord = Words.builder()
                .name(wordDto.getName())
                .wordType(wordDto.getWordType())
                .description(wordDto.getDescription())
                .meaning(wordDto.getMeaning())
                .example(wordDto.getExample())
                .image(wordDto.getImage())
                .isDeleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return wordsRepository.save(newWord);
    }

    @Override
    public Words updateWord(WordDto wordDto, Long id) throws Exception {
        validateWordDto(wordDto);

        if (id == null) {
            throw new Exception("param (id) is required");
        }

        Words word = wordsRepository.findById(id)
                .orElseThrow(() -> new Exception("Cannot find word with id: " + id));

        word.setName(wordDto.getName());
        word.setDescription(wordDto.getDescription());
        word.setWordType(wordDto.getWordType());
        word.setMeaning(wordDto.getMeaning());
        word.setImage(wordDto.getImage());
        word.setUpdatedAt(LocalDateTime.now());

        return wordsRepository.save(word);
    }

    @Override
    public void deleteWord(Long id) throws Exception {
        Words word = wordsRepository.findById(id)
                .orElseThrow(() -> new Exception("Cannot find word with id: " + id));

        word.setIsDeleted(true);
        word.setDeletedAt(LocalDateTime.now());
        wordsRepository.save(word);
    }

    @Override
    public Page<Words> getAllWords(int page, int size, String sortField, Boolean sortDirection) {
        // check is field valid or not
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
        return wordsRepository.findAllByIsDeletedFalse(pageable);
    }

    @Override
    public void addwordToPackage(Long wordId, Long packageId) throws Exception {
        Optional<Words> wordOptional = wordsRepository.findWordsByWordId(wordId);
        Optional<Packages> packageOptional = packagesRepository.findPackagesById(packageId);

        if (wordOptional.isPresent() && packageOptional.isPresent()) {
            Words word = wordOptional.get();
            Packages pack = packageOptional.get();

            word.getPackages().add(pack);
            pack.getWords().add(word);
            pack.setUpdatedAt(LocalDateTime.now());

            wordsRepository.save(word);
            packagesRepository.save(pack);
        } else {
            throw new Exception("Word or Package not found");
        }
    }

    @Override
    public void removeWordFromPackage(Long wordId, Long packageId) throws Exception {
        Optional<Words> wordOptional = wordsRepository.findWordsByWordId(wordId);
        Optional<Packages> packageOptional = packagesRepository.findPackagesById(packageId);

        if (wordOptional.isPresent() && packageOptional.isPresent()) {
            Words word = wordOptional.get();
            Packages pack = packageOptional.get();

            word.getPackages().remove(pack);
            pack.getWords().remove(word);

            wordsRepository.save(word);
            packagesRepository.save(pack);
        } else {
            throw new Exception("Word or Package not found");
        }
    }

    private void validateWordDto(WordDto wordDto) {
        if (wordDto == null) {
            throw new IllegalArgumentException("Create word failed: wordDto is null");
        }

        if (wordDto.getName() == null || wordDto.getWordType() == null ||
                wordDto.getDescription() == null || wordDto.getMeaning() == null ||
                wordDto.getImage() == null) {
            throw new IllegalArgumentException("Create word failed: one or more fields in wordDto are null");
        }
    }
}
