// Copyright (c) 2025 NTT InfraNet
const NOTIFICATION_MESSAGES = {
  SITE_UPDATE_SUCCESS: 'site_update_success',
  SITE_MULTIPLE_DATA_DELETE_SUCCESS: 'site_multiple_data_delete_success',
  ASSET_UPLOAD_START: 'asset_upload_start',
  ASSET_UPLOAD_COMPLETE: 'asset_upload_complete',
  ASSET_UPLOAD_ERROR: 'asset_upload_error',
  ASSET_CONVERT_SUCCESS: 'asset_convert_success',
  ASSET_CONVERT_ERROR: 'asset_convert_error',
  ASSET_CONVERT_ERROR_DATA: 'asset_convert_error_data',
  ASSET_DELETE_COMPLETE: 'asset_delete_complete',
  ASSET_DELETE_ERROR: 'asset_delete_error',
  ASSET_UPDATE_COMPLETE: 'asset_update_complete',
  ASSET_SYNC_ERROR: 'asset_sync_error',
  ASSET_CREATE_EHV_SPACE_INFO_ERROR: 'asset_create_ehv_space_info_error'
}

const ERROR_MESSAGES = {
  SITE_MULTIPLE_DATA_DELETE_REQUEST_LIMIT:
    'site_multiple_data_delete_request_limit',
  ASSET_UPLOAD_LIMIT: 'asset_upload_limit',
  ASSET_UPLOAD_ANOTHER_USER: 'asset_upload_another_user',
  ASSET_UPLOAD_VALIDATION_FAILED: 'asset_upload_validation_failed',
  ASSET_UPLOAD_NOT_FOUND: 'asset_upload_not_found',
  ASSET_UPLOAD_NOT_FOUND_BUCKET_ID: 'asset_upload_not_found_bucket_id',
  ASSET_UPLOAD_ERROR_LLFS_UPLOAD: 'asset_upload_error_llfs_upload',
  ASSET_UPLOAD_ERROR_LLFS_DOWNLOAD: 'asset_upload_error_llfs_download',
  ASSET_UPLOAD_ERROR_S3_UPLOAD: 'asset_upload_error_s3_upload',
  ASSET_UPLOAD_ERROR_FILE_CONVERT: 'asset_upload_error_file_convert',
  ASSET_DELETE_ERROR_PERMISSION_REQUIRED:
    'asset_delete_error_permission_required',
  ASSET_CONCURRENT_ACCESS: 'asset_concurrent_access',
  INVALID_LICENSE_OPTION: 'invalid_license_option'
}

module.exports = {
  NOTIFICATION_MESSAGES,
  ERROR_MESSAGES
}
