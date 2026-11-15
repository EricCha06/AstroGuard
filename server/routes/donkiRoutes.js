import { Router } from 'express'
import { getEvents, getNotifications, getSummary, KINDS } from '../services/nasaDonkiService.js'
const router = Router(), wrap = (fn) => (req, res, next) => fn(req, res).catch(next), refresh = (req) => req.query.refresh === '1'
router.get('/notifications', wrap(async (req, res) => res.json(await getNotifications(req.query, refresh(req)))))
router.get('/summary', wrap(async (req, res) => res.json(await getSummary(req.query, refresh(req)))))
Object.keys(KINDS).forEach((kind) => router.get('/' + kind, wrap(async (req, res) => res.json(await getEvents(kind, req.query, refresh(req))))))
export default router
