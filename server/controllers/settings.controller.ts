import { Request, Response } from 'express';
import { Settings } from '../models/index.js';

export const getPublicSettings = async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    // Convert to JSON and remove internal fields if necessary
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Settings fetch error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch settings' } });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const updatedSettings = await Settings.findOneAndUpdate(
      {}, 
      req.body, 
      { new: true, upsert: true }
    );
    
    res.json({ 
      success: true, 
      message: 'Settings updated successfully',
      data: updatedSettings 
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update settings' } });
  }
};
