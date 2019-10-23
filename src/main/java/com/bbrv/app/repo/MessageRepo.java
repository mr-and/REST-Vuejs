package com.bbrv.app.repo;

import com.bbrv.app.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepo extends JpaRepository<Message, Long> {



}
