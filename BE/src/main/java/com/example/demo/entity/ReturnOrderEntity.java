package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Table(name = "RETURN_ODER")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReturnOrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;

    @Column(name = "ORDER_ID")
    private String orderId;

    @Column(name = "CUSTOMER_ID")
    private String customerId;

    @Column(name = "STATUS")
    private int status;

    @Column(name = "REASON",columnDefinition = "NVARCHAR(255)")
    private String reason;

    @Column(name = "IMAGE")
    private String images;

    @Column(name = "CREATE_AT")
    private LocalDateTime createdAt;

    @Column(name = "UPDATE_AT")
    private LocalDateTime updatedAt;
}
