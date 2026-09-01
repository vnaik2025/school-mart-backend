import db from '../models/index.js';
import s3Service from './s3.service.js';
import { APIError } from '../utils/api-error.js';

/**
 * Validates that an entity exists before attaching media to it.
 */
const validateEntity = async (entityType, entityId) => {
  let exists = false;
  switch (entityType) {
    case 'UNIFORM':
      exists = !!await db.Uniform.findOne({ where: { id: entityId, is_archive: false } });
      break;
    case 'SCHOOL':
      exists = !!await db.School.findOne({ where: { id: entityId, is_archive: false } });
      break;
    case 'USER':
      exists = !!await db.User.findByPk(entityId);
      break;
    default:
      throw new APIError('Invalid entity type', 400);
  }

  if (!exists) {
    throw new APIError(`${entityType} with ID ${entityId} not found`, 404);
  }
};

export const uploadMedia = async (file, entityType, entityId, isThumbnail = false, userId) => {
  await validateEntity(entityType, entityId);

  // Upload to S3
  const s3Result = await s3Service.uploadFile(file.buffer, file.originalname, file.mimetype);

  // Determine display_order by checking existing media for this entity
  const existingCount = await db.Media.count({
    where: { entity_type: entityType, entity_id: entityId, is_archive: false }
  });

  // If this is the first image, make it the thumbnail if none was specified
  const shouldBeThumbnail = isThumbnail || existingCount === 0;

  return await db.sequelize.transaction(async (t) => {
    // If setting as thumbnail, unset previous thumbnails for this entity
    if (shouldBeThumbnail) {
      await db.Media.update(
        { is_thumbnail: false },
        { 
          where: { entity_type: entityType, entity_id: entityId, is_archive: false },
          transaction: t
        }
      );
    }

    const media = await db.Media.create({
      entity_type: entityType,
      entity_id: entityId,
      s3_key: s3Result.key,
      image_url: s3Result.url,
      mime_type: file.mimetype,
      file_name: file.originalname,
      file_size: file.size,
      is_thumbnail: shouldBeThumbnail,
      display_order: existingCount + 1,
      created_by: userId
    }, { transaction: t });

    // Optionally update the entity's logo/profile id if applicable
    if (shouldBeThumbnail) {
      if (entityType === 'SCHOOL') {
        await db.School.update({ logo_media_id: media.id }, { where: { id: entityId }, transaction: t });
      } else if (entityType === 'USER') {
        await db.CustomerProfile.update({ profile_media_id: media.id }, { where: { user_id: entityId }, transaction: t });
      }
    }

    return media;
  });
};

export const deleteMedia = async (mediaId, userId) => {
  const media = await db.Media.findOne({
    where: { id: mediaId, is_archive: false }
  });

  if (!media) {
    throw new APIError('Media not found', 404);
  }

  // Delete from S3
  try {
    await s3Service.deleteFile(media.s3_key);
  } catch (error) {
    console.error(`Failed to delete S3 object ${media.s3_key}:`, error);
    // Even if S3 deletion fails (e.g., object already missing), we should still soft delete the DB record
  }

  // Soft delete in DB
  await media.update({
    is_archive: true,
    archived_at: new Date(),
    archived_by: userId
  });

  // If this was a thumbnail, maybe unset the entity's media reference
  if (media.is_thumbnail) {
    if (media.entity_type === 'SCHOOL') {
      await db.School.update({ logo_media_id: null }, { where: { id: media.entity_id } });
    } else if (media.entity_type === 'USER') {
      await db.CustomerProfile.update({ profile_media_id: null }, { where: { user_id: media.entity_id } });
    }
  }
};

export const setThumbnail = async (mediaId, entityType, entityId, userId) => {
  const media = await db.Media.findOne({
    where: { id: mediaId, entity_type: entityType, entity_id: entityId, is_archive: false }
  });

  if (!media) {
    throw new APIError('Media not found for the specified entity', 404);
  }

  if (media.is_thumbnail) {
    return media; // Already thumbnail
  }

  await db.sequelize.transaction(async (t) => {
    // Unset current thumbnail(s)
    await db.Media.update(
      { is_thumbnail: false },
      { 
        where: { entity_type: entityType, entity_id: entityId, is_archive: false },
        transaction: t
      }
    );

    // Set new thumbnail
    await media.update({ is_thumbnail: true, updated_by: userId }, { transaction: t });

    if (entityType === 'SCHOOL') {
      await db.School.update({ logo_media_id: media.id }, { where: { id: entityId }, transaction: t });
    } else if (entityType === 'USER') {
      await db.CustomerProfile.update({ profile_media_id: media.id }, { where: { user_id: entityId }, transaction: t });
    }
  });

  return media;
};

export default {
  uploadMedia,
  deleteMedia,
  setThumbnail
};
