package com.example.demo.service.impl;

import com.example.demo.dto.request.DanhMucDto;
import com.example.demo.dto.request.DanhMucUpdateDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.ChatLieuEntity;
import com.example.demo.entity.DanhMucEntity;
import com.example.demo.entity.KieuDangEntity;
import com.example.demo.repository.DanhMucRepository;
import com.example.demo.service.DanhMucService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DanhMucServiceImpl implements DanhMucService {
    @Autowired
    private DanhMucRepository danhMucRepository;
    @Override
    public List<DanhMucEntity> getAll() {
        return danhMucRepository.findAll();
    }

    @Override
    public DanhMucEntity add(DanhMucDto danhMucDto) {
        DanhMucEntity danhMucEntity = new DanhMucEntity();
        danhMucEntity.setMa(danhMucDto.getMa());
        danhMucEntity.setTen(danhMucDto.getTen());
        danhMucEntity.setTrangThai(danhMucDto.getTrangThai());
        return danhMucRepository.save(danhMucEntity);
    }

    @Override
    public DanhMucEntity addNhanh(DanhMucDto danhMucDto) {
        if (danhMucDto.getTen() == null || danhMucDto.getTen().trim().isEmpty()) {
            throw new IllegalArgumentException("Danh muc khong duoc de trong.");
        }


        DanhMucEntity danhMucEntity = new DanhMucEntity();


        danhMucEntity.setMa(danhMucDto.getMa() != null ? danhMucDto.getMa() : generateMa());


        danhMucEntity.setTrangThai(danhMucDto.getTrangThai() != null ? danhMucDto.getTrangThai() : 1);


        danhMucEntity.setTen(danhMucDto.getTen().trim());


        return danhMucRepository.save(danhMucEntity);}
    private String generateMa() {
        return "DM" + System.currentTimeMillis();
    }

    @Override
    public DanhMucEntity update(DanhMucUpdateDto danhMucUpdateDto) {
        Optional<DanhMucEntity> optional = danhMucRepository.findById(danhMucUpdateDto.getId());
        return optional.map(o->{
            o.setMa(danhMucUpdateDto.getMa());
            o.setTen(danhMucUpdateDto.getTen());
            o.setTrangThai(danhMucUpdateDto.getTrangThai());
            return danhMucRepository.save(o);
        }).orElse(null);
    }

    @Override
    public DanhMucEntity detail(DanhMucUpdateDto danhMucUpdateDto) {
        Optional<DanhMucEntity> optional = danhMucRepository.findById(danhMucUpdateDto.getId());
        return optional.orElse(null);
    }

    @Override
    public DanhMucEntity delete(DanhMucUpdateDto danhMucUpdateDto) {
        Optional<DanhMucEntity> optional = danhMucRepository.findById(danhMucUpdateDto.getId());
        return optional.map(o->{
            danhMucRepository.delete(o);
            return o;
        }).orElse(null);
    }

    @Override
    public PageResponse<DanhMucEntity> findByPagingCriteria(DanhMucDto danhMucDto, Pageable pageable) {
        Page<DanhMucEntity> page = danhMucRepository.findAll(new Specification<DanhMucEntity>() {
            @Override
            public Predicate toPredicate(Root<DanhMucEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if(danhMucDto != null){
                    if(danhMucDto.getMa() != null && !danhMucDto.getMa().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("ma"),"%" + danhMucDto.getMa() + "%"));
                    }
                    if(danhMucDto.getTen() != null && !danhMucDto.getTen().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("ten"),"%" + danhMucDto.getTen() + "%"));
                    }
                    if(danhMucDto.getTrangThai() !=null){
                        predicates.add(criteriaBuilder.equal(root.get("trangThai"),danhMucDto.getTrangThai()));
                    }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }
        },pageable);
        PageResponse<DanhMucEntity> pageResponse = new PageResponse<>();
        pageResponse.setTotalElements((int) page.getTotalElements());
        pageResponse.setTotalPages(page.getTotalPages());
        pageResponse.setSize(page.getSize());
        pageResponse.setPage(page.getNumber() + 1);
        pageResponse.setContent(page.getContent());

        return pageResponse;
    }
}
