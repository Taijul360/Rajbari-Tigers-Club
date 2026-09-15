import { Router } from 'express';
import { getTournaments, getProjects, getNotices, getBloodDonors, getCommittee, getPublicStats, getNotifications } from '../controllers/public.controller.js';

const router = Router();

router.get('/tournaments', getTournaments);
router.get('/projects', getProjects);
router.get('/notices', getNotices);
router.get('/blood-donors', getBloodDonors);
router.get('/committee', getCommittee);
router.get('/stats', getPublicStats);
router.get('/notifications', getNotifications);

export default router;
