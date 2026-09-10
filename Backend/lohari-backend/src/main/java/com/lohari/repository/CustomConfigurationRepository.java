package com.lohari.repository;

import com.lohari.model.CustomConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomConfigurationRepository extends JpaRepository<CustomConfiguration, Long> {
}