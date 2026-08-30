package com.tanmay.study_session_tracker;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

@RestController
public class StudySessionController {
        StudySessionManager manager=new StudySessionManager();



        @PostMapping("/sessions")
        public  void addTask(@RequestBody StudySession session){
            manager.addSession(
                    session.getSubject(),
                    session.getDuration(),
                    session.getStatus()
            );
        }

    @GetMapping("/sessions/{id}")
    public ResponseEntity<StudySession> getSession(@PathVariable String id) {

        StudySession session = manager.findSession(id);

        if (session == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(session);
    }

    @PutMapping("/sessions/{id}")
    public ResponseEntity<StudySession> updateSession(
            @RequestBody StudySession session,
            @PathVariable String id) {

        StudySession updatedSession = manager.updateSession(
                id,
                session.getSubject(),
                session.getDuration(),
                session.getStatus()
        );

        if (updatedSession == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedSession);
    }

    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable String id) {


        boolean deleted = manager.deleteSession(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    @GetMapping("sessions/total-duration")
    public  int totalDur(){
        return   manager.getTotalDuration();

    }

    @GetMapping("sessions/longest")
    public StudySession longest(){
             return manager.getLongestSession();
    }


    @GetMapping("/sessions")
    public List<StudySession> getSessions(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String status) {

        if (subject != null) {
            return manager.filterSubjects(subject);
        }

        if (status != null) {
            return manager.filterByStatus(status);
        }

        return manager.getSessions();
    }










}
