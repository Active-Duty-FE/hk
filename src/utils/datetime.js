import { FORMAT_FULL_DATE_MIN, FORMAT_FULL_YEAR } from '@/helpers/constant'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(weekOfYear)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)
// set default local timezone
// dayjs.tz.setDefault(dayjs.tz.guess())
dayjs.tz.setDefault('America/Los_Angeles')

export const formatDateTime = (date, format) =>
  dayjs.utc(date).tz('America/Los_Angeles').format(format)

export const maxYearFromNow = () => dayjs().get('year') + 100

export const minYearFromNow = () => dayjs().get('year') - 100

export const getWeekNumByDate = (date) => dayjs(date).week()

export const checkIfDiffWeek = (start, end) => getWeekNumByDate(start) !== getWeekNumByDate(end)

export const getDatesWithinRange = (startDate, endDate) => {
  const start = `${formatDateTime(startDate, FORMAT_FULL_DATE_MIN)}`
  const end = `${formatDateTime(endDate, FORMAT_FULL_DATE_MIN)}`
  const dates = []
  const weekWithDates = {}
  const currentDate = new Date(start)

  while (currentDate <= new Date(end)) {
    dates.push(formatDateTime(new Date(currentDate), FORMAT_FULL_YEAR))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  if (dates.length < 2) {
    dates.shift()
  }

  dates.forEach((item) => {
    const weekNum = getWeekNumByDate(item)
    if (weekWithDates[weekNum]?.length) {
      weekWithDates[weekNum].push(item)
    } else {
      weekWithDates[weekNum] = [item]
    }
  })

  return { dates, weekWithDates }
}

export const getDateMonthRange = (range = 3, type = 'months') => {
  return {
    end: dayjs().format(FORMAT_FULL_YEAR),
    start: dayjs().subtract(range, type).format(FORMAT_FULL_YEAR)
  }
}

export const convertTimezone = (dateTime, convert = 'UTC', format = 'YYYY-MM-DD HH:mm:ss') => {
  if (dateTime) {
    switch (convert) {
      case 'UTC':
        return dayjs.tz(dateTime, 'America/Los_Angeles').utc().format(format)
      case 'tz':
        return dayjs.utc(dateTime).tz().format(format)
      default:
        return dayjs(dateTime).format(format)
    }
  }
  return null
}

export const checkDistanceDateOfUSA = (dateTime) => {
  const year = dayjs(dateTime).get('year')
  const from = dayjs(year + '-03')
    .startOf('month')
    .day(7)
    .add(6, 'day')
    .format('YYYY-MM-DD')
  const to = dayjs(year + '-11')
    .startOf('month')
    .day(7)
    .add(1, 'day')
    .format('YYYY-MM-DD')
  return dayjs(dateTime).isBetween(from, to)
}

export const getCurrentMilliseconds = () => dayjs().valueOf()
export const getEndDateMilliSeconds = (date) => dayjs().endOf('day').valueOf()
