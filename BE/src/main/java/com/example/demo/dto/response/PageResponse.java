package com.example.demo.dto.response;

import java.util.List;

public class PageResponse<T> {
    private Integer totalElements;
    private Integer totalPages;
    private Integer size;
    private Integer page;
    private List<T> content;

    public PageResponse() {
    }

    public PageResponse(Integer totalElements, Integer totalPages, Integer size, Integer page, List<T> content) {
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.size = size;
        this.page = page;
        this.content = content;
    }

    public Integer getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(Integer totalElements) {
        this.totalElements = totalElements;
    }

    public Integer getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(Integer totalPages) {
        this.totalPages = totalPages;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public List<T> getContent() {
        return content;
    }

    public void setContent(List<T> content) {
        this.content = content;
    }
}
