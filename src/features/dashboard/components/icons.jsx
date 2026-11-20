import {
  Home,
  Plane,
  Receipt,
  ShoppingCart,
  Ticket,
  Users,
  Utensils,
} from 'lucide-react'

/**
 * Icon keys come from the data layer as strings; components are resolved here.
 * Keeping the mapping in one place preserves the serializable data boundary.
 */
export const GROUP_ICONS = Object.freeze({
  home: Home,
  plane: Plane,
  default: Users,
})

export const ACTIVITY_ICONS = Object.freeze({
  utensils: Utensils,
  ticket: Ticket,
  cart: ShoppingCart,
  receipt: Receipt,
  default: Receipt,
})

export function getIcon(map, key) {
  return map[key] ?? map.default
}
