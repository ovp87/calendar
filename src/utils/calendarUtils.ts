export interface CalendarEvent {
    id: string
    title: string
    start: Date
    end: Date
    source: 'google' | 'apple'
    description?: string
}

export function getMonday(date: Date) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    d.setDate(diff)
    d.setHours(0, 0, 0, 0)
    return d
}

export function getWeekNumber(date: Date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function getGridRow(date: Date, DAY_START_HOUR = 6) {
    const hour = date.getHours()
    const minute = date.getMinutes()
    let slot = ((hour - DAY_START_HOUR + 24) % 24) * 2 + Math.floor(minute / 30)
    return 2 + slot
}

export function getGridSpan(start: Date, end: Date) {
    const diff = (end.getTime() - start.getTime()) / (1000 * 60)
    return Math.max(1, Math.round(diff / 30))
}

export interface CalendarEventWithLayout extends CalendarEvent {
    column: number
    columnCount: number
}

export function layoutEvents(events: CalendarEvent[]): CalendarEventWithLayout[] {
    // Sort by start time
    const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime())
    const result: CalendarEventWithLayout[] = []
    let active: CalendarEventWithLayout[] = []

    for (const event of sorted) {
        // Remove events that have ended
        active = active.filter(e => e.end > event.start)
        // Assign column
        const usedColumns = new Set(active.map(e => e.column))
        let col = 0
        while (usedColumns.has(col)) col++
        const withLayout = { ...event, column: col, columnCount: active.length + 1 }
        active.push(withLayout)
        result.push(withLayout)
    }
    // After loop, update columnCount for all in same group
    for (const e of result) {
        const overlapping = result.filter(
            other =>
                (other.start < e.end && other.end > e.start)
        )
        e.columnCount = Math.max(...overlapping.map(o => o.column + 1))
    }
    return result
}