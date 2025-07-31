import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import { exec } from 'child_process'

const app = express()
const PORT = 3001

app.use(cors())
app.get('/calendars/ola/calendar.ics', async (req, res) => {
    const ICS_URL = 'https://calendar.google.com/calendar/ical/c_b7d573fbbb7b74fb3515bea647d8d483e1994b07d5fb277105ca51bbca171833%40group.calendar.google.com/private-9966217655c940ae74830a22fe0e6686/basic.ics'
    try {
        const response = await fetch(ICS_URL)
        if (!response.ok) throw new Error('Failed to fetch ICS')
        const text = await response.text()
        res.set('Content-Type', 'text/calendar')
        res.send(text)
    } catch (err) {
        res.status(500).send('Error fetching ICS')
    }
})

app.get('/calendars/rita/calendar.ics', async (req, res) => {
    const ICS_URL = 'https://p116-caldav.icloud.com/published/2/MTQwNzUyMDM5MDE0MDc1Mt37tMt1l5yS3mOOa2Yhh67YAHTeOgU81RUHPIZhmRWl';
    try {
        const response = await fetch(ICS_URL)
        if (!response.ok) throw new Error('Failed to fetch ICS')
        const text = await response.text()
        res.set('Content-Type', 'text/calendar')
        res.send(text)
    } catch (err) {
        res.status(500).send('Error fetching ICS')
    }
});

app.post('/shutdown', (req, res) => {
    res.send('Shutting down...');
})


app.listen(PORT, () => {
    console.log(`ICS proxy server running at http://localhost:${PORT}`)
})