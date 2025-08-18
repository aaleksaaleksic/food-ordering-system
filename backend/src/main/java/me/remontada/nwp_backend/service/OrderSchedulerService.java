package me.remontada.nwp_backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


@Slf4j
@Service
public class OrderSchedulerService {

    @Autowired
    private OrderService orderService;


    @Scheduled(fixedDelay = 60000)
    public void processScheduledOrders() {
        orderService.processScheduledOrders();
    }


    @Scheduled(fixedRate = 5000)
    public void processStatusTransitions() {
        orderService.processStatusTransitions();
    }
}