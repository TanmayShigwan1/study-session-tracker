package com.tanmay.study_session_tracker;

public class StudySession {
    private  String id;
    private String subject;
    private  int duration;
    private  String status;

    public StudySession(){

    }

    public StudySession(String id, String subject, int duration, String status) {
        this.id = id;
        this.subject = subject;
        this.duration = duration;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
