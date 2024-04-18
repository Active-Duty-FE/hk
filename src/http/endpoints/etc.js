const ETC_API_PREFIX = '/etc/cms/ec'

export const NOTICE_LIST = `${ETC_API_PREFIX}/search-notice/`
export const NOTICE_DETAIL = (id) => `${ETC_API_PREFIX}/policy/${id}`
export const ARCHIVE_SEARCH_LIST = `${ETC_API_PREFIX}/search-archive`
export const ARCHIVE_DETAIL = (id) => `${ETC_API_PREFIX}/policy/${id}`
