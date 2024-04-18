export const mappingOptions = (list) =>
  (list || [])?.map((item) => ({
    ...item,
    label: item?.adminTitle,
    value: item?.id
  })) || []

export const latestItem = (data) =>
  data?.reduce((max, current) => {
    const maxDate = max ? new Date(max?.createDateTime) : new Date(0)
    const currentDate = new Date(current?.createDateTime)

    return currentDate > maxDate ? current : max
  }, null)
