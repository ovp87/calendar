import ICAL from 'ical.js'
import type { CalendarEvent } from './calendarUtils'

export async function loadIcs(url: string, owner: string, source: string): Promise<CalendarEvent[]> {
    const res = await fetch(url)
    const icsData = await res.text()
    const jcalData = ICAL.parse(icsData)
    const comp = new ICAL.Component(jcalData)
    const vevents = comp.getAllSubcomponents('vevent')
    return vevents.map((vevent: any) => {
        const event = new ICAL.Event(vevent)
        return {
            id: event.uid,
            title: event.summary,
            start: event.startDate.toJSDate(),
            end: event.endDate.toJSDate(),
            source,
            description: event.description,
            owner
        } as CalendarEvent
    })
}