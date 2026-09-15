import { Request, Response } from 'express';
import { Tournament, Notice, User } from '../models/index.js';

export const globalSearch = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query || query.length < 2) {
      return res.json({ success: true, data: { tournaments: [], notices: [], members: [] } });
    }

    const regex = new RegExp(query, 'i');

    const tournaments = await Tournament.find({ 
      isPublic: true, 
      $or: [{ 'title.bn': regex }, { 'title.en': regex }] 
    }).limit(5).select('title status startDate');

    const notices = await Notice.find({ 
      audience: 'public', 
      $or: [{ 'title.bn': regex }, { 'title.en': regex }, { body: regex }] 
    }).limit(5).select('title createdAt priority');

    const members = await User.find({ 
      memberStatus: 'active', 
      $or: [{ 'name.bn': regex }, { 'name.en': regex }, { bloodGroup: regex }, { memberCode: regex }] 
    }).limit(5).select('name bloodGroup memberCode');

    res.json({ success: true, data: { tournaments, notices, members } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Search failed' } });
  }
};
