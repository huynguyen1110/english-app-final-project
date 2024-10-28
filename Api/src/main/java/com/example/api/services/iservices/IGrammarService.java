package com.example.api.services.iservices;

import com.example.api.dtos.grammar.GrammarDto;
import com.example.api.entities.Grammar;
import org.springframework.data.domain.Page;

public interface IGrammarService {

    Page<Grammar> getGrammars(int page, int size, String sortField, Boolean sortDirection);

    Grammar createGrammar(GrammarDto grammarDto) throws Exception;

    Grammar updateGrammar(Long id, GrammarDto grammarDto) throws Exception;

    void deleteGrammar(Long id) throws Exception;
}
