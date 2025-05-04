import { MenuItem } from "./MenuItem";

export interface Menu {
    restaurantId: string;
    _id: string;
    items : MenuItem[];
}