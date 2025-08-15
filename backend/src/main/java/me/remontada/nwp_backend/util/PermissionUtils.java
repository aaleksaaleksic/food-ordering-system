package me.remontada.nwp_backend.util;

import me.remontada.nwp_backend.model.Permission;
import me.remontada.nwp_backend.model.User;

import java.util.Set;


public class PermissionUtils {


    private static final Set<Permission> ADMIN_REQUIRED_PERMISSIONS = Set.of(
            Permission.CAN_CREATE_USERS,
            Permission.CAN_READ_USERS,
            Permission.CAN_UPDATE_USERS,
            Permission.CAN_DELETE_USERS,
            Permission.CAN_PLACE_ORDER,
            Permission.CAN_CANCEL_ORDER,
            Permission.CAN_SEARCH_ORDER,
            Permission.CAN_SCHEDULE_ORDER
    );


    public static boolean isAdmin(User user) {
        if (user == null || user.getPermissions() == null) {
            return false;
        }

        return user.getPermissions().containsAll(ADMIN_REQUIRED_PERMISSIONS);
    }


    public static boolean hasPermission(User user, Permission permission) {
        if (user == null || user.getPermissions() == null) {
            return false;
        }

        return user.getPermissions().contains(permission);
    }


    public static boolean hasAllPermissions(User user, Set<Permission> permissions) {
        if (user == null || user.getPermissions() == null) {
            return false;
        }

        return user.getPermissions().containsAll(permissions);
    }


    public static boolean hasAnyPermission(User user, Set<Permission> permissions) {
        if (user == null || user.getPermissions() == null) {
            return false;
        }

        return permissions.stream().anyMatch(user.getPermissions()::contains);
    }
}