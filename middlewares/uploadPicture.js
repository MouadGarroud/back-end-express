import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp'; // Make sure sharp is imported!
import AppError from '../errors/appError.error.js';
import ERROR_CODES from '../constants/errorCodes.constant.js';
import RESPONSE_MESSAGES from '../constants/responseMessages.constant.js';

const UPLOAD_DIR = 'uploads';
const MAX_FILE_SIZE = 1 * 1024 * 1024; // Exactly 1MB Limit

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('INVALID_FORMAT'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export const uploadSingleAvatar = (req, res, next) => {
  // FIX 2: Added 'async' right here before (err)
  upload.single('avatar')(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return next(
          new AppError(
            RESPONSE_MESSAGES[ERROR_CODES.LIMIT_UNEXPECTED_AVATAR] ||
              'You can only upload a maximum of 1 avatar image.',
            400,
            ERROR_CODES.LIMIT_UNEXPECTED_AVATAR || 'LIMIT_UNEXPECTED_FILE',
          ),
        );
      }

      if (err.message === 'INVALID_FORMAT') {
        return next(
          new AppError(
            RESPONSE_MESSAGES[ERROR_CODES.AVATAR_FORMAT] || 'Invalid file format.',
            400,
            ERROR_CODES.AVATAR_FORMAT,
          ),
        );
      }

      if (err.code === 'LIMIT_FILE_SIZE') {
        const errorCode = ERROR_CODES.AVATAR_SIZE || 'AVATAR_LIMIT_ERROR';
        const message = RESPONSE_MESSAGES[errorCode] || 'File is too large.';
        return next(new AppError(message, 400, errorCode));
      }

      if (err.code === 'ENOSPC') {
        return next(
          new AppError(
            'Server storage space is full. Unable to process upload.',
            507,
            'SERVER_STORAGE_FULL',
          ),
        );
      }

      return next(
        new AppError(
          RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
          500,
          ERROR_CODES.INTERNAL_SERVER_ERROR,
        ),
      );
    }

    if (req.file) {
      try {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = `${req.file.fieldname || 'avatar'}-${uniqueSuffix}${path.extname(req.file.originalname)}`;
        const outputPath = path.join(UPLOAD_DIR, filename);

        await sharp(req.file.buffer)
          .withMetadata({ strip: true }) // Strips EXIF, ICC profiles, XMP, etc.
          .toFile(outputPath);

        req.file.path = outputPath;
        req.file.filename = filename;
      } catch (sharpError) {
        if (sharpError.code === 'ENOSPC') {
          return next(
            new AppError('Server storage space is full.', 507, 'SERVER_STORAGE_FULL'),
          );
        }
        return next(
          new AppError(
            'Failed to process and clean image metadata.',
            400,
            'IMAGE_PROCESSING_FAILED',
          ),
        );
      }
    }

    next();
  });
};

export default uploadSingleAvatar;
