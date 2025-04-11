// Copyright (c) 2025 NTT InfraNet
// @flow

type DatahubApiOptions = {
  domain: string,
  getAccessToken: () => ?string,
  onUnauthorizedRequest: () => void
}

export type ErrorResult = {
  statusCode: number,
  error: string,
  message: string
}

class ApiError extends Error {
  originalError: ErrorResult
  constructor (...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }

    // $FlowFixMe
    this.originalError = params.originalError
  }
}

/**
 * Datahub Api
 * @class DatahubApi
 * @param {(string)} [domainOrOptions] - The project domain.
 */
export default class DatahubApi {
  domain: string = ''
  getAccessToken: () => ?string
  onUnauthorizedRequest: () => void

  constructor ({
    domain,
    getAccessToken,
    onUnauthorizedRequest
  }: DatahubApiOptions) {
    if (domain) {
      this.domain = domain
    }
    this.getAccessToken = getAccessToken || (() => null)
    this.onUnauthorizedRequest = onUnauthorizedRequest || (() => {})
  }

  getDomain () {
    return this.domain
  }

  serializeQueryParams (parameters: any) {
    let str = []
    for (let param in parameters) {
      if (parameters.hasOwnProperty(param)) {
        if (Array.isArray(parameters[param])) {
          for (let paramValue of parameters[param].values()) {
            str.push(
              encodeURIComponent(param) + '[]=' + encodeURIComponent(paramValue)
            )
          }
        } else {
          str.push(
            encodeURIComponent(param) +
              '=' +
              encodeURIComponent(parameters[param])
          )
        }
      }
    }
    return str.join('&')
  }

