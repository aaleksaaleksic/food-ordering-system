package me.remontada.nwp_backend.dto;

import jakarta.validation.Valid;

import java.util.List;

public class PlaceOrderRequest {
    @Valid
    private List<OrderItemRequest> items;

    public PlaceOrderRequest() {}

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
}
