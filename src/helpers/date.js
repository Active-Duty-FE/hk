export const populateYearDropdown = (fromYear, toYear) => {
  const arrayYear = []
  // Loop and add the Year values to DropDownList.
  for (let i = toYear; i >= fromYear; i--) {
    arrayYear.push({ label: String(i), value: String(i) })
  }
  return arrayYear
}

export const populateDateDropdown = (yearDropdownField = null, monthDropdownField = null) => {
  const arrayDate = []
  const year = yearDropdownField
  const month = monthDropdownField

  // get the last day, so the number of days in that month
  const days = new Date(year, month, 0).getDate()

  // lets create the days of that month
  for (let d = 1; d <= days; d++) {
    arrayDate.push({
      label: d < 10 ? '0' + String(d) : String(d),
      value: d < 10 ? '0' + String(d) : String(d)
    })
  }

  return arrayDate
}

function createDateWithYearMonth(year, month) {
  return new Date(year, month - 1) // Subtract 1 from month to match JavaScript's 0-based index
}

export const checkFutureDate = (year, month) => {
  const cYear = new Date().getFullYear().toString().slice(-2) // Get the last two digits of the year
  const cMonth = (new Date().getMonth() + 1).toString().padStart(2, '0')
  const currentDate = createDateWithYearMonth(cYear, cMonth)
  const selectedDate = createDateWithYearMonth(year, month)
  if (month > 12 || month < 1) return false
  return selectedDate.getTime() > currentDate.getTime()
}
