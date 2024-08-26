package com.example.api.services.iservices;

import com.example.api.entities.News;
import com.example.api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IFavoritesService {

    void addNewsToFavorite(String userEmail, Long newsId) throws Exception;

    Page<News> getFavoriteNews(int page, int size, String sortField, Boolean sortDirection, String userEmail) throws Exception;
}
