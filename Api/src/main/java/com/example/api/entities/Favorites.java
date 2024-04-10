package com.example.api.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Favorites {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long favoriteId;

    @OneToOne(mappedBy = "favorite")
    private Users user;

    @ManyToMany(mappedBy = "favorites")
    private List<News> news;

    @ManyToMany(mappedBy = "favorites")
    private List<Videos> videos;

    @ManyToMany(mappedBy = "favorites")
    private List<Audios> audios;
}
