/**
 * Pure validation utilities for FixLens
 */

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  mimeType?: string;
}

export function validateImageFile(file: {
  type: string;
  size: number;
  name?: string;
}): ImageValidationResult {
  if (!file) {
    return { isValid: false, error: 'No image file provided.' };
  }

  // Normalize mime type
  const mime = file.type.toLowerCase();
  const name = (file.name || '').toLowerCase();

  const isAllowedMime = ALLOWED_IMAGE_MIME_TYPES.includes(mime);
  const hasAllowedExt =
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.png') ||
    name.endsWith('.webp');

  if (!isAllowedMime && !hasAllowedExt) {
    return {
      isValid: false,
      error: 'Unsupported image format. Please upload a JPEG, PNG, or WebP photo.',
    };
  }

  if (file.size <= 0) {
    return {
      isValid: false,
      error: 'The uploaded image file is empty or corrupted (0 bytes).',
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `Image size (${sizeMb} MB) exceeds the maximum allowed limit of 10 MB. Please compress or resize the photo.`,
    };
  }

  return {
    isValid: true,
    mimeType: isAllowedMime ? mime : (name.endsWith('.png') ? 'image/png' : name.endsWith('.webp') ? 'image/webp' : 'image/jpeg'),
  };
}

export function validateDataUrl(dataUrl: string): {
  isValid: boolean;
  mimeType?: string;
  base64?: string;
  error?: string;
} {
  if (!dataUrl || typeof dataUrl !== 'string') {
    return { isValid: false, error: 'Data URL is missing or invalid.' };
  }

  const match = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (!match) {
    return { isValid: false, error: 'Malformed base64 data URL format.' };
  }

  const mimeType = match[1].toLowerCase();
  const base64 = match[2];

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(mimeType)) {
    return {
      isValid: false,
      error: `Unsupported MIME type: ${mimeType}. Supported types: JPEG, PNG, WebP.`,
    };
  }

  // Calculate size from base64
  const estimatedSizeBytes = Math.round((base64.length * 3) / 4);
  if (estimatedSizeBytes > MAX_IMAGE_SIZE_BYTES * 1.5) {
    return {
      isValid: false,
      error: 'Image payload is too large. Limit is 10 MB.',
    };
  }

  return {
    isValid: true,
    mimeType,
    base64,
  };
}

export interface InputValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateCircuitAnalysisInput(input: {
  problemDescription?: string;
  components?: string[];
  isPowered?: string;
}): InputValidationResult {
  const errors: string[] = [];

  const desc = (input.problemDescription || '').trim();
  if (!desc) {
    errors.push('Please describe what is happening with the circuit.');
  } else if (desc.length < 5) {
    errors.push('Problem description must be at least 5 characters long for a meaningful diagnosis.');
  } else if (desc.length > 2000) {
    errors.push('Problem description is too long (maximum 2,000 characters).');
  }

  if (!input.components || !Array.isArray(input.components) || input.components.length === 0) {
    errors.push('Please select at least one component used in the circuit (or "Other / unknown component").');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
