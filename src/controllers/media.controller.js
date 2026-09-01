import mediaService from '../services/media.service.js';
import { sendSuccess } from '../utils/response-handler.js';
import { APIError } from '../utils/api-error.js';

export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new APIError('No image file provided', 400);
    }

    const { entity_type, entity_id, is_thumbnail } = req.body;

    if (!entity_type || !entity_id) {
      throw new APIError('entity_type and entity_id are required', 400);
    }

    const isThumbnailBool = is_thumbnail === 'true' || is_thumbnail === true;

    const data = await mediaService.uploadMedia(
      req.file, 
      entity_type, 
      parseInt(entity_id, 10), 
      isThumbnailBool, 
      req.user.id
    );

    return sendSuccess(res, data, 'Media uploaded successfully', 201);
  } catch (error) {
    next(error);
  }
};

export default {
  uploadMedia
};
