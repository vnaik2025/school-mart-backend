# S3_STORAGE.md

# Project AWS Configuration

Storage Provider

- Amazon S3

AWS Region

```
ap-south-1
```

S3 Bucket

```
ssi-demo-dev
```

Base Folder (Prefix)

```
ai-project/
```

Object Key Pattern

```
ai-project/uniforms/{schoolId}/{uniformId}/{uuid}.{ext}
```

Example

```
ai-project/uniforms/25/103/88ef72f6-b8c4-4e66-8cf2-a85f6f470f92.jpg
```

Environment Variables

```env
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=ssi-demo-dev

# Credentials must come from environment variables or IAM.
# Never hardcode them.
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

# Amazon S3 Storage Specification

## Overview

This project uses **Amazon S3** as the primary object storage service.

store all kind of images in s3 not only uniform images. such as logo, profile picture, etc.

The application **never stores binary files in the database**. Only image metadata is persisted.

The storage layer must be abstracted behind a Storage Service so it can be replaced by Cloudflare R2, Azure Blob Storage, or MinIO without affecting business logic.

---

# Storage Provider

Amazon S3

AWS SDK Version

- AWS SDK for JavaScript v3

---

# Supported File Types

Allowed MIME Types

- image/jpeg
- image/png
- image/webp

Allowed Extensions

- .jpg
- .jpeg
- .png
- .webp

Rejected File Types

- pdf
- zip
- rar
- exe
- doc
- docx
- svg
- gif
- mp4

---

# File Size Limits

Maximum File Size

5 MB

Maximum Images Per Uniform

10

Minimum Images Per Uniform

1

Thumbnail Images

Exactly one thumbnail image per uniform.

---

# Storage Structure

Folder Structure

```
uniforms/
    {schoolId}/
        {uniformId}/
            {uuid}.jpg
```

Example

```
uniforms/
    25/
        103/
            88ef72f6-b8c4-4e66-8cf2-a85f6f470f92.jpg
```

---

# File Naming Strategy

Never use original filenames.

Always generate UUID-based filenames.

Example

```
7f34d421-7ef2-472d-89cb-68a83d80eb81.jpg
```

Benefits

- Prevent filename collisions
- Prevent overwriting
- Improve security
- Remove user-controlled filenames

---

# Database Storage

Only metadata is stored.

UniformImage

| Field         | Description        |
| ------------- | ------------------ |
| id            | Primary Key        |
| uniform_id    | Related Uniform    |
| s3_key        | Full S3 object key |
| image_url     | Public or CDN URL  |
| mime_type     | Image MIME Type    |
| file_size     | Size in bytes      |
| is_thumbnail  | Thumbnail flag     |
| display_order | Image ordering     |
| is_archived   | Soft delete        |
| created_at    | Timestamp          |
| updated_at    | Timestamp          |

Never store

- Binary Data
- Base64 Images
- Blob Data

---

# Upload Flow

1. Admin uploads image
2. Validate authentication
3. Validate permissions
4. Validate file type
5. Validate file size
6. Generate UUID filename
7. Build S3 object key
8. Upload image to S3
9. Store metadata in database
10. Return image information

---

# Image Validation

Validate

- MIME Type
- File Extension
- File Size
- Empty File
- Duplicate Upload

Reject

- Invalid MIME Type
- Oversized Images
- Empty Files
- Corrupted Files

---

# Thumbnail Rules

Each uniform can have only one thumbnail.

When a new thumbnail is selected

1. Remove thumbnail flag from existing image
2. Mark new image as thumbnail

Database Update

```
UPDATE uniform_images
SET is_thumbnail = false
WHERE uniform_id = ?
```

---

# Display Order

Images support ordering.

Example

| Image | Display Order |
| ----- | ------------- |
| Front | 1             |
| Back  | 2             |
| Side  | 3             |

---

# Delete Flow

When deleting an image

Step 1

Delete object from Amazon S3.

Step 2

Soft delete database record.

```
is_archived = true
archived_at = CURRENT_TIMESTAMP
```

Never leave orphan files inside S3.

---

# Replace Image Flow

1. Upload new image
2. Save metadata
3. Delete old S3 object
4. Archive old metadata

---

# Image Retrieval

Application returns

- imageUrl
- thumbnailUrl

The frontend never constructs S3 URLs.

---

# Public vs Private Objects

Current Version

Public Read Access

Future

Private Bucket

Access through Presigned URLs.

The Storage Service should support both without changing business logic.

---

# Storage Service Responsibilities

The Storage Service must expose methods for

- Upload Image
- Delete Image
- Replace Image
- Get Image URL
- Generate Object Key
- Validate Image
- Generate Presigned URL (Future)

Business modules must never directly use the AWS SDK.

---

# Required Environment Variables

```
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
AWS_S3_BASE_URL=
```

Optional

```
AWS_CLOUDFRONT_URL=
```

---

# Required Dependencies

```
@aws-sdk/client-s3
file-type
uuid
mime-types
```

---

# Security Rules

- Never trust client filenames.
- Never trust MIME types sent by clients.
- Validate file signature using file-type.
- Generate UUID filenames.
- Store only metadata in the database.
- Delete orphan S3 objects.
- Reject unsupported file formats.
- Reject oversized uploads.

---

# Performance Guidelines

- Upload directly to Amazon S3.
- Never store images on the application server.
- Lazy load images.
- Return optimized image URLs.
- Support CDN integration.

---

# Future Enhancements

Architecture should support

- CloudFront CDN
- Presigned Upload URLs
- Presigned Download URLs
- Multipart Upload
- Image Compression
- Image Resizing
- WebP Conversion
- Image Versioning
- Multiple Storage Providers

---

# API Integration

Upload

```
POST /api/v1/media/upload
```

Delete

```
DELETE /api/v1/uniform-images/:id
```

Set Thumbnail

```
PUT /api/v1/uniform-images/:id/thumbnail
```

---

# Error Handling

Possible Errors

- Invalid File Type
- Invalid MIME Type
- File Too Large
- Upload Failed
- S3 Connection Failed
- Image Not Found
- Permission Denied
- Delete Failed

---

# Best Practices

- Use UUID filenames.
- Store only metadata in PostgreSQL.
- Abstract all AWS SDK calls behind a Storage Service.
- Keep business logic independent of Amazon S3.
- Never expose AWS credentials.
- Never expose internal S3 object keys to clients.
- Ensure every deleted image is also removed from Amazon S3.
