const twoDigits = number => {
  if (number.toString().length < 2) return '0' + number.toString()
  else return number
}

export default {
  elapsed: totalTimeInSeconds => {
    const timeInMinutes = Math.floor(totalTimeInSeconds / 60)
    const timeInSeconds = totalTimeInSeconds % 60
    return twoDigits(timeInMinutes) + ':' + twoDigits(timeInSeconds)
  },

  actual: totalTimeInSeconds => {
    const timeInHours = Math.floor(totalTimeInSeconds / 3600)
    const timeInMinutes = Math.floor((totalTimeInSeconds % 3600) / 60)
    const timeInSeconds = (totalTimeInSeconds % 3600) % 60
    return twoDigits(timeInHours) + ':' + twoDigits(timeInMinutes) + ':' + twoDigits(timeInSeconds)
  },

  calculateTime: download => {
    if (download.other !== '') return download.other
    return download.finish - download.start
  },
}