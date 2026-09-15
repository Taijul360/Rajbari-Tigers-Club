import { Request, Response } from 'express';
import { Tournament, Project, Notice, BloodDonor, Role, User } from '../models/index.js';

export const getTournaments = async (req: Request, res: Response) => {
  try {
    // Strip budget from public view
    const tournaments = await Tournament.find({ isPublic: true }).select('-budget').sort({ startDate: -1 });
    res.json({ success: true, data: tournaments });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch tournaments' } });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({ isPublic: true }).sort({ startDate: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch projects' } });
  }
};

export const getNotices = async (req: Request, res: Response) => {
  try {
    const notices = await Notice.find({ audience: 'public' }).sort({ publishAt: -1, createdAt: -1 });
    res.json({ success: true, data: notices });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch notices' } });
  }
};

export const getBloodDonors = async (req: Request, res: Response) => {
  try {
    const donors = await BloodDonor.find({ isAvailable: true }).sort({ lastDonationDate: 1 });
    res.json({ success: true, data: donors });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch donors' } });
  }
};

export const getCommittee = async (req: Request, res: Response) => {
  try {
    // Fetch roles above rank 50 (Committees)
    const roles = await Role.find({ rank: { $gte: 60 } }).sort({ rank: -1 });
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch committee' } });
  }
};

export const getPublicStats = async (req: Request, res: Response) => {
  try {
    // Basic stats for the homepage
    const membersCount = await User.countDocuments({ memberStatus: 'active' });
    const tournamentsCount = await Tournament.countDocuments({ isPublic: true });
    const projectsCount = await Project.countDocuments({ isPublic: true, status: 'completed' });
    
    res.json({ 
      success: true, 
      data: { 
        members: membersCount > 0 ? membersCount : 120, // Fallback if no real members yet
        tournaments: tournamentsCount, 
        projects: projectsCount 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch stats' } });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notices = await Notice.find({ audience: 'public' }).sort({ publishAt: -1, createdAt: -1 }).limit(3);
    const tournaments = await Tournament.find({ isPublic: true, status: 'upcoming' }).sort({ startDate: 1 }).limit(2);
    const donors = await BloodDonor.find({ isAvailable: true }).sort({ lastDonationDate: -1 }).limit(2);
    
    const notifications = [
      ...notices.map(n => ({ id: n._id.toString(), type: 'notice', title: n.title?.bn || n.title?.en, date: n.createdAt, priority: n.priority })),
      ...tournaments.map(t => ({ id: t._id.toString(), type: 'tournament', title: t.title?.bn || t.title?.en, date: t.startDate || t.createdAt, priority: 'normal' })),
      ...donors.map(d => ({ id: d._id.toString(), type: 'blood', title: `${d.bloodGroup} রক্তের প্রয়োজন হতে পারে: ${d.name}`, date: d.createdAt || d.updatedAt, priority: 'urgent' }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch notifications' } });
  }
};
