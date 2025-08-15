package me.remontada.nwp_backend.dto;

import jakarta.validation.Valid;

import me.remontada.nwp_backend.dto.OrderItemRequest;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.List;

public class ScheduleOrderRequest {
    @Valid
    private List<OrderItemRequest> items;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime scheduledFor;

    public ScheduleOrderRequest() {}

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }

    public LocalDateTime getScheduledFor() { return scheduledFor; }
    public void setScheduledFor(LocalDateTime scheduledFor) { this.scheduledFor = scheduledFor; }
}