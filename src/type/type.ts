
export type TDevice = {
    id: number,
    name: string,
    serial_number: string | null,
    inventory_number: string | null,
    status: Array<number> | null,
    price_start_up: number | null,
    date_debit: string | null,
    provisioner: string | null,
    decree: string | null,
    delivery_plan: string | null,
    invoice: string | null,
    date_start: string | null,
    date_stop: string | null,
    ovd: number | null,
    department: number | null,
    nomenclature: number | null,
    device_prev: number | null,
    device_profile: Array<number>,
    isActive: boolean | null
}