  mergeQueryParams (parameters: any, queryParameters: any) {
    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(function (
        parameterName
      ) {
        const parameter = parameters.$queryParameters[parameterName]
        queryParameters[parameterName] = parameter
      })
    }
    return queryParameters
  }

  /**
   * HTTP Request
   * @method
   * @name DatahubApi#request
   * @param {string} method - http method
   * @param {string} url - url to do request
   * @param {object} body - body parameters / object
   * @param {object} headers - header parameters
   * @param {object} queryParameters - querystring parameters
   * @param {object} form - form data object
   */
  request = async function (
    method: string,
    url: string,
    body: any,
    headers: any,
    queryParameters: any,
    form: any
  ) {
    const queryParams =
      queryParameters && Object.keys(queryParameters).length
        ? this.serializeQueryParams(queryParameters)
        : null
    const urlWithParams = url + (queryParams ? '?' + queryParams : '')

    if (body && !Object.keys(body).length) {
      body = undefined
    }

    const accessToken = this.getAccessToken()
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    if (method === 'DELETE' && !body) {
      delete headers['Content-Type']
    }

    const fetchOptions = {
      method,
      headers: {
        /* ...this.headers, */
        ...headers
      },
      body: JSON.stringify(body),
      redirect: 'manual'
    }

    const result = await fetch(urlWithParams, fetchOptions).then(response => {
      const statusCode = response.status
      // NOTE: Cognito のセッションタイムアウトでリダイレクトされると cors エラーが発生する。
      //       catch の例外処理はすべて Failed to fetch に丸め込まれてフックできない。
      //       回避策として fetch options = { redirect: 'manual' } を渡しリダイレクトが発生すると、
      //       status = 0 でレスポンスが返ってくるので、これをタイムアウトとして扱う。
      if (statusCode === 0) {
        this.onUnauthorizedRequest()
        return { statusCode: 401, data: { message: 'cognito session timeout' } }
      }
      if (
        statusCode !== 204 &&
        response.headers.get('Content-Type').indexOf('application/json') >= 0
      ) {
        return response.json()
      }
      return {
        statusCode,
        data: response
      }
    })

    if (result.statusCode >= 200 && result.statusCode <= 299) {
      return result.data
    }

    const error = new ApiError(result.message)
    error.originalError = result
    throw error
  }

  /**
   * Return the user profile
   * @method
   * @name DatahubApi#getUserProfile
   */
  getUserProfile = async (parameters: {}): Promise<any> => {
    let path = '/users/profile'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * Get the list of devices for a specific resource owners
   * @method
   * @name DatahubApi#getAllResourceOwnerDevices
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} sort - A string containing the sort attribute (e.g. name)
   * @param {string} direction - The sort direction
   * @param {string} siteId - Site identifier
   */
  getAllResourceOwnerDevices = async (parameters: {
    offset?: number,
    limit?: number,
    sort?: string,
    direction?: 'ASC' | 'DESC',
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/devices'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    if (parameters['sort'] !== undefined) {
      queryParameters['sort'] = parameters['sort']
    }

    if (parameters['direction'] !== undefined) {
      queryParameters['direction'] = parameters['direction']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * デバイスデータの詳細取得
   * @method
   * @name DatahubApi#getSiteDevice
   * @param {array} additionalOptions - 追加オプション
   * @param {string} siteId - Site identifier
   * @param {string} deviceId - Device ID
   */
  getSiteDevice = async (parameters: {
    additionalOptions?: Array<string> | string,

    siteId: string,
    deviceId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/devices/{deviceId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['additionalOptions'] !== undefined) {
      queryParameters['additionalOptions'] = parameters['additionalOptions']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{deviceId}', `${parameters['deviceId']}`)

    if (parameters['deviceId'] === undefined) {
      throw new Error('Missing required  parameter: deviceId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * デバイスデータの更新
   * @method
   * @name DatahubApi#putSiteDevice
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   * @param {string} deviceId - Device ID
   */
  putSiteDevice = async (parameters: {
    body?: {
      displayName?: string,
      status?: 'READABLE' | 'AVAILABLE',
      position?: {},
      remarks?: string
    },
    siteId: string,
    deviceId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/devices/{deviceId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{deviceId}', `${parameters['deviceId']}`)

    if (parameters['deviceId'] === undefined) {
      throw new Error('Missing required  parameter: deviceId')
    }

    return this.request(
      'PUT',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * Get the data exist date list by device ID
   * @method
   * @name DatahubApi#getDeviceDataExistDateList
   * @param {string} from - The initial date required (format: yyyy-mm-dd)
   * @param {string} to - The final date required (format: yyyy-mm-dd)
   * @param {string} siteId - Site identifier
   * @param {string} deviceId - Device ID
   */
  getDeviceDataExistDateList = async (parameters: {
    from: string,
    to: string,
    siteId: string,
    deviceId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/devices/{deviceId}/dataExistDateList'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['from'] !== undefined) {
      queryParameters['from'] = parameters['from']
    }

    if (parameters['from'] === undefined) {
      throw new Error('Missing required  parameter: from')
    }

    if (parameters['to'] !== undefined) {
      queryParameters['to'] = parameters['to']
    }

    if (parameters['to'] === undefined) {
      throw new Error('Missing required  parameter: to')
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{deviceId}', `${parameters['deviceId']}`)

    if (parameters['deviceId'] === undefined) {
      throw new Error('Missing required  parameter: deviceId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * Retrieve the site list
   * @method
   * @name DatahubApi#getSites
   * @param {string} created - An ISO8601 date. When used, results will only include entries whose createdAt date-time matches. Example value: 2007-03-01
   * @param {string} updated - An ISO8601 date. When used, results will only include entries whose updatedAt date-time matches. Example value: 2007-03-01
   * @param {string} deleted - An ISO8601 date. When used, results will only include entries whose deletedAt date-time matches. Example value: 2007-03-01
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} sort - A string containing the sort attribute (e.g. name)
   * @param {string} direction - The sort direction
   * @param {string} filter - A string to filter the results, every API define which attributes are used to apply the filter
   * @param {boolean} showdeleted - If set to true and the user is authorized, returns the element even if was deleted
   */
  getSites = async (parameters: {
    created?: string,
    updated?: string,
    deleted?: string,
    offset?: number,
    limit?: number,
    sort?: 'name' | 'created',
    direction?: 'ASC' | 'DESC',
    filter?: string,
    showdeleted?: boolean
  }): Promise<any> => {
    let path = '/sites'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['created'] !== undefined) {
      queryParameters['created'] = parameters['created']
    }

    if (parameters['updated'] !== undefined) {
      queryParameters['updated'] = parameters['updated']
    }

    if (parameters['deleted'] !== undefined) {
      queryParameters['deleted'] = parameters['deleted']
    }

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    if (parameters['sort'] !== undefined) {
      queryParameters['sort'] = parameters['sort']
    }

    if (parameters['direction'] !== undefined) {
      queryParameters['direction'] = parameters['direction']
    }

    if (parameters['filter'] !== undefined) {
      queryParameters['filter'] = parameters['filter']
    }

    if (parameters['showdeleted'] !== undefined) {
      queryParameters['showdeleted'] = parameters['showdeleted']
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * Create a site.
   * @method
   * @name DatahubApi#postSites
   * @param {} body - Datahub Api
   */
  postSites = async (parameters: {
    body?: {
      siteId: string
    }
  }): Promise<any> => {
    let path = '/sites'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    form = queryParameters
    queryParameters = {}

    return this.request(
      'POST',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * Retrieve a specific site
   * @method
   * @name DatahubApi#getSite
   * @param {boolean} showdeleted - If set to true and the user is authorized, returns the element even if was deleted
   * @param {string} siteId - Site identifier
   */
  getSite = async (parameters: {
    showdeleted?: boolean,
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['showdeleted'] !== undefined) {
      queryParameters['showdeleted'] = parameters['showdeleted']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * Updates a site.
   * @method
   * @name DatahubApi#putSite
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   */
  putSite = async (parameters: {
    body?: {
      viewStructure?: {},
      externalServiceAuth?: {
        type: string,
        operation: 'SET' | 'UNSET',
        params?: {
          username?: string,
          password?: string
        }
      }
    },
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'PUT',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * Deletes a specific site
   * @method
   * @name DatahubApi#deleteSite
   * @param {string} siteId - Site identifier
   */
  deleteSite = async (parameters: { siteId: string }): Promise<any> => {
    let path = '/sites/{siteId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = '*/*'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'DELETE',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 現場データ複数削除
   * @method
   * @name DatahubApi#deleteSiteMultipleData
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   */
  deleteSiteMultipleData = async (parameters: {
    body?: {
      targetList:
        | Array<{
            type: string,
            ids: Array<string> | string
          }>
        | {
            type: string,
            ids: Array<string> | string
          }
    },
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/multiple-data'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = '*/*'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'DELETE',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
    * Retrieve a list of CCRS for a site
    * @method
    * @name DatahubApi#getAllCCRSBySite
         * @param {string} created - An ISO8601 date. When used, results will only include entries whose createdAt date-time matches. Example value: 2007-03-01
         * @param {string} updated - An ISO8601 date. When used, results will only include entries whose updatedAt date-time matches. Example value: 2007-03-01
         * @param {string} deleted - An ISO8601 date. When used, results will only include entries whose deletedAt date-time matches. Example value: 2007-03-01
         * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
         * @param {integer} limit - The total number of entries to include in a given response

         * @param {string} direction - The sort direction
         * @param {string} filter - A string to filter the results, every API define which attributes are used to apply the filter
         * @param {boolean} showdeleted - If set to true and the user is authorized, returns the element even if was deleted
         * @param {string} siteId - Site identifier
    */
  getAllCCRSBySite = async (parameters: {
    created?: string,
    updated?: string,
    deleted?: string,
    offset?: number,
    limit?: number,
    direction?: 'ASC' | 'DESC',
    filter?: string,
    showdeleted?: boolean,
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/ccrs'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['created'] !== undefined) {
      queryParameters['created'] = parameters['created']
    }

    if (parameters['updated'] !== undefined) {
      queryParameters['updated'] = parameters['updated']
    }

    if (parameters['deleted'] !== undefined) {
      queryParameters['deleted'] = parameters['deleted']
    }

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    queryParameters['sort'] = 'created'

    if (parameters['direction'] !== undefined) {
      queryParameters['direction'] = parameters['direction']
    }

    if (parameters['filter'] !== undefined) {
      queryParameters['filter'] = parameters['filter']
    }

    if (parameters['showdeleted'] !== undefined) {
      queryParameters['showdeleted'] = parameters['showdeleted']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * アセット一覧を取得
   * @method
   * @name DatahubApi#getSiteAssets
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {array} status - Datahub Api
   * @param {string} category - アセット分類
   * @param {boolean} needProgress - 進捗が必要かどうか
   * @param {string} siteId - Site identifier
   */
  getSiteAssets = async (parameters: {
    offset?: number,
    limit?: number,
    status?: Array<string> | string,

    category?: string,
    needProgress?: boolean,
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/assets'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    if (parameters['status'] !== undefined) {
      queryParameters['status'] = parameters['status']
    }

    if (parameters['category'] !== undefined) {
      queryParameters['category'] = parameters['category']
    }

    if (parameters['needProgress'] !== undefined) {
      queryParameters['needProgress'] = parameters['needProgress']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * アセットレコードを新規作成.
   * @method
   * @name DatahubApi#postSiteAsset
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   */
  postSiteAsset = async (parameters: {
    body?: {
      name: string,
      displayName: string,
      category: string,
      formatType: string,
      customPosition?: {},
      startDateTime?: string,
      endDateTime?: string,
      cesiumOptions?: {
        srid?: number,
        verticalSrid?: number,
        flipXY?: boolean,
        tilesetJsonPath?: string,
        isTerrain?: boolean,
        invertXY?: number,
        flipTexture?: number,
        position?: Array<number> | number
      },
      bucketId?: string,
      nodeId?: string,
      isSpace?: boolean
    },
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/assets'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    form = queryParameters
    queryParameters = {}

    return this.request(
      'POST',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * アセットをAWS-S3にアップロード
   * @method
   * @name DatahubApi#putSiteAssetUpload
   * @param {string} siteId - Site identifier
   * @param {string} assetId - Asset identifier
   * @param {string} contentType - Datahub Api
   */
  putSiteAssetUpload = async (parameters: {
    siteId: string,
    assetId: string,
    contentType: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/assets/{assetId}/upload'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{assetId}', `${parameters['assetId']}`)

    if (parameters['assetId'] === undefined) {
      throw new Error('Missing required  parameter: assetId')
    }

    if (parameters['contentType'] !== undefined) {
      headers['Content-Type'] = parameters['contentType']
    }

    if (parameters['contentType'] === undefined) {
      throw new Error('Missing required  parameter: contentType')
    }

    return this.request(
      'PUT',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * AWS-S3へのファイルアップロード完了を通知しLLPFへのファイル転送を促す
   * @method
   * @name DatahubApi#putSiteAssetOnComplete
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   * @param {string} assetId - Asset identifier
   */
  putSiteAssetOnComplete = async (parameters: {
    body?: {
      checksum: string
    },
    siteId: string,
    assetId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/assets/{assetId}/onComplete'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{assetId}', `${parameters['assetId']}`)

    if (parameters['assetId'] === undefined) {
      throw new Error('Missing required  parameter: assetId')
    }

    return this.request(
      'PUT',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * アセットを削除(LL,ION)
   * @method
   * @name DatahubApi#deleteSiteAsset
   * @param {string} siteId - Site identifier
   * @param {string} assetId - Asset identifier
   */
  deleteSiteAsset = async (parameters: {
    siteId: string,
    assetId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/assets/{assetId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = '*/*'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{assetId}', `${parameters['assetId']}`)

    if (parameters['assetId'] === undefined) {
      throw new Error('Missing required  parameter: assetId')
    }

    return this.request(
      'DELETE',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * アセットデータを更新
   * @method
   * @name DatahubApi#putSiteAsset
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   * @param {string} assetId - Asset identifier
   */
  putSiteAsset = async (parameters: {
    body?: {
      displayName?: string,
      startDateTime?: string,
      endDateTime?: string,
      customPosition?: {},
      customStyle?: {}
    },
    siteId: string,
    assetId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/assets/{assetId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{assetId}', `${parameters['assetId']}`)

    if (parameters['assetId'] === undefined) {
      throw new Error('Missing required  parameter: assetId')
    }

    return this.request(
      'PUT',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * LLストレージに格納されている、変換前のアセットデータをダウンロードする
   * @method
   * @name DatahubApi#getSiteAssetDownload
   * @param {string} siteId - Site identifier
   * @param {string} assetId - Asset identifier
   */
  getSiteAssetDownload = async (parameters: {
    siteId: string,
    assetId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/assets/{assetId}/download'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/octet-stream, application/json'
    headers['Content-Type'] = 'application/octet-stream,application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{assetId}', `${parameters['assetId']}`)

    if (parameters['assetId'] === undefined) {
      throw new Error('Missing required  parameter: assetId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * アセット情報のステータスを確認し処理を進める
   * @method
   * @name DatahubApi#patchAssets
   */
  patchAssets = async (parameters: {}): Promise<any> => {
    let path = '/assets'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    return this.request(
      'PATCH',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 注釈の一覧取得
   * @method
   * @name DatahubApi#getSiteAnnotations
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} type - Datahub Api
   * @param {string} siteId - Site identifier
   */
  getSiteAnnotations = async (parameters: {
    offset?: number,
    limit?: number,
    type?: 'Point' | 'LineString' | 'Polygon' | 'Arrow' | 'Text',
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/annotations'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    if (parameters['type'] !== undefined) {
      queryParameters['type'] = parameters['type']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 注釈の新規作成
   * @method
   * @name DatahubApi#postSiteAnnotations
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   */
  postSiteAnnotations = async (parameters: {
    body?: {
      name: string,
      type: 'Point' | 'LineString' | 'Polygon' | 'Arrow' | 'Text',
      iconType?: string,
      coordinates: Array<Array<number> | number> | Array<number> | number,

      options?: string,
      remarks?: string,
      startDateTime?: string,
      endDateTime?: string
    },
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/annotations'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    form = queryParameters
    queryParameters = {}

    return this.request(
      'POST',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 注釈の詳細取得
   * @method
   * @name DatahubApi#getSiteAnnotation
   * @param {string} siteId - Site identifier
   * @param {string} annotationId - Annotation identifier
   */
  getSiteAnnotation = async (parameters: {
    siteId: string,
    annotationId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/annotations/{annotationId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{annotationId}', `${parameters['annotationId']}`)

    if (parameters['annotationId'] === undefined) {
      throw new Error('Missing required  parameter: annotationId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 注釈の更新
   * @method
   * @name DatahubApi#putSiteAnnotation
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   * @param {string} annotationId - Annotation identifier
   */
  putSiteAnnotation = async (parameters: {
    body?: {
      name?: string,
      iconType?: string,
      coordinates?: Array<Array<number> | number> | Array<number> | number,

      options?: string,
      remarks?: string,
      startDateTime?: string,
      endDateTime?: string
    },
    siteId: string,
    annotationId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/annotations/{annotationId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{annotationId}', `${parameters['annotationId']}`)

    if (parameters['annotationId'] === undefined) {
      throw new Error('Missing required  parameter: annotationId')
    }

    return this.request(
      'PUT',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 注釈を削除
   * @method
   * @name DatahubApi#deleteSiteAnnotation
   * @param {string} siteId - Site identifier
   * @param {string} annotationId - Annotation identifier
   */
  deleteSiteAnnotation = async (parameters: {
    siteId: string,
    annotationId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/annotations/{annotationId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = '*/*'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{annotationId}', `${parameters['annotationId']}`)

    if (parameters['annotationId'] === undefined) {
      throw new Error('Missing required  parameter: annotationId')
    }

    return this.request(
      'DELETE',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 計測結果の一覧取得
   * @method
   * @name DatahubApi#getSiteAnnotationMeasurements
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} siteId - Site identifier
   * @param {string} annotationId - Annotation identifier
   */
  getSiteAnnotationMeasurements = async (parameters: {
    offset?: number,
    limit?: number,
    siteId: string,
    annotationId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/annotations/{annotationId}/measurements'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{annotationId}', `${parameters['annotationId']}`)

    if (parameters['annotationId'] === undefined) {
      throw new Error('Missing required  parameter: annotationId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 計測の新規作成
   * @method
   * @name DatahubApi#postSiteAnnotationMeasurements
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   * @param {string} annotationId - Annotation identifier
   */
  postSiteAnnotationMeasurements = async (parameters: {
    body?: {
      type: 'DISTANCE' | 'AREA' | 'CUT_AND_FILL',
      baseAssetId?: string,
      targetAssetId?: string
    },
    siteId: string,
    annotationId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/annotations/{annotationId}/measurements'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{annotationId}', `${parameters['annotationId']}`)

    if (parameters['annotationId'] === undefined) {
      throw new Error('Missing required  parameter: annotationId')
    }

    form = queryParameters
    queryParameters = {}

    return this.request(
      'POST',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 計測を削除
   * @method
   * @name DatahubApi#deleteSiteAnnotationMeasurement
   * @param {string} siteId - Site identifier
   * @param {string} annotationId - Annotation identifier
   * @param {string} measurementId - Measurement record identifier
   */
  deleteSiteAnnotationMeasurement = async (parameters: {
    siteId: string,
    annotationId: string,
    measurementId: string
  }): Promise<any> => {
    let path =
      '/sites/{siteId}/annotations/{annotationId}/measurements/{measurementId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = '*/*'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{annotationId}', `${parameters['annotationId']}`)

    if (parameters['annotationId'] === undefined) {
      throw new Error('Missing required  parameter: annotationId')
    }

    path = path.replace('{measurementId}', `${parameters['measurementId']}`)

    if (parameters['measurementId'] === undefined) {
      throw new Error('Missing required  parameter: measurementId')
    }

    return this.request(
      'DELETE',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 画像データの一覧取得
   * @method
   * @name DatahubApi#getSiteImages
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} sort - A string containing the sort attribute (e.g. name)
   * @param {string} direction - The sort direction
   * @param {array} categories - Datahub Api
   * @param {string} siteId - Site identifier
   */
  getSiteImages = async (parameters: {
    offset?: number,
    limit?: number,
    sort?: 'name' | 'created',
    direction?: 'ASC' | 'DESC',
    categories?: Array<string> | string,

    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/images'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    if (parameters['sort'] !== undefined) {
      queryParameters['sort'] = parameters['sort']
    }

    if (parameters['direction'] !== undefined) {
      queryParameters['direction'] = parameters['direction']
    }

    if (parameters['categories'] !== undefined) {
      queryParameters['categories'] = parameters['categories']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 画像データの新規作成
   * @method
   * @name DatahubApi#postSiteImages
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   */
  postSiteImages = async (parameters: {
    body?: {
      name: string,
      category?: string,
      displayName?: string,
      imageMetaString?: string,
      customPositionString?: string,
      startDateTime?: string,
      endDateTime?: string,
      remarks?: string,
      bucketId?: string,
      nodeId?: string
    },
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/images'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    form = queryParameters
    queryParameters = {}

    return this.request(
      'POST',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 画像データの詳細取得
   * @method
   * @name DatahubApi#getSiteImage
   * @param {string} siteId - Site identifier
   * @param {string} imageId - Image identifier
   */
  getSiteImage = async (parameters: {
    siteId: string,
    imageId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/images/{imageId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{imageId}', `${parameters['imageId']}`)

    if (parameters['imageId'] === undefined) {
      throw new Error('Missing required  parameter: imageId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 画像データの更新
   * @method
   * @name DatahubApi#putSiteImage
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   * @param {string} imageId - Image identifier
   */
  putSiteImage = async (parameters: {
    body?: {
      displayName?: string,
      customPosition?: {},
      startDateTime?: string,
      endDateTime?: string,
      remarks?: string
    },
    siteId: string,
    imageId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/images/{imageId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{imageId}', `${parameters['imageId']}`)

    if (parameters['imageId'] === undefined) {
      throw new Error('Missing required  parameter: imageId')
    }

    return this.request(
      'PUT',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 画像データの削除
   * @method
   * @name DatahubApi#deleteSiteImage
   * @param {string} siteId - Site identifier
   * @param {string} imageId - Image identifier
   */
  deleteSiteImage = async (parameters: {
    siteId: string,
    imageId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/images/{imageId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = '*/*'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{imageId}', `${parameters['imageId']}`)

    if (parameters['imageId'] === undefined) {
      throw new Error('Missing required  parameter: imageId')
    }

    return this.request(
      'DELETE',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 画像データのアップロード
   * @method
   * @name DatahubApi#putSiteImagesUpload
   * @param {string} checksum - ファイルチェックサム
   * @param {string} siteId - Site identifier
   * @param {string} imageId - Image identifier
   * @param {string} contentType - Datahub Api
   */
  putSiteImagesUpload = async (parameters: {
    checksum: string,
    siteId: string,
    imageId: string,
    contentType: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/images/{imageId}/upload'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['checksum'] !== undefined) {
      queryParameters['checksum'] = parameters['checksum']
    }

    if (parameters['checksum'] === undefined) {
      throw new Error('Missing required  parameter: checksum')
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{imageId}', `${parameters['imageId']}`)

    if (parameters['imageId'] === undefined) {
      throw new Error('Missing required  parameter: imageId')
    }

    if (parameters['contentType'] !== undefined) {
      headers['Content-Type'] = parameters['contentType']
    }

    if (parameters['contentType'] === undefined) {
      throw new Error('Missing required  parameter: contentType')
    }

    return this.request(
      'PUT',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * ビューポイントの一覧取得
   * @method
   * @name DatahubApi#getSiteViewpoints
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} siteId - Site identifier
   */
  getSiteViewpoints = async (parameters: {
    offset?: number,
    limit?: number,
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/viewpoints'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * ビューポイントの新規作成
   * @method
   * @name DatahubApi#postSiteViewpoints
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   */
  postSiteViewpoints = async (parameters: {
    body?: {
      name?: string,
      cesiumParams: {},
      isPublished?: boolean,
      isHomeView?: boolean
    },
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/viewpoints'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    form = queryParameters
    queryParameters = {}

    return this.request(
      'POST',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * ビューポイントの更新
   * @method
   * @name DatahubApi#putSiteViewpoint
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   * @param {string} viewpointId - Viewpoint identifier
   */
  putSiteViewpoint = async (parameters: {
    body?: {
      name?: string,
      cesiumParams?: {},
      isPublished?: boolean,
      isHomeView?: boolean
    },
    siteId: string,
    viewpointId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/viewpoints/{viewpointId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{viewpointId}', `${parameters['viewpointId']}`)

    if (parameters['viewpointId'] === undefined) {
      throw new Error('Missing required  parameter: viewpointId')
    }

    return this.request(
      'PUT',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * ビューポイントを削除
   * @method
   * @name DatahubApi#deleteSiteViewpoint
   * @param {string} siteId - Site identifier
   * @param {string} viewpointId - Viewpoint identifier
   */
  deleteSiteViewpoint = async (parameters: {
    siteId: string,
    viewpointId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/viewpoints/{viewpointId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = '*/*'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{viewpointId}', `${parameters['viewpointId']}`)

    if (parameters['viewpointId'] === undefined) {
      throw new Error('Missing required  parameter: viewpointId')
    }

    return this.request(
      'DELETE',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * アニメーション(ビューポイント)の一覧取得
   * @method
   * @name DatahubApi#getSiteViewpointAnimations
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} siteId - Site identifier
   */
  getSiteViewpointAnimations = async (parameters: {
    offset?: number,
    limit?: number,
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/viewpoint-animations'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * アニメーション(ビューポイント)の新規作成
   * @method
   * @name DatahubApi#postSiteViewpointAnimations
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   */
  postSiteViewpointAnimations = async (parameters: {
    body?: {
      name: string,
      content: {}
    },
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/viewpoint-animations'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    form = queryParameters
    queryParameters = {}

    return this.request(
      'POST',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * アニメーション(ビューポイント)の更新
   * @method
   * @name DatahubApi#putSiteViewpointAnimation
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   * @param {string} viewpointAnimationId - Viewpoint animation identifier
   */
  putSiteViewpointAnimation = async (parameters: {
    body?: {
      name?: string,
      content?: {},
      isPublished?: boolean
    },
    siteId: string,
    viewpointAnimationId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/viewpoint-animations/{viewpointAnimationId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace(
      '{viewpointAnimationId}',
      `${parameters['viewpointAnimationId']}`
    )

    if (parameters['viewpointAnimationId'] === undefined) {
      throw new Error('Missing required  parameter: viewpointAnimationId')
    }

    return this.request(
      'PUT',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * アニメーション(ビューポイント)を削除
   * @method
   * @name DatahubApi#deleteSiteViewpointAnimation
   * @param {string} siteId - Site identifier
   * @param {string} viewpointAnimationId - Viewpoint animation identifier
   */
  deleteSiteViewpointAnimation = async (parameters: {
    siteId: string,
    viewpointAnimationId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/viewpoint-animations/{viewpointAnimationId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = '*/*'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace(
      '{viewpointAnimationId}',
      `${parameters['viewpointAnimationId']}`
    )

    if (parameters['viewpointAnimationId'] === undefined) {
      throw new Error('Missing required  parameter: viewpointAnimationId')
    }

    return this.request(
      'DELETE',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * アイテム表示設定の一覧取得
   * @method
   * @name DatahubApi#getSiteViewSettings
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} siteId - Site identifier
   */
  getSiteViewSettings = async (parameters: {
    offset?: number,
    limit?: number,
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/view-settings'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * アイテム表示設定の新規作成
   * @method
   * @name DatahubApi#postSiteViewSettings
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   */
  postSiteViewSettings = async (parameters: {
    body?: {
      name?: string,
      content: {},
      isPublished?: boolean
    },
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/view-settings'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    form = queryParameters
    queryParameters = {}

    return this.request(
      'POST',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * アイテム表示設定の更新
   * @method
   * @name DatahubApi#putSiteViewSetting
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   * @param {string} viewSettingId - View setting identifier
   */
  putSiteViewSetting = async (parameters: {
    body?: {
      name?: string,
      content?: {},
      isPublished?: boolean
    },
    siteId: string,
    viewSettingId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/view-settings/{viewSettingId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{viewSettingId}', `${parameters['viewSettingId']}`)

    if (parameters['viewSettingId'] === undefined) {
      throw new Error('Missing required  parameter: viewSettingId')
    }

    return this.request(
      'PUT',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * アイテム表示設定を削除
   * @method
   * @name DatahubApi#deleteSiteViewSetting
   * @param {string} siteId - Site identifier
   * @param {string} viewSettingId - View setting identifier
   */
  deleteSiteViewSetting = async (parameters: {
    siteId: string,
    viewSettingId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/view-settings/{viewSettingId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = '*/*'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{viewSettingId}', `${parameters['viewSettingId']}`)

    if (parameters['viewSettingId'] === undefined) {
      throw new Error('Missing required  parameter: viewSettingId')
    }

    return this.request(
      'DELETE',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 現場公開設定および処理状況の取得
   * @method
   * @name DatahubApi#getSitePublishSetting
   * @param {string} siteId - Site identifier
   */
  getSitePublishSetting = async (parameters: {
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/publish-setting'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 現場公開設定の新規作成および更新
   * @method
   * @name DatahubApi#putSitePublishSetting
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   */
  putSitePublishSetting = async (parameters: {
    body?: {
      isPublished: boolean,
      roles: Array<string> | string,

      password?: string,
      startDateTime?: string,
      endDateTime?: string
    },
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/publish-setting'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'PUT',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 公開済のデータセットの取得
   * @method
   * @name DatahubApi#getDataset
   * @param {string} datasetId - Data set identifier
   * @param {string} xDatasetPass - 公開画面を表示するためのパスワード
   */
  getDataset = async (parameters: {
    datasetId: string,
    xDatasetPass?: string
  }): Promise<any> => {
    let path = '/datasets/{datasetId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{datasetId}', `${parameters['datasetId']}`)

    if (parameters['datasetId'] === undefined) {
      throw new Error('Missing required  parameter: datasetId')
    }

    if (parameters['xDatasetPass'] !== undefined) {
      headers['X-Dataset-Pass'] = parameters['xDatasetPass']
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * [公開データセット]アセット一覧を取得
   * @method
   * @name DatahubApi#getDatasetAssets
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} datasetId - Data set identifier
   */
  getDatasetAssets = async (parameters: {
    offset?: number,
    limit?: number,
    datasetId: string
  }): Promise<any> => {
    let path = '/datasets/{datasetId}/assets'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    path = path.replace('{datasetId}', `${parameters['datasetId']}`)

    if (parameters['datasetId'] === undefined) {
      throw new Error('Missing required  parameter: datasetId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * [公開データセット]アセットダウンロード
   * @method
   * @name DatahubApi#getDatasetAssetDownload
   * @param {string} datasetId - Data set identifier
   * @param {string} assetId - Asset identifier
   */
  getDatasetAssetDownload = async (parameters: {
    datasetId: string,
    assetId: string
  }): Promise<any> => {
    let path = '/datasets/{datasetId}/assets/{assetId}/download'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/octet-stream, application/json'
    headers['Content-Type'] = 'application/octet-stream,application/json'

    path = path.replace('{datasetId}', `${parameters['datasetId']}`)

    if (parameters['datasetId'] === undefined) {
      throw new Error('Missing required  parameter: datasetId')
    }

    path = path.replace('{assetId}', `${parameters['assetId']}`)

    if (parameters['assetId'] === undefined) {
      throw new Error('Missing required  parameter: assetId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * [公開データセット]注釈一覧を取得
   * @method
   * @name DatahubApi#getDatasetAnnotations
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} datasetId - Data set identifier
   */
  getDatasetAnnotations = async (parameters: {
    offset?: number,
    limit?: number,
    datasetId: string
  }): Promise<any> => {
    let path = '/datasets/{datasetId}/annotations'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    path = path.replace('{datasetId}', `${parameters['datasetId']}`)

    if (parameters['datasetId'] === undefined) {
      throw new Error('Missing required  parameter: datasetId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * [公開データセット]注釈詳細を取得
   * @method
   * @name DatahubApi#getDatasetAnnotation
   * @param {string} datasetId - Data set identifier
   * @param {string} annotationId - Annotation identifier
   */
  getDatasetAnnotation = async (parameters: {
    datasetId: string,
    annotationId: string
  }): Promise<any> => {
    let path = '/datasets/{datasetId}/annotations/{annotationId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{datasetId}', `${parameters['datasetId']}`)

    if (parameters['datasetId'] === undefined) {
      throw new Error('Missing required  parameter: datasetId')
    }

    path = path.replace('{annotationId}', `${parameters['annotationId']}`)

    if (parameters['annotationId'] === undefined) {
      throw new Error('Missing required  parameter: annotationId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * [公開データセット]計測結果一覧を取得
   * @method
   * @name DatahubApi#getDatasetAnnotationMeasurements
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} datasetId - Data set identifier
   * @param {string} annotationId - Annotation identifier
   */
  getDatasetAnnotationMeasurements = async (parameters: {
    offset?: number,
    limit?: number,
    datasetId: string,
    annotationId: string
  }): Promise<any> => {
    let path = '/datasets/{datasetId}/annotations/{annotationId}/measurements'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    path = path.replace('{datasetId}', `${parameters['datasetId']}`)

    if (parameters['datasetId'] === undefined) {
      throw new Error('Missing required  parameter: datasetId')
    }

    path = path.replace('{annotationId}', `${parameters['annotationId']}`)

    if (parameters['annotationId'] === undefined) {
      throw new Error('Missing required  parameter: annotationId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * [公開データセット]画像一覧を取得
   * @method
   * @name DatahubApi#getDatasetImages
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} sort - A string containing the sort attribute (e.g. name)
   * @param {string} direction - The sort direction
   * @param {array} categories - Datahub Api
   * @param {string} datasetId - Data set identifier
   */
  getDatasetImages = async (parameters: {
    offset?: number,
    limit?: number,
    sort?: 'name' | 'created',
    direction?: 'ASC' | 'DESC',
    categories?: Array<string> | string,

    datasetId: string
  }): Promise<any> => {
    let path = '/datasets/{datasetId}/images'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    if (parameters['sort'] !== undefined) {
      queryParameters['sort'] = parameters['sort']
    }

    if (parameters['direction'] !== undefined) {
      queryParameters['direction'] = parameters['direction']
    }

    if (parameters['categories'] !== undefined) {
      queryParameters['categories'] = parameters['categories']
    }

    path = path.replace('{datasetId}', `${parameters['datasetId']}`)

    if (parameters['datasetId'] === undefined) {
      throw new Error('Missing required  parameter: datasetId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * [公開データセット]画像データを取得
   * @method
   * @name DatahubApi#getDatasetImage
   * @param {string} datasetId - Data set identifier
   * @param {string} imageId - Image identifier
   */
  getDatasetImage = async (parameters: {
    datasetId: string,
    imageId: string
  }): Promise<any> => {
    let path = '/datasets/{datasetId}/images/{imageId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{datasetId}', `${parameters['datasetId']}`)

    if (parameters['datasetId'] === undefined) {
      throw new Error('Missing required  parameter: datasetId')
    }

    path = path.replace('{imageId}', `${parameters['imageId']}`)

    if (parameters['imageId'] === undefined) {
      throw new Error('Missing required  parameter: imageId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * [公開データセット]ビューポイント一覧を取得
   * @method
   * @name DatahubApi#getDatasetViewpoints
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} datasetId - Data set identifier
   */
  getDatasetViewpoints = async (parameters: {
    offset?: number,
    limit?: number,
    datasetId: string
  }): Promise<any> => {
    let path = '/datasets/{datasetId}/viewpoints'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    path = path.replace('{datasetId}', `${parameters['datasetId']}`)

    if (parameters['datasetId'] === undefined) {
      throw new Error('Missing required  parameter: datasetId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * [公開データセット]ビューポイントアニメーション一覧を取得
   * @method
   * @name DatahubApi#getDatasetViewpointAnimations
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} datasetId - Data set identifier
   */
  getDatasetViewpointAnimations = async (parameters: {
    offset?: number,
    limit?: number,
    datasetId: string
  }): Promise<any> => {
    let path = '/datasets/{datasetId}/viewpoint-animations'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    path = path.replace('{datasetId}', `${parameters['datasetId']}`)

    if (parameters['datasetId'] === undefined) {
      throw new Error('Missing required  parameter: datasetId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * [公開データセット]アイテム表示設定一覧を取得
   * @method
   * @name DatahubApi#getDatasetViewSettings
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} datasetId - Data set identifier
   */
  getDatasetViewSettings = async (parameters: {
    offset?: number,
    limit?: number,
    datasetId: string
  }): Promise<any> => {
    let path = '/datasets/{datasetId}/view-settings'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    path = path.replace('{datasetId}', `${parameters['datasetId']}`)

    if (parameters['datasetId'] === undefined) {
      throw new Error('Missing required  parameter: datasetId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * [公開データセット]図表設定データ詳細を取得
   * @method
   * @name DatahubApi#getDatasetChart
   * @param {string} datasetId - Data set identifier
   * @param {string} chartId - Chart identifier
   */
  getDatasetChart = async (parameters: {
    datasetId: string,
    chartId: string
  }): Promise<any> => {
    let path = '/datasets/{datasetId}/charts/{chartId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{datasetId}', `${parameters['datasetId']}`)

    if (parameters['datasetId'] === undefined) {
      throw new Error('Missing required  parameter: datasetId')
    }

    path = path.replace('{chartId}', `${parameters['chartId']}`)

    if (parameters['chartId'] === undefined) {
      throw new Error('Missing required  parameter: chartId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * [公開データセット]図表の算出元データをダウンロード
   * @method
   * @name DatahubApi#getDatasetChartDownload
   * @param {string} datasetId - Data set identifier
   * @param {string} chartId - Chart identifier
   */
  getDatasetChartDownload = async (parameters: {
    datasetId: string,
    chartId: string
  }): Promise<any> => {
    let path = '/datasets/{datasetId}/charts/{chartId}/download'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'text/*, application/octet-stream, application/json'
    headers['Content-Type'] = 'text/*,application/octet-stream,application/json'

    path = path.replace('{datasetId}', `${parameters['datasetId']}`)

    if (parameters['datasetId'] === undefined) {
      throw new Error('Missing required  parameter: datasetId')
    }

    path = path.replace('{chartId}', `${parameters['chartId']}`)

    if (parameters['chartId'] === undefined) {
      throw new Error('Missing required  parameter: chartId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * [公開データセット]デバイス一覧を取得
   * @method
   * @name DatahubApi#getDatasetDevices
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} sort - A string containing the sort attribute (e.g. name)
   * @param {string} direction - The sort direction
   * @param {string} datasetId - Data set identifier
   */
  getDatasetDevices = async (parameters: {
    offset?: number,
    limit?: number,
    sort?: 'name' | 'created',
    direction?: 'ASC' | 'DESC',
    datasetId: string
  }): Promise<any> => {
    let path = '/datasets/{datasetId}/devices'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    if (parameters['sort'] !== undefined) {
      queryParameters['sort'] = parameters['sort']
    }

    if (parameters['direction'] !== undefined) {
      queryParameters['direction'] = parameters['direction']
    }

    path = path.replace('{datasetId}', `${parameters['datasetId']}`)

    if (parameters['datasetId'] === undefined) {
      throw new Error('Missing required  parameter: datasetId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * [公開データセット]デバイスデータを取得
   * @method
   * @name DatahubApi#getDatasetDevice
   * @param {array} additionalOptions - 追加オプション
   * @param {string} datasetId - Data set identifier
   * @param {string} deviceId - Device ID
   */
  getDatasetDevice = async (parameters: {
    additionalOptions?: Array<string> | string,

    datasetId: string,
    deviceId: string
  }): Promise<any> => {
    let path = '/datasets/{datasetId}/devices/{deviceId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['additionalOptions'] !== undefined) {
      queryParameters['additionalOptions'] = parameters['additionalOptions']
    }

    path = path.replace('{datasetId}', `${parameters['datasetId']}`)

    if (parameters['datasetId'] === undefined) {
      throw new Error('Missing required  parameter: datasetId')
    }

    path = path.replace('{deviceId}', `${parameters['deviceId']}`)

    if (parameters['deviceId'] === undefined) {
      throw new Error('Missing required  parameter: deviceId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * gisファイル形式変換
   * @method
   * @name DatahubApi#postSiteConvertors
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   */
  postSiteConvertors = async (parameters: {
    body?: {
      importFileString: string,
      importFileType: 'geojson',
      exportFileType: 'dxf',
      options?: {
        tSrs: number
      }
    },
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/convertors'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/octet-stream, application/json'
    headers['Content-Type'] = 'application/octet-stream,application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    form = queryParameters
    queryParameters = {}

    return this.request(
      'POST',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 図表設定データ一覧取得
   * @method
   * @name DatahubApi#getSiteCharts
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} siteId - Site identifier
   */
  getSiteCharts = async (parameters: {
    offset?: number,
    limit?: number,
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/charts'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 図表設定データ新規作成
   * @method
   * @name DatahubApi#postSiteCharts
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   */
  postSiteCharts = async (parameters: {
    body?: {
      name?: string,
      type?: 'LINE' | 'AREA' | 'BAR' | 'STACKED_BAR',
      referenceInfo: {
        type: 'annotation',
        id: string
      },
      resourceInfo: {
        nodeId?: string,
        externalData?: {
          name: string,
          url: string
        },
        useCsvHeader?: boolean
      },
      horizontal?: {
        label?: string,
        axis: number,
        unit?: string,
        startDateTime?: string,
        endDateTime?: string,
        limitCount?: number
      },
      verticalList?:
        | Array<{
            label?: string,
            axisList: Array<number> | number,

            displayRange: Array<string> | string
          }>
        | {
            label?: string,
            axisList: Array<number> | number,

            displayRange: Array<string> | string
          },

      updateInterval?: number,
      monitorList?:
        | Array<{
            name: string,
            targetAxis: {
              name?: string,
              value?: number
            },
            threshold: number,
            condition: 'GREATER_THAN' | 'LESS_THAN',
            actions:
              | Array<{
                  type: 'NOTICE' | 'MODEL',
                  targetAssetIds?: Array<string> | string,

                  options?: {}
                }>
              | {
                  type: 'NOTICE' | 'MODEL',
                  targetAssetIds?: Array<string> | string,

                  options?: {}
                },

            isTriggered?: boolean
          }>
        | {
            name: string,
            targetAxis: {
              name?: string,
              value?: number
            },
            threshold: number,
            condition: 'GREATER_THAN' | 'LESS_THAN',
            actions:
              | Array<{
                  type: 'NOTICE' | 'MODEL',
                  targetAssetIds?: Array<string> | string,

                  options?: {}
                }>
              | {
                  type: 'NOTICE' | 'MODEL',
                  targetAssetIds?: Array<string> | string,

                  options?: {}
                },

            isTriggered?: boolean
          },

      dataIntegrationList?:
        | Array<{
            type: 'TIMELINER',
            targetAxis: {
              name?: string,
              value?: number
            },
            settings:
              | Array<{
                  referenceInfo: {
                    type: 'asset',
                    id: string
                  },
                  conditions:
                    | Array<{
                        type?:
                          | 'GREATER_THAN'
                          | 'LESS_THAN'
                          | 'OR_GREATER'
                          | 'OR_LESS',
                        threshold?: number
                      }>
                    | {
                        type?:
                          | 'GREATER_THAN'
                          | 'LESS_THAN'
                          | 'OR_GREATER'
                          | 'OR_LESS',
                        threshold?: number
                      }
                }>
              | {
                  referenceInfo: {
                    type: 'asset',
                    id: string
                  },
                  conditions:
                    | Array<{
                        type?:
                          | 'GREATER_THAN'
                          | 'LESS_THAN'
                          | 'OR_GREATER'
                          | 'OR_LESS',
                        threshold?: number
                      }>
                    | {
                        type?:
                          | 'GREATER_THAN'
                          | 'LESS_THAN'
                          | 'OR_GREATER'
                          | 'OR_LESS',
                        threshold?: number
                      }
                }
          }>
        | {
            type: 'TIMELINER',
            targetAxis: {
              name?: string,
              value?: number
            },
            settings:
              | Array<{
                  referenceInfo: {
                    type: 'asset',
                    id: string
                  },
                  conditions:
                    | Array<{
                        type?:
                          | 'GREATER_THAN'
                          | 'LESS_THAN'
                          | 'OR_GREATER'
                          | 'OR_LESS',
                        threshold?: number
                      }>
                    | {
                        type?:
                          | 'GREATER_THAN'
                          | 'LESS_THAN'
                          | 'OR_GREATER'
                          | 'OR_LESS',
                        threshold?: number
                      }
                }>
              | {
                  referenceInfo: {
                    type: 'asset',
                    id: string
                  },
                  conditions:
                    | Array<{
                        type?:
                          | 'GREATER_THAN'
                          | 'LESS_THAN'
                          | 'OR_GREATER'
                          | 'OR_LESS',
                        threshold?: number
                      }>
                    | {
                        type?:
                          | 'GREATER_THAN'
                          | 'LESS_THAN'
                          | 'OR_GREATER'
                          | 'OR_LESS',
                        threshold?: number
                      }
                }
          }
    },
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/charts'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    form = queryParameters
    queryParameters = {}

    return this.request(
      'POST',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 図表設定データ詳細取得
   * @method
   * @name DatahubApi#getSiteChart
   * @param {string} siteId - Site identifier
   * @param {string} chartId - Chart identifier
   */
  getSiteChart = async (parameters: {
    siteId: string,
    chartId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/charts/{chartId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{chartId}', `${parameters['chartId']}`)

    if (parameters['chartId'] === undefined) {
      throw new Error('Missing required  parameter: chartId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 図表設定データ更新
   * @method
   * @name DatahubApi#putSiteChart
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   * @param {string} chartId - Chart identifier
   */
  putSiteChart = async (parameters: {
    body?: {
      name?: string,
      type?: 'LINE' | 'AREA' | 'BAR' | 'STACKED_BAR',
      resourceInfo?: {
        useCsvHeader?: boolean
      },
      horizontal?: {
        label?: string,
        axis: number,
        unit?: string,
        startDateTime?: string,
        endDateTime?: string,
        limitCount?: number
      },
      verticalList?:
        | Array<{
            label?: string,
            axisList: Array<number> | number,

            displayRange: Array<string> | string
          }>
        | {
            label?: string,
            axisList: Array<number> | number,

            displayRange: Array<string> | string
          },

      updateInterval?: number,
      monitorList?:
        | Array<{
            name: string,
            targetAxis: {
              name?: string,
              value?: number
            },
            threshold: number,
            condition: 'GREATER_THAN' | 'LESS_THAN',
            actions:
              | Array<{
                  type: 'NOTICE' | 'MODEL',
                  targetAssetIds?: Array<string> | string,

                  options?: {}
                }>
              | {
                  type: 'NOTICE' | 'MODEL',
                  targetAssetIds?: Array<string> | string,

                  options?: {}
                },

            isTriggered?: boolean
          }>
        | {
            name: string,
            targetAxis: {
              name?: string,
              value?: number
            },
            threshold: number,
            condition: 'GREATER_THAN' | 'LESS_THAN',
            actions:
              | Array<{
                  type: 'NOTICE' | 'MODEL',
                  targetAssetIds?: Array<string> | string,

                  options?: {}
                }>
              | {
                  type: 'NOTICE' | 'MODEL',
                  targetAssetIds?: Array<string> | string,

                  options?: {}
                },

            isTriggered?: boolean
          },

      dataIntegrationList?:
        | Array<{
            type: 'TIMELINER',
            targetAxis: {
              name?: string,
              value?: number
            },
            settings:
              | Array<{
                  referenceInfo: {
                    type: 'asset',
                    id: string
                  },
                  conditions:
                    | Array<{
                        type?:
                          | 'GREATER_THAN'
                          | 'LESS_THAN'
                          | 'OR_GREATER'
                          | 'OR_LESS',
                        threshold?: number
                      }>
                    | {
                        type?:
                          | 'GREATER_THAN'
                          | 'LESS_THAN'
                          | 'OR_GREATER'
                          | 'OR_LESS',
                        threshold?: number
                      }
                }>
              | {
                  referenceInfo: {
                    type: 'asset',
                    id: string
                  },
                  conditions:
                    | Array<{
                        type?:
                          | 'GREATER_THAN'
                          | 'LESS_THAN'
                          | 'OR_GREATER'
                          | 'OR_LESS',
                        threshold?: number
                      }>
                    | {
                        type?:
                          | 'GREATER_THAN'
                          | 'LESS_THAN'
                          | 'OR_GREATER'
                          | 'OR_LESS',
                        threshold?: number
                      }
                }
          }>
        | {
            type: 'TIMELINER',
            targetAxis: {
              name?: string,
              value?: number
            },
            settings:
              | Array<{
                  referenceInfo: {
                    type: 'asset',
                    id: string
                  },
                  conditions:
                    | Array<{
                        type?:
                          | 'GREATER_THAN'
                          | 'LESS_THAN'
                          | 'OR_GREATER'
                          | 'OR_LESS',
                        threshold?: number
                      }>
                    | {
                        type?:
                          | 'GREATER_THAN'
                          | 'LESS_THAN'
                          | 'OR_GREATER'
                          | 'OR_LESS',
                        threshold?: number
                      }
                }>
              | {
                  referenceInfo: {
                    type: 'asset',
                    id: string
                  },
                  conditions:
                    | Array<{
                        type?:
                          | 'GREATER_THAN'
                          | 'LESS_THAN'
                          | 'OR_GREATER'
                          | 'OR_LESS',
                        threshold?: number
                      }>
                    | {
                        type?:
                          | 'GREATER_THAN'
                          | 'LESS_THAN'
                          | 'OR_GREATER'
                          | 'OR_LESS',
                        threshold?: number
                      }
                }
          }
    },
    siteId: string,
    chartId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/charts/{chartId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{chartId}', `${parameters['chartId']}`)

    if (parameters['chartId'] === undefined) {
      throw new Error('Missing required  parameter: chartId')
    }

    return this.request(
      'PUT',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 図表設定データ削除
   * @method
   * @name DatahubApi#deleteSiteChart
   * @param {string} siteId - Site identifier
   * @param {string} chartId - Chart identifier
   */
  deleteSiteChart = async (parameters: {
    siteId: string,
    chartId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/charts/{chartId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = '*/*'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{chartId}', `${parameters['chartId']}`)

    if (parameters['chartId'] === undefined) {
      throw new Error('Missing required  parameter: chartId')
    }

    return this.request(
      'DELETE',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 図表の算出元データをダウンロード
   * @method
   * @name DatahubApi#getSiteChartDownload
   * @param {string} siteId - Site identifier
   * @param {string} chartId - Chart identifier
   */
  getSiteChartDownload = async (parameters: {
    siteId: string,
    chartId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/charts/{chartId}/download'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'text/*, application/octet-stream, application/json'
    headers['Content-Type'] = 'text/*,application/octet-stream,application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{chartId}', `${parameters['chartId']}`)

    if (parameters['chartId'] === undefined) {
      throw new Error('Missing required  parameter: chartId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * リアルタイム監視の処理を実行する
   * @method
   * @name DatahubApi#patchChartsMonitoring
   */
  patchChartsMonitoring = async (parameters: {}): Promise<any> => {
    let path = '/charts/monitoring'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    return this.request(
      'PATCH',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
    * WMTSデータ一覧取得
    * @method
    * @name DatahubApi#getSiteWmtsList
         * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
         * @param {integer} limit - The total number of entries to include in a given response

         * @param {string} direction - The sort direction
         * @param {string} siteId - Site identifier
    */
  getSiteWmtsList = async (parameters: {
    offset?: number,
    limit?: number,
    direction?: 'ASC' | 'DESC',
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/wmts'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    queryParameters['sort'] = 'created'

    if (parameters['direction'] !== undefined) {
      queryParameters['direction'] = parameters['direction']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * WMTSデータ新規作成
   * @method
   * @name DatahubApi#postSiteWmts
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   */
  postSiteWmts = async (parameters: {
    body?: {
      name: string,
      url: string,
      wmtsParams: {}
    },
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/wmts'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    form = queryParameters
    queryParameters = {}

    return this.request(
      'POST',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * WMTSデータ更新
   * @method
   * @name DatahubApi#putSiteWmts
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   * @param {string} wmtsId - WMTS data identifier
   */
  putSiteWmts = async (parameters: {
    body?: {
      name: string
    },
    siteId: string,
    wmtsId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/wmts/{wmtsId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{wmtsId}', `${parameters['wmtsId']}`)

    if (parameters['wmtsId'] === undefined) {
      throw new Error('Missing required  parameter: wmtsId')
    }

    return this.request(
      'PUT',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * WMTSデータ削除
   * @method
   * @name DatahubApi#deleteSiteWmts
   * @param {string} siteId - Site identifier
   * @param {string} wmtsId - WMTS data identifier
   */
  deleteSiteWmts = async (parameters: {
    siteId: string,
    wmtsId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/wmts/{wmtsId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = '*/*'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{wmtsId}', `${parameters['wmtsId']}`)

    if (parameters['wmtsId'] === undefined) {
      throw new Error('Missing required  parameter: wmtsId')
    }

    return this.request(
      'DELETE',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 通知先情報一覧取得
   * @method
   * @name DatahubApi#getSiteContacts
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} siteId - Site identifier
   */
  getSiteContacts = async (parameters: {
    offset?: number,
    limit?: number,
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/contacts'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 通知先情報一括更新
   * @method
   * @name DatahubApi#putSiteContacts
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   */
  putSiteContacts = async (parameters: {
    body?: {
      loginUserIds: Array<string> | string
    },
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/contacts'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'PUT',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * users_notificationsのデータ更新
   * @method
   * @name DatahubApi#putUserNotification
   * @param {} body - Datahub Api
   */
  putUserNotification = async (parameters: {
    body?: {
      type: 'RELEASE_NOTE' | 'NOTICE',
      checkedAt: string
    }
  }): Promise<any> => {
    let path = '/users-notifications'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    return this.request(
      'PUT',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 動画データの一覧取得
   * @method
   * @name DatahubApi#getSiteVideos
   * @param {integer} offset - Given a collection of results, the numeric offset (inclusive) of the first item to return
   * @param {integer} limit - The total number of entries to include in a given response
   * @param {string} sort - A string containing the sort attribute (e.g. name)
   * @param {string} direction - The sort direction
   * @param {string} siteId - Site identifier
   */
  getSiteVideos = async (parameters: {
    offset?: number,
    limit?: number,
    sort?: 'name' | 'created',
    direction?: 'ASC' | 'DESC',
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/videos'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['offset'] !== undefined) {
      queryParameters['offset'] = parameters['offset']
    }

    if (parameters['limit'] !== undefined) {
      queryParameters['limit'] = parameters['limit']
    }

    if (parameters['sort'] !== undefined) {
      queryParameters['sort'] = parameters['sort']
    }

    if (parameters['direction'] !== undefined) {
      queryParameters['direction'] = parameters['direction']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 動画データの新規作成
   * @method
   * @name DatahubApi#postSiteVideos
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   */
  postSiteVideos = async (parameters: {
    body?: {
      name: string,
      displayName?: string,
      customPosition?: {},
      startDateTime?: string,
      endDateTime?: string,
      remarks?: string,
      bucketId?: string,
      nodeId?: string
    },
    siteId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/videos'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    form = queryParameters
    queryParameters = {}

    return this.request(
      'POST',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 動画データの詳細取得
   * @method
   * @name DatahubApi#getSiteVideo
   * @param {string} siteId - Site identifier
   * @param {string} videoId - Video identifier
   */
  getSiteVideo = async (parameters: {
    siteId: string,
    videoId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/videos/{videoId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{videoId}', `${parameters['videoId']}`)

    if (parameters['videoId'] === undefined) {
      throw new Error('Missing required  parameter: videoId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 動画データの更新
   * @method
   * @name DatahubApi#putSiteVideo
   * @param {} body - Datahub Api
   * @param {string} siteId - Site identifier
   * @param {string} videoId - Video identifier
   */
  putSiteVideo = async (parameters: {
    body?: {
      displayName?: string,
      customPosition?: {},
      startDateTime?: string,
      endDateTime?: string,
      remarks?: string
    },
    siteId: string,
    videoId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/videos/{videoId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['body'] !== undefined) {
      body = parameters['body']
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{videoId}', `${parameters['videoId']}`)

    if (parameters['videoId'] === undefined) {
      throw new Error('Missing required  parameter: videoId')
    }

    return this.request(
      'PUT',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 動画データの削除
   * @method
   * @name DatahubApi#deleteSiteVideo
   * @param {string} siteId - Site identifier
   * @param {string} videoId - Video identifier
   */
  deleteSiteVideo = async (parameters: {
    siteId: string,
    videoId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/videos/{videoId}'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = '*/*'
    headers['Content-Type'] = 'application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{videoId}', `${parameters['videoId']}`)

    if (parameters['videoId'] === undefined) {
      throw new Error('Missing required  parameter: videoId')
    }

    return this.request(
      'DELETE',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 動画データのアップロード
   * @method
   * @name DatahubApi#putSiteVideoUpload
   * @param {string} checksum - ファイルチェックサム
   * @param {string} siteId - Site identifier
   * @param {string} videoId - Video identifier
   * @param {string} contentType - Datahub Api
   */
  putSiteVideoUpload = async (parameters: {
    checksum: string,
    siteId: string,
    videoId: string,
    contentType: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/videos/{videoId}/upload'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'

    if (parameters['checksum'] !== undefined) {
      queryParameters['checksum'] = parameters['checksum']
    }

    if (parameters['checksum'] === undefined) {
      throw new Error('Missing required  parameter: checksum')
    }

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{videoId}', `${parameters['videoId']}`)

    if (parameters['videoId'] === undefined) {
      throw new Error('Missing required  parameter: videoId')
    }

    if (parameters['contentType'] !== undefined) {
      headers['Content-Type'] = parameters['contentType']
    }

    if (parameters['contentType'] === undefined) {
      throw new Error('Missing required  parameter: contentType')
    }

    return this.request(
      'PUT',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }

  /**
   * 動画データをダウンロード
   * @method
   * @name DatahubApi#getSiteVideoDownload
   * @param {string} siteId - Site identifier
   * @param {string} videoId - Video identifier
   */
  getSiteVideoDownload = async (parameters: {
    siteId: string,
    videoId: string
  }): Promise<any> => {
    let path = '/sites/{siteId}/videos/{videoId}/download'
    let body: any
    let queryParameters: any = {}
    let headers: any = {}
    let form: any = {}

    headers['Accept'] = 'application/octet-stream, application/json'
    headers['Content-Type'] = 'application/octet-stream,application/json'

    path = path.replace('{siteId}', `${parameters['siteId']}`)

    if (parameters['siteId'] === undefined) {
      throw new Error('Missing required  parameter: siteId')
    }

    path = path.replace('{videoId}', `${parameters['videoId']}`)

    if (parameters['videoId'] === undefined) {
      throw new Error('Missing required  parameter: videoId')
    }

    return this.request(
      'GET',
      this.domain + path,
      body,
      headers,
      queryParameters,
      form
    )
  }
}
