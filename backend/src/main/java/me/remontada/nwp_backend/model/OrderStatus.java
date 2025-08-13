package me.remontada.nwp_backend.model;

/**

 * WORKFLOW:
 * ORDERED - PREPARING - IN_DELIVERY - DELIVERED
 *    \
 * CANCELED
 */

public enum OrderStatus {

    ORDERED,
    PREPARING,
    IN_DELIVERY,
    DELIVERED,
    CANCELED
}
