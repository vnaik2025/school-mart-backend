import mediaService from '../services/media.service.js';
import { sendSuccess } from '../utils/response-handler.js';
import { APIError } from '../utils/api-error.js';

export const uploadUniformImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new APIError('No image file provided', 400);
    }

    const { uniform_id, is_thumbnail } = req.body;

    if (!uniform_id) {
      throw new APIError('uniform_id is required', 400);
    }

    const isThumbnailBool = is_thumbnail === 'true' || is_thumbnail === true;

    const data = await mediaService.uploadMedia(
      req.file, 
      'UNIFORM', 
      parseInt(uniform_id, 10), 
      isThumbnailBool, 
      req.user.id
    );

    return sendSuccess(res, data, 'Uniform image uploaded successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const deleteUniformImage = async (req, res, next) => {
  try {
    await mediaService.deleteMedia(req.params.id, req.user.id);
    return sendSuccess(res, null, 'Uniform image deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const setUniformThumbnail = async (req, res, next) => {
  try {
    const { uniform_id } = req.body;
    if (!uniform_id) {
      throw new APIError('uniform_id is required in body', 400);
    }
    const data = await mediaService.setThumbnail(
      req.params.id, 
      'UNIFORM', 
      parseInt(uniform_id, 10), 
      req.user.id
    );
    return sendSuccess(res, data, 'Uniform thumbnail updated successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  uploadUniformImage,
  deleteUniformImage,
  setUniformThumbnail
};
