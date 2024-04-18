const ETC_API_PREFIX = '/etc/public/v1'
const CONCIERGE_API_PREFIX = '/consierge/v1'
const INQUIRY_API_PREFIX = '/etc/v1'

export const PHONE_RESERVATION = `${ETC_API_PREFIX}/callReservation`
export const INQUIRY_ONE_TO_ONE = `${INQUIRY_API_PREFIX}/inquiry`
export const INQUIRY_ONE_TO_ONE_MINE = `${INQUIRY_API_PREFIX}/inquiry/myPage`
export const TOP_TEN_FAQS = `${ETC_API_PREFIX}/faqs/topten`
export const LIST_FAQS = `${ETC_API_PREFIX}/faqs`
export const LIST_NOTIFICATIONS = `${CONCIERGE_API_PREFIX}/notifications`
export const DELETE_ALL_NOTIFICATIONS = `${CONCIERGE_API_PREFIX}/notifications`
export const DELETE_SPECIFIC_NOTIFICATIONS = (id) => `${CONCIERGE_API_PREFIX}/notifications/${id}`
export const RECENT_NOTIFICATIONS = `${CONCIERGE_API_PREFIX}/recent-notifications`
export const READ_NOTIFICATION = (id) => `${CONCIERGE_API_PREFIX}/notifications/${id}`
export const DELETE_INQUIRY = (id) => `${INQUIRY_API_PREFIX}/inquiry/${id}`
export const DETAIL_INQUIRY = (id) => `${INQUIRY_API_PREFIX}/inquiry/${id}`
export const EDIT_INQUIRY = (id) => `${INQUIRY_API_PREFIX}/inquiry/${id}`
