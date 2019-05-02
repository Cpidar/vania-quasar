import { LocalStorage } from 'quasar'
import Observable from 'obv'
import config from './config'

export const scaleObservable = Observable()
setObvWithInitValue('tempScale', scaleObservable, {
  min: config.temperatureScale.defaultLow,
  max: config.temperatureScale.defaultHigh
})

export const unitObservable = Observable()
unitObservable.set(config.temperatureScale.units)
scaleObservable((scale) => {
  const scaleRange = scale.max - scale.min
  if (scaleRange <= 3) {
    unitObservable.set(0.1)
  } else {
    unitObservable.set(0.5)
  }
})

export function saveTempScale(scale) {
  LocalStorage.set('tempScale', JSON.stringify(scale))
  scaleObservable.set(scale)
}

export const tempReminderObservable = Observable()
setObvWithInitValue('tempReminder', tempReminderObservable, {
  enabled: false
})

export function saveTempReminder(reminder) {
  LocalStorage.set('tempReminder', JSON.stringify(reminder))
  tempReminderObservable.set(reminder)
}

export const periodReminderObservable = Observable()
setObvWithInitValue('periodReminder', periodReminderObservable, {
  enabled: false
})

export function savePeriodReminder(reminder) {
  LocalStorage.set('periodReminder', JSON.stringify(reminder))
  periodReminderObservable.set(reminder)
}

export const useCervixObservable = Observable()
setObvWithInitValue('useCervix', useCervixObservable, false)

export function saveUseCervix(bool) {
  LocalStorage.set('useCervix', JSON.stringify(bool))
  useCervixObservable.set(bool)
}

export const hasEncryptionObservable = Observable()
setObvWithInitValue('hasEncryption', hasEncryptionObservable, false)

export function saveEncryptionFlag(bool) {
  LocalStorage.set('hasEncryption', JSON.stringify(bool))
  hasEncryptionObservable.set(bool)
}

export function getLicenseFlag() {
  return LocalStorage.getItem('agreedToLicense')
}

export function saveLicenseFlag() {
  LocalStorage.set('agreedToLicense', JSON.stringify(true))
}

function setObvWithInitValue(key, obv, defaultValue) {
  const result = LocalStorage.getItem(key)
  let value
  if (result) {
    value = JSON.parse(result)
  } else {
    value = defaultValue
  }
  obv.set(value)
}
